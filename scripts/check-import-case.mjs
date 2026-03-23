import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve("src");
const sourceFilePattern = /\.(ts|tsx|js|jsx)$/;
const candidateExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const importPattern =
  /import\s+(?:[^'"`;]+?\s+from\s+)?["']([^"']+)["']|export\s+[^'"`;]+?\s+from\s+["']([^"']+)["']/g;

const sourceFiles = [];
const issues = [];

walk(rootDir);
checkFiles();

if (issues.length > 0) {
  console.error("Case-sensitive import check failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Checked ${sourceFiles.length} source files: no case-sensitive import issues found.`);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (sourceFilePattern.test(entry.name)) {
      sourceFiles.push(fullPath);
    }
  }
}

function checkFiles() {
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8");
    const fileDir = path.dirname(file);

    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? match[2];
      if (!specifier?.startsWith(".")) {
        continue;
      }

      const resolvedBase = path.resolve(fileDir, specifier);
      const resolvedPath = resolveImport(resolvedBase);

      if (!resolvedPath) {
        issues.push(`${toRelative(file)} imports "${specifier}" but no matching file exists.`);
        continue;
      }

      if (!pathExistsWithExactCase(resolvedPath)) {
        issues.push(
          `${toRelative(file)} imports "${specifier}" but the real path casing is "${toRelative(resolvedPath)}".`
        );
      }
    }
  }
}

function resolveImport(resolvedBase) {
  if (path.extname(resolvedBase)) {
    return fs.existsSync(resolvedBase) ? resolvedBase : null;
  }

  for (const extension of candidateExtensions) {
    const directFile = `${resolvedBase}${extension}`;
    if (fs.existsSync(directFile)) {
      return directFile;
    }

    const indexFile = path.join(resolvedBase, `index${extension}`);
    if (fs.existsSync(indexFile)) {
      return indexFile;
    }
  }

  return null;
}

function pathExistsWithExactCase(targetPath) {
  const absolutePath = path.resolve(targetPath);
  const { root } = path.parse(absolutePath);
  let currentPath = root;

  for (const segment of absolutePath.slice(root.length).split(path.sep).filter(Boolean)) {
    const entries = fs.readdirSync(currentPath);
    if (!entries.includes(segment)) {
      return false;
    }
    currentPath = path.join(currentPath, segment);
  }

  return true;
}

function toRelative(targetPath) {
  return path.relative(process.cwd(), targetPath) || ".";
}