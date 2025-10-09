import PageLoading from "@/pages/PageLoading";
import {
  createShippingData,
  deleteShippingData,
  searchPromoCode,
  searchShippingData,
  updateShippingData,
} from "@/services";
import { useEffect, useState } from "react";

function Shippng() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [ShippingList, setShippingList] = useState(null);

  const [addShippingType, setAddShippingType] = useState(
    "Select Shipping Type"
  );
  const [addShippingWeightBelow, setAddShippingWeightBelow] = useState("");
  const [addMaxProductWeight, setAddMaxProductWeight] = useState("");
  const [addShippingPrice, setAddShippingPrice] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const searchShippingDataResponse = await searchShippingData({
          searchData: {},
        });

        if (searchShippingDataResponse?.success) {
          setShippingList(searchShippingDataResponse.shippingDataList);
        } else {
          setErrorMsg(searchShippingDataResponse?.message);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }

      setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 3000);
    }
    fetchData();
  }, []);

  async function handleAddShippingOnSubmit(event) {
    event.preventDefault();
    if (addShippingType === "Select Shipping Type") {
      setSuccessMsg(null);
      setErrorMsg("Please Select a Shipping type");
    } else if (addShippingWeightBelow === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter the Shipping Weight Below");
    } else if (addMaxProductWeight === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter the Max Product Weight");
    } else if (addShippingPrice === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter the Shipping Price");
    } else {
      const createShippingDataResponse = await createShippingData({
        addShippingType,
        addShippingWeightBelow,
        addMaxProductWeight,
        addShippingPrice,
        status: "1",
      });
      if (createShippingDataResponse?.success) {
        setSuccessMsg("Shipping Data Added Successfully !!!");
        setErrorMsg(null);
        setTimeout(() => {
          setSuccessMsg(null);
          setErrorMsg(null);
          window.location.reload();
        }, 3000);
      } else {
        setSuccessMsg(null);
        setErrorMsg(createShippingDataResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function handleChangeStatus(id, status) {
    if (status === "1") {
      const updateShippingDataResponse = await updateShippingData({
        updateData: { status: "0" },
        id,
      });
      if (updateShippingDataResponse?.success) {
        setSuccessMsg("Shipping Data Updated Successfully !!!");
        setErrorMsg(null);
        setTimeout(() => {
          setSuccessMsg(null);
          setErrorMsg(null);
          window.location.reload();
        }, 3000);
      }
    } else if (status === "0") {
      const updateShippingDataResponse = await updateShippingData({
        updateData: { status: "1" },
        id,
      });

      if (updateShippingDataResponse?.success) {
        setSuccessMsg("Shipping Data Updated Successfully !!!");
        setErrorMsg(null);
        setTimeout(() => {
          setSuccessMsg(null);
          setErrorMsg(null);
          window.location.reload();
        }, 3000);
      }
    }
  }

  async function handleDeleteOnClick(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipping option?"
    );
    if (confirmDelete) {
      const deleteShippingDataResponse = await deleteShippingData({
        id,
      });

      if (deleteShippingDataResponse?.success) {
        setSuccessMsg("Shipping Data Deleted Successfully !!!");
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
      <h1 className="text-white font-semibold text-4xl ">Shipping</h1>
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
        <h2 className=" text-white my-3 text-lg">Standard Shipping</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-100">
            <thead className="text-xs text-gray-100 uppercase bg-white bg-opacity-25">
              <tr className="text-center">
                <th className=" py-3">Weight Below</th>
                <th className=" py-3">Max Products Weight</th>
                <th className=" py-3">Price</th>
                <th className=" py-3">Status</th>
                <th className=" py-3"></th>
              </tr>
            </thead>
            <tbody>
              {ShippingList.map((shippingItem, index) =>
                shippingItem?.shippingType === "Standard shipping" ? (
                  <tr
                    key={index}
                    className="bg-white bg-opacity-15 hover:bg-white hover:bg-opacity-5 border-b-gray-800 text-center  border-gray-200"
                  >
                    <td className="px-6 py-4">{shippingItem?.weightBelow} g</td>
                    <td className="px-6 py-4">
                      {shippingItem?.maxProductWeight} g
                    </td>
                    <td className="px-6 py-4">${Number(shippingItem.price).toFixed(2)}</td>
                    <td className="px-6 py-4 flex justify-center items-center">
                      <label className="inline-flex items-center me-5 cursor-pointer">
                        <input
                          type="checkbox"
                          onClick={() => {
                            handleChangeStatus(
                              shippingItem._id,
                              shippingItem.status
                            );
                          }}
                          className="sr-only peer"
                          defaultChecked={shippingItem.status === "1"}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        className=" text-red-500 hover:text-red-600 cursor-pointer "
                        onClick={() => {
                          handleDeleteOnClick(shippingItem._id);
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
          <h2 className=" text-white my-3 text-lg">Expedited Shipping</h2>
          <table className="w-full text-sm text-left rtl:text-right text-gray-100">
            <thead className="text-xs text-gray-100 uppercase bg-white bg-opacity-25">
              <tr className="text-center">
                <th className=" py-3">Weight Below</th>
                <th className=" py-3">Max Products Weight</th>
                <th className=" py-3">Price</th>
                <th className=" py-3">Status</th>
                <th className=" py-3"></th>
              </tr>
            </thead>
            <tbody>
              {ShippingList.map((shippingItem, index) =>
                shippingItem?.shippingType === "Expedited shipping" ? (
                  <tr
                    key={index}
                    className="bg-white bg-opacity-15 hover:bg-white hover:bg-opacity-5 border-b-gray-800 text-center  border-gray-200"
                  >
                    <td className="px-6 py-4">{shippingItem?.weightBelow} g</td>
                    <td className="px-6 py-4">
                      {shippingItem?.maxProductWeight} g
                    </td>
                    <td className="px-6 py-4">${Number(shippingItem.price).toFixed(2)}</td>
                    <td className="px-6 py-4 flex justify-center items-center">
                      <label className="inline-flex items-center me-5 cursor-pointer">
                        <input
                          type="checkbox"
                          onClick={() => {
                            handleChangeStatus(
                              shippingItem._id,
                              shippingItem.status
                            );
                          }}
                          className="sr-only peer"
                          defaultChecked={shippingItem.status === "1"}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        className=" text-red-500 hover:text-red-600 cursor-pointer "
                        onClick={() => {
                          handleDeleteOnClick(shippingItem._id);
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
        <div className=" w-full mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Add Shipping Option
          </h2>
          <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Shipping Type
              </label>
              <select
                onChange={(event) => {
                  setAddShippingType(event.target.value);
                }}
                id="shippingType"
                name="shippingType"
                className=" bg-white bg-opacity-15 text-white placeholder:text-gray-300 focus:border-yellow-500 border mb-4 border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent"
              >
                <option className="bg-gray-800" value="Select Shipping Type">
                  Select Shipping Type
                </option>
                <option className="bg-gray-800" value="Standard shipping">
                  Standard shipping
                </option>
                <option className="bg-gray-800" value="Expedited shipping">
                  Expedited shipping
                </option>
              </select>
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Shipping Weight Below
              </label>
              <input
                onChange={(event) => {
                  setAddShippingWeightBelow(event.target.value);
                }}
                type="text"
                name="shippingWeightBelow"
                placeholder="Enter Shipping Weight Below in grams"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Max Products Weight
              </label>
              <input
                onChange={(event) => {
                  setAddMaxProductWeight(event.target.value);
                }}
                type="text"
                name="maxProductsWeight"
                placeholder="Enter Max Products Weight in grams"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Price (USD)
              </label>
              <input
                onChange={(event) => {
                  setAddShippingPrice(event.target.value);
                }}
                type="text"
                name="price"
                placeholder="Enter Shipping Price"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={handleAddShippingOnSubmit}
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shippng;
