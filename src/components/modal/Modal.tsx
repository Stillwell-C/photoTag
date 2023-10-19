import { Link } from "react-router-dom";
import "./modal.scss";

interface ModalPropData {
  timer: string;
  disableSubmit: boolean;
  submitErrorMsg: string;
  submitting: boolean;
  handleInput: (e: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Modal = ({
  timer,
  handleInput,
  handleSubmit,
  disableSubmit,
  submitErrorMsg,
  submitting,
}: ModalPropData) => {
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
                      onChange={(e) => handleInput(e.target.value)}
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
