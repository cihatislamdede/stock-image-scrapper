from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from crawlers.adobestock import AdobeStockCrawler
from crawlers.burst import BurstCrawler
from crawlers.freeimages import FreeImagesCrawler
from crawlers.freepik import FreepikCrawler
from crawlers.stocksnap import StockSnapCrawler
from crawlers.unsplash import UnsplashCrawler

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/images/search")
async def images(q: str, exclude: str = None):
    if exclude is not None:
        exclude = exclude.split("+") 
    else:
        exclude = []
    response = {}
    if "adobestock" not in exclude:
        try:
            response["adobestock"] = AdobeStockCrawler().get_images(query=q)
        except IndexError:
            response["adobestock"] = []
    if "burst" not in exclude:
        try:
            response["burst"] = BurstCrawler().get_images(query=q)
        except IndexError:
            response["burst"] = []
    if "freeimages" not in exclude:
        try:
            response["freeimages"] = FreeImagesCrawler().get_images(query=q)
        except IndexError:
            response["freeimages"] = []
    if "freepik" not in exclude:
        try:
            response["freepik"] = FreepikCrawler().get_images(query=q)
        except IndexError:
            response["freepik"] = []
    if "stocksnap" not in exclude:
        try:
            response["stocksnap"] = StockSnapCrawler().get_images(query=q)
        except IndexError:
            response["stocksnap"] = []
    if "unsplash" not in exclude:
        try:
            response["unsplash"] = UnsplashCrawler().get_images(query=q)
        except IndexError:
            response["unsplash"] = []
    
    return {"status": "success", "data": response}