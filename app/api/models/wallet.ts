import sql from 'mssql';
import { connectToDB } from '../../lib/db';

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

// Add wallet
export async function addWallet(wallet: Omit<Wallet, 'Id' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('json_data', JSON.stringify(wallet))
        // .input('User_Id', wallet.User_Id)
        // .input('Name', wallet.Name)
        // .input('Description', wallet.Description)
        // .input('Currency', wallet.Currency)
        // .input('Balance', wallet.Balance)
        // .input('Date', wallet.Date)
        .execute('[post_wallet]')
    //     .query(
    //         `INSERT INTO Wallets (User_Id, Name, Description, Currency, Balance, Date, IsDeleted)
    //    VALUES (@User_Id, @Name, @Description, @Currency, @Balance, @Date, 0)`
    //     );
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

// List wallet
export async function listWallet(data: SearchedData) {
    const pool = await connectToDB();
   
    const result = await pool
        .request()
        .input('json_data', JSON.stringify(data))
        .execute('[get_wallets]');
  
    return result.recordset;
}

// Edit Wallet
export async function editWallet(wallet: Omit<Wallet, 'Date' | 'IsDeleted'>): Promise<void> {
    const pool = await connectToDB();
    await pool
        .request()
        .input('json_data', JSON.stringify(wallet))
        .execute('[post_wallet]');
}

// Delete Wallet
export async function deleteWallet(Id: number) {
    const pool = await connectToDB();
    await pool
        .request()
        .input('Id', Id)
        .execute('[delete_wallet]');
}