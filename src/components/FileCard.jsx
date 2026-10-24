const FileCard = ({ name, size, handleDownload, id }) => {
  return (
    <div className=" flex flex-col gap-1 p-4  border">
      <div className=" flex flex-col gap-2">
        <div className=" font-semibold text-gray-500">{name}</div>
        <div className=" text-sm text-gray-500">{size}</div>
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
