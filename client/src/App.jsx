import { Navigate, Route, Routes } from "react-router-dom";
import UserLayout from "./pages/UserPages/User-Layout";
import Listings from "./pages/UserPages/shop/ProductsListings";
import ProductDetails from "./pages/UserPages/shop/SingleProductView";
import CartLayout from "./pages/UserPages/shop/Cart/CartLayout";
import Checkout from "./pages/UserPages/shop/Cart/Checkout";
import NotFound from "./pages/NotFound";
import CartListing from "./pages/UserPages/shop/Cart/CartListing";
import ShippingDetails from "./pages/UserPages/shop/Cart/ShippingDetails";
import UserLogIn from "./pages/auth/user/LogIn";
import UserRegister from "./pages/auth/user/Register";
import AdminLogIn from "./pages/auth/admin/LogIn";
import ContactUs from "./pages/UserPages/ContactUs";
import PageLoading from "./pages/PageLoading";
import AdminLayout from "./pages/AdminPages/Admin-Layout";
import AdminDashboard from "./pages/AdminPages/Dashboard";
import ControlRoom from "./pages/AdminPages/Common-Sections/ControlRoom";
import ChangePageTopBanner from "./pages/AdminPages/ControlRoom/PageTopBanner";
import UserProfileLayout from "./pages/UserPages/User-Layout/profile";
import MyProfile from "./pages/UserPages/User-Profile/My-Profile";
import AboutUs from "./pages/UserPages/AboutUs";
import MyOrders from "./pages/UserPages/User-Profile/My-Orders";
import Settings from "./pages/UserPages/User-Profile/Settings";
import TermsAndConditions from "./pages/UserPages/TermsAndConditions";
import PrivacyPolicy from "./pages/UserPages/PrivacyPolicy";
import Delivery from "./pages/UserPages/Delivery";
import Wishlist from "./pages/UserPages/Wishlist";
import Warranty from "./pages/UserPages/Warranty";
import Users from "./pages/AdminPages/Users";
import Products from "./pages/AdminPages/Products";
import Profile from "./pages/AdminPages/Profile";
import Admins from "./pages/AdminPages/Admins";
import AddProducts from "./pages/AdminPages/Products/Add-Products";
import Variations from "./pages/AdminPages/ControlRoom/Variations";
import Category from "./pages/AdminPages/ControlRoom/Category";
import VouchersDiscounts from "./pages/UserPages/Voucher";
import RegisterNewAdmin from "./pages/AdminPages/ControlRoom/RegisterAdmin";
import UpdateProducts from "./pages/AdminPages/Products/Update-Products";
import Home from "./pages/UserPages/home";
import PaymentSuccessPage from "./pages/UserPages/shop/Cart/PaymentSuccessPage/PaymentSuccessPage";
import PaymentDeclinedPage from "./pages/UserPages/shop/Cart/PaymentDeclinedPage/PaymentDeclinedPage";
import Shipping from "./pages/AdminPages/ControlRoom/Shipping";
import Invoice from "./pages/UserPages/User-Profile/Invoice";
import AllOrders from "./pages/AdminPages/Orders";
import Voucher from "./pages/UserPages/Voucher";
import AllVouchers from "./pages/AdminPages/ControlRoom/allVouchers";
import AllPromotions from "./pages/AdminPages/ControlRoom/allPromotions";
import AllDiscounts from "./pages/AdminPages/ControlRoom/allDiscounts";
function App() {
  return (
    <Routes>
      <Route path="auth">
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<UserLogIn />} />
        <Route path="register" element={<UserRegister />} />
        <Route path="admin">
          <Route index element={<Navigate to="/auth/admin/login" replace />} />
          <Route path="Login" element={<AdminLogIn />} />
        </Route>
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="admins" element={<Admins />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="add-products" element={<AddProducts />} />
        <Route path="update-products/:id" element={<UpdateProducts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="controlRoom" element={<ControlRoom />} />
        <Route path="page-top-banner" element={<ChangePageTopBanner />} />
        <Route path="registerAdmin" element={<RegisterNewAdmin />} />
        <Route path="variations" element={<Variations />} />
        <Route path="category" element={<Category />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="orders" element={<AllOrders />} />
        <Route path="allDiscounts" element={<AllDiscounts />} />
        <Route path="allPromotions" element={<AllPromotions />} />
        <Route path="allVouchers" element={<AllVouchers />} />
      </Route>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Listings />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="voucher" element={<Voucher />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<CartListing />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-decline" element={<PaymentDeclinedPage />} />
        <Route path="/shipping-details" element={<ShippingDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/user-profile" element={<UserProfileLayout />}>
          <Route
            index
            element={<Navigate to="/user-profile/my-profile" replace />}
          />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-orders/invoice/:id" element={<Invoice />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/t&c" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Route>
      <Route path="page" element={<PageLoading />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
