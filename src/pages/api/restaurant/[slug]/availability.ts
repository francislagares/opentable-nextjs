import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { findAvailableTables } from '@/services/findAvailableTables';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided.',
    });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      openTime: true,
      closeTime: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided.',
    });
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return res.json({
      errorMessage: 'Invalid data provided.',
    });
  }

  const availabilities = searchTimesWithTables
    .map(schedule => {
      const sumSeats = schedule.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: schedule.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter(availability => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.openTime}`);

      const timeIsBeforeClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.closeTime}`);

      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

  return res.json(availabilities);
};

export default handler;
