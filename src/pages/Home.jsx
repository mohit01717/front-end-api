import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
const Home = () => {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [uploadingMessage, setUploadingMessage] = useState("");
  const [uploadError, setUploadError] = useState(false);
  const [deleteMessge, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newfilename,setFileName]= useState("");
  //Pop up for edit
const [show,setShow] = useState(false)
const [error,setError] = useState('');
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
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    setUploadingMessage("");
    setUploading(true);
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

      if (response.ok) {
        await loadFiles();
        setSelectedFile(null);
        setUploadError(false);
        setUploadingMessage("File upload sucessfully");
      } else {
        const data = await response.json();
        setUploadError(true);

        setUploadingMessage(data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload request failed:", error);
      setUploadError(true);
      setUploadingMessage("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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

  const filteredFiles = files.filter((file) =>
    file.storedFilename.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    setDeleteMessage("");
    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/files/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setDeleteError(false);
        setDeleteMessage("Deleted successfully");
        await loadFiles();
      } else {
        const data = await response.json();
        setDeleteError(true);
        setDeleteMessage(data.message || "Delete failed");
      }
    } catch (error) {
      setDeleteError(true);
      console.error("Delete request failed:", error);
      setDeleteMessage("Network error. Please try again.");
    }
  };
  const handleEdit = async ()=>{
     
     setShow(true)
  }

  const handleSave = async(id)=>{
      if(newfilename.length===0|| newfilename.trim()===""){
        return;
      }
     try{
      setShow(false)
       const response = await fetch(`http://localhost:3000/api/v1/files/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          filename:newfilename
        })
      });
      

      if(response.ok){
        loadFiles();
      }
    }
    catch(error){
      console.error("server error",error)
    }
  }
  const onchange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    loadFiles();
  }, []);
  return (
    <div className=" flex flex-col gap-2 m-2">
      <div className="flex  justify-around items-center">
        <div className="px-4 border py-2">
          <input
            key={selectedFile ? selectedFile.name : "empty"}
            type="file"
            accept="image/jpeg,image/png"
            disabled={uploading}
            onChange={(e) => {
              setSelectedFile(e.target.files[0] || null);
              setUploadingMessage("");
              setUploadError(false);
            }}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {uploadingMessage && (
            <p
              className={`mt-2 text-sm ${
                uploadError ? "text-red-600" : "text-green-600"
              }`}
            >
              {uploadingMessage}
            </p>
          )}
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
      {deleteMessge && (
        <p
          className={`text-sm ${
            deleteError ? "text-red-600" : "text-green-600"
          }`}
        >
          {deleteMessge}
        </p>
      )}
      
      <div className=" flex flex-col gap-3">
        {loading ? (
          <div>Loading files....</div>
        ) : filteredFiles.length === 0 ? (
        search ? "No files match your search." : "No files uploaded yet."
        ) : (
          filteredFiles.map((file) => (
            <FileCard
              name={file.storedFilename}
              size={formatFileSize(file.size)}
              key={file._id}
              handleDownload={handleDownload}
              id={file._id}
              handleDelete={handleDelete}
              deletingId={deletingId}
              deleting={deletingId === file._id}
              handleEdit={handleEdit}
              showMenu={show}
              setShowMenu={setShow}
              setFileName={setFileName}
              filename={newfilename}
              handleSave={handleSave}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Home;
