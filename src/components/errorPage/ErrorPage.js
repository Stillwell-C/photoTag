import "./errorPage.scss";
import errorImg from "../../assets/wrongPage.jpg";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  let errorMessage = "Something went wrong";
  console.log(location?.state);

  if (
    location?.state?.errorCode === "ERR_NETWORK" ||
    location?.state?.errorCode === 500
  ) {
    errorMessage = "Network Error. Please try again later.";
  }
  if (location?.state?.errorCode === 404) {
    errorMessage = "This page does not exist";
  }

  return (
    <div className='errorPage'>
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <img src={errorImg} alt='' />
    </div>
  );
};

export default ErrorPage;
