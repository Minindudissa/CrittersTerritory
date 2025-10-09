import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  productImageSearch,
  productSearch,
  RandomProductSearch,
  reviewSearch,
  searchPromotion,
} from "@/services";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "@/context/SearchContext";
import CountdownTimer from "../Common-Sections/countDownTimer";
import { ProductTypeContext } from "@/context/ProductTypeContext";
import { CategoryContext } from "@/context/CategoryContext";
import { CategoryMenu } from "../Common-Sections/Category Menu";
import Carousel from "../Common-Sections/Carousel";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [randomProductList, setRandomProductList] = useState([]);
  const [productImageList, setProductImageList] = useState(null);
  const [promotionList, setPromotionList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const { productType, setProductType } = useContext(ProductTypeContext);
  const { category, setCategory } = useContext(CategoryContext);
  const [categoryList, setCategoryList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const [
          productSearchResponse,
          RandomProductSearchResponse,
          productImageSearchResponse,
          reviewSearchResponse,
          searchPromotionResponse,
          categorySearchResponse,
        ] = await Promise.all([
          productSearch({
            searchData: { status: "1" },
            pagination: { page: 1, limit: 15 },
          }),
          RandomProductSearch({
            searchData: { status: "1" },
            pagination: { page: 1, limit: 15 },
            randomCount: 15,
          }),
          productImageSearch({ searchData: {} }),
          reviewSearch({ searchData: {} }),
          searchPromotion({ searchData: { isActive: true } }),
          categorySearch({ searchData: { status: 1 } }),
        ]);

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse.productList);
        }
        if (RandomProductSearchResponse?.success) {
          setRandomProductList(RandomProductSearchResponse.productList);
        }
        if (reviewSearchResponse?.success) {
          setReviewList(reviewSearchResponse.reviewList);
        }
        if (productImageSearchResponse?.success) {
          setProductImageList(productImageSearchResponse.productImageList);
        }
        if (searchPromotionResponse?.success) {
          setPromotionList(searchPromotionResponse.promotionList);
        }
        if (categorySearchResponse?.success) {
          setCategoryList(categorySearchResponse.categoryList);
        }
        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleProductTypeSearch = (ProductType) => {
    setProductType(ProductType);
    navigate("/shop");
  };

  const handleCategorySearch = (category) => {
    setCategory(category);
    navigate("/shop");
  };
  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full flex-col flex justify-start items-center min-h-screen">
      <div className=" w-full md:w-10/12 text-white lg:flex-row flex-col gap-4 md:gap-4 flex justify-center lg:items-start items-center">
        <div className="w-3/12 xl:w-2/12 lg:block hidden flex-row justify-center items-center">
          <CategoryMenu categoryList={categoryList} />
        </div>
        <div className=" lg:w-7/12 w-11/12">
          <Carousel />
        </div>
        <div className="lg:w-3/12 w-11/12 flex-col md:flex-row lg:flex-col flex justify-center items-center gap-4">
          <div
            onClick={() => navigate("/shop")}
            className=" h-[12rem] sm:h-[16rem] md:h-[14rem] lg:h-[8.5rem] xl:h-[11rem] 2xl:h-[14rem] w-full rounded-md cursor-pointer ease-in-out duration-300 hover:scale-[102%]"
          >
            <img
              src={`/src/assets/Site_Images/PromotionalImages/PromotionalImages_1.jpg`}
              alt="Promotional Images 1"
              className="w-full h-full object-cover object-top aspect-square rounded-md"
            />
          </div>
          <div
            onClick={() => navigate("/shop")}
            className=" h-[12rem] sm:h-[16rem] md:h-[14rem] lg:h-[8.5rem] xl:h-[11rem] 2xl:h-[14rem] w-full rounded-md cursor-pointer ease-in-out duration-300 hover:scale-[102%]"
          >
            <img
              src={`/src/assets/Site_Images/PromotionalImages/PromotionalImages_2.jpg`}
              alt="Promotional Images 2"
              className="w-full h-full object-cover object-top aspect-square rounded-md"
            />
          </div>
        </div>
      </div>
      <hr className="my-4 w-full md:w-10/12 border-gray-300" />
      <div className=" w-full md:w-10/12 p-4 flex md:flex-row flex-col justify-evenly items-center gap-4">
        <div className="w-10/12 md:w-5/12 xl:w-4/12 text-center flex-row flex justify-center items-center rounded-md bg-yellow-400 bg-opacity-40">
          <div className="  w-full p-4 flex flex-col justify-center items-center">
            <span className=" text-lg text-white font-semibold">
              3D Printable Files
            </span>
            <span className=" text-lg mt-1 text-gray-300">
              Starting at $1.00 USD
            </span>
            <button
              onClick={() => handleProductTypeSearch("Digital")}
              className=" py-1 mt-4 bg-transparent border border-white text-white hover:border-transparent hover:bg-black hover:text-white outline-none focus:outline-none focus:outline-transparent"
            >
              Shop Now
            </button>
          </div>
        </div>
        <div className="w-10/12 md:w-5/12 xl:w-4/12 text-center flex-row flex justify-center items-center rounded-md bg-yellow-400 bg-opacity-40">
          <div className="  w-full p-4 flex flex-col justify-center items-center">
            <span className=" text-lg text-white font-semibold">
              3D Printed Models
            </span>
            <span className=" text-lg mt-1 text-gray-300">
              Starting at $2.00 USD
            </span>
            <button
              onClick={() => handleProductTypeSearch("Physical")}
              className=" py-1 mt-4 bg-transparent border border-white text-white hover:border-transparent hover:bg-black hover:text-white outline-none focus:outline-none focus:outline-transparent"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
      <hr className="my-4 w-full md:w-10/12 border-gray-300" />
      <div className=" w-full lg:w-10/12 flex lg:flex-row flex-col justify-evenly items-center gap-4 lg:items-stretch my-4">
        <div className=" min-h-full bg-white bg-opacity-15 px-8 py-6 border-white border rounded-md w-10/12 lg:w-5/12 xl:w-4/12 text-center">
          <div className=" flex flex-row justify-center gap-4 items-center">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 1943.39 1635.117"
              enableBackground="new 0 0 1943.39 1635.117"
              xmlSpace="preserve"
              className=" w-8 h-8"
            >
              <path
                fill="#ffffff"
                d="M1629.054,730.768c0,0,4.477,1.853,8.182-0.463c2.007-3.551,56.7-65.065,59.593-63.607l-12.379-8.913
	c-1.5-1.08-1.493-3.315,0.015-4.385c12.237-8.688,11.906-8.709,13.77-8.994l30.861-4.725c0,0,16.674-18.681,39.368-12.66
	c0,0,45.544,5.249,82.75,71.48c0,0,19.761,32.112,4.477,51.565c0,0-4.547,7.027-8.063,10.597c-2.386,2.423-1.322,4.087-3.209,6.589
	c-1.96,2.599-6.465,8.302-10.61,11.586c-1.075,0.851-2.53,1.079-3.823,0.561c0,0-59.361,58.975-76.807,66.54
	c0,0-10.189,5.712-11.116,9.881l-0.474,2.133c-0.758,3.412-5.849,3.11-7.902,2.638c-2.841-0.653-2.375-2.417-3.999-3.431
	c-0.748-0.467-1.658-0.6-2.532-0.481c-24.519,3.352-24.726,4.02-27.167,1.794c-1.897-1.73-1.723-3.668-1.771-5.535
	c0,0-6.484,6.073-18.32,3.499l224.167,526.248c0,0,19.761,27.995,18.115,80.898s0.823,111.363-4.94,127.213
	s-16.674-14.203-16.674-14.203s-20.379-64.43-26.143-86.662c-6.476-24.977-84.504-136.362-83.162-137.094L1672.9,1166.134
	c0,0-5.558,4.94-9.366,5.352c-3.808,0.412-5.661,0-3.294-5.558c2.367-5.558,6.175-9.675,6.175-9.675l-56.093-87.382
	c0,0-10.087,6.69-12.557,7.102c-2.47,0.412-7.307,1.235-4.117-5.146c3.191-6.381,9.984-13.792,9.984-13.792
	s-66.489-103.129-71.943-108.481c-5.455-5.352-8.543-1.956-8.543-1.956s-6.793,5.146-8.337,7.719
	c-1.544,2.573-4.426-0.823-4.426-0.823s-23.364-22.54-19.658-32.524c3.705-9.984,7.205-11.424,4.117-18.32
	c-12.265-27.393-20.013-32.529-50.227-76.575c-8.193,5.791-19.29,8.022-14.409-1.544c2.573-5.043,6.587-9.366,6.587-9.366
	l-42.713-56.196c0,0-12.454,8.44-17.6,8.646s-8.337-2.779-5.249-7.308c3.088-4.529,12.042-14.203,12.042-14.203
	s-28.199-32.143-42.468-45.843c-3.897-3.742-9.951-4.041-14.179-0.677c-42.397,33.74-271.207,215.961-284.853,229.621
	c-14.951,14.966-163.478,116.28-170.853,120.215c-5.909,3.152-18.732,46.933-2.367,173.22l32.421,239.915
	c9.372,36.52,7.086,40.779,9.269,52.894l5.387,29.909c1.429,7.932-1.693,15.997-8.089,20.901l-63.69,48.829
	c-6.918,3.385-13.814,3.306-20.688-0.309c-27.598-19.094-36.619-15.807-52.8-14.512c-5.602,0.875-7.638-3.072-7.102-10.498
	c0,0-3.191-0.926-1.956-2.47c1.235-1.544,4.837-3.808,4.734-8.44c-0.103-4.632-4.549-35.448-6.278-43.537
	c-3.857-18.042-67.835-189.474-75.134-213.978c-2.882-9.675-21.202-59.696-22.232-65.253s-12.763-39.111-17.497-45.904
	c-4.734-6.793-12.763-16.879-20.996-18.32c0,0-30.465,12.968-33.759,13.174c-3.294,0.206-5.558-4.117-5.558-4.117
	s-51.256-45.698-54.138-51.873c-2.882-6.175,3.705-6.587,6.381-15.439c2.676-8.851,10.086-36.023-18.938-47.962
	C246.601,974.053,155.641,932.851,123.284,929.616l1.853-2.882c-8.955-0.101-19.042,0.871-29.824,2.502
	c-2.01,0.304-3.918-1.042-4.26-3.047c-2.097-12.278-6.494-24.358-14.917-32.814c-13.624-13.678-31.832-26.985-53.087-40.046
	c-2.277-1.399-2.609-4.578-0.663-6.41l48.267-45.436c3.634-3.421,8.625-5.009,13.568-4.315l100.551,14.098
	c14.266,2.224,26.212-1.041,45.617,7.296c5.187,2.228,10.579,3.941,16.099,5.121c59.695,12.758,367.676,78.384,396.662,80.614
	c32.112,2.47,71.017,3.705,121.964-21.923c35.813-18.015,75.858-45.812,81.495-52.433c1.354-1.591,2.662-3.276,4.382-4.462
	c31.727-21.879,215.695-183.6,216.695-184.463c8.995-7.762,17.057-16.535,24.022-26.161c15.231-21.051,38.887-56.321,38.991-72.437
	c0.154-23.775-17.754-45.389-85.066-88.154c-31.96,19.533-31.942,4.712-14.667-10.035l-69.937-40.603
	c-4.993,3.812-10.097,6.799-15.535,7.277c-1.213,0.107-2.243-0.893-2.211-2.111c0.131-5.081,2.412-9.029,6.476-12.037
	c-61.193-33.484-85.552-48.889-100.273-46.624c-6.113,0.941-10.056,9.11-24.702,1.389c-6.158-3.246-23.168-15.445-23.168-15.445
	c-0.693-0.462-0.753-1.457-0.122-2l8.624-7.411c0,0,2.779-2.239-0.386-5.095s-23.312-15.439-34.351-20.147
	c-11.039-4.709-84.835-41.607-84.835-41.607c-13.643,8.258-15.197,10.025-18.537,8.41c-1.61-0.779-1.949-2.943-0.78-4.297
	l8.279-9.593c0,0-87.228-42.456-91.242-44.695c-4.115,3.549-8.626,5.925-13.614,6.891c-3.173,0.615-3.096-6.487,4.428-11.909
	L284.822,62.28c0,0-9.881-6.33-52.028-13.432s-61.445-13.586-63.761-16.21s-1.235-4.477,1.544-5.249
	c2.779-0.772,103.284-10.961,125.515-9.726c49.246,2.736-44.712-25.546,620.32,183.873c0,0,27.583,10.087,35.2,4.94
	s12.042-9.263,12.042-9.263s-3.396-6.69,10.704-23.261s60.21-58.255,60.21-58.255l-12.295-8.588
	c-0.845-0.591-0.877-1.831-0.063-2.464c6.694-5.2,9.985-8.452,16.994-9.781c8.144-1.544,17.064-2.239,26.446-2.427
	c0,0,12.454-12.454,21.305-13.689c0,0,18.115-7.205,42.302,11.322s41.684,40.655,47.962,56.505
	c6.278,15.85,17.703,41.581,2.985,57.225s-59.078,57.637-73.899,57.637c111.869,31.56,174.787,50.081,189.276,50.638
	c12.042,0.463,61.658,14.313,100.813,2.625c41.375-12.351,87.536-34.582,97.572-42.456l117.024-101.74
	c66.02-60.768,143.998-110.162,191.273-114.025c10.286-0.84,35.782-13.362,81.834-5.624c13.862,2.329,22.081,9.129,21.459,20.533
	c-5.332,97.768-133.507,207.419-227.306,289.884l-135.447,121.861c8.234,74.517,46.727,159.737,87.073,248.663"
              />
            </svg>
            <span className=" text-white text-xl">WORLDWIDE SHIPPING</span>
          </div>

          <p className=" text-gray-200 text-sm mt-2">
            Reliable delivery to customers around the globe
          </p>
        </div>
        <div className=" min-h-full bg-white bg-opacity-15 px-8 py-6 border-white border rounded-md w-10/12 lg:w-5/12 xl:w-4/12 text-center">
          <div className=" flex flex-row justify-center gap-4 items-center">
            <svg
              fill="#ffffff"
              className=" w-10 h-10 "
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 422.518 422.518"
              xmlSpace="preserve"
            >
              <path
                d="M422.512,215.424c0-0.079-0.004-0.158-0.005-0.237c-0.116-5.295-4.368-9.514-9.727-9.514h-2.554l-39.443-76.258
	c-1.664-3.22-4.983-5.225-8.647-5.226l-67.34-0.014l2.569-20.364c0.733-8.138-1.783-15.822-7.086-21.638
	c-5.293-5.804-12.683-9.001-20.81-9.001h-209c-5.255,0-9.719,4.066-10.22,9.308l-2.095,16.778h119.078
	c7.732,0,13.836,6.268,13.634,14c-0.203,7.732-6.635,14-14.367,14H126.78c0.007,0.02,0.014,0.04,0.021,0.059H10.163
	c-5.468,0-10.017,4.432-10.16,9.9c-0.143,5.468,4.173,9.9,9.641,9.9H164.06c7.168,1.104,12.523,7.303,12.326,14.808
	c-0.216,8.242-7.039,14.925-15.267,14.994H54.661c-5.523,0-10.117,4.477-10.262,10c-0.145,5.523,4.215,10,9.738,10h105.204
	c7.273,1.013,12.735,7.262,12.537,14.84c-0.217,8.284-7.109,15-15.393,15H35.792v0.011H25.651c-5.523,0-10.117,4.477-10.262,10
	c-0.145,5.523,4.214,10,9.738,10h8.752l-3.423,35.818c-0.734,8.137,1.782,15.821,7.086,21.637c5.292,5.805,12.683,9.001,20.81,9.001
	h7.55C69.5,333.8,87.3,349.345,109.073,349.345c21.773,0,40.387-15.545,45.06-36.118h94.219c7.618,0,14.83-2.913,20.486-7.682
	c5.172,4.964,12.028,7.682,19.514,7.682h1.55c3.597,20.573,21.397,36.118,43.171,36.118c21.773,0,40.387-15.545,45.06-36.118h6.219
	c16.201,0,30.569-13.171,32.029-29.36l6.094-67.506c0.008-0.091,0.004-0.181,0.01-0.273c0.01-0.139,0.029-0.275,0.033-0.415
	C422.52,215.589,422.512,215.508,422.512,215.424z M109.597,329.345c-13.785,0-24.707-11.214-24.346-24.999
	c0.361-13.786,11.87-25.001,25.655-25.001c13.785,0,24.706,11.215,24.345,25.001C134.89,318.131,123.382,329.345,109.597,329.345z
	 M333.597,329.345c-13.785,0-24.706-11.214-24.346-24.999c0.361-13.786,11.87-25.001,25.655-25.001
	c13.785,0,24.707,11.215,24.345,25.001C358.89,318.131,347.382,329.345,333.597,329.345z M396.457,282.588
	c-0.52,5.767-5.823,10.639-11.58,10.639h-6.727c-4.454-19.453-21.744-33.882-42.721-33.882c-20.977,0-39.022,14.429-44.494,33.882
	h-2.059c-2.542,0-4.81-0.953-6.389-2.685c-1.589-1.742-2.337-4.113-2.106-6.676l12.609-139.691l28.959,0.006l-4.59,50.852
	c-0.735,8.137,1.78,15.821,7.083,21.637c5.292,5.806,12.685,9.004,20.813,9.004h56.338L396.457,282.588z"
              />
            </svg>
            <span className=" text-white text-xl">EXPEDITED DELIVERY</span>
          </div>
          <p className=" text-gray-200 text-sm mt-2">
            Faster shipping options available upon request.
          </p>
        </div>
        <div className=" min-h-full bg-white bg-opacity-15 px-8 py-6 border-white border rounded-md w-10/12 lg:w-5/12 xl:w-4/12 text-center">
          <div className=" flex flex-row justify-center gap-4 items-center">
            <svg
              className=" w-8 h-8"
              viewBox="0 0 16 16"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 5H1V7H3V5Z" fill="#ffffff" />
              <path d="M1 9H3V11H1V9Z" fill="#ffffff" />
              <path d="M3 13H1V15H3V13Z" fill="#ffffff" />
              <path d="M15 5H5V7H15V5Z" fill="#ffffff" />
              <path d="M5 9H15V11H5V9Z" fill="#ffffff" />
              <path d="M15 13H5V15H15V13Z" fill="#ffffff" />
            </svg>
            <span className=" text-white text-xl">WIDE SELECTION</span>
          </div>
          <p className=" text-gray-200 text-sm mt-2">
            A variety of products, including digital files and physical items.
          </p>
        </div>
        <div className=" min-h-full bg-white bg-opacity-15 px-8 py-6 border-white border rounded-md w-10/12 lg:w-5/12 xl:w-4/12 text-center">
          <div className=" flex flex-row justify-center gap-4 items-center">
            <svg
              className=" w-10 h-10"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <title>certificate_line</title>
              <g
                id="页面-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="System"
                  transform="translate(-334.000000, -192.000000)"
                  fillRule="nonzero"
                >
                  <g
                    id="certificate_line"
                    transform="translate(334.000000, 192.000000)"
                  >
                    <path
                      d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                      id="MingCute"
                      fillRule="nonzero"
                    ></path>
                    <path
                      d="M10.5857,2.10056 C11.3256895,1.36061789 12.5011493,1.32167357 13.2868927,1.98372704 L13.4141,2.10056 L15.3136,4.00005 L17.9999,4.00005 C19.0542909,4.00005 19.9180678,4.81592733 19.9944144,5.85078759 L19.9999,6.00005 L19.9999,8.68632 L21.8994,10.5858 C22.6393895,11.3257895 22.6783363,12.5012493 22.0162404,13.2870778 L21.8994,13.4143 L19.9999,15.3138 L19.9999,18.0001 C19.9999,19.0543955 19.18405,19.9182591 18.1491661,19.9946139 L17.9999,20.0001 L15.3136,20.0001 L13.4141,21.8995 C12.6742053,22.6394895 11.4987504,22.6784363 10.7129222,22.0163404 L10.5857,21.8995 L8.68622,20.0001 L5.99991,20.0001 C4.94554773,20.0001 4.08174483,19.1841589 4.00539573,18.1493537 L3.99991,18.0001 L3.99991,15.3137 L2.10043,13.4143 C1.36049737,12.6743105 1.32155355,11.4988507 1.98360703,10.7130222 L2.10044,10.5858 L3.99991,8.68636 L3.99991,6.00005 C3.99991,4.94568773 4.81578733,4.08188483 5.85064759,4.00553573 L5.99991,4.00005 L8.68622,4.00005 L10.5857,2.10056 Z M11.9999,3.51477 L10.1004,5.41426 C9.76703111,5.74766444 9.32804642,5.9511963 8.86207199,5.99230949 L8.68622,6.00005 L5.99991,6.00005 L5.99991,8.68636 C5.99991,9.15786222 5.83342309,9.61218716 5.53299532,9.97077196 L5.41412,10.1006 L3.51465,12.0001 L5.41412,13.8995 C5.74752444,14.2329222 5.9510563,14.6719049 5.99216949,15.1378572 L5.99991,15.3137 L5.99991,18.0001 L8.68622,18.0001 C9.15772222,18.0001 9.61204716,18.166579 9.97058982,18.4669488 L10.1004,18.5858 L11.9999,20.4853 L13.8994,18.5858 C14.2328222,18.2524667 14.6718049,18.0489506 15.1377572,18.0078401 L15.3136,18.0001 L17.9999,18.0001 L17.9999,15.3138 C17.9999,14.8422444 18.166379,14.3879136 18.4668191,14.0293984 L18.5857,13.8996 L20.4852,12.0001 L18.5857,10.1005 C18.2522778,9.76714 18.0487519,9.3281563 18.0076402,8.86217495 L17.9999,8.68632 L17.9999,6.00005 L15.3136,6.00005 C14.8421333,6.00005 14.3878123,5.83356309 14.029228,5.53313532 L13.8994,5.41426 L11.9999,3.51477 Z M15.0793,8.98261 C15.4698,8.59209 16.103,8.59209 16.4935,8.98261 C16.8540538,9.34309923 16.8817888,9.91032645 16.5767047,10.3025979 L16.4935,10.3968 L11.6126,15.2778 C11.2136857,15.6766214 10.5846383,15.7051087 10.1529279,15.3632617 L10.057,15.2778 L7.6528,12.8736 C7.26228,12.4831 7.26228,11.8499 7.6528,11.4594 C8.01328,11.0989385 8.58051503,11.0712107 8.9728035,11.3762166 L9.06701,11.4594 L10.8348,13.2271 L15.0793,8.98261 Z"
                      id="形状"
                      fill="#ffffff"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span className=" text-white text-xl">SATISFACTION GUARANTEED</span>
          </div>
          <p className=" text-gray-200 text-sm mt-2">
            Quality and customer satisfaction are our top priorities.
          </p>
        </div>
      </div>
      <hr className="my-4 w-full md:w-10/12 border-gray-300" />
      <div className=" w-full p-2 md:w-10/12">
        <span className=" underline text-2xl text-white">CATEGORIES</span>
        <div className=" w-full my-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 sm:gap-6">
            {categoryList.map((categoryItem, Index) => (
              <div
                key={Index}
                onClick={() => handleCategorySearch(categoryItem._id)}
                className="bg-white bg-opacity-15 p-3 rounded-md flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-105 ease-in-out hover:ease-in-out duration-300"
              >
                <div className="w-full relative group">
                  {/* Default Image */}
                  <div className="opacity-100 transition-opacity hover:ease-in-out duration-300 ease-in-out">
                    <img
                      src={`/src/assets/Site_Images/CategoryImages/${categoryItem.name}_1.jpg`}
                      alt={`Category Image ${Index + 1}`}
                      className="w-full object-cover object-top aspect-square rounded-md"
                    />
                  </div>
                </div>
                <div className="p-2 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h5 className="text-lg sm:text-base font-bold text-gray-100 truncate">
                      {categoryItem.name}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="my-4 w-full md:w-10/12 border-gray-300" />
      <div className=" w-full p-2 md:w-10/12">
        <span className=" underline text-2xl text-white">NEW ARRIVALS</span>
        <div className=" w-full my-4 ">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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
                            src={`http://localhost:5000/${productImageItem.imagePath[0]}`}
                            alt="Product 1"
                            className="w-full object-cover object-top aspect-[230/307] rounded-md"
                          />
                        ))}
                    </div>

                    {/* Overlay Digital Banner (Only for Digital Products) */}
                    {productItem.productType === "Digital" && (
                      <img
                        src="/src/assets/Digital_Banner/Digital_Banner.png"
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
                            src={`http://localhost:5000/${productImageItem.imagePath[1]}`} // Show second image on hover
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
                              {Array.from({ length: fullStars }).map((_, i) => (
                                <svg
                                  key={`full-star-${i}`}
                                  className="w-4 h-4 fill-[#facc15]"
                                  viewBox="0 0 14 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                              ))}

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
                                    (minPrice * (100 - promotion.value)) / 100;

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
                            .map((promotion) => {
                              if (productItem.productType === "Physical") {
                                // Find the minimum price from variations
                                const minPrice = productItem.variations.reduce(
                                  (min, variation) =>
                                    Math.min(min, parseFloat(variation.price)),
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
                            productItem.variations.reduce((min, variation) => {
                              return Math.min(min, parseFloat(variation.price));
                            }, Infinity)
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
        </div>
      </div>
      <hr className="my-4 w-full md:w-10/12 border-gray-300" />
      <div className=" w-full p-2 md:w-10/12">
        <span className=" underline text-2xl text-white">
          FEATURED PRODUCTS
        </span>
        <div className=" w-full my-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {randomProductList.map((productItem, Index) => (
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
                            src={`http://localhost:5000/${productImageItem.imagePath[0]}`}
                            alt="Product 1"
                            className="w-full object-cover object-top aspect-[230/307] rounded-md"
                          />
                        ))}
                    </div>

                    {/* Overlay Digital Banner (Only for Digital Products) */}
                    {productItem.productType === "Digital" && (
                      <img
                        src="/src/assets/Digital_Banner/Digital_Banner.png"
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
                            src={`http://localhost:5000/${productImageItem.imagePath[1]}`} // Show second image on hover
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
                              {Array.from({ length: fullStars }).map((_, i) => (
                                <svg
                                  key={`full-star-${i}`}
                                  className="w-4 h-4 fill-[#facc15]"
                                  viewBox="0 0 14 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                              ))}

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
                                    (minPrice * (100 - promotion.value)) / 100;

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
                            .map((promotion) => {
                              if (productItem.productType === "Physical") {
                                // Find the minimum price from variations
                                const minPrice = productItem.variations.reduce(
                                  (min, variation) =>
                                    Math.min(min, parseFloat(variation.price)),
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
                            productItem.variations.reduce((min, variation) => {
                              return Math.min(min, parseFloat(variation.price));
                            }, Infinity)
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
        </div>
      </div>
    </div>
  );
}

export default Home;
