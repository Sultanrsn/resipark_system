/**
 * Unit Tests for Business Rules
 * Sistem Manajemen Parkir & Akses Kendaraan Perumahan
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { 
  calculateOvertimeFine, 
  validatePlatNumber,
  FINE_RULES,
  VEHICLE_QUOTA_PER_HOUSE,
  CAPACITY_THRESHOLDS,
} from '../lib/rules';

describe('Business Rules - Fine Calculation', () => {
  
  describe('calculateOvertimeFine', () => {
    it('should return 0 if within time limit', () => {
      const entryTime = new Date('2024-01-01T08:00:00');
      const exitTime = new Date('2024-01-01T14:00:00'); // 6 hours
      const maxDurationHours = 8;
      
      const fine = calculateOvertimeFine(entryTime, exitTime, maxDurationHours);
      
      expect(fine).toBe(0);
    });

    it('should calculate fine for 1 hour overtime', () => {
      const entryTime = new Date('2024-01-01T08:00:00');
      const exitTime = new Date('2024-01-01T17:00:00'); // 9 hours
      const maxDurationHours = 8;
      
      const fine = calculateOvertimeFine(entryTime, exitTime, maxDurationHours);
      
      expect(fine).toBe(FINE_RULES.OVERTIME_RATE_PER_HOUR); // Rp 25.000
    });

    it('should calculate fine for partial hour overtime', () => {
      const entryTime = new Date('2024-01-01T08:00:00');
      const exitTime = new Date('2024-01-01T17:30:00'); // 9.5 hours
      const maxDurationHours = 8;
      
      const fine = calculateOvertimeFine(entryTime, exitTime, maxDurationHours);
      
      expect(fine).toBe(FINE_RULES.OVERTIME_RATE_PER_HOUR * 2); // 2 hours rounded up
    });

    it('should calculate fine for multiple hours overtime', () => {
      const entryTime = new Date('2024-01-01T08:00:00');
      const exitTime = new Date('2024-01-01T20:00:00'); // 12 hours
      const maxDurationHours = 8;
      
      const fine = calculateOvertimeFine(entryTime, exitTime, maxDurationHours);
      
      expect(fine).toBe(FINE_RULES.OVERTIME_RATE_PER_HOUR * 4); // 4 hours overtime
    });
  });

  describe('FINE_RULES constants', () => {
    it('should have correct base fines', () => {
      expect(FINE_RULES.BASE_FINES.PARKIR_AREA_SALAH).toBe(50000);
      expect(FINE_RULES.BASE_FINES.PARKIR_JALUR_DARURAT).toBe(100000);
      expect(FINE_RULES.BASE_FINES.OVER_TIME).toBe(25000);
    });

    it('should have correct multiplier thresholds', () => {
      expect(FINE_RULES.MULTIPLIER.THIRD_VIOLATION.threshold).toBe(2);
      expect(FINE_RULES.MULTIPLIER.THIRD_VIOLATION.multiplier).toBe(2);
      expect(FINE_RULES.MULTIPLIER.FIFTH_VIOLATION.multiplier).toBe(3);
    });

    it('should have correct overtime rate', () => {
      expect(FINE_RULES.OVERTIME_RATE_PER_HOUR).toBe(25000);
    });

    it('should have correct max durations', () => {
      expect(FINE_RULES.MAX_GUEST_DURATION_HOURS).toBe(8);
      expect(FINE_RULES.MAX_SERVICE_DURATION_HOURS).toBe(2);
    });
  });

  describe('VEHICLE_QUOTA_PER_HOUSE', () => {
    it('should be 2', () => {
      expect(VEHICLE_QUOTA_PER_HOUSE).toBe(2);
    });
  });

  describe('CAPACITY_THRESHOLDS', () => {
    it('should have correct warning threshold', () => {
      expect(CAPACITY_THRESHOLDS.WARNING).toBe(90);
    });

    it('should have correct full threshold', () => {
      expect(CAPACITY_THRESHOLDS.FULL).toBe(100);
    });
  });
});

describe('Business Rules - Plat Number Validation', () => {
  
  describe('validatePlatNumber', () => {
    it('should validate standard format with spaces', () => {
      const result = validatePlatNumber('B 1234 ABC');
      expect(result.valid).toBe(true);
    });

    it('should validate format without spaces', () => {
      const result = validatePlatNumber('B1234ABC');
      expect(result.valid).toBe(true);
    });

    it('should validate lowercase input', () => {
      const result = validatePlatNumber('b 1234 abc');
      expect(result.valid).toBe(true);
    });

    it('should validate single letter region code', () => {
      const result = validatePlatNumber('D 1234 XY');
      expect(result.valid).toBe(true);
    });

    it('should validate two letter region code', () => {
      const result = validatePlatNumber('BK 1234 XY');
      expect(result.valid).toBe(true);
    });

    it('should validate without suffix letters', () => {
      const result = validatePlatNumber('B 1234');
      expect(result.valid).toBe(true);
    });

    it('should reject empty string', () => {
      const result = validatePlatNumber('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('harus diisi');
    });

    it('should reject numbers only', () => {
      const result = validatePlatNumber('1234');
      expect(result.valid).toBe(false);
    });

    it('should reject letters only', () => {
      const result = validatePlatNumber('ABC DEF');
      expect(result.valid).toBe(false);
    });

    it('should reject too many digits', () => {
      const result = validatePlatNumber('B 12345 ABC');
      expect(result.valid).toBe(false);
    });
  });
});
