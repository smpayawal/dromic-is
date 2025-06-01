import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  environment: string;
  version: string;
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected' | 'error';
    api: 'operational' | 'degraded' | 'down';
    authentication: 'active' | 'inactive' | 'error';
    external_services: 'available' | 'limited' | 'unavailable';
  };
  checks: {
    database_query: boolean;
    jwt_secret: boolean;
    environment_vars: boolean;
    psgc_data: boolean;
  };  metadata?: {
    error?: string;
    warnings?: string[];
    node_version: string;
    memory_usage: NodeJS.MemoryUsage;
    response_time_ms?: number;
  };
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Initialize health status
    const healthStatus: HealthStatus = {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'disconnected',
        api: 'operational',
        authentication: 'inactive',
        external_services: 'available',
      },
      checks: {
        database_query: false,
        jwt_secret: false,
        environment_vars: false,
        psgc_data: false,
      },
      metadata: {
        warnings: [],
        node_version: process.version,
        memory_usage: process.memoryUsage(),
      },
    };

    // Check database connection
    try {
      await query('SELECT 1 as health_check');
      healthStatus.services.database = 'connected';
      healthStatus.checks.database_query = true;
    } catch (dbError) {
      healthStatus.services.database = 'error';
      healthStatus.status = 'unhealthy';
      healthStatus.metadata!.error = `Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    }

    // Check JWT secret
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
      healthStatus.checks.jwt_secret = true;
      healthStatus.services.authentication = 'active';
    } else {
      healthStatus.metadata!.warnings!.push('JWT_SECRET is not set or too short');
      healthStatus.status = healthStatus.status === 'healthy' ? 'degraded' : healthStatus.status;
    }

    // Check critical environment variables
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length === 0) {
      healthStatus.checks.environment_vars = true;
    } else {
      healthStatus.metadata!.warnings!.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
      healthStatus.status = healthStatus.status === 'healthy' ? 'degraded' : healthStatus.status;
    }

    // Check PSGC data availability (basic check)
    try {
      // Simple check to see if we can import the location utilities
      const { getRegions } = await import('@/lib/utils/location');
      const regions = getRegions();
      if (regions && regions.length > 0) {
        healthStatus.checks.psgc_data = true;
      } else {
        healthStatus.metadata!.warnings!.push('PSGC data appears to be empty');
        healthStatus.status = healthStatus.status === 'healthy' ? 'degraded' : healthStatus.status;
      }
    } catch (psgcError) {
      healthStatus.metadata!.warnings!.push('PSGC data import failed');
      healthStatus.status = healthStatus.status === 'healthy' ? 'degraded' : healthStatus.status;
    }

    // Check external services (mock for now)
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to check external APIs
      // For now, we'll just mark as available
      healthStatus.services.external_services = 'available';
    }    // Calculate response time and add to metadata
    const responseTime = Date.now() - startTime;
    healthStatus.metadata!.response_time_ms = responseTime;

    // Determine HTTP status code based on health status
    const httpStatus = healthStatus.status === 'healthy' ? 200 
                     : healthStatus.status === 'degraded' ? 200 
                     : 503;

    return NextResponse.json(healthStatus, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    // Catastrophic failure
    const errorStatus: HealthStatus = {
      status: 'unhealthy',
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'error',
        api: 'down',
        authentication: 'error',
        external_services: 'unavailable',
      },
      checks: {
        database_query: false,
        jwt_secret: false,
        environment_vars: false,
        psgc_data: false,
      },
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        node_version: process.version,
        memory_usage: process.memoryUsage(),
        response_time_ms: Date.now() - startTime,
      },
    };

    return NextResponse.json(errorStatus, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}
