import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
const Home = () => {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(null);
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };
  const handleDownload = async (id, name) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/files/download/${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        console.error(data.message || "Download failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/files/upload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (response.ok === "201") {
        console.log("upload successfull");
      } else {
        console.error("upload  failed");
      }
    } catch (error) {
      console.error("upload request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.storedFilename.toLowerCase().includes(search.toLowerCase()),
  );
  const onchange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    async function loadFiles() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/files", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setFiles(data.files); // Inspect the API response first
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, []);
  return (
    <div className=" flex flex-col gap-2 m-2">
      <div className="flex  justify-around items-center">
        <div className="px-4 border py-2">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <div className=" ">
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
        <button
          onClick={handleLogout}
          className=" rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className=" flex flex-col gap-3">
        {loading ? (
          <div>Loading files....</div>
        ) : filteredFiles.length === 0 ? (
          <div>No files found</div>
        ) : (
          filteredFiles.map((file) => (
            <FileCard
              name={file.storedFilename}
              size={formatFileSize(file.size)}
              key={file._id}
              handleDownload={handleDownload}
              id={file._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
