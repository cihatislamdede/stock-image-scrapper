import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { getImages, PAGE_SIZE, SOURCES } from "../../utils";

export default function Search() {
  const router = useRouter();

  const { q, exclude } = router.query;

  const [imgUrls, setImgUrls] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [paging, setPaging] = useState(1);
  const [loading, setLoading] = useState(true);
  const [excludeSources, setExcludeSources] = useState([]);
  const [includedSources, setIncludedSources] = useState(SOURCES);

  const topRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let allImages = [];
        const resdata = await getImages(q, exclude);
        Object.keys(resdata).map((source) => {
          Object.keys(resdata[source]).map((imgURL) => {
            //all : adobestock, burst, freeimages, freepik, stocksnap, unsplash
            if (source === "burst") {
              allImages.push({
                url: "https://burst.shopify.com" + resdata[source][imgURL],
                img: imgURL,
                source: "burst",
              });
            } else if (source === "freeimages") {
              allImages.push({
                url: "https://www.freeimages.com" + resdata[source][imgURL],
                img: imgURL,
                source: "freeimages",
              });
            } else if (source === "stocksnap") {
              allImages.push({
                url: "https://stocksnap.io" + resdata[source][imgURL],
                img: imgURL,
                source: "stocksnap",
              });
            } else if (source === "unsplash") {
              allImages.push({
                url: "https://unsplash.com" + resdata[source][imgURL],
                img: imgURL,
                source: "unsplash",
              });
            } else if (source === "adobestock") {
              allImages.push({
                url: resdata[source][imgURL],
                img: imgURL,
                source: "adobestock",
              });
            } else if (source === "freepik") {
              allImages.push({
                url: resdata[source][imgURL],
                img: imgURL,
                source: "freepik",
              });
            }
          });
        });
        setImgUrls(allImages);
        //console.log(allImages);
        setShuffledImages(shuffleImages(allImages));
        if (exclude) {
          const includedSources = SOURCES.filter(
            (source) => !exclude.includes(source)
          );
          setIncludedSources(includedSources);
        }
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
    <div className="bg-gray-900 min-h-screen">
      {/* back button to search page */}
      <div ref={topRef} className="flex flex-row justify-center">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="inline-flex items-center py-2.5 mt-4 px-4 ml-1 text-sm font-medium text-white  rounded-lg border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none  bg-purple-600 focus:ring-purple-800"
        >
          Back
        </button>
      </div>
      <p className="text-2xl font-semibold text-center italic text-slate-400">
        <span className="font-bold text-slate-300">{q}</span> results <br /> (
        {shuffledImages.length} images)
      </p>
      <div className="flex flex-wrap justify-center mt-4 gap-y-2 md:gap-y-1">
        {includedSources.map((source) => (
          <label
            className="inline-flex relative items-center mr-2 cursor-pointer"
            key={source}
          >
            <input
              type="checkbox"
              value={source}
              className="sr-only peer"
              checked={!excludeSources.includes(source)}
              onChange={(e) => {
                if (e.target.checked) {
                  setExcludeSources(
                    excludeSources.filter((item) => item !== source)
                  );

                  let toAdd = imgUrls.filter((item) => item.source === source);
                  const toshuffle = [...shuffledImages, ...toAdd];
                  setShuffledImages(shuffleImages(toshuffle));
                } else {
                  setExcludeSources(() => [...excludeSources, source]);
                  //remove from shuffled images
                  setShuffledImages(
                    shuffledImages.filter((item) => item.source !== source)
                  );
                }
              }}
            />
            <div className="w-11 h-6  rounded-full peer peer-focus:ring-4  peer-focus:ring-purple-800 bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-purple-600"></div>
            <span className="ml-1 text-sm font-medium  text-gray-300">
              {source}
            </span>
          </label>
        ))}
      </div>
      <div className="grid gap-6 row-gap-5 px-16 py-6 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-3">
        {shuffledImages.length > 0 &&
          shuffledImages
            .slice((paging - 1) * PAGE_SIZE, paging * PAGE_SIZE)
            .map((image) => (
              <div
                className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2x"
                key={image.url}
              >
                <a href={image.url} target="_blank" rel="noreferrer">
                  <img
                    className="object-cover w-full h-56 md:h-64 xl:h-80"
                    src={image.img}
                    alt={image.url}
                  />
                  <span className="absolute top-0 right-0 px-2 py-1 m-2 text-xs font-semibold tracking-wider text-white uppercase bg-purple-600 rounded-full bg-opacity-60">
                    {image.source}
                  </span>
                </a>
              </div>
            ))}
      </div>
      {shuffledImages.length == 0 && (
        <p className="text-center text-3xl text-slate-200"> No images found...</p>
      )}

      <div className="flex flex-row justify-center mb-4">
        {shuffledImages.length > 0
          ? Array.from(
              { length: Math.ceil(shuffledImages.length / PAGE_SIZE) },
              (v, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setPaging(page);
                  window.scrollTo({
                    top: topRef.current.offsetTop,
                    left: 0,
                    behavior: "smooth",
                  });
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
