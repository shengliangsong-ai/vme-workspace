const fs = require('fs');

const dbPath = '.local-db.json';
if (fs.existsSync(dbPath)) {
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let state = db["workspaces/default"];
  if (state && state.blogPosts) {
    state.blogPosts = state.blogPosts.map(bp => {
      if (bp.tags) {
        bp.labels = bp.tags;
        delete bp.tags;
      }
      return bp;
    });
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
