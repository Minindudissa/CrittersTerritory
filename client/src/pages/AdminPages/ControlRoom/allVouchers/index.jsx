import PageLoading from "@/pages/PageLoading";
import {
  createStripeCoupon,
  createVoucher,
  deleteVoucher,
  searchVoucher,
} from "@/services";
import { useEffect, useState } from "react";

function AllVouchers() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [voucherList, setVoucherList] = useState(null);
  const [voucherValue, setVoucherValue] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherValidityPeriod, setVoucherValidityPeriod] = useState(
    "Select validity Period"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const searchVoucherResponse = await searchVoucher({
          searchData: {},
        });

        if (searchVoucherResponse?.success) {
          setVoucherList(searchVoucherResponse.voucherList);
        } else {
          setErrorMsg(searchVoucherResponse?.message);
        }

        generateVoucherCode();
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

  function generateVoucherCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let voucherCode = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucherCode += characters[randomIndex];
    }
    setVoucherCode(voucherCode);
    return voucherCode;
  }

  async function handleAddVoucherOnSubmit(event) {
    event.preventDefault();
    if (voucherValue === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter voucher value");
    } else if (voucherValidityPeriod === "Select validity Period") {
      setSuccessMsg(null);
      setErrorMsg("Please Select validity Period");
    } else {
      const startDate = new Date();
      const formattedVoucherStartDate = startDate.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const createVoucherResponse = await createVoucher({
        code: voucherCode,
        VoucherValue: voucherValue,
        isUsed: false,
        startDate: formattedVoucherStartDate,
        validityPeriod: voucherValidityPeriod,
      });
      if (createVoucherResponse?.success) {
        const couponType = "fixed"; // or 'percentage'
        const value = voucherValue;

        const couponResponse = await createStripeCoupon({
          code: voucherCode,
          type: couponType,
          value: value,
          duration: "once",
        });

        if (
          couponResponse.success
        ) {
          setSuccessMsg("Voucher Added Successfully !!!");
          setErrorMsg(null);
          setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
            window.location.reload();
          }, 3000);
        }
      } else {
        setSuccessMsg(null);
        setErrorMsg(createVoucherResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function handleDeleteOnClick(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Voucher?"
    );
    if (confirmDelete) {
      const deleteVoucherResponse = await deleteVoucher({
        id,
      });

      if (deleteVoucherResponse?.success) {
        setSuccessMsg("Voucher Deleted Successfully !!!");
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
      <h1 className="text-white font-semibold text-4xl ">Vouchers</h1>
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
                <th className=" py-3">VALUE</th>
                <th className=" py-3">IS USED</th>
                <th className=" py-3">START DATE</th>
                <th className=" py-3">VALIDITY PERIOD</th>
                <th className=" py-3"></th>
              </tr>
            </thead>
            <tbody>
              {voucherList.map((voucherItem, index) => (
                <tr
                  key={index}
                  className="bg-white bg-opacity-15 hover:bg-white hover:bg-opacity-5 border-b-gray-800 text-center  border-gray-200"
                >
                  <td className="px-6 py-4">{voucherItem?.code}</td>
                  <td className="px-6 py-4">
                    ${Number(voucherItem?.value).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {voucherItem?.isUsed ? (
                      <span className=" text-green-500">Yes</span>
                    ) : (
                      <span className=" text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 ">{voucherItem?.startDate}</td>
                  <td className="px-6 py-4 ">{voucherItem?.validityPeriod}</td>
                  <td className="px-6 py-4">
                    <a
                      className=" text-red-500 hover:text-red-600 cursor-pointer "
                      onClick={() => {
                        handleDeleteOnClick(voucherItem._id);
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
            Add Voucher
          </h2>
          <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">Code</label>
              <input
                type="text"
                name="VoucherCode"
                value={voucherCode}
                disabled
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Value (USD)
              </label>
              <input
                onChange={(event) => {
                  setVoucherValue(event.target.value);
                }}
                type="number"
                name="voucherValue"
                placeholder="Enter Voucher Value in USD"
                className="w-full  bg-white bg-opacity-15 focus:border-yellow-500 placeholder:text-gray-300 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
              />
            </div>
          </div>
          <div className=" w-full flex md:flex-row flex-col justify-start items-center gap-4 mb-4">
            <div className="md:w-1/2 w-full">
              <label className="block text-white font-medium mb-2">
                Validity Period
              </label>
              <select
                onChange={(event) => {
                  setVoucherValidityPeriod(event.target.value);
                }}
                id="validityPeriod"
                name="validityPeriod"
                className=" bg-white bg-opacity-15 text-white placeholder:text-gray-300 focus:border-yellow-500 border mb-4 border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent"
              >
                <option className="bg-gray-800" value="Select validity Period">
                  Select validity Period
                </option>
                <option className="bg-gray-800" value="3 Month">
                  3 Month
                </option>
                <option className="bg-gray-800" value="6 Month">
                  6 Month
                </option>
                <option className="bg-gray-800" value="12 Month">
                  12 Month
                </option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleAddVoucherOnSubmit}
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllVouchers;
