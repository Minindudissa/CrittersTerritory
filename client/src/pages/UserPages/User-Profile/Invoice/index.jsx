import { UserAuthContext } from "@/context/UserAuthContext";
import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  countrySearch,
  createReview,
  orderSearch,
  orderUpdate,
  productImageSearch,
  productSearch,
  reviewSearch,
  searchAddress,
  searchUser,
  uploadReviewImages,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

function Invoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserAuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [review, setReview] = useState(null);
  const [Images, setImages] = useState([]); // Store selected Images
  const [imageUploadProgress, setImageUploadProgress] = useState({}); // Track upload progress for each file
  const [errorMessageImages, setErrorMessageImages] = useState("");
  const [rating, setRating] = useState(0);

  const allowedImageTypes = [
    "image/jpeg", // .jpg, .jpeg
    "image/png", // .png
    "image/gif", // .gif
    "video/avi", // .avi
    "video/mov", // .mov
    "video/mkv", // .mkv (additional video format)
  ];

  const maxImageCount = 2;
  const maxGifCount = 1;
  const maxVideoCount = 1;

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    // Separate Images into categories
    const images = selectedImages.filter((file) =>
      file.type.startsWith("image/")
    );
    const gifs = selectedImages.filter((file) => file.type === "image/gif");
    const videos = selectedImages.filter((file) =>
      file.type.startsWith("video/")
    );

    // Check if the file count exceeds the limit
    if (
      images.length + gifs.length + videos.length >
      maxImageCount + maxGifCount + maxVideoCount
    ) {
      setErrorMessageImages(
        "You can upload a maximum of 10 images, 1 GIF, and 1 video."
      );
      return;
    }

    // Check individual category limits
    if (
      Images.filter((file) => file.file.type.startsWith("image/")).length +
        images.length >
      maxImageCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxImageCount} images.`
      );
      return;
    }
    if (
      Images.filter((file) => file.file.type === "image/gif").length +
        gifs.length >
      maxGifCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxGifCount} GIF.`
      );
      return;
    }
    if (
      Images.filter((file) => file.file.type.startsWith("video/")).length +
        videos.length >
      maxVideoCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxVideoCount} video.`
      );
      return;
    }

    // Filter Images by allowed types
    const filteredImages = selectedImages.filter((file) =>
      allowedImageTypes.includes(file.type)
    );

    if (filteredImages.length < selectedImages.length) {
      setErrorMessageImages(
        "Some Images were ignored because they are not allowed."
      );
    } else {
      setErrorMessageImages("");
    }

    const uniqueImages = filteredImages.filter(
      (file) =>
        !Images.some((existingFile) => existingFile.file.name === file.name)
    );

    const mappedImages = uniqueImages.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`, // Unique ID for each file
      uploaded: false,
    }));

    setImages((prevImages) => [...prevImages, ...mappedImages]);

    // Simulate temporary upload progress
    mappedImages.forEach((file) => simulateTempImageUpload(file.id));
  };

  const simulateTempImageUpload = (id) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImageUploadProgress((prev) => ({
        ...prev,
        [id]: progress,
      }));
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  const handleImageRemove = (id) => {
    setImages((prevImages) => prevImages.filter((file) => file.id !== id));
    setImageUploadProgress((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renderFilePreview = (file) => {
    if (file.file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file.file)}
          alt={file.file.name}
          className="w-16 h-16 object-cover rounded"
        />
      );
    } else if (file.file.type === "image/gif") {
      return (
        <img
          src={URL.createObjectURL(file.file)}
          alt={file.file.name}
          className="w-16 h-16 object-cover rounded"
        />
      );
    } else if (file.file.type.startsWith("video/")) {
      return (
        <video width="80" height="80" controls>
          <source src={URL.createObjectURL(file.file)} type={file.file.type} />
        </video>
      );
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const orderSearchResponse = await orderSearch({
          searchData: { orderId: id },
          pagination: {},
        });

        if (orderSearchResponse?.success) {
          setOrderList(orderSearchResponse?.OrderList);

          const searchAddressResponse = await searchAddress({
            searchData: { userId: user?._id },
          });

          if (searchAddressResponse?.success) {
            setAddressList(searchAddressResponse?.data[0]);

            const countrySearchResponse = await countrySearch({
              searchData: { _id: searchAddressResponse?.data?.countryId },
            });

            if (countrySearchResponse?.success) {
              setCountryList(countrySearchResponse?.countryList);

              const productSearchResponse = await productSearch({
                searchData: {},
                pagination: {},
              });

              if (productSearchResponse?.success) {
                setProductList(productSearchResponse?.productList);

                const reviewSearchResponse = await reviewSearch({
                  searchData: {},
                });

                if (reviewSearchResponse?.success) {
                  setReviewList(reviewSearchResponse?.reviewList);
                }
              }
            }
          }
        }

        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user]);

  function handleAddReviewOnClick(productId, orderId) {
    setReviewProductId(productId);
    setReviewOrderId(orderId);

    setIsModalOpen(true);
  }

  async function handleCreateReviewOnClick(event) {
    event.preventDefault();

    if (rating === 0) {
      toast.error("Please select the rating", {
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
    } else if (review === "" || review === null) {
      toast.error("Please type your review", {
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
      const timeNow = new Date().toLocaleString("en-US");

      const createReviewResponse = await createReview({
        name: user?.firstName + " " + user?.lastName,
        rating: rating,
        dateTime: timeNow,
        review: review,
        productId: reviewProductId,
        orderId: reviewOrderId,
      });

      if (createReviewResponse?.success) {
        if (Images.length > 0) {
          const reviewId = createReviewResponse?.createdReviewData._id;

          const formData = new FormData();
          formData.append("reviewId", reviewId);

          for (let i = 0; i < Images.length; i++) {
            formData.append("file", Images[i].file);
          }

          const reviewImageCreateResponse = await uploadReviewImages(formData);
          if (reviewImageCreateResponse.success) {
            window.location.reload();
          } else {
            setSuccessMsg(null);
            toast.error(reviewImageCreateResponse?.message, {
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
          }
        } else {
          window.location.reload();
        }
      } else {
        setSuccessMsg(null);
        toast.error(createProductResponse?.message, {
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
      }
    }
  }

  async function handleOrderStatusOnClick() {
    if (orderList[0]?.orderStatus === "3") {
      const result = window.confirm(
        "Would you like to confirm that this order has been received?"
      );
      if (result) {
        const now = new Date().toLocaleString();
        const orderUpdateResponse = await orderUpdate({
          updateSelectData: { orderId: id },
          updateData: {
            orderStatus: "4",
            orderStatusChangedDateTime:
              orderList[0]?.orderStatusChangedDateTime + " - " + now,
          },
        });

        if (orderUpdateResponse.success) {
          window.location.reload();
        }
      }
    }
  }
  
  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
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
      />
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative bg-black rounded-lg shadow p-6 w-full max-w-md max-h-[75vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold text-white ">
                Create New Product
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setReviewProductId(null);
                  setReviewOrderId(null);
                }}
                className="hover:border-none border-none outline-none focus:outline-none focus:outline-transparent rounded-lg p-2 bg-transparent"
              >
                ❌
              </button>
            </div>

            {/* Modal body */}
            <form className="mt-4">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <div className=" w-full rounded-md p-4">
                    <span className="text-lg font-semibold text-white">
                      Product Images
                    </span>
                    {/* Drag and Drop Upload UI */}
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-images"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white bg-opacity-15 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 hover:bg-opacity-20 dark:border-gray-600 dark:hover:border-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="https://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            .JPG .PNG .GIF
                          </p>
                        </div>
                        <input
                          id="dropzone-images"
                          name="file"
                          type="file"
                          className="hidden"
                          multiple
                          formEncType="multipart/form-data"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {errorMessageImages && (
                      <p className="text-red-500 text-sm mb-4">
                        {errorMessageImages}
                      </p>
                    )}

                    {/* Display Uploaded Images */}
                    <div className="mt-6 space-y-4">
                      {Images.length > 0 ? (
                        Images.map((file) => (
                          <div
                            key={file.id}
                            className="relative border p-4 rounded shadow-sm flex items-center justify-between bg-white bg-opacity-15 border-none"
                          >
                            <div className="flex-grow flex items-center space-x-4">
                              {renderFilePreview(file)}
                              <div className="flex-grow overflow-hidden">
                                <p className="font-medium text-gray-100">
                                  {file.file.name}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                  <div
                                    className={`h-4 ${imageUploadProgress[file.id] === 100 ? "bg-yellow-400" : "bg-yellow-400"} rounded-full transition-all duration-300 ease-in-out`}
                                    style={{
                                      width: `${imageUploadProgress[file.id] || 0}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">
                                  {imageUploadProgress[file.id]
                                    ? `${imageUploadProgress[file.id]}%`
                                    : "Waiting to upload..."}
                                </p>
                              </div>
                            </div>
                            <a
                              onClick={() => handleImageRemove(file.id)}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-600 text-lg cursor-pointer font-bold"
                              title="Remove file"
                            >
                              ✕
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-200">No Images selected.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 w-full justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <svg
                          className={`w-12 h-12 ${
                            star <= rating ? "text-yellow-500" : "text-gray-400"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 14 14"
                          xmlns="https://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <label className="block mb-2 text-sm font-medium text-gray-100 ">
                    Review
                  </label>
                  <textarea
                    onChange={(event) => {
                      const typedMessage = event.target.value;
                      const formattedMessage = typedMessage.replace(
                        /\n/g,
                        "<br>"
                      );
                      setReview(formattedMessage);
                    }}
                    placeholder="Message"
                    rows="6"
                    className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md px-4 border text-sm pt-2.5 outline-none focus:border-yellow-500"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none border-none hover:border-none focus:outline-transparent font-medium rounded-lg text-sm px-5 py-2.5 "
                onClick={handleCreateReviewOnClick}
              >
                Add new product
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="sm:w-11/12 lg:w-3/4 mx-auto">
        {/* Card */}
        <div className="flex flex-col p-4 sm:p-10 bg-white bg-opacity-15 shadow-md rounded-xl">
          {/* Grid */}
          <div className="flex justify-between">
            <div className=" flex flex-col justify-center items-center">
              <img
                src="/assets/Logo/Critters Territory Logo.png"
                alt="logo"
                className="w-[100px]"
              />

              <h1 className=" text-xl md:text-2xl font-semibold text-yellow-600">
                Critters Territory LLC
              </h1>
            </div>
            {/* Col */}

            <div className="text-end">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Order ID
              </h2>
              <span className="mt-1 block text-lg font-semibold text-gray-300">
                {orderList[0]?.orderId}
              </span>
              {orderList[0]?.orderStatus === "3" ? (
                <button
                  onClick={() => handleOrderStatusOnClick()}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 border-none focus:outline-none text-black "
                >
                  Order Received
                </button>
              ) : null}

              {/* <address className="mt-4 not-italic text-gray-300">
                45 Roker Terrace
                <br />
                Latheronwheel
                <br />
                KW5 8NW, London
                <br />
                United Kingdom
                <br />
              </address> */}
            </div>
            {/* Col */}
          </div>
          {/* End Grid */}

          {/* Grid */}
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Bill to:</h3>
              <h3 className="text-lg font-semibold mt-2 text-gray-300">
                {user?.firstName + " " + user?.lastName}
              </h3>
              <address className=" not-italic text-gray-300">
                {addressList.line1 + ", " + addressList.line2},
                <br />
                {addressList.city + ", " + addressList.province},
                <br />
                {countryList[0]?.name + "."}
                <br />
                {addressList.postalCode}
                <br />
                <strong>{user?.email}</strong>
                <br />
                {user?.mobile === "" ? null : (
                  <>
                    <strong>{user?.mobile}</strong>
                    <br />
                  </>
                )}
              </address>
            </div>
            {/* Col */}

            <div className="sm:text-end space-y-2">
              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-100">
                    Order Date Time:
                  </dt>
                  <dd className="col-span-2 text-gray-300">
                    {orderList[0]?.orderDateTime}
                  </dd>
                </dl>
              </div>
              {/* End Grid */}
            </div>
            {/* Col */}
          </div>
          {/* End Grid */}
          {/* Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              {" "}
              {/* Adjust this based on actual table width */}
              <div className="overflow-x-auto">
                <table className="w-full my-4 border-collapse border rounded-lg text-white bg-white bg-opacity-10">
                  <thead>
                    <tr className="bg-white bg-opacity-15">
                      <th className="p-3 border border-gray-700">Product</th>
                      <th className="p-3 border border-gray-700">
                        Product Type
                      </th>
                      <th className="p-3 border border-gray-700">Qty</th>
                      <th className="p-3 border border-gray-700">Rate</th>
                      <th className="p-3 border border-gray-700">Amount</th>
                      <th className="p-3 border border-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList[0]?.orderItems?.map(
                      (orderProductItem, Index) => (
                        <tr
                          key={Index}
                          className="border border-gray-700 hover:bg-white hover:bg-opacity-5"
                        >
                          <td
                            className="p-3 border border-gray-700 text-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                "/product-details/" +
                                  orderProductItem.productId,
                                "_blank"
                              )
                            }
                          >
                            {
                              productList.find(
                                (product) =>
                                  product._id === orderProductItem.productId
                              )?.title
                            }
                            <br />
                            <span className="txtgr300">
                              {orderProductItem?.variant?.includes(
                                "Multi Color"
                              )
                                ? `${orderProductItem?.multiColorColorList?.join(" | ")} - ${orderProductItem?.variant.split("-").slice(1).join("-").trim()}`
                                : orderProductItem?.variant}
                            </span>
                          </td>
                          <td
                            className={`p-3 border border-gray-700 ${
                              orderProductItem.productType === "Digital"
                                ? "text-green-500"
                                : "text-yellow-500"
                            } text-center`}
                          >
                            {orderProductItem.productType}
                          </td>
                          <td className="p-3 border border-gray-700 text-center">
                            {orderProductItem.quantity}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col justify-center items-center">
                              {orderProductItem.discountedPrice !== null ? (
                                <>
                                  <strike className="text-gray-300">
                                    ${Number(orderProductItem.price).toFixed(2)}
                                  </strike>
                                  <span className="font-semibold text-gray-100">
                                    $
                                    {Number(
                                      orderProductItem.discountedPrice
                                    ).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-gray-100">
                                  ${Number(orderProductItem.price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 border border-gray-700 text-center">
                            $
                            {orderProductItem.discountedPrice !== null
                              ? (
                                  Number(orderProductItem.quantity) *
                                  Number(orderProductItem.discountedPrice)
                                ).toFixed(2)
                              : (
                                  Number(orderProductItem.quantity) *
                                  Number(orderProductItem.price)
                                ).toFixed(2)}
                          </td>
                          <td className="p-3 border border-gray-700 text-center">
                            {orderProductItem.productType === "Digital" ? (
                              <a
                                className="cursor-pointer text-yellow-500 hover:text-yellow-400"
                                onClick={() =>
                                  window.open(
                                    productList.find(
                                      (p) =>
                                        p._id === orderProductItem.productId
                                    )?.sharableLink,
                                    "_blank"
                                  )
                                }
                              >
                                Download
                              </a>
                            ) : null}
                            <br />
                            {reviewList.some(
                              (review) =>
                                review.productId ===
                                  orderProductItem.productId &&
                                review.orderId === orderList[0]?.orderId
                            ) ? (
                              <span className="text-green-500">
                                Review already added
                              </span>
                            ) : orderList[0]?.orderStatus === "4" ? (
                              <a
                                onClick={() =>
                                  handleAddReviewOnClick(
                                    orderProductItem.productId,
                                    orderList[0]?.orderId
                                  )
                                }
                                className="cursor-pointer text-gray-300 hover:text-gray-400"
                              >
                                Write a Review
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* End Table */}

          {/* Flex */}
          <div className="mt-8 flex sm:justify-end">
            <div className="w-full max-w-2xl sm:text-end space-y-2">
              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-100">
                    Subtotal:
                  </dt>
                  <dd className="col-span-2 text-gray-300">
                    ${Number(orderList[0]?.subtotal).toFixed(2)}
                  </dd>
                </dl>

                {orderList[0]?.discount !== null ? (
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-100">
                      Discount{" "}
                      <span className=" text-gray-300 font-normal text-sm">
                        ({orderList[0]?.promocode_voucherCode})
                      </span>
                      :
                    </dt>
                    <dd className="col-span-2 text-gray-300">
                      - ${Number(orderList[0]?.discount).toFixed(2)}
                    </dd>
                  </dl>
                ) : null}

                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-100">
                    Shipping{" "}
                    <span className=" text-gray-300 font-normal text-sm">
                      ({orderList[0]?.shippingType})
                    </span>
                    :
                  </dt>
                  <dd className="col-span-2 text-gray-300">
                    ${Number(orderList[0]?.shipping).toFixed(2)}
                  </dd>
                </dl>

                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-100">
                    Total:
                  </dt>
                  <dd className="col-span-2 text-gray-300">
                    $
                    {(
                      Number(orderList[0]?.subtotal) +
                      Number(orderList[0]?.shipping) -
                      Number(orderList[0]?.discount)
                    ).toFixed(2)}
                  </dd>
                </dl>
              </div>
              {/* End Grid */}
            </div>
          </div>
          {/* End Flex */}

          <div className="mt-8 sm:mt-12">
            <h4 className="text-lg font-semibold text-gray-100">
              Thank you for your business !
            </h4>
            <p className="text-gray-300 mt-2">
              If you have any questions concerning this invoice, use the
              following contact information:
            </p>
            <div>
              <p className="block text-sm font-semibold text-gray-300">
                critersterritory@gmail.com /{" "}
                <a
                  className="cursor-pointer"
                  onClick={() => navigate("/contact-us")}
                >
                  Contact Us
                </a>
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-300">
            © Critters Territory. All rights reserved.
          </p>
        </div>
        {/* End Card */}
      </div>
    </div>
  );
}

export default Invoice;
