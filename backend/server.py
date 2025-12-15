"""
Legacy entry point - redirects to new application structure.

For development, use: uvicorn app.main:app --reload --port 8000
"""

from app.main import app

__all__ = ["app"]