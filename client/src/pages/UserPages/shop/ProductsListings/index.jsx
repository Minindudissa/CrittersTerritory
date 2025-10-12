import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  productImageSearch,
  productSearch,
  reviewSearch,
  searchPromotion,
} from "@/services";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../../Common-Sections/countDownTimer";
import { SearchContext } from "@/context/SearchContext";
import { ProductTypeContext } from "@/context/ProductTypeContext";
import { CategoryContext } from "@/context/CategoryContext";

function Listings() {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productImageList, setProductImageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [promotionList, setPromotionList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const { searchText, setSearchText } = useContext(SearchContext);
  const { productType, setProductType } = useContext(ProductTypeContext);
  const { category, setCategory } = useContext(CategoryContext);

const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const [
          productSearchResponse,
          productImageSearchResponse,
          categorySearchResponse,
          reviewSearchResponse,
          searchPromotionResponse,
        ] = await Promise.all([
          productSearch({
            searchData: {
              ...(searchText === ""
                ? {}
                : { title: { $regex: searchText, $options: "i" } }),
              ...(productType === "All" ? {} : { productType: productType }),
              ...(category === "All" ? {} : { categoryId: category }),
              status: "1",
            },
            pagination: { page: currentPage, limit: limit },
          }),
          productImageSearch({ searchData: {} }),
          categorySearch({ searchData: { status: 1 } }),
          reviewSearch({ searchData: {} }),
          searchPromotion({ searchData: { isActive: true } }),
        ]);

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse.productList);
          setCurrentPage(productSearchResponse?.currentPage);
          setTotalPages(productSearchResponse?.totalPages);
        }
        if (reviewSearchResponse?.success) {
          setReviewList(reviewSearchResponse.reviewList);
        }
        if (categorySearchResponse?.success) {
          setCategoryList(categorySearchResponse.categoryList);
        }

        if (productImageSearchResponse?.success) {
          setProductImageList(productImageSearchResponse.productImageList);
        }
        if (searchPromotionResponse?.success) {
          setPromotionList(searchPromotionResponse.promotionList);
        }
        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [productType, category, currentPage, limit, searchText]);

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="font-sans w-full">
      <div className=" w-full flex-row p-4 flex justify-end items-center">
        <a
          onClick={() => navigate("/voucher")}
          className="flex cursor-pointer items-center bg-white bg-opacity-15 rounded-lg shadow-lg flex-row hover:bg-opacity-20 w-10/12"
        >
          <img
            className="object-cover w-36 rounded-s-lg h-auto"
            src="/assets/Site_Images/Gift Voucher/Gift_Voucher_Banner.png"
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Gift Vouchers
            </h5>
            <p className="mb-3 font-normal text-gray-200">
              Present a heartfelt gift to the one you cherish most.
            </p>
          </div>
        </a>
      </div>
      <div className=" w-full flex flex-row justify-center">
        <div className=" w-1/6 mt-16 text-white p-2 ps-4">
          <div className=" mt-10">
            <p className=" text-white mb-3 text-lg font-semibold">
              Product type
            </p>
            {["All", "Digital", "Physical"].map((type, index) => (
              <div key={type} className="flex items-center mb-4">
                <input
                  id={`productType${index}`}
                  type="radio"
                  value={type}
                  name="productType"
                  defaultChecked={productType === type}
                  onChange={() => setProductType(type)}
                  className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor={`productType${index}`}
                  className="ml-2 text-sm font-medium cursor-pointer text-gray-100 dark:text-gray-300"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className=" mt-10">
            <p className=" text-white mb-3 text-lg font-semibold">Category</p>
            {["all", ...categoryList].map((categoryItem, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  id={`category-${index}`}
                  type="radio"
                  value={categoryItem._id || "All"}
                  name="category"
                  defaultChecked={category === (categoryItem._id || "All")}
                  onChange={() => setCategory(categoryItem._id || "All")}
                  className="w-4 h-4 text-yellow-600 cursor-pointer bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor={`category-${index}`}
                  className="ml-2 cursor-pointer text-sm font-medium text-gray-100 dark:text-gray-300"
                >
                  {categoryItem.name || "All"}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className=" w-5/6 p-4">
          <p className=" text-white text-2xl mb-4">Shop</p>
          {productList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {productList.map((productItem, Index) => (
                <div
                  key={Index}
                  onClick={() =>
                    navigate(`../product-details/${productItem._id}`, {
                      replace: true,
                    })
                  }
                  className="bg-white bg-opacity-15 p-3 rounded-md flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-105 ease-in-out hover:ease-in-out duration-300"
                >
                  <div className="w-full relative group">
                    {/* Default Image */}
                    <div className="w-full relative group">
                      {/* Default Image */}
                      <div className="opacity-100 transition-opacity hover:ease-in-out duration-300 ease-in-out group-hover:opacity-0">
                        {productImageList
                          .filter(
                            (productImageItem) =>
                              productImageItem.productId === productItem._id
                          )
                          .map((productImageItem, productImageItemIndex) => (
                            <img
                              key={productImageItemIndex}
                              src={`http://${myIp}:5000/${productImageItem.imagePath[0]}`}
                              alt="Product 1"
                              className="w-full object-cover object-top aspect-[230/307] rounded-md"
                            />
                          ))}
                      </div>

                      {/* Overlay Digital Banner (Only for Digital Products) */}
                      {productItem.productType === "Digital" && (
                        <img
                          src="/assets/Digital_Banner/Digital_Banner.png"
                          className="absolute top-0 left-0 w-full h-full z-10 opacity-100 transition-opacity duration-300 ease-in-out"
                          alt="Digital banner"
                        />
                      )}
                    </div>

                    {/* Hover Image */}
                    <div className="absolute hover:ease-in-out top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                      {productImageList.map(
                        (productImageItem, productImageItemIndex) =>
                          productImageItem.productId === productItem._id ? (
                            <img
                              key={productImageItemIndex}
                              src={`http://${myIp}:5000/${productImageItem.imagePath[1]}`} // Show second image on hover
                              alt="Product 2"
                              className="w-full object-cover object-top aspect-[230/307] rounded-md"
                            />
                          ) : null
                      )}
                    </div>
                  </div>

                  <div className="p-2 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h5 className="text-lg sm:text-base font-bold text-gray-100 truncate">
                        {productItem.title}
                      </h5>
                      <p className="mt-1 text-gray-300 truncate">
                        {productItem.description}
                      </p>
                      {reviewList.some(
                        (reviewItem) => reviewItem.productId === productItem._id
                      ) && (
                        <div className="flex items-center space-x-1 mt-2">
                          {(() => {
                            // Filter the reviews for the specific product
                            const filteredReviews = reviewList.filter(
                              (reviewItem) =>
                                reviewItem.productId === productItem._id
                            );

                            // Calculate total rating and average rating for the filtered reviews
                            const totalRating = filteredReviews.reduce(
                              (acc, reviewItem) => acc + reviewItem.rating,
                              0
                            );
                            const averageRating =
                              totalRating / filteredReviews.length;

                            const fullStars = Math.floor(averageRating);
                            const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
                            const emptyStars = 5 - fullStars - halfStar;

                            return (
                              <>
                                {/* Full Stars */}
                                {Array.from({ length: fullStars }).map(
                                  (_, i) => (
                                    <svg
                                      key={`full-star-${i}`}
                                      className="w-4 h-4 fill-[#facc15]"
                                      viewBox="0 0 14 13"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                    </svg>
                                  )
                                )}

                                {/* Half Star */}
                                {halfStar > 0 && (
                                  <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                  >
                                    <path
                                      d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                                      fill="#facc15"
                                      style={{ clipPath: "inset(0 50% 0 0)" }}
                                    />
                                    <path
                                      d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                                      fill="#CED5D8"
                                      style={{ clipPath: "inset(0 0 0 50%)" }}
                                    />
                                  </svg>
                                )}

                                {/* Empty Stars */}
                                {Array.from({ length: emptyStars }).map(
                                  (_, i) => (
                                    <svg
                                      key={`empty-star-${i}`}
                                      className="w-4 h-4 fill-[#CED5D8]"
                                      viewBox="0 0 14 13"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                    </svg>
                                  )
                                )}

                                {/* Rating Display */}
                                <p className="text-sm text-white !ml-3">
                                  {Math.round(averageRating * 2) / 2} (
                                  {filteredReviews.length})
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      )}
                      <div className="flex 2xl:flex-row flex-col 2xl:items-center 2xl:justify-between gap-1 mt-2">
                        {promotionList.length > 0
                          ? promotionList.filter(
                              (promotion) =>
                                (promotion.productType ===
                                  productItem.productType ||
                                  promotion.productType === "Both") &&
                                (promotion.categoryId ===
                                  productItem.categoryId ||
                                  promotion.categoryId === "1")
                            ).length > 0
                            ? promotionList
                                .filter(
                                  (promotion) =>
                                    (promotion.productType ===
                                      productItem.productType ||
                                      promotion.productType === "Both") &&
                                    (promotion.categoryId ===
                                      productItem.categoryId ||
                                      promotion.categoryId === "1")
                                )
                                .map((promotion) => {
                                  if (productItem.productType === "Physical") {
                                    // Find the minimum price from variations
                                    const minPrice =
                                      productItem.variations.reduce(
                                        (min, variation) =>
                                          Math.min(
                                            min,
                                            parseFloat(variation.price)
                                          ),
                                        Infinity
                                      );

                                    const discountedPrice =
                                      (minPrice * (100 - promotion.value)) /
                                      100;

                                    return (
                                      <React.Fragment key={promotion.id}>
                                        <p className=" bg-pink-600 py-1 px-4 text-white font-semibold">
                                          {promotion.value}% Off
                                        </p>
                                        <CountdownTimer
                                          endDate={promotion.endDate}
                                        />
                                      </React.Fragment>
                                    );
                                  } else if (
                                    productItem.productType === "Digital"
                                  ) {
                                    const discountedPrice =
                                      (productItem.basePrice *
                                        (100 - promotion.value)) /
                                      100;

                                    return (
                                      <React.Fragment key={promotion.id}>
                                        <p className=" bg-pink-600 py-1 px-4 text-white font-semibold">
                                          {promotion.value}% Off
                                        </p>
                                        <CountdownTimer
                                          endDate={promotion.endDate}
                                        />
                                      </React.Fragment>
                                    );
                                  }
                                  return null;
                                })
                            : null
                          : null}
                      </div>
                      <div className="flex flex-row items-baseline gap-1 mt-2">
                        {promotionList.length > 0 ? (
                          promotionList.filter(
                            (promotion) =>
                              (promotion.productType ===
                                productItem.productType ||
                                promotion.productType === "Both") &&
                              (promotion.categoryId ===
                                productItem.categoryId ||
                                promotion.categoryId === "1")
                          ).length > 0 ? (
                            promotionList
                              .filter(
                                (promotion) =>
                                  (promotion.productType ===
                                    productItem.productType ||
                                    promotion.productType === "Both") &&
                                  (promotion.categoryId ===
                                    productItem.categoryId ||
                                    promotion.categoryId === "1")
                              )
                              .map((promotion) => {
                                if (productItem.productType === "Physical") {
                                  // Find the minimum price from variations
                                  const minPrice =
                                    productItem.variations.reduce(
                                      (min, variation) =>
                                        Math.min(
                                          min,
                                          parseFloat(variation.price)
                                        ),
                                      Infinity
                                    );

                                  const discountedPrice =
                                    (minPrice * (100 - promotion.value)) / 100;

                                  return (
                                    <React.Fragment key={promotion.id}>
                                      <span className=" text-3xl flex flex-row items-baseline text-white font-bold">
                                        ${discountedPrice.toFixed(2)}+
                                      </span>
                                      <strike className="text-xl text-gray-300 font-semibold">
                                        ${minPrice.toFixed(2)}+
                                      </strike>
                                    </React.Fragment>
                                  );
                                } else if (
                                  productItem.productType === "Digital"
                                ) {
                                  const discountedPrice =
                                    (productItem.basePrice *
                                      (100 - promotion.value)) /
                                    100;

                                  return (
                                    <React.Fragment key={promotion.id}>
                                      <span className="text-3xl flex flex-row items-baseline text-white font-bold">
                                        ${discountedPrice.toFixed(2)}
                                      </span>
                                      <strike className="text-xl text-gray-300 font-semibold">
                                        ${productItem.basePrice.toFixed(2)}
                                      </strike>
                                    </React.Fragment>
                                  );
                                }
                                return null;
                              })
                          ) : productItem.productType === "Physical" ? (
                            <span className="text-3xl text-white font-bold">
                              $
                              {Number(
                                productItem.variations.reduce(
                                  (min, variation) => {
                                    return Math.min(
                                      min,
                                      parseFloat(variation.price)
                                    );
                                  },
                                  Infinity
                                )
                              ).toFixed(2)}
                              +
                            </span>
                          ) : (
                            productItem.productType === "Digital" && (
                              <span className="text-3xl text-white font-bold">
                                ${Number(productItem.basePrice).toFixed(2)}
                              </span>
                            )
                          )
                        ) : // No promotion, show the regular price
                        productItem.productType === "Physical" ? (
                          <span className="text-3xl text-white font-bold">
                            $
                            {Number(
                              productItem.variations.reduce(
                                (min, variation) => {
                                  return Math.min(
                                    min,
                                    parseFloat(variation.price)
                                  );
                                },
                                Infinity
                              )
                            ).toFixed(2)}
                            +
                          </span>
                        ) : (
                          productItem.productType === "Digital" && (
                            <span className="text-3xl text-white font-bold">
                              ${Number(productItem.basePrice).toFixed(2)}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center w-full gap-4 h-full">
              <p className="text-white text-xl">No Products Found :(</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setProductType("All");
                  setSearchText("");
                }}
                className=" text-yellow-400 hover:text-white focus:outline-transparent focus:outline-none hover:border-none hover:border-transparent border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm text-center "
              >
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
      <div className=" my-6">
        <div className=" w-full flex justify-end pe-4 mt-4 mb-2 text-white">
          per page :&nbsp;&nbsp;
          <select
            className=" cursor-pointer bg-white bg-opacity-15 p-1 border-none outline-none focus:outline-transparent select rounded-md w-[60px] border-2"
            onChange={(event) => {
              setLimit(event.target.value);
              setCurrentPage(1);
            }}
            value={limit}
          >
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
                  ? "flex items-center justify-center shrink-0 border  bg-white p-3 bg-opacity-10 border-none w-9 h-9 rounded-md"
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
                  ? "flex items-center justify-center shrink-0 border  bg-white p-3 bg-opacity-10 border-none w-9 h-9 rounded-md"
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
    </div>
  );
}

export default Listings;
