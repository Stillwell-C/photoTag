import loadingImg from "../../assets/loading.jpg";
import "./loadingPage.scss";

const LoadingPage = () => {
  return (
    <div className='loadingContainer'>
      <div className='loadingDiv'>
        <img src={loadingImg} alt='loading' />
        <h2 className='loadingText'>Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingPage;
