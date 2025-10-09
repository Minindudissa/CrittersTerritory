import PageLoading from "@/pages/PageLoading";
import {
  colorCreate,
  colorSearch,
  colorUpdate,
  sizeCreate,
  sizeSearch,
  sizeUpdate,
} from "@/services";
import { useEffect, useState } from "react";

function Variations() {
  const [sizeName, setSizeName] = useState("");
  const [singleColorName, setSingleColorName] = useState("");
  const [dualTriColorName, setDualTriColorName] = useState("");
  const [gradientRainbowColorName, setGradientRainbowColorName] = useState("");
  const [specialColorName, setSpecialColorName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [errorMsg2, setErrorMsg2] = useState(null);
  const [errorMsg3, setErrorMsg3] = useState(null);
  const [errorMsg4, setErrorMsg4] = useState(null);
  const [errorMsg5, setErrorMsg5] = useState(null);
  const [successMsg1, setSuccessMsg1] = useState(null);
  const [successMsg2, setSuccessMsg2] = useState(null);
  const [successMsg3, setSuccessMsg3] = useState(null);
  const [successMsg4, setSuccessMsg4] = useState(null);
  const [successMsg5, setSuccessMsg5] = useState(null);
  const [sizeList, setSizeList] = useState(null);
  const [colorList, setColorList] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Set loading before making any request

        const [sizeResponse, colorResponse] = await Promise.all([
          sizeSearch({ searchData: {} }),
          colorSearch({ searchData: {} }),
        ]);

        if (sizeResponse?.success) {
          setSizeList(sizeResponse.sizeList);
        }

        if (colorResponse?.success) {
          setColorList(colorResponse.colorList);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Ensure loading is stopped on error
      }

      setTimeout(() => {
        setSuccessMsg1(null);
        setErrorMsg1(null);
        setSuccessMsg2(null);
        setErrorMsg2(null);
        setSuccessMsg3(null);
        setErrorMsg3(null);
        setSuccessMsg4(null);
        setErrorMsg4(null);
      }, 3000);
    }

    fetchData();
  }, []);

  async function handleCreateSizeOnClick() {
    const createSizeResponse = await sizeCreate({ name: sizeName });
    if (createSizeResponse?.success) {
      setErrorMsg1(null);
      setSuccessMsg1("Size added successfully");
      setTimeout(() => {
        setSuccessMsg1(null);
        setErrorMsg1(null);
        window.location.reload();
      }, 3000);
    } else {
      if (createSizeResponse?.message === '"name" is not allowed to be empty') {
        setErrorMsg1("Please Enter a Size");
      } else {
        setSuccessMsg1(null);
        setErrorMsg1(createSizeResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg1(null);
      setErrorMsg1(null);
    }, 3000);
  }

  async function handleCreateSingleColorOnClick() {
    const createSingleColorResponse = await colorCreate({
      name: singleColorName,
      type: "Single",
    });
    if (createSingleColorResponse?.success) {
      setErrorMsg2(null);
      setSuccessMsg2("Color added successfully");
      setTimeout(() => {
        setSuccessMsg2(null);
        setErrorMsg2(null);
        window.location.reload();
      }, 3000);
    } else {
      if (
        createSingleColorResponse?.message ===
        '"name" is not allowed to be empty'
      ) {
        setErrorMsg2("Please Enter a Color");
      } else {
        setSuccessMsg2(null);
        setErrorMsg2(createSingleColorResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg2(null);
      setErrorMsg2(null);
    }, 3000);
  }

  async function handleCreateDualTriColorOnClick() {
    const createDualTriColorResponse = await colorCreate({
      name: dualTriColorName,
      type: "DualTri",
    });
    if (createDualTriColorResponse?.success) {
      setErrorMsg3(null);
      setSuccessMsg3("Color added successfully");
      setTimeout(() => {
        setSuccessMsg3(null);
        setErrorMsg3(null);
        window.location.reload();
      }, 3000);
    } else {
      if (
        createDualTriColorResponse?.message ===
        '"name" is not allowed to be empty'
      ) {
        setErrorMsg3("Please Enter a Color");
      } else {
        setSuccessMsg3(null);
        setErrorMsg3(createDualTriColorResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg3(null);
      setErrorMsg3(null);
    }, 3000);
  }

  async function handleCreateGradientRainbowColorOnClick() {
    const createGradientRainbowColorResponse = await colorCreate({
      name: gradientRainbowColorName,
      type: "GradientRainbow",
    });
    if (createGradientRainbowColorResponse?.success) {
      setErrorMsg4(null);
      setSuccessMsg4("Color added successfully");
      setTimeout(() => {
        setSuccessMsg4(null);
        setErrorMsg4(null);
        window.location.reload();
      }, 3000);
    } else {
      if (
        createGradientRainbowColorResponse?.message ===
        '"name" is not allowed to be empty'
      ) {
        setErrorMsg4("Please Enter a Color");
      } else {
        setSuccessMsg4(null);
        setErrorMsg4(createGradientRainbowColorResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg4(null);
      setErrorMsg4(null);
    }, 3000);
  }
  
  async function handleCreateSpecialColorOnClick() {
    const createSpecialColorResponse = await colorCreate({
      name: specialColorName,
      type: "SpecialColor",
    });
    if (createSpecialColorResponse?.success) {
      setErrorMsg5(null);
      setSuccessMsg5("Color added successfully");
      setTimeout(() => {
        setSuccessMsg5(null);
        setErrorMsg5(null);
        window.location.reload();
      }, 3000);
    } else {
      if (
        createSpecialColorResponse?.message ===
        '"name" is not allowed to be empty'
      ) {
        setErrorMsg5("Please Enter a Color");
      } else {
        setSuccessMsg5(null);
        setErrorMsg5(createSpecialColorResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg5(null);
      setErrorMsg5(null);
    }, 3000);
  }
  async function changeSizeStatusOnClick(id, status) {
    if (status === 0) {
      const sizeUpdateResponse = await sizeUpdate({
        _id: id,
        updateData: { status: 1 },
      });
      if (sizeUpdateResponse?.success) {
        window.location.reload();
      } else {
        setErrorMsg1(sizeUpdateResponse?.message);
      }
    } else if (status === 1) {
      const sizeUpdateResponse = await sizeUpdate({
        _id: id,
        updateData: { status: 0 },
      });
      if (sizeUpdateResponse?.success) {
        window.location.reload();
      } else {
        setErrorMsg1(sizeUpdateResponse?.message);
      }
    }
  }

  async function changeColorStatusOnClick(id, type, status) {
    if (status === 0) {
      const colorUpdateResponse = await colorUpdate({
        _id: id,
        updateData: { status: 1 },
      });
      if (colorUpdateResponse?.success) {
        window.location.reload();
      } else {
        if (type === "Single") {
          setSuccessMsg2(null);
          setErrorMsg2(colorUpdateResponse?.message);
        } else if (type === "DualTri") {
          setSuccessMsg3(null);
          setErrorMsg3(colorUpdateResponse?.message);
        } else if (type === "GradientRainbow") {
          setSuccessMsg4(null);
          setErrorMsg4(colorUpdateResponse?.message);
        }
      }
    } else if (status === 1) {
      const colorUpdateResponse = await colorUpdate({
        _id: id,
        updateData: { status: 0 },
      });
      if (colorUpdateResponse?.success) {
        window.location.reload();
      } else {
        if (type === "Single") {
          setSuccessMsg2(null);
          setErrorMsg2(colorUpdateResponse?.message);
        } else if (type === "DualTri") {
          setSuccessMsg3(null);
          setErrorMsg3(colorUpdateResponse?.message);
        } else if (type === "GradientRainbow") {
          setSuccessMsg4(null);
          setErrorMsg4(colorUpdateResponse?.message);
        }
      }
    }
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full h-full p-4 flex md:flex-row flex-col justify-center gap-4">
      <div className=" md:w-1/2 w-full space-y-4">
        <div className=" w-full">
          <span className=" text-lg font-semibold text-white">Size</span>
        </div>
        {successMsg1 ? (
          <div
            className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg1}</span>
          </div>
        ) : null}
        {errorMsg1 ? (
          <div
            className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg1}</span>
          </div>
        ) : null}
        <div className=" w-full ps-5 flex flex-col space-y-4">
          {sizeList.map((sizeItem, index) => (
            <div className=" w-full flex flex-row justify-between" key={index}>
              <span className=" text-white">{sizeItem?.name}</span>
              <label className="inline-flex items-center me-5 cursor-pointer">
                <input
                  type="checkbox"
                  onClick={() => {
                    changeSizeStatusOnClick(sizeItem?._id, sizeItem?.status);
                  }}
                  className="sr-only peer"
                  defaultChecked={sizeItem?.status === 1}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
        <div className=" w-full">
          <input
            onChange={(event) => {
              setSizeName(event.target.value);
            }}
            type="text"
            className=" bg-white bg-opacity-15 border placeholder:text-gray-300 border-gray-100 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent focus:border-yellow-500 text-white"
            placeholder="Enter Size"
          />
        </div>
        <div className=" w-full flex justify-center">
          <button
            onClick={handleCreateSizeOnClick}
            className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
          >
            Add Size
          </button>
        </div>
        <div className=" w-full">
          <span className=" text-lg font-semibold text-white">
            Special Colors
          </span>
        </div>
        {successMsg5 ? (
          <div
            className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg5}</span>
          </div>
        ) : null}
        {errorMsg5 ? (
          <div
            className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg5}</span>
          </div>
        ) : null}
        <div className=" w-full ps-5 flex flex-col space-y-4">
          {colorList.map((colorItem, index) =>
            colorItem?.type === "SpecialColor" ? (
              <div
                className=" w-full flex flex-row justify-between"
                key={index}
              >
                <span className=" text-white">{colorItem?.name}</span>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={() => {
                      changeColorStatusOnClick(
                        colorItem?._id,
                        colorItem?.type,
                        colorItem?.status
                      );
                    }}
                    className="sr-only peer"
                    defaultChecked={colorItem?.status === 1}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label>
              </div>
            ) : null
          )}
        </div>
        <div className=" w-full">
          <input
            onChange={(event) => {
              setSpecialColorName(event.target.value);
            }}
            type="text"
            className="text-white bg-white placeholder:text-gray-300 bg-opacity-15 border border-gray-100 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent focus:border-yellow-500"
            placeholder="Enter Single Color"
          />
        </div>
        <div className=" w-full flex justify-center">
          <button
            onClick={handleCreateSpecialColorOnClick}
            className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
          >
            Add Special Color
          </button>
        </div>
      </div>
      <div className="  md:w-1/2 w-full space-y-4">
        <div className=" w-full">
          <span className=" text-lg font-semibold text-white">
            Single Colors
          </span>
        </div>
        {successMsg2 ? (
          <div
            className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg2}</span>
          </div>
        ) : null}
        {errorMsg2 ? (
          <div
            className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg2}</span>
          </div>
        ) : null}
        <div className=" w-full ps-5 flex flex-col space-y-4">
          {colorList.map((colorItem, index) =>
            colorItem?.type === "Single" ? (
              <div
                className=" w-full flex flex-row justify-between"
                key={index}
              >
                <span className=" text-white">{colorItem?.name}</span>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={() => {
                      changeColorStatusOnClick(
                        colorItem?._id,
                        colorItem?.type,
                        colorItem?.status
                      );
                    }}
                    className="sr-only peer"
                    defaultChecked={colorItem?.status === 1}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label>
              </div>
            ) : null
          )}
        </div>
        <div className=" w-full">
          <input
            onChange={(event) => {
              setSingleColorName(event.target.value);
            }}
            type="text"
            className=" bg-white bg-opacity-15 placeholder:text-gray-300 border border-gray-100 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent focus:border-yellow-500 text-white"
            placeholder="Enter Single Color"
          />
        </div>
        <div className=" w-full flex justify-center">
          <button
            onClick={handleCreateSingleColorOnClick}
            className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
          >
            Add Single Color
          </button>
        </div>
        <div className=" w-full">
          <span className=" text-lg font-semibold text-white">
            Dual / Tri Colors
          </span>
        </div>
        {successMsg3 ? (
          <div
            className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg3}</span>
          </div>
        ) : null}
        {errorMsg3 ? (
          <div
            className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg3}</span>
          </div>
        ) : null}
        <div className=" w-full ps-5 flex flex-col space-y-4">
          {colorList.map((colorItem, index) =>
            colorItem?.type === "DualTri" ? (
              <div
                className=" w-full flex flex-row justify-between"
                key={index}
              >
                <span className=" text-white">{colorItem?.name}</span>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={() => {
                      changeColorStatusOnClick(
                        colorItem?._id,
                        colorItem?.type,
                        colorItem?.status
                      );
                    }}
                    className="sr-only peer"
                    defaultChecked={colorItem?.status === 1}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label>
              </div>
            ) : null
          )}
        </div>
        <div className=" w-full">
          <input
            onChange={(event) => {
              setDualTriColorName(event.target.value);
            }}
            type="text"
            className=" bg-white bg-opacity-15 placeholder:text-gray-300 border border-gray-100 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent focus:border-yellow-500 text-white"
            placeholder="Enter Dual / Tri Color"
          />
        </div>
        <div className=" w-full flex justify-center">
          <button
            onClick={handleCreateDualTriColorOnClick}
            className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
          >
            Add Dual / Tri Color
          </button>
        </div>
        <div className=" w-full">
          <span className=" text-lg font-semibold text-white">
            Gradient / Rainbow Colors
          </span>
        </div>
        {successMsg4 ? (
          <div
            className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg4}</span>
          </div>
        ) : null}
        {errorMsg4 ? (
          <div
            className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg4}</span>
          </div>
        ) : null}
        <div className=" w-full ps-5 flex flex-col space-y-4">
          {colorList.map((colorItem, index) =>
            colorItem?.type === "GradientRainbow" ? (
              <div
                className=" w-full flex flex-row justify-between"
                key={index}
              >
                <span className=" text-white">{colorItem?.name}</span>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={() => {
                      changeColorStatusOnClick(
                        colorItem?._id,
                        colorItem?.type,
                        colorItem?.status
                      );
                    }}
                    className="sr-only peer"
                    defaultChecked={colorItem?.status === 1}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label>
              </div>
            ) : null
          )}
        </div>
        <div className=" w-full">
          <input
            onChange={(event) => {
              setGradientRainbowColorName(event.target.value);
            }}
            type="text"
            className=" bg-white placeholder:text-gray-300 bg-opacity-15 border border-gray-100 w-full text-sm px-4 py-2.5 rounded-md outline-none focus:outline-transparent focus:border-yellow-500 text-white"
            placeholder="Enter Gradient / Rainbow Color"
          />
        </div>
        <div className=" w-full flex justify-center">
          <button
            onClick={handleCreateGradientRainbowColorOnClick}
            className="bg-yellow-400 hover:bg-yellow-500 border-none outline-none focus:outline-transparent focus:outline-none"
          >
            Add Gradient / Rainbow Color
          </button>
        </div>
      </div>
    </div>
  );
}

export default Variations;
