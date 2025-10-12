import PageLoading from "@/pages/PageLoading";
import {
  cartCreate,
  cartSearch,
  cartUpdate,
  categorySearch,
  colorSearch,
  productImageSearch,
  productSearch,
  reviewSearch,
  searchPromotion,
  wishlistCreate,
  wishlistDelete,
  wishlistSearch,
} from "@/services";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceStrict } from "date-fns";
import { UserAuthContext } from "@/context/UserAuthContext";
import CountdownTimer from "../../Common-Sections/countDownTimer";

function ProductDetails() {
  const { user } = useContext(UserAuthContext);

  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productImagesList, setProductImagesList] = useState([]);
  const [variationsList, setVariationsList] = useState([]);
  const [variations, setVariations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewList, setReviewList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  let promotionValue = null;
  let promotionEndDate = null;
  const [categoryList, setCategoryList] = useState(null);
  const navigate = useNavigate();
  let totalRating = 0;
  const { id } = useParams();
  const scrollContainer = useRef(null);
  const scrollContainer1 = useRef(null);
  const [selectedvariant, setSelectedvariant] = useState(null);
  const [preferredvariant, setPreferredvariant] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityMsg, setQuantityMsg] = useState(null);

  const [colorCount, setColorCount] = useState(null);
  const [multiColorSelected, setMultiColorSelected] = useState(false);
  const [multiColorIndex, setMultiColorIndex] = useState(null);
  const [selectedColorList, setSelectedColorList] = useState(null);
  const [colorList, setColorList] = useState([]);
  const [multiColorList, setMultiColorList] = useState([]);
  const [multiColorColorList, setMultiColorColorList] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [relatedProductList, setRelatedProductList] = useState([]);
  const [relatedProductImages, setRelatedProductImages] = useState([]);

const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

  const increaseQuantity = () => {
    if (quantity < preferredvariant?.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantityMsg("Maximum quantity reached");
      setTimeout(() => {
        setQuantityMsg(null);
      }, 3000);
    }
  };

  const decreaseQuantity = () => {
    setQuantityMsg(null);
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const [
          productSearchResponse,
          productImageSearchResponse,
          reviewSearchResponse,
          searchPromotionResponse,
          colorSearchResponse,
        ] = await Promise.all([
          productSearch({ searchData: { _id: id } }),
          productImageSearch({ searchData: { productId: id } }),
          reviewSearch({ searchData: { productId: id } }),
          searchPromotion({ searchData: { isActive: true } }),
          colorSearch({ searchData: {} }),
        ]);

        if (user !== null) {
          const [userWishlistSearchResponse] = await Promise.all([
            wishlistSearch({ searchData: { productId: id, userId: user._id } }),
          ]);

          if (
            userWishlistSearchResponse?.success &&
            userWishlistSearchResponse?.wishlist.length > 0
          ) {
            setIsAddedToWishlist(true);
          } else {
            setIsAddedToWishlist(false);
          }
        } else if (localStorage.getItem("wishlistData")) {
          let wishlistData = JSON.parse(localStorage.getItem("wishlistData"));
          let foundProduct = wishlistData.find(
            (wishlistItem) => wishlistItem.productId === id
          );

          if (foundProduct) {
            setIsAddedToWishlist(true);
          } else {
            setIsAddedToWishlist(false);
          }
        }

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse.productList[0]);
          setVariationsList(
            productSearchResponse.productList[0].variationsList
          );
          setVariations(productSearchResponse.productList[0].variations);

          const [categoryResponse] = await Promise.all([
            categorySearch({
              searchData: {
                _id: productSearchResponse.productList[0].categoryId,
              },
            }),
          ]);

          if (categoryResponse?.success) {
            setCategoryList(categoryResponse.categoryList[0]);
          }

          const [RelatedproductSearchResponse] = await Promise.all([
            productSearch({
              searchData: {
                categoryId: productSearchResponse.productList[0].categoryId,
              },
              pagination: { page: 1, limit: 10 },
            }),
          ]);

          if (RelatedproductSearchResponse.success) {
            setRelatedProductList(RelatedproductSearchResponse.productList);

            const [RelatedproductImageSearchResponse] = await Promise.all([
              productImageSearch({ searchData: {} }),
            ]);

            if (RelatedproductImageSearchResponse.success) {
              setRelatedProductImages(
                RelatedproductImageSearchResponse.productImageList
              );
            }
          }
        }

        if (productImageSearchResponse?.success) {
          function sortImagePaths(paths) {
            return paths.sort((a, b) => {
              const getPriority = (path) => {
                if (path.endsWith(".gif")) return 1;
                if (path.endsWith(".jpg")) return 2;
                return 3; // For other file types
              };
              return getPriority(a) - getPriority(b);
            });
          }

          const sortedPaths = sortImagePaths(
            productImageSearchResponse.productImageList[0].imagePath
          );

          setProductImagesList(sortedPaths);
        }

        if (reviewSearchResponse?.success) {
          setReviewList(reviewSearchResponse.reviewList);
        }

        if (searchPromotionResponse?.success) {
          setPromotionList(searchPromotionResponse.promotionList);
        }

        if (colorSearchResponse?.success) {
          setColorList(colorSearchResponse.colorList);
        }

        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  function timeAgo(timestamp) {
    return formatDistanceStrict(new Date(timestamp), new Date(), {
      addSuffix: true,
    });
  }

  const foundPromotion = promotionList.some((promotion) => {
    promotionValue = promotion.value;
    promotionEndDate = promotion.endDate;
    return (
      (promotion.productType === productList.productType ||
        promotion.productType === "Both") &&
      (promotion.categoryId === productList.categoryId ||
        promotion.categoryId === "1")
    );
  });

  useEffect(() => {
    // Set the date we're counting down to (April 20, 2025 at 12:00:00 AM)
    const countDownDate = new Date(promotionEndDate).getTime();

    // Update the count down every 1 second
    const interval = setInterval(() => {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes, and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Set the time left
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // If the countdown is over, clear the interval and show "EXPIRED"
      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [promotionEndDate]);

  function setToMainImage(Index) {
    setImageIndex(Index);
  }

  function Selectedvariant(value, index, variationItem) {
    if (variationItem === "Color") {
      if (value === "Multi Color") {
        setPreferredvariant(null);
        setMultiColorSelected(true);
        setMultiColorIndex(index);
        setColorCount(productList.colorCount);
      } else {
        setMultiColorSelected(false);
        setMultiColorIndex(null);
        setColorCount(null);
        setMultiColorColorList([]);
      }
    }

    if (value === "0") {
      setErrorMsg("Select the " + variationItem);
      setPreferredvariant(null);
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    } else {
      let variantsArray = selectedvariant ? selectedvariant.split(" - ") : []; // Ensure it's an array
      variantsArray[index] = value; // Replace value at the correct index
      const updatedVariant = variantsArray.join(" - "); // Updated variant string

      setSelectedvariant(updatedVariant); // Update state

      productList.variations.forEach((variant) => {
        if (updatedVariant === variant.combination) {
          setPreferredvariant(variant);
        }
      });
    }
  }

  function selectedColorsForMultiColors(value, Index, ColorIndex) {
    if (value === "0") {
      setErrorMsg("Select Color " + (ColorIndex + 1));
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    } else {
      let singleCount = 0;
      let otherCount = 0;

      setMultiColorColorList((prev) => {
        let ColorListsArray = Array.isArray(prev) ? [...prev] : [];

        ColorListsArray[ColorIndex] = value;

        return ColorListsArray;
      });

      // Update multiColorList state (using array instead of string for better handling)
      setMultiColorList((prev) => {
        let variantsArray = Array.isArray(prev) ? [...prev] : [];
        colorList.forEach((colorItem) => {
          if (colorItem.name === value) {
            let newValue = colorItem.type === "Single" ? "1" : "2";
            variantsArray[ColorIndex] = newValue;
          }
        });

        return variantsArray;
      });

      // After updating multiColorList, calculate single and other counts
      setMultiColorList((prev) => {
        let updatedMultiColorList = Array.isArray(prev) ? prev : [];
        updatedMultiColorList.forEach((multiColorItem) => {
          let numericValue = parseInt(multiColorItem, 10);
          if (numericValue === 1) {
            singleCount += 1;
          } else if (numericValue === 2) {
            otherCount += 1;
          }
        });

        // Update the variant based on the counts of single and other colors
        const updateVariant = (variantLabel) => {
          let variantsArray = selectedvariant
            ? selectedvariant.split(" - ")
            : [];
          variantsArray[Index] = variantLabel;
          const updatedVariant = variantsArray.join(" - ");
          setSelectedvariant(updatedVariant);

          // Find matching variant and set preferred variant
          const matchingVariant = productList.variations.find(
            (variant) => updatedVariant === variant.combination
          );
          if (matchingVariant) {
            setPreferredvariant(matchingVariant);
          }
        };

        // Logic to update the variant based on the counts of single and other colors
        if (singleCount.toString() === colorCount && otherCount === 0) {
          updateVariant("Multi Color 1");
        } else if (singleCount === 0 && otherCount.toString() === colorCount) {
          updateVariant("Multi Color 3");
        } else if (
          singleCount > 0 &&
          otherCount > 0 &&
          singleCount + otherCount === parseInt(colorCount)
        ) {
          updateVariant("Multi Color 2");
        }

        return updatedMultiColorList;
      });
    }
  }

  async function handleOnAddToWishlist() {
    if (user === null) {
      //

      if (productList.productType === "Physical") {
        if (isAddedToWishlist) {
          let wishlistData =
            JSON.parse(localStorage.getItem("wishlistData")) || [];
          let updatedWishlist = wishlistData.filter(
            (wishlistItem) => !(wishlistItem.productId === id)
          );

          // Save the updated array back to localStorage
          localStorage.setItem("wishlistData", JSON.stringify(updatedWishlist));

          setSuccessMsg("Product Removed from Your Wishlist");
          window.location.reload();
        }

        if (preferredvariant === null && isAddedToWishlist === false) {
          setErrorMsg("Please Select the variant You wish to add");
          setTimeout(() => {
            setErrorMsg(null);
          }, 3000);
        } else {
          if (isAddedToWishlist === false) {
            let wishlistData =
              JSON.parse(localStorage.getItem("wishlistData")) || [];
            let newWishlistData = {
              productId: id,
              variant: preferredvariant.combination,
              multiColorColorList: multiColorColorList,
              userId: "",
            };

            wishlistData.push(newWishlistData);

            localStorage.setItem("wishlistData", JSON.stringify(wishlistData));

            setSuccessMsg("Product Added to Your Wishlist");
            window.location.reload();
          }
        }
      } else if (productList.productType === "Digital") {
        if (isAddedToWishlist) {
          let wishlistData =
            JSON.parse(localStorage.getItem("wishlistData")) || [];
          let updatedWishlist = wishlistData.filter(
            (wishlistItem) => !(wishlistItem.productId === id)
          );

          // Save the updated array back to localStorage
          localStorage.setItem("wishlistData", JSON.stringify(updatedWishlist));

          setSuccessMsg("Product Removed from Your Wishlist");
          window.location.reload();
        }

        if (isAddedToWishlist === false) {
          let wishlistData =
            JSON.parse(localStorage.getItem("wishlistData")) || [];
          let newWishlistData = {
            productId: id,
            variant: [],
            multiColorColorList: [],
            userId: "",
          };

          wishlistData.push(newWishlistData);

          localStorage.setItem("wishlistData", JSON.stringify(wishlistData));

          setSuccessMsg("Product Added to Your Wishlist");
          window.location.reload();
        }
      }

      //
    } else {
      if (productList.productType === "Physical") {
        if (isAddedToWishlist) {
          const userWishlistDeleteResponse = await wishlistDelete({
            deleteData: { productId: id, userId: user._id },
          });

          if (userWishlistDeleteResponse?.success) {
            setIsAddedToWishlist(false);
            setSuccessMsg("Product Removed from Your Wishlist");
            window.location.reload();
          }
        }
        if (preferredvariant === null && isAddedToWishlist === false) {
          setErrorMsg("Please Select the variant You wish to add");
          setTimeout(() => {
            setErrorMsg(null);
          }, 3000);
        } else {
          if (isAddedToWishlist === false) {
            const userWishlistCreateResponse = await wishlistCreate({
              productId: id,
              variant: preferredvariant.combination,
              multiColorColorList: multiColorColorList,
              userId: user._id,
            });

            if (userWishlistCreateResponse?.success) {
              setIsAddedToWishlist(true);
              setSuccessMsg("Product Added to Your Wishlist");
              window.location.reload();
            }
          }
        }
      } else if (productList.productType === "Digital") {
        if (isAddedToWishlist) {
          const userWishlistDeleteResponse = await wishlistDelete({
            deleteData: { productId: id, userId: user._id },
          });

          if (userWishlistDeleteResponse?.success) {
            setIsAddedToWishlist(false);
            setSuccessMsg("Product Removed from Your Wishlist");
            window.location.reload();
          }
        }

        if (isAddedToWishlist === false) {
          const userWishlistCreateResponse = await wishlistCreate({
            productId: id,
            variant: [],
            multiColorColorList: [],
            userId: user._id,
          });

          if (userWishlistCreateResponse?.success) {
            setIsAddedToWishlist(true);
            setSuccessMsg("Product Added to Your Wishlist");
            window.location.reload();
          }
        }
      }
    }
  }

  async function handleOnAddToCart() {
    if (user === null) {
      //
      if (productList.productType === "Physical") {
        let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

        if (preferredvariant === null) {
          setErrorMsg("Please Select the variant You wish to add");
          setTimeout(() => {
            setErrorMsg(null);
          }, 3000);
        } else {
          if (cartData.length > 0) {
            // Find item in cart
            let foundItemInCart = cartData.find(
              (cartItem) =>
                cartItem.productId === id &&
                cartItem.variant === preferredvariant.combination &&
                JSON.stringify(cartItem.multiColorColorList) ===
                  JSON.stringify(multiColorColorList) // Compare arrays correctly
            );

            if (foundItemInCart) {
              // Update quantity of the found item
              let updatedCart = cartData.map((cartItem) =>
                cartItem.productId === id &&
                cartItem.variant === preferredvariant.combination &&
                JSON.stringify(cartItem.multiColorColorList) ===
                  JSON.stringify(multiColorColorList)
                  ? {
                      ...cartItem,
                      quantity:
                        Number(foundItemInCart.quantity) ===
                        preferredvariant.quantity
                          ? foundItemInCart.quantity
                          : Number(foundItemInCart.quantity) + quantity >
                              preferredvariant.quantity
                            ? preferredvariant.quantity
                            : Number(foundItemInCart.quantity) + quantity,
                    }
                  : cartItem
              );

              localStorage.setItem("cartData", JSON.stringify(updatedCart));
              setSuccessMsg("Cart Updated Successfully");
              window.location.reload();
            } else {
              // Add new item to cart
              let newCartData = {
                productId: id,
                variant: preferredvariant.combination,
                multiColorColorList: multiColorColorList,
                quantity: quantity,
                userId: "",
              };

              cartData.push(newCartData);
              localStorage.setItem("cartData", JSON.stringify(cartData));
              setSuccessMsg("Product Added to Your Cart");
              window.location.reload();
            }
          } else {
            // Cart is empty, add the first product
            let newCartData = {
              productId: id,
              variant: preferredvariant.combination,
              multiColorColorList: multiColorColorList,
              quantity: quantity,
              userId: "",
            };

            cartData.push(newCartData);
            localStorage.setItem("cartData", JSON.stringify(cartData));
            setSuccessMsg("Product Added to Your Cart");
            window.location.reload();
          }
        }
      } else if (productList.productType === "Digital") {
        let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
        if (cartData.length > 0) {
          let foundItemInCart = cartData.find(
            (cartItem) => cartItem.productId === id
          );

          if (foundItemInCart) {
            setSuccessMsg("You've already added this to your cart");
            setTimeout(() => {
              setSuccessMsg(null);
            }, 3000);
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

            setSuccessMsg("Product Added to Your Cart");
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

          setSuccessMsg("Product Added to Your Cart");
          window.location.reload();
        }
      }

      //
    } else {
      if (productList.productType === "Physical") {
        if (preferredvariant === null) {
          setErrorMsg("Please Select the variant You wish to add");
          setTimeout(() => {
            setErrorMsg(null);
          }, 3000);
        } else {
          const searchQuery = {
            productId: id,
            variant: preferredvariant?.combination,
            userId: user?._id,
            ...(multiColorColorList?.length ? { multiColorColorList } : {}), // Remove if empty
          };

          const [usercartSearchResponse] = await Promise.all([
            cartSearch({ searchData: searchQuery }),
          ]);

          if (usercartSearchResponse.cartList.length > 0) {
            const userCartUpdateResponse = await cartUpdate({
              productId: id,
              variant: preferredvariant.combination,
              ...(multiColorColorList?.length ? { multiColorColorList } : {}), // Remove if empty
              userId: user._id,
              updateData: {
                quantity:
                  Number(usercartSearchResponse.cartList[0].quantity) ===
                  preferredvariant.quantity
                    ? usercartSearchResponse.cartList[0].quantity
                    : Number(usercartSearchResponse.cartList[0].quantity) +
                          quantity >
                        preferredvariant.quantity
                      ? preferredvariant.quantity
                      : Number(usercartSearchResponse.cartList[0].quantity) +
                        quantity,
              },
            });

            if (userCartUpdateResponse?.success) {
              setSuccessMsg("Cart Updated Successfully");
              window.location.reload();
            }
          } else {
            const userCartCreateResponse = await cartCreate({
              productId: id,
              variant: preferredvariant.combination,
              multiColorColorList: multiColorColorList,
              quantity: quantity,
              userId: user._id,
            });

            if (userCartCreateResponse?.success) {
              setSuccessMsg("Product Added to Your Cart");
              window.location.reload();
            }
          }
        }
      } else if (productList.productType === "Digital") {
        const [usercartSearchResponse] = await Promise.all([
          cartSearch({
            searchData: {
              productId: id,
              quantity: 1,
              userId: user._id,
            },
          }),
        ]);

        if (usercartSearchResponse.cartList.length > 0) {
          setSuccessMsg("You've already added this to your cart");
          setTimeout(() => {
            setSuccessMsg(null);
          }, 3000);
        } else {
          const userCartCreateResponse = await cartCreate({
            productId: id,
            variant: [],
            multiColorColorList: [],
            quantity: quantity,
            userId: user._id,
          });

          if (userCartCreateResponse?.success) {
            setSuccessMsg("Product Added to Your Cart");
            window.location.reload();
          }
        }
      }
    }
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="font-[sans-serif] p-4">
      <div className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-8 max-lg:gap-12 max-sm:gap-8">
          <div className="w-full top-0 lg:col-span-3">
            <div className="flex flex-col gap-4">
              <div className=" shadow p-0 flex flex-row justify-center items-center ">
                {productImagesList[imageIndex] && (
                  <img
                    src={`http://${myIp}:5000/${productImagesList[imageIndex]}`}
                    alt="Product1"
                    className="w-full aspect-square"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Left Arrow */}
                <button
                  onClick={() =>
                    scrollContainer.current.scrollBy({
                      left: -100,
                      behavior: "smooth",
                    })
                  }
                  className=" outline-none focus:outline-none hover:border-transparent focus:outline-transparent p-2 rounded text-white bg-transparent"
                >
                  ◀
                </button>

                {/* Scrollable Image List */}
                <div
                  ref={scrollContainer}
                  className="flex gap-2 overflow-hidden scroll-smooth w-full"
                >
                  {productImagesList.map((productImageItem, index) => (
                    <img
                      key={index}
                      src={`http://${myIp}:5000/${productImageItem}`}
                      onClick={() => setToMainImage(index)}
                      className="w-24 h-24 object-cover cursor-pointer"
                    />
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    scrollContainer.current.scrollBy({
                      left: 100,
                      behavior: "smooth",
                    })
                  }
                  className=" outline-none focus:outline-none hover:border-transparent focus:outline-transparent p-2 rounded text-white bg-transparent"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:col-span-2">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {productList.title + " - " + productList.productType}
              </h3>
              {reviewList.length > 0 ? (
                <div className="flex items-center space-x-1 mt-2">
                  {reviewList.map((reviewItem) => {
                    totalRating = totalRating + reviewItem.rating;
                  })}
                  {Array.from({
                    length: Math.floor(
                      Math.ceil((totalRating / reviewList.length) * 2) / 2
                    ),
                  }).map((_, i) => (
                    <svg
                      className="w-4 h-4 fill-[#facc15]"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                  ))}
                  {Array.from({
                    length:
                      (Math.ceil((totalRating / reviewList.length) * 2) / 2) %
                        1 >=
                      0.5
                        ? 1
                        : 0,
                  }).map((_, i) => (
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 13"
                      fill="none"
                    >
                      <path
                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                        fill="#facc15"
                        style={{ clipPath: "inset(0 50% 0 0)" }} // This clips the right side to fill with gray
                      />
                      <path
                        d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                        fill="#CED5D8"
                        style={{ clipPath: "inset(0 0 0 50%)" }} // This clips the left side to fill with gray
                      />
                    </svg>
                  ))}
                  {Array.from({
                    length:
                      5 -
                        Math.floor(
                          Math.ceil((totalRating / reviewList.length) * 2) / 2
                        ) -
                        ((Math.ceil((totalRating / reviewList.length) * 2) /
                          2) %
                          1) >=
                      0.5
                        ? 1
                        : 0,
                  }).map((_, i) => (
                    <svg
                      className="w-4 h-4 fill-[#CED5D8]"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                  ))}

                  <p className="text-sm text-white !ml-3">
                    {Math.ceil((totalRating / reviewList.length) * 2) / 2}&nbsp;
                    ({reviewList.length})
                  </p>
                </div>
              ) : null}
              {foundPromotion ? (
                <div className="flex flex-col items-start flex-wrap mt-6 gap-2">
                  <h4 className="text-white text-6xl font-bold">
                    {productList.productType === "Physical" ? (
                      preferredvariant !== null ? (
                        preferredvariant.status === 0 ? (
                          <p className="text-red-500 text-lg">
                            {errorMsg === null &&
                            preferredvariant !== null &&
                            preferredvariant.status === 0
                              ? "This variant is no longer available"
                              : null}
                          </p>
                        ) : (
                          "$" +
                          Number(
                            (preferredvariant.price * (100 - promotionValue)) /
                              100
                          ).toFixed(2)
                        )
                      ) : (
                        (() => {
                          const minPrice =
                            Math.min(
                              ...(productList.variations?.map((variation) =>
                                parseFloat(variation.price)
                              ) || [])
                            ) === Infinity
                              ? "----"
                              : "$" +
                                (
                                  Math.min(
                                    ...(productList.variations?.map(
                                      (variation) => parseFloat(variation.price)
                                    ) || [])
                                  ) *
                                  ((100 - promotionValue) / 100)
                                ).toFixed(2) +
                                "+";
                          return minPrice;
                        })()
                      )
                    ) : productList.basePrice ? (
                      "$" +
                      (
                        Math.ceil(
                          productList.basePrice * (100 - promotionValue)
                        ) / 100
                      ).toFixed(2)
                    ) : (
                      "Price Unavailable"
                    )}
                  </h4>
                  <div className=" flex flex-row justify-between items-center w-full">
                    <div className=" flex flex-row justify-center items-center gap-10">
                      <p className="text-gray-400 font-semibold text-2xl">
                        <strike>
                          {productList.productType === "Physical"
                            ? preferredvariant !== null
                              ? preferredvariant.status === 0
                                ? null
                                : "$" +
                                  Number(preferredvariant.price).toFixed(2)
                              : (() => {
                                  const minPrice =
                                    Math.min(
                                      ...(productList.variations?.map(
                                        (variation) =>
                                          parseFloat(variation.price)
                                      ) || [])
                                    ) === Infinity
                                      ? "----"
                                      : "$" +
                                        Math.min(
                                          ...(productList.variations?.map(
                                            (variation) =>
                                              parseFloat(variation.price)
                                          ) || [])
                                        ).toFixed(2) +
                                        "+";
                                  return minPrice;
                                })()
                            : productList.basePrice
                              ? "$" + productList.basePrice.toFixed(2)
                              : "Price Unavailable"}
                        </strike>
                      </p>
                      <p className=" bg-pink-600 py-2 px-3 text-white font-semibold">
                        {promotionValue}% Off
                      </p>
                    </div>

                    <CountdownTimer endDate={promotionEndDate} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center flex-wrap gap-4 mt-6">
                  <h4 className="text-white text-2xl font-bold">
                    {productList.productType === "Physical"
                      ? preferredvariant !== null
                        ? "$" + Number(preferredvariant.price).toFixed(2)
                        : (() => {
                            const minPrice =
                              Math.min(
                                ...(productList.variations?.map((variation) =>
                                  parseFloat(variation.price)
                                ) || [])
                              ) === Infinity
                                ? "----"
                                : "$" +
                                  Math.min(
                                    ...(productList.variations?.map(
                                      (variation) => parseFloat(variation.price)
                                    ) || [])
                                  ).toFixed(2) +
                                  "+";
                            return minPrice;
                          })()
                      : productList.basePrice
                        ? "$" + productList.basePrice.toFixed(2)
                        : "Price Unavailable"}
                  </h4>
                </div>
              )}
            </div>
            <div
              className={`${productList.productType === "Digital" ? "invisible" : productList.productType === "Physical" ? "visible" : null}`}
            >
              <hr className="my-6 border-gray-300" />
              <p className="text-red-500">{errorMsg}</p>
              <div>
                {productList.productType === "Physical" &&
                  variationsList.map((variationItem, Index) => (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white">
                        {variationItem}
                        {variationItem === "Size" &&
                        productList.dimension !== null
                          ? " - " + productList.dimension
                          : null}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <select
                          onChange={(event) => {
                            Selectedvariant(
                              event.target.value,
                              Index,
                              variationItem
                            );
                          }}
                          className="text-gray-800 cursor-pointer bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                        >
                          <option value="0">Select {variationItem}</option>
                          {variations
                            .map((variationItem) => {
                              let value =
                                variationItem.combination.split(" - ")[Index]; // Extract value
                              return value.includes("Multi Color")
                                ? "Multi Color"
                                : value; // Normalize
                            })
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index
                            ) // Remove duplicates
                            .map((uniqueValue) => (
                              <option key={uniqueValue} value={uniqueValue}>
                                {uniqueValue}
                              </option>
                            ))}
                        </select>
                        {variationItem === "Color" &&
                        multiColorSelected === true &&
                        multiColorIndex !== null
                          ? Array.from({ length: colorCount }).map((_, i) => (
                              <select
                                onChange={(event) => {
                                  selectedColorsForMultiColors(
                                    event.target.value,
                                    Index,
                                    i
                                  );
                                }}
                                // HERE
                                className="text-gray-800 cursor-pointer bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                              >
                                <option value="0">Select Color {i + 1}</option>
                                {variations
                                  .map(
                                    (variationItem) =>
                                      variationItem.combination.split(" - ")[
                                        Index
                                      ]
                                  ) // Extract value
                                  .filter(
                                    (value) =>
                                      !value.includes("Multi Color") &&
                                      !value.includes("Hand Painted") // Remove unwanted values
                                  )
                                  .filter(
                                    (value, index, self) =>
                                      self.indexOf(value) === index
                                  ) // Remove duplicates
                                  .map((uniqueValue) => (
                                    <option
                                      key={uniqueValue}
                                      value={uniqueValue}
                                    >
                                      {uniqueValue}
                                    </option>
                                  ))}
                              </select>
                            ))
                          : null}
                      </div>
                    </div>
                  ))}
              </div>

              <hr className="my-6 border-gray-300" />
            </div>
            {productList.productType === "Physical" &&
            preferredvariant !== null &&
            preferredvariant.status !== 0 ? (
              <div className="flex items-center space-x-4 flex-row justify-center">
                <div className="flex items-center space-x-4 bg-white rounded-md w-2/3">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-lg hover:bg-gray-400 font-bold hover:border-transparent outline-none focus:outline-none focus:outline-transparent"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-full text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-lg hover:bg-gray-400 font-bold hover:border-transparent outline-none focus:outline-none focus:outline-transparent"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            <p className="text-red-500 text-center mt-2">{quantityMsg}</p>
            <p className=" text-green-500 mt-4">{successMsg}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleOnAddToWishlist}
                className=" flex flex-row justify-evenly outline-none focus:outline-transparent focus:outline-none border-none items-center px-4 py-3 w-[45%] border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold  "
              >
                {isAddedToWishlist ? (
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-gray-800 dark:text-white"
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
                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                    />
                  </svg>
                )}
                <p>Wishlist</p>
              </button>
              {preferredvariant !== null && preferredvariant.status === 0 ? (
                <button
                  type="button"
                  disabled
                  className="px-4 py-3 w-[45%] focus:outline-transparent focus:outline-none hover:border-transparent opacity-70 border-none border-yellow-400 disabled:bg-yellow-400 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold  "
                >
                  Add to cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOnAddToCart}
                  className="px-4 py-3 w-[45%] focus:outline-transparent focus:outline-none hover:border-transparent border-none border-yellow-400 disabled:bg-yellow-400 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold  "
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl mx-auto mt-8 text-xl text-white">
        Related Items
      </p>
      <hr className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl mx-auto mb-6 mt-1 border-gray-300" />
      <div className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl mx-auto flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={() =>
            scrollContainer1.current.scrollBy({
              left: -230,
              behavior: "smooth",
            })
          }
          className=" outline-none focus:outline-none hover:border-transparent focus:outline-transparent p-2 rounded text-white bg-transparent"
        >
          ◀
        </button>

        {/* Scrollable Image List */}
        <div
          ref={scrollContainer1}
          className="flex gap-2 overflow-hidden scroll-smooth w-full"
        >
          {relatedProductList.length > 0
            ? relatedProductList.map((RelatedproductItem, Index) => (
                <div
                  key={Index}
                  onClick={() => {
                    window.open(
                      `/product-details/${RelatedproductItem._id}`,
                      "_blank"
                    );
                  }}
                  className="bg-white bg-opacity-15 p-3 rounded-md flex flex-col cursor-pointer hover:shadow-md transition-all hover:scale-105 ease-in-out hover:ease-in-out duration-300 w-56"
                >
                  <div className="w-full relative group">
                    {/* Default Image */}
                    <div className="w-full relative group">
                      {/* Default Image */}
                      <div className="opacity-100 transition-opacity hover:ease-in-out duration-300 ease-in-out group-hover:opacity-0">
                        {relatedProductImages
                          .filter(
                            (RelatedproductImageItem) =>
                              RelatedproductImageItem.productId ===
                              RelatedproductItem._id
                          )
                          .map(
                            (
                              RelatedproductImageItem,
                              RelatedproductImageItemIndex
                            ) => (
                              <img
                                key={RelatedproductImageItemIndex}
                                src={`http://${myIp}:5000/${RelatedproductImageItem.imagePath[0]}`}
                                alt="Product 1"
                                className="w-full object-cover object-top aspect-[230/307] rounded-md"
                              />
                            )
                          )}
                      </div>

                      {/* Overlay Digital Banner (Only for Digital Products) */}
                      {RelatedproductItem.productType === "Digital" && (
                        <img
                          src="/assets/Digital_Banner/Digital_Banner.png"
                          className="absolute top-0 left-0 w-full h-full z-10 opacity-100 transition-opacity duration-300 ease-in-out"
                          alt="Digital banner"
                        />
                      )}
                    </div>

                    {/* Hover Image */}
                    <div className="absolute hover:ease-in-out top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                      {relatedProductImages.map(
                        (
                          RelatedproductImageItem,
                          RelatedproductImageItemIndex
                        ) =>
                          RelatedproductImageItem.productId ===
                          RelatedproductItem._id ? (
                            <img
                              key={RelatedproductImageItemIndex}
                              src={`http://${myIp}:5000/${RelatedproductImageItem.imagePath[1]}`} // Show second image on hover
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
                        {RelatedproductItem.title}
                      </h5>
                      <p className="mt-1 text-gray-300 truncate">
                        {RelatedproductItem.description}
                      </p>
                      {reviewList.some(
                        (reviewItem) =>
                          reviewItem.productId === RelatedproductItem._id
                      ) && (
                        <div className="flex items-center space-x-1 mt-2">
                          {(() => {
                            // Filter the reviews for the specific product
                            const filteredReviews = reviewList.filter(
                              (reviewItem) =>
                                reviewItem.productId === RelatedproductItem._id
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
                                  RelatedproductItem.productType ||
                                  promotion.productType === "Both") &&
                                (promotion.categoryId ===
                                  RelatedproductItem.categoryId ||
                                  promotion.categoryId === "1")
                            ).length > 0
                            ? promotionList
                                .filter(
                                  (promotion) =>
                                    (promotion.productType ===
                                      RelatedproductItem.productType ||
                                      promotion.productType === "Both") &&
                                    (promotion.categoryId ===
                                      RelatedproductItem.categoryId ||
                                      promotion.categoryId === "1")
                                )
                                .map((promotion) => {
                                  if (
                                    RelatedproductItem.productType ===
                                    "Physical"
                                  ) {
                                    // Find the minimum price from variations
                                    const minPrice =
                                      RelatedproductItem.variations.reduce(
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
                                    RelatedproductItem.productType === "Digital"
                                  ) {
                                    const discountedPrice =
                                      (RelatedproductItem.basePrice *
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
                                RelatedproductItem.productType ||
                                promotion.productType === "Both") &&
                              (promotion.categoryId ===
                                RelatedproductItem.categoryId ||
                                promotion.categoryId === "1")
                          ).length > 0 ? (
                            promotionList
                              .filter(
                                (promotion) =>
                                  (promotion.productType ===
                                    RelatedproductItem.productType ||
                                    promotion.productType === "Both") &&
                                  (promotion.categoryId ===
                                    RelatedproductItem.categoryId ||
                                    promotion.categoryId === "1")
                              )
                              .map((promotion) => {
                                if (
                                  RelatedproductItem.productType === "Physical"
                                ) {
                                  // Find the minimum price from variations
                                  const minPrice =
                                    RelatedproductItem.variations.reduce(
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
                                  RelatedproductItem.productType === "Digital"
                                ) {
                                  const discountedPrice =
                                    (RelatedproductItem.basePrice *
                                      (100 - promotion.value)) /
                                    100;

                                  return (
                                    <React.Fragment key={promotion.id}>
                                      <span className="text-3xl flex flex-row items-baseline text-white font-bold">
                                        ${discountedPrice.toFixed(2)}
                                      </span>
                                      <strike className="text-xl text-gray-300 font-semibold">
                                        $
                                        {RelatedproductItem.basePrice.toFixed(
                                          2
                                        )}
                                      </strike>
                                    </React.Fragment>
                                  );
                                }
                                return null;
                              })
                          ) : RelatedproductItem.productType === "Physical" ? (
                            <span className="text-3xl text-white font-bold">
                              $
                              {Number(
                                RelatedproductItem.variations.reduce(
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
                            RelatedproductItem.productType === "Digital" && (
                              <span className="text-3xl text-white font-bold">
                                $
                                {Number(RelatedproductItem.basePrice).toFixed(
                                  2
                                )}
                                +
                              </span>
                            )
                          )
                        ) : // No promotion, show the regular price
                        RelatedproductItem.productType === "Physical" ? (
                          <span className="text-3xl text-white font-bold">
                            $
                            {Number(
                              RelatedproductItem.variations.reduce(
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
                          RelatedproductItem.productType === "Digital" && (
                            <span className="text-3xl text-white font-bold">
                              ${Number(RelatedproductItem.basePrice).toFixed(2)}
                              +
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() =>
            scrollContainer1.current.scrollBy({
              left: 230,
              behavior: "smooth",
            })
          }
          className=" outline-none focus:outline-none hover:border-transparent focus:outline-transparent p-2 rounded text-white bg-transparent"
        >
          ▶
        </button>
      </div>
      <hr className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl mx-auto my-6 border-gray-300" />

      <div className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl rounded-lg mx-auto mt-12 bg-white bg-opacity-15 px-6 py-12">
        <div className="xl:max-w-screen-xl max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-100">
                PRODUCT INFORMATION
              </h3>

              <div>
                <h3 className="text-gray-100 text-sm font-bold">Material:</h3>
                <p className="text-sm text-gray-300 mt-2">
                  {productList.material}
                </p>
              </div>

              <div>
                <h3 className="text-gray-100 text-sm font-bold">
                  About This Product:
                </h3>
                <p
                  className=" text-gray-300"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {productList.description}
                </p>
              </div>
              {productList.productType === "Digital" ? (
                <>
                  <div>
                    <h3 className="text-gray-100 text-sm font-bold">
                      Print Settings:
                    </h3>
                    <p
                      className=" text-gray-300"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {productList.printSettings}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-100 text-sm font-bold">
                      Suitable for:
                    </h3>
                    <p className=" text-gray-300">
                      {productList.printerTypeId === "1"
                        ? "FDM Printers"
                        : productList.printerTypeId === "2"
                          ? "SLA (Resin) Printers"
                          : productList.printerTypeId === "3"
                            ? "Both FDM & SLA (Resin) Printers"
                            : null}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-100 text-sm font-bold">
                      .3mf color file Available:
                    </h3>
                    <p className=" text-gray-300">
                      {productList.isColorFileAvailableId === "2" || ""
                        ? "No"
                        : productList.isColorFileAvailableId === "1"
                          ? "Yes"
                          : null}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-100 text-sm font-bold">
                      Category:
                    </h3>
                    <p className=" text-gray-300">{categoryList.name}</p>
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-100">
                SHIPPING & RETURNS
              </h3>

              {productList.productType === "Digital" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-100 text-sm font-bold mb-2">
                        Download
                      </p>
                      <p className="text-gray-300 text-sm">
                        Available to download right after the purchase
                      </p>
                    </div>
                  </div>
                </div>
              ) : productList.productType === "Physical" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-100 text-sm font-bold mb-2">
                        Standard Shipping
                      </p>
                      <p className="text-gray-300 text-sm">
                        Delivery in 25-50 business days
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-100 text-sm font-bold mb-2">
                        Expedited Shipping
                      </p>
                      <p className="text-gray-300 text-sm">
                        Delivery in 3-6 business days
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  For more details on our return policy,
                  <a
                    onClick={() => navigate("../warranty", { replace: true })}
                    className=" font-medium cursor-pointer hover:underline text-blue-500 hover:text-blue-500"
                  >
                    click here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Review Section */}
      {reviewList.length > 0 ? (
        <div className="xl:max-w-screen-xl lg:max-w-screen-lg max-w-xl max-w mx-auto bg-white bg-opacity-15  p-6 font-[sans-serif] rounded-md mt-5">
          <div>
            <h3 className="font-bold text-base text-white">
              All Reviews({reviewList.length})
            </h3>
            <div className="mt-6 space-y-4">
              {reviewList.map((reviewItem, index) => (
                <div key={index} className="flex items-start pb-5">
                  <div className="ml-3">
                    <h4 className="text-gray-100 text-sm font-bold">
                      {reviewItem.name}
                    </h4>
                    <div className="flex space-x-1 mt-1">
                      {Array.from({ length: reviewItem.rating }).map((_, i) => (
                        <svg
                          key={`filled-${i}`}
                          className="w-3 fill-[#facc15]"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                      ))}

                      {Array.from({ length: 5 - reviewItem.rating }).map(
                        (_, i) => (
                          <svg
                            key={`empty-${i}`}
                            className="w-3 fill-[#CED5D8]"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                        )
                      )}

                      <p className="text-gray-300 text-xs !ml-2 font-semibold">
                        {timeAgo(reviewItem.dateTime)}
                      </p>
                    </div>

                    <p className="text-xs text-gray-300 mt-3">
                      {reviewItem.review}
                    </p>
                    {reviewItem.imagePath.length > 0 ? (
                      <div className=" w-40 h-40 flex flex-row gap-4 py-2">
                        {reviewItem.imagePath.map((ImagePathItem, Index) => (
                          <img
                            src={`http://${myIp}:5000/${ImagePathItem}`}
                            alt="Review Image"
                            className="w-full h-fit"
                            key={Index}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {/* Review Section */}
    </div>
  );
}

export default ProductDetails;
