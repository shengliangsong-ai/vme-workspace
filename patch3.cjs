const fs = require('fs');
let code = fs.readFileSync('src/components/SelfDemo.tsx', 'utf8');

// Replace ? with %3F in the image URL to avoid query parameter truncation
code = code.replace(
  /image: "\/S9 What will your virtual me build next\?.png"/g,
  'image: "/S9 What will your virtual me build next%3F.png"'
);
fs.writeFileSync('src/components/SelfDemo.tsx', code);
