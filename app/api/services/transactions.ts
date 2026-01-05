import { addTransactions, optionsTransactions, listAllTransactions, listSearchedTransactions, editTransactions, deleteTransaction } from "../models/transactions";


export interface TransactionsInput {
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

interface SearchDataInput {
    User_Id: number;
    Type: string;
    FromDate: Date;
    ToDate: Date;
}

interface EditTransactionsInput {
    Id: number,
    Amount: number;
    Type: string;
    Description: string;
    Category: string;
    Date: Date;
}

export async function addTransactionsService(input: TransactionsInput) {
    const { User_Id, Wallet_Id, Amount, Type, Description, Category, Date } = input;

    if (!User_Id || !Wallet_Id || !Amount || !Type || !Category || !Date) {
        throw new Error('Missing required fields');
    }

    await addTransactions({
        User_Id,
        Wallet_Id,
        Amount,
        Type,
        Description: Description || '',
        Category,
        Date,
    });
}

export async function optionsTransactionsService(Id: number) {
    const result = await optionsTransactions(Id);
    return { result };
}

export async function listTransactionsService(input: SearchDataInput) {
    const { User_Id, Type, FromDate, ToDate } = input;

    if (!User_Id) {
        throw new Error('Missing required fields');
    }

    if (!Type && !FromDate && !ToDate) {
        const result = await listAllTransactions(User_Id);
        return { result };
    } else {
        const result = await listSearchedTransactions(User_Id, Type, FromDate, ToDate);
        return { result };
    }
}

export async function editTransactionsService(input: EditTransactionsInput) {
    const { Id, Amount, Type, Description, Category, Date } = input;

    if (!Id || !Amount || !Type || !Category || !Date) {
        throw new Error('Missing required fields');
    }

    await editTransactions({
        Id,
        Amount,
        Type,
        Description: Description || '',
        Category,
        Date,
    });
}

export async function deleteTransactionsService(Id: number) {
    if (!Id) {
        throw new Error('User Id is required!');
    }

    await deleteTransaction(Id);
}