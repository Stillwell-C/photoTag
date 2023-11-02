import loadingImg from "../../assets/loading.jpg";

const LoadingPage = () => {
  return (
    <div className='flex w-full items-center justify-center overflow-hidden'>
      <div className='responsive-card relative p-20'>
        <img
          className='animate-spin-slow rounded-full max-w-full opacity-60 p-2'
          src={loadingImg}
          alt='loading'
        />
        <h2 className='text-3xl 2xs:text-5xl xs:text-6xl sm:text-7xl font-semibold text-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default LoadingPage;
