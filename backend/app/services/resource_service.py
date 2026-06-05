import os
import requests
from typing import List, Dict
from dotenv import load_dotenv


load_dotenv()
import sys

print("PYTHON:", sys.executable)

# Get API keys from environment
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY", "")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")


def search_youtube_videos(query: str, max_results: int = 10) -> List[Dict]:
    """
    Search YouTube for videos related to the query.
    Returns list of video results with title, description, link, and thumbnail.
    """
    if not YOUTUBE_API_KEY:
        return []
    
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "q": query,
            "part": "snippet",
            "type": "video",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY,
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        videos = []
        
        for item in data.get("items", []):
            video = {
                "type": "video",
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel": item["snippet"]["channelTitle"],
                "source": "YouTube"
            }
            videos.append(video)
        
        return videos
    except Exception as e:
        print(f"YouTube API error: {e}")
        return []




import requests
from bs4 import BeautifulSoup
from typing import Dict


    

   
import requests
from typing import List, Dict

import time
import requests

def search_wikipedia(query: str, max_results: int = 5) -> List[Dict]:
    try:
        url = "https://en.wikipedia.org/w/api.php"

        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json",
            "srlimit": max_results
        }

        headers = {
            "User-Agent": "DataAnalystLearningBot/1.0 (your-email@example.com)"
        }

        data = None

        for attempt in range(5):
            response = requests.get(
                url,
                params=params,
                headers=headers,
                timeout=10
            )

            if response.status_code == 429:
                wait_time = 2 ** attempt
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            data = response.json()
            break

        if not data:
            return []

        results = []

        for item in data.get("query", {}).get("search", []):
            results.append({
                "type": "webpage",
                "title": item.get("title", ""),
                "snippet": item.get("snippet", ""),
                "url": f"https://en.wikipedia.org/wiki/{item.get('title', '').replace(' ', '_')}",
                "source": "Wikipedia"
            })

        return results

    except Exception as e:
        print(f"Wikipedia API error: {e}")
        return []
def search_resources(query: str, include_videos: bool = True, 
                    include_webpages: bool = True, 
                    include_wikipedia: bool = True) -> Dict:
    """
    Search for resources across multiple platforms.
    Returns combined results organized by type.
    """
    results = {
        "query": query,
        "videos": [],
        "webpages": [],
        "total": 0
    }
    
    if include_videos:
        results["videos"] = search_youtube_videos(query, max_results=8)
    
    
    if include_wikipedia:
        wiki_results = search_wikipedia(query, max_results=5)
        results["webpages"].extend(wiki_results)
    
    results["total"] = len(results["videos"]) + len(results["webpages"])
    
    return results
