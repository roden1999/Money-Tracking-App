import { NextRequest } from 'next/server';
import { optionsTransactionsService } from '@/app/api/services/transactions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await optionsTransactionsService(body.Id);

        return new Response(JSON.stringify(result), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("WALLET ERROR:", err);
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
