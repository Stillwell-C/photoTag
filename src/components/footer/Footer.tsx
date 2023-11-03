import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const gameDisplay = location.pathname.includes("/map/");

  return (
    <footer
      className={`w-full h-8 items-center justify-center mt-auto  ${
        gameDisplay ? "hidden lg:flex" : "flex"
      }`}
    >
      <a href='https://github.com/Stillwell-C/'>Stillwell-C</a>
    </footer>
  );
};

export default Footer;
