import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { SOURCES } from "../utils";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [excludeSources, setExcludeSources] = useState([]);

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      alert("Please enter something to search");
      return;
    }
    const exclude =
      excludeSources.length > 0
        ? excludeSources.map((s) => s.toLowerCase()).join("+")
        : null;
    const query = searchTerm.replace(" ", "+");
    if (exclude) {
      router.push(`/search?q=${query}&exclude=${exclude}`);
    } else {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Head>
        <title>Image Scrapper</title>
      </Head>
      <section className="bg-gray-900 w-full h-screen text-white">
        <div className="mx-auto px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center mb-4">
            <h1 className="bg-gradient-to-r from-green-300 via-purple-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Image Search from
              <span className="sm:block"> Multiple Sources</span>
            </h1>
            <form className="flex items-center mt-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5  text-purple-400"
                    fillRule="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search-image"
                  className=" block w-full pl-10 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-purple-500 focus:border-purple-500 rounded-lg"
                  placeholder="Search something..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 ml-1 text-sm font-medium text-white  rounded-lg border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none  bg-purple-600 focus:ring-purple-800"
                onClick={handleSearch}
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap justify-center mt-4">
              {SOURCES.map((source) => (
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
                          excludeSources.filter((s) => s !== source)
                        );
                      } else {
                        setExcludeSources([...excludeSources, source]);
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
          </div>
        </div>
      </section>
    </div>
  );
}
