// Opens deep links on the dev web build and reports where each one ended up. Exits 1 when any landed elsewhere.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:8081";
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
let failed = false;
for (const path of ["/sign-in", "/nowhere"]) {
  const page = await browser.newPage();
  await page.goto(base + path);
  await page.waitForSelector("text=/screen|Unmatched/i", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const landed = new URL(page.url()).pathname;
  const text = (await page.textContent("#root")).trim().slice(0, 60);
  console.log(`${path} -> ${landed} | ${text}`);
  if (landed !== path) failed = true;
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
