import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { findUserByEmailOrUsername, findUserById, createUser, updateUser, changePassword } from '../models/user';

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
  Id: number,
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

interface PasswordInput {
  User_Id: number,
  CurrentPassword: string;
  Password: string;
  ConfirmPassword: string;
}

export async function registerUserService(input: RegisterInput) {
  const { UserName, FirstName, LastName, Email, Password } = input;
  console.log(input);
  if (!UserName || !Email || !Password || !FirstName || !LastName) {
    throw new Error('Missing required fields');
  }

  const existingUser = await findUserByEmailOrUsername(Email, UserName);
  if (existingUser) {
    throw new Error('Email or Username already exists');
  }

  const hashedPassword = await bcrypt.hash(Password, 10);
  input.Password = hashedPassword;

  const result = await createUser(input);
  return { result }
}

export async function editUserService(input: RegisterInput) {
  const { Id, UserName, FirstName, LastName, Email } = input;

  if (!Id || !UserName || !Email || !FirstName || !LastName) {
    throw new Error('Missing required fields');
  }

  const result = await updateUser(input);
  return {
    user: {
      Id: result?.Id,
      UserName: result?.UserName,
      Email: result?.Email,
      FirstName: result?.FirstName,
      MiddleName: result?.MiddleName,
      LastName: result?.LastName,
    }
  }
}

export async function changePasswordService(input: PasswordInput) {
  const { User_Id, CurrentPassword, Password, ConfirmPassword } = input;
  console.log(input);
  if (!User_Id || !CurrentPassword || !Password || !ConfirmPassword) {
    throw new Error('Missing required fields');
  }

  if (Password !== ConfirmPassword) throw new Error('Password must match confirm password');

  const user = await findUserById(User_Id);
  if (!user) {
    throw new Error('User does not exist');
  }

  const currentPasswordMatch = await bcrypt.compare(CurrentPassword, user.Password);
  if (!currentPasswordMatch) throw new Error('Current password is invalid');

  const oldPasswordMatch = await bcrypt.compare(Password, user.Password);
  if (oldPasswordMatch) throw new Error('Old password cannot be set as new password');

  const hashedPassword = await bcrypt.hash(Password, 10);
  input.Password = hashedPassword;

  await changePassword(User_Id, hashedPassword);
}


export async function loginUserService(input: LoginInput) {
  const { UserName, Password } = input;

  if (!UserName || !Password) {
    throw new Error('Username or Password cannot be blank');
  }

  const user = await findUserByEmailOrUsername("", UserName);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) throw new Error('Password is invalid.');

  const token = jwt.sign(
    { id: user.Id, email: user.Email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  console.log(user.Id);

  return {
    token,
    user: {
      Id: user.Id,
      UserName: user.UserName,
      Email: user.Email,
      FirstName: user.FirstName,
      MiddleName: user.MiddleName,
      LastName: user.LastName,
    }
  }
}