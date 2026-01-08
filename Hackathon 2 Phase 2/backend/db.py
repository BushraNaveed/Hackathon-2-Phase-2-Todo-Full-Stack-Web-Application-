from sqlmodel import create_engine, Session
from sqlalchemy import event
from sqlalchemy.pool import Pool
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/default_db")

# Create engine
engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

# Optional: Add connection pooling configuration
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set pragmas for database connections if needed."""
    pass