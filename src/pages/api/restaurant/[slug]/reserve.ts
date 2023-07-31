import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    return res.json({
      errorMessage: 'Restaurant not found.',
    });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.openTime}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.openTime}`)
  ) {
    res.status(400).json({
      errorMessage: 'Restaurant is not open at that time.',
    });
  }

  return res.json({
    slug,
    day,
    time,
    partySize,
  });
};

export default handler;
