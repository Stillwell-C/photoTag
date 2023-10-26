import { Link, useNavigate } from "react-router-dom";
import "./modal.scss";
import { useEffect, useRef } from "react";
import { usePhotoTag } from "../../Context/PhotoTagContext";
import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";

interface ModalPropData {
  mapID: string | undefined;
}

const Modal = ({ mapID }: ModalPropData) => {
  const errorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { state, setInputVal, setSubmitErrorMsg, setSubmitting } =
    usePhotoTag();

  useEffect(() => {
    if (state.submitErrorMsg.length) {
      errorRef?.current?.focus();
    }
  }, [state.submitErrorMsg]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!state.inputVal.length) {
      setSubmitErrorMsg("Error. Please input a name");
      return;
    }
    if (state.inputVal.length >= 20) {
      setSubmitErrorMsg("Error. Please input a name 20 characters or less");
      return;
    }
    try {
      setSubmitErrorMsg("");
      setSubmitting(true);

      await photoTagApi.post(`/leaderboard`, {
        playerName: state.inputVal,
        seconds: state.seconds,
        timer: state.timer,
        mapID,
      });
      navigate("/");
    } catch (e) {
      const err = e as AxiosError;
      setSubmitting(false);
      setSubmitErrorMsg("Submission error. Please try again.");
      console.log(err.message);
    }
  };

  return (
    <>
      <div className='modalContainer'>
        {!state.submitting && (
          <>
            <div className='modalHeader'>Congratulations!</div>
            <div className='modalBody'>
              <div className='modalInfo'>Your time was {state.timer}</div>
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
                    <button type='submit' disabled={!state.inputVal.length}>
                      Submit
                    </button>
                  </div>
                  <div className='errorMsg' ref={errorRef}>
                    {state.submitErrorMsg}
                  </div>
                </form>
              </div>
              <button
                role='link'
                className='homeButton'
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </div>
          </>
        )}
        {state.submitting && (
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
