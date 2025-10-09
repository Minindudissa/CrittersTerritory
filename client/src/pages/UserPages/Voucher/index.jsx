import PageLoading from "@/pages/PageLoading";
import { createVoucher, searchVoucher } from "@/services";
import { useContext, useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { UserAuthContext } from "@/context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import validator from "validator";

function Voucher() {
  const [isLoading, setIsLoading] = useState(true);
  const [wantTosendViaEmail, setWantTosendViaEmail] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const [addVoucherCode, setAddVoucherCode] = useState("");
  const [addVoucherValue, setAddVoucherValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      generateVoucherCode();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const productsList = [];

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QObE5Fw1jM5sbYxCQFFOK7KE3em2YKpw7Y8tnsu00xaEg1I3lxpaLzxHRUQvWXkAcnGijxRpRjxy6DYrEmK6rkD00uNdaBK00"
    );

    productsList.push({
      code: addVoucherCode,
      title: "Gift Voucher",
      productType: "Voucher",
      quantity: "1",
      price: addVoucherValue,
    });

    const makePaymentResponse = await fetch(
      "http://localhost:5000/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productsList: productsList,
          subtotal: addVoucherValue,
          discount: 0,
          promocode_voucherCode: "",
          isStandardShippingChosen: true,
          shipping: 0,
          userId: user._id,
        }),
      }
    );

    const session = await makePaymentResponse.json();

    localStorage.setItem("orderProductDetails", JSON.stringify(productsList));

    localStorage.setItem(
      "orderPricingDetails",
      JSON.stringify([
        {
          subtotal: addVoucherValue,
          discount: 0,
          promocode_voucherCode: "",
          isStandardShippingChosen: true,
          shipping: "0",
          userId: user._id,
        },
      ])
    );
    if (wantTosendViaEmail) {
      localStorage.setItem(
        "orderEmailDetails",
        JSON.stringify([
          {
            name,
            email,
            message,
          },
        ])
      );
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  async function handleAddVoucherOnSubmit() {
    if (user === null) {
      navigate("/auth/login");
    } else {
      if (addVoucherValue === "") {
        toast.error("Please Enter a Voucher Discount Value in USD", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        if (wantTosendViaEmail) {
          if (name === null) {
            toast.error("Please enter receiver's name", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          } else if (email === null) {
            toast.error("Please enter receiver's email", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          } else if (!validator.isEmail(email)) {
            toast.error("Please enter a valid email", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          } else if (message === null) {
            toast.error("Please enter greeting message you want to send", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          } else {
            makePayment();
          }
        } else {
          makePayment();
        }
        // const startDate = new Date(addVoucherStartDate);
        // const formattedVoucherStartDate = startDate.toLocaleString("en-US", {
        //   day: "2-digit",
        //   month: "2-digit",
        //   year: "numeric",
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   second: "2-digit",
        //   hour12: true,
        // });
        // const createVoucherResponse = await createVoucher({
        //   code: addVoucherCode,
        //   VoucherValue: addVoucherValue,
        //   isUsed: false,
        //   startDate: formattedVoucherStartDate,
        //   validityPeriod: addVoucherValidityPeriod,
        // });
        // if (createVoucherResponse?.success) {
        //   toast.error(createVoucherResponse?.message, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: false,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //     transition: Bounce,
        //   });
        //   setTimeout(() => {
        //     window.location.reload();
        //   }, 6000);
        // } else {
        //   toast.error(createVoucherResponse?.message, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: false,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        //     transition: Bounce,
        //   });
        // }
      }
    }
  }

  function generateVoucherCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let voucherCode = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucherCode += characters[randomIndex];
    }
    setAddVoucherCode(voucherCode);
    return voucherCode;
  }

  return isLoading ? (
    <PageLoading />
  ) : (
    <div className="w-full h-full flex flex-col justify-center p-4 ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <h1 className="text-white font-semibold text-4xl ">Gift Vouchers</h1>
      <div className="w-full mt-4">
        <div className="w-full flex flex-col md:flex-row justify-start items-start gap-4">
          <img
            src="src/assets/Site_Images/Gift Voucher/Gift_Voucher.png"
            className="aspect-square h-auto w-10/12 md:w-6/12 lg:w-1/3 2xl:w-1/4 rounded-lg"
          />
          <div className=" w-10/12 md:w-6/12 lg:w-4/12 xl:w-3/12">
            <div className=" w-full flex md:flex-row flex-col justify-center items-center gap-4 mb-4">
              <div className="w-full">
                <label className="block text-white font-medium mb-2">
                  Voucher Value
                </label>
                <input
                  onChange={(event) => {
                    setAddVoucherValue(event.target.value);
                  }}
                  type="number"
                  name="voucherValue"
                  placeholder="Enter Voucher Value in USD"
                  className="w-full bg-white bg-opacity-15 text-white placeholder:text-gray-300 focus:border-yellow-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-0 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className=" w-full flex flex-col justify-start items-start gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onClick={() => {
                      setWantTosendViaEmail(!wantTosendViaEmail);
                      setName(null);
                      setEmail(null);
                      setMessage(null);
                    }}
                    defaultChecked={wantTosendViaEmail}
                  />
                  <div className="w-[53px] h-7 flex items-center bg-gray-300 rounded-full text-[9px] peer-checked:text-yellow-500 text-gray-300 font-extrabold after:flex after:items-center after:justify-center peer after:content-['Off'] peer-checked:after:content-['On'] peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
                <p className="mr-4 text-sm font-medium text-gray-100">
                  Gift via Email
                </p>
              </div>
              {wantTosendViaEmail ? (
                <div className=" w-full space-y-4">
                  <input
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    type="text"
                    placeholder="Recipient Name"
                    className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md py-2.5 px-4 border text-sm outline-none focus:border-yellow-500"
                  />
                  <input
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    type="email"
                    placeholder="Recipient Email"
                    className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md py-2.5 px-4 border text-sm outline-none focus:border-yellow-500"
                  />
                  <textarea
                    onChange={(event) => {
                      const typedMessage = event.target.value;
                      const formattedMessage = typedMessage.replace(
                        /\n/g,
                        "<br>"
                      );
                      setMessage(formattedMessage);
                    }}
                    placeholder="Greeting Message"
                    rows="6"
                    className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md px-4 border text-sm pt-2.5 outline-none focus:border-yellow-500"
                  ></textarea>
                </div>
              ) : null}
            </div>
            <button
              onClick={handleAddVoucherOnSubmit}
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-0 focus:ring-offset-0 border-none"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Voucher;
