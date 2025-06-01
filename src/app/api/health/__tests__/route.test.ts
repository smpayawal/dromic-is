/**
 * Health Check API Route Tests
 * 
 * Tests for the /api/health endpoint to ensure system monitoring works correctly.
 */

import { GET } from '../route';
import { query } from '@/lib/db';
import { getRegions } from '@/lib/utils/location';

// Mock the database query
jest.mock('@/lib/db', () => ({
  query: jest.fn(),
}));

// Mock the location utilities
jest.mock('@/lib/utils/location', () => ({
  getRegions: jest.fn(),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockGetRegions = getRegions as jest.MockedFunction<typeof getRegions>;

describe('/api/health', () => {
  // Store original environment variables
  const originalEnv = process.env;
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Reset process.env to a clean state
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      JWT_SECRET: 'test-jwt-secret-key-minimum-32-characters',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db'
    };    // Reset mocks to successful defaults
    mockQuery.mockResolvedValue({ 
      rows: [{ health_check: 1 }], 
      command: 'SELECT', 
      rowCount: 1, 
      oid: 0, 
      fields: [] 
    });
    mockGetRegions.mockReturnValue([
      { 
        reg_id: 1, 
        code_correspondence: '130000000', 
        name: 'NCR', 
        altName: 'National Capital Region',
        code: '13',
        geo_level: 'Reg',
        remarks: null
      }
    ]);
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
    jest.restoreAllMocks();
  });  it('should return healthy status when all checks pass', async () => {
    // Mock successful database query
    mockQuery.mockResolvedValue({ 
      rows: [{ health_check: 1 }], 
      command: 'SELECT', 
      rowCount: 1, 
      oid: 0, 
      fields: [] 
    });// Mock successful PSGC data
    mockGetRegions.mockReturnValue([
      { 
        reg_id: 1, 
        code_correspondence: '130000000', 
        name: 'NCR', 
        altName: 'National Capital Region',
        code: '13',
        geo_level: 'Reg',
        remarks: null
      },
      { 
        reg_id: 2, 
        code_correspondence: '140000000', 
        name: 'CAR', 
        altName: 'Cordillera Administrative Region',
        code: '14',
        geo_level: 'Reg',
        remarks: null
      },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.services.database).toBe('connected');
    expect(data.services.authentication).toBe('active');
    expect(data.checks.database_query).toBe(true);
    expect(data.checks.jwt_secret).toBe(true);
    expect(data.checks.environment_vars).toBe(true);
    expect(data.checks.psgc_data).toBe(true);
    expect(data.environment).toBe('test');
    expect(data.metadata?.response_time_ms).toBeGreaterThan(0);
  });  it('should return unhealthy status when database connection fails', async () => {
    // Mock database connection failure
    mockQuery.mockRejectedValue(new Error('Database connection failed'));

    // Mock successful PSGC data
    mockGetRegions.mockReturnValue([{ 
      reg_id: 1, 
      code_correspondence: '130000000', 
      name: 'NCR', 
      altName: 'National Capital Region',
      code: '13',
      geo_level: 'Reg',
      remarks: null
    }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.services.database).toBe('error');
    expect(data.checks.database_query).toBe(false);
  });

  it('should return degraded status when JWT secret is missing', async () => {
    // Remove JWT secret
    delete process.env.JWT_SECRET;

    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock successful PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([{ reg_id: 1, reg_name: 'NCR' }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('degraded');
    expect(data.services.authentication).toBe('inactive');
    expect(data.checks.jwt_secret).toBe(false);
    expect(data.metadata?.warnings).toContain('JWT_SECRET is not set or too short');
  });

  it('should return degraded status when JWT secret is too short', async () => {
    // Set a short JWT secret
    process.env.JWT_SECRET = 'short';

    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock successful PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([{ reg_id: 1, reg_name: 'NCR' }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('degraded');
    expect(data.services.authentication).toBe('inactive');
    expect(data.checks.jwt_secret).toBe(false);
    expect(data.metadata?.warnings).toContain('JWT_SECRET is not set or too short');
  });

  it('should return degraded status when environment variables are missing', async () => {
    // Remove required environment variable
    delete process.env.DATABASE_URL;

    // Mock successful database query (even though DATABASE_URL is missing)
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock successful PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([{ reg_id: 1, reg_name: 'NCR' }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('degraded');
    expect(data.checks.environment_vars).toBe(false);
    expect(data.metadata?.warnings).toContain('Missing environment variables: DATABASE_URL');
  });

  it('should return degraded status when PSGC data is empty', async () => {
    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock empty PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('degraded');
    expect(data.checks.psgc_data).toBe(false);
    expect(data.metadata?.warnings).toContain('PSGC data appears to be empty');
  });

  it('should return degraded status when PSGC data import fails', async () => {
    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock PSGC data import failure
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockImplementation(() => {
      throw new Error('Failed to import PSGC data');
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('degraded');
    expect(data.checks.psgc_data).toBe(false);
    expect(data.metadata?.warnings).toContain('PSGC data import failed');
  });

  it('should include correct metadata in response', async () => {
    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock successful PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([{ reg_id: 1, reg_name: 'NCR' }]);

    const response = await GET();
    const data = await response.json();    expect(data.metadata).toBeDefined();
    expect(data.metadata?.node_version).toBeDefined();
    expect(data.metadata?.memory_usage).toBeDefined();
    expect(data.metadata?.response_time_ms).toBeGreaterThanOrEqual(0);
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeGreaterThanOrEqual(0);
    expect(data.version).toBeDefined();
  });

  it('should set correct cache headers', async () => {
    // Mock successful database query
    const { query } = require('@/lib/db');
    query.mockResolvedValue({ rows: [{ health_check: 1 }] });

    // Mock successful PSGC data
    const { getRegions } = require('@/lib/utils/location');
    getRegions.mockReturnValue([{ reg_id: 1, reg_name: 'NCR' }]);

    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    expect(response.headers.get('Pragma')).toBe('no-cache');
    expect(response.headers.get('Expires')).toBe('0');
  });
  it('should handle catastrophic failures gracefully', async () => {
    // Mock database query to throw an error that prevents health check initialization
    mockQuery.mockImplementation(() => {
      throw new Error('Catastrophic database failure');
    });

    // Mock PSGC data to also fail
    mockGetRegions.mockImplementation(() => {
      throw new Error('PSGC module import failed');
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.metadata?.error).toBeDefined();
  });
});
