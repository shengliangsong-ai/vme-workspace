import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    background: '#ffffff',
  },
  securityLevel: 'loose',
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      }).catch(e => {
        console.error("Mermaid error:", e);
      });
    }
  }, [chart]);

  return <div ref={ref} className="mermaid flex justify-center my-6 bg-white p-4 rounded-xl" />;
};
