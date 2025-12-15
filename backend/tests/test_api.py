"""Basic API tests."""

import pytest


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test API root returns expected response."""
    response = await client.get("/api/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data


@pytest.mark.asyncio
async def test_health_endpoint(client):
    """Test health check endpoint."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
