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
        hyperlinks = soup.find_all('a', {'class': 'js-search-result-thumbnail non-js-link'})
        images = {}
        for hl in hyperlinks:
            image = hl.find('meta', {'itemprop': 'contentUrl'})
            hyperlink = hl.find('meta', {'itemprop': 'acquireLicensePage'})
            images[image['content']] = hyperlink['content']
        return images          
        


if __name__ == '__main__':
    crawler = AdobeStockCrawler()
    query = input('Search something: ')
    soup = crawler.get_soup(query)
    images = crawler.parse_soup(soup)
    for image, hyperlink in images.items():
        print(image, hyperlink)
