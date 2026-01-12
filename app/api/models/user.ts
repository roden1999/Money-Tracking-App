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

// Create a new user
export async function createUser(data: Omit<User, 'Id' | 'IsDeleted'>) {
    const pool = await connectToDB();
    await pool
        .request()
        .input('json_data', JSON.stringify(data))
        .execute('[post_user]');
}

// Update a new user
export async function updateUser(data: Omit<User, 'IsDeleted'>): Promise<User | null> {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('json_data', JSON.stringify(data))
        .execute('[post_user]');

    return result.recordset[0];
}

//Check username by Id
export async function findUserById(Id: number): Promise<User | null> {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input("Id", Id)
        .query<User>(
            `SELECT * FROM Users WHERE Id = @Id AND IsDeleted = 0`
        );

    return result.recordset[0] || null;
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

// Check if email or username already exists
export async function changePassword(Id: number, password: string): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', Id)
        .input('Password', password)
        .query<User>(
            `UPDATE Users SET Password = @Password WHERE Id = @Id AND IsDeleted = 0`
        );
}