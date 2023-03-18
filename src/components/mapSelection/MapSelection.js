import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./mapSelection.scss";
import { getURL } from "../../firebase";
import { WaldoInfoContext } from "../../DataContext";

const MapSelection = () => {
  const { waldoInfo } = useContext(WaldoInfoContext);

  const [mapImages, setMapImages] = useState(null);
  const [loadingArr, setLoadingArr] = useState([1, 2, 3, 4]);

  useEffect(() => {
    if (waldoInfo !== null) getMaps();
  }, [waldoInfo]);

  const getMaps = async () => {
    const mapLoadList = waldoInfo.mapLoadList;
    const mapArr = [];
    for (let mapName of mapLoadList) {
      try {
        const URL = await getURL(waldoInfo.images[mapName].storageRef);
        mapArr.push({ ...waldoInfo.images[mapName], mapURL: URL });
      } catch (err) {
        console.log(err.message);
      }
    }
    setMapImages(mapArr);
  };

  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        {mapImages
          ? mapImages.map((singleMap) => (
              <Link to={`/map/${singleMap.id}`} key={singleMap.id}>
                <div className='singleMap'>
                  <div className='mapText'>
                    <p>{singleMap.name}</p>
                  </div>
                  <img
                    src={singleMap.mapURL}
                    alt={singleMap.altText}
                    loading='lazy'
                  />
                </div>
              </Link>
            ))
          : loadingArr.map((el) => (
              <div
                className='singleMap loading'
                key={el}
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
            ))}
      </div>
    </div>
  );
};

export default MapSelection;
