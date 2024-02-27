import { test, expect } from "@playwright/test";

test("should navigate to home page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle("Create Next App");
  await expect(page.locator("h1")).toContainText("Hello World!");
});

test("should create to-do", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  const input = page.getByPlaceholder("Enter a To-Do");
  await input.fill("test to-do");
  const saveBtn = page.getByText("Save");
  await saveBtn.click();
  await page.waitForSelector("#updateTodo");
  // Check for GUID route value
  expect(page.url().replace("http://localhost:3000/", "").length).toBe(36);
});

test("should update to-do", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  const input = page.getByPlaceholder("Enter a To-Do");
  await input.fill("update test to-do");
  const saveBtn = page.getByText("Save");
  await saveBtn.click();
  const updateInput = await page.waitForSelector("#newName");
  await updateInput.fill("update test to-do updated");
  const updateSaveBtn = page.getByText("Save");
  await updateSaveBtn.click();
  await page.reload();
  const inputValue = await page.locator("#newName").inputValue();
  expect(inputValue).toBe("update test to-do updated");
});

test("should delete to-do", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  const input = page.getByPlaceholder("Enter a To-Do");
  await input.fill("delete test to-do");
  const saveBtn = page.getByText("Save");
  await saveBtn.click();
  const deleteBtn = await page.waitForSelector("#deleteToDoBtn");
  await deleteBtn.click();
  await page.waitForURL("http://localhost:3000/");
  expect(page.url()).toBe("http://localhost:3000/");
});
