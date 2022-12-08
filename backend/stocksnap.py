from bs4 import BeautifulSoup
import requests


class FreeImagesCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        query = query.replace(' ', '+')
        url = f'https://stocksnap.io/search/{query}'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> list:
        divs = soup.find_all('div', class_='photo-grid-item')
        images = [div.find('img')['src'] for div in divs]
        images.pop(0)
        images.pop()
        return images


if __name__ == '__main__':
    freepik = FreeImagesCrawler()
    query = input('Search something: ')
    soup = freepik.get_soup(query)
    freepik.parse_soup(soup)
