if(!self.define){let e,s={};const n=(n,r)=>(n=new URL(n+".js",r).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>n(e,t),c={module:{uri:t},exports:o,require:l};s[t]=Promise.all(r.map((e=>c[e]||l(e)))).then((e=>(i(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CBkrc0sn.js",revision:null},{url:"assets/index-ComYagpC.css",revision:null},{url:"assets/translatorWorker-DaMnAZIa.js",revision:null},{url:"index.html",revision:"2b501a527b547d1822b9221cae8b8b20"},{url:"registerSW.js",revision:"0e6749325659cece033c5258708e5f9f"},{url:"manifest.webmanifest",revision:"55fa30c6efcb9b6e6351b3cc6a98496b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));