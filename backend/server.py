from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv
import os
import uuid
import logging
import secrets
import string

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'funkfest-frenzy-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class UserSignUp(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    college: str
    course: str
    password: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class EventCreate(BaseModel):
    name: str
    description: str
    date: str
    location: str
    price: float
    max_participants: int
    image_url: Optional[str] = None

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    max_participants: Optional[int] = None
    image_url: Optional[str] = None

class EventRegistration(BaseModel):
    event_id: str
    payment_amount: float

# Utility Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_ticket_code() -> str:
    """Generate a random 8-character ticket code"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

async def check_admin_role(user_id: str = Depends(get_current_user)):
    user_role = await db.user_roles.find_one({"user_id": user_id, "role": "admin"})
    if not user_role:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_id

# Auth Endpoints
@api_router.post("/auth/signup")
async def signup(user: UserSignUp):
    try:
        existing_user = await db.profiles.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user.password)
        
        profile_data = {
            "id": user_id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "college": user.college,
            "course": user.course,
            "password": hashed_password,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.profiles.insert_one(profile_data)
        
        # Assign student role by default
        role_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "role": "student",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_roles.insert_one(role_data)
        
        access_token = create_access_token({"sub": user_id, "email": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "full_name": user.full_name,
                "email": user.email
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@api_router.post("/auth/signin")
async def signin(user: UserSignIn):
    try:
        db_user = await db.profiles.find_one({"email": user.email})
        if not db_user or not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check if user is admin
        admin_role = await db.user_roles.find_one({"user_id": db_user["id"], "role": "admin"})
        
        access_token = create_access_token({"sub": db_user["id"], "email": db_user["email"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "full_name": db_user["full_name"],
                "email": db_user["email"],
                "is_admin": bool(admin_role)
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Signin error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/auth/me")
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    try:
        user = await db.profiles.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user is admin
        admin_role = await db.user_roles.find_one({"user_id": user_id, "role": "admin"})
        user["is_admin"] = bool(admin_role)
        
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user profile")

# Event Endpoints
@api_router.get("/events")
async def get_all_events():
    try:
        events = await db.events.find({}, {"_id": 0}).to_list(1000)
        return events
    except Exception as e:
        logger.error(f"Get events error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch events")

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    try:
        event = await db.events.find_one({"id": event_id}, {"_id": 0})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return event
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get event error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch event")

@api_router.post("/events")
async def create_event(event: EventCreate, user_id: str = Depends(check_admin_role)):
    try:
        event_id = str(uuid.uuid4())
        event_data = {
            "id": event_id,
            "name": event.name,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "price": event.price,
            "max_participants": event.max_participants,
            "image_url": event.image_url,
            "created_by": user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.events.insert_one(event_data)
        del event_data["_id"]
        return event_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Create event error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create event")

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, event: EventUpdate, user_id: str = Depends(check_admin_role)):
    try:
        existing_event = await db.events.find_one({"id": event_id})
        if not existing_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        update_data = {k: v for k, v in event.dict(exclude_unset=True).items()}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        await db.events.update_one({"id": event_id}, {"$set": update_data})
        
        updated_event = await db.events.find_one({"id": event_id}, {"_id": 0})
        return updated_event
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Update event error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update event")

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user_id: str = Depends(check_admin_role)):
    try:
        result = await db.events.delete_one({"id": event_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Delete event error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete event")

# Registration Endpoints
@api_router.post("/registrations")
async def register_for_event(registration: EventRegistration, user_id: str = Depends(get_current_user)):
    try:
        # Check if event exists
        event = await db.events.find_one({"id": registration.event_id})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Check if already registered
        existing = await db.event_registrations.find_one({
            "event_id": registration.event_id,
            "user_id": user_id
        })
        if existing:
            raise HTTPException(status_code=400, detail="Already registered for this event")
        
        # Check capacity
        registration_count = await db.event_registrations.count_documents({"event_id": registration.event_id})
        if registration_count >= event["max_participants"]:
            raise HTTPException(status_code=400, detail="Event is at maximum capacity")
        
        # Generate unique ticket code
        ticket_code = generate_ticket_code()
        
        # Check uniqueness (very unlikely to collide, but good practice)
        while await db.event_registrations.find_one({"ticket_code": ticket_code}):
            ticket_code = generate_ticket_code()
        
        registration_data = {
            "id": str(uuid.uuid4()),
            "event_id": registration.event_id,
            "user_id": user_id,
            "payment_status": "completed",
            "payment_amount": registration.payment_amount,
            "ticket_code": ticket_code,
            "registered_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.event_registrations.insert_one(registration_data)
        del registration_data["_id"]
        return registration_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@api_router.get("/registrations/my-tickets")
async def get_my_tickets(user_id: str = Depends(get_current_user)):
    try:
        registrations = await db.event_registrations.find(
            {"user_id": user_id},
            {"_id": 0}
        ).to_list(1000)
        
        # Enrich with event details
        for reg in registrations:
            event = await db.events.find_one({"id": reg["event_id"]}, {"_id": 0})
            if event:
                reg["event"] = event
        
        return registrations
    except Exception as e:
        logger.error(f"Get tickets error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch tickets")

@api_router.get("/registrations/event/{event_id}")
async def get_event_registrations(event_id: str, user_id: str = Depends(check_admin_role)):
    try:
        registrations = await db.event_registrations.find(
            {"event_id": event_id},
            {"_id": 0}
        ).to_list(1000)
        
        # Enrich with user details
        for reg in registrations:
            user = await db.profiles.find_one(
                {"id": reg["user_id"]},
                {"_id": 0, "full_name": 1, "email": 1, "phone": 1}
            )
            if user:
                reg["user"] = user
        
        return registrations
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get registrations error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch registrations")

# Admin Stats
@api_router.get("/admin/stats")
async def get_admin_stats(user_id: str = Depends(check_admin_role)):
    try:
        total_events = await db.events.count_documents({})
        total_registrations = await db.event_registrations.count_documents({})
        total_revenue = await db.event_registrations.aggregate([
            {"$group": {"_id": None, "total": {"$sum": "$payment_amount"}}}
        ]).to_list(1)
        
        revenue = total_revenue[0]["total"] if total_revenue else 0
        
        return {
            "total_events": total_events,
            "total_registrations": total_registrations,
            "total_revenue": revenue
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Get stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
