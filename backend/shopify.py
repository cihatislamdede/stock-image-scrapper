from bs4 import BeautifulSoup
import requests

url = 'https://burst.shopify.com/photos/search?q=cat'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# only get divs with id search-photos-route
divs = soup.find_all('div', {'class': 'js-masonry-grid'})
# inside divs divs with class name ratio-box
# divimages = divs[0].find_all('div', {'class': 'ratio-box'})
# images
images = [img['src'] for img in divs[0].find_all('img')]
for img in images:
    print(img)
print(len(images))
