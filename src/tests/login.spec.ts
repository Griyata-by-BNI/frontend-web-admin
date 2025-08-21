import { test, expect } from "@playwright/test";

test.describe("Login Page Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should login successfully with mocked API", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { token: "mock-token", user: { email: "adminfaza12@mail.com" } }
        })
      });
    });

    await page.getByLabel("Email").fill("adminfaza12@mail.com");
    await page.getByLabel("Password").fill("123Admin!");
    await page.getByRole("checkbox", { name: "Ingat Saya" }).check();
    await page.getByRole("button", { name: "Masuk" }).click();

    await page.waitForURL("/", { timeout: 10000 });
    expect(page.url()).toContain("/");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          status: { message: "Login gagal. Mohon periksa email dan password anda!" }
        })
      });
    });

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Masuk" }).click();

    await expect(page.getByText("Login gagal. Mohon periksa email dan password anda!")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Masuk" }).click();
    
    await expect(page.getByText("Email wajib diisi")).toBeVisible();
    await expect(page.getByText("Password wajib diisi")).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByRole("button", { name: "Masuk" }).click();
    
    await expect(page.getByText("Email tidak valid")).toBeVisible();
  });

  test("should validate password minimum length", async ({ page }) => {
    await page.getByLabel("Email").fill("adminfaza12@mail.com");
    await page.getByLabel("Password").fill("123");
    await page.getByRole("button", { name: "Masuk" }).click();
    
    await expect(page.getByText("Password harus minimal 8 karakter")).toBeVisible();
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel("Password");
    
    await expect(passwordInput).toHaveAttribute("type", "password");
    
    await page.locator('[data-icon="eye-invisible"]').click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    
    await page.locator('[data-icon="eye"]').click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should navigate to register page", async ({ page }) => {
    await page.getByRole("link", { name: "Daftar" }).click();
    await page.waitForURL("/register");
    expect(page.url()).toContain("/register");
  });

  test("should navigate to forgot password", async ({ page }) => {
    await page.getByRole("link", { name: "Lupa password?" }).click();
    await page.waitForURL("/forgot-password");
    expect(page.url()).toContain("/forgot-password");
  });

  test("should disable form during loading", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await page.waitForTimeout(1000);
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { token: "mock-token", user: { email: "adminfaza12@mail.com" } }
        })
      });
    });

    await page.getByLabel("Email").fill("adminfaza12@mail.com");
    await page.getByLabel("Password").fill("123Admin!");
    await page.getByRole("button", { name: "Masuk" }).click();

    await expect(page.getByLabel("Email")).toBeDisabled();
    await expect(page.getByLabel("Password")).toBeDisabled();
    await expect(page.getByRole("checkbox", { name: "Ingat Saya" })).toBeDisabled();
  });

  test("should display page elements correctly", async ({ page }) => {
    await expect(page.getByText("Masuk aplikasi")).toBeVisible();
    await expect(page.getByText("dengan akun anda")).toBeVisible();
    await expect(page.getByText("Masukkan email dan password untuk login")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Ingat Saya" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Lupa password?" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Daftar" })).toBeVisible();
  });
});