(this["webpackJsonptwitch-clip-queue"]=this["webpackJsonptwitch-clip-queue"]||[]).push([[0],{100:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(48),i=n.n(c),u=(n(60),n(1)),o=n.n(u),s=n(3),l=n(6),d=n(54),f=n(4),p=n(26),b=n(17),v=n(8),h=n(2),m=a.a.lazy((function(){return n.e(4).then(n.bind(null,109))})),g=a.a.lazy((function(){return Promise.all([n.e(3),n.e(5)]).then(n.bind(null,108))}));var j=function(){var e=Object(l.c)(v.c);return Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)("header",{className:"flex",children:[Object(h.jsx)("h1",{className:"mb-4",children:"Twitch Clip Queue"}),Object(h.jsx)("div",{className:"flex-grow"}),Object(h.jsx)("div",{children:e.get()?Object(h.jsx)(p.b,{onClick:Object(s.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(v.e)();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)}))),children:"Logout"}):Object(h.jsx)(p.b,{onClick:function(){return b.a.redirectToLogin()},children:"Login with Twitch"})})]}),Object(h.jsx)(r.Suspense,{fallback:Object(h.jsx)("div",{}),children:Object(h.jsx)(d.a,{basename:"/twitch-clip-queue/",children:Object(h.jsxs)(f.d,{children:[Object(h.jsx)(f.b,{exact:!0,path:"/",children:e.get()?Object(h.jsx)(g,{}):Object(h.jsx)(m,{})}),Object(h.jsx)(f.b,{path:"*",children:Object(h.jsx)(f.a,{to:"/"})})]})})}),Object(h.jsx)("div",{className:"flex-grow"}),Object(h.jsxs)("footer",{className:"text-xs mt-4",children:["Created by"," ",Object(h.jsx)("span",{className:"font-bold",children:Object(h.jsx)("a",{href:"https://github.com/JakeMiki",target:"_blank",rel:"noreferrer",children:"JakeMiki"})})]})]})},w=function(e){e&&e instanceof Function&&n.e(6).then(n.bind(null,106)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),r(e),a(e),c(e),i(e)}))};i.a.render(Object(h.jsx)(a.a.StrictMode,{children:Object(h.jsx)(j,{})}),document.getElementById("root")),w(),b.a.processAuth()},13:function(e,t,n){"use strict";n.d(t,"h",(function(){return u})),n.d(t,"g",(function(){return o})),n.d(t,"f",(function(){return s})),n.d(t,"b",(function(){return l})),n.d(t,"c",(function(){return d})),n.d(t,"j",(function(){return f})),n.d(t,"i",(function(){return p})),n.d(t,"l",(function(){return b})),n.d(t,"k",(function(){return v})),n.d(t,"e",(function(){return h})),n.d(t,"d",(function(){return m})),n.d(t,"a",(function(){return g}));var r=n(22),a=n(6),c=n(15),i=n(14),u=Object(a.a)({}),o=Object(i.a)("clipQueue",[]),s=Object(i.a)("clipMemory",[]),l=Object(a.a)(!1),d=function(e){var t,n,a,u,l=o.find((function(t){return Object(i.b)(t.get(),e)})),d=null===l||void 0===l?void 0:l.get();d?(null===(t=d.submitter)||void 0===t?void 0:t.userName)===(null===(n=e.submitter)||void 0===n?void 0:n.userName)||null!==(a=null===(u=d.submitters)||void 0===u?void 0:u.find((function(t){var n;return t.userName===(null===(n=e.submitter)||void 0===n?void 0:n.userName)})))&&void 0!==a&&a||(null===l||void 0===l||l.submitters.set((function(t){return[].concat(Object(r.a)(null!==t&&void 0!==t?t:[]),[e.submitter])})),o.set((function(e){return e.sort((function(e,t){var n,r,a,c;return(null!==(n=null===(r=t.submitters)||void 0===r?void 0:r.length)&&void 0!==n?n:0)-(null!==(a=null===(c=e.submitters)||void 0===c?void 0:c.length)&&void 0!==a?a:0)}))}))):p(e)||(s.set((function(t){return[].concat(Object(r.a)(null!==t&&void 0!==t?t:[]),[e])})),o.set((function(t){return[].concat(Object(r.a)(null!==t&&void 0!==t?t:[]),[e])})),Object(c.a)("clip-added"))},f=function(){var e,t;u.set(JSON.parse(JSON.stringify(null!==(e=null===(t=o[0])||void 0===t?void 0:t.get())&&void 0!==e?e:{}))),o[0].set(a.b),Object(c.a)("next-clip")},p=function(e){var t=s.find((function(t){return Object(i.b)(t.get(),e)}));return null===t||void 0===t?void 0:t.get()},b=function(e){var t=function(e){var t=o.find((function(t){return Object(i.b)(t.get(),e)}));return null===t||void 0===t?void 0:t.get()}(e);t&&(u.set(JSON.parse(JSON.stringify(t))),v(t))},v=function(e){var t=o.findIndex((function(t){return Object(i.b)(t.get(),e)}));o[t].set(a.b)},h=function(){o.set([]),u.set({}),Object(c.a)("clear-queue")},m=function(){var e;s.set(Object(r.a)(null!==(e=o.get())&&void 0!==e?e:[])),Object(c.a)("purge-memory")},g=function(e){l.set(e),Object(c.a)("accept-clips-".concat(e))}},14:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return i}));var r=n(6),a=n(51);function c(e,t){var n=Object(r.a)(t);return n.attach(Object(a.a)(e)),n}function i(e,t){return e.id===t.id&&e.provider===t.provider}},15:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(25),a=Object(r.a)("Umami Event"),c=window.umami,i=[];function u(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"custom";a.debug("".concat(t,": ").concat(e));try{if(i.push({type:t,value:e}),c)for(var n;n=i.shift();)c.trackEvent(n.value,n.type)}catch(r){}}},17:function(e,t,n){"use strict";var r=n(1),a=n.n(r),c=n(3),i=n(18),u=n.n(i),o=n(8),s="ryrnsuk3r4howfd6jac8lamdan279v",l=function(){return encodeURI("https://id.twitch.tv/oauth2/authorize?client_id=".concat(s)+"&redirect_uri=".concat("https://jakemiki.github.io/twitch-clip-queue/")+'&response_type=token id_token&scope=openid chat:read&claims={"id_token":{"preferred_username":null}}')};var d={getLoginUrl:l,redirectToLogin:function(){window.location.assign(l())},processAuth:function(){if(window.location.hash){var e,t,n=window.location.hash.substring(1).split("&").reduce((function(e,t){var n=t.split("=");return e[n[0]]=decodeURIComponent(decodeURIComponent(n[1])),e}),{});if(window.location.hash="",n.access_token&&n.id_token)n.decodedIdToken=function(e){if(!e)return;var t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),n=decodeURIComponent(atob(t).split("").map((function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""));return JSON.parse(n)}(n.id_token),Object(o.d)(n.access_token,n.id_token,null!==(e=null===(t=n.decodedIdToken)||void 0===t?void 0:t.preferred_username)&&void 0!==e?e:"")}},revokeToken:function(){var e=Object(c.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.post("https://id.twitch.tv/oauth2/revoke?client_id=".concat(s,"&token=").concat(t));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};t.a=d},25:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var r,a,c=n(49),i=n(50);!function(e){e[e.debug=0]="debug",e[e.info=1]="info",e[e.warn=2]="warn",e[e.error=3]="error"}(r||(r={}));var u=function(e){var t;return a=null!==(t=r[e])&&void 0!==t?t:r.info},o=function(){function e(t){Object(c.a)(this,e),this.name=t}return Object(i.a)(e,[{key:"debug",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];this.log.apply(this,[r.debug,e].concat(n))}},{key:"info",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];this.log.apply(this,[r.info,e].concat(n))}},{key:"warn",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];this.log.apply(this,[r.warn,e].concat(n))}},{key:"error",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];this.log.apply(this,[r.error,e].concat(n))}},{key:"log",value:function(e,t){var n,c,i,u;if(!(e<a)){for(var o="[".concat(this.name,"] ").concat(t),s=arguments.length,l=new Array(s>2?s-2:0),d=2;d<s;d++)l[d-2]=arguments[d];switch(e){case r.debug:(n=console).debug.apply(n,[o].concat(l));break;case r.info:(c=console).info.apply(c,[o].concat(l));break;case r.warn:(i=console).warn.apply(i,[o].concat(l));break;case r.error:(u=console).error.apply(u,[o].concat(l))}}}}]),e}();function s(e){return new o(e)}u("warn"),window.__setLogLevel=u},26:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(11),a=n(34),c=(n(0),n(2)),i=["className","colour","children","onClick"],u=function(e,t){switch(t=(t||"")+" ",e){case"red":return t+"bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500";case"green":return t+"bg-green-500 border-green-700 hover:bg-green-400 hover:border-green-500";case"yellow":return t+"bg-yellow-500 border-yellow-700 hover:bg-yellow-400 hover:border-yellow-500"}return t+"bg-purple-500 border-purple-700 hover:bg-purple-400 hover:border-purple-500"};t.b=function(e){var t=e.className,n=e.colour,o=e.children,s=e.onClick,l=Object(a.a)(e,i),d=u(n,t);return Object(c.jsx)("button",Object(r.a)(Object(r.a)({},l),{},{className:d,onClick:s,children:o}))}},30:function(e,t,n){"use strict";var r,a=n(1),c=n.n(a),i=n(3),u=n(25),o=n(13),s=n(8),l=n(52),d=n(31),f=n(6),p=Object(u.a)("Twitch Chat"),b=function(e){var t=e.indexOf("http");if(t>=0){var n=e.indexOf(" ",t);return e.slice(t,n>0?n:void 0)}},v=function(){var e=Object(i.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,null===(t=r)||void 0===t?void 0:t.disconnect();case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),h=function(){var e=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return p.info("Joining channel",t),e.next=3,r.join(t.toLowerCase());case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),m={connect:function(){r=new l.Client({options:{debug:!1,skipUpdatingEmotesets:!0,skipMembership:!0},logger:{error:p.error.bind(p),info:p.info.bind(p),warn:p.warn.bind(p)},identity:{username:s.g.get(),password:"oauth:".concat(s.a.get())},connection:{reconnect:!0,secure:!0}}),p.info("Connecting and authenticating..."),r.connect().then((function(){p.info("Connected."),h(s.f.get())})).catch(p.error.bind(p)),r.on("disconnected",(function(e){return p.info("Disconnected:",e)})),r.on("message",(function(e,t,n,r){return r||function(e,t){if(o.b.get()){var n=b(t);n&&(p.debug("[handleMessage] Found url:",n),d.a.findByUrl(n).then((function(t){t&&(t.url=n,t.submitter={userName:e.username,displayName:e["display-name"]},Object(o.c)(t))})))}}(t,n)})),r.on("messagedeleted",(function(e,t,n){return function(e){var t=b(e);t&&(p.debug("[handleMessageDeleted] Found url:",t),d.a.findByUrl(t).then((function(e){e&&Object(o.k)(e)})))}(n)})),r.on("timeout",(function(e,t){return function(e){o.g.filter((function(t){var n,r;return(null===(n=t.submitter.get())||void 0===n?void 0:n.userName)===e||(null===(r=t.submitters.get())||void 0===r?void 0:r.some((function(t){return t.userName===e})))})).forEach((function(t){var n,r,a;(null===(n=t.submitter.get())||void 0===n?void 0:n.userName)===e?(null===(r=t.submitters.get())||void 0===r?void 0:r.length)?(t.submitter.set(null===(a=t.submitters.get())||void 0===a?void 0:a[0]),t.submitters.set((function(e){return null===e||void 0===e||e.shift(),e}))):t.set(f.b):t.submitters.set((function(t){return null===t||void 0===t?void 0:t.filter((function(t){return t.userName!==e}))}))}))}(t)}))},disconnect:v,joinChannel:h,leaveChannel:function(){var e=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return p.info("Leaving channel",t),e.next=3,r.part(t.toLowerCase());case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};t.a=m},31:function(e,t,n){"use strict";var r=n(1),a=n.n(r),c=n(53),i=n(3),u=n(11),o=n(24),s=n(18),l=n.n(s),d=n(8),f=l.a.create({baseURL:"https://api.twitch.tv/helix/",headers:{"Client-ID":"ryrnsuk3r4howfd6jac8lamdan279v"}}),p={getClip:function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.get("clips?id=".concat(t),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=e.sent,r=n.data,e.abrupt("return",r.data[0]);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getVideo:function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.get("videos?id=".concat(t),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=e.sent,r=n.data,e.abrupt("return",r.data[0]);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getGame:function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.get("games?id=".concat(t),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=e.sent,r=n.data,e.abrupt("return",r.data[0]);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},b=n(14),v=Object(b.a)("gamesDictionary",{}),h=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=v.get())[t]){e.next=3;break}return e.abrupt("return",n[t]);case 3:return e.next=5,p.getGame(t);case 5:if(!(r=e.sent)){e.next=9;break}return v.set((function(e){return Object(u.a)(Object(u.a)({},e),{},Object(o.a)({},t,r.name))})),e.abrupt("return",r.name);case 9:return e.abrupt("return","");case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),m=n(13),g=function(e){var t=new URL(e);return"clips.twitch.tv"===t.hostname||!(!t.hostname.endsWith("twitch.tv")||!t.pathname.includes("/clip/"))},j=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,c,i,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,n=new URL(t),g(t)){e.next=4;break}return e.abrupt("return");case 4:if(r=n.pathname.lastIndexOf("/"),c=n.pathname.slice(r).split("?")[0].slice(1),!(i=Object(m.i)({provider:"twitch-clip",id:c}))){e.next=9;break}return e.abrupt("return",Object(u.a)({},i));case 9:return e.next=11,p.getClip(c);case 11:if(!(o=e.sent)){e.next=22;break}return e.t0=c,e.t1=o.broadcaster_name,e.next=17,h(o.game_id);case 17:return e.t2=e.sent,e.t3=o.thumbnail_url,e.t4=o.title,e.t5=o.created_at,e.abrupt("return",{id:e.t0,channel:e.t1,game:e.t2,provider:"twitch-clip",thumbnailUrl:e.t3,title:e.t4,timestamp:e.t5});case 22:e.next=26;break;case 24:e.prev=24,e.t6=e.catch(0);case 26:case"end":return e.stop()}}),e,null,[[0,24]])})));return function(t){return e.apply(this,arguments)}}(),w={canHandle:g,tryGetClip:j},O=function(e){var t=new URL(e);return!(!t.hostname.endsWith("twitch.tv")||!t.pathname.includes("/videos/"))},x=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,c,i,o,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,n=new URL(t),O(t)){e.next=4;break}return e.abrupt("return");case 4:if(r=n.pathname.lastIndexOf("/"),c=n.pathname.slice(r).split("?")[0].slice(1),!(i=Object(m.i)({provider:"twitch-vod",id:c}))){e.next=9;break}return e.abrupt("return",Object(u.a)({},i));case 9:return e.next=11,p.getVideo(c);case 11:if(!(o=e.sent)){e.next=14;break}return e.abrupt("return",{id:c,channel:o.user_name,provider:"twitch-vod",thumbnailUrl:o.thumbnail_url.replace("%{width}x%{height}","480x272"),title:o.title,startTime:null!==(s=n.searchParams.get("t"))&&void 0!==s?s:void 0,timestamp:o.created_at});case 14:e.next=18;break;case 16:e.prev=16,e.t0=e.catch(0);case 18:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(t){return e.apply(this,arguments)}}(),k={canHandle:O,tryGetClip:x},y={getClip:function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,l.a.get("https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=".concat(t));case 3:return n=e.sent,r=n.data,e.abrupt("return",r);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",void 0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}()},C=function(e){var t=new URL(e);return"youtu.be"===t.hostname||!!t.hostname.endsWith("youtube.com")},_=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,c,i,o,s,l,d,f,p,b;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,o=new URL(t),C(t)){e.next=4;break}return e.abrupt("return");case 4:if(s=void 0,"youtu.be"===o.hostname?(l=o.pathname.lastIndexOf("/")+1,s=o.pathname.slice(l).split("?")[0]):o.hostname.endsWith("youtube.com")&&(s=null!==(d=o.searchParams.get("v"))&&void 0!==d?d:void 0),s){e.next=8;break}return e.abrupt("return");case 8:if(f=null!==(n=o.searchParams.get("t"))&&void 0!==n?n:void 0,!(p=Object(m.i)({provider:"youtube",id:s}))){e.next=12;break}return e.abrupt("return",Object(u.a)({},p));case 12:return e.next=14,y.getClip(s);case 14:return b=e.sent,e.abrupt("return",{id:s,channel:null!==(r=null===b||void 0===b?void 0:b.author_name)&&void 0!==r?r:"YouTube",thumbnailUrl:null!==(c=null===b||void 0===b?void 0:b.thumbnail_url)&&void 0!==c?c:"https://i.ytimg.com/vi/".concat(s,"/hqdefault.jpg"),provider:"youtube",title:null!==(i=null===b||void 0===b?void 0:b.title)&&void 0!==i?i:s,startTime:f});case 18:e.prev=18,e.t0=e.catch(0);case 20:case"end":return e.stop()}}),e,null,[[0,18]])})));return function(t){return e.apply(this,arguments)}}(),N=[w,k,{canHandle:C,tryGetClip:_}],U={findByUrl:function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,i,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=Object(c.a)(N),e.prev=1,n.s();case 3:if((r=n.n()).done){e.next=14;break}if((i=r.value).canHandle(t)){e.next=7;break}return e.abrupt("continue",12);case 7:return e.next=9,i.tryGetClip(t);case 9:if(!(u=e.sent)){e.next=12;break}return e.abrupt("return",u);case 12:e.next=3;break;case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),n.e(e.t0);case 19:return e.prev=19,n.f(),e.finish(19);case 22:return e.abrupt("return",void 0);case 23:case"end":return e.stop()}}),e,null,[[1,16,19,22]])})));return function(t){return e.apply(this,arguments)}}()};t.a=U},46:function(e,t){},60:function(e,t,n){},8:function(e,t,n){"use strict";n.d(t,"c",(function(){return d})),n.d(t,"a",(function(){return f})),n.d(t,"g",(function(){return b})),n.d(t,"f",(function(){return v})),n.d(t,"d",(function(){return h})),n.d(t,"e",(function(){return m})),n.d(t,"b",(function(){return g}));var r=n(1),a=n.n(r),c=n(3),i=n(6),u=n(15),o=n(17),s=n(30),l=n(14),d=Object(i.a)(!1),f=Object(i.a)(null),p=Object(i.a)(null),b=Object(i.a)(null),v=Object(l.a)("userChannel",null),h=function(e,t,n){f.set(e),p.set(t),b.set(n),v.get()||v.set(n),d.set(!0),Object(u.a)("user-logged-in")},m=function(){var e=Object(c.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=f.get(),f.set(null),p.set(null),b.set(null),d.set(!1),!t){e.next=8;break}return e.next=8,o.a.revokeToken(t);case 8:Object(u.a)("user-logged-out");case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),g=function(e){s.a.leaveChannel(v.get()),v.set(e),s.a.joinChannel(e),Object(u.a)("channel-changed")}},87:function(e,t){}},[[100,1,2]]]);
//# sourceMappingURL=main.a9f490a5.chunk.js.map