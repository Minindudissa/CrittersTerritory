import axios from "axios";  
const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

export const RegisterUser = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/user/register`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const UpdateUser = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/user/update`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const searchUser = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/user/search`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const loginUser = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/user/login`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `https://${myIp}/api/user/logout`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const loginAdmin = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/admin/login`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const logoutAdmin = async () => {
  const response = await axios.post(
    `https://${myIp}/api/admin/logout`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const RegisterAdmin = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/admin/register`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const UpdateAdmin = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/admin/update`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const searchAdmin = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/admin/search`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const adminPasswordChange = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/admin/changeAdminPassword`,
    formData
  );
  return response?.data;
};

export const callUserAuthApi = async () => {
  const response = await axios.post(
    `https://${myIp}/api/user/auth`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const callAdminAuthApi = async () => {
  const response = await axios.post(
    `https://${myIp}/api/admin/auth`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const createPageTopBanner = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/pageTopBanner/createPageTopBanner`,
    formData
  );
  return response?.data;
};

export const getPageTopBanner = async (id) => {
  const response = await axios.get(
    `https://${myIp}/api/pageTopBanner/getPageTopBanner/` + id
  );
  return response?.data;
};

export const registerForNewsLetter = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/newsLetter/registerForNewsLetter`,
    formData
  );
  return response?.data;
};

export const searchNewsLetter = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/newsLetter/searchNewsLetter`,
    formData
  );
  return response?.data;
};

export const updateNewsLetter = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/newsLetter/updateNewsLetter`,
    formData
  );
  return response?.data;
};

export const sendEmail = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/email/send-email`,
    formData
  );
  return response?.data;
};

export const createPromoCode = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promoCode/createPromo`,
    formData
  );
  return response?.data;
};

export const searchPromoCode = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promoCode/searchPromo`,
    formData
  );
  return response?.data;
};

export const updatePromoCode = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promoCode/updatePromo`,
    formData
  );
  return response?.data;
};

export const deletePromoCode = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promoCode/deletePromo`,
    formData
  );
  return response?.data;
};

export const createVoucher = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/voucher/createVoucher`,
    formData
  );
  return response?.data;
};

export const searchVoucher = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/voucher/searchVoucher`,
    formData
  );
  return response?.data;
};

export const updateVoucher = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/voucher/updateVoucher`,
    formData
  );
  return response?.data;
};

export const deleteVoucher = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/voucher/deleteVoucher`,
    formData
  );
  return response?.data;
};

export const createPromotion = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promotion/createPromotion`,
    formData
  );
  return response?.data;
};

export const searchPromotion = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promotion/searchPromotion`,
    formData
  );
  return response?.data;
};

export const updatePromotion = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promotion/updatePromotion`,
    formData
  );
  return response?.data;
};

export const deletePromotion = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/promotion/deletePromotion`,
    formData
  );
  return response?.data;
};

export const genderSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/gender/searchGender`,
    formData
  );
  return response?.data;
};

export const countrySearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/country/searchCountry`,
    formData
  );
  return response?.data;
};

export const userPasswordChange = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/user/changeUserPassword`,
    formData
  );
  return response?.data;
};
export const createUpdateAddress = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/address/create-updateAddress`,
    formData
  );
  return response?.data;
};
export const searchAddress = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/address/searchAddress`,
    formData
  );
  return response?.data;
};

export const categoryCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/category/create`,
    formData
  );
  return response?.data;
};

export const categorySearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/category/search`,
    formData
  );
  return response?.data;
};

export const categoryUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/category/update`,
    formData
  );
  return response?.data;
};
export const sizeCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/size/create`,
    formData
  );
  return response?.data;
};

export const sizeSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/size/search`,
    formData
  );
  return response?.data;
};

export const sizeUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/size/update`,
    formData
  );
  return response?.data;
};
export const colorCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/color/create`,
    formData
  );
  return response?.data;
};

export const colorSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/color/search`,
    formData
  );
  return response?.data;
};

export const colorUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/color/update`,
    formData
  );
  return response?.data;
};

export const productCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/product/createProduct`,
    formData
  );
  return response?.data;
};

export const productSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/product/searchProduct`,
    formData
  );
  return response?.data;
};

export const productUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/product/updateProduct`,
    formData
  );
  return response?.data;
};
export const RandomProductSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/product/randomProductSearch`,
    formData
  );
  return response?.data;
};

export const productImageCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/productImage/createProductImage`,
    formData
  );
  return response?.data;
};

export const productImageSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/productImage/searchProductImage`,
    formData
  );
  return response?.data;
};

export const productImageUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/productImage/updateProductImage`,
    formData
  );
  return response?.data;
};

export const createReview = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/review/createReview`,
    formData
  );
  return response?.data;
};

export const reviewSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/review/searchReview`,
    formData
  );
  return response?.data;
};

export const uploadReviewImages = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/review/uploadReviewImages`,
    formData
  );
  return response?.data;
};

export const wishlistCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/wishlist/createWishlist`,
    formData
  );
  return response?.data;
};
export const wishlistSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/wishlist/searchWishlist`,
    formData
  );
  return response?.data;
};
export const wishlistUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/wishlist/updateWishlist`,
    formData
  );
  return response?.data;
};
export const wishlistDelete = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/wishlist/deleteWishlist`,
    formData
  );
  return response?.data;
};
export const cartCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/cart/createCart`,
    formData
  );
  return response?.data;
};
export const cartSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/cart/searchCart`,
    formData
  );
  return response?.data;
};
export const cartUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/cart/updateCart`,
    formData
  );
  return response?.data;
};
export const cartDelete = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/cart/deleteCart`,
    formData
  );
  return response?.data;
};

export const makeCheckoutPayment = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/payment/create-checkout-session`,
    formData
  );
  return response?.data;
};

export const createShippingData = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/shipping/createShippingData`,
    formData
  );
  return response?.data;
};
export const searchShippingData = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/shipping/searchShippingData`,
    formData
  );
  return response?.data;
};
export const updateShippingData = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/shipping/updateShippingData`,
    formData
  );
  return response?.data;
};
export const deleteShippingData = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/shipping/deleteShippingData`,
    formData
  );
  return response?.data;
};
export const orderCreate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/order/createOrder`,
    formData
  );
  return response?.data;
};

export const orderSearch = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/order/searchOrder`,
    formData
  );
  return response?.data;
};

export const orderUpdate = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/order/updateOrder`,
    formData
  );
  return response?.data;
};

export const createStripeCoupon = async (formData) => {
  const response = await axios.post(
    `https://${myIp}/api/stripeCoupon/createStripeCoupon`,
    formData
  );
  return response?.data;
};