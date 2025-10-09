import { loginAdmin, sendEmail } from "@/services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  async function handleOnClick() {
    
    const adminLoginResponse = await loginAdmin({ email, password });
    if (adminLoginResponse?.message === '"email" is not allowed to be empty') {
      setErrorMsg("Please Enter Your Email");
    } else if (
      adminLoginResponse?.message === '"email" must be a valid email'
    ) {
      setErrorMsg("Please Enter a Valid Email");
    } else if (
      adminLoginResponse?.message === '"password" is not allowed to be empty'
    ) {
      setErrorMsg("Please Enter Your Password");
    } else {
      
      if (adminLoginResponse?.success) {
        setErrorMsg(null);
        setSuccessMsg(adminLoginResponse?.message);
        setTimeout(async () => {
          setSuccessMsg(null);

          // Email
          const emailContent =
            '  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
            '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
            "Login Successful Notification" +
            "</div>" +
            '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
            "<p>Hello,</p>" +
            "<p>We noticed a successful login to your Admin Account. If this was you, no further action is required.</p>" +
            "<p>If you did not perform this login, we recommend securing your account immediately by changing your password and reviewing your account activity.</p>" +
            "<p>Thank you for using Critters Territory.</p>" +
            "<p>Best regards,<br>The Critters Territory Team</p>" +
            "</div>" +
            '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
            "&copy; Critters Territory. All rights reserved.<br>" +
            '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
            "</div>" +
            "</div>";

          const sendEmailResponse = await sendEmail({
            toName: "Admin",
            toEmail: email,
            subject: "Admin Login Success",
            emailContent: emailContent,
            replyToEmail: "crittersterritory@gmail.com",
            replyToName: "Critters Territory",
          });
          console.log(sendEmailResponse);
          

          if (sendEmailResponse?.success) {
            navigate("../../admin", { replace: true })
          } else {
            setErrorMsg(sendEmailResponse?.message);
          }

          // Email
        }, 2000);
      } else {
        setSuccessMsg(null);
        if (adminLoginResponse?.message === "Incorrect Password") {
          // Email
          const emailContent =
            '  <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
            '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
            "Login Attempt Alert" +
            "</div>" +
            '<div style="padding: 20px; text-align: center; line-height: 1.6; color: #555;">' +
            "<p>Hello,</p>" +
            "<p>We noticed a failed attempt to log in to your admin account. If this was you, please try again ensuring your credentials are correct.</p>" +
            "<p>If you did not attempt to log in, we recommend updating your password immediately to secure your account.</p>" +
            "<p>Thank you for using Critters Territory.</p>" +
            "<p>Best regards,<br>The Critters Territory Team</p>" +
            "</div>" +
            '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
            "&copy; Critters Territory. All rights reserved.<br>" +
            '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
            "</div>" +
            "</div>";

          const sendPromoEmailResponse = await sendEmail({
            toName: "Admin",
            toEmail: email,
            subject: "Login Failed",
            emailContent: emailContent,
            replyToEmail: "crittersterritory@gmail.com",
            replyToName: "Critters Territory",
          });

          if (sendPromoEmailResponse?.success) {
            setErrorMsg(adminLoginResponse?.message);
          } else {
            setErrorMsg(sendPromoEmailResponse?.message);
          }

          // Email
        } else {
          setErrorMsg(adminLoginResponse?.message)
        }
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
      }
    }
  }

  return (
    <div className="font-[sans-serif]">
      <div className="w-full flex items-center">
        <div className="h-screen min-h-full w-full md:block hidden">
          <img
            src="/src/assets/Site_Images/DALL·E 2025-01-27 16.22.49 - A detailed and vibrant image of various 3D-printed models arranged neatly on a table. The models include a flexible red dragon with wings, a flexi mar.webp"
            className="w-full h-full object-cover"
            alt="login-image"
          />
        </div>

        <div className="h-screen min-h-full w-full flex items-center">
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
              <h3 className="text-gray-800 text-2xl font-bold">Admin Log In</h3>
              <h4 className="text-gray-800 text-lg mt-4">
                Hello Boss, Welcome Back !
              </h4>
            </div>

            <div className="space-y-6">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogIn;
