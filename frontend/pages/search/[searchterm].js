import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getImages } from "../../utils/getImages";

export default function Seachterm() {
  const router = useRouter();
  const { searchterm } = router.query;
  const [imgUrls, setImgUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchImages = async () => {
      const res = await getImages(searchterm);
      try {
        setImgUrls(res.data);
        setLoading(false);
        console.log("res.data:", res.data);
        console.log(
          "res.data.adobestock keys:",
          Object.keys(res.data.adobestock)
        );
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
            {Object.keys(imgUrls).map((source) => {
              console.log("source:", source);
              return Object.keys(imgUrls[source]).map((imgURL) => {
                console.log("imgURL:", imgURL);
                return (
                  <div>
                    <a href={imgUrls[source][imgURL]} target="_blank">
                      <img
                        src={imgURL}
                        loading="lazy"
                        width="200"
                        height="auto"
                      />
                    </a>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>
    </div>
  );
}
