import axios from "axios";

const BASE_URL = "https://bgf0ev.deta.dev";

export const SOURCES = [
  "stocksnap",
  "adobestock",
  "burst",
  "freepik",
  "freeimages",
  "unsplash",
];
export const PAGE_SIZE = 50;

export const getImages = async (query, exclude) => {
  exclude = exclude ? exclude.split(" ") : [];
  query = query.replace(" ", "+");
  let data = {};
  await Promise.all(
    SOURCES.map(async (source) => {
      if (exclude.includes(source)) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/search/${source}?q=${query}`
        );
        data[source] = response.data;
      } catch (error) {
        console.log(error);
      }
    })
  );
  return data;
};
