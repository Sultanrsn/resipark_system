import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { logActivity, ACTIVITY_TYPES } from '@/lib/activity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak memiliki akses' }
      }, { status: 401 });
    }

    const { id } = await params;

    const userData = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        resident: {
          include: {
            house: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User tidak ditemukan' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak memiliki akses' }
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { username, email, fullName, phone, role, status, password } = body;

    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User tidak ditemukan' }
      }, { status: 404 });
    }

    // Cek duplikat (selain user ini)
    if (username || email) {
      const duplicate = await db.user.findFirst({
        where: {
          OR: [
            { username: username || existingUser.username },
            { email: email || existingUser.email },
          ],
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json({
          success: false,
          error: { code: 'DUPLICATE', message: 'Username atau email sudah digunakan' }
        }, { status: 409 });
      }
    }

    // Update data
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone || null;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.USER_UPDATE.action,
      module: ACTIVITY_TYPES.USER_UPDATE.module,
      description: `Mengupdate user: ${updatedUser.username}`,
      details: { userId: id, changes: updateData },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak memiliki akses' }
      }, { status: 401 });
    }

    const { id } = await params;

    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User tidak ditemukan' }
      }, { status: 404 });
    }

    // Soft delete dengan mengubah status
    await db.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.USER_DELETE.action,
      module: ACTIVITY_TYPES.USER_DELETE.module,
      description: `Menghapus user: ${existingUser.username}`,
      details: { userId: id, username: existingUser.username },
    });

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}
