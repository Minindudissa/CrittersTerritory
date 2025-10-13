import { AdminAuthContext } from "@/context/AdminAuthContext";
import { RegisterAdmin, sendEmail } from "@/services";
import { useContext, useEffect, useState } from "react";

function RegisterNewAdmin() {
  const { admin, setAdmin } = useContext(AdminAuthContext);
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [errorMsg1, setErrorMsg1] = useState(null);
  const [successMsg1, setSuccessMsg1] = useState(null);

  useEffect(() => {
    function generateRandomCode() {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      setTempPassword(code);
    } 
    generateRandomCode();
  }, []);

  async function handleRegisterAdminOnSubmit(event) {
    event.preventDefault();
    const RegisterAdminResponse = await RegisterAdmin({
      firstName: "Admin",
      lastName: "Admin",
      email: email,
      password: tempPassword,
    });

    if (RegisterAdminResponse?.success) {
      // Email
      const emailContent =
        '<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; color: #333;">' +
        '<div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">' +
        '<div style="background-color: #ffcc00; color: #000; text-align: center; padding: 20px 10px; font-size: 24px; font-weight: bold;">' +
        "Welcome to the Admin Team!" +
        "</div>" +
        '<div style="padding: 20px; line-height: 1.6; color: #555;">' +
        "<p>Hello,</p>" +
        "<p>Congratulations! You have been selected as an admin for <strong>Critters Territory</strong>. We’re excited to have you join our team and help us grow and manage the platform.</p>" +
        "<p>Here are your login credentials:</p>" +
        '<ul style="list-style-type: none; padding: 0;">' +
        "<li><strong>Email:</strong> " +
        email +
        "</li>" +
        "<li><strong>Password:</strong> " +
        tempPassword +
        "</li>" +
        "</ul>" +
        "<p>Please log in and change your password immediately to ensure the security of your account.</p>" +
        "<p>If you have any questions or need assistance, feel free to reach out to us.</p>" +
        "<p>Thank you for being a part of Critters Territory.</p>" +
        "<p>Best regards,<br>The Critters Territory Team</p>" +
        "</div>" +
        '<div style="background-color: #333; color: #fff; text-align: center; padding: 15px 10px; font-size: 12px;">' +
        "&copy; Critters Territory. All rights reserved.<br>" +
        '<a href="https://www.crittersterritory.com" style="color: #ffcc00; text-decoration: none;">Visit our website</a>' +
        "</div>" +
        "</div>" +
        "</body>";

      const sendPromoEmailResponse = await sendEmail({
        toName: "Admin",
        toEmail: email,
        subject: "Welcome to the Admin - Critters Territory",
        emailContent: emailContent,
        replyToEmail: "crittersterritory@gmail.com",
        replyToName: "Critters Territory",
      });

      if (sendPromoEmailResponse?.success) {
        setErrorMsg1(null);
        setSuccessMsg1("Successfully Registered");
        window.location.reload();
      } else {
        setErrorMsg1(sendPromoEmailResponse?.message);
      }

      // Email
    } else {
      setSuccessMsg1(null);
      setErrorMsg1(
        RegisterAdminResponse?.message.includes(
          '"email" is not allowed to be empty'
        )
          ? "Please Enter Email"
          : RegisterAdminResponse?.message.includes(
                '"email" must be a valid email'
              )
            ? "Please Enter a Valid Email"
            : RegisterAdminResponse?.message
      );
    }
    setTimeout(() => {
      setSuccessMsg1(null);
      setErrorMsg1(null);
    }, 3000);
  }

  return (
    <div className=" w-full h-screen flex flex-col items-center">
      <div className=" w-full flex flex-col justify-center items-center ">
        <svg
          className="w-20 h-20 text-white"
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
            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

        <span className=" font-bold text-[45px] text-white">Admin Register</span>
      </div>

      <div className=" w-full lg:w-2/3 p-4 flex flex-col">
        {successMsg1 ? (
          <div
            className=" w-5/6 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">{successMsg1}</span>
          </div>
        ) : null}
        {errorMsg1 ? (
          <div
            className="w-5/6 p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{errorMsg1}</span>
          </div>
        ) : null}
        <div className="space-y-6">
          <div>
            <label className="text-gray-100 text-sm mb-1 block">Email</label>
            <div className="relative flex items-center">
              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                name="email"
                type="email"
                className="text-white bg-white bg-opacity-15 border outline-none focus:outline-transparent border-white focus:border-yellow-500 w-full text-sm px-4 py-2.5 rounded-md placeholder:text-gray-300"
                placeholder="Enter email"
              />
            </div>
          </div>
        </div>
        <div className=" w-full mt-4 flex justify-center">
          <button
            onClick={handleRegisterAdminOnSubmit}
            type="button"
            className=" py-2 px-4 tracking-wider text-md font-bold  rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none hover:border-transparent"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterNewAdmin;
