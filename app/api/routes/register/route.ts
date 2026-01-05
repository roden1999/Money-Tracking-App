// app/api/routes/register/route.ts
import { NextRequest } from 'next/server';
import { registerUserService } from '@/app/api/services/user';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await registerUserService(body);

        return new Response(JSON.stringify({ message: 'User created successfully' }), {
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
