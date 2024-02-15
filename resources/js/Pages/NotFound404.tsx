import '../../css/global.css';
import React from 'react';

const NotFound404: React.FC = () => {
  return (
    <div className="vh-full flex items-start justify-center text-center bg-cover bg-no-repeat bg-center"
         style={{ backgroundImage: 'url("/images/404.png")', paddingTop: '10vh' }}>

      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>

      <div className="z-10 relative p-4 text-white">
        <h1 className="text-[100px] font-bold animated-gradient-text">Oops! Page not found.</h1>
        <p className='text-[30px] animated-gradient-text-2'>The page you're looking for doesn't seem to exist.</p>
      </div>
    </div>
  );
}

export default NotFound404;



/* 
import '../../css/global.css';
import React from 'react';

const NotFound404: React.FC = () => {
  return (
    <div className="vh-full flex items-center justify-center text-center relative">
      
      <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none">
        <source src="/images/404_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black opacity-25"></div>
      
      <div className="z-10 relative p-4 text-white">
        <h1 className="text-[100px] font-bold animated-gradient-text">Oops! Page not found.</h1>
        <p className='text-[30px] animated-gradient-text-2'>The page you're looking for doesn't seem to exist.</p>
      </div>
    </div>
  );
}

export default NotFound404; */
