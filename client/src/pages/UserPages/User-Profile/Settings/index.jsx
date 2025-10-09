import { searchNewsLetter, updateNewsLetter } from "@/services";
import { UserAuthContext } from "@/context/UserAuthContext";
import { useContext, useEffect, useState } from "react";

function Settings() {
  const [newsLetter, setNewsLetter] = useState(false);
  const { user } = useContext(UserAuthContext);
  useEffect(() => {
    const fetchData = async () => {
      const [newsletterSearchResponse] = await Promise.all([
        searchNewsLetter({ searchData: { userId: user?._id } }),
      ]);
      setNewsLetter(newsletterSearchResponse.newsLetterList[0]);
    };

    fetchData();
  }, [user?._id]);

  async function handleOnChangeSubscribeStatus() {
    if (newsLetter.newsLetterStatus === true) {
      const newsletterSearchResponse = await updateNewsLetter({
        userId: user?._id,
        updateData: { newsLetterStatus: false },
      });
      if (newsletterSearchResponse.success) {
        window.location.reload();
      }
    } else if (newsLetter.newsLetterStatus === false) {
      const newsletterSearchResponse = await updateNewsLetter({
        userId: user?._id,
        updateData: { newsLetterStatus: true },
      });
      if (newsletterSearchResponse.success) {
        window.location.reload();
      }
    }
  }

  return (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className=" w-full flex flex-col justify-center items-center">
        <svg
          className=" w-20 h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256.001 256.001"
          id="gear"
        >
          <rect width="256" height="256" fill="none"></rect>
          <circle
            cx="128"
            cy="128"
            r="48"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          ></circle>
          <path
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
            d="M122.87164,44.15392,104.00217,30.006a7.99514,7.99514,0,0,0-7.17954-1.24562,103.35049,103.35049,0,0,0-16.94257,7.00986,8.00249,8.00249,0,0,0-4.20618,5.96441L72.33817,65.08557q-1.90725,1.69062-3.73445,3.51677Q66.7771,70.429,65.08608,72.33777l-.00051.0004L41.73878,75.67684a7.99514,7.99514,0,0,0-5.95749,4.19591A103.35182,103.35182,0,0,0,28.7578,96.80968a8.00252,8.00252,0,0,0,1.24326,7.19169l14.15286,18.87027Q44.00074,125.41572,44,127.999q0,2.58326.154,5.1287l-.00008.00064L30.006,151.99783a7.99514,7.99514,0,0,0-1.24562,7.17954,103.35049,103.35049,0,0,0,7.00986,16.94257,8.00249,8.00249,0,0,0,5.96441,4.20618l23.35088,3.33571q1.69062,1.90725,3.51677,3.73445,1.82662,1.82663,3.73543,3.51764l.0004.00051,3.33867,23.34679a7.99514,7.99514,0,0,0,4.19591,5.95749,103.35182,103.35182,0,0,0,16.93693,7.02349,8.00252,8.00252,0,0,0,7.19169-1.24326l18.87027-14.15286q2.54408.15318,5.12738.15392,2.58326,0,5.1287-.154l.00064.00008L151.99783,225.994a7.99514,7.99514,0,0,0,7.17954,1.24562,103.35049,103.35049,0,0,0,16.94257-7.00986,8.00249,8.00249,0,0,0,4.20618-5.96441l3.33571-23.35088q1.90725-1.69062,3.73445-3.51677,1.82663-1.82663,3.51764-3.73543l.00051-.0004,23.34679-3.33867a7.99514,7.99514,0,0,0,5.95749-4.19591,103.35182,103.35182,0,0,0,7.02349-16.93693,8.00252,8.00252,0,0,0-1.24326-7.19169l-14.15286-18.87027q.15318-2.54407.15392-5.12738,0-2.58326-.154-5.1287l.00008-.00064L225.994,104.00217a7.99514,7.99514,0,0,0,1.24562-7.17954,103.35049,103.35049,0,0,0-7.00986-16.94257,8.00249,8.00249,0,0,0-5.96441-4.20618l-23.35088-3.33571q-1.69062-1.90725-3.51677-3.73445-1.82663-1.82662-3.73543-3.51764l-.0004-.00051-3.33867-23.34679a7.99514,7.99514,0,0,0-4.19591-5.95749,103.35182,103.35182,0,0,0-16.93693-7.02349,8.00252,8.00252,0,0,0-7.19169,1.24326L133.12836,44.15392Q130.58429,44.00074,128.001,44q-2.58326,0-5.1287.154Z"
          ></path>
        </svg>

        <span className=" font-bold text-[45px] text-white">My Settings</span>
      </div>
      <div className=" w-full px-4 my-6 flex flex-row items-center">
        <label className="inline-flex items-center me-5 cursor-pointer">
          <span className="ms-3 text-lg font-medium text-white dark:text-gray-300">
            Subscribe to Newsleter :
          </span>
          <input
            onClick={handleOnChangeSubscribeStatus}
            type="checkbox"
            className="sr-only peer"
            defaultChecked={newsLetter.newsLetterStatus}
          />
          <div className="relative w-11 h-6 ms-4 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400 dark:peer-checked:bg-yellow-400"></div>
        </label>
      </div>
    </div>
  );
}

export default Settings;
