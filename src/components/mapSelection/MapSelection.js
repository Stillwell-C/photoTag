import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import loadingImg from "../../assets/waldoCharLoading.jpg";
import "./mapSelection.scss";
import { getURL } from "../../firebase";
import { WaldoInfoContext } from "../../DataContext";

const MapSelection = () => {
  const { waldoInfo } = useContext(WaldoInfoContext);

  const [mapImages, setMapImages] = useState(null);
  const [mapArr, setmapArr] = useState([1, 2, 3, 4]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const cityMap = await getURL(waldoInfo.images.waldoCity);
        const snowMap = await getURL(waldoInfo.images.waldoSnow);
        const deptMap = await getURL(waldoInfo.images.waldoDeptStore);
        const musketeersMap = await getURL(waldoInfo.images.waldoMusketeers);
        setMapImages({
          cityMap: {
            map: cityMap,
            alt: waldoInfo.imgAltText.waldoCity,
            mapName: "City",
          },
          snowMap: {
            map: snowMap,
            alt: waldoInfo.imgAltText.waldoSnow,
            mapName: "Ski slope",
          },
          deptMap: {
            map: deptMap,
            alt: waldoInfo.imgAltText.waldoDeptStore,
            mapName: "Department Store",
          },
          musketeersMap: {
            map: musketeersMap,
            alt: waldoInfo.imgAltText.waldoMusketeers,
            mapName: "Swashbuckling Musketeers",
          },
        });
        setmapArr(["cityMap", "snowMap", "deptMap", "musketeersMap"]);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (waldoInfo !== null) getImages();
  }, [waldoInfo]);

  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        {mapImages
          ? mapArr.map((mapKey) => (
              <Link to={`/map/${mapKey}`} key={mapKey}>
                <div className='singleMap'>
                  <div className='mapText'>
                    <p>{mapImages[`${mapKey}`]["mapName"]}</p>
                  </div>
                  <img
                    src={mapImages[`${mapKey}`]["map"]}
                    alt={mapImages[`${mapKey}`]["alt"]}
                  />
                </div>
              </Link>
            ))
          : mapArr.map((el) => (
              <div className='singleMap loading' key={el}>
                <div className='loadingText'>
                  <p>Loading</p>
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
