const fs = require('fs');
fs.writeFileSync('.local-db.json', JSON.stringify({
  "workspaces/default": {
    "issues": [],
    "skills": [],
    "settings": {},
    "activeIssueId": null,
    "jobs": [],
    "standups": [],
    "blogPosts": [],
    "sessionReports": []
  }
}, null, 2));
