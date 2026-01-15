import { connectToDB } from '../../lib/db';
import { supabase } from '../../lib/supabase';

export interface Transactions {
    Id: number;
    User_Id: number;
    Wallet_Id: number;
    Amount: number;
    Type: string;
    Description: string;
    Category: string;
    Date: Date;
    IsDeleted: boolean;
}

interface SearchedData {
    Wallet_Ids?: number[];
    Type?: string;
    From_Date?: Date;
    To_Date?: Date;
}

const USE_SUPABASE = true; // default MSSQL, set to true to switch to Supabase

// Add transactions
export async function addTransactions(transac: Omit<Transactions, 'Id' | 'IsDeleted'>) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('json_data', JSON.stringify(transac))
            .execute('[post_transaction]');
        return result.recordset;
    } else {
        const { data, error } = await supabase.rpc('post_transaction', { json_data: transac });
        if (error) throw error;
        return data;
    }
}

// List transactions
export async function listTransactions(data: SearchedData) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        const result = await pool
            .request()
            .input('json_data', JSON.stringify(data))
            .execute('[get_transactions]');
        return result.recordset;
    } else {
        const { data: transactions, error } = await supabase.rpc('get_transactions', { json_data: data });
        if (error) throw error;
        return transactions;
    }
}

// Edit transaction
export async function editTransactions(transac: Omit<Transactions, 'User_Id' | 'Wallet_Id' | 'IsDeleted'>): Promise<void> {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('json_data', JSON.stringify(transac))
            .execute('[post_transaction]');
    } else {
        const { error } = await supabase.rpc('post_transaction', { json_data: transac });
        if (error) throw error;
    }
}

// Delete transaction
export async function deleteTransaction(Id: number) {
    if (!USE_SUPABASE) {
        const pool = await connectToDB();
        await pool
            .request()
            .input('Id', Id)
            .execute('[delete_transaction]');
    } else {
        const { error } = await supabase.rpc('delete_transaction', { "p_wallet_id": Id });
        if (error) throw error;
    }
}
