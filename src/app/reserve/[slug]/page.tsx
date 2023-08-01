import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

import { Params } from '@/app/types/params';

import Form from './components/Form';
import Header from './components/Header';

export const generateMetadata = ({ params }: Params) => {
  const { slug } = params;

  return {
    title: `${slug} | OpenTable`,
  };
};

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};

const Reserve = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) => {
  const { slug } = params;
  console.log(searchParams);

  const restaurant = await fetchRestaurantBySlug(slug);

  return (
    <div className='border-t h-screen'>
      <div className='py-9 w-3/5 m-auto'>
        <Header
          image={restaurant.mainImage}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form />
      </div>
    </div>
  );
};

export default Reserve;
