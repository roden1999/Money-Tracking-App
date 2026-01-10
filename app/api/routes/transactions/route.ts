import { NextRequest } from 'next/server';
import { addTransactionsService, editTransactionsService, deleteTransactionsService } from '@/app/api/services/transactions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        const result = await addTransactionsService(body);
        console.log(result);
        return new Response(JSON.stringify({ message: 'Transactions added successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("TRANSAC ERROR:", err);
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        await editTransactionsService(body);

        return new Response(JSON.stringify({ message: 'Transaction updated successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("TRANSAC ERROR:", err);
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        await deleteTransactionsService(body.Id);

        return new Response(JSON.stringify({ message: 'Transaction deleted successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("TRANSAC ERROR:", err);
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}