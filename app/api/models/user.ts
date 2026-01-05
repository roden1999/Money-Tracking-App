import sql from 'mssql';
import { connectToDB } from '../../lib/db';

export interface User {
    Id: number;
    UserName: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    Password: string;
    IsDeleted: boolean;
}

// Check if email or username already exists
export async function findUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('Email', email)
        .input('UserName', username)
        .query<User>(
            `SELECT * FROM Users WHERE (Email = @Email OR UserName = @UserName) AND IsDeleted = 0`
        );

    return result.recordset[0] || null;
}

// Create a new user
export async function createUser(user: Omit<User, 'Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('UserName', user.UserName)
        .input('FirstName', user.FirstName)
        .input('MiddleName', user.MiddleName || '')
        .input('LastName', user.LastName || '')
        .input('Email', user.Email)
        .input('Password', user.Password)
        .query(
            `INSERT INTO Users (UserName, FirstName, MiddleName, LastName, Email, Password, IsDeleted)
       VALUES (@UserName, @FirstName, @MiddleName, @LastName, @Email, CONVERT(VARBINARY(MAX), @Password), 0)`
        );
}
