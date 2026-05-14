from playwright.sync_api import sync_playwright
import time
import os

target_dir = r"C:\Users\shaha\.gemini\antigravity\brain\cd2552c8-40ee-40f2-ad8c-bba8f1ebd137"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        print("Navigating to live site...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(3)
        
        print("Taking Auto Eval Home screenshot...")
        page.screenshot(path=os.path.join(target_dir, "auto_eval_home.png"))
        
        # Select options for Auto Eval
        print("Auto Eval: Selecting Topic")
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 0:
            combos[0].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(1)
                
        print("Auto Eval: Selecting Tutor")
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 1:
            combos[1].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(1)
                
        print("Auto Eval: Selecting Dimensions")
        select_all_btn = page.locator('button:has-text("Select All")').all()
        if len(select_all_btn) > 0:
            select_all_btn[0].click()
            time.sleep(1)
                
        print("Auto Eval: Evaluating")
        evaluate_btn = page.locator('button:has-text("Get Automated Evaluation Results")')
        if evaluate_btn.count() > 0:
            evaluate_btn.first.click()
            print("Waiting for Auto Eval results to load (15s)...")
            time.sleep(15) # wait for the table and charts to appear
            
        print("Taking Auto Eval Result screenshot...")
        page.evaluate("window.scrollBy(0, 400)")
        time.sleep(2)
        page.screenshot(path=os.path.join(target_dir, "auto_eval_results.png"))
        
        print("Navigating to LLM Eval tab...")
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(1)
        page.locator("text='LLM Evaluation'").first.click(force=True)
        time.sleep(3)
        
        print("Taking LLM Eval Home screenshot...")
        page.screenshot(path=os.path.join(target_dir, "llm_eval_home.png"))
        
        print("LLM Eval: Selecting Topic, Tutor, Judge")
        # Topic
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 0:
            combos[0].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(1)
        # Tutor
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 1:
            combos[1].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(1)
        # Judge
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 2:
            combos[2].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(1)
                
        print("LLM Eval: Selecting Dimensions")
        select_all_btn = page.locator('button:has-text("Select All")').all()
        if len(select_all_btn) > 0:
            select_all_btn[0].click()
            time.sleep(1)
            
        print("LLM Eval: Evaluating")
        evaluate_btn = page.locator('button:has-text("Get LLM Evaluation Results")')
        if evaluate_btn.count() > 0:
            evaluate_btn.first.click()
            print("Waiting for LLM Eval results to load (25s)...")
            time.sleep(25)
            
        print("Taking LLM Eval Result screenshot...")
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(2)
        page.screenshot(path=os.path.join(target_dir, "llm_eval_results.png"))
        
        print("Navigating to Visualizer tab...")
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(1)
        page.locator("text='Visualizer'").first.click(force=True)
        time.sleep(4)
        
        print("Taking Visualizer Home screenshot...")
        page.screenshot(path=os.path.join(target_dir, "visualizer_home.png"))
        
        print("Visualizer: Selecting Tutors and Dimensions")
        select_all_btns = page.locator('button:has-text("Select All")').all()
        if len(select_all_btns) > 0:
            select_all_btns[0].click(force=True)
            time.sleep(1)
        if len(select_all_btns) > 1:
            select_all_btns[1].click(force=True)
            time.sleep(2)
            
        print("Taking Visualizer Spider Chart screenshot...")
        page.evaluate("window.scrollBy(0, 400)")
        time.sleep(2)
        page.screenshot(path=os.path.join(target_dir, "visualizer_spider.png"))
        
        print("Visualizer: Switching to Bar Plot...")
        page.locator("text='Bar Plot'").first.click(force=True)
        time.sleep(2)
        
        # Select Dimension for Bar Plot
        combos = page.locator('button[role="combobox"]').all()
        if len(combos) > 0:
            combos[-1].click()
            time.sleep(1)
            options = page.locator('[role="option"]').all()
            if len(options) > 0:
                options[0].click()
                time.sleep(2)
                
        print("Taking Visualizer Bar Plot screenshot...")
        page.evaluate("window.scrollBy(0, 200)")
        time.sleep(2)
        page.screenshot(path=os.path.join(target_dir, "visualizer_bar.png"))
        
        browser.close()

run()
