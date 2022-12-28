import loadingImg from "../../assets/loading.jpg";
import "./loadingPage.scss";

const LoadingPage = () => {
  return (
    <div className='loadingContainer'>
      <div className='loadingDiv'>
        <img src={loadingImg} alt='Waldo for loading screen' />
        <p className='loadingText'>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
