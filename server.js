import app from './src/app.js';
import config from './src/config/index.js';
import { syncDatabase } from './src/config/database.js';

async function start() {
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║         Payer — SME Platform          ║');
  console.log(`  ║     Environment : ${config.nodeEnv.padEnd(20)}║`);
  console.log(`  ║     Nomba Mode  : ${(config.nomba.sandboxMode ? 'Sandbox' : 'Live').padEnd(20)}║`);
  console.log('  ╚═══════════════════════════════════════╝');

  await syncDatabase();

  app.listen(config.port, () => {
    console.log(`[Server] Listening on http://localhost:${config.port}`);
    console.log(`[Server] Health check: http://localhost:${config.port}/payer/health`);
  });
}

start().catch((err) => {
  console.error('[Fatal]', err);
  process.exit(1);
});
