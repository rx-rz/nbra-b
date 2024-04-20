import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const TagsEditor = ({
  storedBlog,
  setStoredBlog,
}: CreateBlogComponentProps) => {
  const [noOfTags, setNoOfTags] = useState(0);

  useEffect(() => {
    setNoOfTags(storedBlog?.tags?.length || 0);
  }, [storedBlog]);

  const handleTagsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newTags = storedBlog ? storedBlog.tags : [];
    if (newTags) {
      newTags[index] = e.target.value;
    }
    const newBlog = { ...storedBlog, tags: newTags };
    setStoredBlog(newBlog);
  };

  return (
    <div className="flex flex-wrap gap-3 mx-auto mt-2 md:mt-0 w-full p-2 mb-3">
      {Array.from({ length: noOfTags }).map((_, index) => (
        <div
          key={index + 1}
          className="border-black w-full p-2 first-of-type:mt-4 px-3 flex focus:outline-none rounded-md text-md border"
        >
          <input
            className="focus:outline-none w-full p-1 font-medium"
            maxLength={24}
            value={storedBlog?.tags && storedBlog?.tags[index]}
            onChange={(e) => handleTagsChange(e, index)}
            onBlur={(e) => handleTagsChange(e, index)}
          />
          <button
            onClick={() => {
              const newTags = storedBlog?.tags.filter((tag, i) => i !== index);
              const newBlog = { ...storedBlog, tags: newTags };
              setStoredBlog(newBlog);
            }}
          >
            <TrashIcon size={20}/>
          </button>
        </div>
      ))}
      <button
        onClick={() => setNoOfTags((prevNoOfTags) => prevNoOfTags + 1)}
        className="cursor-pointer bg-black text-white w-full border-black  border text-md rounded-md py-2 px-3 "
      >
        Add Tag
      </button>
    </div>
  );
};
