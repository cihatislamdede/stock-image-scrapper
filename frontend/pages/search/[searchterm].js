import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImages } from "../../utils/getImages";

export default function Seachterm() {
  const router = useRouter();
  const { searchterm } = router.query;
  const [imgUrls, setImgUrls] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      const res = await getImages(searchterm);
      try {
        setImgUrls(res.data);
        setLoading(false);

        let allImages = [];
        Object.keys(res.data).map((source) => {
          console.log("source:", source);
          Object.keys(res.data[source]).map((imgURL) => {
            //except freepik and adobe
            //all : adobestock, burst, freeimages, freepik, stocksnap, unsplash
            if (source === "burst") {
              allImages.push({
                url: "https://burst.shopify.com" + res.data[source][imgURL],
                img: imgURL,
              });
            } else if (source === "freeimages") {
              allImages.push({
                url: "https://www.freeimages.com" + res.data[source][imgURL],
                img: imgURL,
              });
            } else if (source === "stocksnap") {
              allImages.push({
                url: "https://stocksnap.io" + res.data[source][imgURL],
                img: imgURL,
              });
            } else if (source === "unsplash") {
              allImages.push({
                url: "https://unsplash.com" + res.data[source][imgURL],
                img: imgURL,
              });
            } else {
              allImages.push({
                url: res.data[source][imgURL],
                img: imgURL,
              });
            }
          });
        });

        const allShuffledImages = shuffleImages(allImages);
        setShuffledImages(allShuffledImages);

        console.log("shuffledImages", shuffledImages);
      } catch (error) {
        console.log(error);
      }
    };

    if (searchterm) {
      console.log("searchterm:", searchterm);
      try {
        fetchImages();
      } catch (error) {
        console.log(error);
      }
    }
  }, [searchterm]);

  const shuffleImages = (images) => {
    let currentIndex = images.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = images[currentIndex];
      images[currentIndex] = images[randomIndex];
      images[randomIndex] = temporaryValue;
    }
    return images;
  };

  return (
    <div>
      <h1>{loading ? "Loading" : "Loaded"}</h1>
      <button
        onClick={() => {
          console.log(imgUrls);
        }}
      >
        log
      </button>
      <div>
        {loading ? null : (
          <div>
            {shuffledImages.map((image) => (
              <div key={image.img}>
                <a href={image.url} target="_blank">
                  <img src={image.img} alt="" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
