// migrate-html-to-blade.js
const fs = require('fs');
const path = require('path');

// --- Walk utility ---
function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (filepath.endsWith('.html')) {
      callback(filepath);
    }
  });
}

// --- Migration ---
function migrateFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Extract layout + attributes
  const layoutRegex = /\{\{#>\s*([\w-]+)(.*?)\}\}/;
  const closingRegex = /\{\{\/([\w-]+)\}\}/;

  let layout = 'admin-layout';
  let attributes = {};

  const layoutMatch = content.match(layoutRegex);
  if (layoutMatch) {
    layout = layoutMatch[1] || layout;
    const attrString = layoutMatch[2];
    const attrRegex = /(\w+)="([^"]+)"/g;
    let match;
    while ((match = attrRegex.exec(attrString)) !== null) {
      attributes[match[1]] = match[2];
    }
    content = content.replace(layoutRegex, '');
  }
  content = content.replace(closingRegex, '');

  // Handlebars → Blade replacements
  content = content.replace(/{{{([^}]+)}}}/g, '{!! $1 !!}');
  content = content.replace(/{{([^}]+)}}/g, '{{$ $1 }}');
  content = content.replace(/{{#if (.+?)}}/g, '@if($1)');
  content = content.replace(/{{else}}/g, '@else');
  content = content.replace(/{{\/if}}/g, '@endif');
  content = content.replace(/{{#each (\w+)}}/g, '@foreach($1 as $item)');
  content = content.replace(/{{this}}/g, '{{$item}}');
  content = content.replace(/{{\/each}}/g, '@endforeach');
  content = content.replace(/{{#unless (.+?)}}/g, '@unless($1)');
  content = content.replace(/{{\/unless}}/g, '@endunless');
  content = content.replace(/{{> (\w+)}}/g, "@include('$1')");
  content = content.replace(/{{!([^}]+)}}/g, '{{--$1--}}');

  // Wrap with Blade layout
  let wrapped = `@extends('layouts.${layout}')\n\n`;
  if (attributes.title) {
    wrapped += `@section('title', '${attributes.title}')\n\n`;
    delete attributes.title;
  }
  for (const [key, value] of Object.entries(attributes)) {
    wrapped += `@php($${key} = '${value}')\n`;
  }
  if (Object.keys(attributes).length > 0) wrapped += `\n`;

  wrapped += `@section('content')\n${content.trim()}\n@endsection`;

  // Save as Blade file
  const newPath = filepath.replace(/\.html$/, '.blade.php');
  fs.writeFileSync(newPath, wrapped, 'utf8');
  console.log(`Migrated & wrapped: ${filepath} → ${newPath}`);
}

// --- Cleanup with dry-run ---
function deleteHtmlFiles(dir, dryRun = false) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      deleteHtmlFiles(filepath, dryRun);
    } else if (filepath.endsWith('.html')) {
      if (dryRun) {
        console.log(`[Dry-run] Would delete: ${filepath}`);
      } else {
        fs.unlinkSync(filepath);
        console.log(`Deleted: ${filepath}`);
      }
    }
  });
}

// --- Run migration ---
walk('./pages', migrateFile);

// --- Cleanup step ---
// Pass true for dry-run, false for actual deletion
const dryRun = process.argv.includes('--dry-run');
deleteHtmlFiles('./pages', dryRun);
