/**
 * Initialization script untuk ExecutionTracker
 * Menjalankan otomatis saat aplikasi start
 */

import { ExecutionTracker, initializeSampleData, getAllExecutionHistory } from '@/services/execution-tracker';

let initialized = false;

export function initializeTracker() {
  if (initialized) {
    return;
  }

  try {
    const history = getAllExecutionHistory();
    const workflowCount = Object.keys(history).length;

    if (workflowCount === 0) {
      console.log('[INIT] ExecutionTracker is empty, loading sample data...');
      initializeSampleData();
      console.log('[INIT] Sample data loaded successfully');
    } else {
      console.log(`[INIT] ExecutionTracker already has ${workflowCount} workflows with data`);
    }

    initialized = true;
  } catch (error) {
    console.error('[INIT] Failed to initialize ExecutionTracker:', error);
  }
}
