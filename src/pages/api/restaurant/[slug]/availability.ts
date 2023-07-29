import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, day, time, partySize } = req.query;

  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage: 'Invalid data provided.',
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
