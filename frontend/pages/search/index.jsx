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

  console.log(shuffledImages);

  return (
    <div className="bg-gray-900">
      {/* back button to search page */}
      <div className="flex flex-row justify-center">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="rounded-md border-2 w-24 h-12 border-slate-800 bg-slate-50  font-semibold text-slate-800 p-2 m-2 hover:bg-purple-400 transition-all"
        >
          Back
        </button>
      </div>
      <p className="text-2xl font-semibold text-center italic text-slate-400">
        {q} results <br/> ({shuffledImages.length} images)
      </p>
      <div className="grid gap-6 row-gap-5 mb-8 px-16 py-8 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-3">
        {shuffledImages.length > 0 ? (
          shuffledImages
            .slice((paging - 1) * PAGE_SIZE, paging * PAGE_SIZE)
            .map((image) => (
              <div className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                <a href={image.url} target="_blank" rel="noreferrer">
                <img
                  className="object-cover w-full h-56 md:h-64 xl:h-80"
                  src={image.img}
                  alt={image.url}
                />
                </a>
              </div>
            ))
        ) : (
          <p> No images found </p>
        )}
      </div>
      <div className="flex flex-row justify-center ">
        {shuffledImages.length > 0
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
                  paging === page
                    ? "bg-purple-300"
                    : "hover:bg-purple-400 transition-all"
                }`}
              >
                {page}
              </button>
            ))
          : null}
      </div>
    </div>
  );
}
