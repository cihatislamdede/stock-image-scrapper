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

    def parse_soup(self, soup: BeautifulSoup) -> dict:
        divs = soup.find_all(
            'div', {'class': 'pr-0 md:pr-2 masonry-container'})
        sub_divs = divs[0].find_all(
            'div', {'class': 'w-full h-full relative group'})
        images = {}
        for sub_div in sub_divs:
            try:
                # https://www.freeimages.com + hyperlink
                hyperlink = sub_div.find_all(
                    'a', {'class': 'flex h-full items-end px-4 py-3'})[0]
                image = sub_div.find_all('img')[0]['data-src']
                images[image] = hyperlink['href']
            except AttributeError:
                continue
            except IndexError:
                continue
        return images


if __name__ == '__main__':
    crawler = FreeImagesCrawler()
    query = input('Search something: ')
    soup = crawler.get_soup(query)
    images = crawler.parse_soup(soup)
    for image, hyperlink in images.items():
        print(image, hyperlink)
