const fs = require('fs');
let code = fs.readFileSync('src/components/SelfDemo.tsx', 'utf8');
code = code.replace(
  /image: "\/S6 Evaluator Outputs.png"\s*\}\s*\];/,
  `image: "/S8 virtually unlimied, cost-effective smart context.png"\n  }\n];`
);
fs.writeFileSync('src/components/SelfDemo.tsx', code);
