export async function login(page, username, password) {
    await page.goto('/login');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('/');
  }
  
  export async function signup(page, username, email, password) {
    await page.goto('/signup');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Sign up")');
    await page.waitForURL('/login');
  }
  
  export async function logout(page) {
    // Clear localStorage and reload
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  }
  