// Next.js "standalone" output doesn't include public/ or .next/static/ by
// design (docs say to copy them yourself). This script does that copy after
// every build so the standalone server works as soon as it's deployed.
import { cpSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("No .next/standalone output found, skipping asset copy.");
  process.exit(0);
}

cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true });

console.log("Copied public/ and .next/static/ into .next/standalone/");
