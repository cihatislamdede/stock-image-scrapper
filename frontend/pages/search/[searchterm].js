import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImages } from "../../utils/getImages";

const pageLength = 50;

export default function Seachterm() {
  const router = useRouter();
  const { searchterm, exclude } = router.query;
  const [imgUrls, setImgUrls] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [paging, setPaging] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        let toexclude = [];
        if (exclude) {
          toexclude = exclude.split(",");
        }
        let allImages = [];
        const resdata = await getImages(searchterm, toexclude);
        console.log("resdata", resdata);
        Object.keys(resdata).map((source) => {
          console.log("source:", source);
          Object.keys(resdata[source]).map((imgURL) => {
            //except freepik and adobe
            //all : adobestock, burst, freeimages, freepik, stocksnap, unsplash
            if (source === "burst") {
              allImages.push({
                url: "https://burst.shopify.com" + resdata[source][imgURL],
                img: imgURL,
              });
            } else if (source === "freeimages") {
              allImages.push({
                url: "https://www.freeimages.com" + resdata[source][imgURL],
                img: imgURL,
              });
            } else if (source === "stocksnap") {
              allImages.push({
                url: "https://stocksnap.io" + resdata[source][imgURL],
                img: imgURL,
              });
            } else if (source === "unsplash") {
              allImages.push({
                url: "https://unsplash.com" + resdata[source][imgURL],
                img: imgURL,
              });
            } else {
              allImages.push({
                url: resdata[source][imgURL],
                img: imgURL,
              });
            }
          });
        });
        console.log("allImages:", allImages);
        setImgUrls(allImages);
        setShuffledImages(shuffleImages(allImages));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (searchterm) {
      console.log("searchterm:", searchterm);
      console.log("exclude:", exclude);
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
      <p>
        Total Images:{" "}
        <span>
          {loading ? (
            <span className="animate-pulse">Loading</span>
          ) : (
            shuffledImages.length
          )}
        </span>
      </p>
      <div className="flex flex-row justify-center ">
        {
          //create buttons per {pageLength} image
          shuffledImages.length > 0
            ? Array.from(
                { length: Math.ceil(shuffledImages.length / pageLength) },
                (v, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setPaging(page);
                  }}
                  className={`rounded-md border-2 w-12 h-12 border-slate-800 bg-slate-50  font-semibold text-slate-800 transition-all p-2 m-2 ${
                    paging === page ? "bg-green-200" : "hover:bg-slate-200"
                  }`}
                >
                  {page}
                </button>
              ))
            : null
        }
      </div>
      <div className="flex flex-wrap max-w-5xl justify-center mx-auto gap-2">
        {shuffledImages.length > 0
          ? shuffledImages
              .slice((paging - 1) * pageLength, paging * pageLength)
              .map((image) => (
                <div key={image.img} className="w-48 h-48 rounded-md">
                  <a href={image.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={image.img}
                      alt={searchterm}
                      loading="lazy"
                      className="rounded-md w-48 h-48 object-scale-down"
                    />
                  </a>
                </div>
              ))
          : null}
      </div>
    </div>
  );
}
