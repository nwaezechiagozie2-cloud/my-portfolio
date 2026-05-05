from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProfileBase(BaseModel):
    headline: Optional[str] = None
    about_me: Optional[str] = None
    stack: Optional[List[str]] = []
    experience: Optional[str] = None
    contact_links: Optional[Dict[str, str]] = {}
    chat_enabled: Optional[bool] = True

class ProfileResponse(ProfileBase):
    id: int
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    short_description: str
    description: str
    github_link: Optional[str] = ""
    live_link: Optional[str] = ""
    display_pic: Optional[str] = ""
    additional_media: Optional[List[str]] = []

class ProjectResponse(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
