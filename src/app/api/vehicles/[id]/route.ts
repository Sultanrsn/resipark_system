import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logActivity, ACTIVITY_TYPES } from '@/lib/activity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' }
      }, { status: 401 });
    }

    const { id } = await params;

    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        house: true,
        blacklist: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Kendaraan tidak ditemukan' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
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
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'WARGA')) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Tidak memiliki akses' }
      }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { platNumber, vehicleType, brand, color, category, status, houseId } = body;

    const existingVehicle = await db.vehicle.findUnique({
      where: { id },
    });

    if (!existingVehicle) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Kendaraan tidak ditemukan' }
      }, { status: 404 });
    }

    // For WARGA, check ownership by userId
    if (user.role === 'WARGA' && existingVehicle.userId !== user.id) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Tidak memiliki akses' }
      }, { status: 403 });
    }

    const updateData: any = {};
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (brand) updateData.brand = brand;
    if (color) updateData.color = color;
    if (status) updateData.status = status;
    if (houseId !== undefined) updateData.houseId = houseId || null;

    if (platNumber && platNumber !== existingVehicle.platNumber) {
      const platExists = await db.vehicle.findUnique({
        where: { platNumber: platNumber.toUpperCase() },
      });
      if (platExists) {
        return NextResponse.json({
          success: false,
          error: { code: 'DUPLICATE_PLAT', message: 'Plat nomor sudah digunakan' }
        }, { status: 409 });
      }
      updateData.platNumber = platNumber.toUpperCase();
    }

    const vehicle = await db.vehicle.update({
      where: { id },
      data: updateData,
    });

    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.VEHICLE_UPDATE.action,
      module: ACTIVITY_TYPES.VEHICLE_UPDATE.module,
      description: `Mengupdate data kendaraan ${vehicle.platNumber}`,
      details: { vehicleId: id, changes: updateData },
    });

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
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
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'WARGA')) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Tidak memiliki akses' }
      }, { status: 403 });
    }

    const { id } = await params;

    const vehicle = await db.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Kendaraan tidak ditemukan' }
      }, { status: 404 });
    }

    // For WARGA, check ownership by userId
    if (user.role === 'WARGA' && vehicle.userId !== user.id) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Tidak memiliki akses' }
      }, { status: 403 });
    }

    // Soft delete by setting status to INACTIVE
    await db.vehicle.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.VEHICLE_DELETE.action,
      module: ACTIVITY_TYPES.VEHICLE_DELETE.module,
      description: `Menghapus kendaraan ${vehicle.platNumber}`,
      details: { vehicleId: id, platNumber: vehicle.platNumber },
    });

    return NextResponse.json({
      success: true,
      message: 'Kendaraan berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}
