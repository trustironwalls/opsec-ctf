const fs = require('fs');
const DB_PATH = '/tmp/opsec_db.json';

// Flags are stored securely behind the server framework layer
const SECURE_FLAGS = {
  'w1': { flag: 'FLAG{v13w_s0urc3_f1rst_alw4ys}', pts: 50 },
  'w2': { flag: 'FLAG{1nsp3ct_3l3m3nt_pr0}', pts: 75 },
  'w3': { flag: 'FLAG{d4shb04rd_s0urc3_hunt3r}', pts: 75 },
  'w4': { flag: 'FLAG{c00k13_m0nst3r_f0und}', pts: 125 },
  'w5': { flag: 'FLAG{l0c4l_st0r4g3_l34k}', pts: 125 },
  'w6': { flag: 'FLAG{r0b0ts_txt_3xp0s3d}', pts: 75 },
  'w7': { flag: 'FLAG{4p1_d3bug_3ndp01nt}', pts: 200 },
  'w8': { flag: 'FLAG{h3ad3r_1nj3ct10n}', pts: 200 },
  'l1': { flag: 'FLAG{d0tf1l3_d1sc0v3r3d}', pts: 50 }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { user, inputFlag } = JSON.parse(event.body);
    const u = user.trim().toLowerCase();
    const cleanFlag = inputFlag.trim();

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    if (!db.users[u]) return { statusCode: 404, body: 'User context offline.' };

    // Enumerate matches against the secure backend directory
    let matchedChalId = null;
    let pointsAwarded = 0;

    for (const [id, meta] of Object.entries(SECURE_FLAGS)) {
      if (meta.flag === cleanFlag) {
        matchedChalId = id;
        pointsAwarded = meta.pts;
        break;
      }
    }

    if (!matchedChalId) return { statusCode: 200, body: JSON.stringify({ status: 'err', msg: '✗ Invalid flag context hash.' }) };
    if (db.users[u].flags.includes(matchedChalId)) return { statusCode: 200, body: JSON.stringify({ status: 'dup', msg: 'Already captured.' }) };

    // Commit progress changes to persistent memory storage
    db.users[u].flags.push(matchedChalId);
    db.users[u].score += pointsAwarded;
    db.users[u].last = new Date().toLocaleTimeString();
    
    fs.writeFileSync(DB_PATH, JSON.stringify(db));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok', msg: '✓ Correct! Flag captured.', newScore: db.users[u].score, newFlags: db.users[u].flags })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ err: e.message }) };
  }
};