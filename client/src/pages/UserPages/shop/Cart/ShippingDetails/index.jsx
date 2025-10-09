import PageLoading from "@/pages/PageLoading";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "@/context/UserAuthContext";
import { countrySearch, createUpdateAddress, searchAddress } from "@/services";

function ShippingDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [isAddressAvailable, setIsAddressAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Start loading

      try {
        if (user) {
          const [searchAddressResponse] = await Promise.all([
            searchAddress({ userId: user._id }),
          ]);

          if (searchAddressResponse.success) {
            setIsAddressAvailable(true);
          } else {
            const searchCountryResponse = await countrySearch({
              searchData: {},
            });
            if (searchCountryResponse) {
              setCountryList(searchCountryResponse?.countryList);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Ensures loading stops regardless of success or failure
      }
    }

    fetchData();
  }, [user]); // Depend on `user` so it refetches when user changes

  async function handleChangeAddressOnSubmit(event) {
    event.preventDefault();
    if (addressLine1 === "") {
      setSuccessMsg(null);
      setErrorMsg("Please fill your Address Line 1");
    } else if (addressLine2 === "") {
      setSuccessMsg(null);
      setErrorMsg("Please fill your Address Line 2");
    } else if (city === "") {
      setSuccessMsg(null);
      setErrorMsg("Please fill your City / Town");
    } else if (province === "") {
      setSuccessMsg(null);
      setErrorMsg("Please fill your State / Province / Region");
    } else if (postalCode === "") {
      setSuccessMsg(null);
      setErrorMsg("Please fill your Postal Code / ZIP Code");
    } else if (country === 0) {
      setSuccessMsg(null);
      setErrorMsg("Please select your Country");
    } else {
      const createAddress = await createUpdateAddress({
        line1: addressLine1,
        line2: addressLine2,
        city,
        province,
        postalCode,
        countryId: country,
        userId: user?._id,
      });
      if (createAddress?.success) {
        setErrorMsg(null);
        setSuccessMsg(createAddress?.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setSuccessMsg(null);
        setErrorMsg(createAddress?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="font-[sans-serif] flex flex-row justify-center items-center w-full">
      {isAddressAvailable ? (
        navigate("../cart", { replace: true })
      ) : (
        <div className=" w-full lg:w-3/4 p-4 flex flex-col">
          <h2 className=" my-4 font-semibold text-xl text-white">
            Address Details
          </h2>
          {successMsg ? (
            <div
              className=" w-5/6 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span className="font-medium">{successMsg}</span>
            </div>
          ) : null}
          {errorMsg ? (
            <div
              className="w-5/6 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span className="font-medium">{errorMsg}</span>
            </div>
          ) : null}
          <div className=" mb-6">
            <label className="text-gray-100 text-sm mb-2 block">
              Address Line 1
              <span className="text-gray-400">
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setAddressLine1(event.target.value);
                }}
                name="addressLine1"
                type="text"
                required
                className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                placeholder="Address Line 1"
              />
            </div>
          </div>
          <div className=" mb-6">
            <label className="text-gray-100 text-sm mb-2 block">
              Address Line 2
              <span className="text-gray-400">
                <span className=" text-red-600 text-lg"> &#8902;</span>
                required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setAddressLine2(event.target.value);
                }}
                name="addressLine2"
                type="text"
                required
                className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                placeholder="Address Line 2"
              />
            </div>
          </div>
          <div className="w-full flex md:flex-row md:justify-between flex-col">
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                City / Town
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setCity(event.target.value);
                  }}
                  name="city"
                  type="text"
                  className="text-white bg-white  bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="City / Town"
                />
              </div>
            </div>
            <div className="md:w-2/5 w-full">
              <label className="text-gray-100 text-sm mb-1 block">
                State / Province / Region
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setProvince(event.target.value);
                  }}
                  name="province"
                  type="text"
                  className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="State / Province / Region"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex md:flex-row md:justify-between flex-col mt-6">
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                Postal Code / ZIP Code
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setPostalCode(event.target.value);
                  }}
                  name="postalCode"
                  type="text"
                  className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="Postal Code / ZIP Code"
                />
              </div>
            </div>
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                Country
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <select
                  id="country"
                  name="country"
                  onChange={(event) => {
                    setCountry(event.target.value);
                  }}
                  className="text-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent cursor-pointer bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                >
                  <option value={"0"} className=" bg-gray-800">
                    Select Country
                  </option>
                  {countryList.map((countryItem, index) => (
                    <option
                      key={index}
                      value={countryItem._id}
                      className=" bg-gray-800"
                    >
                      {countryItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className=" w-full mt-4 flex justify-center">
            <button
              onClick={handleChangeAddressOnSubmit}
              type="button"
              className=" border-none  py-2 px-6 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="max-w-4xl w-full h-max rounded-md px-4 py-8 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Complete your order
          </h2>
          <form className="mt-8">
            <div>
              <h3 className="text-sm lg:text-base text-gray-800 mb-4">
                Personal Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Phone No."
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm lg:text-base text-gray-800 mb-4">
                Shipping Address
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Address Line"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 max-md:flex-col mt-8">
                <button
                  type="button"
                  className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 max-md:order-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Complete Purchase
                </button>
              </div>
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
}

export default ShippingDetails;
