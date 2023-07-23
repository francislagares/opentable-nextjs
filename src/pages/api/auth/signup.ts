import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, city, password } = req.body;
    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'First name is invalid.',
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'Last name is invalid.',
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid.',
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid.',
      },
      {
        valid: validator.isLength(city, {
          min: 1,
        }),
        errorMessage: 'City is invalid.',
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough.',
      },
    ];

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: 'Email is associated with another account.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    validationSchema.forEach(check => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        city,
        email,
        phone,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      user,
    });
  }
};

export default handler;
