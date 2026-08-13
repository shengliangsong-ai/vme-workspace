# Command Line Features

The Virtual Me application now includes a built-in Command Terminal.

## Accessing the Terminal
Press **\`Ctrl + \`\`** (or **\`Cmd + \`\`** on Mac) to open and close the Command Terminal at the bottom of the screen. Alternatively, you can use the Terminal button in the sidebar.

## Available Commands

The terminal supports managing all features in the website:

### Navigation
- \`nav <tab>\`: Navigates to a specific tab.
  - Tabs: \`dashboard\`, \`workspace\`, \`skills\`, \`standups\`, \`blog\`, \`settings\`, \`queue\`

### Issues (Active Workspace)
- \`issue ls\`: Lists all issues.
- \`issue add "<title>" [type]\`: Creates a new issue (type is \`bug\` or \`feature\`).
- \`issue rm <id>\`: Deletes an issue.
- \`issue active <id>\`: Sets an issue as the active workspace issue.

### Skills
- \`skill ls\`: Lists all skills.
- \`skill add "<name>" "<description>"\`: Creates a new skill.
- \`skill rm <id>\`: Deletes a skill.

### Job Queue
- \`job ls\`: Lists all queued, running, and completed jobs.
- \`job submit "<command>" [timeout]\`: Submits a new job.
- \`job rm <id>\`: Deletes a specific job.
- \`job clear\`: Clears all finished and old jobs.
- \`job approve <id>\`: Approves a job awaiting approval.

### Daily Standups
- \`standup ls\`: Lists all standup entries.
- \`standup add "<yesterday>" "<today>" "<blockers>"\`: Adds a new daily standup entry.
- \`standup rm <id>\`: Deletes a standup entry.

### Blog / Lessons
- \`blog ls\`: Lists all blog posts.
- \`blog add "<title>" "<content>"\`: Adds a new blog post.
- \`blog rm <id>\`: Deletes a blog post.

### Settings
- \`config ls\`: Views the current configurations.
- \`config set <key> "<value>"\`: Sets a configuration value. (e.g. \`githubToken\`, \`githubRepo\`, \`claudeApiKey\`)

### General
- \`help\`: Displays the help menu.
- \`clear\`: Clears the terminal history.
