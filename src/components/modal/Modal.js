import { Link } from "react-router-dom";
import "./modal.scss";

const Modal = ({
  timer,
  handleSubmit,
  setInputVal,
  disableSubmit,
  submitErrorMsg,
  submitting,
}) => {
  return (
    <>
      <div className='modalContainer'>
        {!submitting && (
          <>
            <div className='modalHeader'>Congratulations!</div>
            <div className='modalBody'>
              <div className='modalInfo'>Your time was {timer}</div>
              <div className='modalForm'>
                <form onSubmit={handleSubmit}>
                  <label htmlFor='name'>Submit your score:</label>
                  <div className='inputDiv'>
                    <input
                      onChange={(e) => setInputVal(e.target.value)}
                      type='text'
                      id='name'
                      placeholder='Name'
                    />
                    <button type='submit' disabled={disableSubmit}>
                      Submit
                    </button>
                  </div>
                  <div className='errorMsg'>{submitErrorMsg}</div>
                </form>
              </div>
              <Link to='/'>
                <button className='homeButton'>Back to home</button>
              </Link>
            </div>
          </>
        )}
        {submitting && (
          <div className='loadingDiv'>
            <div className='lds-default' data-testid='loading-animation'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
      <div className='overlay'></div>
    </>
  );
};

export default Modal;
