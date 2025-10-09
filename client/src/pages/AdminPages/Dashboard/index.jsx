import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  ClipboardList,
  Tickets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  orderSearch,
  productSearch,
  searchUser,
  searchVoucher,
} from "@/services";
import PageLoading from "@/pages/PageLoading";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalOrderItems, setTotalOrderItems] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalVoucherRevenue, setTotalVoucherRevenue] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading
        const orderSearchResponse = await orderSearch({
          searchData: {},
        });

        const productSearchResponse = await productSearch({
          searchData: {},
          pagination: {},
        });
        const searchUserResponse = await searchUser({ searchData: {} });
        const searchVoucherResponse = await searchVoucher({ searchData: {} });

        if (orderSearchResponse?.success) {
          setOrderList(orderSearchResponse.OrderList);

          const totalItems = orderSearchResponse.OrderList.reduce(
            (total, order) => {
              return total + (order.orderItems?.length || 0);
            },
            0
          );

          setTotalOrderItems(totalItems);

          const totalValue = orderSearchResponse.OrderList.reduce(
            (total, order) => {
              const subtotal = Number(order.subtotal) || 0;
              const discount = Number(order.discount) || 0;
              return total + (subtotal - discount);
            },
            0
          );

          setTotalRevenue(totalValue);
        }

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse?.productList);
        }

        if (searchUserResponse?.success) {
          setUserList(searchUserResponse?.userData);
        }

        if (searchVoucherResponse?.success) {
          const totalVoucherValue = searchVoucherResponse?.voucherList.reduce(
            (total, item) => {
              return total + (Number(item.value) || 0);
            },
            0
          );

          setTotalVoucherRevenue(totalVoucherValue);
        }
        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: orderList.length,
      icon: <ShoppingCart className="text-blue-500 w-6 h-6" />,
    },
    {
      title: "Total Order Items",
      value: totalOrderItems,
      icon: <ClipboardList className="text-pink-500 w-6 h-6" />,
    },
    {
      title: "Registered Customers",
      value: userList.length,
      icon: <Users className="text-green-500 w-6 h-6" />,
    },
    {
      title: "Products",
      value: productList.length,
      icon: <Package className="text-yellow-500 w-6 h-6" />,
    },
    {
      title: "Revenue",
      value: "$" + totalRevenue?.toFixed(2),
      icon: <DollarSign className="text-purple-500 w-6 h-6" />,
    },
    {
      title: "Voucher Revenue",
      value: "$" + totalVoucherRevenue?.toFixed(2),
      icon: <Tickets className="text-teal-500 w-6 h-6" />,
    },
  ];

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white bg-opacity-15 rounded-2xl shadow-md p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-300">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-100">
                {stat.value}
              </p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white bg-opacity-15 rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Recent Orders
          </h2>
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-gray-200">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {orderList.map((item) =>
                item.orderStatus === "1" || item.orderStatus === "2" ? (
                  <tr>
                    <td className="py-2">{item.orderId}</td>
                    <td className="py-2">
                      {userList.find(
                        (userItem) => userItem._id === item.userId
                      )?.firstName +
                        " " +
                        userList.find(
                          (userItem) => userItem._id === item.userId
                        )?.lastName}
                    </td>
                    <td className="py-2">
                      $
                      {Number(
                        Number(item.subtotal) - Number(item.discount)
                      ).toFixed(2)}
                    </td>
                    {item.orderStatus === "1" ? (
                      <td className="py-2 text-blue-500">Payment Accepted</td>
                    ) : item.orderStatus === "2" ? (
                      <td className="py-2 text-yellow-500">Processing</td>
                    ) : null}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={() => navigate("../orders")}
          className="bg-bg-black border border-white hover:border-black hover:bg-white hover:text-black text-white px-4 py-2 rounded-2xl transition outline-none focus:outline-none focus:outline-transparent"
        >
          All Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
