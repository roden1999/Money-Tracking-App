import { NextRequest } from 'next/server';
import { addTransactionsService } from '@/app/api/services/transactions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        await addTransactionsService(body);

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
