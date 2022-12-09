from bs4 import BeautifulSoup
import requests


class BurstCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        query = query.replace(' ', '+')
        url = f'https://burst.shopify.com/photos/search?q={query}'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> dict:
        divs = soup.find_all('div', {'class': 'photo-tile'})
        images = {}
        for div in divs:
            image = div.find('img')
            hyperlink = div.find('a')
            # "https://burst.shopify.com" + hyperlink['href'] for full url
            images[image['src']] = hyperlink['href']
        return images


if __name__ == '__main__':
    crawler = BurstCrawler()
    query = input('Search something: ')
    soup = crawler.get_soup(query)
    images = crawler.parse_soup(soup)
    for image, hyperlink in images.items():
        print(image, hyperlink)
