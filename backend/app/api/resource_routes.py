from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.core.deps import get_current_user
from app.services.resource_service import search_resources

router = APIRouter()


class ResourceSearchRequest(BaseModel):
    query: str
    include_videos: bool = True
    include_webpages: bool = True
    include_wikipedia: bool = True


@router.get("/search")
def search(
    q: str = Query(..., description="Search query"),
    include_videos: bool = Query(True, description="Include YouTube videos"),
    include_webpages: bool = Query(True, description="Include webpages"),
    include_wikipedia: bool = Query(True, description="Include Wikipedia"),
    current_user=Depends(get_current_user),
):
    """
    Search for educational resources by topic.
    Returns videos from YouTube and webpages from Google Search and Wikipedia.
    """
    results = search_resources(
        query=q,
        include_videos=include_videos,
        include_webpages=include_webpages,
        include_wikipedia=include_wikipedia,
    )
    
    return results


@router.post("/search")
def search_post(
    request: ResourceSearchRequest,
    current_user=Depends(get_current_user),
):
    """
    Search for educational resources by topic (POST variant).
    """
    results = search_resources(
        query=request.query,
        include_videos=request.include_videos,
        include_webpages=request.include_webpages,
        include_wikipedia=request.include_wikipedia,
    )
    
    return results
