import {
  createPromoCode,
  registerForNewsLetter,
  RegisterUser,
  searchUser,
  sendEmail,
  UpdateUser,
} from "@/services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [verificationBox, setVerificationBox] = useState(false);
  const navigate = useNavigate();

  async function generateEmailOTP() {
    let chars = "0123456789".split("");
    let result = "";
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * chars.length);
      result += chars[x];
    }
    setIsLoading(true);
    await sendOTP(result);
    setIsLoading(false);
  }

  async function handleOnClickVerification() {
    if (verificationCode === "") {
      setSuccessMsg(null);
      setErrorMsg("Please enter the OTP");
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    } else {
      setErrorMsg(null);
      setSuccessMsg(null);
      const searchResponse = await searchUser({
        searchData: {
          email,
          emailVerificationCode: verificationCode,
        },
      });
      if (searchResponse?.success) {
        const localDate = new Date().toLocaleString();
        const updateResponse = await UpdateUser({
          email,
          updateData: { emailVerifiedDateTime: localDate },
        });

        if (updateResponse?.success) {
          setSuccessMsg("Email Verified");
          setErrorMsg(null);

          const createPromoResponse = await createPromoCode({
            code: "WELCOME10",
            promoValue: "10",
            isUsed: false,
            startDate: localDate,
            endDate: "",
            userEmail: searchResponse?.userData[0].email,
          });

          if (createPromoResponse?.success) {
            // Email
            const emailContent =
              '<div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
              '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
              "Welcome to Critters Territory!" +
              "</div>" +
              '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
              "<p>Hello,</p>" +
              "<p>Thank you for registering with Critters Territory! We're thrilled to have you on board.</p>" +
              "<p>As a token of our appreciation, here’s a special promo code just for you:</p>" +
              '<div style="display: inline-block; margin: 20px auto; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #000; background-color: #eee; border-radius: 5px; letter-spacing: 2px;">' +
              "WELCOME10" +
              "</div>" +
              "<p>Use this code during checkout to enjoy 10% off your first purchase!</p>" +
              "<p>Happy shopping,<br>The Critters Territory Team</p>" +
              "</div>" +
              '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
              "&copy; Critters Territory. All rights reserved.<br>" +
              '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
              "</div>" +
              "</div>;";

            const sendPromoEmailResponse = await sendEmail({
              toName: firstName + " " + lastName,
              toEmail: email,
              subject: "New User Promo Code - Critters Territory",
              emailContent: emailContent,
              replyToEmail: "crittersterritory@gmail.com",
              replyToName: "Critters Territory",
            });

            if (sendPromoEmailResponse?.success) {
              setSuccessMsg("There's a Gift for you! Please Check your Email");
            } else {
              setErrorMsg(sendPromoEmailResponse?.message);
            }

            // Email
          } else {
            setErrorMsg(createPromoResponse?.message);
          }

          setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
            navigate("../login");
          }, 5000);
        } else {
          setSuccessMsg(null);
          setErrorMsg("Something went wrong! Please try again later");

          setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
          }, 2000);
        }
      } else {
        if (searchResponse?.message.includes("Wrong Data")) {
          setErrorMsg("OTP is Incorrect");
        }
      }
    }
  }

  async function sendOTP(result) {
    const emailContent =
      '  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
      '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
      "Critters Territory" +
      "</div>" +
      '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
      "<p>Hello,</p>" +
      "<p>Please use the OTP below to verify your account:</p>" +
      '<div style="display: inline-block; margin: 20px auto; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #000; background-color: #eee; border-radius: 5px; letter-spacing: 2px;">' +
      result +
      "</div>" +
      "<p>If you didn’t request this, please ignore this email.</p>" +
      "</div>" +
      '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
      "&copy; 2025 Critters Territory. All rights reserved.<br>" +
      '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
      "</div>" +
      "</div>";

    const data = await UpdateUser({
      email,
      updateData: { emailVerificationCode: result },
    });

    if (data?.success) {
      const sendEmailResponse = await sendEmail({
        toName: firstName + " " + lastName,
        toEmail: email,
        subject: "Register User - Email Verification - Critters Territory",
        emailContent: emailContent,
        replyToEmail: "crittersterritory@gmail.com",
        replyToName: "Critters Territory",
      });
      if (sendEmailResponse?.success) {
        setSuccessMsg(null);
        setErrorMsg(null);
        setVerificationBox(true);
      } else {
        setErrorMsg(sendEmailResponse?.message);
      }
    } else {
      console.log(data?.message);
    }
  }

  async function handleOnClick(event) {
    event.preventDefault();
    if (isAgreed) {
      setErrorMsg(null);

      try {
        // INSERT HERE
        const data = await RegisterUser({
          firstName,
          lastName,
          email,
          password,
        });

        if (data.message === '"firstName" is not allowed to be empty') {
          setSuccessMsg(null);
          setErrorMsg("Please enter your First Name");
        } else if (data.message === '"lastName" is not allowed to be empty') {
          setSuccessMsg(null);
          setErrorMsg("Please enter your Last Name");
        } else if (data.message === '"email" is not allowed to be empty') {
          setSuccessMsg(null);
          setErrorMsg("Please enter your Email");
        } else if (data.message === '"email" must be a valid email') {
          setSuccessMsg(null);
          setErrorMsg("Please enter a valid Email");
        } else if (data.message === '"password" is not allowed to be empty') {
          setSuccessMsg(null);
          setErrorMsg("Please enter a Password");
        } else if (
          data.message ===
          '"password" length must be at least 8 characters long'
        ) {
          setSuccessMsg(null);
          setErrorMsg("Password should contain atlease 8 characters");
        } else {
          if (data?.success) {
            setErrorMsg(null);
            setSuccessMsg(
              "You have successfully Registered! Welcome to Critters Territory"
            );

            const registerForNewsLetterResponse = await registerForNewsLetter({
              email,
              newsLetterStatus: true,
              userId: data?.userData._id,
            });

            if (registerForNewsLetterResponse?.success) {
              await generateEmailOTP();
            }
          } else {
            setSuccessMsg(null);
            setErrorMsg(data?.message);
            setTimeout(async () => {
              setErrorMsg(null);
              if (
                data?.message ===
                  "Email already in use. Please try again with a different email." &&
                data?.userData.emailVerifiedDateTime === ""
              ) {
                await generateEmailOTP();
              } else {
                navigate("../login");
              }
            }, 2000);
          }
        }
      } catch (error) {
        setSuccessMsg(null);
        setErrorMsg(error.message);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg("Do you agree and accept our Terms & Conditions");
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
  }

  return (
    <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div className="grid bg-gray-200 md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-yellow-500 to-yellow-400 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">
              Join Critters Territory
            </h4>
            <p className="text-[15px] text-gray-800 mt-3 leading-relaxed">
              Discover a world of creativity! Create your account today to
              unlock access to our unique models and features.
            </p>
          </div>
          <div>
            <h4 className="text-gray-800 text-lg font-semibold">
              Safe & Easy Registration
            </h4>
            <p className="text-[15px] text-gray-800 mt-3 leading-relaxed">
              Our registration process is quick, simple, and secure. Your
              privacy and data protection are our top priorities.
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
            <div className="mb-6">
              <h3 className="text-gray-800 text-xl font-bold">
                Please check your email for an OTP
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Verification Code
                </label>
                <div className="relative flex items-center mb-4">
                  <input
                    onChange={(event) => {
                      setVerificationCode(event.target.value);
                    }}
                    name="verificationCode"
                    type="text"
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Verification Code"
                  />
                </div>
                {isLoading ? (
                  <span className="cursor-pointer ">Sending ...</span>
                ) : (
                  <span
                    className="cursor-pointer hover:text-yellow-600"
                    onClick={generateEmailOTP}
                  >
                    Re-send OTP
                  </span>
                )}
              </div>
            </div>

            <div className="mt-12 w-full flex justify-center">
              <button
                onClick={handleOnClickVerification}
                type="button"
                className="w-1/2 py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Verify Now
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
              <h3 className="text-gray-800 text-2xl font-bold">
                Create an account
              </h3>
            </div>

            <div className="space-y-6">
              <div className="w-full flex justify-between">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    First name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(event) => {
                        setFirstName(event.target.value);
                      }}
                      name="first-name"
                      type="text"
                      required
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter First Name"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="">
                  <label className="text-gray-800 text-sm mb-2 block">
                    Last name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      onChange={(event) => {
                        setlastName(event.target.value);
                      }}
                      name="last-name"
                      type="text"
                      required
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter Last name"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

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
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
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
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className=" accent-yellow-500 h-4 w-4 rounded"
                  onClick={() => {
                    setIsAgreed(!isAgreed);
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  I accept the
                  <a
                    href="../../t&c"
                    target="_blank"
                    className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <div className="!mt-12">
              <button
                onClick={handleOnClick}
                type="button"
                className="w-full py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Create Account
              </button>
            </div>
            <p className="text-gray-800 text-sm mt-6 text-center">
              Already have an account?
              <a
                onClick={() => navigate("../login", { replace: true })}
                className="cursor-pointer text-black hover:text-black font-semibold hover:underline ml-1"
              >
                Login here
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserRegister;
