import React from "react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentDeclinedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fromCancel = searchParams.get("fromCancel");
    if (!fromCancel) {
      navigate("/cart"); // If accessed manually, redirect
    }
  }, [searchParams, navigate]);

  return (
    <div className="px-4 md:w-8/12 w-full sm:w-10/12 lg:w-6/12 2xl:w-4/12 mx-auto">
      <div className="flex justify-center w-full rounded-md bg-white mt-10 mb-20 bg-opacity-15">
        <div className="w-full">
          <div className="shadow-xl p-10 text-center mt-10 border-b-4 border-red-600">
            <svg
              className="w-[55px] h-[55px] text-red-600 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-[40px] text-white font-medium mt-3 mb-3">
              Your payment failed
            </h2>
            <p className="text-[18px] text-gray-300 font-medium mb-10">
              Something went wrong. Please try again later.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-red-600 hover:bg-red-700 hover:text-white font-semibold outline-none  focus:outline-transparent focus:outline-none border-none"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDeclinedPage;
