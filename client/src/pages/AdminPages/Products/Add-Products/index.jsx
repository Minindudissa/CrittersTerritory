import PageLoading from "@/pages/PageLoading";
import {
  categorySearch,
  colorSearch,
  productCreate,
  productImageCreate,
  sizeSearch,
} from "@/services";
import { useEffect, useState } from "react";
import "lodash";
import "dropzone/dist/dropzone-min";

function AddProducts() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [sizeList, setSizeList] = useState(null);
  const [colorList, setColorList] = useState(null);

  const [colorCount, setColorCount] = useState(null);
  const [dimension, setDimension] = useState(null);

  const [productType, setProductType] = useState("Digital");
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [material, setMaterial] = useState(null);
  const [weight, setWeight] = useState(null);
  const [printSettings, setPrintSettings] = useState(null);
  const [basePrice, setBasePrice] = useState(null);
  const [stockType, setStockType] = useState("0");
  const [category, setCategory] = useState("0");
  const [stockCount, setStockCount] = useState(null);
  const [printerType, setPrinterType] = useState("0");
  const [colorFileAvailability, setColorFileAvailability] = useState("0");

  const [Images, setImages] = useState([]); // Store selected Images
  const [imageUploadProgress, setImageUploadProgress] = useState({}); // Track upload progress for each file
  const [errorMessageImages, setErrorMessageImages] = useState("");
  const [sharableLink, setSharableLink] = useState("");

  let variationsList = [];
  const [variations, setVariations] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [colorVariationIndex, setColorVariationIndex] = useState(null);
  const [sizeVariationIndex, setSizeVariationIndex] = useState(null);
  const [myColorIndex, setMyColorIndex] = useState(0);
  const [mySizeIndex, setMySizeIndex] = useState(0);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const allowedImageTypes = [
    "image/jpeg", // .jpg, .jpeg
    "image/png", // .png
    "image/gif", // .gif
    "video/avi", // .avi
    "video/mov", // .mov
    "video/mkv", // .mkv (additional video format)
  ];

  const maxImageCount = 10;
  const maxGifCount = 1;
  const maxVideoCount = 1;

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    // Separate Images into categories
    const images = selectedImages.filter((file) =>
      file.type.startsWith("image/")
    );
    const gifs = selectedImages.filter((file) => file.type === "image/gif");
    const videos = selectedImages.filter((file) =>
      file.type.startsWith("video/")
    );

    // Check if the file count exceeds the limit
    if (
      images.length + gifs.length + videos.length >
      maxImageCount + maxGifCount + maxVideoCount
    ) {
      setErrorMessageImages(
        "You can upload a maximum of 10 images, 1 GIF, and 1 video."
      );
      return;
    }

    // Check individual category limits
    if (
      Images.filter((file) => file.file.type.startsWith("image/")).length +
        images.length >
      maxImageCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxImageCount} images.`
      );
      return;
    }
    if (
      Images.filter((file) => file.file.type === "image/gif").length +
        gifs.length >
      maxGifCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxGifCount} GIF.`
      );
      return;
    }
    if (
      Images.filter((file) => file.file.type.startsWith("video/")).length +
        videos.length >
      maxVideoCount
    ) {
      setErrorMessageImages(
        `You can only upload a maximum of ${maxVideoCount} video.`
      );
      return;
    }

    // Filter Images by allowed types
    const filteredImages = selectedImages.filter((file) =>
      allowedImageTypes.includes(file.type)
    );

    if (filteredImages.length < selectedImages.length) {
      setErrorMessageImages(
        "Some Images were ignored because they are not allowed."
      );
    } else {
      setErrorMessageImages("");
    }

    const uniqueImages = filteredImages.filter(
      (file) =>
        !Images.some((existingFile) => existingFile.file.name === file.name)
    );

    const mappedImages = uniqueImages.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`, // Unique ID for each file
      uploaded: false,
    }));

    setImages((prevImages) => [...prevImages, ...mappedImages]);

    // Simulate temporary upload progress
    mappedImages.forEach((file) => simulateTempImageUpload(file.id));
  };

  const simulateTempImageUpload = (id) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImageUploadProgress((prev) => ({
        ...prev,
        [id]: progress,
      }));
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  const handleImageRemove = (id) => {
    setImages((prevImages) => prevImages.filter((file) => file.id !== id));
    setImageUploadProgress((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renderFilePreview = (file) => {
    if (file.file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file.file)}
          alt={file.file.name}
          className="w-16 h-16 object-cover rounded"
          loading="lazy"
          decoding="async"
        />
      );
    } else if (file.file.type === "image/gif") {
      return (
        <img
          src={URL.createObjectURL(file.file)}
          alt={file.file.name}
          className="w-16 h-16 object-cover rounded"
          loading="lazy"
          decoding="async"
        />
      );
    } else if (file.file.type.startsWith("video/")) {
      return (
        <video width="80" height="80" controls>
          <source src={URL.createObjectURL(file.file)} type={file.file.type} />
        </video>
      );
    }
    return null;
  };

  const addVariation = () => {
    setVariations([...variations, { name: "", options: [""] }]);
    generateCombinations();
  };

  const updateVariation = (index, key, value) => {
    if (value.includes("Color")) {
      setColorVariationIndex(index);
    }
    if (value.includes("Size")) {
      setSizeVariationIndex(index);
    }
    const updatedVariations = [...variations];
    updatedVariations[index][key] = value;
    setVariations(updatedVariations);
    generateCombinations();
  };

  const removeVariation = (index) => {
    if (colorVariationIndex === index || sizeVariationIndex === index) {
      setColorVariationIndex(null);
      setSizeVariationIndex(null);
    }
    setVariations(variations.filter((_, i) => i !== index));
    generateCombinations();
  };
  const updateOption = (variationIndex, optionIndex, value) => {
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].options[optionIndex] = value;
    setVariations(updatedVariations);
    generateCombinations();
  };

  const addOption = (index) => {
    const updatedVariations = [...variations];
    updatedVariations[index].options.push("");
    setVariations(updatedVariations);
    generateCombinations();
  };

  const removeOption = (variationIndex, optionIndex) => {
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].options = updatedVariations[
      variationIndex
    ].options.filter((_, i) => i !== optionIndex);
    setVariations(updatedVariations);
    generateCombinations();
  };

  const generateCombinations = () => {
    const allCombinations = variations.reduce((acc, variation) => {
      if (acc.length === 0) return variation.options.map((option) => [option]);
      return acc.flatMap((prev) =>
        variation.options.map((option) => [...prev, option])
      );
    }, []);

    const formattedCombinations = allCombinations.map((comb) => ({
      combination: comb.join(" - "),
      price: price,
      quantity: quantity,
      status: 1,
    }));
    setCombinations(formattedCombinations);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const [categoryResponse, sizeResponse, colorResponse] =
          await Promise.all([
            categorySearch({ searchData: {} }),
            sizeSearch({ searchData: {} }),
            colorSearch({ searchData: {} }),
          ]);

        if (categoryResponse?.success) {
          setCategoryList(categoryResponse.categoryList);
        }
        if (sizeResponse?.success) {
          setSizeList(sizeResponse.sizeList);
        }
        if (colorResponse?.success) {
          setColorList(colorResponse.colorList);
        }

        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleAddProductOnSubmit(event) {
    event.preventDefault();

    if (productType === "Digital") {
      if (title === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Title");
      } else if (description === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Description");
      } else if (printSettings === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Print Settings");
      } else if (basePrice === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Base Price");
      } else if (stockType === "0") {
        setSuccessMsg(null);
        setErrorMsg("Please Select Product Stock Type");
      } else if (printerType === "0") {
        setSuccessMsg(null);
        setErrorMsg("Please Select Printer Type");
      } else if (colorFileAvailability === "0") {
        setSuccessMsg(null);
        setErrorMsg("Please Select Color File Availability");
      } else if (sharableLink === "") {
        setSuccessMsg(null);
        setErrorMsg("Please enter the sharable link");
      } else if (Images.length === 0) {
        setSuccessMsg(null);
        setErrorMsg("Please Upload Relevant Images");
      } else if (category === "0") {
        setSuccessMsg(null);
        setErrorMsg("Please Select Product Category");
      } else {
        if (stockType === "1" && stockCount === null) {
          setSuccessMsg(null);
          setErrorMsg("Please Enter Stock Count");
        } else {
          if (isNaN(basePrice)) {
            setSuccessMsg(null);
            setErrorMsg("Please Enter a Valid Base Price");
          } else if (isNaN(stockCount)) {
            setSuccessMsg(null);
            setErrorMsg("Please Enter a Valid Stock Count");
          } else {
            const createProductResponse = await productCreate({
              productType: productType,
              title: title,
              description: description,
              printSettings: printSettings,
              basePrice: basePrice,
              stockTypeId: stockType,
              stock: stockCount,
              printerTypeId: printerType,
              isColorFileAvailableId: colorFileAvailability,
              categoryId: category,
              dimension: null,
              colorCount: null,
              variations: {},
              sharableLink: sharableLink,
            });

            if (createProductResponse?.success) {
              const productId = createProductResponse?.createdProductData._id;

              const formData = new FormData();
              formData.append("productType", productType);
              formData.append("productId", productId);

              for (let i = 0; i < Images.length; i++) {
                formData.append("file", Images[i].file);
              }

              const createProductImageResponse = await productImageCreate(
                formData
              );

              if (createProductImageResponse) {
                setSuccessMsg(createProductImageResponse?.message);
                setErrorMessage(null);
              } else {
                setSuccessMsg(null);
                setErrorMessage(createProductImageResponse?.message);
              }
            } else {
              setSuccessMsg(null);
              setErrorMessage(createProductResponse?.message);
            }
          }
        }
      }
    } else if (productType === "Physical") {
      if (title === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Title");
      } else if (description === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Description");
      } else if (material === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Material");
      } else if (weight === null) {
        setSuccessMsg(null);
        setErrorMsg("Please Enter Product Weight");
      } else {
        if (
          variations.find((obj) => obj.name === "Color") &&
          colorCount === null
        ) {
          setSuccessMsg(null);
          setErrorMsg("Please Select Color Count");
          return;
        }
        if (
          variations.find((obj) => obj.name === "Size") &&
          dimension === null
        ) {
          setSuccessMsg(null);
          setErrorMsg("Please Enter the Dimension");
          return;
        }
        let isCombinationError = false;
        for (let i = 0; i < combinations.length; i++) {
          if (
            combinations.length > 0 &&
            combinations[i].combination === "" &&
            combinations[i].price === "" &&
            combinations[i].quantity === ""
          ) {
            isCombinationError === true;
            break;
          }
        }

        if (isCombinationError) {
          setSuccessMsg(null);
          setErrorMsg("Please Fill All Variation Input Fields");
          return;
        }

        if (variations.length === 0 && basePrice === null) {
          setSuccessMsg(null);
          setErrorMsg("Please Enter the Base Price");
          return;
        }

        if (Images.length === 0) {
          setSuccessMsg(null);
          setErrorMsg("Please Upload Relevant Images");
        } else if (category === "0") {
          setSuccessMsg(null);
          setErrorMsg("Please Select Product Category");
        } else {
          variationsList = [];
          variations.map((variationItem) => {
            variationsList.push(variationItem.name);
          });

          const createProductResponse = await productCreate({
            productType: productType,
            title: title,
            description: description,
            material: material,
            weight: weight,
            printSettings: null,
            basePrice: null,
            stockTypeId: "1",
            stock: null,
            printerTypeId: null,
            isColorFileAvailableId: null,
            categoryId: category,
            dimension: dimension,
            colorCount: colorCount,
            variationsList,
            variations: combinations,
            sharableLink: null,
          });

          if (createProductResponse?.success) {
            const productId = createProductResponse?.createdProductData._id;

            const formData = new FormData();
            formData.append("productType", productType);
            formData.append("productId", productId);

            for (let i = 0; i < Images.length; i++) {
              formData.append("file", Images[i].file);
            }

            const createProductImageResponse = await productImageCreate(
              formData
            );

            if (createProductImageResponse) {
              setSuccessMsg(createProductImageResponse?.message);
              setErrorMessage(null);
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else {
              setSuccessMsg(null);
              setErrorMessage(createProductImageResponse?.message);
            }
          } else {
            setSuccessMsg(null);
            setErrorMessage(createProductResponse?.message);
          }
        }
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  function handleProductTypeChangeOnClick() {
    setTitle(null);
    setDescription(null);
    setMaterial(null);
    setWeight(null);
    setPrintSettings(null);
    setBasePrice(null);
    setStockType("0");
    setCategory("0");
    setPrinterType("0");
    setColorFileAvailability("0");

    setErrorMessage("");

    setImages([]); // Store selected Images
    setErrorMessageImages("");
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className=" w-full flex flex-col justify-center items-center p-4">
      <div className=" w-full flex flex-col justify-center items-center py-4">
        <svg
          className="w-20 h-20 text-gray-100 dark:text-white"
          aria-hidden="true"
          xmlns="https://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z"
          />
        </svg>
        <span className=" font-bold text-[45px] text-gray-100">
          Add Product
        </span>
      </div>
      {successMsg ? (
        <div
          className=" w-full p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">{successMsg}</span>
        </div>
      ) : null}
      {errorMsg ? (
        <div
          className="w-full p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorMsg}</span>
        </div>
      ) : null}
      <div className=" bg-white bg-opacity-20 rounded-md flex flex-row items-center px-4 w-full">
        <div className="w-full flex flex-row gap-6 py-4">
          <div className="gap-2 flex flex-row items-center">
            <input
              type="radio"
              className=" bg-white w-5 h-5 accent-yellow-400"
              id="digital"
              name="listType"
              value="Digital"
              onChange={(event) => {
                setProductType(event.target.value);
              }}
              onClick={handleProductTypeChangeOnClick}
              defaultChecked
            />
            <label className="text-gray-100 font-medium" htmlFor="digital">
              Digital
            </label>
          </div>
          <div className=" gap-2 flex flex-row items-center">
            <input
              type="radio"
              className=" bg-white w-5 h-5 accent-yellow-400"
              id="physical"
              name="listType"
              value="Physical"
              onChange={(event) => {
                setProductType(event.target.value);
              }}
            />
            <label className="text-gray-100 font-medium" htmlFor="physical">
              Physical
            </label>
          </div>
        </div>
        <div className="w-full flex flex-row justify-end">
          <button
            onClick={handleAddProductOnSubmit}
            className=" bg-yellow-400 hover:bg-yellow-500 border-none hover:border-transparent outline-none focus:outline-none focus:outline-transparent focus:right-0 focus:border-none"
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="w-full flex lg:flex-row flex-col-reverse justify-center gap-4 py-4">
        <div className=" lg:w-2/3 w-full flex flex-col space-y-4">
          <div className=" bg-white bg-opacity-20 w-full rounded-md p-4 space-y-4">
            <span className="text-lg font-semibold text-white">
              General Information
            </span>
            <div className="w-full">
              <label className="text-gray-200 text-sm mb-1 block">Title</label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  name="title"
                  type="text"
                  className="text-gray-800 bg-gray-200 placeholder:text-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                  placeholder="Product Title"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="text-gray-200 text-sm mb-1 block">
                Description
              </label>
              <div className="relative flex items-center">
                <textarea
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  name="description"
                  className="text-gray-800 bg-gray-200 placeholder:text-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                  placeholder="Product Description"
                  rows={8}
                ></textarea>
              </div>
            </div>
            {productType === "Physical" ? (
              <>
                <div className="w-full">
                  <label className="text-gray-200 text-sm mb-1 block">
                    Material
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(event) => {
                        setMaterial(event.target.value);
                      }}
                      name="title"
                      type="text"
                      className="text-gray-800 bg-gray-200 placeholder:text-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                      placeholder="Product Material"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-gray-200 text-sm mb-1 block">
                    Weight (grams)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(event) => {
                        setWeight(event.target.value);
                      }}
                      name="title"
                      type="text"
                      className="text-gray-800 bg-gray-200 placeholder:text-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                      placeholder="Product Weight in grams"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className=" bg-white bg-opacity-20 w-full rounded-md p-4 space-y-4">
            <div className="w-full flex lg:flex-row flex-col flex-wrap lg:justify-start ">
              {productType === "Physical" ? (
                <>
                  <h2 className="text-lg font-semibold text-white">
                    Variations
                  </h2>
                  <div className=" w-full flex flex-row flex-wrap gap-4 justify-evenly">
                    {variations.map((variation, index) => (
                      <div
                        key={index}
                        className="mb-4 border p-4 rounded bg-gray-200 relative w-full"
                      >
                        <input
                          type="text"
                          placeholder="Variation Name (e.g., Color)"
                          className="border p-2 rounded mr-2 w-11/12 bg-white mb-2"
                          value={variation.name}
                          onChange={(e) => {
                            updateVariation(index, "name", e.target.value),
                              generateCombinations();
                          }}
                        />
                        <svg
                          xmlns="https://www.w3.org/2000/svg"
                          className="w-5 h-5 text-red-500 cursor-pointer absolute top-2 right-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          onClick={() => removeVariation(index)}
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        {colorVariationIndex !== null &&
                        index === colorVariationIndex ? (
                          <div className=" w-full flex flex-row justify-between flex-wrap">
                            {colorList.map((colorItem, colorIndex) => (
                              <div
                                className={` flex flex-row items-center gap-1 mb-2 ${
                                  colorItem.status === 0
                                    ? "pointer-events-none opacity-25"
                                    : ""
                                } `}
                                key={colorIndex}
                              >
                                <input
                                  type="checkbox"
                                  className=" w-5 h-5 bg-white accent-yellow-400 cursor-pointer"
                                  disabled={colorItem.status === 0}
                                  onClick={(e) => {
                                    if (e.target.checked) {
                                      updateOption(
                                        index,
                                        myColorIndex,
                                        colorItem.name
                                      ),
                                        setMyColorIndex(myColorIndex + 1);
                                      generateCombinations();
                                    } else {
                                      const variationIndexToRemove = variations[
                                        index
                                      ].options.indexOf(colorItem?.name);
                                      removeOption(
                                        index,
                                        variationIndexToRemove
                                      );
                                      setMyColorIndex(myColorIndex - 1);
                                      generateCombinations();
                                    }
                                  }}
                                />
                                <label className="text-gray-800 text-sm ">
                                  {colorItem?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : sizeVariationIndex !== null &&
                          index === sizeVariationIndex ? (
                          <div className=" w-full flex flex-row justify-between flex-wrap">
                            {sizeList?.map((sizeItem, sizeIndex) => (
                              <div
                                className={` flex flex-row items-center gap-1 mb-2 ${
                                  sizeItem.status === 0
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                } `}
                                key={sizeIndex}
                              >
                                <input
                                  type="checkbox"
                                  className=" w-5 h-5 bg-white accent-yellow-400 cursor-pointer"
                                  disabled={sizeItem.status === 0}
                                  onClick={(e) => {
                                    if (e.target.checked) {
                                      updateOption(
                                        index,
                                        mySizeIndex,
                                        sizeItem.name
                                      ),
                                        setMySizeIndex(mySizeIndex + 1);
                                      generateCombinations();
                                    } else {
                                      const variationIndexToRemove = variations[
                                        index
                                      ].options.indexOf(sizeItem?.name);
                                      removeOption(
                                        index,
                                        variationIndexToRemove
                                      );
                                      setMySizeIndex(mySizeIndex - 1);
                                      generateCombinations();
                                    }
                                  }}
                                />
                                <label className="text-gray-800 text-sm ">
                                  {sizeItem?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          variation.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="relative inline-block"
                            >
                              <>
                                <input
                                  type="text"
                                  placeholder="Option (e.g., Red)"
                                  className="border p-2 rounded mr-2 pr-8 bg-white"
                                  value={option}
                                  onChange={(e) => {
                                    updateOption(
                                      index,
                                      optIndex,
                                      e.target.value
                                    ),
                                      generateCombinations();
                                  }}
                                />
                                <svg
                                  xmlns="https://www.w3.org/2000/svg"
                                  className="w-4 h-4 text-red-500 cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  onClick={() => removeOption(index, optIndex)}
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </>
                            </div>
                          ))
                        )}
                        {colorVariationIndex !== null &&
                        index ===
                          colorVariationIndex ? null : sizeVariationIndex !==
                            null && index === sizeVariationIndex ? null : (
                          <button
                            onClick={() => addOption?.(index)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                          >
                            Add Option
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className=" w-full">
                    <button
                      onClick={addVariation}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                      Add Variation
                    </button>
                  </div>
                  <div className="w-full rounded-md bg-gray-100 py-4">
                    <div className="mb-4">
                      <table className="w-full border">
                        <thead className="bg-gray-300">
                          <tr>
                            <th className="border p-2 w-2/4 ">Variant</th>
                            <th className="border p-2 w-1/4">Price</th>
                            <th className="border p-2 w-1/4">Quantity</th>
                            <th className="border p-2 w-1/4">Availability</th>
                          </tr>
                        </thead>
                        <tbody className=" bg-gray-200">
                          {combinations.map((comb, index) => (
                            <tr key={index}>
                              <td className="border p-2 text-center font-semibold">
                                {comb.combination}
                              </td>
                              <td className="border p-2">
                                <input
                                  type="text"
                                  className="w-full border p-1 bg-white"
                                  value={comb.price}
                                  onChange={(e) => {
                                    const updatedCombinations = [
                                      ...combinations,
                                    ];
                                    updatedCombinations[index].price =
                                      e.target.value;
                                    setCombinations(updatedCombinations);
                                  }}
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="text"
                                  className="w-full border p-1 bg-white"
                                  value={comb.quantity}
                                  onChange={(e) => {
                                    const updatedCombinations = [
                                      ...combinations,
                                    ];
                                    updatedCombinations[index].quantity =
                                      e.target.value;
                                    setCombinations(updatedCombinations);
                                  }}
                                />
                              </td>
                              <td className="border p-2 flex flex-row justify-center">
                                <div className="flex items-center">
                                  <label className="relative cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      defaultChecked={comb.status}
                                      onChange={(e) => {
                                        const updatedCombinations = [
                                          ...combinations,
                                        ];
                                        if (
                                          (updatedCombinations[
                                            index
                                          ].status = 1)
                                        ) {
                                          updatedCombinations[index].status = 0;
                                          setCombinations(updatedCombinations);
                                        } else {
                                          updatedCombinations[index].status = 1;
                                          setCombinations(updatedCombinations);
                                        }
                                      }}
                                    />
                                    <div className="w-[53px] h-7 flex items-center bg-gray-300 rounded-full text-[9px] peer-checked:text-green-500 text-gray-300 font-extrabold after:flex after:items-center after:justify-center peer after:content-['Off'] peer-checked:after:content-['On'] peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                                  </label>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className=" w-full flex flex-row justify-center gap-4">
                      {variations.find((obj) => obj.name === "Color") ? (
                        <div className="w-full mb-2">
                          <label
                            htmlFor="Color-Count"
                            className="text-gray-800 text-sm mb-1 block"
                          >
                            Color Count
                          </label>
                          <select
                            onChange={(event) => {
                              setColorCount(event.target.value);
                            }}
                            id="colorCount"
                            name="colorCount"
                            className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                          >
                            <option value="0">Select Color Count</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                        </div>
                      ) : null}
                      {variations.find((obj) => obj.name === "Size") ? (
                        <div className="w-full">
                          <label
                            htmlFor="Dimension"
                            className="text-gray-800 text-sm mb-1 block"
                          >
                            Dimension
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="Dimension"
                              name="Dimension"
                              onChange={(event) =>
                                setDimension?.(event.target.value)
                              }
                              className="text-gray-800 bg-white placeholder-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                              placeholder="Enter Dimension"
                              aria-label="Dimension"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <span className="text-lg font-semibold text-white">
                    Print Settings
                  </span>
                  <div className="relative flex items-center">
                    <textarea
                      id="print-settings"
                      name="print-settings"
                      onChange={(event) =>
                        setPrintSettings?.(event.target.value)
                      }
                      className="text-gray-800 bg-gray-200 placeholder-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                      placeholder="Enter print settings..."
                      rows={8}
                      aria-label="Print Settings"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          </div>
          {productType === "Digital" ? (
            <div className="bg-white bg-opacity-20 w-full rounded-md p-4 space-y-4">
              <span className="text-lg font-semibold text-white">
                Pricing & Stock
              </span>
              <div className=" w-full flex flex-row justify-evenly gap-4">
                <div
                  className={`w-full ${
                    productType === "Physical" && variations.length > 0
                      ? "pointer-events-none opacity-40"
                      : ""
                  }`}
                >
                  <label className="text-gray-200 text-sm mb-1 block">
                    Base Price
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(event) => {
                        setBasePrice(event.target.value);
                      }}
                      name="base-price"
                      type="text"
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                      placeholder="Enter Base Price"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label className="text-gray-200 text-sm mb-1 block">
                    Stock Type
                  </label>
                  <div className="relative flex items-center">
                    <select
                      onChange={(event) => {
                        setStockType(event.target.value);
                      }}
                      id="stockType"
                      name="stockType"
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    >
                      <option value="0">Select Stock Type</option>
                      <option value="1">Limited</option>
                      <option value="2">Unlimited</option>
                    </select>
                  </div>
                  {stockType === "1" ? (
                    <div className="relative flex items-center mt-2">
                      <input
                        onChange={(event) => {
                          setStockCount(event.target.value);
                        }}
                        name="stock-count"
                        type="text"
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                        placeholder="Enter Stock Count"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          {productType === "Digital" ? (
            <div className="bg-white bg-opacity-20 w-full rounded-md p-4 space-y-4">
              <span className="text-lg font-semibold text-white">
                Printer Info
              </span>
              <div className=" w-full flex flex-row justify-evenly gap-4">
                <div className="w-full">
                  <label className="text-gray-200 text-sm mb-1 block">
                    Printer Type
                  </label>
                  <div className="relative flex items-center mb-4">
                    <select
                      onChange={(event) => {
                        setPrinterType(event.target.value);
                      }}
                      id="printerType"
                      name="printerType"
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    >
                      <option value="0">Select Printer Type</option>
                      <option value="1">FDM</option>
                      <option value="2">Resin</option>
                      <option value="3">Both</option>
                    </select>
                  </div>
                  <div className="relative flex-col items-center ">
                    <label className="text-gray-200 text-sm mb-1 block">
                      Color File Availability
                    </label>
                    <select
                      onChange={(event) => {
                        setColorFileAvailability(event.target.value);
                      }}
                      id="colorFileAvailability"
                      name="colorFileAvailability"
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    >
                      <option value="0">Select Color File Availability</option>
                      <option value="1">Included</option>
                      <option value="2">Not Included</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="  lg:w-1/3 w-full bg-white bg-opacity-20 rounded-md">
          <div className=" w-full rounded-md p-4">
            <span className="text-lg font-semibold text-white">
              Product Images
            </span>
            {/* Drag and Drop Upload UI */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-images"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="https://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    .JPG .PNG .GIF
                  </p>
                </div>
                <input
                  id="dropzone-images"
                  name="file"
                  type="file"
                  className="hidden"
                  multiple
                  formEncType="multipart/form-data"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {errorMessageImages && (
              <p className="text-red-500 text-sm mb-4">{errorMessageImages}</p>
            )}

            {/* Display Uploaded Images */}
            <div className="mt-6 space-y-4">
              {Images.length > 0 ? (
                Images.map((file) => (
                  <div
                    key={file.id}
                    className="relative border p-4 rounded shadow-sm flex items-center justify-between bg-white"
                  >
                    <div className="flex-grow flex items-center space-x-4">
                      {renderFilePreview(file)}
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium">{file.file.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                          <div
                            className={`h-4 ${
                              imageUploadProgress[file.id] === 100
                                ? "bg-yellow-400"
                                : "bg-yellow-400"
                            } rounded-full transition-all duration-300 ease-in-out`}
                            style={{
                              width: `${imageUploadProgress[file.id] || 0}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {imageUploadProgress[file.id]
                            ? `${imageUploadProgress[file.id]}%`
                            : "Waiting to upload..."}
                        </p>
                      </div>
                    </div>
                    <a
                      onClick={() => handleImageRemove(file.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg cursor-pointer font-bold"
                      title="Remove file"
                    >
                      ✕
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-200">No Images selected.</p>
              )}
            </div>
          </div>
          {productType === "Digital" ? (
            <div className="w-full p-4">
              <label className="text-gray-200 text-sm mb-1 block">
                Sharable Link
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={(event) => {
                    setSharableLink(event.target.value);
                  }}
                  name="title"
                  type="text"
                  className="text-gray-800 bg-gray-200 placeholder:text-gray-500 border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                  placeholder="Sharable Link"
                />
              </div>
            </div>
          ) : null}
          <div className=" w-full bg-transparent rounded-md p-4">
            <span className="text-lg font-semibold  text-white">Category</span>
            <label className="text-gray-200 text-sm mb-1 mt-4 block">
              Category
            </label>
            <select
              onChange={(event) => {
                setCategory(event.target.value);
              }}
              id="category"
              name="category"
              className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
            >
              <option value="0">Select Category</option>
              {categoryList?.map((categoryItem, index) => (
                <option
                  disabled={categoryItem?.status === 0}
                  key={index}
                  value={categoryItem?._id}
                >
                  {categoryItem?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
