import NavBar from '@/app/components/NavBar';

import Description from './components/Description';
import Header from './components/Header';
import Images from './components/Images';
import Rating from './components/Rating';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import Reviews from './components/Reviews';

const RestaurantDetails = () => {
  return (
    <main className='bg-gray-100 min-h-screen w-screen'>
      <main className='max-w-screen-2xl m-auto bg-white'>
        <NavBar />
        <Header />
        {/* DESCRIPTION PORTION */}
        <div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
          <div className='bg-white w-[70%] rounded p-3 shadow'>
            <RestaurantNavBar />
            <RestaurantTitle />
            <Rating />
            <Description />
            <Images />
            <Reviews />
          </div>
          <div className='w-[27%] relative text-reg'></div>
        </div>
        {/* DESCRIPTION PORTION */} {/* RESERVATION CARD PORTION */}{' '}
        {/* RESERVATION
    CARD PORTION */}
      </main>
    </main>
  );
};

export default RestaurantDetails;
