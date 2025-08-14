import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import chalk from 'chalk';
import Table from 'cli-table3';
import config from './config.js';
import { generateRandomUrls } from './utils.js';
import { checkUrl } from './checker.js';
import { saveReport } from './report.js';

const argv = yargs(hideBin(process.argv))
  .option('urls', { type: 'string', describe: 'Comma-separated URLs' })
  .option('file', { type: 'string', describe: 'File berisi daftar URL' })
  .option('count', { type: 'number', describe: 'Jumlah URL random' })
  .option('format', { type: 'string', default: config.defaultFormat })
  .option('limit', { type: 'number', default: config.defaultLimit })
  .help()
  .argv;

let urls = [];

// Ambil URL dari argumen, file, atau random
if (argv.urls) {
  urls = argv.urls.split(',').map(u => u.trim());
} else if (argv.file && fs.existsSync(argv.file)) {
  urls = fs.readFileSync(argv.file, 'utf-8')
    .split(/\r?\n/)
    .map(u => u.trim())
    .filter(Boolean);
} else {
  urls = generateRandomUrls(argv.count || config.defaultCount);
}

console.log(chalk.blue(`🔍 Checking ${urls.length} URL(s)...\n`));

const table = new Table({
  head: [chalk.cyan('URL'), chalk.yellow('Time (ms)'), chalk.magenta('Status'), chalk.gray('Redirect')],
  colWidths: [40, 12, 10, 50]
});

const results = [];
for (const url of urls) {
  const res = await checkUrl(url, argv.limit * 1000);
  results.push(res);

  const statusColor = res.status === 200 ? chalk.green : chalk.red;
  table.push([
    res.url,
    res.time,
    statusColor(res.status),
    res.redirect || '-'
  ]);
}

// Tampilkan tabel di terminal
console.log(table.toString());

// Simpan laporan sesuai format
await saveReport(results, argv.format);
