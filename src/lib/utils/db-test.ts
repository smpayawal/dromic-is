import { query } from '@/lib/db';

/**
 * Test database connection and fetch user levels
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    
    // Test fetching user levels
    const userLevels = await query('SELECT * FROM user_level ORDER BY "userLevel"');
    console.log('✅ User levels fetched:', userLevels.rows.length, 'records');
    
    return {
      success: true,
      timestamp: result.rows[0].current_time,
      userLevels: userLevels.rows
    };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
