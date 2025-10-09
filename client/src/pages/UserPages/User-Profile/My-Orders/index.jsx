import { UserAuthContext } from "@/context/UserAuthContext";
import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  orderSearch,
  productImageSearch,
  productSearch,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);
    const { user } = useContext(UserAuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const orderSearchResponse = await orderSearch({
          searchData: {userId:user?._id},
          pagination: { page: currentPage, limit: limit },
        });

        if (orderSearchResponse?.success) {
          setOrderList(orderSearchResponse.OrderList);
          setCurrentPage(orderSearchResponse?.currentPage);
          setTotalPages(orderSearchResponse?.totalPages);
        }

        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentPage, limit,user]);

  return (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className=" w-full flex flex-col justify-center items-center">
        <svg
          className="w-20 h-20 text-white dark:text-white"
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
            d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z"
          />
        </svg>

        <span className=" font-bold text-[45px] text-white">My Order</span>
      </div>
      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="overflow-x-auto px-4 w-full">
          <table className="w-full border-collapse border rounded-lg text-white bg-white bg-opacity-10">
            <thead>
              <tr className="bg-white bg-opacity-15">
                <th className="p-3 border border-gray-700">Order ID</th>
                <th className="p-3 border border-gray-700">Order Date</th>
                <th className="p-3 border border-gray-700">Amount</th>
                <th className="p-3 border border-gray-700">Status</th>
                <th className="p-3 border border-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((orderItem, Index) => (
                <>
                  <tr
                    key={Index}
                    className="border border-gray-700  hover:bg-white hover:bg-opacity-5 cursor-pointer"
                    // onClick={}
                  >
                    <td className="p-3 border border-gray-700 text-center">
                      {orderItem.orderId}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {orderItem.orderDateTime}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      $
                      {Number(
                        Number(orderItem.subtotal) -
                          Number(orderItem.discount) +
                          Number(orderItem.shipping)
                      ).toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {orderItem.orderStatus === "1" ? (
                        <p className="bg-[#4A90E2] text-white px-2 py-1 rounded font-semibold">
                          Payment Accepted
                        </p>
                      ) : orderItem.orderStatus === "2" ? (
                        <p className="bg-[#F5A623] text-white px-2 py-1 rounded font-semibold">
                          Processing
                        </p>
                      ) : orderItem.orderStatus === "3" ? (
                        <p className="bg-[#D96C00] text-white px-2 py-1 rounded font-semibold">
                          Dispatched
                        </p>
                      ) : orderItem.orderStatus === "4" ? (
                        <p className="bg-[#7ED321] text-white px-2 py-1 rounded font-semibold">
                          Delivered
                        </p>
                      ) : null}
                    </td>

                    <td className="p-3 border border-gray-700 text-center">
                      <button
                        onClick={() => navigate("./invoice/" + orderItem.orderId)}
                        className=" text-sm px-2 py-1 bg-gray-700 hover:bg-gray-600 border-none outline-none focus:outline-none focus:outline-transparent"
                      >
                        See Details
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className=" w-full flex justify-end pe-4 mt-4 mb-2 text-white">
        per page :&nbsp;&nbsp;
        <select
          className=" bg-white bg-opacity-15 border-none outline-none focus:outline-transparent select rounded-md w-[60px] border-2"
          onChange={(event) => {
            setLimit(event.target.value);
            setCurrentPage(1);
          }}
          value={limit}
        >
          <option value="10" className=" bg-gray-800">
            10
          </option>
          <option value="25" className=" bg-gray-800">
            25
          </option>
          <option value="50" className=" bg-gray-800">
            50
          </option>
          <option value="100" className=" bg-gray-800">
            100
          </option>
        </select>
      </div>
      <div className=" w-full mb-10">
        <ul className="flex space-x-5 justify-center font-[sans-serif]">
          <li
            className={
              currentPage === 1
                ? "flex items-center justify-center shrink-0 border  bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
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
                  : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer text-base font-bold text-white px-[13px] h-9 rounded-md"
              }
            >
              {index + 1}
            </li>
          ))}
          <li
            className={
              currentPage === totalPages
                ? "flex items-center justify-center shrink-0 border  bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
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

export default MyOrders;
