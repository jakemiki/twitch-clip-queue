(this["webpackJsonptwitch-clip-queue"]=this["webpackJsonptwitch-clip-queue"]||[]).push([[0],{10:function(e,t,n){"use strict";n.d(t,"c",(function(){return s})),n.d(t,"a",(function(){return l})),n.d(t,"g",(function(){return f})),n.d(t,"f",(function(){return b})),n.d(t,"d",(function(){return h})),n.d(t,"e",(function(){return p})),n.d(t,"b",(function(){return v}));var r=n(2),c=n.n(r),a=n(5),i=n(14),u=n(16),o=n(26),s=Object(i.a)(!1),l=Object(i.a)(null),d=Object(i.a)(null),f=Object(i.a)(null),b=Object(i.a)(null),h=function(e,t,n){l.set(e),d.set(t),f.set(n),b.set(n),s.set(!0)},p=function(){var e=Object(a.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=l.get(),l.set(null),d.set(null),f.set(null),b.set(null),s.set(!1),!t){e.next=9;break}return e.next=9,u.a.revokeToken(t);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),v=function(e){o.a.leaveChannel(b.get()),b.set(e),o.a.joinChannel(e)}},12:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return i}));var r=n(14),c=n(45);function a(e,t){return Object(r.a)(t,[Object(c.a)(e)])}function i(e,t){return e.id===t.id&&e.provider===t.provider}},13:function(e,t,n){"use strict";n.d(t,"h",(function(){return u})),n.d(t,"g",(function(){return o})),n.d(t,"f",(function(){return s})),n.d(t,"b",(function(){return l})),n.d(t,"c",(function(){return d})),n.d(t,"j",(function(){return f})),n.d(t,"i",(function(){return b})),n.d(t,"l",(function(){return p})),n.d(t,"k",(function(){return v})),n.d(t,"e",(function(){return j})),n.d(t,"d",(function(){return m})),n.d(t,"a",(function(){return g}));var r=n(19),c=n(7),a=n(14),i=n(12),u=Object(i.a)("currentClip",{}),o=Object(i.a)("clipQueue",[]),s=Object(i.a)("clipMemory",[]),l=Object(a.a)(!1),d=function(e){var t,n,a=h(e);if(a){if(!(a.submitter===e.submitter||null!==(t=null===(n=a.submitters)||void 0===n?void 0:n.includes(e.submitter))&&void 0!==t&&t)){var u,l=Object(c.a)(Object(c.a)({},a),{},{submitters:[].concat(Object(r.a)(null!==(u=null===a||void 0===a?void 0:a.submitters)&&void 0!==u?u:[]),[e.submitter])});o.set((function(e){return e.map((function(e){return Object(i.b)(e,l)?l:e})).sort((function(e,t){var n,r,c,a;return(null!==(n=null===(r=t.submitters)||void 0===r?void 0:r.length)&&void 0!==n?n:0)-(null!==(c=null===(a=e.submitters)||void 0===a?void 0:a.length)&&void 0!==c?c:0)}))}))}}else b(e)||(s.set((function(t){return[].concat(Object(r.a)(null!==t&&void 0!==t?t:[]),[e])})),o.set((function(t){return[].concat(Object(r.a)(null!==t&&void 0!==t?t:[]),[e])})))},f=function(){o.set((function(e){var t=(null!==e&&void 0!==e?e:[]).shift();return u.set(null!==t&&void 0!==t?t:{}),Object(r.a)(e)}))},b=function(e){var t,n=s.get();return null!==(t=null===n||void 0===n?void 0:n.find((function(t){return Object(i.b)(t,e)})))&&void 0!==t?t:void 0},h=function(e){var t,n=o.get();return null!==(t=null===n||void 0===n?void 0:n.find((function(t){return Object(i.b)(t,e)})))&&void 0!==t?t:void 0},p=function(e){var t=h(e);t&&(u.set(t),v(t))},v=function(e){o.set((function(t){return t.filter((function(t){return!Object(i.b)(t,e)}))}))},j=function(){o.set([]),u.set({})},m=function(){var e;s.set(Object(r.a)(null!==(e=o.get())&&void 0!==e?e:[]))},g=function(e){l.set(e)}},16:function(e,t,n){"use strict";var r=n(2),c=n.n(r),a=n(5),i=n(17),u=n.n(i),o=n(10),s="ryrnsuk3r4howfd6jac8lamdan279v",l=function(){return encodeURI("https://id.twitch.tv/oauth2/authorize?client_id=".concat(s)+"&redirect_uri=".concat("https://jakemiki.github.io/twitch-clip-queue/")+'&response_type=token id_token&scope=openid chat:read&claims={"id_token":{"preferred_username":null}}')};var d={getLoginUrl:l,redirectToLogin:function(){window.location.assign(l())},processAuth:function(){if(window.location.hash){var e,t,n=window.location.hash.substring(1).split("&").reduce((function(e,t){var n=t.split("=");return e[n[0]]=decodeURIComponent(decodeURIComponent(n[1])),e}),{});if(window.location.hash="",n.access_token&&n.id_token)n.decodedIdToken=function(e){if(!e)return;var t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),n=decodeURIComponent(atob(t).split("").map((function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""));return JSON.parse(n)}(n.id_token),Object(o.d)(n.access_token,n.id_token,null!==(e=null===(t=n.decodedIdToken)||void 0===t?void 0:t.preferred_username)&&void 0!==e?e:"")}},revokeToken:function(){var e=Object(a.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.post("https://id.twitch.tv/oauth2/revoke?client_id=".concat(s,"&token=").concat(t));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};t.a=d},25:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(7),c=n(29),a=(n(0),n(1)),i=["className","colour","children","onClick"],u=function(e,t){switch(t=(t||"")+" ",e){case"red":return t+"bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500";case"green":return t+"bg-green-500 border-green-700 hover:bg-green-400 hover:border-green-500";case"yellow":return t+"bg-yellow-500 border-yellow-700 hover:bg-yellow-400 hover:border-yellow-500"}return t+"bg-purple-500 border-purple-700 hover:bg-purple-400 hover:border-purple-500"};t.b=function(e){var t=e.className,n=e.colour,o=e.children,s=e.onClick,l=Object(c.a)(e,i),d=u(n,t);return Object(a.jsx)("button",Object(r.a)(Object(r.a)({},l),{},{className:d,onClick:s,children:o}))}},26:function(e,t,n){"use strict";var r=n(13),c=n(10),a=n(2),i=n.n(a),u=n(42),o=n(5),s=n(7),l=n(22),d=n(17),f=n.n(d),b=f.a.create({baseURL:"https://api.twitch.tv/helix/",headers:{"Client-ID":"ryrnsuk3r4howfd6jac8lamdan279v"}}),h={getClip:function(){var e=Object(o.a)(i.a.mark((function e(t){var n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.get("clips?id=".concat(t),{headers:{Authorization:"Bearer ".concat(c.a.get())}});case 2:return n=e.sent,r=n.data,e.abrupt("return",r.data[0]);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getGame:function(){var e=Object(o.a)(i.a.mark((function e(t){var n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.get("games?id=".concat(t),{headers:{Authorization:"Bearer ".concat(c.a.get())}});case 2:return n=e.sent,r=n.data,e.abrupt("return",r.data[0]);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},p=n(12),v=Object(p.a)("gamesDictionary",{}),j=function(){var e=Object(o.a)(i.a.mark((function e(t){var n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=v.get())[t]){e.next=3;break}return e.abrupt("return",n[t]);case 3:return e.next=5,h.getGame(t);case 5:if(!(r=e.sent)){e.next=9;break}return v.set((function(e){return Object(s.a)(Object(s.a)({},e),{},Object(l.a)({},t,r.name))})),e.abrupt("return",r.name);case 9:return e.abrupt("return","");case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),m=function(e){var t=new URL(e);return"clips.twitch.tv"===t.hostname||!(!t.hostname.endsWith("twitch.tv")||!t.pathname.includes("/clip/"))},g=function(){var e=Object(o.a)(i.a.mark((function e(t){var n,c,a,u,o;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,n=new URL(t),m(t)){e.next=4;break}return e.abrupt("return");case 4:if(c=n.pathname.lastIndexOf("/"),a=n.pathname.slice(c).split("?")[0].slice(1),!(u=Object(r.i)({provider:"twitch-clip",id:a}))){e.next=9;break}return e.abrupt("return",Object(s.a)({},u));case 9:return e.next=11,h.getClip(a);case 11:if(!(o=e.sent)){e.next=21;break}return e.t0=a,e.t1=o.broadcaster_name,e.next=17,j(o.game_id);case 17:return e.t2=e.sent,e.t3=o.thumbnail_url,e.t4=o.title,e.abrupt("return",{id:e.t0,channel:e.t1,game:e.t2,provider:"twitch-clip",thumbnailUrl:e.t3,title:e.t4});case 21:e.next=25;break;case 23:e.prev=23,e.t5=e.catch(0);case 25:case"end":return e.stop()}}),e,null,[[0,23]])})));return function(t){return e.apply(this,arguments)}}(),O={canHandle:m,tryGetClip:g},w={getClip:function(){var e=Object(o.a)(i.a.mark((function e(t){var n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,f.a.get("https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=".concat(t));case 3:return n=e.sent,r=n.data,e.abrupt("return",r);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",void 0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}()},x=function(e){var t=new URL(e);return"youtu.be"===t.hostname||!!t.hostname.endsWith("youtube.com")},k=function(){var e=Object(o.a)(i.a.mark((function e(t){var n,c,a,u,o,l,d,f,b,h,p;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,o=new URL(t),x(t)){e.next=4;break}return e.abrupt("return");case 4:if(l=void 0,"youtu.be"===o.hostname?(d=o.pathname.lastIndexOf("/")+1,l=o.pathname.slice(d).split("?")[0]):o.hostname.endsWith("youtube.com")&&(l=null!==(f=o.searchParams.get("v"))&&void 0!==f?f:void 0),l){e.next=8;break}return e.abrupt("return");case 8:if(b=null!==(n=o.searchParams.get("t"))&&void 0!==n?n:void 0,!(h=Object(r.i)({provider:"youtube",id:l}))){e.next=12;break}return e.abrupt("return",Object(s.a)({},h));case 12:return e.next=14,w.getClip(l);case 14:return p=e.sent,e.abrupt("return",{id:l,channel:null!==(c=null===p||void 0===p?void 0:p.author_name)&&void 0!==c?c:"YouTube",thumbnailUrl:null!==(a=null===p||void 0===p?void 0:p.thumbnail_url)&&void 0!==a?a:"https://i.ytimg.com/vi/".concat(l,"/hqdefault.jpg"),provider:"youtube",title:null!==(u=null===p||void 0===p?void 0:p.title)&&void 0!==u?u:l,startTime:b});case 18:e.prev=18,e.t0=e.catch(0);case 20:case"end":return e.stop()}}),e,null,[[0,18]])})));return function(t){return e.apply(this,arguments)}}(),y=[O,{canHandle:x,tryGetClip:k}],C=function(){var e=Object(o.a)(i.a.mark((function e(t){var n,r,c,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=Object(u.a)(y),e.prev=1,n.s();case 3:if((r=n.n()).done){e.next=14;break}if((c=r.value).canHandle(t)){e.next=7;break}return e.abrupt("continue",12);case 7:return e.next=9,c.tryGetClip(t);case 9:if(!(a=e.sent)){e.next=12;break}return e.abrupt("return",a);case 12:e.next=3;break;case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),n.e(e.t0);case 19:return e.prev=19,n.f(),e.finish(19);case 22:return e.abrupt("return",void 0);case 23:case"end":return e.stop()}}),e,null,[[1,16,19,22]])})));return function(t){return e.apply(this,arguments)}}();window.clip=function(){var e=Object(o.a)(i.a.mark((function e(t,n){var c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C(n);case 2:(c=e.sent)&&(console.log("adding clip",c),c.submitter=t,Object(r.c)(c));case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();var _,T={findByUrl:C},I=function(e){_.send(e)},U=function(e){console.log("[TwitchChat] Joining channel",e),I("JOIN #".concat(e))},L={connect:function(){(_=new WebSocket("wss://irc-ws.chat.twitch.tv:443","irc")).onopen=function(){null!==_&&1===_.readyState&&(console.log("[TwitchChat] Connecting and authenticating..."),I("CAP REQ :twitch.tv/tags"),I("PASS oauth:".concat(c.a.get())),I("NICK ".concat(c.g.get())),U(c.f.get()))},_.onclose=function(){console.log("[TwitchChat] Disconnected")},_.onerror=function(e){console.warn("[TwitchChat] Error:",e)},_.onmessage=function(e){var t=e.data;t.startsWith("PING")&&I("PONG :tmi.twitch.tv");var n=function(e){var t="@"===e[0]?e.indexOf(" "):-1,n=e.indexOf(" ",t+1),r=e.indexOf(" ",n+1),c=t>0?e.slice(1,t).split(";").reduce((function(e,t){var n=t.split("=",2);return e[n[0]]=n[1],e}),{}):{},a=e.slice(t+2,e.indexOf("!",t+2)),i=e.slice(n+1,r);if("PRIVMSG"===i){var u=e.indexOf(" ",r+1),o=e.indexOf(":",u+1),s=e.slice(r+2,u),l=e.slice(o+1).trim();return{channel:s,user:c["display-name"]||a,command:i,message:l,tags:c}}return{raw:e,user:c["display-name"]||a,command:i,tags:c}}(t);if("PRIVMSG"===n.command&&n.message){if(!r.b.get())return;var c=n.message.indexOf("http");if(c>=0){var a=n.message.indexOf(" ",c),i=n.message.slice(c,a>0?a:void 0);console.log("[TwitchChat] Found url:",i),T.findByUrl(i).then((function(e){e&&(e.submitter=n.user,Object(r.c)(e))}))}}}},disconnect:function(){_.close()},joinChannel:U,leaveChannel:function(e){console.log("[TwitchChat] Leaving channel",e),I("PART #".concat(e))}};t.a=L},50:function(e,t,n){},76:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(41),i=n.n(a),u=(n(50),n(43)),o=n(3),s=n(25),l=n(16),d=n(10),f=n(1),b=c.a.lazy((function(){return n.e(3).then(n.bind(null,81))})),h=c.a.lazy((function(){return n.e(4).then(n.bind(null,80))}));var p=function(){var e=d.c.use();return Object(f.jsxs)(f.Fragment,{children:[Object(f.jsxs)("header",{className:"flex",children:[Object(f.jsx)("h1",{className:"mb-4",children:"Twitch Clip Queue"}),Object(f.jsx)("div",{className:"flex-grow"}),Object(f.jsx)("div",{children:e?Object(f.jsx)(s.b,{onClick:function(){return Object(d.e)()},children:"Logout"}):Object(f.jsx)(s.b,{onClick:function(){return l.a.redirectToLogin()},children:"Login with Twitch"})})]}),Object(f.jsx)(r.Suspense,{fallback:Object(f.jsx)("div",{}),children:Object(f.jsx)(u.a,{basename:"/twitch-clip-queue/",children:Object(f.jsxs)(o.d,{children:[Object(f.jsx)(o.b,{exact:!0,path:"/",children:e?Object(f.jsx)(h,{}):Object(f.jsx)(b,{})}),Object(f.jsx)(o.b,{path:"*",children:Object(f.jsx)(o.a,{to:"/"})})]})})}),Object(f.jsxs)("footer",{className:"text-xs mt-4 absolute bottom-4",children:["Created by"," ",Object(f.jsx)("span",{className:"font-bold",children:Object(f.jsx)("a",{href:"https://github.com/JakeMiki",target:"_blank",rel:"noreferrer",children:"JakeMiki"})})]})]})},v=function(e){e&&e instanceof Function&&n.e(5).then(n.bind(null,79)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),r(e),c(e),a(e),i(e)}))};i.a.render(Object(f.jsx)(c.a.StrictMode,{children:Object(f.jsx)(p,{})}),document.getElementById("root")),v(),l.a.processAuth()}},[[76,1,2]]]);
//# sourceMappingURL=main.5e49b6a9.chunk.js.map