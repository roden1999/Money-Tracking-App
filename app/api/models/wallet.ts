import sql from 'mssql';
import { connectToDB } from '../../lib/db';

export interface Wallet {
    Id: number;
    User_Id: number;
    Name: string;
    Description: string;
    Currency: string;
    Balance: number;
    Date: Date;
    IsDeleted: boolean;
}

// Add wallet
export async function addWallet(wallet: Omit<Wallet, 'Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('User_Id', wallet.User_Id)
        .input('Name', wallet.Name)
        .input('Description', wallet.Description)
        .input('Currency', wallet.Currency)
        .input('Balance', wallet.Balance)
        .input('Date', wallet.Date)
        .query(
            `INSERT INTO Wallets (User_Id, Name, Description, Currency, Balance, Date, IsDeleted)
       VALUES (@User_Id, @Name, @Description, @Currency, @Balance, @Date, 0)`
        );
}

// Options for reactselect
export async function optionsWallet(Id: number) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('Id', Id)
        .query<Wallet>(
            `SELECT * FROM Wallets WHERE User_Id = @Id AND IsDeleted = 0`
        );

    return result.recordset;
}

// List all wallet
export async function listAllWallet(Id: number) {
    const pool = await connectToDB();
    const result = await pool
        .request()
        .input('Id', Id)
        .query<Wallet>(
            `SELECT * FROM Wallets WHERE User_Id = @Id AND IsDeleted = 0`
        );

    return result.recordset;
}

// List searched wallet
export async function listSearchedWallet(Ids: number[]) {
    const pool = await connectToDB();
    // Build a parameterized query for safety
    const inputParams = Ids.map((_, i) => `@Id${i}`).join(', ');
    const request = pool.request();

    Ids.forEach((id, i) => {
        request.input(`Id${i}`, id);
    });

    const query = `SELECT * FROM Wallets WHERE Id IN (${inputParams}) AND IsDeleted = 0`;
    const result = await request.query<Wallet>(query);

    return result.recordset;
}

// Edit Wallet
export async function editWallet(wallet: Omit<Wallet, 'Date' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', wallet.Id)
        .input('User_Id', wallet.User_Id)
        .input('Name', wallet.Name)
        .input('Description', wallet.Description)
        .input('Currency', wallet.Currency)
        .input('Balance', wallet.Balance)
        .query(
            `UPDATE Wallets
            SET
                Name = @Name,
                Description = @Description,
                Currency = @Currency,
                Balance = @Balance
            WHERE Id = @Id
            AND User_Id = @User_Id
            AND IsDeleted = 0;`
        );
}

// Delete Wallet
export async function deleteWallet(Id: number) {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', Id)
        .query(
            `UPDATE Wallets
            SET
                IsDeleted = 1
            WHERE Id = @Id
            AND IsDeleted = 0;`
        );
}