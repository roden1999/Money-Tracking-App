import { addWallet, optionsWallet, listAllWallet, listSearchedWallet, editWallet, deleteWallet } from "../models/wallet";


interface WalletInput {
    User_Id: number;
    Name: string;
    Description: string;
    Currency: string;
    Balance: number;
    Date: Date;
}

interface SearchDataInput {
    Ids?: number[];
    User_Id: number;
}

interface EditWalletInput {
    Id: number,
    User_Id: number;
    Name: string;
    Description: string;
    Currency: string;
    Balance: number;
}

export async function addWalletService(input: WalletInput) {
    const { User_Id, Name, Description, Currency, Balance, Date } = input;

    if (!User_Id || !Name || !Currency || !Balance || !Date) {
        throw new Error('Missing required fields');
    }

    await addWallet({
        User_Id,
        Name,
        Description: Description || '',
        Currency,
        Balance,
        Date,
    });
}

export async function optionsWalletService(Id: number) {
    const result = await optionsWallet(Id);
    return { result };
}

export async function listWalletService(input: SearchDataInput) {
    const { Ids = [], User_Id } = input;

    if (!User_Id) {
        throw new Error('User Id is required!');
    }

    if (Ids.length === 0) {
        const result = await listAllWallet(User_Id);
        return { result };
    } else {
        const result = await listSearchedWallet(Ids);
        return { result };
    }
}

export async function editWalletService(input: EditWalletInput) {
    const { Id, User_Id, Name, Description, Currency, Balance } = input;

    if (!Id || !User_Id || !Name || !Currency || !Balance) {
        throw new Error('User Id is required!');
    }

    await editWallet({
        Id,
        User_Id,
        Name,
        Description: Description || '',
        Currency,
        Balance,
    });
}

export async function deleteWalletService(Id: number) {
    if (!Id) {
        throw new Error('User Id is required!');
    }

    await deleteWallet(Id);
}