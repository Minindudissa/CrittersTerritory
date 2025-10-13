import React, { useContext, useEffect, useState } from "react";
import { CategoryContext } from "@/context/CategoryContext";
import { useNavigate } from "react-router-dom";

export function CategoryMenu({ categoryList }) {
  const { category, setCategory } = useContext(CategoryContext);
  const navigate = useNavigate();

  const handleCategorySearch = (category) => {
    setCategory(category);
    navigate("/shop");
  };

  return (
    <div className=" w-full bg-white bg-opacity-15 rounded-md shadow-md lg:h-[17rem] xl:h-[22rem] 2xl:h-[28rem] ">
      <div className=" bg-yellow-500 w-full p-3 flex flex-row justify-center items-center gap-2 rounded-t-md">
        <svg
          className="w-7 h-7"
          viewBox="0 0 20 20"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path
            fill="#000000"
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className=" text-black text-xl font-semibold w-full">
          Categories
        </span>
      </div>
      <div className=" p-3 space-y-3 w-full">
        {categoryList.map((categoryItem) => (
          <div
            onClick={() => handleCategorySearch(categoryItem._id)}
            key={categoryItem._id}
            className=" w-full text-lg cursor-pointer hover:text-yellow-500"
          >
            {categoryItem.name}
          </div>
        ))}
      </div>
    </div>
  );
}
