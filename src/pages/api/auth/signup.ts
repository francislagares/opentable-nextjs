import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { setCookie } from 'cookies-next';
import * as jose from 'jose';
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

    validationSchema.forEach(check => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

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

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 });

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(400).json({ errorMessage: 'Unknown endpoint' });
};

export default handler;
