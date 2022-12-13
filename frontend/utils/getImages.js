import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";
const SOURCES = ["stocksnap", "adobestock", "burst", "freepik", "unsplash"];

export const getImages = async (query, exclude) => {
  exclude = exclude || [];
  let data = {};
  Promise.all(
    SOURCES.map(async (source) => {
      if (exclude.includes(source)) return;
      const response = await axios.get(
        `${BASE_URL}/search/${source}?q=${query}`
      );
      data[source] = response.data;
    })
  ).then(() => {
    console.log("data", data);
    return data;
  });
};
