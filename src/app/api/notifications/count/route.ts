import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { connectDB } from '@/lib/db/connection';
import { logApiRequest, logApiResponse, logError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const url = request.url;
  const method = request.method;

  try {
    logApiRequest(method, url);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 401, duration);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // For now, return 0 count as notification system needs implementation
    const count = 0;

    const duration = Date.now() - startTime;
    logApiResponse(method, url, 200, duration, session.user.id);

    return NextResponse.json({
      success: true,
      count
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Get notification count failed', error, { url, method });
    logApiResponse(method, url, 500, duration);
    return NextResponse.json(
      { error: 'Failed to get notification count' },
      { status: 500 }
    );
  }
}