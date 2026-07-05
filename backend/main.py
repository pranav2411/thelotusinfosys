import os
import shutil
import random
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional

from database import init_db, get_db, Product, Enquiry, ServiceToken
from pydantic import BaseModel

class EnquiryCreate(BaseModel):
    name: str
    phone: str
    message: str
    email: Optional[str] = None

class ServiceTokenCreate(BaseModel):
    customer_name: str
    phone: str
    email: Optional[str] = None
    device_model: str
    issue_description: str

app = FastAPI(title="The Lotus Infosys API", version="1.0.0")

# Enable CORS for Next.js frontend development and cloud deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure directories exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the static files directory to access product images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize database tables and seed data on startup
from database import SessionLocal

@app.on_event("startup")
def startup_event():
    init_db()
    
    # Seed sample products if none exist
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            sample_products = [
                Product(
                    name="TallyPrime Gold Edition",
                    description="Multi-user business management and accounting software for medium and large enterprises. Includes lifetime license and 1-year Tally Software Services support.",
                    price=54000.0,
                    category="Software",
                    image_url=None
                ),
                Product(
                    name="Prodot Fusion Wireless Combo",
                    description="Ergonomic, high-precision wireless keyboard and mouse combo. Long battery life, 2.4GHz connectivity, and spill-resistant design. Ideal for office work.",
                    price=1250.0,
                    category="Peripherals",
                    image_url=None
                ),
                Product(
                    name="Numeric 600EX Micro UPS",
                    description="600VA Line Interactive UPS offering reliable backup power for office desktops and Wi-Fi routers. Features automatic voltage regulation.",
                    price=3200.0,
                    category="Hardware",
                    image_url=None
                ),
                Product(
                    name="HP Laserjet Toner Cartridge (12A)",
                    description="Genuine HP laser toner cartridge for sharp, clear black-and-white printing. High yield up to 2000 standard pages.",
                    price=4500.0,
                    category="Peripherals",
                    image_url=None
                ),
                Product(
                    name="HDMI High-Speed Extension Cable (5M)",
                    description="Gold-plated, heavy-duty HDMI extension cable supporting 4K UHD resolution, 3D video formats, and audio return channel.",
                    price=450.0,
                    category="Cables",
                    image_url=None
                )
            ]
            db.add_all(sample_products)
            db.commit()
            print("Successfully seeded database with sample products!")
    finally:
        db.close()

# Placeholder for background removal
def process_product_image(input_path: str, output_filename: str) -> str:
    """
    Process the uploaded image. Currently, it saves it directly (bypassing rembg as requested).
    To enable background removal later, you can import and call rembg here.
    """
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    shutil.copy(input_path, output_path)
    return f"/uploads/{output_filename}"

# --- Health Check ---
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# --- Products API ---
@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    return products

@app.post("/api/products")
async def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    final_image_url = None
    
    if image_url and image_url.strip():
        final_image_url = image_url.strip()
    elif image:
        # Save temporary file
        temp_filename = f"temp_{random.randint(1000, 9999)}_{image.filename}"
        temp_path = os.path.join(UPLOAD_DIR, temp_filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Save processed image (placeholder for background removal)
        final_filename = f"prod_{int(datetime.utcnow().timestamp())}_{image.filename}"
        try:
            final_image_url = process_product_image(temp_path, final_filename)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    new_product = Product(
        name=name,
        description=description,
        price=price,
        category=category,
        image_url=final_image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete image file from server if it exists
    if product.image_url:
        filepath = product.image_url.lstrip("/")
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception:
                pass
                
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# --- Enquiries API ---
@app.post("/api/enquiries")
def create_enquiry(
    payload: EnquiryCreate,
    db: Session = Depends(get_db)
):
    new_enquiry = Enquiry(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        message=payload.message
    )
    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)
    return {"message": "Enquiry submitted successfully", "id": new_enquiry.id}

@app.get("/api/enquiries")
def list_enquiries(db: Session = Depends(get_db)):
    enquiries = db.query(Enquiry).order_by(Enquiry.created_at.desc()).all()
    return enquiries

@app.patch("/api/enquiries/{enquiry_id}")
def update_enquiry_status(enquiry_id: int, status: str, db: Session = Depends(get_db)):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = status
    db.commit()
    return enquiry

# --- Service Tokens API ---
@app.post("/api/tokens")
def create_service_token(
    payload: ServiceTokenCreate,
    db: Session = Depends(get_db)
):
    # Generate unique token number LOTUS-2026-XXXX
    count = db.query(ServiceToken).count()
    token_number = f"LOTUS-2026-{1001 + count}"
    
    new_token = ServiceToken(
        token_number=token_number,
        customer_name=payload.customer_name,
        phone=payload.phone,
        email=payload.email,
        device_model=payload.device_model,
        issue_description=payload.issue_description
    )
    db.add(new_token)
    db.commit()
    db.refresh(new_token)
    return new_token

@app.get("/api/tokens")
def list_service_tokens(db: Session = Depends(get_db)):
    tokens = db.query(ServiceToken).order_by(ServiceToken.created_at.desc()).all()
    return tokens

@app.get("/api/tokens/{token_number}")
def get_service_token_by_number(token_number: str, db: Session = Depends(get_db)):
    token = db.query(ServiceToken).filter(ServiceToken.token_number == token_number.upper()).first()
    if not token:
        raise HTTPException(status_code=404, detail="Service token not found")
    return token

@app.patch("/api/tokens/{token_id}")
def update_service_token_status(token_id: int, status: str, db: Session = Depends(get_db)):
    token = db.query(ServiceToken).filter(ServiceToken.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Service token not found")
    token.status = status
    db.commit()
    return token
