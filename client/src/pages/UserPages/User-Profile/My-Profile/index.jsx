import { UserAuthContext } from "@/context/UserAuthContext";
import PageLoading from "@/pages/PageLoading";
import {
  genderSearch,
  UpdateUser,
  countrySearch,
  userPasswordChange,
  createUpdateAddress,
  searchAddress,
} from "@/services";
import { useContext, useEffect, useState } from "react";

function MyProfile() {
  const { user, setUser } = useContext(UserAuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [genderList, setGenderList] = useState([]);
  const [gender, setGender] = useState("0");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [successMsg1, setSuccessMsg1] = useState(null);
  const [errorMsg2, setErrorMsg2] = useState(null);
  const [successMsg2, setSuccessMsg2] = useState(null);
  const [errorMsg3, setErrorMsg3] = useState(null);
  const [successMsg3, setSuccessMsg3] = useState(null);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState(0);
  const [countryList, setCountryList] = useState([]);
  const [addressData, setAddressData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setEmail(user?.email || "");
        setGender(user?.genderId || "0");
        setMobile(user?.mobile || "");

        // Fetch address
        const searchAddressResponse = await searchAddress({
          userId: user?._id,
        });
        if (searchAddressResponse?.success) {
          setAddressData(searchAddressResponse);
          setAddressLine1(searchAddressResponse?.data.line1 || "");
          setAddressLine2(searchAddressResponse?.data.line2 || "");
          setCity(searchAddressResponse?.data.city || "");
          setProvince(searchAddressResponse?.data.province || "");
          setPostalCode(searchAddressResponse?.data.postalCode || "");
          setCountry(searchAddressResponse?.data.countryId || 0);
        }

        // Fetch country list
        const searchCountryResponse = await countrySearch({ searchData: {} });
        if (searchCountryResponse) {
          setCountryList(searchCountryResponse?.countryList);
        }

        // Fetch gender list
        const searchGenderResponse = await genderSearch({ searchData: {} });
        if (searchGenderResponse) {
          setGenderList(searchGenderResponse?.genderList);
        }
      }
      setIsLoading(false);
    }

    fetchData();
  }, [user]);
  async function handlePersonalDataOnSubmit(event) {
    event.preventDefault();
    if (mobile !== "" && !/^\+?[1-9]\d{1,14}$/.test(mobile)) {
      setSuccessMsg1(null);
      setErrorMsg1("Please Enter a Valid Mobile Number");
    }
    const updateUserResponse = await UpdateUser({
      email,
      updateData: { firstName, lastName, genderId: gender, mobile },
    });

    if (updateUserResponse?.success) {
      setErrorMsg1(null);
      setSuccessMsg1("Successfully Updated");
    } else {
      setSuccessMsg1(null);
      setErrorMsg1(
        updateUserResponse?.message.includes("fails to match the required")
          ? "Please Enter a Valid Mobile Number"
          : updateUserResponse?.message
      );
    }
    setTimeout(() => {
      setSuccessMsg1(null);
      setErrorMsg1(null);
    }, 3000);
  }

  async function handleChangePasswordOnSubmit(event) {
    event.preventDefault();
    if (currentPassword === "") {
      setSuccessMsg2(null);
      setErrorMsg2("Please Enter Your Current Password");
    } else if (newPassword === "") {
      setSuccessMsg2(null);
      setErrorMsg2("Please Enter a new Password");
    } else if (confirmPassword === "") {
      setSuccessMsg2(null);
      setErrorMsg2("Confirm the Password You've Entered");
    } else {
      const userPasswordChangeResponse = await userPasswordChange({
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (
        userPasswordChangeResponse?.message.includes(
          '"newPassword" length must be at least 8'
        )
      ) {
        setSuccessMsg2(null);
        setErrorMsg2("New password should contain atlease 8 characters");
      } else if (
        userPasswordChangeResponse?.message.includes("Incorrect Password")
      ) {
        setSuccessMsg2(null);
        setErrorMsg2("Invalid Current Password");
      } else if (
        userPasswordChangeResponse?.message.includes("Password doesn't match")
      ) {
        setSuccessMsg2(null);
        setErrorMsg2(userPasswordChangeResponse?.message);
      } else {
        setErrorMsg2(null);
        setSuccessMsg2("Password successfully Updated");
        setTimeout(() => {
          setErrorMsg2(null);
          setSuccessMsg2(null);
        }, 3000);
      }
    }
  }
  async function handleChangeAddressOnSubmit(event) {
    event.preventDefault();
    if (addressLine1 === "") {
      setSuccessMsg3(null);
      setErrorMsg3("Please fill your Address Line 1");
    } else if (addressLine2 === "") {
      setSuccessMsg3(null);
      setErrorMsg3("Please fill your Address Line 2");
    } else if (city === "") {
      setSuccessMsg3(null);
      setErrorMsg3("Please fill your City / Town");
    } else if (province === "") {
      setSuccessMsg3(null);
      setErrorMsg3("Please fill your State / Province / Region");
    } else if (postalCode === "") {
      setSuccessMsg3(null);
      setErrorMsg3("Please fill your Postal Code / ZIP Code");
    } else if (country === 0) {
      setSuccessMsg3(null);
      setErrorMsg3("Please select your Country");
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
        setErrorMsg3(null);
        setSuccessMsg3(createAddress?.message);
      } else {
        setSuccessMsg3(null);
        setErrorMsg3(createAddress?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg3(null);
      setErrorMsg3(null);
    }, 3000);
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className=" w-full flex flex-col justify-center items-center ">
        <svg
          className="w-20 h-20 text-white dark:text-white"
          aria-hidden="true"
          xmlns="https://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

        <span className=" font-bold text-[45px] text-white">My Profile</span>
      </div>

      <div className=" w-full lg:w-2/3 p-4 flex flex-col">
        <h2 className=" my-4 font-semibold text-xl text-white">User Info</h2>
        {successMsg1 ? (
          <div
            className=" w-5/6 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg1}</span>
          </div>
        ) : null}
        {errorMsg1 ? (
          <div
            className="w-5/6 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg1}</span>
          </div>
        ) : null}
        <div className="space-y-6">
          <div className="w-full flex md:flex-row md:justify-between flex-col ">
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                First name
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                  name="first-name"
                  type="text"
                  value={firstName}
                  className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="Enter First Name"
                />
              </div>
            </div>
            <div className="md:w-2/5 w-full">
              <label className="text-gray-100 text-sm mb-1 block">
                Last name
                <span className="text-gray-400">
                  <span className=" text-red-600 text-lg"> &#8902;</span>
                  required
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setLastName(event.target.value);
                  }}
                  name="last-name"
                  type="text"
                  value={lastName}
                  className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="Enter Last name"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-100 text-sm mb-1 block">
              Email
              <span className="text-gray-400">
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                name="email"
                type="email"
                value={email}
                disabled
                className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="w-full flex md:flex-row md:justify-between flex-col ">
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                Gender<span className="text-gray-400"> optional</span>
              </label>
              <div className="relative flex items-center">
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(event) => {
                    setGender(event.target.value);
                  }}
                  className="text-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent cursor-pointer bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                >
                  <option value={"0"} className=" bg-gray-800">
                    Select Gender
                  </option>
                  {genderList.map((genderItem, index) => (
                    <option
                      key={index}
                      value={genderItem._id}
                      className=" bg-gray-800"
                    >
                      {genderItem.gender}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:w-2/5 w-full mb-6 md:mb-0">
              <label className="text-gray-100 text-sm mb-1 block">
                Mobile Number<span className="text-gray-400"> optional</span>
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setMobile(event.target.value);
                  }}
                  name="mobile"
                  type="text"
                  value={mobile}
                  className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                  placeholder="Enter Mobile Number"
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full mt-4 flex justify-center">
          <button
            onClick={handlePersonalDataOnSubmit}
            type="button"
            className=" border-none py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
      <div className=" w-full lg:w-2/3 p-4 flex flex-col">
        <h2 className=" my-4 font-semibold text-xl text-white">
          Change Password
        </h2>
        {successMsg2 ? (
          <div
            className=" w-5/6 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg2}</span>
          </div>
        ) : null}
        {errorMsg2 ? (
          <div
            className="w-5/6 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg2}</span>
          </div>
        ) : null}
        <div className=" mb-6">
          <label className="text-gray-100 text-sm mb-2 block">
            Current Password
            <span className="text-gray-400">
              <span className=" text-red-600 text-lg"> &#8902;</span>required
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              onChange={(event) => {
                setCurrentPassword(event.target.value);
              }}
              name="currentPassword"
              type={isCurrentPasswordVisible ? "text" : "password"}
              required
              className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
              placeholder="Enter Current password"
            />
            <svg
              xmlns="https://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4 cursor-pointer"
              viewBox="0 0 128 128"
              onClick={() => {
                setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
              }}
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>
        <div className=" mb-6">
          <label className="text-gray-100 text-sm mb-2 block">
            New Password
            <span className="text-gray-400">
              <span className=" text-red-600 text-lg"> &#8902;</span>required
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
              name="newPassword"
              type={isNewPasswordVisible ? "text" : "password"}
              required
              className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
              placeholder="Enter New password"
            />
            <svg
              xmlns="https://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4 cursor-pointer"
              viewBox="0 0 128 128"
              onClick={() => {
                setIsNewPasswordVisible(!isNewPasswordVisible);
              }}
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>
        <div className=" mb-6">
          <label className="text-gray-100 text-sm mb-2 block">
            Confirm Password
            <span className="text-gray-400">
              <span className=" text-red-600 text-lg"> &#8902;</span>required
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              name="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              required
              className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
              placeholder="Confirm password"
            />
            <svg
              xmlns="https://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4 cursor-pointer"
              viewBox="0 0 128 128"
              onClick={() => {
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
              }}
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>
        <div className=" w-full mt-4 flex justify-center">
          <button
            onClick={handleChangePasswordOnSubmit}
            type="button"
            className=" border-none py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
          >
            Change Password
          </button>
        </div>
      </div>
      <div className=" w-full lg:w-2/3 p-4 flex flex-col">
        <h2 className=" my-4 font-semibold text-xl text-white">
          Address Details
        </h2>
        {successMsg3 ? (
          <div
            className=" w-5/6 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg3}</span>
          </div>
        ) : null}
        {errorMsg3 ? (
          <div
            className="w-5/6 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg3}</span>
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
              value={addressLine1}
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
              value={addressLine2}
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
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setCity(event.target.value);
                }}
                name="city"
                type="text"
                value={city}
                className="text-white bg-white  bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                placeholder="City / Town"
              />
            </div>
          </div>
          <div className="md:w-2/5 w-full">
            <label className="text-gray-100 text-sm mb-1 block">
              State / Province / Region
              <span className="text-gray-400">
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setProvince(event.target.value);
                }}
                name="province"
                type="text"
                value={province}
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
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setPostalCode(event.target.value);
                }}
                name="postalCode"
                type="text"
                value={postalCode}
                className="text-white bg-white bg-opacity-15 outline-none focus:outline-none focus:outline-transparent border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md focus:border-yellow-500 placeholder:text-gray-300"
                placeholder="Postal Code / ZIP Code"
              />
            </div>
          </div>
          <div className="md:w-2/5 w-full mb-6 md:mb-0">
            <label className="text-gray-100 text-sm mb-1 block">
              Country
              <span className="text-gray-400">
                <span className=" text-red-600 text-lg"> &#8902;</span>required
              </span>
            </label>
            <div className="relative flex items-center">
              <select
                id="country"
                name="country"
                value={country}
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
            className=" border-none  py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
