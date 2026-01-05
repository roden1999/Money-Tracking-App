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

// Add transactions
export async function addTransactions(transac: Omit<Transactions, 'Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('User_Id', transac.User_Id)
        .input('Wallet_Id', transac.Wallet_Id)
        .input('Amount', transac.Amount)
        .input('Type', transac.Type)
        .input('Description', transac.Description)
        .input('Category', transac.Category)
        .input('Date', transac.Date)
        .query(
            `INSERT INTO Transactions (User_Id, Wallet_Id, Amount, Type, Description, Category, Date, IsDeleted)
       VALUES (@User_Id, @Wallet_Id, @Amount, @Type, @Description, @Category, @Date, 0)`
        );
}

// Options for reactselect
export async function optionsTransactions(Id: number) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('Id', Id)
        .query<Transactions>(
            `SELECT * FROM Transactions WHERE User_Id = @Id AND IsDeleted = 0`
        );

    return result.recordset;
}

// List all transactions
export async function listAllTransactions(Id: number) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('Id', Id)
        .query<Transactions>(`
            SELECT t.*, w.Name AS Wallet
            FROM Transactions t
            LEFT JOIN Wallets w ON t.Wallet_Id = w.Id
            WHERE t.User_Id = @Id AND t.IsDeleted = 0
            ORDER BY t.Date DESC
        `);
    return result.recordset;
}

// List searched transactions
export async function listSearchedTransactions(Id: number, Type: string, FromDate: Date, ToDate: Date) {
    const pool = await connectToDB();
    const request = pool.request();
    let query = `
        SELECT t.*, w.Name AS Wallet
        FROM Transactions t
        LEFT JOIN Wallets w ON t.Wallet_Id = w.Id
        WHERE t.User_Id = @User_Id AND t.IsDeleted = 0
    `;
    request.input('User_Id', Id);

    if (Type) {
        query += ' AND Type = @Type';
        request.input('Type', Type);
    }

    if (FromDate) {
        query += ' AND Date >= @FromDate';
        request.input('FromDate', FromDate);
    }

    if (ToDate) {
        query += ' AND Date <= @ToDate';
        request.input('ToDate', ToDate);
    }

    query += ' ORDER BY Date DESC';

    const result = await request.query<Transactions>(query);
    return result.recordset;
}

// Edit Transactions
export async function editTransactions(transac: Omit<Transactions, 'User_Id' | 'Wallet_Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', transac.Id)
        .input('Amount', transac.Amount)
        .input('Type', transac.Type)
        .input('Description', transac.Description)
        .input('Category', transac.Category)
        .input('Date', transac.Date)
        .query(
            `UPDATE Transactions
            SET
                Amount = @Amount,
                Type = @Type,
                Description = @Description,
                Category = @Category,
                Date = @Date
            WHERE Id = @Id
            AND Wallet_Id = @Wallet_Id
            AND IsDeleted = 0;`
        );
}

// Delete Transatcions
export async function deleteTransaction(Id: number) {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', Id)
        .query(
            `UPDATE Transactions
            SET
                IsDeleted = 1
            WHERE Id = @Id
            AND IsDeleted = 0;`
        );
}