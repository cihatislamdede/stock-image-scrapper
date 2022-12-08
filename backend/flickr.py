from bs4 import BeautifulSoup
import requests


class FlickrCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        query = query.replace(' ', '+')
        url = f'https://www.flickr.com/search/?text={query}&sort=relevance'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> list:
        divs = soup.find_all(
            'div', {'class': 'view photo-list-view requiredToShowOnServer'})
        images = [div.find('img')['src'] for div in divs[0]]
        images = [image.replace('//', 'https://') for image in images]
        return images


if __name__ == '__main__':
    freepik = FlickrCrawler()
    query = input('Search something: ')
    soup = freepik.get_soup(query)
    images = freepik.parse_soup(soup)
    for image in images:
        print(image)
