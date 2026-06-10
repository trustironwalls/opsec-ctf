const fs = require('fs');
const path = require('path');
const DB_PATH = '/tmp/opsec_db.json';

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: {
        admin: { user: 'admin', pass: 'admin1234', role: 'admin', score: 0, flags: [], last: 'Never' },
        operator: { user: 'operator', pass: 'letmein', role: 'player', score: 0, flags: [], last: 'Never' }
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data));
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { user, pass } = JSON.parse(event.body);
    const u = user.trim().toLowerCase();
    if (!u || !pass) return { statusCode: 400, body: JSON.stringify({ err: 'Credentials incomplete.' }) };

    let db = loadDB();

    // Auto-Registration Feature: If user does not exist, automatically provision account
    if (!db.users[u]) {
      db.users[u] = { user: u, pass: pass, role: 'player', score: 0, flags: [], last: 'Registered' };
      saveDB(db);
    }

    const account = db.users[u];
    if (account.pass !== pass) {
      return { statusCode: 401, body: JSON.stringify({ err: 'Authentication context failed.' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: account.user, role: account.role, score: account.score, flags: account.flags })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ err: e.message }) };
  }
};