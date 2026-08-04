import cron from 'node-cron';

export function initializeScheduledJobs() {
  console.log('⏰ Initializing EchoJournal Cron Scheduler...');

  // 1. Daily midnight check for journal streaks & reminders (0 0 * * *)
  cron.schedule('0 0 * * *', () => {
    console.log('[Cron] Running daily journal streak check and notification dispatcher...');
  });

  // 2. Weekly Sunday midnight trend report compilation (0 0 * * 0)
  cron.schedule('0 0 * * 0', () => {
    console.log('[Cron] Compiling weekly AI mood trend report for active users...');
  });

  // 3. Monthly 1st day wellness summary email trigger (0 0 1 * *)
  cron.schedule('0 0 1 * *', () => {
    console.log('[Cron] Generating monthly mental health summary analytics...');
  });
}
