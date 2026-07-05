import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Dynamically pick SQLite or cloud-provided PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lotus_infosys.db")

# Convert standard legacy Heroku/Render/Railway 'postgres://' to 'postgresql://' required by SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    category = Column(String(50), nullable=True)
    image_url = Column(String(255), nullable=True)  # URL to direct/processed image
    created_at = Column(DateTime, default=datetime.utcnow)

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="New")  # "New", "Responded"
    created_at = Column(DateTime, default=datetime.utcnow)

class ServiceToken(Base):
    __tablename__ = "service_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token_number = Column(String(20), unique=True, index=True, nullable=False)  # e.g., LOTUS-2026-1001
    customer_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    device_model = Column(String(100), nullable=False)  # e.g. "HP Pavilion Laptop"
    issue_description = Column(Text, nullable=False)
    status = Column(String(50), default="Pending")  # "Pending", "Under Diagnostics", "Repairing", "Ready for Pickup", "Delivered"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
