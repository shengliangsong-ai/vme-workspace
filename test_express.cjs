const express = require('express');
const app = express();
app.get('/test', (req, res) => {
  res.json({
    plan: req.query.plan,
    includes: typeof req.query.plan === 'string' && req.query.plan.includes('Analyze')
  });
});
const server = app.listen(3001, async () => {
  const plan = "**Step 1:** Analyze the current SQLite schema.";
  const fetch = require('node-fetch');
  const res = await fetch(`http://localhost:3001/test?plan=${encodeURIComponent(plan)}`);
  const data = await res.json();
  console.log(data);
  server.close();
});
