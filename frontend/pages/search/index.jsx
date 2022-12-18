import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImages, PAGE_SIZE } from "../../utils";

export default function Search() {
  const router = useRouter();

  const { q, exclude } = router.query;

  const [imgUrls, setImgUrls] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [paging, setPaging] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let allImages = [];
        const resdata = await getImages(q, exclude);
        console.log(resdata);
        Object.keys(resdata).map((source) => {
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
        setImgUrls(allImages);
        setShuffledImages(shuffleImages(allImages));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (q) {
      try {
        fetchImages();
      } catch (error) {
        console.log(error);
      }
    }
  }, [q]);

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

  if (loading) {
    return (
      <div className="bg-gray-900 flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500"></div>
        <p className="text-2xl font-semibold text-slate-400 mt-4">
          Loading images...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <div className="flex flex-row justify-center ">
        {
          //create buttons per {PAGE_SIZE} image
          shuffledImages.length > 0
            ? Array.from(
                { length: Math.ceil(shuffledImages.length / PAGE_SIZE) },
                (v, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setPaging(page);
                  }}
                  className={`rounded-md border-2 w-12 h-12 border-slate-800 bg-slate-50  font-semibold text-slate-800 transition-all p-2 m-2 ${
                    paging === page ? "bg-purple-200" : "hover:bg-purple-400"
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
              .slice((paging - 1) * PAGE_SIZE, paging * PAGE_SIZE)
              .map((image) => (
                <div key={image.img} className="w-48 h-48 rounded-md">
                  <a href={image.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={image.img}
                      alt={q}
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
