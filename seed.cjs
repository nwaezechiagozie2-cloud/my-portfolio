const fs = require('fs');
const { execSync } = require('child_process');

const pyCode = `
from fastapi_backend.database import SessionLocal, engine
from fastapi_backend.models import Base, Profile, Project

Base.metadata.create_all(bind=engine)
db = SessionLocal()

profile = db.query(Profile).first()
if not profile:
    profile = Profile(id=1)
    db.add(profile)
profile.headline = "Modern Web Developer & Designer"
profile.about_me = "About me description Headline"
profile.contact_links = {"phone": "+91567800", "github": "https://github.com", "email": "dev@example.com"}
profile.stack = ["React", "FastAPI", "Tailwind", "Node.js"]
profile.experience = "Creating stunning, highly interactive web applications."

db.query(Project).delete()

p1 = Project(
    title="Sleek Mobile UI",
    short_description="Steest your app and halting cheskpart and projectional tracodes...",
    description="Showcasing high-quality mobile UI patterns and interaction designs.",
    display_pic="https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=600&auto=format&fit=crop",
    github_link="https://github.com",
    live_link="https://example.com"
)
p2 = Project(
    title="Data vs. Dashboard",
    short_description="Dashboard data visualization destors, and randter details...",
    description="A complex data analytics dashboard built with modern charting libraries.",
    display_pic="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    github_link="https://github.com",
    live_link="https://example.com"
)

db.add(p1)
db.add(p2)
db.commit()

print("Database actively seeded with new samples.")
`;

fs.writeFileSync('seed.py', pyCode);
console.log(execSync('python3 seed.py').toString());
