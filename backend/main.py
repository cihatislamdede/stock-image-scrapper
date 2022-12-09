from fastapi import FastAPI
from crawlers.adobestock import AdobeStockCrawler
from crawlers.burst import BurstCrawler
from crawlers.freeimages import FreeImagesCrawler
from crawlers.freepik import FreepikCrawler
from crawlers.stocksnap import StockSnapCrawler
from crawlers.unsplash import UnsplashCrawler

app = FastAPI()

@app.get("/images/search")
async def images(q: str, exclude: str = None):
    if exclude is not None:
        exclude = exclude.split(" ") 
    else:
        exclude = []
    response = {}
    if "adobestock" not in exclude:
        response["adobestock"] = AdobeStockCrawler().get_images(query=q)
    if "burst" not in exclude:
        response["burst"] = BurstCrawler().get_images(query=q)
    if "freeimages" not in exclude:
        response["freeimages"] = FreeImagesCrawler().get_images(query=q)
    if "freepik" not in exclude:
        response["freepik"] = FreepikCrawler().get_images(query=q)
    if "stocksnap" not in exclude:
        response["stocksnap"] = StockSnapCrawler().get_images(query=q)
    if "unsplash" not in exclude:
        response["unsplash"] = UnsplashCrawler().get_images(query=q)
    
    return {"status": "success", "data": response}