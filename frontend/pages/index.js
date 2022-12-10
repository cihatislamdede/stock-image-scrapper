import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Head>
        <title>Image Scrapper</title>
      </Head>
      <div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl">Image scrapper</h1>
        </div>
        <div>
          <input
            autoFocus
            type="text"
            className="transition duration-500 outline-none ease-in-out border-2 text-gray-800 border-red-400 border-dashed rounded-lg text-center focus:border-blue-800"
            placeholder="enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("searchTerm:", searchTerm);
                const newTerm = searchTerm.replace(" ", "-");
                router.push(`/search/${newTerm}`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
