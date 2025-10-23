import PageLoading from "@/pages/PageLoading";
import { categorySearch, productImageSearch, productSearch } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productImageList, setProductImageList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("5");
  const [totalPages, setTotalPages] = useState(1);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [searchTerm, setsearchTerm] = useState("");

  const myIp = import.meta.env.VITE_VPS_IP_ADDRESS;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Start loading

        const [productSearchResponse, categoryResponse] = await Promise.all([
          productSearch({
            searchData: { title: { $regex: searchTerm, $options: "i" } },
            pagination: { page: currentPage, limit: limit },
          }),
          categorySearch({ searchData: {} }),
        ]);

        if (productSearchResponse?.success) {
          setProductList(productSearchResponse.productList);
          setCurrentPage(productSearchResponse?.currentPage);
          setTotalPages(productSearchResponse?.totalPages);
        }

        if (categoryResponse?.success) {
          setCategoryList(categoryResponse.categoryList);
        }

        setIsLoading(false); // Stop loading once all requests are done
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentPage, limit, searchTerm]);

  async function searchProductImages(product_id) {
    const [productImageSearchResponse] = await Promise.all([
      productImageSearch({ searchData: { productId: product_id } }),
    ]);

    if (productImageSearchResponse?.success) {
      setProductImageList(
        productImageSearchResponse.productImageList[0].imagePath[0]
      );
    }
  }

  return (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className=" w-full flex flex-col justify-center items-center ">
        <span className=" font-bold text-[45px] text-white">Products</span>
      </div>
      <div className="w-full py-5 md:flex md:flex-row md:justify-evenly flex flex-col items-center space-y-4 md:space-y-0">
        <div className="bg-white bg-opacity-15 flex px-4 py-3 border border-gray-300 rounded-lg focus-within:border-yellow-500 min-w-[60%]">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="18px"
            className="fill-gray-300 mr-3"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={(event) => {
              setsearchTerm(event.target.value);
              setTotalPages(1);
            }}
            placeholder="Search Product"
            className="w-full outline-none bg-transparent text-sm text-white placeholder:text-gray-300"
          />
        </div>
        <button
          onClick={() => {
            navigate("../add-products");
          }}
          className=" text-yellow-400 border-yellow-500 hover:border-transparent hover:text-black border hover:bg-yellow-500 focus:outline-none font-medium rounded-lg text-center p-2 "
        >
          Add Product
        </button>
      </div>
      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="overflow-x-auto px-4 w-full">
          <table className="w-full border-collapse border rounded-lg text-white bg-white bg-opacity-10">
            <thead>
              <tr className="bg-white bg-opacity-15">
                <th className="p-3 border border-gray-700">Title</th>
                <th className="p-3 border border-gray-700">Type</th>
                <th className="p-3 border border-gray-700">Category</th>
                <th className="p-3 border border-gray-700">Price</th>
                <th className="p-3 border border-gray-700">Stock</th>
                <th className="p-3 border border-gray-700">Total Sales</th>
                <th className="p-3 border border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, Index) => (
                <>
                  <tr
                    key={Index}
                    className="border border-gray-700  hover:bg-white hover:bg-opacity-5 cursor-pointer"
                    onClick={() => {
                      setExpandedProduct(
                        expandedProduct === product._id ? null : product._id
                      );
                      searchProductImages(product._id);
                    }}
                  >
                    <td className="p-3 border border-gray-700 text-center">
                      {product.title}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {product.productType}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {categoryList.map((categoryItem) =>
                        categoryItem._id === product.categoryId
                          ? categoryItem.name
                          : null
                      )}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {product.productType === "Physical"
                        ? Math.min(
                            ...(product.variations?.map((variation) =>
                              parseFloat(variation.price)
                            ) || [])
                          ) === Infinity
                          ? "----"
                          : "$" +
                            Math.min(
                              ...(product.variations?.map((variation) =>
                                parseFloat(variation.price)
                              ) || [])
                            ).toFixed(2) +
                            "+"
                        : product.basePrice.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {product.stock === null
                        ? product.stockTypeId === "2"
                          ? "Unlimited Stock"
                          : product.productType === "Physical"
                          ? "Vary Stock Count"
                          : null
                        : product.stock}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      {product.totalSales}
                    </td>
                    <td className="p-3 border border-gray-700 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          product.status === "1" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {product.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                  {expandedProduct === product._id && (
                    <tr className="bg-white bg-opacity-10">
                      <td colSpan={7} className="p-4 border border-gray-700">
                        <div className="flex gap-4">
                          <img
                            src={`https://${myIp}/${productImageList}`}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-sm text-gray-300">
                              {product.description.length > 100 ? (
                                <>
                                  {product.description.slice(0, 100)}...
                                  <a className="text-blue-400 ml-2">
                                    Show More
                                  </a>
                                </>
                              ) : (
                                product.description
                              )}
                            </p>
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={() => {
                                  window.open(
                                    `../admin/update-products/${product._id}`,
                                    "_blank"
                                  );
                                }}
                                className="px-3 py-2 bg-black hover:border-transparent text-white rounded hover:bg-gray-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  window.open(
                                    `../../product-details/${product._id}`,
                                    "_blank"
                                  );
                                }}
                                className="px-3 py-2 bg-gray-500 hover:border-transparent text-white rounded hover:bg-gray-600"
                              >
                                Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className=" w-full flex justify-end pe-4 mt-4 mb-2 text-white">
        per page :&nbsp;&nbsp;
        <select
          className=" bg-white bg-opacity-15 border-none outline-none focus:outline-transparent select rounded-md w-[60px] border-2"
          onChange={(event) => {
            setLimit(event.target.value);
            setCurrentPage(1);
          }}
          value={limit}
        >
          <option value="5" className=" bg-gray-800">
            5
          </option>
          <option value="10" className=" bg-gray-800">
            10
          </option>
          <option value="25" className=" bg-gray-800">
            25
          </option>
          <option value="50" className=" bg-gray-800">
            50
          </option>
          <option value="100" className=" bg-gray-800">
            100
          </option>
        </select>
      </div>
      <div className=" w-full mb-10">
        <ul className="flex space-x-5 justify-center font-[sans-serif]">
          <li
            className={
              currentPage === 1
                ? "flex items-center justify-center shrink-0 border  bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
                : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer w-9 h-9 rounded-md"
            }
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="https://www.w3.org/2000/svg"
              className="w-3 fill-gray-300"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={
                index + 1 === currentPage
                  ? "flex items-center justify-center shrink-0 bg-yellow-400  border hover:border-yellow-400 border-yellow-400 cursor-pointer text-base font-bold text-black px-[13px] h-9 rounded-md"
                  : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer text-base font-bold text-white px-[13px] h-9 rounded-md"
              }
            >
              {index + 1}
            </li>
          ))}
          <li
            className={
              currentPage === totalPages
                ? "flex items-center justify-center shrink-0 border  bg-white bg-opacity-10 border-none w-9 h-9 rounded-md"
                : "flex items-center justify-center shrink-0 border hover:border-yellow-400 cursor-pointer w-9 h-9 rounded-md"
            }
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <svg
              xmlns="https://www.w3.org/2000/svg"
              className="w-3 fill-gray-300 rotate-180"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Products;
