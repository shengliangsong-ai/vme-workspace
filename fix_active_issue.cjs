const fs = require('fs');

const dbPath = '.local-db.json';
if (fs.existsSync(dbPath)) {
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let state = db["workspaces/default"];
  
  if (state && state.issues && state.issues.length > 0) {
    if (!state.activeIssueId) {
       state.activeIssueId = state.issues[0].id;
    }
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
