const fs = require('fs');
let code = fs.readFileSync('src/components/CommandTerminal.tsx', 'utf8');

code = code.replace(
  "case 'config':\n        handleConfigCommand(args);\n        break;",
  "case 'config':\n        handleConfigCommand(args);\n        break;\n      case 'vme':\n        handleVmeCommand(args);\n        break;"
);

const vmeHandler = `
  const handleVmeCommand = (args: string[]) => {
    if (args[0] === 'run') {
      const commandString = args.slice(1).join(' ');
      if (!commandString) {
        print('Usage: vme run <command>', 'error');
        return;
      }
      submitJob(commandString, 120000);
      print(\`[VME] Orchestrator spawned background job for: \${commandString}\`, 'success');
      setCurrentTab('queue'); // Auto navigate to queue!
    } else {
      print('Usage: vme run <command>', 'error');
    }
  };
`;

code = code.replace("const handleIssueCommand", vmeHandler + "\n  const handleIssueCommand");
code = code.replace("config [ls|set]", "config [ls|set]\n  vme run <command> - Execute a workflow and monitor in Job Queue");

fs.writeFileSync('src/components/CommandTerminal.tsx', code);
