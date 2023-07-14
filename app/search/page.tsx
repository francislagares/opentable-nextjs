import { PrismaClient } from '@prisma/client';

import Header from '@/components/Header';
import { SearchParams } from '@/types/searchParams';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';

const prisma = new PrismaClient();

const fetchRestaurantByCity = (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    mainImage: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!city) return prisma.restaurant.findMany({ select });

  return prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

const Search = async ({ searchParams }: { searchParams: SearchParams }) => {
  const restaurants = await fetchRestaurantByCity(searchParams.city);
  const location = await fetchLocations();
  const cuisine = await fetchCuisines();

  return (
    <>
      <Header />
      <div className='flex py-4 m-auto w-2/3 justify-between items-start'>
        <SearchSideBar
          locations={location}
          cuisines={cuisine}
          searchParams={searchParams}
        />
        <div className='w-5/6'>
          {restaurants.length ? (
            <>
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </>
          ) : (
            <p>Sorry, we found no restaurants in this area.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
