import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";

import "./mapSelection.scss";

const MapSelection = () => {
  const navigate = useNavigate();

  interface Map {
    _id: string;
    mapName: string;
    imgKey: string;
  }
  type MapData = Map[];

  const [mapImages, setMapImages] = useState<MapData>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const imgURL = (imgKey: string): string =>
    `https://res.cloudinary.com/danscxcd2/image/upload/w_500,c_fill/${imgKey}`;

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
      className='singleMap loading'
      key={key}
      data-testid='loading-animation'
    >
      <div className='loadingText'>
        <div className='lds-ring'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );

  const fourLoadingDivs = [...Array(4)].map((el, i) => loadingDiv(i));

  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        {!loading
          ? mapImages?.map((singleMap) => (
              <Link to={`/map/${singleMap?._id}`} key={singleMap?._id}>
                <div className='singleMap'>
                  <div className='mapText'>
                    <p>{singleMap?.mapName}</p>
                  </div>
                  <img
                    src={imgURL(singleMap.imgKey)}
                    alt={singleMap.mapName}
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
