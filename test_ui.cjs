const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // click 'Job Queue' tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, a, li'));
    const queueTab = tabs.find(t => t.textContent.includes('Job Queue'));
    if (queueTab) queueTab.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // click 'Demo: Orchestrate'
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const demoBtn = buttons.find(b => b.textContent.includes('Demo: Orchestrate'));
    if (demoBtn) demoBtn.click();
  });

  await new Promise(r => setTimeout(r, 3000)); // Wait for it to become awaiting approval
  
  // click 'Approve'
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const approveBtn = buttons.find(b => b.textContent.includes('Approve'));
    if (approveBtn) approveBtn.click();
  });

  await new Promise(r => setTimeout(r, 5000)); // Wait for it to execute
  
  const text1 = await page.evaluate(() => document.body.innerText);
  
  // click 'Clear Old Jobs'
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const clearBtn = buttons.find(b => b.textContent.includes('Clear Old Jobs'));
    if (clearBtn) clearBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  const text2 = await page.evaluate(() => document.body.innerText);
  
  console.log("=== BEFORE CLEAR ===");
  console.log(text1);
  console.log("=== AFTER CLEAR ===");
  console.log(text2);
  
  await browser.close();
})();
