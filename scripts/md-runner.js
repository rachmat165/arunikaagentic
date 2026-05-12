#!/usr/bin/env node
// ============================================================
// MD TASK RUNNER — Arunika Agentic System
// PT. Arunika Teknologi Global | corsec@arunika2045.com
//
// Menjalankan file .md prompt satu per satu ke agent API.
// Usage:
//   node scripts/md-runner.js                  → tampilkan daftar pending
//   node scripts/md-runner.js --run <file.md>  → jalankan 1 file
//   node scripts/md-runner.js --next           → jalankan file berikutnya
//   node scripts/md-runner.js --all            → jalankan semua pending
//   node scripts/md-runner.js --status         → tampilkan status semua
//   node scripts/md-runner.js --reset <file>   → reset status file ke pending
// ============================================================

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const TRACKER_FILE = path.join(ROOT, 'scripts', 'md-deploy-tracker.json');
const BASE_URL = 'http://localhost:3000';

// ─── WARNA TERMINAL ───────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};
const log = {
  info:    (m) => console.log(`${C.blue}ℹ${C.reset}  ${m}`),
  success: (m) => console.log(`${C.green}✅${C.reset} ${m}`),
  warn:    (m) => console.log(`${C.yellow}⚠${C.reset}  ${m}`),
  error:   (m) => console.log(`${C.red}✗${C.reset}  ${m}`),
  title:   (m) => console.log(`\n${C.bold}${C.cyan}${m}${C.reset}`),
  row:     (label, val, color = C.white) => console.log(`  ${C.gray}${label.padEnd(30)}${C.reset}${color}${val}${C.reset}`),
};

// ─── DEFINISI FILE MD YANG BISA DIJALANKAN ────────────────────
const MD_TASKS = [
  {
    file: 'CEO_ALUR_PERSETUJUAN_LENGKAP.md',
    agent: 'ceo-agentic',
    type: 'documentation',
    title: 'Panduan Alur Persetujuan CEO',
    description: 'Load panduan alur persetujuan ke sistem CEO',
    priority: 'NORMAL',
  },
  {
    file: 'CEO_PROMPT_OPERATIONS_AGENT.md',
    agent: 'operations-agentic',
    type: 'agent_prompt_config',
    title: 'Konfigurasi Prompt Operations Agent',
    description: 'Deploy semua prompt & perintah CEO untuk Operations Agent',
    priority: 'HIGH',
  },
  {
    file: 'CEO_PROMPT_SALES_MARKETING_AGENT.md',
    agent: 'sales-marketing-agentic',
    type: 'agent_prompt_config',
    title: 'Konfigurasi Prompt Sales & Marketing Agent',
    description: 'Deploy semua prompt & perintah CEO untuk Sales & Marketing Agent',
    priority: 'HIGH',
  },
  {
    file: 'CEO_PROMPT_FINANCE_AGENT.md',
    agent: 'finance-agentic',
    type: 'agent_prompt_config',
    title: 'Konfigurasi Prompt Finance Agent',
    description: 'Deploy semua prompt & perintah CEO untuk Finance Agent',
    priority: 'HIGH',
  },
  {
    file: 'CEO_MASTER_AGENT_COMMAND_INDEX.md',
    agent: 'ceo-agentic',
    type: 'documentation',
    title: 'Indeks Master Command Agent',
    description: 'Load indeks master semua perintah agent ke sistem CEO',
    priority: 'NORMAL',
  },
  {
    file: 'ARUNIKA_WORKFLOW_SPECIFICATIONS.md',
    agent: 'operations-agentic',
    type: 'workflow_config',
    title: 'Spesifikasi Workflow Arunika',
    description: 'Deploy spesifikasi workflow ke semua agent',
    priority: 'NORMAL',
  },
  {
    file: 'APPROVAL_WORKFLOW_COMPLETE_SYSTEM.md',
    agent: 'ceo-agentic',
    type: 'system_config',
    title: 'Sistem Approval Workflow Lengkap',
    description: 'Load konfigurasi sistem approval lengkap',
    priority: 'NORMAL',
  },
];

// ─── TRACKER ─────────────────────────────────────────────────
function loadTracker() {
  if (!fs.existsSync(TRACKER_FILE)) {
    const initial = {};
    MD_TASKS.forEach(t => {
      initial[t.file] = { status: 'pending', runs: 0, lastRun: null, lastResult: null };
    });
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
}

function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2));
}

function updateTracker(file, status, result = null) {
  const tracker = loadTracker();
  tracker[file] = {
    status,
    runs: (tracker[file]?.runs || 0) + (status === 'success' ? 1 : 0),
    lastRun: new Date().toISOString(),
    lastResult: result,
  };
  saveTracker(tracker);
}

// ─── API CALL ─────────────────────────────────────────────────
function apiPost(path, body, agentId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-agent-id': agentId,
      },
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}/api/monitoring`, { timeout: 3000 }, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

// ─── JALANKAN SATU TASK ───────────────────────────────────────
async function runTask(taskDef) {
  const filePath = path.join(ROOT, taskDef.file);

  if (!fs.existsSync(filePath)) {
    log.error(`File tidak ditemukan: ${taskDef.file}`);
    updateTracker(taskDef.file, 'error', 'File not found');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const taskId = `MD-${taskDef.file.replace('.md','').replace(/[^a-zA-Z0-9]/g,'-')}-${Date.now()}`;

  log.info(`Submitting: ${C.bold}${taskDef.file}${C.reset}`);
  log.info(`Agent target: ${taskDef.agent}`);
  log.info(`Task ID: ${taskId}`);

  const payload = {
    task_id: taskId,
    task_type: taskDef.type,
    task_title: taskDef.title,
    output_data: {
      file_name: taskDef.file,
      description: taskDef.description,
      content_preview: content.substring(0, 500) + '...',
      full_content: content,
      word_count: content.split(/\s+/).length,
      deployed_at: new Date().toISOString(),
    },
    priority: taskDef.priority,
    source_agentic: taskDef.agent,
  };

  try {
    const res = await apiPost('/api/approvals/submit', payload, taskDef.agent);

    if (res.status === 200 || res.status === 201) {
      log.success(`Berhasil submit ke approval queue`);
      log.row('Task ID:', taskId, C.green);
      log.row('Status:', 'pending (menunggu review CEO)', C.yellow);
      updateTracker(taskDef.file, 'success', { taskId, submittedAt: new Date().toISOString() });
      return true;
    } else {
      log.warn(`Server response: ${res.status}`);
      log.warn(`Response: ${JSON.stringify(res.data)}`);
      // Jika server tidak tersedia, tandai sebagai "queued local"
      log.info('Server tidak merespons — tandai sebagai queued (jalankan saat server ready)');
      updateTracker(taskDef.file, 'queued', { taskId, queuedAt: new Date().toISOString() });
      return false;
    }
  } catch (err) {
    log.warn(`Tidak bisa konek ke server: ${err.message}`);
    log.info(`File sudah dibaca. Tandai sebagai queued.`);
    updateTracker(taskDef.file, 'queued', { error: err.message });
    return false;
  }
}

// ─── TAMPILKAN STATUS ─────────────────────────────────────────
function showStatus() {
  const tracker = loadTracker();

  log.title('══ STATUS MD TASK RUNNER ══════════════════════════════');
  console.log(`  ${C.gray}Project: PT. Arunika Teknologi Global${C.reset}`);
  console.log(`  ${C.gray}Waktu  : ${new Date().toLocaleString('id-ID')}${C.reset}\n`);

  const statusIcon = { pending: '⏳', success: '✅', error: '❌', queued: '🔵' };
  const statusColor = { pending: C.yellow, success: C.green, error: C.red, queued: C.blue };

  let pending = 0, done = 0, queued = 0, errored = 0;

  MD_TASKS.forEach((task, i) => {
    const t = tracker[task.file] || { status: 'pending', runs: 0, lastRun: null };
    const icon = statusIcon[t.status] || '⏳';
    const color = statusColor[t.status] || C.yellow;
    const lastRun = t.lastRun ? new Date(t.lastRun).toLocaleString('id-ID') : 'Belum pernah';

    console.log(`  ${C.gray}${String(i + 1).padStart(2)}.${C.reset} ${icon} ${color}${C.bold}${task.file}${C.reset}`);
    console.log(`      ${C.gray}→ Agent: ${task.agent} | Status: ${color}${t.status}${C.reset} | Run: ${t.runs}x | Last: ${lastRun}${C.reset}`);

    if (t.status === 'pending') pending++;
    else if (t.status === 'success') done++;
    else if (t.status === 'queued') queued++;
    else if (t.status === 'error') errored++;
  });

  console.log(`\n  ${C.bold}Summary:${C.reset}`);
  console.log(`  ${C.yellow}⏳ Pending : ${pending}${C.reset}`);
  console.log(`  ${C.green}✅ Success : ${done}${C.reset}`);
  console.log(`  ${C.blue}🔵 Queued  : ${queued}${C.reset}`);
  console.log(`  ${C.red}❌ Error   : ${errored}${C.reset}`);
  console.log();
}

// ─── TAMPILKAN DAFTAR PENDING ─────────────────────────────────
function showPending() {
  const tracker = loadTracker();
  const pending = MD_TASKS.filter(t => {
    const s = tracker[t.file]?.status;
    return !s || s === 'pending' || s === 'error' || s === 'queued';
  });

  log.title('══ FILE MD YANG BELUM DIJALANKAN ══════════════════════');

  if (pending.length === 0) {
    log.success('Semua file sudah dijalankan!');
    return;
  }

  pending.forEach((task, i) => {
    const s = tracker[task.file]?.status || 'pending';
    const icon = s === 'queued' ? '🔵' : '⏳';
    console.log(`  ${i + 1}. ${icon} ${C.bold}${task.file}${C.reset}`);
    console.log(`     ${C.gray}→ ${task.description}${C.reset}`);
    console.log(`     ${C.gray}→ Agent: ${task.agent} | Prioritas: ${task.priority}${C.reset}`);
  });

  console.log(`\n  ${C.cyan}Jalankan satu: ${C.bold}node scripts/md-runner.js --next${C.reset}`);
  console.log(`  ${C.cyan}Jalankan semua: ${C.bold}node scripts/md-runner.js --all${C.reset}\n`);
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  console.log(`\n${C.bold}${C.cyan}┌─────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.cyan}│  ARUNIKA MD TASK RUNNER                     │${C.reset}`);
  console.log(`${C.bold}${C.cyan}│  PT. Arunika Teknologi Global               │${C.reset}`);
  console.log(`${C.bold}${C.cyan}└─────────────────────────────────────────────┘${C.reset}\n`);

  if (!cmd || cmd === '--list') {
    showPending();
    return;
  }

  if (cmd === '--status') {
    showStatus();
    return;
  }

  if (cmd === '--reset') {
    const fileName = args[1];
    if (!fileName) { log.error('Masukkan nama file. Contoh: --reset CEO_PROMPT_OPERATIONS_AGENT.md'); return; }
    const tracker = loadTracker();
    tracker[fileName] = { status: 'pending', runs: 0, lastRun: null, lastResult: null };
    saveTracker(tracker);
    log.success(`Reset status ${fileName} → pending`);
    return;
  }

  // Cek apakah server berjalan
  const serverOk = await checkServerRunning();
  if (!serverOk) {
    log.warn('Server Next.js tidak terdeteksi di localhost:3000');
    log.warn('Pastikan: npm run dev sudah berjalan di terminal lain');
    log.info('File tetap akan diproses dan ditandai sebagai "queued"\n');
  } else {
    log.success('Server terdeteksi di localhost:3000\n');
  }

  const tracker = loadTracker();

  if (cmd === '--next') {
    // Jalankan file pending berikutnya
    const next = MD_TASKS.find(t => {
      const s = tracker[t.file]?.status;
      return !s || s === 'pending' || s === 'error';
    });

    if (!next) {
      log.success('Semua file sudah dijalankan! Gunakan --status untuk melihat detail.');
      return;
    }

    log.title(`══ MENJALANKAN: ${next.file} ══`);
    await runTask(next);

    // Tampilkan sisa yang pending
    const remaining = MD_TASKS.filter(t => {
      const s = tracker[t.file]?.status;
      return !s || s === 'pending' || s === 'error';
    }).length - 1;

    if (remaining > 0) {
      console.log(`\n  ${C.yellow}Masih ada ${remaining} file lagi. Jalankan: ${C.bold}node scripts/md-runner.js --next${C.reset}`);
    } else {
      log.success('Semua file sudah dijalankan!');
    }
    return;
  }

  if (cmd === '--run') {
    const fileName = args[1];
    if (!fileName) { log.error('Masukkan nama file. Contoh: --run CEO_PROMPT_OPERATIONS_AGENT.md'); return; }

    const task = MD_TASKS.find(t => t.file === fileName);
    if (!task) {
      log.error(`File tidak ada dalam daftar task: ${fileName}`);
      log.info('Gunakan --list untuk melihat file yang tersedia');
      return;
    }

    log.title(`══ MENJALANKAN: ${fileName} ══`);
    await runTask(task);
    return;
  }

  if (cmd === '--all') {
    const pending = MD_TASKS.filter(t => {
      const s = tracker[t.file]?.status;
      return !s || s === 'pending' || s === 'error';
    });

    if (pending.length === 0) {
      log.success('Semua file sudah dijalankan!');
      return;
    }

    log.title(`══ MENJALANKAN SEMUA (${pending.length} file) ══`);

    for (let i = 0; i < pending.length; i++) {
      const task = pending[i];
      console.log(`\n${C.gray}[${i + 1}/${pending.length}]${C.reset} ${C.bold}${task.file}${C.reset}`);
      await runTask(task);

      // Jeda 1 detik antar submit agar tidak flood API
      if (i < pending.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.log();
    log.success(`Selesai! ${pending.length} file diproses.`);
    showStatus();
    return;
  }

  // Help
  console.log(`Usage:`);
  console.log(`  node scripts/md-runner.js                    → daftar file pending`);
  console.log(`  node scripts/md-runner.js --status          → status semua file`);
  console.log(`  node scripts/md-runner.js --next            → jalankan file berikutnya`);
  console.log(`  node scripts/md-runner.js --all             → jalankan semua pending`);
  console.log(`  node scripts/md-runner.js --run <file.md>   → jalankan file tertentu`);
  console.log(`  node scripts/md-runner.js --reset <file.md> → reset status ke pending`);
}

main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
