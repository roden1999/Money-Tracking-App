import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { findUserByEmailOrUsername, createUser } from '../models/user';

export function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // { id, email, iat, exp }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return null;
  }
}

interface RegisterInput {
  UserName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Email: string;
  Password: string;
}

interface LoginInput {
  UserName: string;
  Password: string;
}

export async function registerUserService(input: RegisterInput) {
  const { UserName, FirstName, MiddleName, LastName, Email, Password } = input;
  console.log(input);
  if (!UserName || !Email || !Password) {
    throw new Error('Missing required fields');
  }

  const existingUser = await findUserByEmailOrUsername(Email, UserName);
  if (existingUser) {
    throw new Error('Email or Username already exists');
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const result = await createUser(input);
  return { result }
}

export async function loginUserService(input: LoginInput) {
  const { UserName, Password } = input;

  if (!UserName || !Password) {
    throw new Error('Username or Password cannot be blank')
  }

  const user = await findUserByEmailOrUsername("", UserName);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) if (!user) throw new Error('Password is invalid.');

  const token = jwt.sign(
    { id: user.Id, email: user.Email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  console.log(user.Id);

  return {
    token,
    user: {
      id: user.Id,
      UserName: user.UserName,
      Email: user.Email,
    }
  }
}