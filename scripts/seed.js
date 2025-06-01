#!/usr/bin/env node

/**
 * Database Seeding Script for DROMIC-IS
 * 
 * This script populates the database with initial data for the staging environment.
 * It creates default user levels, system settings, and sample data for testing.
 * 
 * Usage:
 *   npm run db:seed
 *   node scripts/seed.js
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
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
 * Seed data definitions
 */
const seedData = {
  userLevels: [
    {
      position: 'Super Admin',
      abbreviation: 'SA',
      userLevel: 9,
      permissions: {
        all: true,
        system_admin: true,
        user_management: true,
        incident_management: true,
        reports: true,
        settings: true
      }
    },
    {
      position: 'Admin',
      abbreviation: 'ADMIN',
      userLevel: 8,
      permissions: {
        user_management: true,
        incident_management: true,
        evacuation_management: true,
        assistance_management: true,
        reports: true
      }
    },
    {
      position: 'Director',
      abbreviation: 'DIR',
      userLevel: 7,
      permissions: {
        incident_management: true,
        evacuation_management: true,
        assistance_management: true,
        reports: true,
        approve_assistance: true
      }
    },
    {
      position: 'Regional Director',
      abbreviation: 'RD',
      userLevel: 6,
      permissions: {
        incident_management: true,
        evacuation_management: true,
        assistance_management: true,
        reports: true,
        regional_oversight: true
      }
    },
    {
      position: 'Secretary',
      abbreviation: 'SEC',
      userLevel: 5,
      permissions: {
        incident_management: true,
        evacuation_management: true,
        assistance_management: true,
        reports: true
      }
    },
    {
      position: 'Central Officer',
      abbreviation: 'CO',
      userLevel: 4,
      permissions: {
        incident_management: true,
        evacuation_management: true,
        assistance_management: true,
        reports: true
      }
    },
    {
      position: 'Field Officer',
      abbreviation: 'FO',
      userLevel: 3,
      permissions: {
        incident_reporting: true,
        evacuation_reporting: true,
        assistance_distribution: true,
        field_reports: true
      }
    },
    {
      position: 'Team Leader',
      abbreviation: 'TL',
      userLevel: 2,
      permissions: {
        incident_reporting: true,
        evacuation_reporting: true,
        team_management: true
      }
    },
    {
      position: 'Local Government Unit',
      abbreviation: 'LGU',
      userLevel: 1,
      permissions: {
        incident_reporting: true,
        local_coordination: true,
        evacuation_coordination: true
      }
    }
  ],

  systemSettings: [
    {
      setting_key: 'app_name',
      setting_value: { value: 'DROMIC-IS' },
      description: 'Application name displayed in the UI',
      category: 'general',
      is_public: true
    },
    {
      setting_key: 'app_version',
      setting_value: { value: '0.1.0' },
      description: 'Current application version',
      category: 'general',
      is_public: true
    },
    {
      setting_key: 'maintenance_mode',
      setting_value: { enabled: false, message: 'System is under maintenance' },
      description: 'Maintenance mode configuration',
      category: 'system',
      is_public: false
    },
    {
      setting_key: 'notification_settings',
      setting_value: {
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        default_priority: 'Medium'
      },
      description: 'Global notification settings',
      category: 'notifications',
      is_public: false
    },
    {
      setting_key: 'security_settings',
      setting_value: {
        password_min_length: 8,
        password_require_uppercase: true,
        password_require_lowercase: true,
        password_require_numbers: true,
        password_require_symbols: false,
        max_login_attempts: 5,
        lockout_duration_minutes: 15,
        session_timeout_minutes: 30
      },
      description: 'Security and authentication settings',
      category: 'security',
      is_public: false
    },
    {
      setting_key: 'incident_types',
      setting_value: {
        types: [
          'Typhoon',
          'Flood',
          'Earthquake',
          'Landslide',
          'Fire',
          'Volcanic Eruption',
          'Drought',
          'El Niño',
          'La Niña',
          'Storm Surge',
          'Tsunami',
          'Other Natural Disaster',
          'Man-made Disaster',
          'Health Emergency',
          'Transportation Accident'
        ]
      },
      description: 'Available incident types for reporting',
      category: 'incidents',
      is_public: true
    },
    {
      setting_key: 'assistance_types',
      setting_value: {
        types: [
          'Food Packs',
          'Relief Goods',
          'Cash Assistance',
          'Medical Assistance',
          'Shelter Materials',
          'Clothing',
          'Hygiene Kits',
          'Kitchen Utensils',
          'Sleeping Materials',
          'Educational Supplies',
          'Livelihood Assistance',
          'Psychosocial Support',
          'Emergency Shelter',
          'Temporary Shelter',
          'Other Assistance'
        ]
      },
      description: 'Available assistance types for distribution',
      category: 'assistance',
      is_public: true
    },
    {
      setting_key: 'dashboard_refresh_interval',
      setting_value: { seconds: 30 },
      description: 'Dashboard auto-refresh interval in seconds',
      category: 'ui',
      is_public: true
    }
  ],

  // Sample incidents for testing
  sampleIncidents: [
    {
      incident_code: 'TY-2024-001',
      incident_type: 'Typhoon',
      incident_name: 'Typhoon Kristine',
      description: 'Strong typhoon affecting northern regions with sustained winds of 150 km/h',
      severity_level: 'High',
      status: 'Active',
      region: 'Region I',
      province: 'Ilocos Norte',
      city: 'Laoag City',
      barangay: 'San Lorenzo',
      coordinates: { lat: 18.1969, lng: 120.5936 },
      affected_families: 150,
      affected_persons: 600,
      casualties: { dead: 0, injured: 5, missing: 1 }
    },
    {
      incident_code: 'FL-2024-002',
      incident_type: 'Flood',
      incident_name: 'Metro Manila Flash Flood',
      description: 'Heavy rainfall causing flash floods in low-lying areas',
      severity_level: 'Medium',
      status: 'Monitoring',
      region: 'NCR',
      province: 'Metro Manila',
      city: 'Quezon City',
      barangay: 'Commonwealth',
      coordinates: { lat: 14.6760, lng: 121.0437 },
      affected_families: 85,
      affected_persons: 340,
      casualties: { dead: 0, injured: 2, missing: 0 }
    },
    {
      incident_code: 'EQ-2024-003',
      incident_type: 'Earthquake',
      incident_name: 'Mindanao Earthquake',
      description: '6.2 magnitude earthquake with epicenter in Davao Region',
      severity_level: 'High',
      status: 'Resolved',
      region: 'Region XI',
      province: 'Davao del Sur',
      city: 'Digos City',
      barangay: 'Zone 1',
      coordinates: { lat: 6.7496, lng: 125.3545 },
      affected_families: 200,
      affected_persons: 800,
      casualties: { dead: 1, injured: 15, missing: 0 }
    }
  ],

  // Sample evacuation centers
  sampleEvacuationCenters: [
    {
      center_name: 'Laoag City Central School',
      center_type: 'School',
      capacity: 500,
      current_occupancy: 120,
      region: 'Region I',
      province: 'Ilocos Norte',
      city: 'Laoag City',
      barangay: 'San Lorenzo',
      complete_address: 'General Luna St, Laoag City, Ilocos Norte',
      coordinates: { lat: 18.1969, lng: 120.5936 },
      facilities: ['Classrooms', 'Restrooms', 'Kitchen', 'Medical Station'],
      contact_person: 'Maria Santos',
      contact_number: '09171234567',
      status: 'Available'
    },
    {
      center_name: 'Commonwealth Elementary School',
      center_type: 'School',
      capacity: 300,
      current_occupancy: 75,
      region: 'NCR',
      province: 'Metro Manila',
      city: 'Quezon City',
      barangay: 'Commonwealth',
      complete_address: 'Commonwealth Avenue, Quezon City',
      coordinates: { lat: 14.6760, lng: 121.0437 },
      facilities: ['Classrooms', 'Restrooms', 'Cafeteria'],
      contact_person: 'Juan Cruz',
      contact_number: '09181234567',
      status: 'Available'
    },
    {
      center_name: 'Digos City Gymnasium',
      center_type: 'Gymnasium',
      capacity: 800,
      current_occupancy: 150,
      region: 'Region XI',
      province: 'Davao del Sur',
      city: 'Digos City',
      barangay: 'Zone 1',
      complete_address: 'Rizal Avenue, Digos City, Davao del Sur',
      coordinates: { lat: 6.7496, lng: 125.3545 },
      facilities: ['Basketball Court', 'Restrooms', 'Stage', 'Storage'],
      contact_person: 'Pedro Mendoza',
      contact_number: '09191234567',
      status: 'Available'
    }
  ],

  // Sample assistance records
  sampleAssistanceRecords: [
    {
      record_code: 'AST-2024-001',
      family_head_name: 'Roberto Dela Cruz',
      family_members: 5,
      assistance_type: 'Food Packs',
      assistance_details: { items: ['Rice', 'Canned Goods', 'Noodles'], packs: 2 },
      quantity: 2,
      region: 'Region I',
      province: 'Ilocos Norte',
      city: 'Laoag City',
      barangay: 'San Lorenzo',
      beneficiary_address: 'Purok 1, San Lorenzo, Laoag City',
      status: 'Distributed'
    },
    {
      record_code: 'AST-2024-002',
      family_head_name: 'Maria Garcia',
      family_members: 3,
      assistance_type: 'Cash Assistance',
      assistance_details: { purpose: 'Emergency Relief', category: 'Immediate' },
      amount: 5000.00,
      quantity: 1,
      region: 'NCR',
      province: 'Metro Manila',
      city: 'Quezon City',
      barangay: 'Commonwealth',
      beneficiary_address: 'Block 5, Commonwealth, Quezon City',
      status: 'Approved'
    },
    {
      record_code: 'AST-2024-003',
      family_head_name: 'Antonio Reyes',
      family_members: 7,
      assistance_type: 'Relief Goods',
      assistance_details: { items: ['Blankets', 'Clothing', 'Hygiene Kits'] },
      quantity: 3,
      region: 'Region XI',
      province: 'Davao del Sur',
      city: 'Digos City',
      barangay: 'Zone 1',
      beneficiary_address: 'Rizal Street, Zone 1, Digos City',
      status: 'Completed'
    }
  ]
};

/**
 * Create default admin user
 */
async function createDefaultAdmin(client, userLevelId) {
  const profileId = uuidv4();
  const accountId = uuidv4();
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  
  // Create profile
  await client.query(`
    INSERT INTO profile (
      id, firstname, lastname, phone_number, address, job_title,
      region, province, city, barangay, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `, [
    profileId,
    'System',
    'Administrator',
    '09171234567',
    'DSWD Central Office',
    'System Administrator',
    'NCR',
    'Metro Manila',
    'Manila',
    'Ermita',
    'Active'
  ]);
  
  // Create account
  await client.query(`
    INSERT INTO account (
      id, username, email, password, status, "profileId", "user_levelId",
      email_verified, terms_accepted, privacy_policy_accepted
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `, [
    accountId,
    'admin',
    'admin@dromic.dswd.gov.ph',
    hashedPassword,
    'Active',
    profileId,
    userLevelId,
    true,
    true,
    true
  ]);
  
  console.log('👤 Created default admin user:');
  console.log('   Username: admin');
  console.log('   Email: admin@dromic.dswd.gov.ph');
  console.log('   Password: admin123!');
  console.log('   ⚠️  Change password after first login!');
  
  return accountId;
}

/**
 * Seed user levels
 */
async function seedUserLevels(client) {
  console.log('🔐 Seeding user levels...');
  
  const userLevelIds = {};
  
  for (const level of seedData.userLevels) {
    const result = await client.query(`
      INSERT INTO user_level (position, abbreviation, "userLevel", permissions, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (position) DO UPDATE SET
        abbreviation = EXCLUDED.abbreviation,
        "userLevel" = EXCLUDED."userLevel",
        permissions = EXCLUDED.permissions,
        updated_at = NOW()
      RETURNING id
    `, [
      level.position,
      level.abbreviation,
      level.userLevel,
      JSON.stringify(level.permissions),
      'Active'
    ]);
    
    userLevelIds[level.position] = result.rows[0].id;
  }
  
  console.log(`✅ Seeded ${seedData.userLevels.length} user levels`);
  return userLevelIds;
}

/**
 * Seed system settings
 */
async function seedSystemSettings(client, adminId) {
  console.log('⚙️ Seeding system settings...');
  
  for (const setting of seedData.systemSettings) {
    await client.query(`
      INSERT INTO system_settings (setting_key, setting_value, description, category, is_public, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (setting_key) DO UPDATE SET
        setting_value = EXCLUDED.setting_value,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        is_public = EXCLUDED.is_public,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
    `, [
      setting.setting_key,
      JSON.stringify(setting.setting_value),
      setting.description,
      setting.category,
      setting.is_public,
      adminId
    ]);
  }
  
  console.log(`✅ Seeded ${seedData.systemSettings.length} system settings`);
}

/**
 * Seed sample incidents
 */
async function seedSampleIncidents(client, adminId) {
  console.log('🚨 Seeding sample incidents...');
  
  const incidentIds = [];
  
  for (const incident of seedData.sampleIncidents) {
    const result = await client.query(`
      INSERT INTO incidents (
        incident_code, incident_type, incident_name, description, severity_level,
        status, region, province, city, barangay, coordinates,
        reported_by, date_occurred, date_reported, affected_families,
        affected_persons, casualties
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (incident_code) DO NOTHING
      RETURNING id
    `, [
      incident.incident_code,
      incident.incident_type,
      incident.incident_name,
      incident.description,
      incident.severity_level,
      incident.status,
      incident.region,
      incident.province,
      incident.city,
      incident.barangay,
      JSON.stringify(incident.coordinates),
      adminId,
      new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000), // Reported after occurred
      incident.affected_families,
      incident.affected_persons,
      JSON.stringify(incident.casualties)
    ]);
    
    if (result.rows.length > 0) {
      incidentIds.push(result.rows[0].id);
    }
  }
  
  console.log(`✅ Seeded ${incidentIds.length} sample incidents`);
  return incidentIds;
}

/**
 * Seed sample evacuation centers
 */
async function seedSampleEvacuationCenters(client, adminId) {
  console.log('🏫 Seeding sample evacuation centers...');
  
  for (const center of seedData.sampleEvacuationCenters) {
    await client.query(`
      INSERT INTO evacuation_centers (
        center_name, center_type, capacity, current_occupancy,
        region, province, city, barangay, complete_address,
        coordinates, facilities, contact_person, contact_number,
        managed_by, status, opened_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (center_name) DO NOTHING
    `, [
      center.center_name,
      center.center_type,
      center.capacity,
      center.current_occupancy,
      center.region,
      center.province,
      center.city,
      center.barangay,
      center.complete_address,
      JSON.stringify(center.coordinates),
      JSON.stringify(center.facilities),
      center.contact_person,
      center.contact_number,
      adminId,
      center.status,
      new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) // Random date within last 5 days
    ]);
  }
  
  console.log(`✅ Seeded ${seedData.sampleEvacuationCenters.length} sample evacuation centers`);
}

/**
 * Seed sample assistance records
 */
async function seedSampleAssistanceRecords(client, adminId, incidentIds) {
  console.log('📦 Seeding sample assistance records...');
  
  for (let i = 0; i < seedData.sampleAssistanceRecords.length; i++) {
    const record = seedData.sampleAssistanceRecords[i];
    const incidentId = incidentIds[i] || incidentIds[0]; // Use corresponding incident or first one
    
    await client.query(`
      INSERT INTO assistance_records (
        record_code, incident_id, family_head_name, family_members,
        assistance_type, assistance_details, amount, quantity,
        region, province, city, barangay, beneficiary_address,
        distributed_by, status, distribution_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (record_code) DO NOTHING
    `, [
      record.record_code,
      incidentId,
      record.family_head_name,
      record.family_members,
      record.assistance_type,
      JSON.stringify(record.assistance_details),
      record.amount || 0,
      record.quantity,
      record.region,
      record.province,
      record.city,
      record.barangay,
      record.beneficiary_address,
      adminId,
      record.status,
      record.status === 'Distributed' ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null
    ]);
  }
  
  console.log(`✅ Seeded ${seedData.sampleAssistanceRecords.length} sample assistance records`);
}

/**
 * Execute seeding
 */
async function seed() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    
    console.log('🌱 Starting database seeding...');
    
    // Check if data already exists
    const userLevelCount = await client.query('SELECT COUNT(*) FROM user_level');
    if (parseInt(userLevelCount.rows[0].count) > 0) {
      console.log('📊 Data already exists. Use --force to reseed.');
      const force = process.argv.includes('--force');
      if (!force) {
        console.log('ℹ️  Run with --force flag to reseed existing data');
        return { success: true, message: 'Data already exists' };
      }
      console.log('🔄 Force reseeding...');
    }
    
    // Seed user levels
    const userLevelIds = await seedUserLevels(client);
    
    // Create default admin user
    const adminId = await createDefaultAdmin(client, userLevelIds['Super Admin']);
    
    // Seed system settings
    await seedSystemSettings(client, adminId);
    
    // Seed sample data
    const incidentIds = await seedSampleIncidents(client, adminId);
    await seedSampleEvacuationCenters(client, adminId);
    await seedSampleAssistanceRecords(client, adminId, incidentIds);
    
    // Verify seeding
    console.log('✅ Verifying seeding...');
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM user_level'),
      client.query('SELECT COUNT(*) FROM account'),
      client.query('SELECT COUNT(*) FROM system_settings'),
      client.query('SELECT COUNT(*) FROM incidents'),
      client.query('SELECT COUNT(*) FROM evacuation_centers'),
      client.query('SELECT COUNT(*) FROM assistance_records')
    ]);
    
    const [userLevels, accounts, settings, incidents, centers, assistance] = counts.map(r => parseInt(r.rows[0].count));
    
    console.log('📊 Seeding Summary:');
    console.log(`   - User Levels: ${userLevels}`);
    console.log(`   - Accounts: ${accounts}`);
    console.log(`   - System Settings: ${settings}`);
    console.log(`   - Incidents: ${incidents}`);
    console.log(`   - Evacuation Centers: ${centers}`);
    console.log(`   - Assistance Records: ${assistance}`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    return {
      success: true,
      userLevels,
      accounts,
      settings,
      incidents,
      centers,
      assistance
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  seed()
    .then(result => {
      if (result.message) {
        console.log(`ℹ️  ${result.message}`);
      } else {
        console.log('✨ Database ready for use!');
        console.log('🔐 Default login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123!');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding error:', error.message);
      process.exit(1);
    });
}

module.exports = { seed, seedData };
