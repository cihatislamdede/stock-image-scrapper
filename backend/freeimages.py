from bs4 import BeautifulSoup
import requests


class FreeImagesCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        query = query.replace(' ', '-')
        url = f'https://www.freeimages.com/search/{query}'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> list:
        divs = soup.find_all('div', {'class': 'pr-0 md:pr-2 masonry-container'})
        image_divs = divs[0].find_all('div', {'class': 'grid-image-wrapper w-full h-full'})
        images = []
        for div in image_divs:
            image = div.find('img')
            if image["src"] != "#":
                images.append(image['src'])
        return images


if __name__ == '__main__':
    freepik = FreeImagesCrawler()
    query = input('Search something: ')
    soup = freepik.get_soup(query)
    images = freepik.parse_soup(soup)
    for image in images:
        print(image)
