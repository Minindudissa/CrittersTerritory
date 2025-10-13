import { SearchContext } from "@/context/SearchContext";
import { UserAuthContext } from "@/context/UserAuthContext";
import PageLoading from "@/pages/PageLoading";
import { cartSearch, wishlistSearch } from "@/services";
import { use, useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);

  const [smallScreenMenuVisible, setSmallScreenMenuVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [wishlist, setWishlist] = useState(false);
  const [cartList, setCartList] = useState(false);
  const { searchText, setSearchText } = useContext(SearchContext);

  const handleSearch = (e) => {
    setSearchText(e.target.value);

    // If user types something, navigate to "/shop"
    if (e.target.value.length > 0) {
      navigate("/shop");
    }
  };

  useEffect(() => {
    // Clear search text when navigating away from /shop
    if (location.pathname !== "/shop") {
      setIsSearchVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    async function fetchData() {
      setSmallScreenMenuVisible(false);
      setIsLoading(true); // Start loading

      try {
        if (user !== null) {
          const [wishlistResponse, cartResponse] = await Promise.all([
            wishlistSearch({ searchData: { userId: user._id } }),
            cartSearch({ searchData: { userId: user._id } }),
          ]);

          if (wishlistResponse?.success) {
            setWishlist(wishlistResponse.wishlist);
          }

          if (cartResponse?.success) {
            setCartList(cartResponse.cartList);
          }
        } else {
          const wishlistData =
            JSON.parse(localStorage.getItem("wishlistData")) || [];
          setWishlist(wishlistData);
          const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
          setCartList(cartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Ensures loading stops regardless of success or failure
      }
    }

    fetchData();
  }, [user?._id, location.pathname]); // Depend on user._id so it refetches if the user changes

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenWidth > 1024) {
      setSmallScreenMenuVisible(false);
    }
  }, [screenWidth]);

  return isLoading ? (
    <PageLoading />
  ) : (
    <div>
      <header className="flex border-b bg-black bg-opacity-10 font-sans min-h-[70px] tracking-wide relative z-50 border-none">
        <div className="flex items-center justify-between sm:px-10 px-4 py-3 gap-4 w-full max-w-screen-xl mx-auto">
          <a
            onClick={() => navigate("../", { replace: true })}
            className="max-sm:hidden cursor-pointer"
          >
            <img
              src="/assets/Logo/Critters_Territory.png"
              alt="logo Lettering"
              className="w-48 mt-2"
            />
          </a>
          <a
            onClick={() => navigate("../", { replace: true })}
            className="hidden max-sm:block cursor-pointer"
          >
            <img
              src="/assets/Logo/Critters_Territory.png"
              alt="logo Lettering"
              className="w-48 mt-2"
            />
          </a>

          <div
            id="collapseMenu"
            className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          >
            <button
              id="toggleClose"
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 fill-black"
                viewBox="0 0 320.591 320.591"
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
            </button>

            <ul className="lg:flex lg:gap-x-10 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="mb-6 hidden max-lg:block">
                <a>
                  <img
                    src="https://readymadeui.com/readymadeui.svg"
                    alt="logo"
                    className="w-36"
                  />
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3">
                <a
                  onClick={() => navigate("../", { replace: true })}
                  className={`cursor-pointer text-white  text-[15px] font-bold ${location.pathname === "/" ? "text-yellow-400 hover:text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`}
                >
                  Home
                </a>
              </li>
              <li className="group max-lg:border-b max-lg:py-3 relative">
                <a
                  onClick={() => navigate("../shop", { replace: true })}
                  className={`cursor-pointer  text-white text-[15px] font-bold ${location.pathname === "/shop" ? "text-yellow-400 hover:text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`}
                >
                  Shop
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3">
                <a
                  onClick={() => navigate("../contact-us", { replace: true })}
                  className={`cursor-pointer  text-white text-[15px] font-bold ${location.pathname === "/contact-us" ? "text-yellow-400 hover:text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`}
                >
                  Contact Us
                </a>
              </li>
              <li className="max-lg:border-b max-lg:py-3">
                <a
                  onClick={() => navigate("../about-us", { replace: true })}
                  className={`cursor-pointer  text-white text-[15px] font-bold ${location.pathname === "/about-us" ? "text-yellow-400 hover:text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`}
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-8 max-lg:ml-auto">
            <svg
              onClick={() => {
                setIsSearchVisible(!isSearchVisible);
              }}
              xmlns="https://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="20px"
              className="cursor-pointer fill-[#ffffff] hover:fill-yellow-400"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
            <span
              className="relative cursor-pointer"
              onClick={() => {
                navigate("/wishlist");
              }}
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                width="20px"
                className="cursor-pointer fill-[#ffffff] hover:fill-yellow-400 inline"
                viewBox="0 0 64 64"
              >
                <path
                  d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                  data-original="#000000"
                />
              </svg>
              {wishlist === null ? null : wishlist.length > 0 ? (
                <span className="absolute left-auto -ml-1 top-0 rounded-full bg-yellow-500 px-1 py-0 text-xs text-black font-semibold">
                  {wishlist.length}
                </span>
              ) : null}
            </span>

            <span
              className="relative cursor-pointer"
              onClick={() => {
                navigate("/cart");
              }}
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                className="cursor-pointer fill-[#ffffff] hover:fill-yellow-400 inline"
                viewBox="0 0 512 512"
              >
                <path
                  d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                  data-original="#000000"
                ></path>
              </svg>
              {cartList === null ? null : cartList.length > 0 ? (
                <span className="absolute left-auto -ml-1 top-0 rounded-full bg-yellow-500 px-1 py-0 text-xs text-black font-semibold">
                  {cartList.length}
                </span>
              ) : null}
            </span>
            {user !== null ? (
              <div
                className=" max-lg:hidden w-8 h-8 flex justify-center items-center cursor-pointer"
                onClick={() => {
                  navigate("../user-profile");
                }}
              >
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
            ) : (
              <button
                onClick={() => navigate("../auth/login")}
                className=" max-md:hidden text-yellow-400 bg-black hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none hover:outline-none font-medium rounded-lg text-sm px-2 py-1.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 outline-none hover:border-transparent active:outline-none focus:ring-transparent"
              >
                Log In / Register
              </button>
            )}
            <button
              id="toggleOpen"
              className="lg:hidden bg-transparent p-2 rounded outline-none focus:outline-none border-none"
              onClick={() => {
                setSmallScreenMenuVisible(!smallScreenMenuVisible);
              }}
            >
              {smallScreenMenuVisible ? (
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 20 20"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <path
                    fill="#ffffff"
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 20 20"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <path
                    fill="#ffffff"
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      {smallScreenMenuVisible ? (
        <div className=" space-y-2 w-2/3 absolute right-1 mt-1 z-[50] rounded-lg p-2 bg-[#4d4d4d]  shadow-lg ">
          <div
            onClick={() => {
              navigate("../");
            }}
            className={`cursor-pointer text-lg font-semibold text-center p-1  rounded-sm ${location.pathname === "/" ? "bg-yellow-400" : "bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"}`}
          >
            Home
          </div>
          <div
            onClick={() => {
              navigate("../shop");
            }}
            className={` cursor-pointer text-lg font-semibold text-center p-1  rounded-sm ${location.pathname.includes("shop") ? "bg-yellow-400" : "bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"}`}
          >
            Shop
          </div>
          <div
            onClick={() => {
              navigate("../contact-us");
            }}
            className={` cursor-pointer text-lg font-semibold text-center p-1  rounded-sm ${location.pathname.includes("contact-us") ? "bg-yellow-400" : "bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"}`}
          >
            Contact Us
          </div>
          <div
            onClick={() => {
              navigate("../about-us");
            }}
            className={` cursor-pointer text-lg font-semibold text-center p-1  rounded-sm ${location.pathname.includes("about-us") ? "bg-yellow-400" : "bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"}`}
          >
            About Us
          </div>

          {user === null ? (
            <div
              onClick={() => {
                navigate("../auth/login");
              }}
              className=" md:hidden block cursor-pointer text-lg font-semibold text-center p-1  rounded-sm bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"
            >
              Log In / Register
            </div>
          ) : (
            <div
              onClick={() => {
                navigate("../user-profile");
              }}
              className={` cursor-pointer text-lg font-semibold text-center p-1 ${location.pathname.includes("user-profile") ? "bg-yellow-400" : "bg-black bg-opacity-30 text-white hover:text-black hover:bg-yellow-400"}`}
            >
              User Profile
            </div>
          )}
        </div>
      ) : null}
      {isSearchVisible ? (
        <div className="absolute bg-black bg-opacity-95 flex px-4 py-3 border float-start text-white border-gray-300 rounded-lg focus-within:border-yellow-500 overflow-hidden min-w-[80%] ms-[10%] font-[sans-serif]">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18px"
            className="fill-gray-300 mr-3"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            type="email"
            placeholder="Search Something..."
            value={searchText}
            onChange={handleSearch}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
      ) : null}
    </div>
  );
}

export default Header;
