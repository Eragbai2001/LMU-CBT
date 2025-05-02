import { NextResponse } from 'next/server';
import { getMaintenanceStatus, updateMaintenanceStatus } from '@/lib/maintenance';
import { getToken } from 'next-auth/jwt';

// GET handler for maintenance status
export async function GET() {
  try {
    const status = await getMaintenanceStatus();
    
    return NextResponse.json({
      isMaintenanceMode: status.isMaintenanceMode,
      message: status.message
    });
  } catch (error) {
    console.error("Error in maintenance API route:", error);
    return NextResponse.json(
      { error: "Failed to get maintenance status" },
      { status: 500 }
    );
  }
}
// POST handler to update maintenance status (admin only)
export async function POST(request: Request) {
  try {
    // Extract the token from the request
    const token = await getToken({ 
      req: request as any,  // Type casting needed for Next.js 14/15
      secret: process.env.AUTH_SECRET 
    });
    
    // Check if user is authenticated and is an admin
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { isMaintenanceMode, message } = await request.json();
    
    const success = await updateMaintenanceStatus(isMaintenanceMode, message);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update maintenance status' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance status' },
      { status: 500 }
    );
  }
}