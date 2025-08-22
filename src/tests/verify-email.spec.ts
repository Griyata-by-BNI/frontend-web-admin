import { test, expect } from "@playwright/test";

test.describe("Verify Email Page Flow", () => {
  const testEmail = "adminfaza12@mail.com";
  
  // Helper function to fill OTP dynamically
  const fillOtp = async (page: any, otp: string) => {
    // Fill each OTP input individually to trigger React validation
    for (let i = 0; i < otp.length && i < 4; i++) {
      await page.locator(`.ant-otp input`).nth(i).fill(otp[i]);
    }
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(`/register/verify-email?email=${testEmail}`);
  });

  test("should display email verification form correctly", async ({ page }) => {
    // Check page title and description
    await expect(page.getByText("Verifikasi Email Anda")).toBeVisible();
    await expect(page.getByText(`Masukkan kode verifikasi 4 digit yang telah dikirim ke: ${testEmail}`)).toBeVisible();
    
    // Check OTP input is present
    await expect(page.locator('.ant-otp')).toBeVisible();
    
    // Check verify button is disabled initially
    await expect(page.getByRole("button", { name: "Verifikasi Email" })).toBeDisabled();
    
    // Check resend button is present
    await expect(page.getByRole("button", { name: "Kirim ulang kode" })).toBeVisible();
  });

  test("should enable verify button when OTP is complete", async ({ page }) => {
    // Fill any 4-digit OTP
    await fillOtp(page, "5678");
    
    // Verify button should be enabled
    await expect(page.getByRole("button", { name: "Verifikasi Email" })).toBeEnabled();
  });

  test("should verify email successfully with valid OTP", async ({ page }) => {
    // Mock successful verification response
    await page.route("**/auth/sign-up-verify", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { token: "mock-jwt-token" }
        })
      });
    });

    // Fill any valid OTP
    await fillOtp(page, "9876");
    
    // Click verify button
    await page.getByRole("button", { name: "Verifikasi Email" }).click();
    
    // Should show success message and success state
    await expect(page.getByText("Email berhasil diverifikasi!")).toBeVisible();
    await expect(page.getByText("Email Terverifikasi!")).toBeVisible();
    await expect(page.getByText("Verifikasi Berhasil!")).toBeVisible();
  });

  test("should show error message with invalid OTP", async ({ page }) => {
    // Mock error response
    await page.route("**/auth/sign-up-verify", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Kode verifikasi tidak valid"
        })
      });
    });

    // Fill any OTP (will be treated as invalid by mock)
    await fillOtp(page, "0000");
    
    // Click verify button
    await page.getByRole("button", { name: "Verifikasi Email" }).click();
    
    // Should show error message
    await expect(page.getByText("Kode verifikasi tidak valid")).toBeVisible();
    
    // OTP should be cleared
    await expect(page.locator('.ant-otp input').first()).toHaveValue("");
  });

  test("should resend OTP successfully", async ({ page }) => {
    // Mock successful resend response
    await page.route("**/auth/resend-otp", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Kode verifikasi berhasil dikirim ulang"
        })
      });
    });

    // Click resend button
    await page.getByRole("button", { name: "Kirim ulang kode" }).click();
    
    // Should show cooldown timer
    await expect(page.getByText(/Kirim ulang dalam \d+s/)).toBeVisible();
    
    // Resend button should be disabled during cooldown
    await expect(page.getByRole("button", { name: /Kirim ulang dalam/ })).toBeDisabled();
  });

  test("should handle resend OTP error", async ({ page }) => {
    // Mock error response
    await page.route("**/auth/resend-otp", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Gagal mengirim kode verifikasi"
        })
      });
    });

    // Click resend button
    await page.getByRole("button", { name: "Kirim ulang kode" }).click();
    
    // Should show error message
    await expect(page.getByText("Gagal mengirim kode verifikasi")).toBeVisible();
  });

  test("should handle non-numeric input gracefully", async ({ page }) => {
    // Fill OTP with non-numeric characters
    await page.locator('.ant-otp input').first().fill('a');
    await page.locator('.ant-otp input').nth(1).fill('!');
    
    // Verify button should remain disabled with invalid input
    await expect(page.getByRole("button", { name: "Verifikasi Email" })).toBeDisabled();
  });

  test("should show loading state during verification", async ({ page }) => {
    // Mock delayed response
    await page.route("**/auth/sign-up-verify", async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { token: "mock-jwt-token" }
        })
      });
    });

    // Fill any OTP
    await fillOtp(page, "7890");
    
    // Click verify button
    await page.getByRole("button", { name: "Verifikasi Email" }).click();
    
    // Should show loading state
    await expect(page.getByRole("button", { name: "Memverifikasi..." })).toBeVisible();
    
    // OTP inputs should be disabled during loading
    await expect(page.locator('.ant-otp input').first()).toBeDisabled();
  });

  test("should show success state after verification", async ({ page }) => {
    // Mock successful verification
    await page.route("**/auth/sign-up-verify", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { token: "mock-jwt-token" }
        })
      });
    });

    // Fill and submit any OTP
    await fillOtp(page, "4321");
    await page.getByRole("button", { name: "Verifikasi Email" }).click();
    
    // Should show success icon and message
    await expect(page.getByText("Email Terverifikasi!")).toBeVisible();
    await expect(page.getByText("Verifikasi Berhasil!")).toBeVisible();
    await expect(page.getByText("Email Anda telah berhasil diverifikasi")).toBeVisible();
  });

  test("should handle missing email parameter", async ({ page }) => {
    // Navigate without email parameter
    await page.goto("/register/verify-email");
    
    // Should still show the form but with empty email
    await expect(page.getByText("Verifikasi Email Anda")).toBeVisible();
  });

  test("should clear OTP on verification error", async ({ page }) => {
    // Mock error response
    await page.route("**/auth/sign-up-verify", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Kode verifikasi salah"
        })
      });
    });

    // Fill any OTP
    const testOtp = "6789";
    await fillOtp(page, testOtp);
    
    // Verify OTP is filled
    await expect(page.locator('.ant-otp input').first()).toHaveValue(testOtp[0]);
    
    // Submit and get error
    await page.getByRole("button", { name: "Verifikasi Email" }).click();
    await expect(page.getByText("Kode verifikasi salah")).toBeVisible();
    
    // OTP should be cleared after error
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('.ant-otp input').nth(i)).toHaveValue("");
    }
  });
});