#!/usr/bin/env node

/**
 * Database Migration Script for DROMIC-IS
 * 
 * This script handles database schema creation and migration for the staging environment.
 * It creates all necessary tables with proper indexes, constraints, and audit triggers.
 * 
 * Usage:
 *   npm run db:migrate
 *   node scripts/migrate.js
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.staging' });

/**
 * Database configuration from environment variables
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'dromic_staging',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

/**
 * SQL schemas for DROMIC-IS database tables
 */
const schemas = {
  // Enable UUID extension
  extensions: `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  `,

  // User Level table (Positions/Roles)
  userLevel: `
    CREATE TABLE IF NOT EXISTS user_level (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      position VARCHAR(100) NOT NULL UNIQUE,
      abbreviation VARCHAR(20),
      "userLevel" INTEGER NOT NULL DEFAULT 1,
      permissions JSONB DEFAULT '{}',
      status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_user_level_position ON user_level(position);
    CREATE INDEX IF NOT EXISTS idx_user_level_status ON user_level(status);
  `,

  // Profile table
  profile: `
    CREATE TABLE IF NOT EXISTS profile (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      firstname VARCHAR(100) NOT NULL,
      middlename VARCHAR(100),
      lastname VARCHAR(100) NOT NULL,
      name_ext VARCHAR(10),
      date_of_birth DATE,
      phone_number VARCHAR(20),
      address TEXT,
      job_title VARCHAR(100),
      division VARCHAR(100),
      region VARCHAR(100),
      province VARCHAR(100),
      city VARCHAR(100),
      barangay VARCHAR(100),
      image_url TEXT,
      status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_profile_name ON profile(firstname, lastname);
    CREATE INDEX IF NOT EXISTS idx_profile_location ON profile(region, province, city);
    CREATE INDEX IF NOT EXISTS idx_profile_status ON profile(status);
  `,

  // Account table
  account: `
    CREATE TABLE IF NOT EXISTS account (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Locked')),
      "profileId" UUID REFERENCES profile(id) ON DELETE CASCADE,
      "user_levelId" UUID REFERENCES user_level(id) ON DELETE SET NULL,
      last_login TIMESTAMP WITH TIME ZONE,
      last_password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      failed_login_attempts INTEGER DEFAULT 0,
      account_locked_until TIMESTAMP WITH TIME ZONE,
      email_verified BOOLEAN DEFAULT FALSE,
      email_verification_token VARCHAR(255),
      password_reset_token VARCHAR(255),
      password_reset_expires TIMESTAMP WITH TIME ZONE,
      terms_accepted BOOLEAN DEFAULT FALSE,
      privacy_policy_accepted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_account_username ON account(username);
    CREATE INDEX IF NOT EXISTS idx_account_email ON account(email);
    CREATE INDEX IF NOT EXISTS idx_account_status ON account(status);
    CREATE INDEX IF NOT EXISTS idx_account_profile ON account("profileId");
    CREATE INDEX IF NOT EXISTS idx_account_user_level ON account("user_levelId");
    CREATE INDEX IF NOT EXISTS idx_account_last_login ON account(last_login);
  `,

  // Activity Log table for audit trails
  activityLog: `
    CREATE TABLE IF NOT EXISTS activity_log (
      log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id UUID REFERENCES account(id) ON DELETE SET NULL,
      activity_type VARCHAR(50) NOT NULL,
      activity_category VARCHAR(50) NOT NULL,
      target_table VARCHAR(100),
      target_id UUID,
      target_name VARCHAR(255),
      action_details JSONB,
      before_state JSONB,
      after_state JSONB,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ip_address INET,
      device_info TEXT,
      status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'error')),
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_activity_log_account ON activity_log(account_id);
    CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);
    CREATE INDEX IF NOT EXISTS idx_activity_log_category ON activity_log(activity_category);
    CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
    CREATE INDEX IF NOT EXISTS idx_activity_log_target ON activity_log(target_table, target_id);
    CREATE INDEX IF NOT EXISTS idx_activity_log_status ON activity_log(status);
  `,

  // DROMIC-specific tables
  incidents: `
    CREATE TABLE IF NOT EXISTS incidents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      incident_code VARCHAR(50) UNIQUE,
      incident_type VARCHAR(100) NOT NULL,
      incident_name VARCHAR(255) NOT NULL,
      description TEXT,
      severity_level VARCHAR(20) DEFAULT 'Low' CHECK (severity_level IN ('Low', 'Medium', 'High', 'Critical')),
      status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Resolved', 'Monitoring', 'Closed')),
      region VARCHAR(100),
      province VARCHAR(100),
      city VARCHAR(100),
      barangay VARCHAR(100),
      coordinates JSONB,
      reported_by UUID REFERENCES account(id),
      assigned_to UUID REFERENCES account(id),
      date_occurred TIMESTAMP WITH TIME ZONE,
      date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      date_resolved TIMESTAMP WITH TIME ZONE,
      affected_families INTEGER DEFAULT 0,
      affected_persons INTEGER DEFAULT 0,
      casualties JSONB DEFAULT '{"dead": 0, "injured": 0, "missing": 0}',
      damage_assessment JSONB,
      response_actions JSONB,
      resources_deployed JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_incidents_code ON incidents(incident_code);
    CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(incident_type);
    CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
    CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity_level);
    CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents(region, province, city);
    CREATE INDEX IF NOT EXISTS idx_incidents_reported_by ON incidents(reported_by);
    CREATE INDEX IF NOT EXISTS idx_incidents_assigned_to ON incidents(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_incidents_date_occurred ON incidents(date_occurred);
  `,

  evacuationCenters: `
    CREATE TABLE IF NOT EXISTS evacuation_centers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      center_name VARCHAR(255) NOT NULL,
      center_type VARCHAR(50) DEFAULT 'School' CHECK (center_type IN ('School', 'Barangay Hall', 'Church', 'Gymnasium', 'Other')),
      capacity INTEGER DEFAULT 0,
      current_occupancy INTEGER DEFAULT 0,
      region VARCHAR(100),
      province VARCHAR(100),
      city VARCHAR(100),
      barangay VARCHAR(100),
      complete_address TEXT,
      coordinates JSONB,
      facilities JSONB DEFAULT '[]',
      contact_person VARCHAR(255),
      contact_number VARCHAR(20),
      managed_by UUID REFERENCES account(id),
      status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Full', 'Unavailable', 'Maintenance')),
      opened_date TIMESTAMP WITH TIME ZONE,
      closed_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_evacuation_centers_name ON evacuation_centers(center_name);
    CREATE INDEX IF NOT EXISTS idx_evacuation_centers_type ON evacuation_centers(center_type);
    CREATE INDEX IF NOT EXISTS idx_evacuation_centers_status ON evacuation_centers(status);
    CREATE INDEX IF NOT EXISTS idx_evacuation_centers_location ON evacuation_centers(region, province, city);
    CREATE INDEX IF NOT EXISTS idx_evacuation_centers_managed_by ON evacuation_centers(managed_by);
  `,

  assistanceRecords: `
    CREATE TABLE IF NOT EXISTS assistance_records (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      record_code VARCHAR(50) UNIQUE,
      incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
      family_head_name VARCHAR(255) NOT NULL,
      family_members INTEGER DEFAULT 1,
      assistance_type VARCHAR(100) NOT NULL,
      assistance_details JSONB,
      amount DECIMAL(12,2) DEFAULT 0,
      quantity INTEGER DEFAULT 1,
      distribution_date TIMESTAMP WITH TIME ZONE,
      region VARCHAR(100),
      province VARCHAR(100),
      city VARCHAR(100),
      barangay VARCHAR(100),
      beneficiary_address TEXT,
      distributed_by UUID REFERENCES account(id),
      verified_by UUID REFERENCES account(id),
      status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Distributed', 'Completed', 'Cancelled')),
      remarks TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_assistance_records_code ON assistance_records(record_code);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_incident ON assistance_records(incident_id);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_type ON assistance_records(assistance_type);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_status ON assistance_records(status);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_location ON assistance_records(region, province, city);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_distributed_by ON assistance_records(distributed_by);
    CREATE INDEX IF NOT EXISTS idx_assistance_records_distribution_date ON assistance_records(distribution_date);
  `,

  // System settings and configurations
  systemSettings: `
    CREATE TABLE IF NOT EXISTS system_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value JSONB,
      description TEXT,
      category VARCHAR(50) DEFAULT 'general',
      is_public BOOLEAN DEFAULT FALSE,
      updated_by UUID REFERENCES account(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
    CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
    CREATE INDEX IF NOT EXISTS idx_system_settings_public ON system_settings(is_public);
  `,

  // Notification table
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      recipient_id UUID REFERENCES account(id) ON DELETE CASCADE,
      notification_type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      is_read BOOLEAN DEFAULT FALSE,
      read_at TIMESTAMP WITH TIME ZONE,
      priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
    CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
    CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
  `
};

/**
 * Update timestamp trigger function
 */
const updateTimestampFunction = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

/**
 * Update timestamp triggers for tables
 */
const updateTimestampTriggers = [
  'user_level',
  'profile', 
  'account',
  'incidents',
  'evacuation_centers',
  'assistance_records',
  'system_settings'
].map(table => `
  DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
  CREATE TRIGGER update_${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`).join('\n');

/**
 * Execute migration
 */
async function migrate() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    
    console.log('📊 Starting database migration...');
    
    // Create extensions
    console.log('🔧 Creating extensions...');
    await client.query(schemas.extensions);
    
    // Create tables in order (respecting foreign key dependencies)
    const tableOrder = [
      'userLevel',
      'profile', 
      'account',
      'activityLog',
      'incidents',
      'evacuationCenters',
      'assistanceRecords',
      'systemSettings',
      'notifications'
    ];
    
    for (const table of tableOrder) {
      console.log(`📋 Creating ${table} table...`);
      await client.query(schemas[table]);
    }
    
    // Create update timestamp function
    console.log('⚙️ Creating update timestamp function...');
    await client.query(updateTimestampFunction);
    
    // Create update timestamp triggers
    console.log('🎯 Creating update timestamp triggers...');
    await client.query(updateTimestampTriggers);
    
    // Verify migration
    console.log('✅ Verifying migration...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Created tables:', tables);
    
    // Check indexes
    const indexesResult = await client.query(`
      SELECT schemaname, tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);
    
    console.log(`🔍 Created ${indexesResult.rows.length} indexes`);
    
    console.log('🎉 Database migration completed successfully!');
    
    return {
      success: true,
      tables: tables.length,
      indexes: indexesResult.rows.length
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  migrate()
    .then(result => {
      console.log('📈 Migration Summary:');
      console.log(`   - Tables created: ${result.tables}`);
      console.log(`   - Indexes created: ${result.indexes}`);
      console.log('✨ Ready for seeding!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration error:', error.message);
      process.exit(1);
    });
}

module.exports = { migrate, dbConfig };
