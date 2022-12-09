from bs4 import BeautifulSoup
import requests


class FreepikCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'}

    def get_soup(self, query: str) -> BeautifulSoup:
        url = f'https://www.freepik.com/search?format=search&query={query}&type=photo'
        response = requests.get(url, headers=self.headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup

    def parse_soup(self, soup: BeautifulSoup) -> dict:
        # get sections
        sections = soup.find_all('section', {'class': 'showcase'})
        # get figures
        figures = [figure for figure in sections[0].find_all(
            'figure', {"class": "showcase__item"})]
        images = {}
        for figure in figures:
            hyperlink = figure.find(
                'a', {'class': 'showcase__link js-detail-data-link'})
            images[figure['data-image']] = hyperlink['href']
        return images

    def get_images(self, query: str) -> dict:
        soup = self.get_soup(query)
        images = self.parse_soup(soup)
        return images