import { PrismaClient, Table } from '@prisma/client';
import { NextApiResponse } from 'next';

import { schedules } from '@/data';

const prisma = new PrismaClient();

interface Params {
  time: string;
  day: string;
  res: NextApiResponse;
  restaurant: {
    tables: Table[];
    openTime: string;
    closeTime: string;
  };
}

export const findAvailableTables = async ({
  time,
  day,
  res,
  restaurant,
}: Params) => {
  const searchTimes = schedules.find(schedule => schedule.time === time)
    ?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided.',
    });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      bookingTime: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      numberOfPeople: true,
      bookingTime: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach(booking => {
    bookingTablesObj[booking.bookingTime.toISOString()] = booking.tables.reduce(
      (obj, table) => {
        return {
          ...obj,
          [table.tableId]: true,
        };
      },
      {},
    );
  });

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map(searchTime => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach(time => {
    time.tables = time.tables.filter(table => {
      if (bookingTablesObj[time.date.toISOString()]) {
        if (bookingTablesObj[time.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
