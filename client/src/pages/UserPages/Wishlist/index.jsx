import PageLoading from "@/pages/PageLoading";
import {
  cartCreate,
  cartSearch,
  cartUpdate,
  productImageSearch,
  productSearch,
  reviewSearch,
  searchPromotion,
  wishlistDelete,
  wishlistSearch,
} from "@/services";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "@/context/UserAuthContext";
function Wishlist() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productImagesList, setProductImagesList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [reviewList, setReviewList] = useState([]);

  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Start loading

      try {
        let wishlistData = [];

        // Fetch promotions first (doesn't depend on user)
        const promotionResponse = await searchPromotion({
          searchData: { isActive: true },
        });
        setPromotionList(
          promotionResponse?.success ? promotionResponse.promotionList : []
        );

        if (user) {
          // Fetch wishlist if user is logged in
          const wishlistResponse = await wishlistSearch({
            searchData: { userId: user._id },
          });
          wishlistData = wishlistResponse?.success
            ? wishlistResponse.wishlist
            : [];
        } else {
          // Fetch wishlist from localStorage
          wishlistData = JSON.parse(localStorage.getItem("wishlistData")) || [];
        }

        setWishlist(wishlistData);

        if (wishlistData.length > 0) {
          const productRequests = wishlistData.map((item) =>
            Promise.all([
              productSearch({ searchData: { _id: item.productId } }),
              productImageSearch({ searchData: { productId: item.productId } }),
              reviewSearch({ searchData: { productId: item.productId } }),
            ])
          );

          const results = await Promise.all(productRequests);

          setProductList(
            results.flatMap(([p]) => (p?.success ? p.productList : []))
          );
          setProductImagesList(
            results.flatMap(([_, img]) =>
              img?.success ? img.productImageList : []
            )
          );
          setReviewList(
            results.flatMap(([_, __, rev]) =>
              rev?.success ? rev.reviewList : []
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }

    fetchData();
  }, [user]); // Re-run only when `user` changes

  async function handleRemoveFromWishlist(productId) {
    if (user !== null) {
      const userWishlistDeleteResponse = await wishlistDelete({
        deleteData: { productId: productId, userId: user._id },
      });

      if (userWishlistDeleteResponse?.success) {
        window.location.reload();
      }
    } else {
      let wishlistData = JSON.parse(localStorage.getItem("wishlistData")) || [];
      let updatedWishlist = wishlistData.filter(
        (wishlistItem) => !(wishlistItem.productId === productId)
      );
      localStorage.setItem("wishlistData", JSON.stringify(updatedWishlist));
      window.location.reload();
    }
  }

  async function handleOnAddToCart(id, wishlistId) {
    if (user === null) {
      //
      productList.map((productItem) => {
        if (productItem._id === id && productItem.productType === "Physical") {
          let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
          let wishlistData =
            JSON.parse(localStorage.getItem("wishlistData")) || [];

          let wishlistItem = wishlistData.find((item) => item.productId === id);
          if (cartData.length > 0) {
            // Find item in cart

            if (wishlistItem) {
              let foundItemInCart = cartData.find(
                (cartItem) =>
                  cartItem.productId === id &&
                  cartItem.variant === wishlistItem.variant &&
                  JSON.stringify(cartItem.multiColorColorList) ===
                    JSON.stringify(wishlistItem.multiColorColorList) // Compare arrays correctly
              );

              if (foundItemInCart) {
                // Update quantity of the found item
                let updatedCart = cartData.map((cartItem) =>
                  cartItem.productId === id &&
                  cartItem.variant === wishlistItem.variant &&
                  JSON.stringify(cartItem.multiColorColorList) ===
                    JSON.stringify(wishlistItem.multiColorColorList)
                    ? {
                        ...cartItem,
                        quantity: Number(foundItemInCart.quantity),
                      }
                    : cartItem
                );

                localStorage.setItem("cartData", JSON.stringify(updatedCart));

                let updatedWishlist = wishlist.filter(
                  (wishItem) => wishItem.productId !== id
                );
                localStorage.setItem(
                  "wishlistData",
                  JSON.stringify(updatedWishlist)
                );

                window.location.reload();
              } else {
                // Add new item to cart
                let newCartData = {
                  productId: id,
                  variant: wishlistItem.variant,
                  multiColorColorList: wishlistItem.multiColorColorList,
                  quantity: 1,
                  userId: "",
                };

                cartData.push(newCartData);
                localStorage.setItem("cartData", JSON.stringify(cartData));

                let updatedWishlist = wishlist.filter(
                  (wishItem) => wishItem.productId !== id
                );
                localStorage.setItem(
                  "wishlistData",
                  JSON.stringify(updatedWishlist)
                );

                window.location.reload();
              }
            }
          } else {
            // Cart is empty, add the first product
            let newCartData = {
              productId: id,
              variant: wishlistItem.variant,
              multiColorColorList: wishlistItem.multiColorColorList,
              quantity: 1,
              userId: "",
            };

            cartData.push(newCartData);
            localStorage.setItem("cartData", JSON.stringify(cartData));

            let updatedWishlist = wishlist.filter(
              (wishItem) => wishItem.productId !== id
            );
            localStorage.setItem(
              "wishlistData",
              JSON.stringify(updatedWishlist)
            );

            window.location.reload();
          }
        } else if (
          productItem._id === id &&
          productItem.productType === "Digital"
        ) {
          let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
          if (cartData.length > 0) {
            let foundItemInCart = cartData.find(
              (cartItem) => cartItem.productId === id
            );

            if (foundItemInCart) {
              let updatedWishlist = wishlist.filter(
                (wishItem) => wishItem.productId !== id
              );
              localStorage.setItem(
                "wishlistData",
                JSON.stringify(updatedWishlist)
              );

              window.location.reload();
            } else {
              let newCartData = {
                productId: id,
                variant: [],
                multiColorColorList: [],
                quantity: 1,
                userId: "",
              };

              cartData.push(newCartData);

              localStorage.setItem("cartData", JSON.stringify(cartData));

              let updatedWishlist = wishlist.filter(
                (wishItem) => wishItem.productId !== id
              );
              localStorage.setItem(
                "wishlistData",
                JSON.stringify(updatedWishlist)
              );

              window.location.reload();
            }
          } else {
            let newCartData = {
              productId: id,
              variant: [],
              multiColorColorList: [],
              quantity: 1,
              userId: "",
            };

            cartData.push(newCartData);

            localStorage.setItem("cartData", JSON.stringify(cartData));

            let updatedWishlist = wishlist.filter(
              (wishItem) => wishItem.productId !== id
            );
            localStorage.setItem(
              "wishlistData",
              JSON.stringify(updatedWishlist)
            );
            window.location.reload();
          }
        }
      });

      //
    } else {
      productList.map(async (productItem) => {
        if (productItem._id === id && productItem.productType === "Physical") {
          const [usercartSearchResponse] = await Promise.all([
            cartSearch({
              searchData: {
                productId: id,
                variant: productItem?.variations?.filter(
                  (variationItem) =>
                    variationItem.combination ===
                    wishlist?.filter(
                      (wishItem) =>
                        wishItem.productId === id &&
                        wishItem.userId === user?._id
                    )[0]?.variant
                )[0].combination,
                ...(wishlist?.filter(
                  (wishItem) =>
                    wishItem._id === wishlistId && wishItem.userId === user?._id
                )[0].multiColorColorList?.length
                  ? {
                      multiColorColorList: wishlist?.filter(
                        (wishItem) =>
                          wishItem._id === wishlistId &&
                          wishItem.userId === user?._id
                      )[0].multiColorColorList,
                    }
                  : {}), // Remove if empty
                userId: user._id,
              },
            }),
          ]);

          if (usercartSearchResponse.cartList.length > 0) {
            const userCartUpdateResponse = await cartUpdate({
              productId: id,
              variant: productItem?.variations?.filter(
                (variationItem) =>
                  variationItem.combination ===
                  wishlist?.filter(
                    (wishItem) =>
                      wishItem.productId === id && wishItem.userId === user?._id
                  )[0]?.variant
              )[0].combination,
              ...(wishlist?.filter(
                (wishItem) =>
                  wishItem._id === wishlistId && wishItem.userId === user?._id
              )[0].multiColorColorList?.length
                ? {
                    multiColorColorList: wishlist?.filter(
                      (wishItem) =>
                        wishItem._id === wishlistId &&
                        wishItem.userId === user?._id
                    )[0].multiColorColorList,
                  }
                : {}), // Remove if empty
              userId: user._id,
              updateData: {
                quantity: Number(usercartSearchResponse.cartList[0].quantity),
              },
            });

            if (userCartUpdateResponse?.success) {
              const userWishlistDeleteResponse = await wishlistDelete({
                deleteData: { _id: wishlistId, userId: user._id },
              });

              if (userWishlistDeleteResponse?.success) {
                toast.success("Cart Updated Successfully", {
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
                setTimeout(() => {
                  window.location.reload();
                }, 6000);
              }
            }
          } else {
            const userCartCreateResponse = await cartCreate({
              productId: id,
              variant: productItem?.variations?.filter(
                (variationItem) =>
                  variationItem.combination ===
                  wishlist?.filter(
                    (wishItem) =>
                      wishItem.productId === id && wishItem.userId === user?._id
                  )[0]?.variant
              )[0].combination,
              ...(wishlist?.filter(
                (wishItem) =>
                  wishItem._id === wishlistId && wishItem.userId === user?._id
              )[0].multiColorColorList?.length
                ? {
                    multiColorColorList: wishlist?.filter(
                      (wishItem) =>
                        wishItem._id === wishlistId &&
                        wishItem.userId === user?._id
                    )[0].multiColorColorList,
                  }
                : {}), // Remove if empty
              quantity: 1,
              userId: user._id,
            });

            if (userCartCreateResponse?.success) {
              const userWishlistDeleteResponse = await wishlistDelete({
                deleteData: { _id: wishlistId, userId: user._id },
              });

              if (userWishlistDeleteResponse?.success) {
                toast.success("Product Added to Your Cart", {
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
                setTimeout(() => {
                  window.location.reload();
                }, 6000);
              }
            }
          }
        } else if (
          productItem._id === id &&
          productItem.productType === "Digital"
        ) {
          const [usercartSearchResponse] = await Promise.all([
            cartSearch({
              searchData: {
                productId: id,
                userId: user._id,
              },
            }),
          ]);

          if (usercartSearchResponse.cartList.length > 0) {
            const userWishlistDeleteResponse = await wishlistDelete({
              deleteData: { productId: id, userId: user._id },
            });

            if (userWishlistDeleteResponse?.success) {
              window.location.reload();
            }
          } else {
            const userCartCreateResponse = await cartCreate({
              productId: id,
              variant: [],
              multiColorColorList: [],
              quantity: "1",
              userId: user._id,
            });

            if (userCartCreateResponse?.success) {
              const userWishlistDeleteResponse = await wishlistDelete({
                deleteData: { productId: id, userId: user._id },
              });

              if (userWishlistDeleteResponse?.success) {
                setSuccessMsg("Product Added to Your Cart");
                window.location.reload();
              }
            }
          }
        }
      });
    }
  }
  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className=" w-full flex flex-col justify-center items-center">
        <svg
          className="w-20 h-20 text-white dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
          />
        </svg>
        <span className=" text-white font-bold text-[45px]">My Wishlist</span>
      </div>
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
      {wishlist.length > 0 ? (
        wishlist.map((wishItem, wishItemIndex) =>
          productList.map((productItem, productItemIndex) =>
            productItem._id === wishItem.productId ? (
              <div
                key={wishItemIndex + "_" + productItemIndex}
                className=" flex flex-col rounded-lg sm:flex-row w-10/12 lg:w-8/12 bg-white bg-opacity-20 my-4 "
              >
                <div
                  className=" relative z-[0] w-full h-96 md:h-auto md:w-48 cursor-pointer"
                  onClick={() =>
                    navigate(`../product-details/${productItem._id}`)
                  }
                >
                  {productImagesList.map(
                    (productImageItem, productImageItemIndex) =>
                      productImageItem.productId === productItem._id ? (
                        <img
                          key={productImageItemIndex} // Add a unique key
                          className="object-cover z-[2] absolute w-full rounded-t-lg h-96 md:h-full md:rounded-none md:rounded-s-lg"
                          src={`http://${myIp}:5000/${productImageItem.imagePath[0]}`}
                          alt=""
                        />
                      ) : null
                  )}

                  {productItem.productType === "Digital" ? (
                    <img
                      src="/assets/Digital_Banner/Digital_Banner.png"
                      className=" relative z-[3] w-full h-fit"
                      alt="Digital banner"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col p-4 leading-normal w-full">
                  {/* Review Here */}
                  <div className="mb-2 flex flex-row items-center">
                    <h5 className=" text-xl font-bold tracking-tight text-white">
                      {productItem.title}
                    </h5>
                    {reviewList.length > 0 &&
                      (() => {
                        const totalRating = reviewList.reduce(
                          (acc, reviewItem) =>
                            reviewItem.productId === productItem._id
                              ? acc + parseInt(reviewItem.rating)
                              : acc,
                          0
                        );

                        const ratingCount = reviewList.filter(
                          (reviewItem) =>
                            reviewItem.productId === productItem._id
                        ).length;

                        const averageRating =
                          ratingCount > 0
                            ? (totalRating / ratingCount).toFixed(1)
                            : null;

                        return averageRating ? (
                          <>
                            &nbsp;&nbsp;<span className=" text-white">|</span>
                            &nbsp;&nbsp;
                            <div className=" items-center space-x-1 inline-flex">
                              <svg
                                className="w-5 h-5 fill-[#facc15]"
                                viewBox="0 0 14 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                              </svg>
                              <span className="text-gray-300 font-medium">
                                {averageRating}
                              </span>
                            </div>
                          </>
                        ) : null;
                      })()}
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="w-full">
                      {productItem.productType === "Digital" ? (
                        <>
                          <p className="mb-1 font-normal text-gray-300 text-lg">
                            3D Printable File
                          </p>
                          {productItem.status === "1" ? (
                            <p className=" text-green-600 text-lg font-semibold">
                              In Stock
                            </p>
                          ) : (
                            <p className=" text-red-600 text-lg font-semibold">
                              Out of Stock
                            </p>
                          )}
                        </>
                      ) : productItem.productType === "Physical" &&
                        productItem.variationsList.length > 0 ? (
                        <>
                          {productItem.variationsList.map(
                            (variationsItem, index) => (
                              <p
                                key={index}
                                className="mb-1 font-normal text-gray-300"
                              >
                                {variationsItem} :
                                {wishItem.variant.split(" - ")[index]}
                                {wishItem.variant
                                  .split(" - ")
                                  [index].includes("Multi Color")
                                  ? " | " +
                                    wishItem.multiColorColorList.join(" , ")
                                  : null}
                              </p>
                            )
                          )}

                          {productItem.variations.filter(
                            (variationItem) =>
                              variationItem.combination === wishItem.variant
                          )[0]?.status === 1 && productItem?.status === "1" ? (
                            <p className=" text-green-600 text-lg font-semibold">
                              In Stock
                            </p>
                          ) : (
                            <p className=" text-red-600 text-lg font-semibold">
                              Out of Stock
                            </p>
                          )}
                        </>
                      ) : null}
                      {promotionList.length > 0 ? (
                        promotionList.filter(
                          (promotion) =>
                            (promotion.productType ===
                              productItem.productType ||
                              promotion.productType === "Both") &&
                            (promotion.categoryId === productItem.categoryId ||
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
                            .map((promotion) =>
                              productItem.productType === "Physical" ? (
                                productItem.variations.map((variationItem) =>
                                  variationItem.combination ===
                                  wishItem.variant ? (
                                    <>
                                      <span className="text-3xl text-white font-semibold">
                                        $
                                        {Number(
                                          (variationItem.price *
                                            (100 - promotion.value)) /
                                            100
                                        ).toFixed(2)}
                                      </span>
                                      &nbsp;&nbsp;
                                      <strike className="font-semibold text-xl text-gray-400">
                                        $
                                        {Number(variationItem.price).toFixed(2)}
                                      </strike>
                                    </>
                                  ) : null
                                )
                              ) : productItem.productType === "Digital" ? (
                                <>
                                  <span className="text-3xl text-white font-semibold">
                                    $
                                    {Number(
                                      (productItem.basePrice *
                                        (100 - promotion.value)) /
                                        100
                                    ).toFixed(2)}
                                  </span>
                                  &nbsp;&nbsp;
                                  <strike className="font-semibold text-xl text-gray-400">
                                    ${Number(productItem.basePrice).toFixed(2)}
                                  </strike>
                                </>
                              ) : null
                            )
                        ) : productItem.productType === "Physical" ? (
                          productItem.variations.map((variationItem) =>
                            variationItem.combination === wishItem.variant ? (
                              <span
                                className="text-3xl text-white font-semibold"
                                key={variationItem.combination}
                              >
                                ${Number(variationItem.price).toFixed(2)}
                              </span>
                            ) : null
                          )
                        ) : productItem.productType === "Digital" ? (
                          <span className="text-3xl text-white font-semibold">
                            ${Number(productItem.basePrice).toFixed(2)}
                          </span>
                        ) : null
                      ) : productItem.productType === "Physical" ? (
                        productItem.variations.map((variationItem) =>
                          variationItem.combination === wishItem.variant ? (
                            <span
                              className="text-3xl text-white font-semibold"
                              key={variationItem.combination}
                            >
                              ${Number(variationItem.price).toFixed(2)}
                            </span>
                          ) : null
                        )
                      ) : productItem.productType === "Digital" ? (
                        <span className="text-3xl text-white font-semibold">
                          ${Number(productItem.basePrice).toFixed(2)}
                        </span>
                      ) : null}

                      <div className=" flex-row flex items-center justify-end px-5">
                        {productItem.productType === "Digital" ? (
                          productItem.status === "1" ? (
                            <button
                              onClick={() =>
                                handleOnAddToCart(
                                  wishItem.productId,
                                  wishItem._id
                                )
                              }
                              className="bg-yellow-400 border-none hover:border-none hover:border-transparent outline-none focus:outline-none focus:outline-transparent hover:bg-yellow-300 p-2 font-bold me-6"
                            >
                              Add To Cart
                            </button>
                          ) : (
                            <button className="pointer-events-none  border-none hover:border-none hover:border-transparent outline-none focus:outline-none focus:outline-transparent opacity-60 bg-yellow-400 hover:bg-yellow-300 p-2 font-bold me-6">
                              Add To Cart
                            </button>
                          )
                        ) : productItem?.variations?.find(
                            (variationItem) =>
                              variationItem.combination === wishItem.variant
                          )?.status === 1 ? (
                          <button
                            onClick={() =>
                              handleOnAddToCart(
                                wishItem.productId,
                                wishItem._id
                              )
                            }
                            className="bg-yellow-400 border-none hover:border-none hover:border-transparent outline-none focus:outline-none focus:outline-transparent hover:bg-yellow-300 p-2 font-bold me-6"
                          >
                            Add To Cart
                          </button>
                        ) : (
                          <button className="pointer-events-none border-none hover:border-none hover:border-transparent outline-none focus:outline-none focus:outline-transparent opacity-60 bg-yellow-400 hover:bg-yellow-300 p-2 font-bold me-6">
                            Add To Cart
                          </button>
                        )}
                        <a
                          onClick={() => {
                            handleRemoveFromWishlist(productItem._id);
                          }}
                          className=" text-gray-300 hover:text-gray-700 hover:underline cursor-pointer"
                        >
                          Remove
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-96 w-full">
          <p className="text-white text-4xl">Your wishlist is Empty :(</p>
          <button
            onClick={() => navigate("../shop")}
            className=" max-md:hidden text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-3xl px-20 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 mt-8 hover:border-transparent focus:outline-none focus:outline-transparent outline-none"
          >
            Make a Wish &nbsp;&nbsp;&nbsp;:)
          </button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
