import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";

const MapSelection = () => {
  const navigate = useNavigate();

  interface Map {
    map_id: string;
    mapname: string;
    imgkey: string;
  }
  type MapData = Map[];

  const [mapImages, setMapImages] = useState<MapData>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const imgURL = (imgkey: string): string =>
    `https://res.cloudinary.com/danscxcd2/image/upload/w_500,c_fill/${imgkey}`;

  useEffect(() => {
    if (!mapImages?.length) getMaps();
  }, []);

  const getMaps = async () => {
    setLoading(true);
    try {
      const { data } = await photoTagApi.get("/map/frontpage");
      setMapImages(data);
      setLoading(false);
    } catch (e) {
      const err = e as AxiosError;
      console.log(err);
      setLoading(false);
      if (err?.response) {
        navigate("/error", {
          state: { errorCode: err?.response?.status },
        });
      } else {
        navigate("/error", {
          state: { errorCode: err?.code },
        });
      }
    }
  };

  const loadingDiv = (key: number) => (
    <div
      className='responsive-card max-h-60 md:max-h-80 relative cursor-pointer flex items-center justify-center h-80'
      key={key}
      data-testid='loading-animation'
    >
      <div className='absolute flex flex-col gap-1 top-0 w-full h-full bg-black/70 z-10 items-center justify-center text-3xl font-semibold text-white rounded-lg '>
        <div role='status'>
          <svg
            aria-hidden='true'
            className='inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
    </div>
  );

  const fourLoadingDivs = [...Array(4)].map((el, i) => loadingDiv(i));

  return (
    <div className='flex flex-col justify-center items-center mb-4'>
      <h2 className='text-5xl font-semibold mb-12'>Map Selection</h2>
      <div className='flex items-start justify-center flex-wrap gap-4 w-full max-w-7xl md:gap-8 md:px-4'>
        {!loading
          ? mapImages?.map((singleMap) => (
              <Link to={`/map/${singleMap?.map_id}`} key={singleMap?.map_id}>
                <div className='responsive-card max-h-80 relative cursor-pointer flex items-center justify-center rounded-lg overflow-hidden group'>
                  <div className='absolute flex top-0 w-full h-full bg-black/70 z-10 items-center justify-center text-3xl font-semibold text-white rounded-lg opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100'>
                    <p>{singleMap?.mapname}</p>
                  </div>
                  <img
                    src={imgURL(singleMap.imgkey)}
                    alt={singleMap.mapname}
                    loading='lazy'
                  />
                </div>
              </Link>
            ))
          : fourLoadingDivs}
        {!loading && mapImages.length <= 0 && (
          <p>No maps found. Please try again later.</p>
        )}
      </div>
    </div>
  );
};

export default MapSelection;
