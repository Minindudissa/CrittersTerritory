import PageLoading from "@/pages/PageLoading";
import {
  productImageSearch,
  productSearch,
  reviewSearch,
  searchPromotion,
  cartSearch,
  cartDelete,
  searchAddress,
  cartUpdate,
  searchPromoCode,
  searchShippingData,
  searchVoucher,
} from "@/services";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "@/context/UserAuthContext";
import { loadStripe } from "@stripe/stripe-js";
import CountdownTimer from "@/pages/UserPages/Common-Sections/countDownTimer";
import { Bounce, ToastContainer, toast } from "react-toastify";

function CartListing() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);

  const [cartList, setCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productImagesList, setProductImagesList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddressAvailable, setIsAddressAvailable] = useState(false);
  const [discountCode, setDiscountCode] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [isOutOfStockAvailable, setIsOutOfStockAvailable] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const [isStandardShippingChosen, setIsStandardShippingChosen] =
    useState(true);
  const [isAllDigital, setIsAllDigital] = useState(true);

const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Start loading

      try {
        let cartData = [];
        let promotionData = [];

        if (user) {
          // Fetch cartList and promotions in parallel
          const [cartListResponse, promotionResponse, searchAddressResponse] =
            await Promise.all([
              cartSearch({ searchData: { userId: user._id } }),
              searchPromotion({ searchData: { isActive: true } }),
              searchAddress({ userId: user._id }),
            ]);

          if (searchAddressResponse.success) {
            setIsAddressAvailable(true);
          }
          if (cartListResponse?.success) cartData = cartListResponse.cartList;
          if (promotionResponse?.success)
            promotionData = promotionResponse.promotionList;
        } else {
          // Load cartList from localStorage
          cartData = JSON.parse(localStorage.getItem("cartData")) || [];

          // Fetch promotions
          const promotionResponse = await searchPromotion({
            searchData: { isActive: true },
          });
          if (promotionResponse?.success)
            promotionData = promotionResponse.promotionList;
        }

        // Update cart list and promotions
        setCartList(cartData);
        setPromotionList(promotionData); // No need to spread `prev` since we're replacing the list

        // Fetch product details for each cartList item in parallel
        if (cartData.length > 0) {
          const productPromises = cartData.map(async (cartItem) => {
            const [
              productSearchResponse,
              productImageSearchResponse,
              reviewSearchResponse,
              shippingDataSearchResponse,
            ] = await Promise.all([
              productSearch({ searchData: { _id: cartItem.productId } }),
              productImageSearch({
                searchData: { productId: cartItem.productId },
              }),
              reviewSearch({ searchData: { productId: cartItem.productId } }),
              searchShippingData({ searchData: {} }),
            ]);

            return {
              product: productSearchResponse?.success
                ? productSearchResponse.productList
                : [],
              images: productImageSearchResponse?.success
                ? productImageSearchResponse.productImageList
                : [],
              reviews: reviewSearchResponse?.success
                ? reviewSearchResponse.reviewList
                : [],
            };
          });

          // Wait for all product-related API calls to complete
          const productResults = await Promise.all(productPromises);

          // Flatten and update states in one batch to minimize re-renders
          setProductList(productResults.flatMap((res) => res.product));
          setProductImagesList(productResults.flatMap((res) => res.images));
          setReviewList(productResults.flatMap((res) => res.reviews));

          const shippingDataSearchResponse = await searchShippingData({
            searchData: {},
          });

          if (shippingDataSearchResponse?.success) {
            setShippingData(shippingDataSearchResponse.shippingDataList);
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

  useEffect(() => {
    cartList.forEach((cartItem) => {
      const product = productList?.find(
        (productItem) => productItem._id === cartItem.productId
      );

      if (!product) return;

      if (product.productType === "Digital") {
        if (product.status !== "1") {
          setIsOutOfStockAvailable(true);
        }
      } else if (
        product.productType === "Physical" &&
        product.variationsList.length > 0
      ) {
        const matchedVariation = product.variations.find(
          (variationItem) => variationItem.combination === cartItem.variant
        );

        if (
          matchedVariation &&
          matchedVariation.status !== 1 &&
          product.status !== "1"
        ) {
          setIsOutOfStockAvailable(true);
        }
      }
    });
    cartList.map((cartItem) =>
      productList.find((productItem) => productItem._id === cartItem.productId)
        ?.productType === "Physical"
        ? setIsAllDigital(false)
        : null
    );
  }, [cartList, productList, isOutOfStockAvailable]);

  const productsList = [];

  async function handleRemoveFromCart(cartItemData) {
    if (user) {
      try {
        const response = await cartDelete({
          deleteData: { _id: cartItemData._id },
        });

        if (response?.success) {
          setCartList((prev) =>
            prev.filter((cartItem) => cartItem._id !== cartItemData._id)
          );
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      if (cartItemData.variant.length > 0) {
        const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
        const updatedCartlist = cartData.filter(
          (cartItem) =>
            !(
              cartItem.productId === cartItemData.productId &&
              cartItem.variant === cartItemData.variant
            )
        );

        localStorage.setItem("cartData", JSON.stringify(updatedCartlist));
        setCartList(updatedCartlist); // Update state instead of reloading
      } else {
        const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
        const updatedCartlist = cartData.filter(
          (cartItem) => cartItem.productId !== cartItemData.productId
        );

        localStorage.setItem("cartData", JSON.stringify(updatedCartlist));
        setCartList(updatedCartlist); // Update state instead of reloading
      }
    }
    window.location.reload();
  }

  const increaseQuantity = async (
    productId,
    multiColorColorList,
    variant,
    cartQuantity,
    userId
  ) => {
    const productSearchResponse = await productSearch({
      searchData: { _id: productId },
    });

    if (productSearchResponse?.success) {    
      
      if (cartQuantity < productSearchResponse.productList[0].variations.find(variationItem => variationItem.combination === variant)?.quantity) {
        setQuantity((prev) => prev + 1);
        if (user === null) {
          const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
          const updatedCartlist = cartData.map((cartItem) => {
            const isSameProduct =
              cartItem.productId === productId &&
              cartItem.variant === variant &&
              JSON.stringify(cartItem.multiColorColorList) ===
                JSON.stringify(multiColorColorList);
            if (isSameProduct) {
              const newQuantity = Math.min(
                cartItem.quantity + 1,
                productSearchResponse.productList[0].variations.find(variationItem => variationItem.combination === variant)?.quantity
              );
              return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
          });
          localStorage.setItem("cartData", JSON.stringify(updatedCartlist));
          setCartList(updatedCartlist);
        } else {
          const updatedCartlist = await Promise.all(
            cartList.map(async (cartItem) => {
              const isSameProduct =
                cartItem.productId === productId &&
                cartItem.variant === variant &&
                JSON.stringify(cartItem.multiColorColorList) ===
                  JSON.stringify(multiColorColorList);
              if (isSameProduct) {
                const newQuantity = Math.min(
                  cartItem.quantity + 1,
                  productSearchResponse.productList[0].variations.find(variationItem => variationItem.combination === variant)?.quantity
                );
                const cartUpdateResponse = await cartUpdate({
                  productId,
                  ...(variant?.length ? { variant: variant } : {}),
                  ...(multiColorColorList?.length
                    ? { multiColorColorList: multiColorColorList }
                    : {}),
                  userId,
                  updateData: { quantity: newQuantity },
                });
                if (cartUpdateResponse?.success) {
                  return { ...cartItem, quantity: newQuantity };
                }
              }
              return cartItem;
            })
          );
          setCartList(updatedCartlist);
        }
      } else {
        toast.error("Maximum quantity reached", {
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
  };

  const decreaseQuantity = async (
    productId,
    multiColorColorList,
    variant,
    userId
  ) => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (user === null) {
      const cartData = JSON.parse(localStorage.getItem("cartData")) || [];

      const updatedCartlist = cartData.map((cartItem) => {
        const isSameProduct =
          cartItem.productId === productId &&
          cartItem.variant === variant &&
          JSON.stringify(cartItem.multiColorColorList) ===
            JSON.stringify(multiColorColorList);

        if (isSameProduct) {
          const newQuantity = Math.max(cartItem.quantity - 1, 1); // Prevent going below 1
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      localStorage.setItem("cartData", JSON.stringify(updatedCartlist));
      setCartList(updatedCartlist);
    } else {
      const updatedCartlist = await Promise.all(
        cartList.map(async (cartItem) => {
          const isSameProduct =
            cartItem.productId === productId &&
            cartItem.variant === variant &&
            JSON.stringify(cartItem.multiColorColorList) ===
              JSON.stringify(multiColorColorList);

          if (isSameProduct) {
            const newQuantity = Math.max(cartItem.quantity - 1, 1); // Prevent going below 1
            const cartUpdateResponse = await cartUpdate({
              productId,
              ...(variant?.length ? { variant: variant } : {}),
              ...(multiColorColorList?.length
                ? { multiColorColorList: multiColorColorList }
                : {}),
              userId,
              updateData: { quantity: newQuantity },
            });
            if (cartUpdateResponse?.success) {
              return { ...cartItem, quantity: newQuantity };
            }
          }
          return cartItem;
        })
      );

      setCartList(updatedCartlist);
    }
  };

  let Subtotal = 0;
  let weight = 0;
  let shipping = 0;

  const handlecheckout = () => {
    if (isOutOfStockAvailable) {
      toast.error("Please Remove the Out of Stock Product(s) to continue", {
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
      if (user === null) {
        navigate("/auth/login");
      } else {
        if (isAddressAvailable) {
          makePayment();
        } else {
          navigate("/shipping-details");
        }
      }
    }
  };
  async function handlePromoCodeOnClick() {
    if (user === null) {
      toast.error("Please Login to Apply Promo Code", {
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
      const promoCodeSearchResponse = await searchPromoCode({
        searchData: { code: discountCode, userEmail: user.email },
      });
      const voucherSearchResponse = await searchVoucher({
        searchData: { code: discountCode },
      });

      if (
        promoCodeSearchResponse.success &&
        promoCodeSearchResponse.promoCodeList.length > 0
      ) {
        if (
          promoCodeSearchResponse.promoCodeList[0].isUsed === false &&
          discount === null
        ) {
          setDiscount(
            (Number(Subtotal) *
              promoCodeSearchResponse.promoCodeList[0].value) /
              100
          );
        } else {
          toast.error("Promo code already used", {
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

          setDiscount(null);
        }
      } else if (
        voucherSearchResponse.success &&
        voucherSearchResponse.voucherList.length > 0
      ) {
        if (voucherSearchResponse.voucherList[0].isUsed === false) {
          //
          const startDateString =
            voucherSearchResponse.voucherList[0].startDate; // "02/07/2025, 08:06:00 PM"
          const validityPeriod =
            voucherSearchResponse.voucherList[0].validityPeriod; // "3 Month"

          // Step 1: Split date and time
          const [datePart, timePart, period] = startDateString.split(/[, ]+/); // ['02/07/2025', '08:06:00', 'PM']

          // Step 2: Extract month, day, year (MM/DD/YYYY)
          const [month, day, year] = datePart.split("/").map(Number);

          // Step 3: Extract hour, minute, second
          let [hour, minute, second] = timePart.split(":").map(Number);

          // Step 4: Convert to 24-hour format
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;

          // Step 5: Construct valid Date object
          const startDate = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
          );

          // Step 6: Handle validity period
          const [amountStr, unit] = validityPeriod.split(" ");
          const amount = parseInt(amountStr);

          const expiryDate = new Date(startDate);
          if (unit.toLowerCase().includes("month")) {
            expiryDate.setMonth(expiryDate.getMonth() + amount);
          } else if (unit.toLowerCase().includes("day")) {
            expiryDate.setDate(expiryDate.getDate() + amount);
          } else if (unit.toLowerCase().includes("year")) {
            expiryDate.setFullYear(expiryDate.getFullYear() + amount);
          }

          // Step 7: Compare with now
          const now = new Date();
          const isStillValid = now < expiryDate;

          //

          if (isStillValid) {
            if (
              voucherSearchResponse.voucherList[0].value <
              Number(Subtotal) - Number(discount) + Number(shipping)
            ) {
              setDiscount(voucherSearchResponse.voucherList[0].value);
            } else {
              toast.error(
                `To redeem this voucher, your total must be at least $${voucherSearchResponse.voucherList[0].value}.`,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                }
              );
              setDiscount(null);
            }
          } else {
            toast.error("Voucher has expired", {
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
            setDiscount(null);
          }
        } else {
          toast.error("Voucher already used", {
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
          setDiscount(null);
        }
      } else {
        toast.error("Invalid promo code / Voucher", {
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
        setDiscount(null);
      }
    }
  }

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QObE5Fw1jM5sbYxCQFFOK7KE3em2YKpw7Y8tnsu00xaEg1I3lxpaLzxHRUQvWXkAcnGijxRpRjxy6DYrEmK6rkD00uNdaBK00"
    );

    const makePaymentResponse = await fetch(
      `http://${myIp}:5000/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productsList: productsList,
          subtotal: Subtotal,
          discount: discount || 0,
          promocode_voucherCode: discountCode || "",
          isStandardShippingChosen: isStandardShippingChosen,
          shipping: shipping,
          userId: user._id,
        }),
      }
    );

    const session = await makePaymentResponse.json();

    localStorage.setItem("orderProductDetails", JSON.stringify(productsList));

    localStorage.setItem(
      "orderPricingDetails",
      JSON.stringify([
        {
          subtotal: Subtotal,
          discount: discount || 0,
          promocode_voucherCode: discountCode || "",
          isStandardShippingChosen: isStandardShippingChosen,
          shipping: shipping,
          userId: user._id,
        },
      ])
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="font-[sans-serif] h-full">
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
      <div className="max-w-7xl max-lg:max-w-3xl mx-auto p-6">
        {cartList.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-100">
              Your shopping Cart
            </h2>
            <div className="grid lg:grid-cols-3 gap-6 relative mt-6">
              <div className="lg:col-span-2 space-y-6 ">
                {cartList.map((cartItem, cartItemIndex) => (
                  <div className="p-2 bg-white bg-opacity-15 rounded-md shadow-[0_2px_9px_-3px_rgba(61,63,68,0.3)] relative">
                    {(() => {
                      const product = productList.find(
                        (productItem) => productItem._id === cartItem.productId
                      );
                      if (product?.weight) {
                        weight += parseFloat(product.weight);
                      }
                      return null;
                    })()}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-center to-gray-50 w-full h-full p-4 shrink-0 text-center relative">
                        {(() => {
                          const productImageItem = productImagesList.find(
                            (item) => item.productId === cartItem.productId
                          );

                          return productImageItem ? (
                            <img
                              key={productImageItem.productId} // Unique key
                              className="z-[2] w-80 h-80 object-contain" // Doubled size
                              src={`http://${myIp}:5000/${productImageItem.imagePath[0]}`}
                              alt=""
                            />
                          ) : null;
                        })()}

                        {productList?.find(
                          (productItem) =>
                            productItem._id === cartItem.productId
                        )?.productType === "Digital" ? (
                          <img
                            src="/src/assets/Digital_Banner/Digital_Banner.png"
                            className="absolute z-[3] w-80 h-80 object-contain" // Fit to image size
                            alt="Digital banner"
                          />
                        ) : null}
                      </div>
                      <div className="p-2">
                        <div className=" flex flex-row justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-100">
                            {
                              productList.find(
                                (productItem) =>
                                  productItem._id === cartItem.productId
                              )?.title
                            }
                          </h3>
                          <h4
                            className={`text-lg font-bold ${
                              productList.find(
                                (productItem) =>
                                  productItem._id === cartItem.productId
                              )?.productType === "Physical"
                                ? "text-gray-300"
                                : "text-yellow-500"
                            } `}
                          >
                            <div className="flex flex-row items-baseline gap-2 mt-2">
                              {promotionList.length > 0 ? (
                                promotionList.filter(
                                  (promotion) =>
                                    (promotion.productType ===
                                      productList.find(
                                        (product) =>
                                          product._id === cartItem.productId
                                      )?.productType ||
                                      promotion.productType === "Both") &&
                                    (promotion.categoryId ===
                                      productList.find(
                                        (product) =>
                                          product._id === cartItem.productId
                                      ).categoryId ||
                                      promotion.categoryId === "1")
                                ).length > 0 ? (
                                  promotionList
                                    .filter(
                                      (promotion) =>
                                        (promotion.productType ===
                                          productList.find(
                                            (product) =>
                                              product._id === cartItem.productId
                                          ).productType ||
                                          promotion.productType === "Both") &&
                                        (promotion.categoryId ===
                                          productList.find(
                                            (product) =>
                                              product._id === cartItem.productId
                                          ).categoryId ||
                                          promotion.categoryId === "1")
                                    )
                                    .map((promotion) => {
                                      if (
                                        productList.find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        ).productType === "Physical"
                                      ) {
                                        const product = productList.find(
                                          (productItem) =>
                                            productItem._id ===
                                            cartItem.productId
                                        );

                                        let price = 0;

                                        if (
                                          product?.productType === "Physical"
                                        ) {
                                          price = Number(
                                            product.variations?.find(
                                              (variationItem) =>
                                                variationItem.combination ===
                                                cartItem.variant
                                            )?.price || 0
                                          );
                                        } else {
                                          price = Number(
                                            product?.basePrice || 0
                                          );
                                        }

                                        const discountedPrice = (
                                          (price * (100 - promotion.value)) /
                                          100
                                        ).toFixed(2);

                                        productsList.push({
                                          productId: cartItem.productId,
                                          title: productList.find(
                                            (productItem) =>
                                              productItem._id ===
                                              cartItem.productId
                                          )?.title,
                                          productType: productList?.find(
                                            (productItem) =>
                                              productItem._id ===
                                              cartItem.productId
                                          )?.productType,
                                          quantity: cartItem.quantity,
                                          price:
                                            productList?.find(
                                              (productItem) =>
                                                productItem._id ===
                                                cartItem.productId
                                            )?.productType === "Digital"
                                              ? productList.find(
                                                  (productItem) =>
                                                    productItem._id ===
                                                    cartItem.productId
                                                )?.basePrice
                                              : productList
                                                  .find(
                                                    (productItem) =>
                                                      productItem._id ===
                                                      cartItem.productId
                                                  )
                                                  ?.variations?.find(
                                                    (variationItem) =>
                                                      variationItem.combination ===
                                                      cartItem.variant
                                                  )?.price,
                                          ...(discountedPrice !== 0
                                            ? {
                                                discountedPrice:
                                                  discountedPrice,
                                              }
                                            : {}),
                                          ...(cartItem.variant?.length
                                            ? {
                                                variant: cartItem.variant,
                                              }
                                            : {}),
                                          ...(cartItem.multiColorColorList
                                            ?.length
                                            ? {
                                                multiColorColorList:
                                                  cartItem.multiColorColorList,
                                              }
                                            : {}),
                                        });

                                        return (
                                          <React.Fragment key={promotion.id}>
                                            <strike className=" text-gray-400 text-lg font-semibold">
                                              $
                                              {productList.find(
                                                (productItem) =>
                                                  productItem._id ===
                                                  cartItem.productId
                                              )?.productType === "Physical"
                                                ? Number(
                                                    productList
                                                      .find(
                                                        (productItem) =>
                                                          productItem._id ===
                                                          cartItem.productId
                                                      )
                                                      ?.variations?.find(
                                                        (variationItem) =>
                                                          variationItem.combination ===
                                                          cartItem.variant
                                                      )?.price
                                                  ).toFixed(2)
                                                : Number(
                                                    productList.find(
                                                      (productItem) =>
                                                        productItem._id ===
                                                        cartItem.productId
                                                    )?.basePrice
                                                  ).toFixed(2)}
                                            </strike>
                                            {/* here */}
                                            <span className="  flex flex-row items-baseline text-white font-bold">
                                              $
                                              {Number(discountedPrice).toFixed(
                                                2
                                              )}
                                            </span>
                                          </React.Fragment>
                                        );
                                      } else if (
                                        productList.find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        ).productType === "Digital"
                                      ) {
                                        const discountedPrice =
                                          (productList.find(
                                            (product) =>
                                              product._id === cartItem.productId
                                          ).basePrice *
                                            (100 - promotion.value)) /
                                          100;

                                        return (
                                          <React.Fragment key={promotion.id}>
                                            <strike className=" text-gray-400 text-lg font-semibold">
                                              $
                                              {productList.find(
                                                (productItem) =>
                                                  productItem._id ===
                                                  cartItem.productId
                                              )?.productType === "Physical"
                                                ? Number(
                                                    productList
                                                      .find(
                                                        (productItem) =>
                                                          productItem._id ===
                                                          cartItem.productId
                                                      )
                                                      ?.variations?.find(
                                                        (variationItem) =>
                                                          variationItem.combination ===
                                                          cartItem.variant
                                                      )?.price
                                                  ).toFixed(2)
                                                : Number(
                                                    productList.find(
                                                      (productItem) =>
                                                        productItem._id ===
                                                        cartItem.productId
                                                    )?.basePrice
                                                  ).toFixed(2)}
                                            </strike>
                                            {(() => {
                                              const price = Number(
                                                discountedPrice || 0
                                              );
                                              Subtotal += price;

                                              productsList.push({
                                                productId: cartItem.productId,
                                                title: productList.find(
                                                  (productItem) =>
                                                    productItem._id ===
                                                    cartItem.productId
                                                )?.title,
                                                productType: productList?.find(
                                                  (productItem) =>
                                                    productItem._id ===
                                                    cartItem.productId
                                                )?.productType,
                                                quantity: cartItem.quantity,
                                                price:
                                                  productList?.find(
                                                    (productItem) =>
                                                      productItem._id ===
                                                      cartItem.productId
                                                  )?.productType === "Digital"
                                                    ? productList.find(
                                                        (productItem) =>
                                                          productItem._id ===
                                                          cartItem.productId
                                                      )?.basePrice
                                                    : productList
                                                        .find(
                                                          (productItem) =>
                                                            productItem._id ===
                                                            cartItem.productId
                                                        )
                                                        ?.variations?.find(
                                                          (variationItem) =>
                                                            variationItem.combination ===
                                                            cartItem.variant
                                                        )?.price,
                                                ...(price !== 0
                                                  ? { discountedPrice: price }
                                                  : {}),
                                                ...(cartItem.variant?.length
                                                  ? {
                                                      variant: cartItem.variant,
                                                    }
                                                  : {}),
                                                ...(cartItem.multiColorColorList
                                                  ?.length
                                                  ? {
                                                      multiColorColorList:
                                                        cartItem.multiColorColorList,
                                                    }
                                                  : {}),
                                              });

                                              return (
                                                // here
                                                <span className="flex flex-row items-baseline text-yellow-500 text-3xl font-bold">
                                                  ${price.toFixed(2)}
                                                </span>
                                              );
                                            })()}
                                          </React.Fragment>
                                        );
                                      }
                                      return null;
                                    })
                                ) : productList.find(
                                    (product) =>
                                      product._id === cartItem.productId
                                  )?.productType === "Physical" ? (
                                  <span className=" text-white font-bold">
                                    $
                                    {Number(
                                      productList
                                        .find(
                                          (productItem) =>
                                            productItem._id ===
                                            cartItem.productId
                                        )
                                        ?.variations?.find(
                                          (variationItem) =>
                                            variationItem.combination ===
                                            cartItem.variant
                                        )?.price
                                    ).toFixed(2)}
                                  </span>
                                ) : (
                                  productList.find(
                                    (product) =>
                                      product._id === cartItem.productId
                                  )?.productType === "Digital" &&
                                  (() => {
                                    const product = productList.find(
                                      (productItem) =>
                                        productItem._id === cartItem.productId
                                    );

                                    if (!product) return null;

                                    const basePrice = Number(
                                      product.basePrice || 0
                                    );
                                    const totalPrice = (
                                      basePrice * cartItem.quantity
                                    ).toFixed(2);

                                    Subtotal += basePrice * cartItem.quantity;

                                    productsList.push({
                                      productId: cartItem.productId,
                                      title: product?.title,
                                      productType: product?.productType,
                                      quantity: cartItem.quantity,
                                      price:
                                        product?.productType === "Digital"
                                          ? product?.basePrice
                                          : variation?.price,
                                      discountedPrice: null,
                                      ...(cartItem.variant?.length
                                        ? { variant: cartItem.variant }
                                        : {}),
                                      ...(cartItem.multiColorColorList?.length
                                        ? {
                                            multiColorColorList:
                                              cartItem.multiColorColorList,
                                          }
                                        : {}),
                                    });

                                    return (
                                      <span className="text-yellow-500 text-3xl font-bold">
                                        ${totalPrice}
                                      </span>
                                    );
                                  })()
                                )
                              ) : // No promotion, show the regular price
                              productList.find(
                                  (product) =>
                                    product._id === cartItem.productId
                                )?.productType === "Physical" ? (
                                (() => {
                                  const product = productList.find(
                                    (p) => p._id === cartItem.productId
                                  );
                                  const variation = product?.variations?.find(
                                    (v) => v.combination === cartItem.variant
                                  );
                                  const image = productImagesList.find(
                                    (img) =>
                                      img.productId === cartItem.productId
                                  )?.imagePath[0];

                                  productsList.push({
                                    productId: cartItem.productId,
                                    title: product?.title,
                                    productType: product?.productType,
                                    quantity: cartItem.quantity,
                                    price:
                                      product?.productType === "Digital"
                                        ? product?.basePrice
                                        : variation?.price,
                                    discountedPrice: null,
                                    ...(cartItem.variant?.length
                                      ? { variant: cartItem.variant }
                                      : {}),
                                    ...(cartItem.multiColorColorList?.length
                                      ? {
                                          multiColorColorList:
                                            cartItem.multiColorColorList,
                                        }
                                      : {}),
                                  });

                                  return (
                                    <span className="text-white font-bold">
                                      $
                                      {Number(
                                        variation?.price || product?.basePrice
                                      ).toFixed(2)}
                                    </span>
                                  );
                                })()
                              ) : (
                                productList.find(
                                  (product) =>
                                    product._id === cartItem.productId
                                )?.productType === "Digital" &&
                                (() => {
                                  const product = productList.find(
                                    (product) =>
                                      product._id === cartItem.productId
                                  );
                                  if (
                                    !product ||
                                    product.productType !== "Digital"
                                  )
                                    return null;

                                  const basePrice = Number(product.basePrice);
                                  const totalPrice = (
                                    basePrice * cartItem.quantity
                                  ).toFixed(2);
                                  Subtotal += basePrice * cartItem.quantity;

                                  productsList.push({
                                    productId: cartItem.productId,
                                    title: productList.find(
                                      (productItem) =>
                                        productItem._id === cartItem.productId
                                    )?.title,
                                    productType: productList?.find(
                                      (productItem) =>
                                        productItem._id === cartItem.productId
                                    )?.productType,
                                    quantity: cartItem.quantity,
                                    price:
                                      productList?.find(
                                        (productItem) =>
                                          productItem._id === cartItem.productId
                                      )?.productType === "Digital"
                                        ? productList.find(
                                            (productItem) =>
                                              productItem._id ===
                                              cartItem.productId
                                          )?.basePrice
                                        : productList
                                            .find(
                                              (productItem) =>
                                                productItem._id ===
                                                cartItem.productId
                                            )
                                            ?.variations?.find(
                                              (variationItem) =>
                                                variationItem.combination ===
                                                cartItem.variant
                                            )?.price,
                                    discountedPrice: null,
                                    ...(cartItem.variant?.length
                                      ? {
                                          variant: cartItem.variant,
                                        }
                                      : {}),
                                    ...(cartItem.multiColorColorList?.length
                                      ? {
                                          multiColorColorList:
                                            cartItem.multiColorColorList,
                                        }
                                      : {}),
                                  });

                                  return (
                                    <span className="text-yellow-500 text-3xl font-bold">
                                      ${totalPrice}
                                    </span>
                                  );
                                })()
                              )}
                            </div>
                          </h4>
                        </div>
                        {productList?.find(
                          (productItem) =>
                            productItem._id === cartItem.productId
                        )?.productType === "Digital" ? (
                          <>
                            <p className="mb-1 font-normal text-gray-300 dark:text-gray-400 text-lg">
                              3D Printable File
                            </p>
                            {productList.find(
                              (productItem) =>
                                productItem._id === cartItem.productId
                            )?.status === "1" ? (
                              <p className=" text-green-600 text-lg font-semibold">
                                In Stock
                              </p>
                            ) : (
                              <p className="text-red-600 text-lg font-semibold">
                                Out of Stock
                              </p>
                            )}
                          </>
                        ) : productList.find(
                            (productItem) =>
                              productItem._id === cartItem.productId
                          )?.productType === "Physical" &&
                          productList.find(
                            (productItem) =>
                              productItem._id === cartItem.productId
                          ).variationsList.length > 0 ? (
                          <>
                            {productList
                              .find(
                                (productItem) =>
                                  productItem._id === cartItem.productId
                              )
                              .variationsList.map((variationsItem, index) => (
                                <p
                                  key={index}
                                  className="mb-1 font-normal text-gray-300 dark:text-gray-400"
                                >
                                  {variationsItem} :
                                  {cartItem.variant.split(" - ")[index]}
                                  {cartItem.variant
                                    .split(" - ")
                                    [index].includes("Multi Color")
                                    ? " | " +
                                      cartItem.multiColorColorList.join(" , ")
                                    : null}
                                </p>
                              ))}
                            {productList
                              .find(
                                (productItem) =>
                                  productItem._id === cartItem.productId
                              )
                              .variations.filter(
                                (variationItem) =>
                                  variationItem.combination === cartItem.variant
                              )[0].status === 1 &&
                            productList.find(
                              (productItem) =>
                                productItem._id === cartItem.productId
                            )?.status === "1" ? (
                              <p className=" text-green-600 text-lg font-semibold">
                                In Stock
                              </p>
                            ) : (
                              <p className="text-red-600 text-lg font-semibold">
                                Out of Stock
                              </p>
                            )}
                          </>
                        ) : null}

                        <div className="flex 2xl:flex-row flex-col 2xl:items-center 2xl:justify-between gap-1 mt-2">
                          {promotionList.length > 0
                            ? promotionList.filter(
                                (promotion) =>
                                  (promotion.productType ===
                                    productList.find(
                                      (product) =>
                                        product._id === cartItem.productId
                                    )?.productType ||
                                    promotion.productType === "Both") &&
                                  (promotion.categoryId ===
                                    productList.find(
                                      (product) =>
                                        product._id === cartItem.productId
                                    ).categoryId ||
                                    promotion.categoryId === "1")
                              ).length > 0
                              ? promotionList
                                  .filter(
                                    (promotion) =>
                                      (promotion.productType ===
                                        productList.find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        ).productType ||
                                        promotion.productType === "Both") &&
                                      (promotion.categoryId ===
                                        productList.find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        ).categoryId ||
                                        promotion.categoryId === "1")
                                  )
                                  .map((promotion) => {
                                    if (
                                      productList.find(
                                        (product) =>
                                          product._id === cartItem.productId
                                      ).productType === "Physical"
                                    ) {
                                      // Find the minimum price from variations
                                      const minPrice = productList
                                        .find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        )
                                        .variations.reduce(
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
                                            className="w-1/2"
                                            endDate={promotion.endDate}
                                          />
                                        </React.Fragment>
                                      );
                                    } else if (
                                      productList.find(
                                        (product) =>
                                          product._id === cartItem.productId
                                      ).productType === "Digital"
                                    ) {
                                      const discountedPrice =
                                        (productList.find(
                                          (product) =>
                                            product._id === cartItem.productId
                                        ).basePrice *
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

                        <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
                          {productList.find(
                            (productItem) =>
                              productItem._id === cartItem.productId
                          )?.productType === "Physical" ? (
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm text-gray-300">Qty:</h4>
                              <div className="flex gap-2 items-centerpx-3 bg-white bg-opacity-15 rounded-lg p-2 w-max">
                                <button
                                  onClick={() =>
                                    decreaseQuantity(
                                      cartItem.productId,
                                      cartItem.multiColorColorList,
                                      cartItem.variant,
                                      cartItem.userId
                                    )
                                  }
                                  type="button"
                                  className="border-none outline-none bg-white focus:outline-none focus:outline-transparent bg-opacity-50 hover:bg-opacity-70"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 h-2.5"
                                    viewBox="0 0 121.805 121.804"
                                  >
                                    <path
                                      d="M7.308 68.211h107.188a7.309 7.309 0 0 0 7.309-7.31 7.308 7.308 0 0 0-7.309-7.309H7.308a7.31 7.31 0 0 0 0 14.619z"
                                      data-original="#000000"
                                    />
                                  </svg>
                                </button>
                                <span className="text-gray-100 text-sm font-semibold px-3">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    increaseQuantity(
                                      cartItem.productId,
                                      cartItem.multiColorColorList,
                                      cartItem.variant,
                                      cartItem.quantity,
                                      cartItem.userId
                                    )
                                  }
                                  type="button"
                                  className="border-none  outline-none bg-white focus:outline-none focus:outline-transparent bg-opacity-50 hover:bg-opacity-70"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 h-2.5"
                                    viewBox="0 0 512 512"
                                  >
                                    <path
                                      d="M256 509.892c-19.058 0-34.5-15.442-34.5-34.5V36.608c0-19.058 15.442-34.5 34.5-34.5s34.5 15.442 34.5 34.5v438.784c0 19.058-15.442 34.5-34.5 34.5z"
                                      data-original="#000000"
                                    />
                                    <path
                                      d="M475.392 290.5H36.608c-19.058 0-34.5-15.442-34.5-34.5s15.442-34.5 34.5-34.5h438.784c19.058 0 34.5 15.442 34.5 34.5s-15.442 34.5-34.5 34.5z"
                                      data-original="#000000"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : null}

                          <div>
                            <h4 className="text-3xl font-bold text-yellow-500">
                              {(() => {
                                const product = productList.find(
                                  (p) => p._id === cartItem.productId
                                );
                                if (
                                  !product ||
                                  product.productType !== "Physical"
                                )
                                  return null;

                                const { productType, categoryId, variations } =
                                  product;

                                const matchingPromotions = promotionList.filter(
                                  (promotion) =>
                                    (promotion.productType === productType ||
                                      promotion.productType === "Both") &&
                                    (promotion.categoryId === categoryId ||
                                      promotion.categoryId === "1")
                                );

                                const variation = variations?.find(
                                  (v) => v.combination === cartItem.variant
                                );
                                const basePrice = Number(
                                  variation?.price ??
                                    variations?.[0]?.price ??
                                    0
                                );
                                const quantity = Number(cartItem.quantity);

                                if (matchingPromotions.length > 0) {
                                  // Show discounted price from first valid promotion
                                  const discount = matchingPromotions[0].value;
                                  const discountedPrice = (
                                    (basePrice * (100 - discount)) /
                                    100
                                  ).toFixed(2);
                                  const total = (
                                    discountedPrice * quantity
                                  ).toFixed(2);
                                  {
                                    Subtotal += discountedPrice * quantity;
                                  }
                                  return (
                                    <span className="flex flex-row items-baseline font-bold">
                                      ${total}
                                    </span>
                                  );
                                } else {
                                  const total = (basePrice * quantity).toFixed(
                                    2
                                  );
                                  {
                                    Subtotal += basePrice * quantity;
                                  }
                                  return (
                                    <span className="font-bold">${total}</span>
                                  );
                                }
                              })()}
                            </h4>
                          </div>
                        </div>

                        <div className="divide-x border-y grid grid-cols-2 p-2 gap-2 text-center mt-6">
                          <button
                            onClick={() =>
                              navigate(
                                "../product-details/" +
                                  productList.find(
                                    (productItem) =>
                                      productItem._id === cartItem.productId
                                  )?._id
                              )
                            }
                            type="button"
                            className="bg-white bg-opacity-25 hover:bg-opacity-50 text-white flex items-center justify-center py-3 outline-none focus:outline-none focus:outline-transparent border-none hover:border-none hover:border-transparent text-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 fill-current mr-3 inline-block text-white"
                              viewBox="0 0 128 128"
                            >
                              <path
                                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                data-original="#000000"
                              ></path>
                            </svg>
                            View details
                          </button>
                          <button
                            onClick={() => {
                              handleRemoveFromCart(cartItem);
                            }}
                            type="button"
                            className="bg-white bg-opacity-25 hover:bg-opacity-50 text-white flex items-center justify-center py-3 outline-none focus:outline-none focus:outline-transparent border-none hover:border-none hover:border-transparent text-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 fill-current mr-3 inline-block text-white"
                              viewBox="0 0 390 390"
                            >
                              <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"
                              ></path>
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white bg-opacity-15 rounded-md px-4 py-6 h-max shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]">
                <ul className="text-gray-100 space-y-4">
                  <li className="flex flex-wrap gap-4 text-sm">
                    Subtotal
                    <span className="ml-auto font-bold">
                      ${Subtotal.toFixed(2)}
                    </span>
                  </li>
                  {discount !== null ? (
                    <li className="flex flex-wrap gap-4 text-sm">
                      Discount
                      <span className="ml-auto font-bold">
                        - ${Number(discount).toFixed(2)}
                      </span>
                    </li>
                  ) : null}
                  {!isAllDigital ? (
                    <>
                      <li className="flex flex-wrap gap-4 text-sm">
                        Shipping
                        <span className="ml-auto font-bold">
                          $
                          {isStandardShippingChosen
                            ? (() => {
                                const matchedShipping = shippingData
                                  ?.filter(
                                    (shippingItem) =>
                                      shippingItem.shippingType ===
                                        "Standard shipping" &&
                                      Number(shippingItem.maxProductWeight) >=
                                        weight
                                  )
                                  .sort(
                                    (a, b) =>
                                      Number(a.maxProductWeight) -
                                      Number(b.maxProductWeight)
                                  )[0];
                                shipping = matchedShipping?.price;
                                return Number(matchedShipping?.price).toFixed(
                                  2
                                ); // Replace with UI element if needed
                              })()
                            : (() => {
                                const matchedShipping = shippingData
                                  ?.filter(
                                    (shippingItem) =>
                                      shippingItem.shippingType ===
                                        "Expedited shipping" &&
                                      Number(shippingItem.maxProductWeight) >=
                                        weight
                                  )
                                  .sort(
                                    (a, b) =>
                                      Number(a.maxProductWeight) -
                                      Number(b.maxProductWeight)
                                  )[0];

                                shipping = matchedShipping?.price;
                                return Number(matchedShipping?.price).toFixed(
                                  2
                                ); // Replace with UI element if needed
                              })()}
                        </span>
                      </li>
                      <div className=" w-full flex flex-row items-center justify-start">
                        <div className=" space-y-2">
                          <div className="flex items-center flex-row justify-between gap-8">
                            <label
                              onClick={() => setIsStandardShippingChosen(true)}
                              htmlFor="default-radio-1"
                              className="ms-2 text-sm font-medium text-gray-300 cursor-pointer"
                            >
                              Standard Shipping
                            </label>
                            <input
                              onClick={() => setIsStandardShippingChosen(true)}
                              id="default-radio-1"
                              defaultChecked
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 accent-yellow-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center flex-row justify-between gap-8">
                            <label
                              onClick={() => setIsStandardShippingChosen(false)}
                              htmlFor="default-radio-2"
                              className="ms-2 text-sm font-medium text-gray-300 cursor-pointer"
                            >
                              Expedited Shipping
                            </label>
                            <input
                              onClick={() => setIsStandardShippingChosen(false)}
                              id="default-radio-2"
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 accent-yellow-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <hr className="border-gray-300" />
                  <li className="flex flex-wrap gap-4 text-sm font-bold">
                    Total
                    <span className="ml-auto">
                      $
                      {Number(
                        Number(Subtotal) - Number(discount) + Number(shipping)
                      ).toFixed(2)}
                    </span>
                  </li>
                </ul>

                <div className=" flex flex-col justify-end my-3 items-end gap-2">
                  <div className="bg-white bg-opacity-15 text-white flex px-1 py-1 rounded-2xl text-left">
                    <input
                      onChange={(e) => setDiscountCode(e.target.value)}
                      type="text"
                      placeholder="Promo Code / Voucher"
                      className="w-full outline-none bg-transparent pl-4 text-sm placeholder:text-gray-300"
                    />
                    <button
                      onClick={handlePromoCodeOnClick}
                      type="button"
                      className="bg-black hover:bg-white hover:text-black text-white font-bold  text-sm rounded-2xl hover:border-transparent outline-none focus:outline-none focus:outline-transparent px-2 py-2 tracking-wide"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <button
                    onClick={handlecheckout}
                    type="button"
                    className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-yellow-500 hover:bg-yellow-400 text-black rounded-md hover:border-transparent focus:outline-none outline-none focus:outline-transparent`}
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => navigate("../shop")}
                    type="button"
                    className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent hover:bg-gray-100 text-gray-100 border hover:text-black border-gray-300 rounded-md hover:border-transparent focus:outline-none outline-none focus:outline-transparent"
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-4 rounded-md bg-yellow-400">
                  <img
                    src="/src/assets/Site_Images/PaymentMethodImage/stripe-payments.png"
                    className="w-full object-contain rounded-md"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 w-full">
            <p className="text-white text-4xl">Your Cart is Empty :(</p>
            <button
              onClick={() => navigate("../shop")}
              className=" max-md:hidden text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-3xl px-20 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 mt-8 hover:border-transparent focus:outline-none focus:outline-transparent outline-none"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartListing;
