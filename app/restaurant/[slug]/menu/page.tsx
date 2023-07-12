import { Params } from '@/types/params';
import { PrismaClient } from '@prisma/client';
import Menu from '../components/Menu';
import RestaurantNavBar from '../components/RestaurantNavBar';

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant.items;
};

export const generateMetadata = ({ params }: Params) => {
  const { slug } = params;

  return {
    title: `${slug} | OpenTable`,
  };
};

const RestaurantMenu = async ({ params }: Params) => {
  const { slug } = params;

  const menu = await fetchRestaurantMenu(slug);
  console.log(menu);
  return (
    <div className='bg-white w-[100%] rounded p-3 shadow'>
      <RestaurantNavBar slug={slug} />
      <Menu menu={menu} />
    </div>
  );
};

export default RestaurantMenu;
