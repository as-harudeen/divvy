#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');
const allowedMoneyMathFiles = new Set([path.join(repoRoot, 'packages/utils/src/money.ts')]);
const ignoredDirs = new Set([
  '.expo',
  '.git',
  '.turbo',
  'android',
  'build',
  'coverage',
  'dist',
  'ios',
  'node_modules',
]);
const checkedExtensions = new Set(['.ts', '.tsx']);
const moneyNamePattern = /(?:Amount|Total|Cents)$/;

function isIgnoredDir(name) {
  return ignoredDirs.has(name);
}

function collectFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!isIgnoredDir(entry.name)) {
        collectFiles(path.join(dir, entry.name), files);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const filePath = path.join(dir, entry.name);
    const extension = path.extname(entry.name);
    if (
      checkedExtensions.has(extension) &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.generated.ts')
    ) {
      files.push(filePath);
    }
  }

  return files;
}

function addMoneyName(name, names) {
  if (moneyNamePattern.test(name)) {
    names.add(name);
  }
}

function collectMoneyNames(node, names = new Set()) {
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
    addMoneyName(node.text, names);
    return names;
  }

  if (ts.isStringLiteralLike(node)) {
    addMoneyName(node.text, names);
    return names;
  }

  ts.forEachChild(node, (child) => collectMoneyNames(child, names));
  return names;
}

function formatFinding(sourceFile, node, names) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const relativePath = path.relative(repoRoot, sourceFile.fileName);
  const operator = node.operatorToken.getText(sourceFile);
  return `${relativePath}:${line + 1}:${character + 1} money value "${[...names].join(
    ', ',
  )}" used with "${operator}" outside packages/utils/src/money.ts`;
}

function checkFile(filePath) {
  if (allowedMoneyMathFiles.has(filePath)) {
    return [];
  }

  const sourceText = fs.readFileSync(filePath, 'utf8');
  const scriptKind = path.extname(filePath) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  const findings = [];

  function visit(node) {
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.AsteriskToken ||
        node.operatorToken.kind === ts.SyntaxKind.SlashToken)
    ) {
      const names = collectMoneyNames(node);
      if (names.size > 0) {
        findings.push(formatFinding(sourceFile, node, names));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

const findings = collectFiles(repoRoot).flatMap(checkFile);

if (findings.length > 0) {
  process.stderr.write('Money math guard failed:\n');
  for (const finding of findings) {
    process.stderr.write(`- ${finding}\n`);
  }
  process.stderr.write(
    'Use helpers from @repo/utils instead of raw money multiplication or division.\n',
  );
  process.exit(1);
}

process.stdout.write('Money math guard passed.\n');
