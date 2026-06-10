const fs = require('fs');
const DB_PATH = '/tmp/opsec_db.json';

exports.handler = async () => {
  try {
    if (!fs.existsSync(DB_PATH)) return { statusCode: 200, body: JSON.stringify([]) };
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    // Map active public telemetry without leaking structural authentication values
    const publicDirectory = Object.values(db.users).map(u => ({
      user: u.user,
      role: u.role,
      score: u.score,
      flagsCount: u.flags.length,
      last: u.last || 'Never'
    }));

    return { statusCode: 200, body: JSON.stringify(publicDirectory) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ err: e.message }) };
  }
};