import { useNavigate } from "react-router-dom";

function ControlRoom() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center py-5 justify-center flex-wrap gap-4">
      <div
        onClick={() => navigate("/admin/page-top-banner")}
        className="h-24 w-1/2 xl:w-1/5 md:w-1/3  bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Page Top banner
      </div>
      <div
        onClick={() => navigate("/admin/registerAdmin")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Register Admin
      </div>
      <div
        onClick={() => navigate("/admin/variations")}
        className="h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Variations
      </div>
      <div
        onClick={() => navigate("/admin/category")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Category
      </div>
      <div
        onClick={() => navigate("/admin/allDiscounts")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Discounts
      </div>
      <div
        onClick={() => navigate("/admin/allPromotions")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Promotions
      </div>
      <div
        onClick={() => navigate("/admin/allVouchers")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Vouchers
      </div>
      <div
        onClick={() => navigate("/admin/shipping")}
        className=" h-24  w-1/2 xl:w-1/5 md:w-1/3 bg-white bg-opacity-15 rounded-lg shadow-lg text-gray-200 cursor-pointer flex flex-row justify-center items-center hover:bg-yellow-400 hover:text-black font-semibold duration-200 transition"
      >
        Shipping
      </div>
    </div>
  );
}

export default ControlRoom;
