// src/report.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function saveReport(results, format = 'html') {
  const formats = format.split(',').map(f => f.trim().toLowerCase());
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.join(process.cwd(), 'reports');

  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

  if (formats.includes('csv')) {
    const csv = [
      'URL,Time (ms),Status,Redirect',
      ...results.map(r => `${r.url},${r.time},${r.status},${r.redirect || ''}`)
    ].join('\n');
    fs.writeFileSync(path.join(reportDir, `report-${timestamp}.csv`), csv);
    console.log(chalk.green(`CSV report saved.`));
  }

  if (formats.includes('html')) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>URL Check Report</title>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f4f4f4; }
    .ok { color: green; }
    .err { color: red; }
  </style>
</head>
<body>
  <h2>URL Check Report</h2>
  <table>
    <thead>
      <tr><th>URL</th><th>Time (ms)</th><th>Status</th><th>Redirect</th></tr>
    </thead>
    <tbody>
      ${results.map(r => `
        <tr>
          <td>${r.url}</td>
          <td>${r.time}</td>
          <td class="${r.status === 200 ? 'ok' : 'err'}">${r.status}</td>
          <td>${r.redirect || ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
    fs.writeFileSync(path.join(reportDir, `report-${timestamp}.html`), html);
    console.log(chalk.green(`HTML report saved.`));
  }

  if (formats.includes('json')) {
    fs.writeFileSync(path.join(reportDir, `report-${timestamp}.json`), JSON.stringify(results, null, 2));
    console.log(chalk.green(`JSON report saved.`));
  }
}
