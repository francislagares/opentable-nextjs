import { RestaurantDetail } from '@/models/restaurant';
import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (
  slug: string,
): Promise<RestaurantDetail> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant;
};

interface Params {
  params: {
    slug: string;
  };
}

const RestaurantDetails = async ({ params }: Params) => {
  const { slug } = params;

  const restaurant = await fetchRestaurantBySlug(slug);

  console.log({ restaurant });

  return (
    <>
      <div className='bg-white w-[70%] rounded p-3 shadow'>
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle name={restaurant.name} />
        <Rating />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews />
      </div>
      <div className='w-[27%] relative text-reg'>
        <ReservationCard />
      </div>
    </>
  );
};

export default RestaurantDetails;
