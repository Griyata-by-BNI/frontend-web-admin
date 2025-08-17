// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Login Page Flow", () => {
  test("should login successfully and redirect to homepage", async ({
    page,
  }) => {
    // 1. Buka halaman login
    await page.goto("http://localhost:3000/login");

    // 2. Isi email
    await page.getByLabel("Email").fill("test@example.com");

    // 3. Isi password
    await page.getByLabel("Password").fill("password123");

    // 4. Centang "Ingat Saya"
    await page.getByRole("checkbox", { name: "Ingat Saya" }).check();

    // 5. Klik tombol "Masuk"
    await page.getByRole("button", { name: "Masuk" }).click();

    // 6. Tunggu redirect ke halaman utama
    await page.waitForURL("http://localhost:3000/");

    // 7. Verifikasi URL sudah benar
    expect(page.url()).toBe("http://localhost:3000/");

    // 8. (Opsional) cek localStorage
    const credential = await page.evaluate(() =>
      localStorage.getItem("credential")
    );
    expect(credential).toContain("test@example.com");
  });

  test("should show error message when login fails", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");

    await page.getByRole("button", { name: "Masuk" }).click();

    // Tunggu notifikasi error muncul
    const errorMessage = page.getByText(
      "Login gagal. Mohon periksa email dan password anda!"
    );
    await expect(errorMessage).toBeVisible();
  });
});
