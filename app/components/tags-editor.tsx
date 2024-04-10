import { Delete, DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const TagsEditor = ({ blog, setBlog }: CreateBlogComponentProps) => {
  const [noOfTags, setNoOfTags] = useState(0);

  useEffect(() => {
    setNoOfTags(blog?.tags?.length || 0);
  }, [blog]);

  const handleTagsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newTags = blog ? blog.tags : [];
    if (newTags) {
      newTags[index] = e.target.value;
    }
    const newBlog = { ...blog, tags: newTags };
    setBlog(newBlog);
  };

  return (
    <div className="flex flex-wrap gap-3 mx-auto mt-2 md:mt-0 w-fit mb-3">
      {Array.from({ length: noOfTags }).map((_, index) => (
        <div
          key={index + 1}
          className="border-black min-w-[165px] px-3 flex focus:outline-none rounded-sm text-sm border  mr-2"
        >
          <input
            className="focus:outline-none w-full p-1 font-medium"
            maxLength={24}
            value={blog?.tags && blog?.tags[index]}
            onChange={(e) => handleTagsChange(e, index)}
          />
          <button
            onClick={() => {
              const newTags = blog?.tags.filter((tag, i) => i !== index);
              const newBlog = { ...blog, tags: newTags };
              setBlog(newBlog);
            }}
          >
            <Delete />
          </button>
        </div>
      ))}
      <button
        onClick={() => setNoOfTags((prevNoOfTags) => prevNoOfTags + 1)}
        className="cursor-pointer bg-black text-white w-36 md:w-fit border-black  border text-xs md:text-sm rounded-md p-1 px-3 "
      >
        Add Tag +
      </button>
    </div>
  );
};
