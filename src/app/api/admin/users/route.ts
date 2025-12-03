import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Get users error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
