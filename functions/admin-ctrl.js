const fs = require('fs');
const DB_PATH = '/tmp/opsec_db.json';

exports.handler = async (event) => {
  try {
    const { adminUser, action, targetUser, newPassword } = JSON.parse(event.body);
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

    // Secure operational gateway verification
    if (!db.users[adminUser] || db.users[adminUser].role !== 'admin') {
      return { statusCode: 403, body: 'Access denied. Unauthorized context.' };
    }

    const target = targetUser.trim().toLowerCase();
    if (!db.users[target]) return { statusCode: 404, body: 'Target profile not found.' };
    if (target === 'admin') return { statusCode: 400, body: 'Cannot modify primary root administrator.' };

    if (action === 'delete') {
      delete db.users[target];
    } else if (action === 'reset_pass') {
      if (!newPassword) return { statusCode: 400, body: 'Missing parameter entry.' };
      db.users[target].pass = newPassword;
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ err: e.message }) };
  }
};