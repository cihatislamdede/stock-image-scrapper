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
    </div>
  );
}
