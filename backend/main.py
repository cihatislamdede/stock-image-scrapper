from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

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
    allow_origins=["http://localhost:3000",
                   "https://stock-image-scrapper.vercel.app"],
    allow_methods=["GET"],
)

@app.get("/")
def root():
    return RedirectResponse(url="/docs")


@app.get("/search")
def images(q: str, exclude: list = []):
    if exclude != []:
        exclude = exclude.split("+")
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

    return response


@app.get("/search/adobestock")
def adobestock(q: str):
    try:
        response = AdobeStockCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response


@app.get("/search/burst")
def burst(q: str):
    try:
        response = BurstCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response


@app.get("/search/freeimages")
def freeimages(q: str):
    try:
        response = FreeImagesCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response


@app.get("/search/freepik")
def freepik(q: str):
    try:
        response = FreepikCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response


@app.get("/search/stocksnap")
def stocksnap(q: str):
    try:
        response = StockSnapCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response


@app.get("/search/unsplash")
def unsplash(q: str):
    try:
        response = UnsplashCrawler().get_images(query=q)
    except IndexError:
        response = []
    return response
