import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import photoTagApi from "../../app/api/photoTagApi";

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
      console.log(data);
    } catch (err) {
      setLoading(false);
      navigate("/error");
    }

    // const mapLoadList = waldoInfo.mapLoadList;
    // const mapArr = [];
    // for (let mapName of mapLoadList) {
    //   try {
    //     const URL = await getURL(waldoInfo.images[mapName].storageRef);
    //     mapArr.push({ ...waldoInfo.images[mapName], mapURL: URL });
    //   } catch (err) {
    //     console.log(err.message);
    //   }
    // }
    // // console.log(mapArr);
    // setMapImages(mapArr);
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

  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        {!loading
          ? mapImages.map((singleMap) => (
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
          : Array(4).map((el, i) => loadingDiv(i))}
      </div>
    </div>
  );
};

export default MapSelection;
