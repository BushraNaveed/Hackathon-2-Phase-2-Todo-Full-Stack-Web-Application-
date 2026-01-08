from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 7  # 7 days

# Initialize security scheme
security = HTTPBearer()

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a new access token with the provided data.
    This mimics the token format that Better Auth would generate.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[TokenData]:
    """
    Verify the JWT token and return the token data.
    This function parses the token similar to how Better Auth would format it.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Extract user info from token (Better Auth format)
        user_id: str = payload.get("userId") or payload.get("sub")
        email: str = payload.get("email")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token_data = TokenData(user_id=user_id, email=email)
        return token_data
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get the current user from the token in the Authorization header.
    This function can be used as a dependency to protect routes.
    """
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_data


def verify_user_access(user_id_from_token: str, user_id_from_request: str) -> bool:
    """
    Verify that the user making the request is the owner of the resource.
    This ensures user isolation - users can only access their own data.
    """
    return user_id_from_token == user_id_from_request