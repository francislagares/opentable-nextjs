import { PrismaClient } from '@prisma/client';

import Header from '@/app/components/Header';
import RestaurantCard from '@/app/components/RestaurantCard';
import { Restaurant } from '@/app/models/restaurant';

const prisma = new PrismaClient();

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      mainImage: true,
      cuisine: true,
      slug: true,
      location: true,
      price: true,
      reviews: true,
    },
  });

  return restaurants;
};

const Home = async () => {
  const restaurants = await fetchRestaurants();

  return (
    <>
      <Header />
      <div className='py-3 px-36 mt-10 flex flex-wrap justify-center'>
        {restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </>
  );
};

export default Home;
