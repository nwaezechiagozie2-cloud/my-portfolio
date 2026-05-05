from sqlalchemy import Column, Integer, String, Text, Boolean, JSON
from .database import Base

class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(255))
    about_me = Column(Text)
    stack = Column(JSON)
    experience = Column(Text)
    contact_links = Column(JSON)
    chat_enabled = Column(Boolean, default=True)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    short_description = Column(String(500))
    description = Column(Text)
    github_link = Column(String(255), nullable=True)
    live_link = Column(String(255), nullable=True)
    display_pic = Column(String(255), nullable=True)
    additional_media = Column(JSON, default=[])
