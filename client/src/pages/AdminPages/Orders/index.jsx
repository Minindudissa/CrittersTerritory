import { UserAuthContext } from "@/context/UserAuthContext";
import PageLoading from "@/pages/PageLoading";
import {
  countrySearch,
  orderSearch,
  orderUpdate,
  productImageSearch,
  productSearch,
  searchAddress,
  searchUser,
  sendEmail,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

function AllOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(UserAuthContext);

  const [imageList, setImageList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading
        const orderSearchResponse = await orderSearch({
          searchData:
            searchTerm === ""
              ? {}
              : { orderId: { $regex: searchTerm, $options: "i" } },
          pagination: { page: currentPage, limit: limit },
        });

        const productImageSearchResponse = await productImageSearch({
          searchData: {},
        });

        const productSearchResponse = await productSearch({
          searchData: {},
          pagination: {},
        });

        const searchAddressResponse = await searchAddress({ searchData: {} });
        const countrySearchResponse = await countrySearch({ searchData: {} });
        const searchUserResponse = await searchUser({ searchData: {} });

        if (orderSearchResponse?.success) {
          setOrderList(orderSearchResponse.OrderList);
          setCurrentPage(orderSearchResponse?.currentPage);
          setTotalPages(orderSearchResponse?.totalPages);
        }

        if (productImageSearchResponse?.success) {
          setImageList(productImageSearchResponse.productImageList);
        }

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse?.productList);
        }

        if (searchAddressResponse?.success) {
          setAddressList(searchAddressResponse?.data);
        }

        if (countrySearchResponse?.success) {
          setCountryList(countrySearchResponse?.countryList);
        }

        if (searchUserResponse?.success) {
          setUserList(searchUserResponse?.userData);
        }
        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentPage, limit, searchTerm]);

  async function handleOrderStatusOnClick(orderId, userId) {
    const orderSearchResponse = await orderSearch({
      searchData: { orderId },
      pagination: {},
    });

    if (orderSearchResponse.success) {
      if (orderSearchResponse?.OrderList[0]?.orderStatus === "1") {
        const result = window.confirm(
          "Are you sure you want to change order status to Processing?"
        );
        if (result) {
          const now = new Date().toLocaleString();
          const orderUpdateResponse = await orderUpdate({
            updateSelectData: { orderId },
            updateData: { orderStatus: "2", orderStatusChangedDateTime: now },
          });
          if (orderUpdateResponse.success) {
            const emailContent = `
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">
                Critters Territory
              </div>
              <div style="padding: 20px; text-align: left; line-height: 1.6; color: #333; font-size: 16px;">
                <p>Dear ${
                  userList?.find((userItem) => userItem._id === userId)
                    ?.firstName +
                  " " +
                  userList?.find((userItem) => userItem._id === userId)
                    ?.lastName
                },</p>
                <p>We are writing to confirm that your order has been successfully received and is currently being processed.</p>
                <p>Please find your order details below:</p>
                <div style="margin: 20px 0; padding: 10px 20px; background-color: #f7f7f7; border-radius: 6px; font-size: 16px;">
                  Order ID: <strong>${orderId}</strong><br>
                </div>
                <p>You will receive a follow-up notification as soon as your order has been dispatched.</p>
                <p>If you have any questions or require further assistance, please feel free to contact our support team.</p>
                <p>Thank you for choosing Critters Territory.</p>
                <p>Best regards,<br>
                <strong>Critters Territory Team</strong></p>
              </div>
              <div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 15px;">
                &copy; 2025 Critters Territory. All rights reserved.<br>
                <a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">www.crittersterritory.com</a>
              </div>
            </div>`;

            if (user !== null) {
              const sendPromoEmailResponse = await sendEmail({
                toName: `${user?.firstName} ${user?.firstName}`,
                toEmail: user?.email,
                subject: "Order Processing - Critters Territory",
                emailContent,
                replyToEmail: "crittersterritory@gmail.com",
                replyToName: "Critters Territory",
              });
              if (sendPromoEmailResponse.success) {
                window.location.reload();
              }
            }
          }
        }
      } else if (orderSearchResponse?.OrderList[0]?.orderStatus === "2") {
        if (tracking === null || tracking === "") {
          toast.error("Please enter the tracking number", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        } else {
          const result = window.confirm(
            "Are you sure you want to change order status to Dispatched?"
          );
          if (result) {
            const now = new Date().toLocaleString();
            const orderUpdateResponse = await orderUpdate({
              updateSelectData: { orderId },
              updateData: {
                orderStatus: "3",
                orderStatusChangedDateTime:
                  orderSearchResponse?.OrderList[0]
                    ?.orderStatusChangedDateTime +
                  " - " +
                  now,
                trackingNo: tracking,
              },
            });

            if (orderUpdateResponse.success) {
              const emailContent = `
              <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
               <div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">
                 Critters Territory
                </div>
                <div style="padding: 20px; text-align: left; line-height: 1.6; color: #333; font-size: 16px;">
                  <p>Dear ${
                    userList?.find((userItem) => userItem._id === userId)
                      ?.firstName +
                    " " +
                    userList?.find((userItem) => userItem._id === userId)
                      ?.lastName
                  },</p>
                  <p>We’re pleased to inform you that your order has been successfully dispatched and is now on its way to you.</p>
                  <p>Here are your shipment details:</p>
                  <div style="margin: 20px 0; padding: 10px 20px; background-color: #f7f7f7; border-radius: 6px; font-size: 16px;">
                    Order ID: <strong>${orderId}</strong><br>
                    Courier Service: <strong>${orderSearchResponse?.OrderList[0]?.shippingType === "Standard Shipping" ? "SL POST" : orderSearchResponse?.OrderList[0]?.shippingType === "Expedited Shipping" ? "DHL" : null}</strong><br>
                    Tracking Number: <strong>${tracking}</strong><br>
                    Track Your Shipment: <a href="${orderSearchResponse?.OrderList[0]?.shippingType === "Standard Shipping" ? "https://parcelsapp.com/en/tracking" : orderSearchResponse?.OrderList[0]?.shippingType === "Expedited Shipping" ? "https://www.dhl.com/lk-en/home/tracking.html" : null}" style="color: #007bff; text-decoration: none;" target="_blank">${orderSearchResponse?.OrderList[0]?.shippingType === "Standard Shipping" ? "Universal Tracking" : orderSearchResponse?.OrderList[0]?.shippingType === "Expedited Shipping" ? "DHL Tracking" : null}</a>
                  </div>
                  <p>Please allow some time for the tracking information to update on the courier’s website.</p>
                  <p>If you have any questions or concerns regarding your delivery, feel free to contact us.</p>
                  <p>Thank you for shopping with Critters Territory!</p>
                  <p>Best regards,<br>
                  <strong>Critters Territory Team</strong></p>
                </div>
                <div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 15px;">
                  &copy; 2025 Critters Territory. All rights reserved.<br>
                  <a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">www.crittersterritory.com</a>
                </div>
              </div>`;

              if (user !== null) {
                const sendPromoEmailResponse = await sendEmail({
                  toName: `${user?.firstName} ${user?.firstName}`,
                  toEmail: user?.email,
                  subject: "Order Dispatched - Critters Territory",
                  emailContent,
                  replyToEmail: "crittersterritory@gmail.com",
                  replyToName: "Critters Territory",
                });
                if (sendPromoEmailResponse.success) {
                  window.location.reload();
                }
              }
            }
          }
        }
      } else if (orderSearchResponse?.OrderList[0]?.orderStatus === "3") {
        const result = window.confirm(
          "Are you sure you want to change order status to Delivered?"
        );
        if (result) {
          const now = new Date().toLocaleString();
          const orderUpdateResponse = await orderUpdate({
            updateSelectData: { orderId },
            updateData: {
              orderStatus: "4",
              orderStatusChangedDateTime:
                orderSearchResponse?.OrderList[0]?.orderStatusChangedDateTime +
                " - " +
                now,
            },
          });

          if (orderUpdateResponse.success) {
            const courier = orderSearchResponse?.OrderList[0]?.shippingType;
            const courierName =
              courier === "Standard Shipping"
                ? "SL POST"
                : courier === "Expedited Shipping"
                  ? "DHL"
                  : "Unknown Courier";
            const trackingUrl =
              courier === "Standard Shipping"
                ? `https://www.17track.net/en/track?nums=${tracking}`
                : courier === "Expedited Shipping"
                  ? `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${tracking}`
                  : "#";

            const emailContent = `
              <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
               <div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">
                 Critters Territory
                </div>
                <div style="padding: 20px; text-align: left; line-height: 1.6; color: #333; font-size: 16px;">
                  <p>Dear ${
                    userList?.find((userItem) => userItem._id === userId)
                      ?.firstName +
                    " " +
                    userList?.find((userItem) => userItem._id === userId)
                      ?.lastName
                  },</p>
                  <p>We’re happy to let you know that your order has been successfully delivered 🎉</p>
                  <p>We hope you’re enjoying your new items from Critters Territory!</p>
                  <p>Here are your delivery details for reference:</p>
                  <div style="margin: 20px 0; padding: 10px 20px; background-color: #f7f7f7; border-radius: 6px; font-size: 16px;">
                    Order ID: <strong>${orderId}</strong><br>
                    Courier Service: <strong>${orderSearchResponse?.OrderList[0]?.shippingType === "Standard Shipping" ? "SL POST" : orderSearchResponse?.OrderList[0]?.shippingType === "Expedited Shipping" ? "DHL" : null}</strong><br>
                  </div>
                  <p>If everything arrived in good condition, we’d love to hear your feedback or see a review!</p>
                  <p>If you have any concerns or didn’t receive your order as expected, please contact us right away and we’ll be happy to assist you.</p>
                  <p>Thank you once again for supporting our small business.</p>
                  <p>Warm regards,<br>
                  <strong>Critters Territory Team</strong></p>
                </div>
                <div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 15px;">
                  &copy; 2025 Critters Territory. All rights reserved.<br>
                  <a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">www.crittersterritory.com</a>
                </div>
              </div>`;

            if (user !== null) {
              const sendPromoEmailResponse = await sendEmail({
                toName: `${user?.firstName} ${user?.firstName}`,
                toEmail: user?.email,
                subject: "Delivery Confirmation - Critters Territory",
                emailContent,
                replyToEmail: "crittersterritory@gmail.com",
                replyToName: "Critters Territory",
              });
              if (sendPromoEmailResponse.success) {
                window.location.reload();
              }
            }
          }
        }
      }
    }
  }
  return (
    <div className=" w-full flex flex-col justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />{" "}
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

        <span className=" font-bold text-[45px] text-white">All Orders</span>
      </div>
      <div className="w-full py-5 flex justify-center">
        <div className="bg-white bg-opacity-15 flex px-4 py-3 border border-gray-300 rounded-lg focus-within:border-yellow-500 min-w-[60%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18px"
            className="fill-gray-300 mr-3"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            type="text"
            onChange={(event) => {
              setsearchTerm(event.target.value);
            }}
            placeholder="Search Order"
            className="w-full outline-none text-white placeholder:text-gray-300 bg-transparent text-sm"
          />
        </div>
      </div>
      {isLoading ? (
        <PageLoading />
      ) : (
        orderList.map((orderItem, Index) => (
          <div className="w-full p-4 bg-white bg-opacity-15 my-3 flex md:flex-row flex-col justify-between">
            <div className=" md:w-7/12 w-full flex flex-col md:justify-start justify-center items-center ">
              <div className=" w-full flex flex-col justify-start items-center">
                <div className=" w-full ">
                  <span className=" text-white">#{orderItem.orderId}</span>
                  <span className=" text-gray-300 ms-4">
                    $
                    {Number(
                      Number(orderItem.subtotal) -
                        Number(orderItem.discount) +
                        Number(orderItem.shipping)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className=" w-full flex flex-col">
                  {orderItem?.orderItems?.map((item) => (
                    <>
                      <div className=" w-full flex flex-row p-1 gap-2">
                        <div className="w-full sm:w-3/12 p-2 flex justify-start items-start">
                          <div className="w-full relative group">
                            <div>
                              <img
                                key={orderItem.productId}
                                src={`http://localhost:5000/${
                                  imageList.find(
                                    (image) =>
                                      image.productId === item.productId
                                  )?.imagePath[0]
                                }`}
                                className="w-full h-auto max-w-xs aspect-square object-contain"
                              />
                            </div>
                            {item.productType === "Digital" && (
                              <img
                                src="/src/assets/Digital_Banner/Digital_Banner.png"
                                className="absolute top-0 left-0 w-full h-full z-10 opacity-100 transition-opacity duration-300 ease-in-out"
                                alt="Digital banner"
                              />
                            )}
                          </div>
                        </div>

                        <div className=" w-4/5 flex flex-col gap-1">
                          <span className=" text-white">
                            {
                              productList.find(
                                (product) => product._id === item.productId
                              )?.title
                            }
                          </span>
                          <span className=" text-white">
                            Quantity:{" "}
                            <strong className=" text-gray-300">
                              {item?.quantity}
                            </strong>
                          </span>
                          <span className="text-white">
                            {productList
                              .find((product) => product._id === item.productId)
                              ?.variationsList?.map((variationsItem, index) => {
                                const variantValue =
                                  item.variant.split(" - ")[index] || "";
                                const isMultiColor =
                                  variantValue.includes("Multi Color");

                                return (
                                  <p
                                    key={index}
                                    className="mb-1 font-normal text-gray-300"
                                  >
                                    {variationsItem} : {variantValue}
                                    {isMultiColor &&
                                    item.multiColorColorList?.length
                                      ? " | " +
                                        item.multiColorColorList.join(" , ")
                                      : ""}
                                  </p>
                                );
                              })}
                          </span>

                          {item.discountedPrice !== null ? (
                            <div className=" flex flex-row gap-2">
                              <span className="font-semibold text-gray-100">
                                ${Number(item.discountedPrice).toFixed(2)}
                              </span>
                              <strike className="text-gray-300">
                                ${Number(item.price).toFixed(2)}
                              </strike>
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-100">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className=" md:w-5/12 w-full">
              <div className=" w-full mb-4">
                <span className=" text-gray-300">
                  Order Date Time {orderList[0]?.orderDateTime}
                </span>
              </div>
              {orderItem.orderItems?.length === 1 &&
              orderItem.orderItems[0]?.productType === "Digital" ? null : (
                <>
                  <div className="w-full flex flex-col space-y-1 p-2 text-white">
                    {(orderItem.orderStatus === "1" ||
                      orderItem.orderStatus === "2" ||
                      orderItem.orderStatus === "3" ||
                      orderItem.orderStatus === "4") && (
                      <div className="flex justify-between w-full">
                        <span className="text-start w-5/12 text-gray-200">
                          Payment Accepted
                        </span>
                        <span className="text-center w-1/12 text-gray-200">
                          &#8667;
                        </span>
                        <span className="text-end w-6/12 text-gray-200">
                          {orderItem?.orderDateTime}
                        </span>
                      </div>
                    )}

                    {(orderItem.orderStatus === "2" ||
                      orderItem.orderStatus === "3" ||
                      orderItem.orderStatus === "4") && (
                      <div className="flex justify-between w-full">
                        <span className="text-start w-5/12 text-gray-200">
                          Processing
                        </span>
                        <span className="text-center w-1/12 text-gray-200">
                          &#8667;
                        </span>
                        <span className="text-end w-6/12 text-gray-200">
                          {
                            orderItem.orderStatusChangedDateTime?.split(
                              "-"
                            )?.[0]
                          }
                        </span>
                      </div>
                    )}

                    {(orderItem.orderStatus === "3" ||
                      orderItem.orderStatus === "4") && (
                      <div className="flex justify-between w-full">
                        <span className="text-start w-5/12 text-gray-200">
                          Dispatched
                        </span>
                        <span className="text-center w-1/12 text-gray-200">
                          &#8667;
                        </span>
                        <span className="text-end w-6/12 text-gray-200">
                          {
                            orderItem.orderStatusChangedDateTime?.split(
                              "-"
                            )?.[1]
                          }
                        </span>
                      </div>
                    )}

                    {orderItem.orderStatus === "4" && (
                      <div className="flex justify-between w-full">
                        <span className="text-start w-5/12 text-gray-200">
                          Delivered
                        </span>
                        <span className="text-center w-1/12 text-gray-200">
                          &#8667;
                        </span>
                        <span className="text-end w-6/12 text-gray-200">
                          {
                            orderItem.orderStatusChangedDateTime?.split(
                              "-"
                            )?.[2]
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  <div className=" w-full flex flex-row justify-center">
                    {orderItem.orderStatus === "1" && (
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 border-none hover:border-none focus:outline-none focus:outline-transparent outline-none text-white px-10"
                        onClick={() =>
                          handleOrderStatusOnClick(
                            orderItem.orderId,
                            orderItem.userId
                          )
                        }
                      >
                        Process
                      </button>
                    )}
                    {orderItem.orderStatus === "2" && (
                      <div className="w-full flex flex-col items-center justify-center space-y-2">
                        <input
                          onChange={(event) => setTracking(event.target.value)}
                          name="last-name"
                          type="text"
                          className="text-white bg-white outline-none focus:outline-transparent bg-opacity-15 placeholder:text-gray-300 border border-gray-300 w-[300px] text-sm px-4 py-2.5 rounded-md"
                          placeholder="Enter Tracking Number"
                        />
                        <button
                          className="bg-orange-500 hover:bg-orange-600 border-none focus:outline-none text-white px-10 py-2 rounded-md"
                          onClick={() =>
                            handleOrderStatusOnClick(
                              orderItem.orderId,
                              orderItem.userId
                            )
                          }
                        >
                          Dispatch
                        </button>
                      </div>
                    )}
                    {orderItem.orderStatus === "3" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 border-none hover:border-none focus:outline-none focus:outline-transparent outline-none text-white px-10"
                        onClick={() =>
                          handleOrderStatusOnClick(
                            orderItem.orderId,
                            orderItem.userId
                          )
                        }
                      >
                        Delivered
                      </button>
                    )}
                  </div>
                </>
              )}
              <div className="mt-8 flex ">
                <div className="w-full space-y-2">
                  {/* Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-2 p-4 rounded-lg">
                    <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-3 items-start">
                      <dt className="md:col-span-3 font-semibold text-gray-100 text-start">
                        Subtotal:
                      </dt>
                      <dd className="md:col-span-2 text-gray-300 text-end">
                        ${Number(orderItem?.subtotal).toFixed(2)}
                      </dd>
                    </dl>

                    {orderItem?.discount !== null && (
                      <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-3 items-start">
                        <dt className="md:col-span-3 font-semibold text-gray-100 text-start">
                          Discount
                          <span className="text-gray-300 font-normal text-sm">
                            ({orderItem?.promocode_voucherCode})
                          </span>
                          :
                        </dt>
                        <dd className="md:col-span-2 text-gray-300 text-end">
                          - ${Number(orderItem?.discount).toFixed(2)}
                        </dd>
                      </dl>
                    )}

                    <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-3 items-start">
                      <dt className="md:col-span-3 font-semibold text-gray-100 text-start">
                        Shipping: <br />
                        <span className="text-gray-300 font-normal text-sm">
                          ({orderItem?.shippingType})
                        </span>
                      </dt>
                      <dd className="md:col-span-2 text-gray-300 text-end">
                        ${Number(orderItem?.shipping).toFixed(2)}
                      </dd>
                    </dl>

                    <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-3 items-start">
                      <dt className="md:col-span-3 font-semibold text-gray-100 text-start">
                        Total:
                      </dt>
                      <dd className="md:col-span-2 text-gray-300 text-end">
                        $
                        {(
                          Number(orderItem?.subtotal) +
                          Number(orderItem?.shipping) -
                          Number(orderItem?.discount)
                        ).toFixed(2)}
                      </dd>
                    </dl>
                  </div>

                  {/* End Grid */}
                </div>
              </div>
              <div className=" w-full p-4">
                <span className=" text-gray-100">Deliver to:</span>
                {(() => {
                  const user = userList?.find(
                    (userItem) => userItem._id === orderItem.userId
                  );
                  const address = Object.values(addressList || {}).find(
                    (addressItem) => addressItem.userId === orderItem.userId
                  );

                  return (
                    <div className="w-full flex flex-col ps-10 space-y-1">
                      <span className="font-semibold text-gray-200 mb-1">
                        {user?.firstName} {user?.lastName}
                      </span>

                      {orderItem.orderItems.length === 1 &&
                      orderItem?.orderItems[0]?.productType ===
                        "Digital" ? null : (
                        <>
                          <span className=" text-gray-200">
                            {address?.line1}, {address?.line2},
                          </span>

                          <span className=" text-gray-200">
                            {address?.city}, {address?.province},
                          </span>

                          <span className=" text-gray-200">
                            {
                              countryList.find(
                                (countryItem) =>
                                  countryItem._id === address?.countryId
                              )?.name
                            }
                            . {address?.postalCode}
                          </span>
                        </>
                      )}
                      <span className=" text-gray-200 font-semibold">
                        {user?.email}
                      </span>
                      <span className=" text-gray-200">{user?.mobile}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        ))
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

export default AllOrders;
