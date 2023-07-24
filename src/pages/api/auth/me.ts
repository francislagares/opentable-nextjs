import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const bearerToken = req.headers['authorization'] as string;
  const token = bearerToken.split(' ')[1];
  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return res.status(401).json({ errorMessage: 'Unauthorized request.' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  return res.json({ user });
};

export default handler;
