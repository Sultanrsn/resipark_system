import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logActivity, ACTIVITY_TYPES } from '@/lib/activity';
import { checkVehicleQuota, validatePlatNumber } from '@/lib/rules';

// GET - List vehicles
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' }
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    // For WARGA role, only show their own vehicles
    if (user.role === 'WARGA' && user.houseId) {
      where.houseId = user.houseId;
    }

    if (search) {
      where.OR = [
        { platNumber: { contains: search.toUpperCase() } },
        { brand: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const total = await db.vehicle.count({ where });
    const totalPages = Math.ceil(total / limit);

    const vehicles = await db.vehicle.findMany({
      where,
      include: {
        house: {
          select: {
            id: true,
            houseNumber: true,
            block: true,
          },
        },
        blacklist: {
          where: { status: 'ACTIVE' },
          select: { id: true, reason: true },
        },
      },
      orderBy: { registeredAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}

// POST - Create vehicle
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' }
      }, { status: 401 });
    }

    const body = await request.json();
    const { platNumber, vehicleType, brand, color, category, houseId } = body;

    // Validate plat number format
    const platValidation = validatePlatNumber(platNumber);
    if (!platValidation.valid) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: platValidation.error }
      }, { status: 400 });
    }

    const formattedPlat = platNumber.toUpperCase().trim();

    // Check if plat number already exists
    const existingVehicle = await db.vehicle.findUnique({
      where: { platNumber: formattedPlat },
    });

    if (existingVehicle) {
      return NextResponse.json({
        success: false,
        error: { code: 'DUPLICATE_PLAT', message: 'Plat nomor sudah terdaftar' }
      }, { status: 409 });
    }

    // Determine houseId
    let targetHouseId = houseId;
    if (user.role === 'WARGA') {
      if (!user.houseId) {
        return NextResponse.json({
          success: false,
          error: { code: 'NO_HOUSE', message: 'Anda tidak terdaftar di rumah manapun' }
        }, { status: 400 });
      }
      targetHouseId = user.houseId;
    }

    // Check quota for WARGA vehicles
    if (category === 'WARGA' && targetHouseId) {
      const quota = await checkVehicleQuota(targetHouseId);
      if (!quota.available) {
        return NextResponse.json({
          success: false,
          error: { 
            code: 'QUOTA_EXCEEDED', 
            message: `Kuota kendaraan sudah penuh (${quota.current}/${quota.max})` 
          }
        }, { status: 400 });
      }
    }

    const vehicle = await db.vehicle.create({
      data: {
        platNumber: formattedPlat,
        vehicleType: vehicleType || 'MOTOR',
        brand,
        color,
        category: category || 'WARGA',
        status: 'ACTIVE',
        houseId: targetHouseId,
      },
      include: {
        house: true,
      },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.VEHICLE_CREATE.action,
      module: ACTIVITY_TYPES.VEHICLE_CREATE.module,
      description: `Mendaftarkan kendaraan ${formattedPlat}`,
      details: { vehicleId: vehicle.id, platNumber: formattedPlat },
    });

    return NextResponse.json({
      success: true,
      data: vehicle,
    }, { status: 201 });
  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}
