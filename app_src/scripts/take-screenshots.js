const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshots() {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1280, height: 800 });
  
  const targetDir = 'C:\\Users\\shaha\\.gemini\\antigravity\\brain\\cd2552c8-40ee-40f2-ad8c-bba8f1ebd137';
  
  try {
    console.log('Navigating to website...');
    await page.goto('https://pedagogical-ai-eval-system.vercel.app', { waitUntil: 'networkidle2' });
    
    // Screenshot 1: Auto Eval Overview (Home)
    console.log('Capturing Auto Eval Overview...');
    await page.waitForTimeout(2000); // wait for animations
    await page.screenshot({ path: path.join(targetDir, 'auto_eval_home.png'), fullPage: false });
    
    // Select some options for Auto Eval to show results
    console.log('Selecting options for Auto Eval...');
    // Click Topic
    await page.click('button[role="combobox"]');
    await page.waitForTimeout(500);
    const options = await page.$$('[role="option"]');
    if (options.length > 0) await options[0].click();
    await page.waitForTimeout(500);
    
    // Select Tutor
    const selects = await page.$$('button[role="combobox"]');
    if (selects.length > 1) {
       await selects[1].click();
       await page.waitForTimeout(500);
       const tutorOptions = await page.$$('[role="option"]');
       if (tutorOptions.length > 0) await tutorOptions[0].click();
    }
    
    // Click Evaluate
    console.log('Evaluating...');
    await page.waitForTimeout(1000);
    const buttons = await page.$$('button');
    for (const btn of buttons) {
       const text = await page.evaluate(el => el.textContent, btn);
       if (text && text.includes('Get Automated Evaluation Results')) {
           await btn.click();
           break;
       }
    }
    await page.waitForTimeout(4000);
    
    console.log('Capturing Auto Eval Results...');
    await page.screenshot({ path: path.join(targetDir, 'auto_eval_results.png'), fullPage: false });
    
    // Navigate to LLM Evaluation Tab
    console.log('Navigating to LLM Eval...');
    const tabs = await page.$$('[role="tab"]');
    for (const tab of tabs) {
       const text = await page.evaluate(el => el.textContent, tab);
       if (text && text.includes('LLM Evaluation')) {
           await tab.click();
           break;
       }
    }
    await page.waitForTimeout(2000);
    console.log('Capturing LLM Eval...');
    await page.screenshot({ path: path.join(targetDir, 'llm_eval.png'), fullPage: false });
    
    // Navigate to Visualizer Tab
    console.log('Navigating to Visualizer...');
    for (const tab of tabs) {
       const text = await page.evaluate(el => el.textContent, tab);
       if (text && text.includes('Visualizer')) {
           await tab.click();
           break;
       }
    }
    await page.waitForTimeout(3000);
    console.log('Capturing Visualizer...');
    await page.screenshot({ path: path.join(targetDir, 'visualizer.png'), fullPage: false });
    
  } catch (error) {
    console.error('Error during capture:', error);
  } finally {
    await browser.close();
    console.log('Screenshots completed.');
  }
}

captureScreenshots();
