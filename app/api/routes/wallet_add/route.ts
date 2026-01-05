import { NextRequest } from 'next/server';
import { addWalletService } from '@/app/api/services/wallet';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await addWalletService(body);

        return new Response(JSON.stringify({ message: 'Wallet added successfully' }), {
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
