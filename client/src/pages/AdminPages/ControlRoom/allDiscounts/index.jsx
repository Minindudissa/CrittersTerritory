import PageLoading from "@/pages/PageLoading";
import {
  createPromoCode,
  createStripeCoupon,
  deletePromoCode,
  searchPromoCode,
} from "@/services";
import { useEffect, useState } from "react";
import validator from "validator";

function AllDiscounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [promoCodeList, setPromoCodeList] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoValue, setPromoValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const searchPromoCodeResponse = await searchPromoCode({
          searchData: {},
        });

        if (searchPromoCodeResponse?.success) {
          setPromoCodeList(searchPromoCodeResponse.promoCodeList);
        } else {
          setErrorMsg(searchPromoCodeResponse?.message);
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

  async function handleAddPromoCodeOnSubmit(event) {
    event.preventDefault();
    if (promoCode === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promo Code");
    } else if (promoValue === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promo Value");
    } else if (startDate === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Promo Start Date");
    } else if (userEmail === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter User Email");
    } else if (!validator.isEmail(userEmail)) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter a Valid User Email");
    } else {
      const formattedStartDate = new Date(startDate).toLocaleString("en-US");
      let formattedEndDate = "";
      if (endDate !== "") {
        if (endDate < startDate) {
          setSuccessMsg(null);
          setErrorMsg("Please Enter a Valid Promo End Date");
          setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
          }, 3000);
          return;
        } else {
          formattedEndDate = new Date(endDate).toLocaleString("en-US");
        }
      }

      const createPromoCodeResponse = await createPromoCode({
        code: promoCode,
        promoValue: promoValue,
        isUsed: false,
        startDate: formattedStartDate,
        endDate: formattedEndDate || null,
        userEmail: userEmail,
      });

      if (createPromoCodeResponse?.success) {
        const couponType = "percentage";
        const value = promoValue;

        const couponResponse = await createStripeCoupon({
          code: promoCode,
          type: couponType,
          value: value,
          duration: "once",
        });

        if (couponResponse.success) {
          setSuccessMsg("Promo Code Added Successfully !!!");
          setErrorMsg(null);
          setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
            window.location.reload();
          }, 3000);
        }
      } else {
        setSuccessMsg(null);
        setErrorMsg(createPromoCodeResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function handleDeleteOnClick(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Promo Code?"
    );
    if (confirmDelete) {
      const deletePromoCodeResponse = await deletePromoCode({
        id,
      });

      if (deletePromoCodeResponse?.success) {
        setSuccessMsg("Promo Code Deleted Successfully !!!");
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
      <h1 className="text-white font-semibold text-4xl ">Promo Codes</h1>
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
                <th className=" py-3">CODE</th>
                <th className=" py-3">PERCENTAGE</th>
                <th className=" py-3">IS USED</th>
                <th className=" py-3">START DATE</th>
                <th className=" py-3">END DATE</th>
                <th className=" py-3">USER EMAIL</th>
                <th className=" py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promoCodeList.map((promoCodeItem, index) => (
                <tr
                  key={index}
                  className="bg-white bg-opacity-15 hover:bg-white hover:bg-opacity-5 border-b-gray-800 text-center  border-gray-200"
                >
                  <td className="px-6 py-4">{promoCodeItem?.code}</td>
                  <td className="px-6 py-4">{promoCodeItem?.value} %</td>
                  <td className="px-6 py-4">
                    {promoCodeItem?.isUsed ? (
                      <span className=" text-green-500">Yes</span>
                    ) : (
                      <span className=" text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 ">{promoCodeItem?.startDate}</td>
                  <td className="px-6 py-4 ">{promoCodeItem?.endDate}</td>
                  <td className="px-6 py-4 ">{promoCodeItem?.userEmail}</td>
                  <td className="px-6 py-4">
                    <a
                      className=" text-red-500 hover:text-red-600 cursor-pointer "
                      onClick={() => {
                        handleDeleteOnClick(promoCodeItem._id);
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
            Add Promo Code
          </h2>
          <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">Code</label>
              <input
                onChange={(event) => {
                  setPromoCode(event.target.value);
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
                  setPromoValue(event.target.value);
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
                User Email
              </label>
              <input
                onChange={(event) => {
                  setUserEmail(event.target.value);
                }}
                type="email"
                name="userEmail"
                placeholder="Enter User's Email"
                className="w-full bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={handleAddPromoCodeOnSubmit}
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllDiscounts;
