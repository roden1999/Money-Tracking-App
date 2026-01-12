import { NextRequest } from 'next/server';
import { changePasswordService } from '@/app/api/services/user';

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await changePasswordService(body);
        console.log(result);
        return new Response(JSON.stringify({ message: 'Password changed successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}