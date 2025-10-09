import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  createPromoCode,
  createPromotion,
  deletePromoCode,
  deletePromotion,
  searchPromoCode,
  searchPromotion,
} from "@/services";
import { useEffect, useState } from "react";
import validator from "validator";

function AllPromotions() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [promotionList, setPromotionList] = useState("");
  const [categoryList, setCategoryList] = useState("");

  const [promotionTitle, setPromotionTitle] = useState("");
  const [promotionValue, setPromotionValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState("Select Category");
  const [productType, setProductType] = useState("Select Product Type");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const searchPromotionResponse = await searchPromotion({
          searchData: {},
        });

        const categorySearchResponse = await categorySearch({
          searchData: {},
        });

        if (searchPromotionResponse?.success) {
          setPromotionList(searchPromotionResponse.promotionList);
        } else {
          setErrorMsg(searchPromotionResponse?.message);
        }

        if (categorySearchResponse?.success) {
          setCategoryList(categorySearchResponse.categoryList);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }

      setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 4000);
    }
    fetchData();
  }, []);

  async function handleAddPromotionOnSubmit(event) {
    event.preventDefault();
    if (promotionTitle === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promotion Title");
    } else if (promotionValue === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promotion Value");
    } else if (startDate === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promotion Start Date");
    } else if (endDate === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promotion End Date");
    } else if (endDate < startDate) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter a Valid Promotion End Date");
    } else if (categoryId === "Select Category") {
      setSuccessMsg(null);
      setErrorMsg("Please Select Category");
    } else if (productType === "Select Product Type") {
      setSuccessMsg(null);
      setErrorMsg("Please Select Product Type");
    } else {
      const formattedStartDate = new Date(startDate).toLocaleString("en-US");
      const formattedEndDate = new Date(endDate).toLocaleString("en-US");

      const createPromotionResponse = await createPromotion({
        title: promotionTitle,
        promotionValue: promotionValue,
        isActive: false,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        categoryId: categoryId,
        productType: productType,
      });

      if (createPromotionResponse?.success) {
        setSuccessMsg("Promotion Added Successfully !!!");
        setErrorMsg(null);
        setTimeout(() => {
          setSuccessMsg(null);
          setErrorMsg(null);
          window.location.reload();
        }, 3000);
      } else {
        setSuccessMsg(null);
        setErrorMsg(createPromotionResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function handleDeleteOnClick(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Promotion?"
    );
    if (confirmDelete) {
      const deletePromotionResponse = await deletePromotion({
        id,
      });

      if (deletePromotionResponse?.success) {
        setSuccessMsg("Promotion Deleted Successfully !!!");
        setErrorMsg(null);
        setTimeout(() => {
          setSuccessMsg(null);
          setErrorMsg(null);
          window.location.reload();
        }, 3000);
      }
    }
  }
  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="w-full h-full flex flex-col justify-center p-4 ">
      <h1 className="text-white font-semibold text-4xl ">Promotions</h1>
      {successMsg && (
        <div
          className="w-full p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div
          className="w-full p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}
      <div className="w-full mt-4 ">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-100">
            <thead className="text-xs text-gray-100 uppercase bg-white bg-opacity-25">
              <tr className="text-center">
                <th className=" py-3">TITLE</th>
                <th className=" py-3">VALUE</th>
                <th className=" py-3">START DATE</th>
                <th className=" py-3">END DATE</th>
                <th className=" py-3">IS ACTIVE</th>
                <th className=" py-3">CATEGORY</th>
                <th className=" py-3">TYPE</th>
                <th className=" py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promotionList.map((promotionItem, index) => (
                <tr
                  key={index}
                  className="bg-white bg-opacity-15 hover:bg-white hover:bg-opacity-5 border-b-gray-800 text-center  border-gray-200"
                >
                  <td className="px-6 py-4">{promotionItem?.title}</td>
                  <td className="px-6 py-4">{promotionItem?.value}%</td>
                  <td className="px-6 py-4 ">{promotionItem?.startDate}</td>
                  <td className="px-6 py-4 ">{promotionItem?.endDate}</td>
                  <td className="px-6 py-4">
                    {promotionItem?.isActive ? (
                      <span className=" text-green-500">Yes</span>
                    ) : (
                      <span className=" text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 ">
                    {promotionItem?.categoryId === "1" ? (
                      <span className=" text-yellow-500">All</span>
                    ) : (
                      <span className=" text-lime-500">
                        {
                          categoryList.find(
                            (categoryItem) =>
                              promotionItem?.categoryId === categoryItem._id
                          )?.name
                        }
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 ">{promotionItem?.productType}</td>
                  <td className="px-6 py-4">
                    <a
                      className=" text-red-500 hover:text-red-600 cursor-pointer "
                      onClick={() => {
                        handleDeleteOnClick(promotionItem._id);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" w-full mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Add Promotion
          </h2>
          <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">Title</label>
              <input
                onChange={(event) => {
                  setPromotionTitle(event.target.value);
                }}
                type="text"
                name="VoucherCode"
                placeholder="Enter Promo Code"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Value (%)
              </label>
              <input
                onChange={(event) => {
                  setPromotionValue(event.target.value);
                }}
                type="number"
                name="voucherValue"
                placeholder="Enter Promo Code Value as %"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <div className=" w-full flex md:flex-row flex-col justify-start items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Start Date
              </label>
              <input
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
                type="datetime-local"
                name="startDate"
                className="w-full bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                End Date
              </label>
              <input
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
                type="datetime-local"
                name="endDate"
                className="w-full bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <div className=" w-full flex md:flex-row flex-col justify-start items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Category
              </label>
              <select
                onChange={(event) => {
                  setCategoryId(event.target.value);
                }}
                id="validityPeriod"
                name="validityPeriod"
                className=" bg-white bg-opacity-15 text-white placeholder:text-gray-300 focus:border-yellow-500 border mb-4 border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent"
              >
                <option className="bg-gray-800" value="Select Category">
                  Select Category
                </option>
                <option className="bg-gray-800" value="1">
                  All
                </option>
                {categoryList.map((categoryItem, index) =>
                  categoryItem.status === 1 ? (
                    <option className="bg-gray-800" value={categoryItem._id}>
                      {categoryItem.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Product Type
              </label>
              <select
                onChange={(event) => {
                  setProductType(event.target.value);
                }}
                id="validityPeriod"
                name="validityPeriod"
                className=" bg-white bg-opacity-15 text-white placeholder:text-gray-300 focus:border-yellow-500 border mb-4 border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent"
              >
                <option className="bg-gray-800" value="Select Product Type">
                  Select Product Type
                </option>
                <option className="bg-gray-800" value="Digital">
                  Digital
                </option>
                <option className="bg-gray-800" value="Physical">
                  Physical
                </option>
                <option className="bg-gray-800" value="Both">
                  Both
                </option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleAddPromotionOnSubmit}
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllPromotions;
