import React from "react";
import { Link } from "react-router-dom";

import cityMap from "../../assets/waldoCity.jpg";
import snowMap from "../../assets/waldoSnow.jpg";
import deptMap from "../../assets/waldoDeptStore.jpg";
import musketeersMap from "../../assets/waldoMusketeers.jpg";
import "./mapSelection.scss";

const MapSelection = () => {
  return (
    <div className='container'>
      <h2>Map Selection</h2>
      <div className='mapList'>
        <div className='mapLine'>
          <Link to='/map/cityMap'>
            <div className='singleMap'>
              <div className='mapText'>
                <p>City</p>
              </div>
              <img src={cityMap} alt='City map' />
            </div>
          </Link>
          <Link to='/map/snowMap'>
            <div className='singleMap'>
              <div className='mapText'>
                <p>Ski Slope</p>
              </div>
              <img src={snowMap} alt='Ski slope map' />
            </div>
          </Link>
        </div>

        <div className='mapLine'>
          <Link to='/map/deptMap'>
            <div className='singleMap'>
              <div className='mapText'>
                <p>Department Store</p>
              </div>
              <img src={deptMap} alt='Department store map' />
            </div>
          </Link>
          <Link to='/map/musketeersMap'>
            <div className='singleMap'>
              <div className='mapText'>
                <p>Swashbuckling Musketeers</p>
              </div>
              <img src={musketeersMap} alt='Swashbuckling musketeers map' />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapSelection;
