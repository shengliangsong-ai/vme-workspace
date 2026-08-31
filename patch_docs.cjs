const fs = require('fs');

// Add tech stack notes to ARCHITECTURE.md
let arch = fs.readFileSync('ARCHITECTURE.md', 'utf8');
if (!arch.includes('recharts')) {
  arch = arch.replace(
    '- **Icons**: `lucide-react` for consistent iconography.',
    '- **Icons**: `lucide-react` for consistent iconography.\n- **Animations**: `motion/react` (Framer Motion) for fluid layout transitions.\n- **Data Viz**: `recharts` for interactive executive dashboard charts.'
  );
  fs.writeFileSync('ARCHITECTURE.md', arch);
}
