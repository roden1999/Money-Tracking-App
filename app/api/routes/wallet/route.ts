import { NextRequest } from 'next/server';
import { addWalletService, editWalletService, deleteWalletService } from '@/app/api/services/wallet';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        const result = await addWalletService(body);
        console.log(result);
        return new Response(JSON.stringify({ message: 'Wallet added successfully' }), {
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
        await editWalletService(body);

        return new Response(JSON.stringify({ message: 'Wallet updated successfully' }), {
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
        await deleteWalletService(body.Id);

        return new Response(JSON.stringify({ message: 'Wallet deleted successfully' }), {
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
