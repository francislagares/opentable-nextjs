import { NextApiRequest, NextApiResponse } from 'next';

import { schedules } from '@/data';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, day, time, partySize } = req.query;

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

  return res.json({
    searchTimes,
  });
};

export default handler;
