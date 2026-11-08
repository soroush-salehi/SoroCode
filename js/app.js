"use strict";
const $ = selector => document.querySelector(selector);
const STORAGE = "sorocode.project.v2";
const starter = {
 html: '<main><span class="eyebrow">WELCOME TO SOROCODE</span><h1>Hello, builder.</h1><p>Your next idea starts here.</p><button id="action">Try interaction</button></main>',
 css: 'body{font-family:system-ui;background:#f4f7fb;color:#17243a;padding:3rem}main{max-width:640px;margin:5vh auto}h1{font-size:clamp(2.5rem,7vw,4.5rem);letter-spacing:-.06em}button{padding:.8rem 1.1rem;border:0;border-radius:12px;background:#4169e8;color:#fff;cursor:pointer}',
 js: 'document.querySelector("#action")?.addEventListener("click",()=>{document.querySelector("p").textContent="Your preview is interactive."});'
};
let active = "html";
function load() {
 try {
  const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
  Object.keys(starter).forEach(key => $("#"+key).value = saved?.[key] ?? starter[key]);
 } catch { Object.keys(starter).forEach(key => $("#"+key).value=starter[key]); }
}
function save() {
 try { localStorage.setItem(STORAGE,JSON.stringify(Object.fromEntries(Object.keys(starter).map(key=>[key,$("#"+key).value])))); $("#status").textContent="Saved locally"; }
 catch { $("#status").textContent="Could not save"; }
}
function run() {
 const html=$("#html").value, css=$("#css").value, js=$("#js").value;
 const documentSource='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body>'+html+'<script>'+js.replace(/<\/script/gi,"<\\/script")+'<\/script></body></html>';
 $("#frame").srcdoc=documentSource;
 $("#status").textContent="Preview refreshed";
}
document.querySelectorAll("[data-tab]").forEach(button=>button.addEventListener("click",()=>{
 active=button.dataset.tab;
 document.querySelectorAll("[data-tab]").forEach(tab=>{tab.classList.toggle("active",tab===button);tab.setAttribute("aria-selected",String(tab===button));});
 Object.keys(starter).forEach(key=>$("#"+key).hidden=key!==active);
 $("#"+active).focus();
}));
Object.keys(starter).forEach(key=>$("#"+key).addEventListener("input",()=>{save();}));
$("#run").addEventListener("click",run);
$("#reset").addEventListener("click",()=>{if(confirm("Reset the editor to its starter project?")){Object.keys(starter).forEach(key=>$("#"+key).value=starter[key]);save();run();}});
load(); run();