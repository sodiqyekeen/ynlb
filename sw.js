if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let l={};const o=e=>n(e,d),t={module:{uri:d},exports:l,require:o};s[d]=Promise.all(i.map((e=>t[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index--7jFgBXt.js",revision:null},{url:"assets/index-BiqKr0TC.css",revision:null},{url:"assets/translatorWorker-Zite-VIR.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"e2bfeac7ceb659e4d27cefdbc3d1e238"},{url:"ynlb192.png",revision:"8720addbe21e8a333b8b63d5adb4bf44"},{url:"ynlb512.png",revision:"e1d28d5fdcb2f68d0dd7d07d7cf4bee6"},{url:"ynlbmaskable512.png",revision:"d05455a2dd882597520e310dfc61b9a8"},{url:"manifest.webmanifest",revision:"d192f8984fc827a127bc32568f9a9339"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/ynlb/index.html")))}));
