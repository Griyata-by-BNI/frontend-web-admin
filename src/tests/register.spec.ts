import { test, expect } from "@playwright/test";

test.describe("Register Page Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should register successfully with valid data", async ({ page }) => {
    // Mock successful registration
    await page.route("**/register", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true })
      });
    });

    // Fill form fields
    await page.getByLabel("Nama Lengkap").fill("Jaaaaaa");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("adminfaza20@mail.com");
    await page.locator('#password').fill("123Admin!");
    await page.locator('#confirmPassword').fill("123Admin!");
    
    // Check terms and conditions
    await page.getByRole("checkbox").check();
    
    // Submit form
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    // Should redirect to verify email page
    await page.waitForURL(/\/register\/verify-email\?email=/);
    expect(page.url()).toContain("adminfaza20@mail.com");
  });

  test("should show validation errors for invalid inputs", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    // Check validation messages
    await expect(page.getByText("Nama lengkap wajib diisi")).toBeVisible();
    await expect(page.getByText("Nomor handphone wajib diisi")).toBeVisible();
    await expect(page.getByText("Email wajib diisi")).toBeVisible();
    await expect(page.getByText("Kata Sandi wajib diisi", { exact: true })).toBeVisible();
    await expect(page.getByText("Konfirmasi kata sandi wajib diisi")).toBeVisible();
  });

  test("should validate phone number format", async ({ page }) => {
    await page.getByLabel("Nama Handphone").fill("123456");
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    await expect(page.getByText("Nomor handphone harus 10-13 digit angka")).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    await expect(page.getByText("Format email tidak valid")).toBeVisible();
  });

  test("should validate password requirements", async ({ page }) => {
    await page.locator('#password').fill("weak");
    await page.locator('#confirmPassword').fill("weak");
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    await expect(page.getByText("Kata Sandi minimal 8 karakter")).toBeVisible();
  });

  test("should validate password confirmation match", async ({ page }) => {
    await page.locator('#password').fill("123Admin!");
    await page.locator('#confirmPassword').fill("DifferentPassword123!");
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    await expect(page.getByText("Konfirmasi password tidak sama dengan password")).toBeVisible();
  });

  test("should require terms and conditions agreement", async ({ page }) => {
    // Fill all fields but don't check terms
    await page.getByLabel("Nama Lengkap").fill("Jaaaaaa");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("adminfaza20@mail.com");
    await page.locator('#password').fill("123Admin!");
    await page.locator('#confirmPassword').fill("123Admin!");
    
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();
    
    await expect(page.getByText("Anda harus menyetujui syarat dan ketentuan")).toBeVisible();
  });

  test("should open and close terms modal", async ({ page }) => {
    // Click terms link
    await page.getByRole("button", { name: "syarat dan ketentuan" }).click();
    
    // Modal should be visible
    await expect(page.getByRole("dialog", { name: "Syarat dan Ketentuan" })).toBeVisible();
    await expect(page.getByText("KEBIJAKAN APLIKASI")).toBeVisible();
    
    // Close modal
    await page.getByRole("button", { name: "Tutup" }).click();
    
    // Modal should be hidden
    await expect(page.getByRole("dialog", { name: "Syarat dan Ketentuan" })).not.toBeVisible();
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.locator('#password');
    const toggleButton = page.locator('[data-icon="eye-invisible"]').first();
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute("type", "password");
    
    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    
    // Click toggle to hide password again
    await page.locator('[data-icon="eye"]').first().click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should navigate to login page", async ({ page }) => {
    await page.getByRole("link", { name: "Masuk" }).click();
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });
});