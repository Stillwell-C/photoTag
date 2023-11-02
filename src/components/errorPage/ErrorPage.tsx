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
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-4xl font-semibold'>Error</h2>
      <p className='text-xl'>{errorMessage}</p>
      <img className='animate-side-to-side max-w-60' src={errorImg} alt='' />
    </div>
  );
};

export default ErrorPage;
