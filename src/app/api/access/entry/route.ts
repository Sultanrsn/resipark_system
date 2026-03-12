import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { logActivity, ACTIVITY_TYPES } from '@/lib/activity';
import { 
  isVehicleBlacklisted, 
  checkParkingCapacity, 
  getAvailableSlot,
} from '@/lib/rules';

// POST - Record vehicle entry
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user.role !== 'SATPAM' && user.role !== 'ADMIN')) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Hanya satpam atau admin yang dapat mencatat akses' }
      }, { status: 403 });
    }

    const body = await request.json();
    const { platNumber, areaId } = body;

    if (!platNumber) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_PLAT', message: 'Plat nomor harus diisi' }
      }, { status: 400 });
    }

    const formattedPlat = platNumber.toUpperCase().trim();

    // Find vehicle
    let vehicle = await db.vehicle.findUnique({
      where: { platNumber: formattedPlat },
      include: {
        house: true,
      },
    });

    // If not found, create as guest
    if (!vehicle) {
      return NextResponse.json({
        success: false,
        error: { 
          code: 'VEHICLE_NOT_FOUND', 
          message: 'Kendaraan tidak terdaftar. Gunakan menu registrasi tamu.',
          isGuest: true,
        }
      }, { status: 404 });
    }

    // Check if already parked
    const activeParking = await db.accessRecord.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: 'ACTIVE',
      },
    });

    if (activeParking) {
      return NextResponse.json({
        success: false,
        error: { 
          code: 'ALREADY_PARKED', 
          message: 'Kendaraan sudah tercatat masuk sebelumnya',
          details: { entryTime: activeParking.entryTime, slotNumber: activeParking.slotNumber }
        }
      }, { status: 400 });
    }

    // Check blacklist
    const blacklistStatus = await isVehicleBlacklisted(vehicle.id);
    if (blacklistStatus.isBlacklisted) {
      await logActivity({
        userId: user.id,
        action: ACTIVITY_TYPES.ACCESS_BLOCKED.action,
        module: ACTIVITY_TYPES.ACCESS_BLOCKED.module,
        description: `Mencoba masuk: ${formattedPlat} - BLACKLIST`,
        details: { vehicleId: vehicle.id, reason: blacklistStatus.reason },
      });

      return NextResponse.json({
        success: false,
        error: { 
          code: 'VEHICLE_BLACKLISTED', 
          message: 'Kendaraan ini DILARANG MASUK',
          details: { reason: blacklistStatus.reason }
        }
      }, { status: 403 });
    }

    // Determine parking area
    let targetAreaId = areaId;
    if (!targetAreaId) {
      // Default area based on category
      if (vehicle.category === 'TAMU') {
        targetAreaId = 'guest-parking';
      } else {
        targetAreaId = 'main-parking';
      }
    }

    // Check capacity
    const capacity = await checkParkingCapacity(targetAreaId);
    if (!capacity.available) {
      // Try overflow area
      if (targetAreaId === 'main-parking') {
        const overflowCapacity = await checkParkingCapacity('overflow-parking');
        if (overflowCapacity.available) {
          targetAreaId = 'overflow-parking';
        } else {
          return NextResponse.json({
            success: false,
            error: { 
              code: 'PARKING_FULL', 
              message: 'Semua area parkir penuh',
            }
          }, { status: 503 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: { 
            code: 'PARKING_FULL', 
            message: 'Area parkir penuh',
          }
        }, { status: 503 });
      }
    }

    // Get available slot
    const slotId = await getAvailableSlot(targetAreaId);
    let slotNumber: string | null | undefined = null;



    if (slotId) {
      const slot = await db.parkingSlot.findUnique({ where: { id: slotId } });
      slotNumber = slot?.slotNumber;
    }

    // Create access record
    const accessRecord = await db.accessRecord.create({
      data: {
        vehicleId: vehicle.id,
        entryTime: new Date(),
        slotNumber,
        areaId: targetAreaId,
        operatorId: user.id,
        status: 'ACTIVE',
      },
      include: {
        vehicle: {
          include: { house: true },
        },
        area: true,
      },
    });

    // Update parking slot and area
    if (slotId) {
      await db.parkingSlot.update({
        where: { id: slotId },
        data: {
          status: 'OCCUPIED',
          vehicleId: vehicle.id,
          occupiedAt: new Date(),
        },
      });
    }

    await db.parkingArea.update({
      where: { id: targetAreaId },
      data: { currentOccupancy: { increment: 1 } },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      action: ACTIVITY_TYPES.ACCESS_ENTRY.action,
      module: ACTIVITY_TYPES.ACCESS_ENTRY.module,
      description: `Kendaraan masuk: ${formattedPlat}`,
      details: { 
        accessId: accessRecord.id, 
        vehicleId: vehicle.id,
        slotNumber,
        areaId: targetAreaId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        accessId: accessRecord.id,
        vehicle: {
          id: vehicle.id,
          platNumber: vehicle.platNumber,
          category: vehicle.category,
          brand: vehicle.brand,
          color: vehicle.color,
          house: vehicle.house,
        },
        slot: {
          slotNumber,
          area: accessRecord.area?.name,
        },
        entryTime: accessRecord.entryTime,
      },
    });
  } catch (error) {
    console.error('Access entry error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem' }
    }, { status: 500 });
  }
}
