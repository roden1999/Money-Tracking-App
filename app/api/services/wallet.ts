import { addWallet, optionsWallet, listWallet, listAllWallet, listSearchedWallet, editWallet, deleteWallet } from "../models/wallet";


interface WalletInput {
    Id: number | null;
    User_Id: number;
    Name: string;
    Description: string;
    Currency: string;
    Balance: number;
    Date: Date;
}

interface SearchedDataInput {
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

export async function addWalletService(inputs: WalletInput) {
    const { User_Id, Name, Description, Currency, Balance, Date } = inputs;

    if (!User_Id || !Name || !Currency || !Balance || !Date) {
        console.log(inputs)
        throw new Error('Missing required fields');
    }

    await addWallet(inputs);
}

export async function optionsWalletService(Id: number) {
    const result = await optionsWallet(Id);
    return { result };
}

export async function listWalletService(input: SearchedDataInput) {
    const { Ids = [], User_Id } = input;

    if (!User_Id) {
        throw new Error('User Id is required!');
    }
    
    const result = await listWallet(input);
    console.log("Debug: ", result);
    return { result };

    // if (Ids.length === 0) {
    //     const result = await listAllWallet(User_Id);
    //     return { result };
    // } else {
    //     const result = await listSearchedWallet(Ids);
    //     return { result };
    // }
}

export async function editWalletService(inputs: WalletInput) {
    const { Id, User_Id, Name, Description, Currency, Balance } = inputs;

    if (!Id || !User_Id || !Name || !Currency || !Balance) {
        throw new Error('Missing required fields!');
    }

    await editWallet(inputs);
}

export async function deleteWalletService(Id: number) {
    if (!Id) {
        console.log(Id);
        throw new Error('User Id is required!');
    }

    await deleteWallet(Id);
}