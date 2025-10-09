import { useState, React } from "react";
import validator from "validator";
import { sendEmail } from "@/services";

function ContactUs() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [FAQ1, setFAQ1] = useState(false);
  const [FAQ2, setFAQ2] = useState(false);
  const [FAQ3, setFAQ3] = useState(false);
  const [FAQ4, setFAQ4] = useState(false);
  const [FAQ5, setFAQ5] = useState(false);
  const [FAQ6, setFAQ6] = useState(false);
  const [FAQ7, setFAQ7] = useState(false);
  const [FAQ8, setFAQ8] = useState(false);
  const [FAQ9, setFAQ9] = useState(false);
  const [FAQ10, setFAQ10] = useState(false);
  const emailContent =
    "<p>Hello Minindu Dissanayake,</p>" +
    '<p>You got a new message from"' +
    name +
    '":</p>' +
    '<p>Email: "' +
    email +
    '"</p>' +
    '<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">"' +
    message +
    '"</p>' +
    "<p>Best wishes,<br>Critters Territory</p>";

  async function handleOnClick(event) {
    event.preventDefault();

    if (name === null) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter your Name");
    } else if (email === null) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter your Email");
    } else if (!validator.isEmail(email)) {
      setErrorMsg("Please Enter a Valid Email");
    } else if (subject === null) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter your Subject");
    } else if (message === null) {
      setSuccessMsg(null);
      setErrorMsg("Please Enter your Message");
    } else {
      setErrorMsg(null);

      const sendEmailResponse = await sendEmail({
        toName: "Critters Territory",
        toEmail: "crittersterritory@gmail.com",
        subject,
        emailContent: emailContent,
        replyToEmail: email,
        replyToName: name,
      });
      if (sendEmailResponse?.success) {
        setSuccessMsg("Message sent successfully");
      } else {
        setErrorMsg(sendEmailResponse?.message);
      }
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 5000);
  }

  return (
    <div>
      <div className="my-6">
        {successMsg ? (
          <div
            class="p-4 mx-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span class="font-medium">{successMsg}</span>
          </div>
        ) : null}
        {errorMsg ? (
          <div
            class="mx-4 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span class="font-medium">{errorMsg}</span>
          </div>
        ) : null}
        <div className="grid sm:grid-cols-2 items-start gap-12 p-8 mx-auto max-w-4xl bg-white bg-opacity-15 shadow-[0_2px_10px_-3px_rgba(255,255,255,0.5)] rounded-md font-[sans-serif]">
          <div>
            <h1 className="text-gray-100 text-3xl font-bold">Let's Talk</h1>
            <p className="text-sm text-gray-200 mt-4">
              Need assistance or have a project in mind? We're here to help
              bring your ideas to life!
            </p>

            <div className="mt-12">
              <h2 className="text-gray-300 text-base font-bold">Email</h2>
              <ul className="mt-4">
                <li className="flex items-center">
                  <div className="bg-[#e9e9e9] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="#000000"
                      viewBox="0 0 479.058 479.058"
                    >
                      <path
                        d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
                        data-original="#000000"
                      />
                    </svg>
                  </div>
                  <a className="text-gray-300 text-sm ml-4 hover:text-gray-200">
                    <small className="block">Mail</small>
                    <strong>crittersterritory@gmail.com</strong>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-gray-200 text-base font-bold">Socials</h2>

              <ul className="flex mt-4 space-x-4">
                <li>
                  <a
                    href="https://www.facebook.com/crittersterritory"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=" w-10 h-10"
                      viewBox="0 0 49.652 49.652"
                    >
                      <linearGradient
                        id="a"
                        x1="-277.375"
                        x2="-277.375"
                        y1="406.6018"
                        y2="407.5726"
                        gradientTransform="matrix(40 0 0 -39.7778 11115.001 16212.334)"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#0062e0" />
                        <stop offset="1" stopColor="#19afff" />
                      </linearGradient>
                      <path
                        fill="url(#a)"
                        d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z"
                      />
                      <path
                        fill="#fff"
                        d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/crittersterritory/"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-9 h-9 icon flex justify-center items-center"
                    >
                      <circle cx="12" cy="12" r="12" fill="#C13584" />
                      <path
                        fill="white"
                        transform="scale(0.7)"
                        d="M22.3183118,5.0772036939 C23.5358869,5.132773211 24.3775594,5.311686093 25.156489,5.614412318 C25.9357539,5.917263935 26.5259307,6.30117806 27.1124276,6.88767349 C27.6988355,7.47414659 28.0827129,8.06422396 28.3856819,8.84361655 C28.688357,9.62263666 28.8672302,10.46418415 28.9227984,11.68172489 C28.9916356,13.19170553 29,13.72394829 29,16.9999742 C29,20.2760524 28.9916355,20.808302 28.9227954,22.3182896 C28.8672306,23.5358038 28.6883589,24.3773584 28.3855877,25.1566258 C28.0826716,25.9358162 27.6987642,26.5259396 27.1124276,27.1122749 C26.5259871,27.6987804 25.9357958,28.0827198 25.1563742,28.3856323 C24.3772192,28.6883583 23.5357324,28.8672318 22.3183209,28.9227442 C20.8086874,28.9916325 20.2765626,29 17,29 C13.7234374,29 13.1913126,28.9916325 11.6817238,28.9227463 C10.4642608,28.8672314 9.62270711,28.6883498 8.84342369,28.3855738 C8.0641689,28.0827004 7.47399369,27.6987612 6.88762592,27.1123283 C6.30117312,26.525877 5.91721975,25.9357071 5.61431812,25.1563835 C5.31164302,24.3773633 5.13276982,23.5358159 5.07720389,22.3183251 C5.00835294,20.8092887 5,20.2774634 5,16.9999742 C5,13.7225328 5.00835297,13.19071076 5.07720474,11.68165632 C5.13276982,10.46418415 5.31164302,9.62263666 5.61436273,8.84350174 C5.91719061,8.06430165 6.30113536,7.4741608 6.88757245,6.88772514 C7.47399369,6.30123879 8.0641689,5.91729961 8.84345255,5.61441497 C9.62236201,5.31169658 10.4640942,5.13277398 11.6816389,5.07720359 C13.1907487,5.00835222 13.7225257,5 17,5 C20.2774788,5 20.8092594,5.00835235 22.3183118,5.0772036939 Z M17,7.66666667 C13.759595,7.66666667 13.2640071,7.67445049 11.8031993,7.74109814 C10.8761464,7.78341009 10.3195222,7.90172878 9.80947575,8.0999552 C9.37397765,8.2692205 9.09725505,8.4492427 8.77324172,8.773292 C8.44916209,9.0973709 8.26913181,9.3740857 8.09996253,9.8093717 C7.90169965,10.3196574 7.78340891,10.8761816 7.74109927,11.8032171 C7.67445122,13.2639716 7.66666667,13.7596037 7.66666667,16.9999742 C7.66666667,20.2403924 7.67445121,20.7360281 7.74109842,22.1967643 C7.78340891,23.1238184 7.90169965,23.6803426 8.09990404,24.1904778 C8.26914133,24.6259017 8.44919889,24.9026659 8.77329519,25.2267614 C9.09725505,25.5507573 9.37397765,25.7307795 9.80932525,25.8999863 C10.3197152,26.0982887 10.8762119,26.2165784 11.8032391,26.2588497 C13.2646044,26.3255353 13.7605122,26.3333333 17,26.3333333 C20.2394878,26.3333333 20.7353956,26.3255353 22.1968056,26.2588476 C23.123775,26.216579 23.6802056,26.0982995 24.1905083,25.9000309 C24.6260288,25.7307713 24.9027426,25.5507596 25.2267583,25.226708 C25.5507492,24.9027179 25.7308046,24.6259456 25.9000375,24.1906283 C26.0983009,23.6803412 26.2165908,23.1238118 26.2588986,22.196779 C26.3255376,20.7350718 26.3333333,20.2390126 26.3333333,16.9999742 C26.3333333,13.7609867 26.3255376,13.2649338 26.2589016,11.8032357 C26.2165911,10.8761816 26.0983004,10.3196574 25.9001178,9.8095783 C25.7308131,9.3740393 25.550774,9.0972921 25.2267583,8.7732404 C24.9027658,8.4492487 24.6260264,8.2692278 24.1905015,8.0999664 C23.6803988,7.90171817 23.1238378,7.78341062 22.1967608,7.74109868 C20.7359966,7.67445057 20.2404012,7.66666667 17,7.66666667 Z M17,23.2222222 C13.5635616,23.2222222 10.7777778,20.4364384 10.7777778,17 C10.7777778,13.5635616 13.5635616,10.7777778 17,10.7777778 C20.4364384,10.7777778 23.2222222,13.5635616 23.2222222,17 C23.2222222,20.4364384 20.4364384,23.2222222 17,23.2222222 Z M17,20.5555556 C18.9636791,20.5555556 20.5555556,18.9636791 20.5555556,17 C20.5555556,15.0363209 18.9636791,13.44444444 17,13.44444444 C15.0363209,13.44444444 13.4444444,15.0363209 13.4444444,17 C13.4444444,18.9636791 15.0363209,20.5555556 17,20.5555556 Z M23.2222222,12.1111111 C22.4858426,12.1111111 21.8888889,12.7080649 21.8888889,13.4444444 C21.8888889,14.1808238 22.4858426,14.7777778 23.2222222,14.7777778 C23.9586017,14.7777778 24.5555556,14.1808238 24.5555556,13.4444444 C24.5555556,12.7080649 23.9586017,12.1111111 23.2222222,12.1111111 Z"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@CrittersTerritory"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-9 h-9 icon icon-tabler icons-tabler-filled icon-tabler-brand-youtube"
                    >
                      <circle cx="12" cy="12" r="5" fill="#FFFFFF" />

                      <path
                        fill="#FF0000"
                        d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@crittersterritory?lang=en"
                    target="_blank"
                  >
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 48 48"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Icon/Social/tiktok-color"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Group-7"
                          transform="translate(8.000000, 6.000000)"
                        >
                          <circle cx="15" cy="18" r="23" fill="#FFFFFF" />

                          <path
                            d="M29.5248245,9.44576327 C28.0821306,9.0460898 26.7616408,8.29376327 25.6826204,7.25637551 C25.5109469,7.09719184 25.3493143,6.92821224 25.1928245,6.75433469 C23.9066204,5.27833469 23.209151,3.38037551 23.2336408,1.42290612 L17.3560898,1.42290612 L17.3560898,23.7086204 C17.3560898,27.7935184 15.1520082,29.9535184 12.416498,29.9535184 C11.694049,29.9611102 10.9789469,29.8107429 10.3213959,29.5124571 C9.6636,29.2144163 9.07951837,28.7758041 8.60955918,28.2272327 C8.1398449,27.6789061 7.79551837,27.0340898 7.60180408,26.3385796 C7.4078449,25.6430694 7.36890612,24.9132735 7.48743673,24.2008653 C7.60596735,23.4884571 7.87902857,22.8105796 8.28751837,22.2154776 C8.69625306,21.6198857 9.23037551,21.1212735 9.85241633,20.7546612 C10.474702,20.3878041 11.1694776,20.1617633 11.8882531,20.0924571 C12.6070286,20.023151 13.3324163,20.1122939 14.0129878,20.3535184 L14.0129878,14.3584163 C13.4889061,14.2430694 12.9530694,14.1862531 12.416498,14.1894367 L12.3917633,14.1894367 C10.2542939,14.1943347 8.16604898,14.8325388 6.39127347,16.0234776 C4.61649796,17.2149061 3.23429388,18.9051918 2.41976327,20.8812735 C1.60523265,22.8578449 1.39486531,25.0310694 1.8151102,27.1269061 C2.2351102,29.2227429 3.2671102,31.1469061 4.78033469,32.6564571 C6.29380408,34.1660082 8.22066122,35.1933551 10.3174776,35.6082122 C12.4142939,36.0230694 14.5870286,35.8073143 16.561151,34.9878857 C18.5355184,34.1682122 20.2226204,32.7820898 21.409151,31.0041306 C22.5959265,29.2264163 23.2289878,27.136702 23.228498,24.9992327 L23.228498,12.8155592 C25.5036,14.392702 28.2244163,15.134498 31.1289061,15.1886204 L31.1289061,9.68551837 C30.5869469,9.66568163 30.049151,9.5851102 29.5248245,9.44576327"
                            id="Fill-1"
                            fill="#FE2C55"
                          ></path>
                          <path
                            d="M25.195102,6.75428571 C24.7946939,6.47510204 24.4148571,6.1675102 24.0587755,5.83346939 C22.8210612,4.66016327 22.0062857,3.11020408 21.7420408,1.42530612 C21.6622041,0.954367347 21.6220408,0.47755102 21.6220408,0 L15.7444898,0 L15.7444898,22.6408163 C15.7444898,27.5069388 13.5404082,28.5183673 10.804898,28.5183673 C10.0829388,28.5262041 9.36783673,28.3758367 8.71028571,28.0773061 C8.0524898,27.7792653 7.46791837,27.3406531 6.99820408,26.7920816 C6.5282449,26.2437551 6.18440816,25.5989388 5.99044898,24.9034286 C5.7964898,24.2079184 5.75755102,23.4781224 5.87583673,22.7657143 C5.99461224,22.053551 6.26767347,21.3756735 6.67640816,20.7800816 C7.08489796,20.1847347 7.61902041,19.6861224 8.24106122,19.3195102 C8.86334694,18.952898 9.55787755,18.7266122 10.276898,18.6573061 C10.9959184,18.588 11.7208163,18.6773878 12.4016327,18.9183673 L12.4016327,12.9328163 C5.40489796,11.8236735 0,17.4783673 0,23.5760816 C0.00465306122,26.4426122 1.14514286,29.1898776 3.17191837,31.216898 C5.19869388,33.2434286 7.94595918,34.3839184 10.8124898,34.3885714 C16.7730612,34.3885714 21.6220408,30.7444898 21.6220408,23.5760816 L21.6220408,11.3924082 C23.8995918,12.9795918 26.6204082,13.7142857 29.524898,13.7632653 L29.524898,8.26040816 C27.9658776,8.18914286 26.4617143,7.66604082 25.195102,6.75428571"
                            id="Fill-3"
                            fill="#25F4EE"
                          ></path>
                          <path
                            d="M21.6220653,23.5764245 L21.6220653,11.392751 C23.8996163,12.9794449 26.6204327,13.7141388 29.5251673,13.7633633 L29.5251673,9.44581224 C28.0822286,9.04613878 26.7617388,8.29381224 25.6824735,7.25617959 C25.5110449,7.09724082 25.3494122,6.92826122 25.1926776,6.75438367 C24.7922694,6.4752 24.4126776,6.16736327 24.056351,5.83356735 C22.8186367,4.66026122 22.0041061,3.11030204 21.7396163,1.42540408 L17.3730857,1.42540408 L17.3730857,23.7111184 C17.3730857,27.7957714 15.1690041,29.9560163 12.4334939,29.9560163 C11.6569224,29.9538122 10.8918612,29.7681796 10.2005143,29.414302 C9.50941224,29.0601796 8.91186122,28.5476082 8.45635102,27.9182204 C7.49071837,27.3946286 6.72712653,26.5636898 6.2865551,25.5571592 C5.84573878,24.5508735 5.75341224,23.4260571 6.02377959,22.3609959 C6.29390204,21.2959347 6.91177959,20.3516082 7.77896327,19.6771592 C8.64639184,19.0027102 9.71365714,18.6365878 10.8122694,18.6365878 C11.3564327,18.6412408 11.8961878,18.7362612 12.4090041,18.9182204 L12.4090041,14.1894857 C10.304351,14.1921796 8.24647347,14.8093224 6.48786122,15.9657306 C4.72924898,17.1221388 3.3470449,18.7666286 2.51047347,20.6978939 C1.67390204,22.6291592 1.41969796,24.7627102 1.77896327,26.8362612 C2.13822857,28.9098122 3.09553469,30.8334857 4.53308571,32.3704653 C6.36271837,33.6848327 8.55945306,34.3906286 10.8122694,34.3884296 C16.7730857,34.3884296 21.6220653,30.7445878 21.6220653,23.5764245"
                            id="Fill-5"
                            fill="#000000"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <form className="ml-auo space-y-4">
            <input
              onChange={(event) => {
                setName(event.target.value);
              }}
              type="text"
              placeholder="Name"
              className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md py-2.5 px-4 border text-sm outline-none focus:border-yellow-500"
            />
            <input
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              type="email"
              placeholder="Email"
              className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md py-2.5 px-4 border text-sm outline-none focus:border-yellow-500"
            />
            <input
              onChange={(event) => {
                setSubject(event.target.value);
              }}
              type="text"
              placeholder="Subject"
              className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md py-2.5 px-4 border text-sm outline-none focus:border-yellow-500"
            />
            <textarea
              onChange={(event) => {
                const typedMessage = event.target.value;
                const formattedMessage = typedMessage.replace(/\n/g, "<br>");
                setMessage(formattedMessage);
              }}
              placeholder="Message"
              rows="6"
              className="bg-white bg-opacity-10 w-full placeholder:text-gray-300 text-white rounded-md px-4 border text-sm pt-2.5 outline-none focus:border-yellow-500"
            ></textarea>
            <button
              onClick={handleOnClick}
              type="button"
              className="text-black font-bold outline-none focus:outline-transparent focus:outline-none bg-yellow-400 hover:bg-yellow-500 rounded-md text-md px-4 py-2.5 w-full !mt-6 hover:border-yellow-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      {/* #################################################################### */}
      <div className="font-sans divide-y rounded-lg max-w-4xl mx-auto px-4 my-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100">
            Frequently asked questions
          </h2>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ1(!FAQ1);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              Are your products ready-made or made-to-order?
            </span>
            {FAQ1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ1
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              All our items are made-to-order to ensure the highest quality and
              freshness.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ2(!FAQ2);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              How long does it take to fulfill an order?
            </span>
            {FAQ2 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ2
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              We aim to fulfill orders within 1–5 business days. During peak
              seasons or sales events, it may take up to two weeks.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ3(!FAQ3);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">Do you ship internationally?</span>
            {FAQ3 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ3
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Yes, we ship worldwide!
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ4(!FAQ4);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">How long does shipping take?</span>
            {FAQ4 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ4
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              <strong>Regular Shipping:</strong> 25–35 business days <br />
              <strong>Express Shipping:</strong> 1–4 business days
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ5(!FAQ5);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">Can I track my order?</span>
            {FAQ5 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ5
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Yes, we provide tracking information for all shipments so you can
              monitor the progress of your order.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ6(!FAQ6);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              What should I do if there’s an issue with my shipment?
            </span>
            {FAQ6 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ6
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              If you encounter any problems with your shipment, contact us
              immediately at
              <span className="text-white font-semibold">
                crittersterritory@gmail.com
              </span>
              . Please include details about the issue along with photos of the
              shipping box and the received items.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ7(!FAQ7);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">Do you accept returns or exchanges?</span>
            {FAQ7 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ7
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Since our products are made-to-order, we currently do not offer
              returns or exchanges. However, if your item arrives damaged, we’ll
              work with you to resolve the issue.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ8(!FAQ8);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              Do you offer discounts for bulk orders?
            </span>
            {FAQ8 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ8
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Yes! We offer a 10% discount on orders over $50 USD.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ9(!FAQ9);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              What materials are your products made from?
            </span>
            {FAQ9 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ9
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Our 3D printed models are made using high-quality PLA.
            </p>
          </div>
        </div>
        <div
          className="mb-5 border-none"
          onClick={() => {
            setFAQ10(!FAQ10);
          }}
        >
          <button
            type="button"
            className=" focus:outline-none focus:outline-transparent bg-gray-100 bg-opacity-20 hover:bg-opacity-20 hover:bg-gray-200 toggle-button w-full text-base outline-none text-left font-semibold py-6 text-white hover:text-gray-200 border-none flex items-center hover:transition-all hover:scale-[102%] hover:ease-in-out hover:duration-300"
          >
            <span className="mr-4">
              Can I request customizations for my order?
            </span>
            {FAQ10 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus hidden"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 42 42"
                className="w-3 fill-current ml-auto shrink-0"
              >
                <path
                  className="plus"
                  d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                />
                <path d="M37.059 16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5h32.118C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
              </svg>
            )}
          </button>
          <div
            className={
              FAQ10
                ? "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-1000 ease-in-out block"
                : "pb-6 pt-3 px-3 h-full overflow-hidden transition-all duration-300 ease-in-out hidden"
            }
          >
            <p className="text-md text-gray-200 overflow-hidden">
              Customization options depend on the specific product. Feel free to
              contact us to discuss your requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
