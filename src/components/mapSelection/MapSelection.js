import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";

import cityMap from "../../assets/waldoCity.jpg";
import snowMap from "../../assets/waldoSnow.jpg";
import deptMap from "../../assets/waldoDeptStore.jpg";
import musketeersMap from "../../assets/waldoMusketeers.jpg";
import loadingImg from "../../assets/waldoCharLoading.jpg";
import "./mapSelection.scss";
import { storage } from "../../firebase";
import { WaldoInfoContext } from "../../DataContext";

const MapSelection = () => {
  const { waldoInfo, setWaldoInfo } = useContext(WaldoInfoContext);

  const [mapImages, setMapImages] = useState(null);

  useEffect(() => {
    const getImages = async () => {
      try {
        const cityMap = await getDownloadURL(
          ref(storage, waldoInfo.images.waldoCity)
        );
        const snowMap = await getDownloadURL(
          ref(storage, waldoInfo.images.waldoSnow)
        );
        const deptMap = await getDownloadURL(
          ref(storage, waldoInfo.images.waldoDeptStore)
        );
        const musketeersMap = await getDownloadURL(
          ref(storage, waldoInfo.images.waldoMusketeers)
        );
        setMapImages({
          cityMap: cityMap,
          snowMap: snowMap,
          deptMap: deptMap,
          musketeersMap: musketeersMap,
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (waldoInfo !== null) getImages();
  }, [waldoInfo]);

  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        <div className='mapLine'>
          {mapImages ? (
            <Link to='/map/cityMap'>
              <div className='singleMap'>
                <div className='mapText'>
                  <p>City</p>
                </div>
                <img src={mapImages.cityMap} alt='City map' />
              </div>
            </Link>
          ) : (
            <div className='singleMap loading'>
              <div className='singleMap'>
                <div className='loadingText'>
                  <p>Loading</p>
                </div>
                <img src={loadingImg} alt='loading placeholder' />
              </div>
            </div>
          )}
          {mapImages ? (
            <Link to='/map/snowMap'>
              <div className='singleMap'>
                <div className='mapText'>
                  <p>Ski Slope</p>
                </div>
                <img src={mapImages.snowMap} alt='Ski slope map' />
              </div>
            </Link>
          ) : (
            <div className='singleMap loading'>
              <div className='singleMap'>
                <div className='loadingText'>
                  <p>Loading</p>
                </div>
                <img src={loadingImg} alt='loading placeholder' />
              </div>
            </div>
          )}
        </div>

        <div className='mapLine'>
          {mapImages ? (
            <Link to='/map/deptMap'>
              <div className='singleMap'>
                <div className='mapText'>
                  <p>Department Store</p>
                </div>
                <img src={mapImages.deptMap} alt='Department store map' />
              </div>
            </Link>
          ) : (
            <div className='singleMap loading'>
              <div className='singleMap'>
                <div className='loadingText'>
                  <p>Loading</p>
                </div>
                <img src={loadingImg} alt='loading placeholder' />
              </div>
            </div>
          )}
          {mapImages ? (
            <Link to='/map/musketeersMap'>
              <div className='singleMap'>
                <div className='mapText'>
                  <p>Swashbuckling Musketeers</p>
                </div>
                <img
                  src={mapImages.musketeersMap}
                  alt='Swashbuckling musketeers map'
                />
              </div>
            </Link>
          ) : (
            <div className='singleMap loading'>
              <div className='singleMap'>
                <div className='loadingText'>
                  <p>Loading</p>
                </div>
                <img src={loadingImg} alt='loading placeholder' />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSelection;
