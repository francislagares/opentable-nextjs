import Description from './components/Description';
import Images from './components/Images';
import Rating from './components/Rating';
import ReservationCard from './components/ReservationCard';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import Reviews from './components/Reviews';

export const metadata = {
  title: 'Milestones Grill | OpenTable',
};

const RestaurantDetails = () => {
  return (
    <>
      <div className='bg-white w-[70%] rounded p-3 shadow'>
        <RestaurantNavBar />
        <RestaurantTitle />
        <Rating />
        <Description />
        <Images />
        <Reviews />
      </div>
      <div className='w-[27%] relative text-reg'>
        <ReservationCard />
      </div>
    </>
  );
};

export default RestaurantDetails;
