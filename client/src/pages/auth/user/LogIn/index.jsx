import { UserAuthContext } from "@/context/UserAuthContext";
import {
  cartCreate,
  cartSearch,
  cartUpdate,
  loginUser,
  productSearch,
  searchUser,
  sendEmail,
  UpdateUser,
  userPasswordChange,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserLogIn() {
  const [email, setEmail] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [verificationBox, setVerificationBox] = useState(false);
  const [passwordResetBox, setPasswordResetBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);

  async function handleOnClick() {
    const loginResponse = await loginUser({ email, password });
    if (loginResponse?.message === '"email" is not allowed to be empty') {
      setErrorMsg("Please Enter Your Email");
    } else if (loginResponse?.message === '"email" must be a valid email') {
      setErrorMsg("Please Enter a Valid Email");
    } else if (
      loginResponse?.message === '"password" is not allowed to be empty'
    ) {
      setErrorMsg("Please Enter Your Password");
    } else {
      if (loginResponse?.success) {
        setErrorMsg(null);
        setSuccessMsg(loginResponse?.message);
        if (isRememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        const cartData = JSON.parse(localStorage.getItem("cartData"));
        cartData?.map(async (cartItem) => {
          const usercartSearchResponse = await cartSearch({
            searchData: {
              productId: cartItem.productId,
              ...(cartItem.variant?.length
                ? { variant: cartItem.variant }
                : {}),
              ...(cartItem.multiColorColorList?.length
                ? { multiColorColorList: cartItem.multiColorColorList }
                : {}),
              userId: loginResponse.userId,
            },
          });

          if (usercartSearchResponse.cartList.length > 0) {
            const productSearchhResponse = await productSearch({
              searchData: { _id: cartItem.productId },
            });
            productSearchhResponse.productList[0].productType === "Physical"
              ? await cartUpdate({
                  productId: cartItem.productId,
                  variant: cartItem.variant,
                  multiColorColorList: cartItem.multiColorColorList,
                  userId: loginResponse.userId,
                  updateData: {
                    quantity: cartItem.quantity,
                  },
                })
              : null;
            localStorage.removeItem("cartData");
          } else {
            await cartCreate({
              productId: cartItem.productId,
              variant: cartItem.variant,
              multiColorColorList: cartItem.multiColorColorList,
              quantity: cartItem.quantity,
              userId: loginResponse.userId,
            });
            localStorage.removeItem("cartData");
          }
        });

        setTimeout(() => {
          setSuccessMsg(null);
          navigate("../../", { replace: true });
        }, 2000);
      } else {
        setSuccessMsg(null);
        setErrorMsg(loginResponse?.message);
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
      }
    }
  }

  async function generateEmailOTP(event) {
    event.preventDefault();
    let chars = "0123456789".split("");
    let result = "";
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * chars.length);
      result += chars[x];
    }
    setIsLoading(true);
    await handleSendVerificationOnClick(result);
    setIsLoading(false);
  }

  async function handleSendVerificationOnClick(OTP) {
    if (verificationEmail === "") {
      setSuccessMsg(null);
      setErrorMsg("Please Enter Your Email");
    } else {
      const searchUserResponse = await searchUser({
        searchData: { email: verificationEmail },
      });

      if (searchUserResponse?.message === "Wrong Data") {
        setSuccessMsg(null);
        setErrorMsg("Email you've entered doesn't match with our records");
      }

      const emailContent =
        '  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
        '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
        "Forgot Your Password?" +
        "</div>" +
        '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
        "<p>Hello,</p>" +
        "<p>We received a request to reset your password. Use the verification code below to reset it:</p>" +
        '<div style="display: inline-block; margin: 20px auto; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #000; background-color: #eee; border-radius: 5px; letter-spacing: 2px;">' +
        OTP +
        "</div>" +
        "<p>If you did not request a password reset, please ignore this email or contact our support team for assistance.</p>" +
        "<p>Thank you,<br>The Critters Territory Team</p>" +
        "</div>" +
        '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
        "&copy; Critters Territory. All rights reserved.<br>" +
        '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
        "</div>" +
        "</div>";

      if (searchUserResponse?.success) {
        const sendEmailResponse = await sendEmail({
          toName:
            searchUserResponse?.userData.firstName +
            " " +
            searchUserResponse?.userData.lastName,
          toEmail: verificationEmail,
          subject: "Forgot Password - Verification Code - Critters Territory",
          emailContent,
          replyToEmail: "crittersterritory@gmail.com",
          replyToName: "Critters Territory",
        });

        setSuccessMsg("Please check your email for verification code");

        if (sendEmailResponse?.success) {
          const updateUserResponse = await UpdateUser({
            email: verificationEmail,
            updateData: { passwordVeriicationCode: OTP },
          });
        }
      } else {
        errorMsg("Something went wrong. Please try again later");
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
    setPassword(localStorage.getItem("password") || "");
  }, []);

  async function handleVerificationOnClick() {
    if (verificationCode === "") {
      setSuccessMsg(null);
      setErrorMsg("Please enter the verification code to continue the process");
    } else {
      const searchUserResponse = await searchUser({
        searchData: {
          email: verificationEmail,
          passwordVeriicationCode: verificationCode,
        },
      });

      if (searchUserResponse?.message === "Wrong Data") {
        setSuccessMsg(null);
        setErrorMsg("Invalid Verification Code");
      } else {
        if (searchUserResponse?.success) {
          setVerificationBox(false);
          setPasswordResetBox(true);
        }
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  async function handleChangePasswordOnClick() {
    const userPasswordChangeResponse = await userPasswordChange({
      email: verificationEmail,
      currentPassword: "",
      newPassword,
      confirmPassword,
    });
    if (userPasswordChangeResponse?.message.includes("least 8 characters")) {
      setErrorMsg("Password should contain atlease 8 characters");
    } else if (
      userPasswordChangeResponse?.message.includes(
        "Confirm Password doesn't match with New Password"
      )
    ) {
      setErrorMsg("Confirm Password doesn't match with New Password");
    } else {
      const emailContent =
        '  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
        '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
        "Password Changed Successfully" +
        "</div>" +
        '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
        "<p>Hello,</p>" +
        "<p>Your password has been changed successfully. If you did not make this change, please contact our support team immediately to secure your account.</p>" +
        "<p>Thank you for using Critters Territory.</p>" +
        "<p>Best regards,<br>The Critters Territory Team</p>" +
        "</div>" +
        '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
        "&copy; Critters Territory. All rights reserved.<br>" +
        '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
        "</div>" +
        "</div>";

      const sendEmailResponse = await sendEmail({
        toName: "User",
        toEmail: verificationEmail,
        subject: "Your Password Has Been Successfully Changed",
        emailContent,
        replyToEmail: "crittersterritory@gmail.com",
        replyToName: "Critters Territory",
      });

      if (sendEmailResponse?.success) {
        setSuccessMsg("Password changed successfully");
        setPasswordResetBox(false);
      } else {
        setErrorMsg(sendEmailResponse?.message);
      }
    }

    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 3000);
  }

  return (
    <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div className="grid bg-gray-200 md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-yellow-500 to-yellow-400 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">
              Welcome Back to Critters Territory
            </h4>
            <p className="text-[15px] text-gray-800 mt-3 leading-relaxed">
              We’re excited to have you back! Log in to explore your favorite
              models and manage your account.
            </p>
          </div>
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">
              Secure Login Experience
            </h4>
            <p className="text-[15px] text-gray-800 mt-3 leading-relaxed">
              Your privacy and security matter to us. Enjoy a safe and seamless
              login process every time.
            </p>
          </div>
        </div>
        {verificationBox ? (
          <form className="md:col-span-2 w-full py-6 px-6 sm:px-16">
            {successMsg ? (
              <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">{successMsg}</span>
              </div>
            ) : null}
            {errorMsg ? (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">{errorMsg}</span>
              </div>
            ) : null}

            <div className="space-y-3">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setVerificationEmail(event.target.value);
                    }}
                    name="email"
                    type="email"
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end ">
                <span
                  className="hover:text-yellow-600 cursor-pointer"
                  onClick={generateEmailOTP}
                >
                  {isLoading ? "Sending Code ..." : "Send Verification Code"}
                </span>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Verification Code
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setVerificationCode(event.target.value);
                    }}
                    name="verificationCode"
                    type="text"
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleVerificationOnClick}
                type="button"
                className="w-full py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Verify
              </button>
            </div>
          </form>
        ) : passwordResetBox ? (
          <form className="md:col-span-2 w-full py-6 px-6 sm:px-16">
            {successMsg ? (
              <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">{successMsg}</span>
              </div>
            ) : null}
            {errorMsg ? (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">{errorMsg}</span>
              </div>
            ) : null}

            <div className="space-y-3">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                    }}
                    name="newPassword"
                    type="text"
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="New Password"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    name="confirmPassword"
                    type="text"
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleChangePasswordOnClick}
                type="button"
                className="w-full py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <form className="md:col-span-2 w-full py-6 px-6 sm:px-16">
            {successMsg ? (
              <div
                className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">{successMsg}</span>
              </div>
            ) : null}
            {errorMsg ? (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">{errorMsg}</span>
              </div>
            ) : null}
            <div className="mb-6">
              <h3 className="text-gray-800 text-2xl font-bold">Log In</h3>
              <h4 className="text-gray-800 text-lg mt-4">
                Hello, Welcome Back !
              </h4>
            </div>

            <div className="space-y-6">
              {/* <div>
                <label className="text-gray-800 text-sm mb-2 block">Name</label>
                <div className="relative flex items-center">
                  <input name="name" type="text" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500" placeholder="Enter name" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div> */}

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    name="email"
                    type="email"
                    value={email}
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="Enter email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clipPath="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-yellow-500"
                    placeholder="Enter password"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                    }}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex w-full justify-between ">
                <div className=" flex items-center w-full ">
                  <input
                    onClick={() => {
                      setIsRememberMe(!isRememberMe);
                    }}
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className=" accent-yellow-500 h-4 w-4 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800 "
                  >
                    Remember me
                  </label>
                </div>
                <div className=" flex items-center justify-end w-full pe-3">
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      setVerificationBox(true);
                    }}
                  >
                    Forgot Password
                  </a>
                </div>
              </div>
            </div>

            <div className="!mt-12">
              <button
                onClick={handleOnClick}
                type="button"
                className="w-full py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Log In
              </button>
            </div>
            <p className="text-gray-800 text-sm mt-6 text-center">
              New to Critters Territory?
              <a
                onClick={() => navigate("../register", { replace: true })}
                className="cursor-pointer text-black hover:text-black font-semibold hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserLogIn;
