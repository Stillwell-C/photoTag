import "./errorPage.scss";
import errorImg from "../../assets/wrongPage.jpg";

const ErrorPage = () => {
  return (
    <div className='errorPage'>
      <h2>Error. This page does not exist</h2>
      <img src={errorImg} alt='Error. This page does not exist.' />
    </div>
  );
};

export default ErrorPage;
