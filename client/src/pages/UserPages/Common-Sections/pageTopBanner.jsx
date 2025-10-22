import PageLoading from "@/pages/PageLoading";
import { getPageTopBanner } from "@/services";
import { useEffect, useState } from "react";

function PageTopBanner() {
  const [isLoading, setIsLoading] = useState(true);
  const [getData, setData] = useState(null);
  const id = 1;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPageTopBanner(id);

        data.length === 0 ? setIsLoading(true) : setIsLoading(false);

        setData(data?.response?.banner[0]);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return isLoading ? null : (
    <div className="flex w-full h-fit fix">
      {getData?.bannerStatus ? (
        <div
          style={{ backgroundColor: getData.color }}
          className=" w-full h-8 flex items-center text-center max-md:flex-col gap-6 text-black px-6 py-0 rounded font-[sans-serif]"
        >
          <p className="text-base flex-1 max-md:text-center">{getData.text}</p>
        </div>
      ) : null}
    </div>
  );
}

export default PageTopBanner;
