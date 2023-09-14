import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import Image from 'next/image';
import img1 from '../../public/1.png'
import img2 from '../../public/2.png'
import img3 from '../../public/3.png'
import img4 from '../../public/4.png'

const Slider: React.FC = () => {
  const handleActive = (slide: any, r: any) => {
    // 在这里添加逻辑来逐渐放大幻灯片
    console.log(1111, slide, r)
    r.style.transform = 'scale(1.2)';
  };

  const handleHidden = (slide: any, r: any) => {
    // 在这里添加逻辑来逐渐缩小幻灯片
    console.log(2222, slide, r)
    r.style.transform = 'scale(0.8)';
  };

  return (
    <div className='absolute top-[50%]'>
      <Splide
        options={{
          type: 'loop',
          perPage: 3,
          arrows: false,
          pagination: false,
        }}
        onActive={(e, r) => handleActive(e, r)}
        onHidden={(e, r) => handleHidden(e, r)}
      >
        <SplideSlide key={1}>
          <Image width={100} src={img1} alt="Image 1" />
        </SplideSlide>
        <SplideSlide key={2}>
          <Image width={100} src={img2} alt="Image 2" />
        </SplideSlide>
        <SplideSlide key={3}>
          <Image width={100} src={img3} alt="Image 3" />
        </SplideSlide >
        <SplideSlide key={4}>
          <Image width={100} src={img4} alt="Image 4" />
        </SplideSlide>
      </Splide>
    </div>

  );
};

export default Slider;
