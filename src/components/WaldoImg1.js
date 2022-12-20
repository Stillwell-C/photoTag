import React, { useEffect, useState, useRef } from "react";
import image1 from "../assets/WaldoBanner.jpg";
import "./waldoImg1.scss";

const WaldoImg1 = () => {
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  const picRef = useRef(null);

  useEffect(() => {
    setHeight(picRef.current.clientHeight);
    setWidth(picRef.current.clientWidth);
  }, []);

  const handleClickCoord = (e) => {
    const rect = e.target.getBoundingClientRect();
    const rectRatio = rect.width / 100;
    console.log(rect);
    console.log(
      `Attempt: X: ${(e.clientX - rect.left) / rectRatio} Y: ${
        (e.clientY - rect.top) / rectRatio
      }`
    );
    // console.log(
    //   `offset X: ${e.target.offsetLeft}, Y: ${e.target.offsetTop}`,
    //   `page X: ${e.pageX} Y: ${e.pageY}`,
    //   `client X: ${e.clientX} Y: ${e.clientY}`
    // );
  };
  return (
    <div className='imgDiv'>
      <img
        ref={picRef}
        src={image1}
        alt='Large crowd with waldo among them'
        onClick={handleClickCoord}
        id='waldoPic'
      />
    </div>
  );
};

export default WaldoImg1;
