import { addTransactions, editTransactions, deleteTransaction, listTransactions } from "../models/transactions";


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
    Wallet_Ids?: number[];
    Type: string;
    From_Date: Date;
    To_Date: Date;
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

    const result = await addTransactions({
        User_Id,
        Wallet_Id,
        Amount,
        Type,
        Description: Description || '',
        Category,
        Date,
    });
    return { result };
}


export async function listTransactionsService(input: SearchDataInput) {
    const result = await listTransactions(input);
    return { result };
}

export async function editTransactionsService(inputs: EditTransactionsInput) {
    const { Id, Amount, Type, Description, Category, Date } = inputs;

    if (!Id || !Amount || !Type || !Category || !Date) {
        throw new Error('Missing required fields');
    }

    const result = await editTransactions(inputs);
    return { result };
}

export async function deleteTransactionsService(Id: number) {
    if (!Id) {
        throw new Error('User Id is required!');
    }

    await deleteTransaction(Id);
}