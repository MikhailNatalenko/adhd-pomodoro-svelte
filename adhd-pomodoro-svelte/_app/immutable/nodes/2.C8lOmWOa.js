import{A as _e,s as X,c as Ue,e as T,b as A,p as z,d as S,f as M,i as h,j as R,v as I,k as P,O as U,u as Ve,g as Fe,a as Ge,t as H,h as J,w as fe,l as _,m as re,P as ae,Q as Te,R as Se,n as x,S as ee,T as we,r as pe,U as Xe,V as qe,W as ve,x as Ye,X as Qe}from"../chunks/scheduler.DfcxTzeO.js";import{a as O,t as N,S as q,i as Y,b as V,d as F,m as G,e as j,g as oe,c as se,f as Ke}from"../chunks/index.cws5nFLo.js";function te(i){return(i==null?void 0:i.length)!==void 0?i:Array.from(i)}function Ie(i,e){O(i,1,1,()=>{e.delete(i.key)})}function Ce(i,e,t,n,l,s,o,r,a,f,u,c){let m=i.length,p=s.length,v=m;const b={};for(;v--;)b[i[v].key]=v;const D=[],C=new Map,W=new Map,$=[];for(v=p;v--;){const w=c(l,s,v),k=t(w);let y=o.get(k);y?$.push(()=>y.p(w,e)):(y=f(k,w),y.c()),C.set(k,D[v]=y),k in b&&W.set(k,Math.abs(v-b[k]))}const L=new Set,K=new Set;function Q(w){N(w,1),w.m(r,u),o.set(w.key,w),u=w.first,p--}for(;m&&p;){const w=D[p-1],k=i[m-1],y=w.key,d=k.key;w===k?(u=w.first,m--,p--):C.has(d)?!o.has(y)||L.has(y)?Q(w):K.has(d)?m--:W.get(y)>W.get(d)?(K.add(y),Q(w)):(L.add(d),m--):(a(k,o),m--)}for(;m--;){const w=i[m];C.has(w.key)||a(w,o)}for(;p;)Q(D[p-1]);return _e($),D}function Ze(i,e){const t={},n={},l={$$scope:1};let s=i.length;for(;s--;){const o=i[s],r=e[s];if(r){for(const a in o)a in r||(n[a]=1);for(const a in r)l[a]||(t[a]=r[a],l[a]=1);i[s]=r}else for(const a in o)l[a]=1}for(const o in n)o in t||(t[o]=void 0);return t}function xe(i){return typeof i=="object"&&i!==null?i:{}}const et="/ring2.wav";let je=function(){},ie,he,ze=.5,ce;if(typeof window<"u"){let i=window.AudioContext||window.webkitAudioContext;ie=new i,fetch(et).then(e=>e.arrayBuffer()).then(e=>ie.decodeAudioData(e)).then(e=>{he=e}).catch(e=>console.error("Error loading sound file:",e)),je=function(){if(!he)return;ce=ie.createBufferSource(),ce.buffer=he;let e=ie.createGain();e.gain.value=ze,ce.connect(e),e.connect(ie.destination),ce.start(0)}}function be(){je()}function tt(i,e){ze=i,be()}function Pe(i){let e,t;return{c(){e=T("div"),t=H(i[0]),this.h()},l(n){e=S(n,"DIV",{style:!0,class:!0});var l=M(e);t=J(l,i[0]),l.forEach(h),this.h()},h(){fe(e,"top",i[3]+"px"),fe(e,"left",i[2]+"px"),I(e,"class","tooltip svelte-smlhfz")},m(n,l){P(n,e,l),_(e,t)},p(n,l){l&1&&re(t,n[0]),l&8&&fe(e,"top",n[3]+"px"),l&4&&fe(e,"left",n[2]+"px")},d(n){n&&h(e)}}}function nt(i){let e,t,n,l,s,o;const r=i[8].default,a=Ue(r,i,i[7],null);let f=i[1]&&Pe(i);return{c(){e=T("div"),a&&a.c(),t=A(),f&&f.c(),n=z(),this.h()},l(u){e=S(u,"DIV",{"aria-hidden":!0});var c=M(e);a&&a.l(c),c.forEach(h),t=R(u),f&&f.l(u),n=z(),this.h()},h(){I(e,"aria-hidden","true")},m(u,c){P(u,e,c),a&&a.m(e,null),P(u,t,c),f&&f.m(u,c),P(u,n,c),l=!0,s||(o=[U(e,"mouseover",i[4]),U(e,"mouseleave",i[6]),U(e,"mousemove",i[5]),U(e,"focus",lt)],s=!0)},p(u,[c]){a&&a.p&&(!l||c&128)&&Ve(a,r,u,u[7],l?Ge(r,u[7],c,null):Fe(u[7]),null),u[1]?f?f.p(u,c):(f=Pe(u),f.c(),f.m(n.parentNode,n)):f&&(f.d(1),f=null)},i(u){l||(N(a,u),l=!0)},o(u){O(a,u),l=!1},d(u){u&&(h(e),h(t),h(n)),a&&a.d(u),f&&f.d(u),s=!1,_e(o)}}}const lt=function(){};function it(i,e,t){let{$$slots:n={},$$scope:l}=e,{title:s=""}=e,o=!1,r,a;function f(m){t(1,o=!0),t(2,r=m.pageX+10),t(3,a=m.pageY+10)}function u(m){t(2,r=m.pageX+10),t(3,a=m.pageY+10)}function c(){t(1,o=!1)}return i.$$set=m=>{"title"in m&&t(0,s=m.title),"$$scope"in m&&t(7,l=m.$$scope)},[s,o,r,a,f,u,c,l,n]}class ke extends q{constructor(e){super(),Y(this,e,it,nt,X,{title:0})}}function $e(i){let e,t=ye(i[1])+"",n,l,s;return{c(){e=T("button"),n=H(t),this.h()},l(o){e=S(o,"BUTTON",{id:!0,class:!0});var r=M(e);n=J(r,t),r.forEach(h),this.h()},h(){I(e,"id","watch"),I(e,"class","svelte-9y7wid")},m(o,r){P(o,e,r),_(e,n),l||(s=U(e,"click",i[2]),l=!0)},p(o,r){r&2&&t!==(t=ye(o[1])+"")&&re(n,t)},d(o){o&&h(e),l=!1,s()}}}function ot(i){let e,t=i[0]&&$e(i);return{c(){t&&t.c(),e=z()},l(n){t&&t.l(n),e=z()},m(n,l){t&&t.m(n,l),P(n,e,l)},p(n,l){n[0]?t?t.p(n,l):(t=$e(n),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null)},d(n){n&&h(e),t&&t.d(n)}}}function st(i){let e,t;return e=new ke({props:{title:"stop timer",$$slots:{default:[ot]},$$scope:{ctx:i}}}),{c(){V(e.$$.fragment)},l(n){F(e.$$.fragment,n)},m(n,l){G(e,n,l),t=!0},p(n,[l]){const s={};l&515&&(s.$$scope={dirty:l,ctx:n}),e.$set(s)},i(n){t||(N(e.$$.fragment,n),t=!0)},o(n){O(e.$$.fragment,n),t=!1},d(n){j(e,n)}}}function ye(i){let e=Math.floor(i/60).toString().padStart(2,"0"),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function rt(i,e,t){let{time:n=0}=e,{visible:l=!0}=e;const s=ae();let o=new Date,r=0,a=0;function f(m){console.log("runTimer",m),o=new Date,clearInterval(a),t(1,r=m),n!=0&&(a=setInterval(()=>{let p=n-Math.floor((Date.now()-o.getTime())/1e3);if(p<=0){u(),clearInterval(a);return}t(1,r=p)},500))}function u(){be(),s("alarming",{startTs:o,initTime:n,endTs:new Date})}function c(){s("stop")}return i.$$set=m=>{"time"in m&&t(3,n=m.time),"visible"in m&&t(0,l=m.visible)},i.$$.update=()=>{i.$$.dirty&8&&f(n)},[l,r,c,n]}class at extends q{constructor(e){super(),Y(this,e,rt,st,X,{time:3,visible:0})}}function ft(i){let e,t,n,l,s,o;return{c(){e=T("button"),t=H(i[1]),n=H(" min"),this.h()},l(r){e=S(r,"BUTTON",{class:!0});var a=M(e);t=J(a,i[1]),n=J(a," min"),a.forEach(h),this.h()},h(){I(e,"class",l=Te(i[2])+" svelte-vslwa"),e.disabled=i[3],Se(e,"pressed",i[0])},m(r,a){P(r,e,a),_(e,t),_(e,n),s||(o=U(e,"click",i[5]),s=!0)},p(r,[a]){a&2&&re(t,r[1]),a&4&&l!==(l=Te(r[2])+" svelte-vslwa")&&I(e,"class",l),a&8&&(e.disabled=r[3]),a&5&&Se(e,"pressed",r[0])},i:x,o:x,d(r){r&&h(e),s=!1,o()}}}function ct(i,e,t){const n=ae();let{value:l}=e,{name:s}=e,{disabled:o=!1}=e,{pressed:r=!1}=e;function a(c,m){n("start",{name:c,val:m}),t(0,r=!0)}function f(c){c||t(0,r=!1)}const u=function(){a(s,l)};return i.$$set=c=>{"value"in c&&t(1,l=c.value),"name"in c&&t(2,s=c.name),"disabled"in c&&t(3,o=c.disabled),"pressed"in c&&t(0,r=c.pressed)},i.$$.update=()=>{i.$$.dirty&8&&f(o)},[r,l,s,o,a,u]}class We extends q{constructor(e){super(),Y(this,e,ct,ft,X,{value:1,name:2,disabled:3,pressed:0})}}function Ee(i,e,t){const n=i.slice();return n[6]=e[t],n}const ut=i=>({}),Ne=i=>({class:"item svelte-1avocgd"});function De(i,e,t){const n=i.slice();return n[6]=e[t],n}function Oe(i,e){let t,n,l,s,o;return n=new We({props:{value:e[6],name:"work",disabled:!e[0]}}),n.$on("start",e[2]),{key:i,first:null,c(){t=z(),V(n.$$.fragment),l=A(),s=T("br"),this.h()},l(r){t=z(),F(n.$$.fragment,r),l=R(r),s=S(r,"BR",{}),this.h()},h(){this.first=t},m(r,a){P(r,t,a),G(n,r,a),P(r,l,a),P(r,s,a),o=!0},p(r,a){e=r;const f={};a&1&&(f.disabled=!e[0]),n.$set(f)},i(r){o||(N(n.$$.fragment,r),o=!0)},o(r){O(n.$$.fragment,r),o=!1},d(r){r&&(h(t),h(l),h(s)),j(n,r)}}}function Ae(i,e){let t,n,l,s,o;return n=new We({props:{value:e[6],name:"rest",disabled:!e[0]}}),n.$on("start",e[2]),{key:i,first:null,c(){t=z(),V(n.$$.fragment),l=A(),s=T("br"),this.h()},l(r){t=z(),F(n.$$.fragment,r),l=R(r),s=S(r,"BR",{}),this.h()},h(){this.first=t},m(r,a){P(r,t,a),G(n,r,a),P(r,l,a),P(r,s,a),o=!0},p(r,a){e=r;const f={};a&1&&(f.disabled=!e[0]),n.$set(f)},i(r){o||(N(n.$$.fragment,r),o=!0)},o(r){O(n.$$.fragment,r),o=!1},d(r){r&&(h(t),h(l),h(s)),j(n,r)}}}function mt(i){let e,t,n,l,s="Active",o,r,a=[],f=new Map,u,c,m,p,v="Rest",b,D,C=[],W=new Map,$,L=te(i[1]);const K=d=>d[6];for(let d=0;d<L.length;d+=1){let g=De(i,L,d),E=K(g);f.set(E,a[d]=Oe(E,g))}const Q=i[4].default,w=Ue(Q,i,i[3],Ne);let k=te(i[1]);const y=d=>d[6];for(let d=0;d<k.length;d+=1){let g=Ee(i,k,d),E=y(g);W.set(E,C[d]=Ae(E,g))}return{c(){e=T("div"),t=T("div"),n=T("div"),l=T("span"),l.textContent=s,o=T("br"),r=A();for(let d=0;d<a.length;d+=1)a[d].c();u=A(),w&&w.c(),c=A(),m=T("div"),p=T("span"),p.textContent=v,b=T("br"),D=A();for(let d=0;d<C.length;d+=1)C[d].c();this.h()},l(d){e=S(d,"DIV",{});var g=M(e);t=S(g,"DIV",{class:!0});var E=M(t);n=S(E,"DIV",{class:!0});var ne=M(n);l=S(ne,"SPAN",{class:!0,"data-svelte-h":!0}),ee(l)!=="svelte-19szg5l"&&(l.textContent=s),o=S(ne,"BR",{}),r=R(ne);for(let Z=0;Z<a.length;Z+=1)a[Z].l(ne);ne.forEach(h),u=R(E),w&&w.l(E),c=R(E),m=S(E,"DIV",{class:!0});var le=M(m);p=S(le,"SPAN",{class:!0,"data-svelte-h":!0}),ee(p)!=="svelte-1gtata5"&&(p.textContent=v),b=S(le,"BR",{}),D=R(le);for(let Z=0;Z<C.length;Z+=1)C[Z].l(le);le.forEach(h),E.forEach(h),g.forEach(h),this.h()},h(){I(l,"class","label svelte-1avocgd"),I(n,"class","item svelte-1avocgd"),I(p,"class","label svelte-1avocgd"),I(m,"class","item svelte-1avocgd"),I(t,"class","grid-container svelte-1avocgd")},m(d,g){P(d,e,g),_(e,t),_(t,n),_(n,l),_(n,o),_(n,r);for(let E=0;E<a.length;E+=1)a[E]&&a[E].m(n,null);_(t,u),w&&w.m(t,null),_(t,c),_(t,m),_(m,p),_(m,b),_(m,D);for(let E=0;E<C.length;E+=1)C[E]&&C[E].m(m,null);$=!0},p(d,[g]){g&7&&(L=te(d[1]),oe(),a=Ce(a,g,K,1,d,L,f,n,Ie,Oe,null,De),se()),w&&w.p&&(!$||g&8)&&Ve(w,Q,d,d[3],$?Ge(Q,d[3],g,ut):Fe(d[3]),Ne),g&7&&(k=te(d[1]),oe(),C=Ce(C,g,y,1,d,k,W,m,Ie,Ae,null,Ee),se())},i(d){if(!$){for(let g=0;g<L.length;g+=1)N(a[g]);N(w,d);for(let g=0;g<k.length;g+=1)N(C[g]);$=!0}},o(d){for(let g=0;g<a.length;g+=1)O(a[g]);O(w,d);for(let g=0;g<C.length;g+=1)O(C[g]);$=!1},d(d){d&&h(e);for(let g=0;g<a.length;g+=1)a[g].d();w&&w.d(d);for(let g=0;g<C.length;g+=1)C[g].d()}}}function dt(i,e,t){let{$$slots:n={},$$scope:l}=e;const s=ae();let o=[5,10,15,20,25];function r(f){s("start",{timer:f.detail.val,name:f.detail.name}),console.log("handleTimerStart")}let{active:a=!0}=e;return i.$$set=f=>{"active"in f&&t(0,a=f.active),"$$scope"in f&&t(3,l=f.$$scope)},[a,o,r,l,n]}class ht extends q{constructor(e){super(),Y(this,e,dt,mt,X,{active:0})}}/*! js-cookie v3.0.5 | MIT */function ue(i){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)i[n]=t[n]}return i}var gt={read:function(i){return i[0]==='"'&&(i=i.slice(1,-1)),i.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(i){return encodeURIComponent(i).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function ge(i,e){function t(l,s,o){if(!(typeof document>"u")){o=ue({},e,o),typeof o.expires=="number"&&(o.expires=new Date(Date.now()+o.expires*864e5)),o.expires&&(o.expires=o.expires.toUTCString()),l=encodeURIComponent(l).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var r="";for(var a in o)o[a]&&(r+="; "+a,o[a]!==!0&&(r+="="+o[a].split(";")[0]));return document.cookie=l+"="+i.write(s,l)+r}}function n(l){if(!(typeof document>"u"||arguments.length&&!l)){for(var s=document.cookie?document.cookie.split("; "):[],o={},r=0;r<s.length;r++){var a=s[r].split("="),f=a.slice(1).join("=");try{var u=decodeURIComponent(a[0]);if(o[u]=i.read(f,u),l===u)break}catch{}}return l?o[l]:o}}return Object.create({set:t,get:n,remove:function(l,s){t(l,"",ue({},s,{expires:-1}))},withAttributes:function(l){return ge(this.converter,ue({},this.attributes,l))},withConverter:function(l){return ge(ue({},this.converter,l),this.attributes)}},{attributes:{value:Object.freeze(e)},converter:{value:Object.freeze(i)}})}var me=ge(gt,{path:"/"});function _t(i){let e,t,n,l='<img src="../volume_mute.svg" alt="Mute icon"/>',s,o,r,a,f='<img src="../volume_up.svg" alt="Volume max icon"/>',u,c;return{c(){e=T("label"),t=T("div"),n=T("button"),n.innerHTML=l,s=A(),o=T("input"),r=A(),a=T("button"),a.innerHTML=f,this.h()},l(m){e=S(m,"LABEL",{});var p=M(e);t=S(p,"DIV",{class:!0});var v=M(t);n=S(v,"BUTTON",{class:!0,"data-svelte-h":!0}),ee(n)!=="svelte-1233ysa"&&(n.innerHTML=l),s=R(v),o=S(v,"INPUT",{class:!0,type:!0,min:!0,max:!0}),r=R(v),a=S(v,"BUTTON",{class:!0,"data-svelte-h":!0}),ee(a)!=="svelte-bgwisf"&&(a.innerHTML=f),v.forEach(h),p.forEach(h),this.h()},h(){I(n,"class","leftbutton svelte-14xuhg1"),I(o,"class","slider bar svelte-14xuhg1"),I(o,"type","range"),I(o,"min","0"),I(o,"max","100"),I(a,"class","svelte-14xuhg1"),I(t,"class","container svelte-14xuhg1")},m(m,p){P(m,e,p),_(e,t),_(t,n),_(t,s),_(t,o),we(o,i[0]),_(t,r),_(t,a),u||(c=[U(n,"click",i[2]),U(o,"change",i[7]),U(o,"input",i[7]),U(o,"mouseup",i[1]),U(a,"click",i[3])],u=!0)},p(m,[p]){p&1&&we(o,m[0])},i:x,o:x,d(m){m&&h(e),u=!1,_e(c)}}}function pt(i,e,t){let n,l,s,o=!1;function r(c){t(6,n=c.target.value)}function a(){t(6,n=0)}function f(){t(6,n=100),t(0,l=100)}pe(()=>{const c=me.get("volume");if(console.log("vol",c),t(5,o=!0),c==null){t(4,s=10);return}t(4,s=parseInt(c))});function u(){l=Xe(this.value),t(0,l),t(6,n),t(4,s)}return i.$$.update=()=>{i.$$.dirty&16&&t(6,n=s),i.$$.dirty&64&&t(0,l=n),i.$$.dirty&96&&o&&(console.log("volume",n),tt(n/100),me.set("volume",n.toString()))},[l,r,a,f,s,o,n,u]}class vt extends q{constructor(e){super(),Y(this,e,pt,_t,X,{})}}function bt(i,e,t){const n=ae();let{intervalS:l=0}=e,{timeoutS:s=0}=e,{active:o=!0}=e,r=0,a=0;function f(c){console.log("run annoyer",c),clearInterval(r),clearTimeout(a),c&&(r=setInterval(()=>{be(),o||clearInterval(r)},l*1e3),a=setTimeout(()=>{c=!1,u()},s*1e3))}function u(){n("off")}return i.$$set=c=>{"intervalS"in c&&t(0,l=c.intervalS),"timeoutS"in c&&t(1,s=c.timeoutS),"active"in c&&t(2,o=c.active)},i.$$.update=()=>{i.$$.dirty&4&&f(o)},[l,s,o]}class kt extends q{constructor(e){super(),Y(this,e,bt,null,X,{intervalS:0,timeoutS:1,active:2})}}const B={RUNNING:"RUNNING",STOPPED:"STOPPED",WAITING_FOR_STOP:"WAITING_FOR_STOP",ADDING_TIME:"ADDING_TIME"},Me="/tea.png",Tt="/clock_red.png",St="/clock_yellow.png";function wt(i){if(console.log("changeFavicon",i),typeof document>"u"||document===null)return;const e=document.getElementById("favicon");if(e!==null)switch(i){case B.STOPPED:e.href=Me;break;case B.RUNNING:e.href=Tt;break;case B.WAITING_FOR_STOP:e.href=St;break;default:e.href=Me}}function It(i){let e,t,n;return e=new vt({}),{c(){V(e.$$.fragment),t=T("br")},l(l){F(e.$$.fragment,l),t=S(l,"BR",{})},m(l,s){G(e,l,s),P(l,t,s),n=!0},p:x,i(l){n||(N(e.$$.fragment,l),n=!0)},o(l){O(e.$$.fragment,l),n=!1},d(l){l&&h(t),j(e,l)}}}function Re(i){let e,t;return e=new ke({props:{title:"stop and don't save logs",$$slots:{default:[Ct]},$$scope:{ctx:i}}}),{c(){V(e.$$.fragment)},l(n){F(e.$$.fragment,n)},m(n,l){G(e,n,l),t=!0},p(n,l){const s={};l&524292&&(s.$$scope={dirty:l,ctx:n}),e.$set(s)},i(n){t||(N(e.$$.fragment,n),t=!0)},o(n){O(e.$$.fragment,n),t=!1},d(n){j(e,n)}}}function Ct(i){let e,t,n,l,s,o,r;return{c(){e=T("button"),t=H("cancel"),l=A(),s=T("br"),this.h()},l(a){e=S(a,"BUTTON",{id:!0,class:!0});var f=M(e);t=J(f,"cancel"),f.forEach(h),l=R(a),s=S(a,"BR",{}),this.h()},h(){I(e,"id","stopper"),e.hidden=n=i[2]===B.STOPPED,I(e,"class","svelte-x7f3g1")},m(a,f){P(a,e,f),_(e,t),P(a,l,f),P(a,s,f),o||(r=U(e,"click",i[7]),o=!0)},p(a,f){f&4&&n!==(n=a[2]===B.STOPPED)&&(e.hidden=n)},d(a){a&&(h(e),h(l),h(s)),o=!1,r()}}}function Pt(i){let e,t,n,l,s,o;t=new at({props:{time:i[3]}}),t.$on("alarming",i[5]),t.$on("stop",i[8]),l=new ke({props:{title:"Volume",$$slots:{default:[It]},$$scope:{ctx:i}}});let r=i[2]!==B.STOPPED&&Re(i);return{c(){e=T("div"),V(t.$$.fragment),n=A(),V(l.$$.fragment),s=A(),r&&r.c(),this.h()},l(a){e=S(a,"DIV",{class:!0});var f=M(e);F(t.$$.fragment,f),n=R(f),F(l.$$.fragment,f),s=R(f),r&&r.l(f),f.forEach(h),this.h()},h(){I(e,"class","clock svelte-x7f3g1")},m(a,f){P(a,e,f),G(t,e,null),_(e,n),G(l,e,null),_(e,s),r&&r.m(e,null),o=!0},p(a,f){const u={};f&8&&(u.time=a[3]),t.$set(u);const c={};f&524288&&(c.$$scope={dirty:f,ctx:a}),l.$set(c),a[2]!==B.STOPPED?r?(r.p(a,f),f&4&&N(r,1)):(r=Re(a),r.c(),N(r,1),r.m(e,null)):r&&(oe(),O(r,1,1,()=>{r=null}),se())},i(a){o||(N(t.$$.fragment,a),N(l.$$.fragment,a),N(r),o=!0)},o(a){O(t.$$.fragment,a),O(l.$$.fragment,a),O(r),o=!1},d(a){a&&h(e),j(t),j(l),r&&r.d()}}}function $t(i){let e,t,n,l;return e=new ht({props:{active:i[2]===B.STOPPED,$$slots:{default:[Pt]},$$scope:{ctx:i}}}),e.$on("start",i[4]),e.$on("stop",i[6]),n=new kt({props:{active:i[2]===B.WAITING_FOR_STOP,intervalS:i[0],timeoutS:i[1]}}),n.$on("off",i[6]),{c(){V(e.$$.fragment),t=A(),V(n.$$.fragment)},l(s){F(e.$$.fragment,s),t=R(s),F(n.$$.fragment,s)},m(s,o){G(e,s,o),P(s,t,o),G(n,s,o),l=!0},p(s,[o]){const r={};o&4&&(r.active=s[2]===B.STOPPED),o&524300&&(r.$$scope={dirty:o,ctx:s}),e.$set(r);const a={};o&4&&(a.active=s[2]===B.WAITING_FOR_STOP),o&1&&(a.intervalS=s[0]),o&2&&(a.timeoutS=s[1]),n.$set(a)},i(s){l||(N(e.$$.fragment,s),N(n.$$.fragment,s),l=!0)},o(s){O(e.$$.fragment,s),O(n.$$.fragment,s),l=!1},d(s){s&&h(t),j(e,s),j(n,s)}}}function yt(i,e,t){const n=ae();let{timersMultiplier:l}=e,{afterClockIntervaltS:s}=e,{afterClockTimeoutS:o}=e,{addingTimeTimeout:r}=e,a=B.STOPPED,f=0,u=new Date,c="";function m(){t(3,f=0)}function p($){t(3,f=$*l)}function v($){t(2,a=B.RUNNING),p($.detail.timer),c=$.detail.name,u=new Date,n("new",{timer:f})}function b(){if(typeof document<"u"&&document.visibilityState==="visible"){D();return}t(2,a=B.WAITING_FOR_STOP)}function D($=!0){console.log("stopTimer"),t(2,a=B.STOPPED),m(),$&&n("timer",{start:u,finish:new Date,timer:f,name:c})}function C(){D(!1)}function W(){a!==B.STOPPED&&D(!0)}return pe(()=>{document.addEventListener("visibilitychange",function(){a===B.WAITING_FOR_STOP&&document.visibilityState==="visible"&&(console.log("visibility change to visible"),D(!0))})}),i.$$set=$=>{"timersMultiplier"in $&&t(9,l=$.timersMultiplier),"afterClockIntervaltS"in $&&t(0,s=$.afterClockIntervaltS),"afterClockTimeoutS"in $&&t(1,o=$.afterClockTimeoutS),"addingTimeTimeout"in $&&t(10,r=$.addingTimeTimeout)},i.$$.update=()=>{i.$$.dirty&4&&wt(a),i.$$.dirty&8&&console.log("pomodoroClock",f),i.$$.dirty&8&&console.log("timerFor",f)},[s,o,a,f,v,b,D,C,W,l,r]}class He extends q{constructor(e){super(),Y(this,e,yt,$t,X,{timersMultiplier:9,afterClockIntervaltS:0,afterClockTimeoutS:1,addingTimeTimeout:10})}}function Et(i){let e,t,n=de(i[0])+"",l,s,o,r="Rest for",a,f,u=Je(i[2])+"",c,m,p;return{c(){e=T("snap"),t=T("snap"),l=H(n),s=A(),o=T("snap"),o.textContent=r,a=A(),f=T("snap"),c=H(u),m=A(),p=T("br"),this.h()},l(v){e=S(v,"SNAP",{class:!0});var b=M(e);t=S(b,"SNAP",{class:!0});var D=M(t);l=J(D,n),D.forEach(h),s=R(b),o=S(b,"SNAP",{"data-svelte-h":!0}),ee(o)!=="svelte-1sg92w5"&&(o.textContent=r),a=R(b),f=S(b,"SNAP",{class:!0});var C=M(f);c=J(C,u),C.forEach(h),m=R(b),b.forEach(h),p=S(v,"BR",{}),this.h()},h(){I(t,"class","time rest svelte-1bp1ota"),I(f,"class","duration svelte-1bp1ota"),I(e,"class","logline svelte-1bp1ota")},m(v,b){P(v,e,b),_(e,t),_(t,l),_(e,s),_(e,o),_(e,a),_(e,f),_(f,c),_(e,m),P(v,p,b)},p(v,b){b&1&&n!==(n=de(v[0])+"")&&re(l,n)},d(v){v&&(h(e),h(p))}}}function Nt(i){let e,t,n=de(i[0])+"",l,s,o,r="Active for",a,f,u=Je(i[2])+"",c,m,p;return{c(){e=T("snap"),t=T("snap"),l=H(n),s=A(),o=T("snap"),o.textContent=r,a=A(),f=T("snap"),c=H(u),m=A(),p=T("br"),this.h()},l(v){e=S(v,"SNAP",{class:!0});var b=M(e);t=S(b,"SNAP",{class:!0});var D=M(t);l=J(D,n),D.forEach(h),s=R(b),o=S(b,"SNAP",{"data-svelte-h":!0}),ee(o)!=="svelte-6wghfv"&&(o.textContent=r),a=R(b),f=S(b,"SNAP",{class:!0});var C=M(f);c=J(C,u),C.forEach(h),m=R(b),b.forEach(h),p=S(v,"BR",{}),this.h()},h(){I(t,"class","time work svelte-1bp1ota"),I(f,"class","duration svelte-1bp1ota"),I(e,"class","logline svelte-1bp1ota")},m(v,b){P(v,e,b),_(e,t),_(t,l),_(e,s),_(e,o),_(e,a),_(e,f),_(f,c),_(e,m),P(v,p,b)},p(v,b){b&1&&n!==(n=de(v[0])+"")&&re(l,n)},d(v){v&&(h(e),h(p))}}}function Dt(i){let e;function t(s,o){return s[1]=="work"?Nt:Et}let n=t(i),l=n(i);return{c(){l.c(),e=z()},l(s){l.l(s),e=z()},m(s,o){l.m(s,o),P(s,e,o)},p(s,[o]){n===(n=t(s))&&l?l.p(s,o):(l.d(1),l=n(s),l&&(l.c(),l.m(e.parentNode,e)))},i:x,o:x,d(s){s&&h(e),l.d(s)}}}function Je(i){let e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e} min ${t} sec`}function de(i){let e=i.getHours().toString().padStart(2,"0"),t=i.getMinutes().toString().padStart(2,"0");return`${e}:${t}`}function Ot(i,e,t){let{start:n}=e,{finish:l}=e,{name:s}=e,o=(l.getTime()-n.getTime())/1e3;return i.$$set=r=>{"start"in r&&t(0,n=r.start),"finish"in r&&t(3,l=r.finish),"name"in r&&t(1,s=r.name)},[n,s,o,l]}class At extends q{constructor(e){super(),Y(this,e,Ot,Dt,X,{start:0,finish:3,name:1})}}function Le(i,e,t){const n=i.slice();return n[3]=e[t],n}function Be(i){let e,t;const n=[i[3]];let l={};for(let s=0;s<n.length;s+=1)l=ve(l,n[s]);return e=new At({props:l}),{c(){V(e.$$.fragment)},l(s){F(e.$$.fragment,s)},m(s,o){G(e,s,o),t=!0},p(s,o){const r=o&1?Ze(n,[xe(s[3])]):{};e.$set(r)},i(s){t||(N(e.$$.fragment,s),t=!0)},o(s){O(e.$$.fragment,s),t=!1},d(s){j(e,s)}}}function Mt(i){let e,t,n=te(i[0]),l=[];for(let o=0;o<n.length;o+=1)l[o]=Be(Le(i,n,o));const s=o=>O(l[o],1,1,()=>{l[o]=null});return{c(){for(let o=0;o<l.length;o+=1)l[o].c();e=z()},l(o){for(let r=0;r<l.length;r+=1)l[r].l(o);e=z()},m(o,r){for(let a=0;a<l.length;a+=1)l[a]&&l[a].m(o,r);P(o,e,r),t=!0},p(o,[r]){if(r&1){n=te(o[0]);let a;for(a=0;a<n.length;a+=1){const f=Le(o,n,a);l[a]?(l[a].p(f,r),N(l[a],1)):(l[a]=Be(f),l[a].c(),N(l[a],1),l[a].m(e.parentNode,e))}for(oe(),a=n.length;a<l.length;a+=1)s(a);se()}},i(o){if(!t){for(let r=0;r<n.length;r+=1)N(l[r]);t=!0}},o(o){l=l.filter(Boolean);for(let r=0;r<l.length;r+=1)O(l[r]);t=!1},d(o){o&&h(e),qe(l,o)}}}function Rt(i){return i.forEach(e=>{if(!("id"in e&&"name"in e&&"start"in e&&"finish"in e))return!1}),!0}function Lt(i){let e=[];return i.forEach(t=>{e.push({id:t.id,name:t.name,start:Math.floor(t.start.getTime()/1e3),finish:Math.floor(t.finish.getTime()/1e3)})}),console.log("Serializing logs:",JSON.stringify(e)),JSON.stringify(e)}function Bt(i){const e=JSON.parse(i);let t=[];if(Rt(e))return e.forEach(n=>{t.push({id:n.id,name:n.name,finish:new Date(n.finish*1e3),start:new Date(n.start*1e3)})}),console.log("deserialized logs:",t),t}function Ut(i,e,t){let{timerLogs:n=[]}=e,l=!1;function s(o){n!=null&&l&&me.set("logs",Lt(o))}return pe(()=>{let o=me.get("logs");console.log("coockies for logs contain",o),l=!0,o!=null&&t(0,n=Bt(o))}),i.$$set=o=>{"timerLogs"in o&&t(0,n=o.timerLogs)},i.$$.update=()=>{i.$$.dirty&1&&s(n)},[n]}class Vt extends q{constructor(e){super(),Y(this,e,Ut,Mt,X,{timerLogs:0})}}const Ft={afterClockIntervaltS:3,afterClockTimeoutS:10,timersMultiplier:1,addingTimeTimeout:5},Gt={afterClockIntervaltS:10,afterClockTimeoutS:60*15,timersMultiplier:1*60,addingTimeTimeout:5};function jt(i){let e,t;const n=[Gt];let l={};for(let s=0;s<n.length;s+=1)l=ve(l,n[s]);return e=new He({props:l}),e.$on("timer",i[2]),{c(){V(e.$$.fragment)},l(s){F(e.$$.fragment,s)},m(s,o){G(e,s,o),t=!0},p(s,o){const r={};e.$set(r)},i(s){t||(N(e.$$.fragment,s),t=!0)},o(s){O(e.$$.fragment,s),t=!1},d(s){j(e,s)}}}function zt(i){let e,t;const n=[Ft];let l={};for(let s=0;s<n.length;s+=1)l=ve(l,n[s]);return e=new He({props:l}),e.$on("timer",i[2]),{c(){V(e.$$.fragment)},l(s){F(e.$$.fragment,s)},m(s,o){G(e,s,o),t=!0},p(s,o){const r={};e.$set(r)},i(s){t||(N(e.$$.fragment,s),t=!0)},o(s){O(e.$$.fragment,s),t=!1},d(s){j(e,s)}}}function Wt(i){let e,t,n,l="Let's Pomodoro!",s,o,r,a,f,u,c,m,p,v,b,D,C,W;const $=[zt,jt],L=[];function K(k,y){return k[0]?0:1}o=K(i),r=L[o]=$[o](i);function Q(k){i[3](k)}let w={};return i[1]!==void 0&&(w.timerLogs=i[1]),f=new Vt({props:w}),Ye.push(()=>Ke(f,"timerLogs",Q)),{c(){e=T("main"),t=T("div"),n=T("h1"),n.textContent=l,s=A(),r.c(),a=A(),V(f.$$.fragment),c=A(),m=T("div"),p=T("label"),v=H("Debug:"),b=T("input"),this.h()},l(k){e=S(k,"MAIN",{class:!0});var y=M(e);t=S(y,"DIV",{class:!0});var d=M(t);n=S(d,"H1",{class:!0,"data-svelte-h":!0}),ee(n)!=="svelte-cxq7y3"&&(n.textContent=l),s=R(d),r.l(d),a=R(d),F(f.$$.fragment,d),d.forEach(h),y.forEach(h),c=R(k),m=S(k,"DIV",{class:!0});var g=M(m);p=S(g,"LABEL",{id:!0});var E=M(p);v=J(E,"Debug:"),b=S(E,"INPUT",{type:!0}),E.forEach(h),g.forEach(h),this.h()},h(){I(n,"class","logo svelte-dj43kz"),I(t,"class","centered-div"),I(e,"class","svelte-dj43kz"),I(b,"type","checkbox"),I(p,"id","debug"),I(m,"class","debug-div svelte-dj43kz")},m(k,y){P(k,e,y),_(e,t),_(t,n),_(t,s),L[o].m(t,null),_(t,a),G(f,t,null),P(k,c,y),P(k,m,y),_(m,p),_(p,v),_(p,b),b.checked=i[0],D=!0,C||(W=U(b,"change",i[4]),C=!0)},p(k,[y]){let d=o;o=K(k),o===d?L[o].p(k,y):(oe(),O(L[d],1,1,()=>{L[d]=null}),se(),r=L[o],r?r.p(k,y):(r=L[o]=$[o](k),r.c()),N(r,1),r.m(t,a));const g={};!u&&y&2&&(u=!0,g.timerLogs=k[1],Qe(()=>u=!1)),f.$set(g),y&1&&(b.checked=k[0])},i(k){D||(N(r),N(f.$$.fragment,k),D=!0)},o(k){O(r),O(f.$$.fragment,k),D=!1},d(k){k&&(h(e),h(c),h(m)),L[o].d(),j(f),C=!1,W()}}}function Ht(i,e,t){let n=!0,l=[],s=0;function o(f){console.log(`Start time: ${f.detail.start} - finish: ${f.detail.finish}`);let u={id:++s,name:f.detail.name,start:f.detail.start,finish:f.detail.finish};t(1,l=[...l,u])}function r(f){l=f,t(1,l)}function a(){n=this.checked,t(0,n)}return[n,l,o,r,a]}class qt extends q{constructor(e){super(),Y(this,e,Ht,Wt,X,{})}}export{qt as component};
