import axios from "axios";

export const getImages = async (term, exclude) => {
  const baseURL = "http://127.0.0.1:8000/images/search?q=";

  let url = baseURL + term;
  if (exclude) {
    url += "&exclude=" + exclude;
  }
  const res = await axios.get(url);
  return res.data;
};
