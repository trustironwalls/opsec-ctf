// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

// Secure Server-Side Flag Database (100% hidden from frontend inspection)
const FLAG_DATABASE = {
    // WEB RECONNAISSANCE & INJECTION (w1 - w6)
    'w1': { id: 'w1', points: 50, flag: 'FLAG{d0tf1l3_d1sc0v3r3d}' },
    'w2': { id: 'w2', points: 75, flag: 'FLAG{b4sz36R_d3c0d3r_pr0}' },
    'w3': { id: 'w3', points: 100, flag: 'FLAG{d0m_4ttr1b_v3ct0r}' },
    'w4': { id: 'w4', points: 150, flag: 'FLAG{c00k13_m4tr1x_m0d}' },
    'w5': { id: 'w5', points: 200, flag: 'FLAG{h1dd3n_4p1_fuzz_f0und}' },
    'w6': { id: 'w6', points: 250, flag: 'FLAG{cr0ss_0r1g1n_l34k}' },
    
    // LINUX BASICS & PRIVILEGE ESCALATION (l1 - l6)
    'l1': { id: 'l1', points: 50, flag: 'FLAG{3xp0rt_v4r_l34k3d}' },
    'l2': { id: 'l2', points: 75, flag: 'FLAG{m0td_r34d3r}' },
    'l3': { id: 'l3', points: 100, flag: 'FLAG{p4sswd_g3c0s_s3cr3t}' },
    'l4': { id: 'l4', points: 150, flag: 'FLAG{su1d_b1n4ry_f0und}' },
    'l5': { id: 'l5', points: 200, flag: 'FLAG{cr0n_t4sk_l34k}' },
    'l6': { id: 'l6', points: 300, flag: 'FLAG{sud03rs_pr1v3sc_p4th}' },

    // ADVANCED TEXT PROCESSING & ALGORITHMS (t1 - t6)
    't1': { id: 't1', points: 75, flag: 'FLAG{gr3p_1s_3ss3nt14l}' },
    't2': { id: 't2', points: 100, flag: 'FLAG{4wk_csv_3xtr4ct10n}' },
    't3': { id: 't3', points: 125, flag: 'FLAG{m1rr0r_s1gn4l_r3v}' },
    't4': { id: 't4', points: 150, flag: 'FLAG{r0t13_d3c1ph3r_0k}' },
    't5': { id: 't5', points: 200, flag: 'FLAG{h3x_h4sh_c0nv_m4st3r}' },
    't6': { id: 't6', points: 250, flag: 'FLAG{r3g3x_b0und4ry_v4l}' },

    // FORENSICS & THREAT VECTOR LOG ANALYSIS (f1 - f7)
    'f1': { id: 'f1', points: 100, flag: 'FLAG{t41l_sysl0g_4n0m4ly}' },
    'f2': { id: 'f2', points: 125, flag: 'FLAG{4uth_f41l_1ntrus10n}' },
    'f3': { id: 'f3', points: 150, flag: 'FLAG{p1p3_st3g0_sh4rd_f0und}' },
    'f4': { id: 'f4', points: 200, flag: 'FLAG{w3b_fuzz_4tt4ck_s0urc3}' },
    'f5': { id: 'f5', points: 250, flag: 'FLAG{usr_b1n_m4l_pr0f1l3}' },
    'f6': { id: 'f6', points: 300, flag: 'FLAG{sh4r3d_m3m_pawn}' },
    'f7': { id: 'f7', points: 500, flag: 'FLAG{p3r1m3t3r_w4ll_c0mpl3t3}' }
};

router.post('/auth', (req, res) => {
    res.status(200).json({ status: "sync_active" });
});

router.post('/submit-flag', (req, res) => {
    const { inputFlag } = req.body;
    let matched = null;
    
    for (const key in FLAG_DATABASE) {
        if (FLAG_DATABASE[key].flag === inputFlag) {
            matched = FLAG_DATABASE[key];
            break;
        }
    }

    if (!matched) {
        return res.status(200).json({ status: 'err', msg: '✗ Invalid validation token submitted.' });
    }

    return res.status(200).json({
        status: 'ok',
        msg: '⚡ TARGET SIGNATURE VERIFIED. Point allocation synchronized.',
        pts: matched.points,
        id: matched.id
    });
});

app.use('/api', router);
module.exports.handler = serverless(app);