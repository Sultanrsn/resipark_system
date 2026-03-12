/**
 * Integration Tests for API Routes
 * Sistem Manajemen Parkir & Akses Kendaraan Perumahan
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

const BASE_URL = 'http://localhost:3000';

describe('API Integration Tests - Authentication', () => {
  
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'password123',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user).toBeDefined();
      expect(data.data.user.username).toBe('admin');
      expect(data.data.user.role).toBe('ADMIN');
    });

    it('should fail with invalid username', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'wronguser',
          password: 'password123',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should fail with invalid password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'wrongpassword',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});

describe('API Integration Tests - Vehicles', () => {
  let sessionCookie: string;

  beforeAll(async () => {
    // Login first to get session
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    if (cookies) {
      sessionCookie = cookies.split(';')[0];
    }
  });

  describe('GET /api/vehicles', () => {
    it('should return list of vehicles', async () => {
      const response = await fetch(`${BASE_URL}/api/vehicles`, {
        headers: {
          Cookie: sessionCookie,
        },
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toBeDefined();
    });

    it('should filter vehicles by search', async () => {
      const response = await fetch(`${BASE_URL}/api/vehicles?search=B 1234`, {
        headers: {
          Cookie: sessionCookie,
        },
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/vehicles', () => {
    it('should create new vehicle', async () => {
      const response = await fetch(`${BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'T 9999 TST',
          vehicleType: 'MOTOR',
          brand: 'Test Brand',
          color: 'Test Color',
          category: 'WARGA',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.platNumber).toBe('T 9999 TST');
    });

    it('should reject duplicate plate number', async () => {
      const response = await fetch(`${BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'B 1234 ABC', // Already exists
          vehicleType: 'MOTOR',
          brand: 'Test',
          color: 'Test',
          category: 'WARGA',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('DUPLICATE_PLAT');
    });
  });
});

describe('API Integration Tests - Access', () => {
  let sessionCookie: string;

  beforeAll(async () => {
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'satpam1',
        password: 'password123',
      }),
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    if (cookies) {
      sessionCookie = cookies.split(';')[0];
    }
  });

  describe('POST /api/access/entry', () => {
    it('should allow entry for registered vehicle', async () => {
      const response = await fetch(`${BASE_URL}/api/access/entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'D 1111 GHI',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.vehicle).toBeDefined();
      expect(data.data.slot).toBeDefined();
    });

    it('should return not found for unregistered vehicle', async () => {
      const response = await fetch(`${BASE_URL}/api/access/entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'Z 9999 XXX',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error.code).toBe('VEHICLE_NOT_FOUND');
      expect(data.error.isGuest).toBe(true);
    });
  });

  describe('POST /api/access/exit', () => {
    it('should record exit for parked vehicle', async () => {
      // First ensure vehicle is parked
      await fetch(`${BASE_URL}/api/access/entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'D 2222 JKL',
        }),
      });

      const response = await fetch(`${BASE_URL}/api/access/exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'D 2222 JKL',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.duration).toBeDefined();
    });

    it('should fail for vehicle not in parking', async () => {
      const response = await fetch(`${BASE_URL}/api/access/exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          platNumber: 'Z 9999 XXX',
        }),
      });

      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });
});

describe('API Integration Tests - Dashboard', () => {
  let sessionCookie: string;

  beforeAll(async () => {
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });
    
    const cookies = loginResponse.headers.get('set-cookie');
    if (cookies) {
      sessionCookie = cookies.split(';')[0];
    }
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return dashboard statistics', async () => {
      const response = await fetch(`${BASE_URL}/api/dashboard/stats`, {
        headers: {
          Cookie: sessionCookie,
        },
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.today).toBeDefined();
      expect(data.data.parking).toBeDefined();
      expect(data.data.violations).toBeDefined();
      expect(data.data.vehicles).toBeDefined();
    });
  });

  describe('GET /api/dashboard/activities', () => {
    it('should return recent activities', async () => {
      const response = await fetch(`${BASE_URL}/api/dashboard/activities`, {
        headers: {
          Cookie: sessionCookie,
        },
      });

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });
});
