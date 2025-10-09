import { AdminAuthContext } from "@/context/AdminAuthContext";
import PageLoading from "@/pages/PageLoading";
import {
  countrySearch,
  genderSearch,
  searchAddress,
  searchAdmin,
  UpdateAdmin,
} from "@/services";
import { useContext, useEffect, useState } from "react";

function Admins() {
  const { admin } = useContext(AdminAuthContext);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allAdminsList, setAllAdminsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null); // Track the open accordion ID
  const [addressData, setAddressData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [genderData, setGenderData] = useState(null);

  useEffect(() => {
    const searchData = searchTerm
      ? { email: { $regex: searchTerm, $options: "i" } }
      : {};
    searchAllAdmins({ searchData, pagination: { page: currentPage, limit } });
  }, [currentPage, limit, searchTerm]);

  const searchAllAdmins = async (searchData) => {
    const response = await searchAdmin(searchData, {
      page: currentPage,
      limit,
    });
    setIsLoading(false);

    if (response?.success) {
      setAllAdminsList(response.adminData);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    }
  };

  const toggleAccordion = (id, genderId) => {
    if (openAccordion === id) {
      setOpenAccordion(null);
      setAddressData(null);
      setCountryData(null);
      setGenderData(null);
    } else {
      setOpenAccordion(id);
      fetchAdminDetails(id, genderId);
    }
  };

  const fetchAdminDetails = async (id, genderId) => {
    const addressResponse = await searchAddress({ userId: id });
    if (addressResponse?.success) {
      setAddressData(addressResponse.data[0]);
      fetchCountryDetails(addressResponse.data.countryId);
    }

    if (genderId && genderId !== "0") {
      fetchGenderDetails(genderId);
    }
  };

  const fetchCountryDetails = async (countryId) => {
    const countryResponse = await countrySearch({
      searchData: { _id: countryId },
    });
    if (countryResponse?.success) {
      setCountryData(countryResponse.countryList[0].name);
    }
  };

  const fetchGenderDetails = async (genderId) => {
    const genderResponse = await genderSearch({
      searchData: { _id: genderId },
    });
    if (genderResponse?.success) {
      setGenderData(genderResponse.genderList[0].gender);
    }
  };

  const handleAccountStatusOnClick = async (email) => {
    if (admin?.accountStatus !== 2) {
      setErrorMsg("Access Denied");
      return;
    }

    const adminSearchResponse = await searchAdmin({ searchData: { email } });
    if (!adminSearchResponse?.success) {
      setErrorMsg("Something went wrong");
      return;
    }

    const accountStatus = adminSearchResponse.adminData[0].accountStatus;
    const newStatus = accountStatus === 1 ? 0 : 1;

    const adminUpdateResponse = await UpdateAdmin({
      email,
      updateData: { accountStatus: newStatus },
    });
    if (adminUpdateResponse?.success) {
      setSuccessMsg("Account status updated successfully");
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setErrorMsg("Something went wrong");
    }

    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  };

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center">
        <svg
          className="w-20 h-20 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
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

        <span className="font-bold text-white text-[45px]">Admins</span>
      </div>
      <div className="w-full py-5 flex justify-center">
        <div className="bg-white bg-opacity-15 flex px-4 py-3 border border-gray-300 rounded-lg focus-within:border-yellow-500 min-w-[60%] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18px"
            className="fill-white mr-3"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            type="text"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            placeholder="Search Admins"
            className="w-full outline-none bg-transparent text-sm  placeholder:text-gray-300"
          />
        </div>
      </div>
      <div className="w-full divide-y rounded-lg max-w-7xl mx-auto p-4 my-8">
        {successMsg ? (
          <div
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg}</span>
          </div>
        ) : null}
        {errorMsg ? (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg}</span>
          </div>
        ) : null}
        {allAdminsList.map((singleAdmin) => (
          <div
            key={singleAdmin._id}
            className="mb-5 focus:ring-transparent border-none"
            onClick={() =>
              toggleAccordion(singleAdmin._id, singleAdmin.genderId)
            }
          >
            <button
              type="button"
              className="bg-white bg-opacity-15 hover:border-transparent outline-none hover:bg-white hover:bg-opacity-20 w-full text-left font-semibold p-4 text-gray-100 focus:ring-transparent flex items-center focus:outline-none"
            >
              <div className="flex flex-col space-y-4">
                <span className="text-gray-200">{singleAdmin.email}</span>
                <span className="text-gray-200">
                  {singleAdmin.firstName + " " + singleAdmin.lastName}
                </span>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={() => {
                      if (admin?.accountStatus === 2) {
                        handleAccountStatusOnClick(singleAdmin?.email);
                      } else {
                        setErrorMsg("Only Super Admin Can Suspend an Admin");
                        window.location.reload();
                      }
                    }}
                    className="sr-only peer"
                    defaultChecked={
                      singleAdmin?.accountStatus === 1 ||
                      singleAdmin?.accountStatus === 2
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-200">
                    {singleAdmin?.accountStatus === 1
                      ? "Active Admin"
                      : singleAdmin?.accountStatus === 2
                        ? "Super Admin"
                        : "Suspended Admin"}
                  </span>
                </label>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto"
              >
                {openAccordion === singleAdmin._id ? (
                  <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                ) : (
                  <path d="M21 0C23.776 0 26 2.224 26 4.941V16h11.059C39.776 16 42 18.282 42 21s-2.224 5-4.941 5H26v11.059C26 39.776 23.718 42 21 42s-5-2.224-5-4.941V26H4.941C2.224 26 0 23.718 0 21s2.224-5 4.941-5H16V4.941C16 2.224 18.224 0 21 0z" />
                )}
              </svg>
            </button>
            {openAccordion === singleAdmin._id && (
              <div className="pt-3 px-3 bg-white bg-opacity-10 w-full flex md:flex-row flex-col md:justify-center">
                <div className=" w-full space-y-3 py-4 ps-4">
                  <p className="text-2xl font-semibold text-gray-300 overflow-hidden">
                    {singleAdmin.firstName}'s Info
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {singleAdmin.firstName + " " + singleAdmin.lastName}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {singleAdmin.email}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {singleAdmin.mobile || "------------------------------"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {singleAdmin.accountStatus === 1
                      ? "Active Admin"
                      : singleAdmin.accountStatus === 2
                        ? "Super Admin"
                        : "Suspended Admin"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {genderData || "------------------------------"}
                  </p>
                </div>
                <div className=" w-full space-y-3 py-4 ps-4">
                  <p className="text-2xl font-semibold text-gray-300 overflow-hidden">
                    {singleAdmin.firstName}'s Address
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {addressData?.line1 || "------------------------------"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {addressData?.line2 || "------------------------------"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {addressData?.city || "------------------------------"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {addressData?.province || "------------------------------"}
                  </p>
                  <p className="text-md text-gray-300 overflow-hidden">
                    &#11050;&nbsp;
                    {countryData || "------------------------------"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className=" w-full flex justify-end pe-4 mb-2 text-white">
        per page :&nbsp;&nbsp;
        <select
          className=" bg-white bg-opacity-15 border-none select rounded-md w-[60px] border-2"
          onChange={(event) => setLimit(event.target.value)}
        >
          <option value="5" className="bg-gray-800">5</option>
          <option value="10" className="bg-gray-800">10</option>
          <option value="25" className="bg-gray-800">25</option>
          <option value="50" className="bg-gray-800">50</option>
          <option value="100" className="bg-gray-800">100</option>
        </select>
      </div>
      <div className=" w-full mb-10">
        <ul className="flex space-x-5 justify-center font-[sans-serif]">
          <li
            className={
              currentPage === 1
                ? "flex items-center justify-center shrink-0 border bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
                : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer w-9 h-9 rounded-md"
            }
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-300"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={
                index + 1 === currentPage
                  ? "flex items-center justify-center shrink-0 bg-yellow-400  border hover:border-yellow-400 border-yellow-400 cursor-pointer text-base font-bold text-black px-[13px] h-9 rounded-md"
                  : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer text-base font-bold text-black px-[13px] h-9 rounded-md"
              }
            >
              {index + 1}
            </li>
          ))}
          <li
            className={
              currentPage === totalPages
                ? "flex items-center justify-center shrink-0 border bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
                : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer w-9 h-9 rounded-md"
            }
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-300 rotate-180"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Admins;
