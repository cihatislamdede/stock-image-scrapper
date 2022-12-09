from bs4 import BeautifulSoup
import requests


class AdobeStockCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        query = query.replace(' ', '+')
        url = f'https://stock.adobe.com/tr/search/images?k={query}'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> dict:
        hyperlinks = soup.find_all(
            'a', {'class': 'js-search-result-thumbnail non-js-link'})
        images = {}
        for hl in hyperlinks:
            image = hl.find('meta', {'itemprop': 'contentUrl'})
            hyperlink = hl.find('meta', {'itemprop': 'acquireLicensePage'})
            images[image['content']] = hyperlink['content']
        return images
    
    def get_images(self, query: str) -> dict:
        soup = self.get_soup(query)
        images = self.parse_soup(soup)
        return images
