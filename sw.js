if(!self.define){let e,n={};const s=(s,r)=>(s=new URL(s+".js",r).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(r,i)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let l={};const t=e=>s(e,o),d={module:{uri:o},exports:l,require:t};n[o]=Promise.all(r.map((e=>d[e]||t(e)))).then((e=>(i(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-D55ou3N0.css",revision:null},{url:"assets/index-Dr3vEZco.js",revision:null},{url:"assets/translatorWorker-DaMnAZIa.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"c40ac88f3fe66729c80f2233a0f73e73"},{url:"ynlb192.png",revision:"8720addbe21e8a333b8b63d5adb4bf44"},{url:"ynlb512.png",revision:"e1d28d5fdcb2f68d0dd7d07d7cf4bee6"},{url:"ynlbmaskable512.png",revision:"d05455a2dd882597520e310dfc61b9a8"},{url:"manifest.webmanifest",revision:"d192f8984fc827a127bc32568f9a9339"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/ynlb/index.html")))}));
