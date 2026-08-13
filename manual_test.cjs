const fetch = require('node-fetch');

(async () => {
  // 1. Submit a completed job directly
  console.log("Submitting completed job...");
  let stateRes = await fetch('http://localhost:3000/api/state');
  let state = await stateRes.json();
  
  state.jobs = [{
    id: "test-completed-job",
    command: "test command",
    status: "completed",
    log: "test log",
    createdAt: Date.now(),
    completedAt: Date.now()
  }];

  await fetch('http://localhost:3000/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });

  console.log("State updated. You can check the UI now.");
})();
