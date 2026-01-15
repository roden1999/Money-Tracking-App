import { connectToDB } from '../../lib/db';
import { supabase } from '../../lib/supabase';

export interface Wallet {
    Id: number | null;
    User_Id: number;
    Name: string;
    Description: string;
    Currency: string;
    Balance: number;
    Date: Date;
    IsDeleted: boolean;
}

interface SearchedData {
    Ids?: number[];
    User_Id: number;
}

const USE_SUPABASE = true; // default MSSQL, set to true to switch to Supabase

// Add wallet
export async function addWallet(wallet: Omit<Wallet, 'Id' | 'IsDeleted'>): Promise<void> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('json_data', JSON.stringify(wallet))
            .execute('[post_wallet]');
    } else {
        const { error } = await supabase.rpc('post_wallet', { json_data: wallet });
        if (error) throw error;
    }
}

// Options for react-select
export async function optionsWallet(Id: number) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('Id', Id)
            .query<Wallet>(`SELECT * FROM Wallets WHERE User_Id = @Id AND IsDeleted = 0`);
        return result.recordset;
    } else {
        const { data, error } = await supabase
            .from('Wallets')
            .select('*')
            .eq('User_Id', Id)
            .eq('IsDeleted', false);
        if (error) throw error;
        return data;
    }
}

// List wallets
export async function listWallet(data: SearchedData) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('json_data', JSON.stringify(data))
            .execute('[get_wallets]');
        return result.recordset;
    } else {
        const { data: wallets, error } = await supabase.rpc('get_wallets', { json_data: data });
        if (error) throw error;
        return wallets;
    }
}

// Edit wallet
export async function editWallet(wallet: Omit<Wallet, 'Date' | 'IsDeleted'>): Promise<void> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('json_data', JSON.stringify(wallet))
            .execute('[post_wallet]');
    } else {
        const { error } = await supabase.rpc('post_wallet', { json_data: wallet });
        if (error) throw error;
    }
}

// Delete wallet
export async function deleteWallet(Id: number) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('Id', Id)
            .execute('[delete_wallet]');
    } else {
        const { error } = await supabase.rpc('delete_wallet', { "p_wallet_id": Id });
        if (error) throw error;
    }
}
