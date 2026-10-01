import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const {marked} = await import(process.env.MARKED_MODULE || 'marked');
const root = path.dirname(fileURLToPath(import.meta.url));
const projects = [
 ['autoronto','aUToronto HMI',['Vehicle telemetry','2D + 3D visualization','Tablet rendering']],
 ['memallocator','Dynamic Memory Allocator',['Nine free lists','Splitting + coalescing','Trace benchmarks']],
 ['forklift','Autonomous Forklift',['ROS2 integration','Perception + navigation','Hardware bring-up']],
 ['medipath','MediPath',['Graph search','Traffic overlays','Desktop map interface']],
 ['stock','LSTM Portfolio Curation',['Financial sequences','Company embeddings','Model evaluation']],
 ['career-canvas','Career Canvas',['Student interests','Course discovery','Interface design']],
 ['calorie-planner','Daily Calorie Planner',['Speech to text','Food recognition','Nutrition lookup']]
];
const esc = text => String(text).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function parse(raw){
 const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!match)throw Error('Missing frontmatter');
 const meta={tech:[]};let list;
 for(const line of match[1].split('\n')){
  if(/^\s*- /.test(line)){if(list)meta[list].push(line.replace(/^\s*- /,''));continue;}
  const kv=line.match(/^([\w-]+):\s*(.*)$/);if(!kv)continue;
  if(!kv[2]){list=kv[1];meta[list]=[];}else{meta[kv[1]]=kv[2];list=null;}
 }return {meta,body:match[2]};
}
projects.forEach(([slug,name,facts],index) => {
 const {meta,body}=parse(fs.readFileSync(path.join(root,'projects',slug,'content.md'),'utf8'));
 const sections=body.split(/(?=^## )/m).filter(x=>x.trim());
 const headings=[];
 const html=sections.map((section,i)=>{
  const m=section.match(/^## (.+)\n/);if(!m)return marked.parse(section);
  const title=m[1],id='section-'+(headings.length+1);headings.push({title,id});
  let content=marked.parse(section.slice(m[0].length)).replace(/<table>/g,'<div class="table-scroll"><table>').replace(/<\/table>/g,'</table></div>');
  return `<section class="project-section" id="${id}"><span class="section-index" aria-hidden="true">${String(headings.length).padStart(2,'0')}</span><h2>${esc(title)}</h2>${content}</section>`;
 }).join('\n');
 const prev=projects[(index+projects.length-1)%projects.length],next=projects[(index+1)%projects.length];
 const result=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f3f0e8"><title>${esc(meta.title)} — Jimin Woo</title><meta name="description" content="${esc(meta.blurb)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../css/site.css"><link rel="stylesheet" href="../../css/project.css"></head>
<body class="project-page" data-project="${slug}"><a class="skip-link" href="#project-content">Skip to project</a><div class="reading-progress" aria-hidden="true"></div><header class="site-header"><a class="wordmark" href="../../index.html"><span class="wordmark-dot" aria-hidden="true"></span>JIMIN WOO</a><nav class="project-nav" aria-label="Primary"><a href="../../index.html#work">Work</a><a href="../../index.html#about">About</a><a href="mailto:rain.woo@mail.utoronto.ca">Say hello ↗</a></nav></header>
<main class="section-shell"><a class="project-home-link" href="../../index.html#work">← All projects</a><header class="project-hero"><div><p class="project-category">${esc(meta.category)}</p><h1>${esc(meta.title)}</h1><p class="project-deck">${esc(meta.blurb)}</p><div class="project-tags">${meta.tech.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${meta.code?`<div class="project-links"><a href="${esc(meta.code)}" target="_blank" rel="noreferrer">Explore the code ↗</a></div>`:''}</div><aside class="project-note" aria-label="Project snapshot"><span class="note-label">Inside this project</span><span class="note-star" aria-hidden="true">✳</span><p class="note-number">${String(index+1).padStart(2,'0')} / 07</p><ul>${facts.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="project-status">${esc(meta.status)}</p></aside></header>
${meta.image?`<figure class="project-cover"><img src="${esc(meta.image)}" alt="${esc(meta.title)} project preview"><figcaption>${esc(meta.title)} · ${slug==='forklift'?'Simulation preview from the existing portfolio':'Project image'} · Select image to enlarge</figcaption></figure>`:''}
<div class="project-layout"><aside class="project-toc"><p>ON THIS PAGE</p><div>${headings.map(({title,id},i)=>`<a href="#${id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(title)}</a>`).join('')}</div></aside><article class="project-content" id="project-content">${html}</article></div>
<nav class="project-end" aria-label="More projects"><a href="../${prev[0]}/"><small>← PREVIOUS PROJECT</small><strong>${esc(prev[1])}</strong></a><a href="../${next[0]}/"><small>NEXT PROJECT →</small><strong>${esc(next[1])}</strong></a></nav><footer class="project-footer"><span>Jimin Woo · Computer Engineering</span><a href="../../index.html#work">Back to work ↑</a><a href="mailto:rain.woo@mail.utoronto.ca">Get in touch ↗</a></footer></main><dialog class="image-dialog" aria-label="Enlarged project image"><button type="button">Close ×</button><img alt=""></dialog><script src="../../js/project-page.js" defer></script></body></html>`;
 fs.writeFileSync(path.join(root,'projects',slug,'index.html'),result);
});
console.log('Built all 7 project pages.');
