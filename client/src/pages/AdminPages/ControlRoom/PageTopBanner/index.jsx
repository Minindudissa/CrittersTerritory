import PageLoading from "@/pages/PageLoading";
import { createPageTopBanner, getPageTopBanner } from "@/services";
import { useEffect, useState } from "react";
import { CompactPicker } from "react-color";

function ChangePageTopBanner() {
  const [text, setText] = useState("null");
  const [isEnabled, setIsEnabled] = useState(false);
  const [color, setColor] = useState("#000000");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [getData, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const id = 1;

  async function sendToDB() {
    try {
      // INSERT/UPDATE HERE
      const data = await createPageTopBanner({
        id,
        bannerStatus: isEnabled,
        color,
        text,
      });
      setSuccessMsg(null);
      setErrorMsg(null);
      data?.success ? setSuccessMsg(data?.message) : setErrorMsg(data?.message);
    } catch (error) {
      setSuccessMsg(null);
      setErrorMsg(error.message);
    }
    window.location.reload();
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    if (isEnabled) {
      if (text === "null") {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Text");
      } else {
        sendToDB();
      }
    } else {
      sendToDB();
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPageTopBanner(id);

        data.length === 0 ? setIsLoading(true) : setIsLoading(false);
        setSuccessMsg(null);
        setErrorMsg(null);
        setData(data?.response?.banner[0]);
        setIsEnabled(data?.response?.banner[0].bannerStatus);
      } catch (error) {
        setSuccessMsg(null);
        setErrorMsg(error.message);
      }
    }
    fetchData();
  }, []);
  return isLoading ? (
    <PageLoading />
  ) : (
    <form onSubmit={handleOnSubmit}>
      <div className="w-full h-full flex flex-wrap justify-center p-5 gap-4">
        <h1 className="text-white font-semibold h-fit">Page Top Banner</h1>
        {getData.bannerStatus ? (
          <div
            style={{ backgroundColor: getData.color }}
            className=" w-full h-10 flex items-center text-center max-md:flex-col gap-6 text-black px-6 py-0 rounded font-[sans-serif]"
          >
            <p className="text-base flex-1 max-md:text-center">
              {getData.text}
            </p>
          </div>
        ) : null}

        {/* Success Message */}
        {successMsg && (
          <div
            className="block w-full flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 "
            role="alert"
          >
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Success!</span> {successMsg}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div
            className="block w-full flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
            role="alert"
            id="danger-alert"
          >
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Error! &nbsp;</span>
              {errorMsg}
            </div>
          </div>
        )}

        <div className="w-full h-fit flex flex-row items-center p-2">
          <h2 className="font-semibold text-white">Page Top Banner:</h2>&nbsp;&nbsp;
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={() => setIsEnabled(!isEnabled)}
              checked={isEnabled}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
          <span className="font-semibold">Enabled</span>
        </div>

        <div className="w-full h-fit p-2">
          <label
            htmlFor="text"
            className="font-semibold text-gray-100 "
          >
            Text
          </label>
          <input
            onChange={(event) => setText(event.target.value)}
            type="text"
            id="text"
            className="bg-white bg-opacity-15 border-white focus:outline-none outline-none text-white text-sm rounded-lg border focus:border-yellow-500 block w-full p-2.5 "
          />
        </div>

        <div className="w-full flex justify-center">
          <CompactPicker color={color} onChange={({ hex }) => setColor(hex)} />
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="text-yellow-400 hover:text-white border border-yellow-500 hover:bg-yellow-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  hover:border-transparent"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChangePageTopBanner;
