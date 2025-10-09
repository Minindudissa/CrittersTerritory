import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserAuthContextProvider from "./context/UserAuthContext";
import AdminAuthContextProvider from "./context/AdminAuthContext";
import SearchContextProvider from "./context/SearchContext";
import ProductTypeContextProvider from "./context/ProductTypeContext";
import CategoryContextProvider from "./context/CategoryContext";
import ScrollToTop from "./pages/ScrollToTop/ScrollToTop";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminAuthContextProvider>
      <UserAuthContextProvider>
        <CategoryContextProvider>
          <ProductTypeContextProvider>
            <SearchContextProvider>
              <ScrollToTop />
              <App />
            </SearchContextProvider>
          </ProductTypeContextProvider>
        </CategoryContextProvider>
      </UserAuthContextProvider>
    </AdminAuthContextProvider>
  </BrowserRouter>
);
