"""
search_service.py
─────────────────────────────────────────────────────────────
Web search using Serper API (Google Search).
Called when ChromaDB has no relevant results for a question.
─────────────────────────────────────────────────────────────
"""

import logging
import httpx
from backend.config import get_settings

log = logging.getLogger(__name__)


async def web_search(query: str, num_results: int = 5) -> list[dict]:
    """
    Search the web using Serper API.
    Returns a list of results with title, snippet, and link.
    """
    settings = get_settings()

    if not settings.serper_api_key:
        log.warning("Serper API key not set — skipping web search")
        return []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://google.serper.dev/search",
                headers={
                    "X-API-KEY": settings.serper_api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "q": f"{query} Uganda medicine health",
                    "num": num_results,
                    "gl": "ug",   # Uganda region
                    "hl": "en",   # English
                },
                timeout=10.0,
            )

            data = response.json()

            results = []
            for item in data.get("organic", []):
                results.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", ""),
                    "link": item.get("link", ""),
                })

            log.info(f"Web search for '{query}' returned {len(results)} results")
            return results

    except Exception as e:
        log.error(f"Serper search error: {e}")
        return []


def format_search_results(results: list[dict]) -> str:
    """
    Format search results into a string for the AI to use as context.
    """
    if not results:
        return ""

    formatted = "Web search results:\n\n"
    for i, result in enumerate(results, 1):
        formatted += f"{i}. {result['title']}\n"
        formatted += f"   {result['snippet']}\n"
        formatted += f"   Source: {result['link']}\n\n"

    return formatted
