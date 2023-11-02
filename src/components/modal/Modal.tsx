import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { usePhotoTag } from "../../Context/PhotoTagContext";
import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";

interface ModalPropData {
  mapID: string | undefined;
}

const Modal = ({ mapID }: ModalPropData) => {
  const { state, setInputVal, setSubmitErrorMsg, setSubmitting } =
    usePhotoTag();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.submitErrorMsg?.length) {
      errorRef?.current?.focus();
    }
  }, [state?.submitErrorMsg]);

  useEffect(() => {
    //This will close modal and return to home with escape key
    function keyListener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        navigate("/");
      }
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (state.inputVal.length < 1) {
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

      setSubmitting(false);
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
      <div className='fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-neutral-50 dark:bg-zinc-900 border border-solid border-black rounded-lg z-10 w-4/5 max-w-lg h-auto p-4 shadow-md'>
        {!state.submitting && (
          <>
            <h2 className='text-center my-4 text-4xl'>Congratulations!</h2>
            <div className='w-full flex flex-col items-center justify-center'>
              <div className='text-2xl my-4'>Your time was {state.timer}</div>
              <div>
                <form
                  onSubmit={handleSubmit}
                  className='flex items-start justify-center flex-col gap-2'
                >
                  <label htmlFor='name'>Submit your score:</label>
                  <div className='flex items-center border border-solid bg-neutral-50 border-gray-300 rounded-lg shadow-md pl-3 overflow-hidden'>
                    <input
                      onChange={(e) => setInputVal(e.target.value)}
                      type='text'
                      id='name'
                      placeholder='Name'
                      className='placeholder:text-xl bg-neutral-50 text-zinc-900 outline-none'
                    />
                    <button
                      type='submit'
                      className='py-2 px-4 border-l text-zinc-900 bg-gray-200 border-solid border-gray-300 cursor-pointer disabled:opacity-50 hover:opacity-75 z-10'
                    >
                      Submit
                    </button>
                  </div>
                  <div
                    className='text-red-700 self-center mb-2'
                    aria-live='assertive'
                    ref={errorRef}
                  >
                    {state.submitErrorMsg}
                  </div>
                </form>
              </div>
              <button
                role='link'
                className='cursor-pointer bg-gray-50/50 py-2 px-4 rounded-md border border-solid border-slate-400 hover:opacity-75'
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </div>
          </>
        )}
        {state.submitting && (
          <div
            role='status'
            className='w-full h-full flex items-center justify-center'
            data-testid='loading-animation'
          >
            <svg
              aria-hidden='true'
              className='inline w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}
      </div>
      <div className='overlay'></div>
    </>
  );
};

export default Modal;
