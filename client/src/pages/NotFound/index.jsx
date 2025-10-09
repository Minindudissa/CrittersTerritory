import Footer from "../UserPages/Common-Sections/footer";
import Header from "../UserPages/Common-Sections/header";

function NotFound() {
  return (
    <div className=" bg-gray-900 w-full flex flex-col justify-center items-center">
      <div className=" w-full">
        <Header />
      </div>
      <img
        className=" xl:w-10/12 LG:w-1/2 w-full "
        src="/src/assets/NotFoundPage/DALL·E 2025-01-16 15.07.10 - A whimsical and friendly 404 error page design featuring a cute 3D-style robot sitting on a floating island in space, surrounded by stars. Beside the .webp"
        alt=""
      />
      <div className=" w-full">
        <Footer />
      </div>
    </div>
  );
}

export default NotFound;
