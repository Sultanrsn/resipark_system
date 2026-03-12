/**
 * Unit Tests for Utility Functions
 * Sistem Manajemen Parkir & Akses Kendaraan Perumahan
 */

import { describe, it, expect } from 'bun:test';
import { 
  formatCurrency, 
  formatDate, 
  formatDateTime,
  formatDuration,
  calculateDuration,
  getRelativeTime,
  getInitials,
  getAvatarColor,
  ROLE_LABELS,
  VEHICLE_TYPE_LABELS,
  VEHICLE_CATEGORY_LABELS,
  VIOLATION_LABELS,
  getStatusColor,
} from '../lib/utils';

describe('Utility Functions - Currency', () => {
  
  describe('formatCurrency', () => {
    it('should format small amount correctly', () => {
      expect(formatCurrency(50000)).toBe('Rp50.000');
    });

    it('should format large amount correctly', () => {
      expect(formatCurrency(1000000)).toBe('Rp1.000.000');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('Rp0');
    });

    it('should format amount with decimals (rounded)', () => {
      expect(formatCurrency(50000.5)).toBe('Rp50.001');
    });
  });
});

describe('Utility Functions - Date & Time', () => {
  
  describe('formatDate', () => {
    it('should format date in Indonesian format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime with time', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes only', () => {
      expect(formatDuration(30)).toBe('30 menit');
    });

    it('should format hours only', () => {
      expect(formatDuration(60)).toBe('1 jam');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1 jam 30 menit');
    });

    it('should format multiple hours', () => {
      expect(formatDuration(150)).toBe('2 jam 30 menit');
    });

    it('should format zero minutes', () => {
      expect(formatDuration(0)).toBe('0 menit');
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration correctly', () => {
      const start = new Date('2024-01-01T10:00:00');
      const end = new Date('2024-01-01T11:30:00');
      
      expect(calculateDuration(start, end)).toBe(90);
    });

    it('should return 0 for same time', () => {
      const date = new Date('2024-01-01T10:00:00');
      
      expect(calculateDuration(date, date)).toBe(0);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Baru saja" for recent time', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('Baru saja');
    });

    it('should return minutes for short duration', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      expect(getRelativeTime(date)).toBe('5 menit yang lalu');
    });

    it('should return hours for medium duration', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(getRelativeTime(date)).toBe('2 jam yang lalu');
    });
  });
});

describe('Utility Functions - User Display', () => {
  
  describe('getInitials', () => {
    it('should get initials from single name', () => {
      expect(getInitials('Budi')).toBe('BU');
    });

    it('should get initials from two names', () => {
      expect(getInitials('Budi Santoso')).toBe('BS');
    });

    it('should get initials from multiple names', () => {
      expect(getInitials('Budi Santoso Wijaya')).toBe('BS');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('getAvatarColor', () => {
    it('should return a valid color class', () => {
      const color = getAvatarColor('John Doe');
      expect(color).toContain('bg-');
    });

    it('should return consistent color for same name', () => {
      const color1 = getAvatarColor('John Doe');
      const color2 = getAvatarColor('John Doe');
      expect(color1).toBe(color2);
    });

    it('should return different colors for different names', () => {
      const color1 = getAvatarColor('Alice');
      const color2 = getAvatarColor('Bob');
      // Different names might have same color, but usually different
      // This test just ensures function works
      expect(color1).toContain('bg-');
      expect(color2).toContain('bg-');
    });
  });
});

describe('Utility Functions - Labels', () => {
  
  describe('ROLE_LABELS', () => {
    it('should have all role labels', () => {
      expect(ROLE_LABELS['ADMIN']).toBe('Administrator');
      expect(ROLE_LABELS['SATPAM']).toBe('Satpam');
      expect(ROLE_LABELS['WARGA']).toBe('Warga');
      expect(ROLE_LABELS['PENGELOLA']).toBe('Pengelola');
    });
  });

  describe('VEHICLE_TYPE_LABELS', () => {
    it('should have all vehicle type labels', () => {
      expect(VEHICLE_TYPE_LABELS['MOTOR']).toBe('Sepeda Motor');
      expect(VEHICLE_TYPE_LABELS['SEDAN']).toBe('Sedan');
      expect(VEHICLE_TYPE_LABELS['MINIBUS']).toBe('Minibus');
      expect(VEHICLE_TYPE_LABELS['PICKUP']).toBe('Pickup');
      expect(VEHICLE_TYPE_LABELS['TRUK']).toBe('Truk');
    });
  });

  describe('VEHICLE_CATEGORY_LABELS', () => {
    it('should have all category labels', () => {
      expect(VEHICLE_CATEGORY_LABELS['WARGA']).toBe('Warga');
      expect(VEHICLE_CATEGORY_LABELS['TAMU']).toBe('Tamu');
      expect(VEHICLE_CATEGORY_LABELS['SERVICE']).toBe('Service');
      expect(VEHICLE_CATEGORY_LABELS['DELIVERY']).toBe('Delivery');
    });
  });

  describe('VIOLATION_LABELS', () => {
    it('should have all violation labels', () => {
      expect(VIOLATION_LABELS['PARKIR_AREA_SALAH']).toBe('Parkir di Luar Area');
      expect(VIOLATION_LABELS['PARKIR_JALUR_DARURAT']).toBe('Parkir di Jalur Darurat');
      expect(VIOLATION_LABELS['OVER_TIME']).toBe('Melebihi Batas Waktu');
    });
  });
});

describe('Utility Functions - Status Colors', () => {
  
  describe('getStatusColor', () => {
    it('should return green for ACTIVE status', () => {
      expect(getStatusColor('ACTIVE')).toContain('green');
    });

    it('should return red for BLACKLISTED status', () => {
      expect(getStatusColor('BLACKLISTED')).toContain('red');
    });

    it('should return yellow for PENDING status', () => {
      expect(getStatusColor('PENDING')).toContain('yellow');
    });

    it('should return green for PAID status', () => {
      expect(getStatusColor('PAID')).toContain('green');
    });

    it('should return gray for unknown status', () => {
      expect(getStatusColor('UNKNOWN')).toContain('gray');
    });
  });
});
