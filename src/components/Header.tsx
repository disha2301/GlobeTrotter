
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center animate-fade-in">
      <div className="text-center">
        <h1 className="font-Monserrat text-[#efefef] text-2xl xl:text-4xl 2xl:text-5xl font-bold xl:leading-[60px] 2xl:leading-[80px]">
          The <span className="text-[#64ff4c]">Globetrotter</span>
          <br />
          The Ultimate Travel Guessing Game! 
        </h1>
      </div>
    </header>
  );
};

export default Header;
