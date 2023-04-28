import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import InputText from "./InputText";
import { LinkResult } from "@/types/api";
import { useQueryClient } from "react-query";
import http from "@/utils/http";
import { useLoading } from "@/contexts/LoadingContext";
import Image from "next/image";
import { IMAGE_PLACEHOLDER } from "@/utils/constant";

const LinkCard: React.FC<LinkResult> = ({
  title,
  url,
  image,
  is_active,
  id,
}) => {
  const [data, setData] = useState({
    title,
    url,
    image,
    is_active,
  });

  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();
  const [collapse, setCollapse] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure want to delete this link?");
    if (!confirm) return;
    setIsLoading(true);
    await http.delete(`link/${id}`);
    await queryClient.refetchQueries("links");
    setIsLoading(false);
  };

  const updateLink = async (name: string, value: string) => {
    await http.post(`link/${id}`, {
      _method: "PUT",
      [name]: value,
    });
    await queryClient.refetchQueries("links");
  };

  const updateOnBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    updateLink(e.target.name, e.target.value);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "checkbox") {
      setData({ ...data, [e.target.name]: e.target.checked });
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card w-full bg-base-100 shadow-sm mb-5">
      <div className="card-body w-full">
        <div className="flex justify-between">
          <InputText
            type="text"
            className="card-title"
            autoComplete={"nope"}
            value={data.title}
            name="title"
            onChange={handleChange}
            onBlur={updateOnBlur}
          />
          <input
            type="checkbox"
            className="toggle"
            onChange={(e) => {
              handleChange(e);
              updateLink(e.target.name, e.target.checked ? "1" : "0");
            }}
            value={1}
            name="is_active"
            checked={Boolean(data.is_active)}
          />
        </div>
        <InputText
          type="text"
          autoComplete="nope"
          name="url"
          className=" mt-2"
          value={data.url}
          onChange={handleChange}
          onBlur={updateOnBlur}
        />
        <div className="mt-5 flex justify-between">
          <div className="space-x-5 flex">
            <button
              className="btn btn-circle btn-sm btn-ghost"
              onClick={() => setCollapse(!collapse)}
            >
              <PhotoIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            className="btn btn-circle btn-sm btn-ghost"
            onClick={handleDelete}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
        {collapse && (
          <div className="py-5 flex items-center  flex-col lg:flex-row lg:space-x-5 space-y-5 lg:space-y-0">
            <div className="p-5 border bg-gray-50 rounded-md flex items-center justify-center relative h-36 w-36">
              {/* <Image
                src={IMAGE_PLACEHOLDER}
                height={150}
                width={150}
                alt="Image Cover"
              /> */}
              <p className="text-sm text-center text-gray-500">Image Button</p>
            </div>
            <div className="flex space-y-5 flex-col">
              <button className="btn btn-primary px-10">Pick Image</button>
              <button className="btn btn-primary btn-outline">
                Remove Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
