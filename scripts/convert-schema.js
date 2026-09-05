const fs = require('fs');

const path = 'prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');

// Convert Postgres to SQLite
schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');

// Remove enum definitions
schema = schema.replace(/enum UserRole {[^}]*}/g, '');
schema = schema.replace(/enum ContentStatus {[^}]*}/g, '');
schema = schema.replace(/enum DarshanType {[^}]*}/g, '');
schema = schema.replace(/enum EntityType {[^}]*}/g, '');

// Replace enum usages with String
schema = schema.replace(/UserRole\s+@default\(USER\)/g, 'String @default("USER")');
schema = schema.replace(/ContentStatus\s+@default\(PUBLISHED\)/g, 'String @default("PUBLISHED")');
schema = schema.replace(/ContentStatus\s+@default\(PENDING\)/g, 'String @default("PENDING")');
schema = schema.replace(/DarshanType/g, 'String');
schema = schema.replace(/EntityType/g, 'String');
schema = schema.replace(/ContentStatus/g, 'String');
schema = schema.replace(/UserRole/g, 'String');

fs.writeFileSync(path, schema, 'utf8');
console.log('Schema converted successfully.');
