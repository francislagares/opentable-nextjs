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

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided.',
    });
  }

  const searchTimeWithTables = searchTimesWithTables.find(schedule => {
    return (
      schedule.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    );
  });

  if (!searchTimeWithTables) {
    return res.status(400).json({
      errorMessage: 'No availability, cannot book.',
    });
  }

  const tablesCount: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  searchTimeWithTables.tables.forEach(table => {
    if (table.seats === 2) {
      tablesCount[2].push(table.id);
    } else {
      tablesCount[4].push(table.id);
    }
  });

  const tablesToBooks: number[] = [];
  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4].length) {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      } else {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      }
    } else {
      if (tablesCount[2].length) {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      } else {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      }
    }
  }

  return res.json({
    tablesCount,
  });
};

export default handler;
