const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docsSrc = path.join(root, 'docs', 'components');
const templatePath = path.join(root, 'docs', 'site', 'template.html');
const outDir = path.join(root, 'docs', 'site', 'generated');

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function readTemplate(){
  if(!fs.existsSync(templatePath)){
    console.error('Template not found:', templatePath);
    process.exit(1);
  }
  return fs.readFileSync(templatePath,'utf8');
}

function mdToHtml(md){
  md = md.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  md = md.replace(/```([a-z]*)\n([\s\S]*?)```/g, function(_,lang,code){
    return '<pre><code data-lang="'+lang+'">'+code.replace(/&lt;/g,'<').replace(/&gt;/g,'>')+'</code></pre>';
  });
  md = md.replace(/^### (.*$)/gm,'<h3>$1</h3>');
  md = md.replace(/^## (.*$)/gm,'<h2>$1</h2>');
  md = md.replace(/^# (.*$)/gm,'<h1>$1</h1>');
  md = md.replace(/^\s*[-\*] (.*)$/gm,'<li>$1</li>');
  md = md.replace(/(<li>[\s\S]*?<\/li>)/g, function(m){ if(m.indexOf('<ul>')===-1) return '<ul>'+m+'</ul>'; return m; });
  md = md.replace(/^---$/gm,'<hr>');
  md = md.replace(/`([^`]+)`/g,'<code>$1</code>');
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  const lines = md.split(/\n\n+/);
  return lines.map(l=>{
    if(/^<h|^<ul|^<pre|^<hr|^<p|^<table/.test(l.trim())) return l;
    return '<p>'+l.replace(/\n/g,' ')+'</p>';
  }).join('\n');
}

function build(){
  ensureDir(outDir);
  const template = readTemplate();
  const files = fs.readdirSync(docsSrc).filter(f=>f.endsWith('.md'));
  const indexItems = [];

  files.forEach(file=>{
    const src = path.join(docsSrc,file);
    const name = path.basename(file, '.md');
    const md = fs.readFileSync(src,'utf8');
    const html = mdToHtml(md);
    const titleMatch = md.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : name;
    const page = template.replace('{{title}}', title).replace('{{content}}', html);
    const outPath = path.join(outDir, name + '.html');
    fs.writeFileSync(outPath, page, 'utf8');
    indexItems.push({name, title, path: './' + name + '.html'});
    console.log('Written', outPath);
  });

  const idxHtml = ['<!doctype html>','<html><head><meta charset="utf-8"><title>Docs Index</title><link rel="stylesheet" href="../styles.css"></head><body><div style="max-width:900px;margin:20px">','<h1>Component docs</h1>','<ul>']
    .concat(indexItems.map(i=>`<li><a href="${i.path}">${i.title}</a></li>`))
    .concat(['</ul>','<p><a href="../index.html">Open interactive docs</a></p>','</div></body></html>']).join('\n');
  fs.writeFileSync(path.join(outDir,'index.html'), idxHtml, 'utf8');
  console.log('\nDocs generated to', outDir);
}

build();
