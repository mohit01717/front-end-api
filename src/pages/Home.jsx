import React, { useEffect, useState } from "react";

const Home = () => {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([
    { id: 1, name: "resume.pdf", size: "850 KB" },
    { id: 2, name: "photo.png", size: "1.2 MB" },
    { id: 3, name: "notes.txt", size: "12 KB" },
  ]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase()),
  );
  const onchange = (e) => {
    setSearch(e.target.value);
  };
useEffect(() => {
  async function loadFiles() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/files"
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Inspect the API response first
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  }

  loadFiles();
}, []);
  return (
    <div className=" flex flex-col gap-2 m-2">
      <div className=" self-center">
        <input
          type="text"
          name="search"
          id=""
          value={search}
          onChange={(e) => onchange(e)}
          placeholder="search file"
          className="px-4 border py-2"
        />
      </div>

      <div className=" flex flex-col gap-3">
        {filteredFiles.length === 0 ? (
          <div>No files found</div>
        ) : (
          filteredFiles.map((file) => (
            <FileCard name={file.name} size={file.size} key={file.id} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

const FileCard = ({ name, size }) => {
  return (
    <div className=" flex flex-col gap-1 p-4  border">
      <div className=" flex flex-col gap-2">
        <div className=" font-semibold text-gray-500">{name}</div>
        <div className=" text-sm text-gray-500">{size}</div>
      </div>

      <button className=" rounded-lg bg-blue-400 hover:bg-blue-500 px-4 py-2">
        Download
      </button>
    </div>
  );
};
