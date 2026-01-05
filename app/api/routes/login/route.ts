import { NextRequest } from 'next/server';
import { loginUserService } from '@/app/api/services/user';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await loginUserService(body);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || 'Server error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
