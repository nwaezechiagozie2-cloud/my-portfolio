from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from . import models, schemas
from .database import engine, get_db

# Create tables matching Alembic functionality for simplicity in initial run
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"role": "admin"}


# AUTH
@app.post("/app/auth/login", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest):
    if request.password == ADMIN_PASSWORD:
        return {"access_token": request.password, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid password")


# PROFILE
@app.get("/app/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(id=1, headline="New Portfolio", about_me="Update me.")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/app/profile")
def update_profile(profile_update: schemas.ProfileBase, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(id=1)
        db.add(profile)
        
    for key, value in profile_update.dict().items():
        setattr(profile, key, value)
        
    db.commit()
    return {"success": True}


# POSTS
@app.get("/app/posts", response_model=List[schemas.ProjectResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/app/posts/{project_id}", response_model=schemas.ProjectResponse)
def get_post(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/app/posts", response_model=schemas.ProjectResponse)
def create_post(post: schemas.ProjectBase, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_project = models.Project(**post.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/app/posts/{project_id}")
def update_post(project_id: int, post: schemas.ProjectBase, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    for key, value in post.dict().items():
        setattr(db_project, key, value)
        
    db.commit()
    return {"success": True}

@app.delete("/app/posts/{project_id}")
def delete_post(project_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"success": True}
