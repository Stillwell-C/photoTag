import "./errorPage.scss";
import errorImg from "../../assets/wrongPage.jpg";
import { useLocation } from "react-router-dom";

interface StateData {
  errorCode: string | number;
}

const ErrorPage = () => {
  const location = useLocation();
  const state: StateData = location?.state;
  let errorMessage: string = "Something went wrong";

  if (state?.errorCode === "ERR_NETWORK" || state?.errorCode === 500) {
    errorMessage = "Network Error. Please try again later.";
  }
  if (state?.errorCode === 404) {
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
