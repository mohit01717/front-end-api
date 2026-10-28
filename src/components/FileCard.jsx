import { useState } from "react";

const FileCard = ({
  name,
  size,
  handleDownload,
  id,
  handleDelete,
  deleting,
  deletingId,
  handleEdit,
  showMenu,
  setShowMenu,
  filename,
  setFileName,
  handleSave,
}) => {
  function onchange(e) {
    setFileName(e.target.value);
  }
  return (
    <div className=" flex flex-col gap-1 p-4  border">
      <div className=" flex justify-between items-center">
        <div className=" flex flex-col gap-2">
          {showMenu ? (
            <div className=" ">
              <input
                type="text"
                name="filename"
                id=""
                value={filename}
                onChange={(e) => onchange(e)}
                placeholder="rename filename"
                className="px-2 focus:outline"
              />
            </div>
          ) : (
            <div className=" font-semibold text-gray-500">{name}</div>
          )}

          <div className=" text-sm text-gray-500">{size}</div>
        </div>

        <div className=" flex gap-3">
          {!showMenu && (
            <button
              onClick={() => {
                if (
                  !deleting &&
                  window.confirm(`Are you sure you want to delete ${name}?`)
                ) {
                  handleDelete(id);
                }
              }}
              disabled={deleting}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {showMenu ? (
            <button
              onClick={() => {
                handleSave(id);
              }}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save{" "}
            </button>
          ) : (
            <button
              onClick={() => {
                handleEdit();
              }}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit{" "}
            </button>
          )}

          {showMenu && (
            <button
              onClick={() => {
                setShowMenu(false);
                setFileName("");
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close{" "}
            </button>
          )}
        </div>
      </div>

      <button
        className=" rounded-lg bg-blue-400 hover:bg-blue-500 px-4 py-2"
        onClick={() => handleDownload(id, name)}
      >
        Download
      </button>
    </div>
  );
};

export default FileCard;
