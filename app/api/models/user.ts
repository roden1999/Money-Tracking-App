import { connectToDB } from '../../lib/db';
import { supabase } from '../../lib/supabase';

export interface User {
    Id: number;
    UserName: string;
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    Email: string;
    Password: string;
    IsDeleted: boolean;
}

const USE_SUPABASE = true; // default MSSQL, set to true to switch to Supabase

// Create a new user
export async function createUser(data: Omit<User, 'Id' | 'IsDeleted'>) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('json_data', JSON.stringify(data))
            .execute('[post_user]');
    } else {
        const { error } = await supabase.rpc('post_user', { json_data: data });
        if (error) throw error;
    }
}

// Update a user
export async function updateUser(data: Omit<User, 'IsDeleted'>): Promise<User | null> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('json_data', JSON.stringify(data))
            .execute('[post_user]');
        return result.recordset[0] || null;
    } else {
        const { data: user, error } = await supabase.rpc('post_user', { json_data: data });
        if (error) throw error;
        return user?.[0] || null;
    }
}

// Find user by Id
export async function findUserById(Id: number): Promise<User | null> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('Id', Id)
            .query<User>(`SELECT * FROM Users WHERE Id = @Id AND IsDeleted = 0`);
        return result.recordset[0] || null;
    } else {
        const { data: user, error } = await supabase
            .from('Users')
            .select('*')
            .eq('Id', Id)
            .eq('IsDeleted', false)
            .limit(1);
        if (error) throw error;
        return user?.[0] || null;
    }
}

// Find user by Email or Username
export async function findUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('Email', email)
            .input('UserName', username)
            .query<User>(
                `SELECT * FROM Users WHERE (Email = @Email OR UserName = @UserName) AND IsDeleted = 0`
            );
        return result.recordset[0] || null;
    } else {
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .or(`Email.eq.${encodeURIComponent(email)},UserName.eq.${encodeURIComponent(username)}`)
            .eq('IsDeleted', false)
            .limit(1);
        console.log('Supabase user data:', data);
        if (error) throw error;
        return data?.[0] || null;
    }
}

// Change user password
export async function changePassword(Id: number, password: string): Promise<void> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('Id', Id)
            .input('Password', password)
            .query(`UPDATE Users SET Password = @Password WHERE Id = @Id AND IsDeleted = 0`);
    } else {
        const { error } = await supabase
            .from('Users')
            .update({ Password: password })
            .eq('Id', Id)
            .eq('IsDeleted', false);
        if (error) throw error;
    }
}
