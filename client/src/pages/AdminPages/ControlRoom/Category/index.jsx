import PageLoading from "@/pages/PageLoading";
import { categoryCreate, categorySearch, categoryUpdate } from "@/services";
import { useEffect, useState } from "react";

function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  useEffect(() => {
    async function searchCategory() {
      const searchCategoryResponse = await categorySearch({ searchData: {} });
      if (searchCategoryResponse?.success) {
        setCategoryList(searchCategoryResponse?.categoryList);

        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 3000);
    }
    searchCategory();
  }, []);

  async function handleCreateOnClick() {
    const createCategoryResponse = await categoryCreate({ name: categoryName });
    if (createCategoryResponse?.success) {
      setErrorMsg(null);
      setSuccessMsg("Category added successfully");
      setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
        window.location.reload();
      }, 3000);
    } else {
      if (
        createCategoryResponse?.message === '"name" is not allowed to be empty'
      ) {
        setErrorMsg("Please Enter a Category");
      } else {
        setSuccessMsg(null);
        setErrorMsg(createCategoryResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function changeCategoryStatusOnClick(id, status) {
    if (status === 0) {
      const categoryUpdateResponse = await categoryUpdate({
        _id: id,
        updateData: { status: 1 },
      });
      if (categoryUpdateResponse?.success) {
        window.location.reload();
      } else {
        setErrorMsg(categoryUpdateResponse?.message);
      }
    } else if (status === 1) {
      const categoryUpdateResponse = await categoryUpdate({
        _id: id,
        updateData: { status: 0 },
      });
      if (categoryUpdateResponse?.success) {
        window.location.reload();
      } else {
        setErrorMsg(categoryUpdateResponse?.message);
      }
    }
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full h-screen p-4 space-y-4">
      <div className=" w-1/2">
        <span className=" text-lg font-semibold text-gray-300">Category</span>
      </div>
      {successMsg ? (
        <div
          className=" w-1/2 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">{successMsg}</span>
        </div>
      ) : null}
      {errorMsg ? (
        <div
          className="w-1/2 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorMsg}</span>
        </div>
      ) : null}
      <div className=" w-1/2">
        <input
          onChange={(event) => {
            setCategoryName(event.target.value);
          }}
          name="category"
          type="category"
          className="text-white placeholder:text-gray-300 bg-white bg-opacity-15 focus:border-yellow-500  outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md"
          placeholder="Enter Category"
        />
      </div>
      <div className=" w-1/2 flex justify-center">
        <button
          onClick={handleCreateOnClick}
          className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
        >
          Add Category
        </button>
      </div>
      <div className=" w-1/2 ps-5 flex flex-col space-y-4">
        {categoryList.map((categoryItem, index) => (
          <div className=" w-full flex flex-row justify-between" key={index}>
            <span className=" text-white">{categoryItem?.name}</span>
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                onClick={() => {
                  changeCategoryStatusOnClick(
                    categoryItem?._id,
                    categoryItem?.status
                  );
                }}
                className="sr-only peer"
                defaultChecked={categoryItem?.status === 1}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
