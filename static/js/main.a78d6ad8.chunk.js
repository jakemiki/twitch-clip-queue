(this["webpackJsonptwitch-clip-queue"]=this["webpackJsonptwitch-clip-queue"]||[]).push([[0],{10:function(t,e,n){"use strict";n.d(e,"c",(function(){return d})),n.d(e,"a",(function(){return f})),n.d(e,"g",(function(){return v})),n.d(e,"f",(function(){return b})),n.d(e,"d",(function(){return h})),n.d(e,"e",(function(){return m})),n.d(e,"b",(function(){return g}));var r=n(1),a=n.n(r),i=n(3),c=n(6),u=n(14),o=n(22),s=n(29),l=n(13),d=Object(c.a)(!1),f=Object(c.a)(null),p=Object(c.a)(null),v=Object(c.a)(null),b=Object(l.a)("userChannel",null),h=function(t,e,n){f.set(t),p.set(e),v.set(n),b.get()||b.set(n),d.set(!0),Object(u.a)("user-logged-in")},m=function(){var t=Object(i.a)(a.a.mark((function t(){var e;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=f.get(),f.set(null),p.set(null),v.set(null),d.set(!1),!e){t.next=8;break}return t.next=8,o.a.revokeToken(e);case 8:Object(u.a)("user-logged-out");case 9:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),g=function(t){s.a.leaveChannel(b.get()),b.set(t),s.a.joinChannel(t),Object(u.a)("channel-changed")}},12:function(t,e,n){"use strict";n.d(e,"h",(function(){return u})),n.d(e,"g",(function(){return o})),n.d(e,"f",(function(){return s})),n.d(e,"b",(function(){return l})),n.d(e,"c",(function(){return d})),n.d(e,"j",(function(){return f})),n.d(e,"i",(function(){return p})),n.d(e,"l",(function(){return v})),n.d(e,"k",(function(){return b})),n.d(e,"e",(function(){return h})),n.d(e,"d",(function(){return m})),n.d(e,"a",(function(){return g}));var r=n(21),a=n(6),i=n(14),c=n(13),u=Object(a.a)({}),o=Object(c.a)("clipQueue",[]),s=Object(c.a)("clipMemory",[]),l=Object(a.a)(!1),d=function(t){var e,n,a,u,l=o.find((function(e){return Object(c.b)(e.get(),t)})),d=null===l||void 0===l?void 0:l.get();d?(null===(e=d.submitter)||void 0===e?void 0:e.userName)===(null===(n=t.submitter)||void 0===n?void 0:n.userName)||null!==(a=null===(u=d.submitters)||void 0===u?void 0:u.find((function(e){var n;return e.userName===(null===(n=t.submitter)||void 0===n?void 0:n.userName)})))&&void 0!==a&&a||(null===l||void 0===l||l.submitters.set((function(e){return[].concat(Object(r.a)(null!==e&&void 0!==e?e:[]),[t.submitter])})),o.set((function(t){return t.sort((function(t,e){var n,r,a,i;return(null!==(n=null===(r=e.submitters)||void 0===r?void 0:r.length)&&void 0!==n?n:0)-(null!==(a=null===(i=t.submitters)||void 0===i?void 0:i.length)&&void 0!==a?a:0)}))}))):p(t)||(s.set((function(e){return[].concat(Object(r.a)(null!==e&&void 0!==e?e:[]),[t])})),o.set((function(e){return[].concat(Object(r.a)(null!==e&&void 0!==e?e:[]),[t])})),Object(i.a)("clip-added"))},f=function(){var t,e;u.set(JSON.parse(JSON.stringify(null!==(t=null===(e=o[0])||void 0===e?void 0:e.get())&&void 0!==t?t:{}))),o[0].set(a.b),Object(i.a)("next-clip")},p=function(t){var e=s.find((function(e){return Object(c.b)(e.get(),t)}));return null===e||void 0===e?void 0:e.get()},v=function(t){var e=function(t){var e=o.find((function(e){return Object(c.b)(e.get(),t)}));return null===e||void 0===e?void 0:e.get()}(t);e&&(u.set(JSON.parse(JSON.stringify(e))),b(e))},b=function(t){var e=o.findIndex((function(e){return Object(c.b)(e.get(),t)}));o[e].set(a.b)},h=function(){o.set([]),u.set({}),Object(i.a)("clear-queue")},m=function(){var t;s.set(Object(r.a)(null!==(t=o.get())&&void 0!==t?t:[])),Object(i.a)("purge-memory")},g=function(t){l.set(t),Object(i.a)("accept-clips-".concat(t))}},13:function(t,e,n){"use strict";n.d(e,"a",(function(){return i})),n.d(e,"b",(function(){return c}));var r=n(6),a=n(49);function i(t,e){var n=Object(r.a)(e);return n.attach(Object(a.a)(t)),n}function c(t,e){return t.id===e.id&&t.provider===e.provider}},14:function(t,e,n){"use strict";n.d(e,"a",(function(){return u}));var r=n(24),a=Object(r.a)("Umami Event"),i=window.umami,c=[];function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"custom";a.debug("".concat(e,": ").concat(t));try{if(c.push({type:e,value:t}),i)for(var n;n=c.shift();)i.trackEvent(n.value,n.type)}catch(r){}}},22:function(t,e,n){"use strict";var r=n(1),a=n.n(r),i=n(3),c=n(17),u=n.n(c),o=n(10),s="ryrnsuk3r4howfd6jac8lamdan279v",l=function(){return encodeURI("https://id.twitch.tv/oauth2/authorize?client_id=".concat(s)+"&redirect_uri=".concat("https://jakemiki.github.io/twitch-clip-queue/")+'&response_type=token id_token&scope=openid chat:read&claims={"id_token":{"preferred_username":null}}')};var d={getLoginUrl:l,redirectToLogin:function(){window.location.assign(l())},processAuth:function(){if(window.location.hash){var t,e,n=window.location.hash.substring(1).split("&").reduce((function(t,e){var n=e.split("=");return t[n[0]]=decodeURIComponent(decodeURIComponent(n[1])),t}),{});if(window.location.hash="",n.access_token&&n.id_token)n.decodedIdToken=function(t){if(!t)return;var e=t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),n=decodeURIComponent(atob(e).split("").map((function(t){return"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)})).join(""));return JSON.parse(n)}(n.id_token),Object(o.d)(n.access_token,n.id_token,null!==(t=null===(e=n.decodedIdToken)||void 0===e?void 0:e.preferred_username)&&void 0!==t?t:"")}},revokeToken:function(){var t=Object(i.a)(a.a.mark((function t(e){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.post("https://id.twitch.tv/oauth2/revoke?client_id=".concat(s,"&token=").concat(e));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};e.a=d},24:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var r,a,i=n(47),c=n(48);!function(t){t[t.debug=0]="debug",t[t.info=1]="info",t[t.warn=2]="warn",t[t.error=3]="error"}(r||(r={}));var u=function(t){var e;return a=null!==(e=r[t])&&void 0!==e?e:r.info},o=function(){function t(e){Object(i.a)(this,t),this.name=e}return Object(c.a)(t,[{key:"debug",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];this.log.apply(this,[r.debug,t].concat(n))}},{key:"info",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];this.log.apply(this,[r.info,t].concat(n))}},{key:"warn",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];this.log.apply(this,[r.warn,t].concat(n))}},{key:"error",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];this.log.apply(this,[r.error,t].concat(n))}},{key:"log",value:function(t,e){var n,i,c,u;if(!(t<a)){for(var o="[".concat(this.name,"] ").concat(e),s=arguments.length,l=new Array(s>2?s-2:0),d=2;d<s;d++)l[d-2]=arguments[d];switch(t){case r.debug:(n=console).debug.apply(n,[o].concat(l));break;case r.info:(i=console).info.apply(i,[o].concat(l));break;case r.warn:(c=console).warn.apply(c,[o].concat(l));break;case r.error:(u=console).error.apply(u,[o].concat(l))}}}}]),t}();function s(t){return new o(t)}u("warn"),window.__setLogLevel=u},29:function(t,e,n){"use strict";var r,a=n(1),i=n.n(a),c=n(3),u=n(24),o=n(12),s=n(10),l=n(50),d=n(30),f=n(6),p=Object(u.a)("Twitch Chat"),v=function(t){var e=t.indexOf("http");if(e>=0){var n=t.indexOf(" ",e);return t.slice(e,n>0?n:void 0)}},b=function(){var t=Object(c.a)(i.a.mark((function t(){var e;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,null===(e=r)||void 0===e?void 0:e.disconnect();case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),h=function(){var t=Object(c.a)(i.a.mark((function t(e){return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return p.info("Joining channel",e),t.next=3,r.join(e.toLowerCase());case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),m={connect:function(){r=new l.Client({options:{debug:!1,skipUpdatingEmotesets:!0,skipMembership:!0},logger:{error:p.error.bind(p),info:p.info.bind(p),warn:p.warn.bind(p)},identity:{username:s.g.get(),password:"oauth:".concat(s.a.get())},connection:{reconnect:!0,secure:!0}}),p.info("Connecting and authenticating..."),r.connect().then((function(){p.info("Connected."),h(s.f.get())})).catch(p.error.bind(p)),r.on("disconnected",(function(t){return p.info("Disconnected:",t)})),r.on("message",(function(t,e,n,r){return r||function(t,e){if(o.b.get()){var n=v(e);n&&(p.debug("[handleMessage] Found url:",n),d.a.findByUrl(n).then((function(e){e&&(e.url=n,e.submitter={userName:t.username,displayName:t["display-name"]},Object(o.c)(e))})))}}(e,n)})),r.on("messagedeleted",(function(t,e,n){return function(t){var e=v(t);e&&(p.debug("[handleMessageDeleted] Found url:",e),d.a.findByUrl(e).then((function(t){t&&Object(o.k)(t)})))}(n)})),r.on("timeout",(function(t,e){return function(t){o.g.filter((function(e){var n,r;return(null===(n=e.submitter.get())||void 0===n?void 0:n.userName)===t||(null===(r=e.submitters.get())||void 0===r?void 0:r.some((function(e){return e.userName===t})))})).forEach((function(e){var n,r,a;(null===(n=e.submitter.get())||void 0===n?void 0:n.userName)===t?(null===(r=e.submitters.get())||void 0===r?void 0:r.length)?(e.submitter.set(null===(a=e.submitters.get())||void 0===a?void 0:a[0]),e.submitters.set((function(t){return null===t||void 0===t||t.shift(),t}))):e.set(f.b):e.submitters.set((function(e){return null===e||void 0===e?void 0:e.filter((function(e){return e.userName!==t}))}))}))}(e)}))},disconnect:b,joinChannel:h,leaveChannel:function(){var t=Object(c.a)(i.a.mark((function t(e){return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return p.info("Leaving channel",e),t.next=3,r.part(e.toLowerCase());case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};e.a=m},30:function(t,e,n){"use strict";var r=n(1),a=n.n(r),i=n(51),c=n(3),u=n(15),o=n(25),s=n(17),l=n.n(s),d=n(10),f=l.a.create({baseURL:"https://api.twitch.tv/helix/",headers:{"Client-ID":"ryrnsuk3r4howfd6jac8lamdan279v"}}),p={getClip:function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f.get("clips?id=".concat(e),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=t.sent,r=n.data,t.abrupt("return",r.data[0]);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),getVideo:function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f.get("videos?id=".concat(e),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=t.sent,r=n.data,t.abrupt("return",r.data[0]);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),getGame:function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f.get("games?id=".concat(e),{headers:{Authorization:"Bearer ".concat(d.a.get())}});case 2:return n=t.sent,r=n.data,t.abrupt("return",r.data[0]);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},v=n(13),b=Object(v.a)("gamesDictionary",{}),h=function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(n=b.get())[e]){t.next=3;break}return t.abrupt("return",n[e]);case 3:return t.next=5,p.getGame(e);case 5:if(!(r=t.sent)){t.next=9;break}return b.set((function(t){return Object(u.a)(Object(u.a)({},t),{},Object(o.a)({},e,r.name))})),t.abrupt("return",r.name);case 9:return t.abrupt("return","");case 10:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),m=n(12),g=function(t){var e=new URL(t);return"clips.twitch.tv"===e.hostname||!(!e.hostname.endsWith("twitch.tv")||!e.pathname.includes("/clip/"))},j=function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r,i,c,o;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=new URL(e),g(e)){t.next=4;break}return t.abrupt("return");case 4:if(r=n.pathname.lastIndexOf("/"),i=n.pathname.slice(r).split("?")[0].slice(1),!(c=Object(m.i)({provider:"twitch-clip",id:i}))){t.next=9;break}return t.abrupt("return",Object(u.a)({},c));case 9:return t.next=11,p.getClip(i);case 11:if(!(o=t.sent)){t.next=22;break}return t.t0=i,t.t1=o.broadcaster_name,t.next=17,h(o.game_id);case 17:return t.t2=t.sent,t.t3=o.thumbnail_url,t.t4=o.title,t.t5=o.created_at,t.abrupt("return",{id:t.t0,channel:t.t1,game:t.t2,provider:"twitch-clip",thumbnailUrl:t.t3,title:t.t4,timestamp:t.t5});case 22:t.next=26;break;case 24:t.prev=24,t.t6=t.catch(0);case 26:case"end":return t.stop()}}),t,null,[[0,24]])})));return function(e){return t.apply(this,arguments)}}(),w={canHandle:g,tryGetClip:j},O=function(t){var e=new URL(t);return!(!e.hostname.endsWith("twitch.tv")||!e.pathname.includes("/videos/"))},x=function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r,i,c,o,s;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=new URL(e),O(e)){t.next=4;break}return t.abrupt("return");case 4:if(r=n.pathname.lastIndexOf("/"),i=n.pathname.slice(r).split("?")[0].slice(1),!(c=Object(m.i)({provider:"twitch-vod",id:i}))){t.next=9;break}return t.abrupt("return",Object(u.a)({},c));case 9:return t.next=11,p.getVideo(i);case 11:if(!(o=t.sent)){t.next=14;break}return t.abrupt("return",{id:i,channel:o.user_name,provider:"twitch-vod",thumbnailUrl:o.thumbnail_url.replace("%{width}x%{height}","480x272"),title:o.title,startTime:null!==(s=n.searchParams.get("t"))&&void 0!==s?s:void 0,timestamp:o.created_at});case 14:t.next=18;break;case 16:t.prev=16,t.t0=t.catch(0);case 18:case"end":return t.stop()}}),t,null,[[0,16]])})));return function(e){return t.apply(this,arguments)}}(),k={canHandle:O,tryGetClip:x},y={getClip:function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.a.get("https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=".concat(e));case 3:return n=t.sent,r=n.data,t.abrupt("return",r);case 8:return t.prev=8,t.t0=t.catch(0),t.abrupt("return",void 0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(e){return t.apply(this,arguments)}}()},_=function(t){var e=new URL(t);return"youtu.be"===e.hostname||!!e.hostname.endsWith("youtube.com")},C=function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r,i,c,o,s,l,d,f,p,v;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,o=new URL(e),_(e)){t.next=4;break}return t.abrupt("return");case 4:if(s=void 0,"youtu.be"===o.hostname?(l=o.pathname.lastIndexOf("/")+1,s=o.pathname.slice(l).split("?")[0]):o.hostname.endsWith("youtube.com")&&(s=null!==(d=o.searchParams.get("v"))&&void 0!==d?d:void 0),s){t.next=8;break}return t.abrupt("return");case 8:if(f=null!==(n=o.searchParams.get("t"))&&void 0!==n?n:void 0,!(p=Object(m.i)({provider:"youtube",id:s}))){t.next=12;break}return t.abrupt("return",Object(u.a)({},p));case 12:return t.next=14,y.getClip(s);case 14:return v=t.sent,t.abrupt("return",{id:s,channel:null!==(r=null===v||void 0===v?void 0:v.author_name)&&void 0!==r?r:"YouTube",thumbnailUrl:null!==(i=null===v||void 0===v?void 0:v.thumbnail_url)&&void 0!==i?i:"https://i.ytimg.com/vi/".concat(s,"/hqdefault.jpg"),provider:"youtube",title:null!==(c=null===v||void 0===v?void 0:v.title)&&void 0!==c?c:s,startTime:f});case 18:t.prev=18,t.t0=t.catch(0);case 20:case"end":return t.stop()}}),t,null,[[0,18]])})));return function(e){return t.apply(this,arguments)}}(),U=[w,k,{canHandle:_,tryGetClip:C}],L={findByUrl:function(){var t=Object(c.a)(a.a.mark((function t(e){var n,r,c,u;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=Object(i.a)(U),t.prev=1,n.s();case 3:if((r=n.n()).done){t.next=14;break}if((c=r.value).canHandle(e)){t.next=7;break}return t.abrupt("continue",12);case 7:return t.next=9,c.tryGetClip(e);case 9:if(!(u=t.sent)){t.next=12;break}return t.abrupt("return",u);case 12:t.next=3;break;case 14:t.next=19;break;case 16:t.prev=16,t.t0=t.catch(1),n.e(t.t0);case 19:return t.prev=19,n.f(),t.finish(19);case 22:return t.abrupt("return",void 0);case 23:case"end":return t.stop()}}),t,null,[[1,16,19,22]])})));return function(e){return t.apply(this,arguments)}}()};e.a=L},45:function(t,e){},58:function(t,e,n){},85:function(t,e){},98:function(t,e,n){"use strict";n.r(e);var r=n(0),a=n.n(r),i=n(33),c=n.n(i),u=(n(58),n(2));var o=function(t){var e=t.href;return Object(u.jsx)("a",{href:e,target:"_blank",rel:"noreferrer",children:Object(u.jsx)("img",{loading:"lazy",width:"128",height:"128",src:"https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149",className:"absolute top-0 right-0 fork-on-github",alt:"Fork me on GitHub"})})},s=n(6),l=n(52),d=n(4),f=n(10),p=a.a.lazy((function(){return n.e(4).then(n.bind(null,134))})),v=a.a.lazy((function(){return Promise.all([n.e(3),n.e(5)]).then(n.bind(null,133))}));var b=function(){var t=Object(s.c)(f.c).get();return Object(u.jsx)(r.Suspense,{fallback:Object(u.jsx)("div",{}),children:Object(u.jsx)(l.a,{basename:"/twitch-clip-queue/",children:Object(u.jsxs)(d.d,{children:[Object(u.jsx)(d.b,{path:"/queue",children:t?Object(u.jsx)(v,{}):Object(u.jsx)(d.a,{to:"/"})}),Object(u.jsx)(d.b,{exact:!0,path:"/",children:t?Object(u.jsx)(d.a,{to:"/queue"}):Object(u.jsx)(p,{})}),Object(u.jsx)(d.b,{path:"*",children:Object(u.jsx)(d.a,{to:"/"})})]})})})};var h=function(){return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)(o,{href:"https://github.com/JakeMiki/twitch-clip-queue"}),Object(u.jsx)(b,{})]})},m=function(t){t&&t instanceof Function&&n.e(6).then(n.bind(null,131)).then((function(e){var n=e.getCLS,r=e.getFID,a=e.getFCP,i=e.getLCP,c=e.getTTFB;n(t),r(t),a(t),i(t),c(t)}))},g=n(22);c.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)(h,{})}),document.getElementById("root")),m(),g.a.processAuth()}},[[98,1,2]]]);
//# sourceMappingURL=main.a78d6ad8.chunk.js.map