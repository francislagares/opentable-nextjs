import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { schedules } from '@/data';

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
