import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Common-Sections/footer";
import Header from "../Common-Sections/header";
import PageTopBanner from "../Common-Sections/pageTopBanner";
import { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "@/context/UserAuthContext";
import { createPromoCode, searchUser, sendEmail, UpdateUser } from "@/services";

function UserLayout() {
  const { user } = useContext(UserAuthContext);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationBox, setVerificationBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textVisibility, setTextVisibility] = useState(false);
  const navigate = useNavigate();

  async function generateEmailOTP() {
    let chars = "0123456789".split("");
    let result = "";
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * chars.length);
      result += chars[x];
    }
    setIsLoading(true);
    setTextVisibility(false);
    await sendOTP(result);
    setIsLoading(false);
    setTextVisibility(true);
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
          email: user?.email,
          emailVerificationCode: verificationCode,
        },
      });
      if (searchResponse?.success) {
        const localDate = new Date().toLocaleString();
        const updateResponse = await UpdateUser({
          email: user?.email,
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
              toName: user?.firstName + " " + user?.lastName,
              toEmail: user?.email,
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
            window.location.reload();
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
      email: user?.email,
      updateData: { emailVerificationCode: result },
    });

    if (data?.success) {
      const sendEmailResponse = await sendEmail({
        toName: user?.firstName + " " + user?.lastName,
        toEmail: user?.email,
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
    }
  }
  return (
    <div
      className=" w-full h-full"
      style={{
        backgroundImage: "url('/assets/Site_Images/black-370118_1920.png')",
        backgroundSize: "cover", // or 'contain', depending on your need
        backgroundPosition: "center",
        height: "100%", // adjust the height as needed
        width: "100%",
      }}
    >
      <PageTopBanner />
      <Header />
      {user ? (
        user.emailVerifiedDateTime === "" ? (
          <div className=" py-20 w-full flex flex-row justify-center">
            <form className="md:col-span-2 rounded-lg w-3/5 py-20 px-6 sm:px-16 bg-gray-200">
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
              {textVisibility ? (
                <div className="mb-6">
                  <h3 className="text-gray-800 text-xl font-bold">
                    Please check your email for an OTP
                  </h3>
                </div>
              ) : null}

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
                      Send OTP to my email
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
          </div>
        ) : (
          <Outlet />
        )
      ) : (
        <Outlet />
      )}
      <Footer />
    </div>
  );
}

export default UserLayout;
