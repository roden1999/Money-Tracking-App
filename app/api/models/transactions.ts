import sql from 'mssql';
import { connectToDB } from '../../lib/db';

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
    Type: string;
    From_Date: Date;
    To_Date: Date;
}

// Add transactions
export async function addTransactions(transac: Omit<Transactions, 'Id' | 'IsDeleted'>) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('json_data', JSON.stringify(transac))
        .execute('[post_transaction]');

    return result.recordset;
}

export async function listTransactions(data: SearchedData) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('json_data', JSON.stringify(data))
        .execute('[get_transactions]');
        console.log("Debug", result.recordset);
    return result.recordset;
}

// List all transactions
// export async function listAllTransactions(Id: number) {
//     const pool = await connectToDB();
//     const result = await pool
//         .request()
//         .input('Id', Id)
//         .query<Transactions>(`
//             SELECT t.*, w.Name AS Wallet
//             FROM Transactions t
//             LEFT JOIN Wallets w ON t.Wallet_Id = w.Id AND w.IsDeleted = 0 -- onlyjoin active wallte
//             WHERE t.User_Id = @Id AND t.IsDeleted = 0
//             AND w.Id IS NOT NULL --wallet exist
//             ORDER BY t.Date DESC
//         `);
//     return result.recordset;
// }

// List searched transactions
// export async function listSearchedTransactions(Id: number, Type: string, FromDate: Date, ToDate: Date) {
//     const pool = await connectToDB();
//     const request = pool.request();
//     let query = `
//         SELECT t.*, w.Name AS Wallet
//         FROM Transactions t
//         LEFT JOIN Wallets w ON t.Wallet_Id = w.Id
//         WHERE t.User_Id = @User_Id AND t.IsDeleted = 0
//     `;
//     request.input('User_Id', Id);

//     if (Type) {
//         query += ' AND Type = @Type';
//         request.input('Type', Type);
//     }

//     if (FromDate) {
//         query += ' AND Date >= @FromDate';
//         request.input('FromDate', FromDate);
//     }

//     if (ToDate) {
//         query += ' AND Date <= @ToDate';
//         request.input('ToDate', ToDate);
//     }

//     query += ' ORDER BY Date DESC';

//     const result = await request.query<Transactions>(query);
//     return result.recordset;
// }

// Edit Transactions
export async function editTransactions(transac: Omit<Transactions, 'User_Id' | 'Wallet_Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('json_data', JSON.stringify(transac))
        .execute('[post_transaction]');
}

// Delete Transatcions
export async function deleteTransaction(Id: number) {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', Id)
        .execute('[delete_transaction]');
}