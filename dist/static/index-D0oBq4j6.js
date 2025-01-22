import{b as A}from"./antDesign-CdRSJcA9.js";import{d as L,f as I,W as B,X as j,a0 as P,a1 as s,k as W,Z as U,G as R,F as O,a7 as x,a5 as g}from"./vue-CuEiQHfR.js";var T={exports:{}},D;function J(){return D||(D=1,function(S,M){(function(c,n){S.exports=n()})(window,function(){return function(m){var c={};function n(r){if(c[r])return c[r].exports;var a=c[r]={i:r,l:!1,exports:{}};return m[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=m,n.c=c,n.d=function(r,a,o){n.o(r,a)||Object.defineProperty(r,a,{enumerable:!0,get:o})},n.r=function(r){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},n.t=function(r,a){if(a&1&&(r=n(r)),a&8||a&4&&typeof r=="object"&&r&&r.__esModule)return r;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:r}),a&2&&typeof r!="string")for(var h in r)n.d(o,h,(function(l){return r[l]}).bind(null,h));return o},n.n=function(r){var a=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(a,"a",a),a},n.o=function(r,a){return Object.prototype.hasOwnProperty.call(r,a)},n.p="",n(n.s=0)}({"./src/index.js":function(m,c,n){n.r(c),n("./src/sass/index.scss");var r=n("./src/js/init.js"),a=r.default.init;typeof window<"u"&&(window.printJS=a),c.default=a},"./src/js/browser.js":function(m,c,n){n.r(c);var r={isFirefox:function(){return typeof InstallTrigger<"u"},isIE:function(){return navigator.userAgent.indexOf("MSIE")!==-1||!!document.documentMode},isEdge:function(){return!r.isIE()&&!!window.StyleMedia},isChrome:function(){var o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:window;return!!o.chrome},isSafari:function(){return Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0||navigator.userAgent.toLowerCase().indexOf("safari")!==-1},isIOSChrome:function(){return navigator.userAgent.toLowerCase().indexOf("crios")!==-1}};c.default=r},"./src/js/functions.js":function(m,c,n){n.r(c),n.d(c,"addWrapper",function(){return h}),n.d(c,"capitalizePrint",function(){return l}),n.d(c,"collectStyles",function(){return d}),n.d(c,"addHeader",function(){return e}),n.d(c,"cleanUp",function(){return b}),n.d(c,"isRawHTML",function(){return p});var r=n("./src/js/modal.js"),a=n("./src/js/browser.js");function o(t){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?o=function(u){return typeof u}:o=function(u){return u&&typeof Symbol=="function"&&u.constructor===Symbol&&u!==Symbol.prototype?"symbol":typeof u},o(t)}function h(t,f){var u="font-family:"+f.font+" !important; font-size: "+f.font_size+" !important; width:100%;";return'<div style="'+u+'">'+t+"</div>"}function l(t){return t.charAt(0).toUpperCase()+t.slice(1)}function d(t,f){for(var u=document.defaultView||window,E="",y=u.getComputedStyle(t,""),v=0;v<y.length;v++)(f.targetStyles.indexOf("*")!==-1||f.targetStyle.indexOf(y[v])!==-1||i(f.targetStyles,y[v]))&&y.getPropertyValue(y[v])&&(E+=y[v]+":"+y.getPropertyValue(y[v])+";");return E+="max-width: "+f.maxWidth+"px !important; font-size: "+f.font_size+" !important;",E}function i(t,f){for(var u=0;u<t.length;u++)if(o(f)==="object"&&f.indexOf(t[u])!==-1)return!0;return!1}function e(t,f){var u=document.createElement("div");if(p(f.header))u.innerHTML=f.header;else{var E=document.createElement("h1"),y=document.createTextNode(f.header);E.appendChild(y),E.setAttribute("style",f.headerStyle),u.appendChild(E)}t.insertBefore(u,t.childNodes[0])}function b(t){t.showModal&&r.default.close(),t.onLoadingEnd&&t.onLoadingEnd(),(t.showModal||t.onLoadingStart)&&window.URL.revokeObjectURL(t.printable);var f="mouseover";(a.default.isChrome()||a.default.isFirefox())&&(f="focus");var u=function E(){window.removeEventListener(f,E),t.onPrintDialogClose();var y=document.getElementById(t.frameId);y&&y.remove()};window.addEventListener(f,u)}function p(t){var f=new RegExp("<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>");return f.test(t)}},"./src/js/html.js":function(m,c,n){n.r(c);var r=n("./src/js/functions.js"),a=n("./src/js/print.js");function o(d){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?o=function(e){return typeof e}:o=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(d)}c.default={print:function(i,e){var b=l(i.printable)?i.printable:document.getElementById(i.printable);if(!b){window.console.error("Invalid HTML element id: "+i.printable);return}i.printableElement=h(b,i),i.header&&Object(r.addHeader)(i.printableElement,i),a.default.send(i,e)}};function h(d,i){for(var e=d.cloneNode(),b=Array.prototype.slice.call(d.childNodes),p=0;p<b.length;p++)if(i.ignoreElements.indexOf(b[p].id)===-1){var t=h(b[p],i);e.appendChild(t)}switch(i.scanStyles&&d.nodeType===1&&e.setAttribute("style",Object(r.collectStyles)(d,i)),d.tagName){case"SELECT":e.value=d.value;break;case"CANVAS":e.getContext("2d").drawImage(d,0,0);break}return e}function l(d){return o(d)==="object"&&d&&(d instanceof HTMLElement||d.nodeType===1)}},"./src/js/image.js":function(m,c,n){n.r(c);var r=n("./src/js/functions.js"),a=n("./src/js/print.js"),o=n("./src/js/browser.js");c.default={print:function(l,d){l.printable.constructor!==Array&&(l.printable=[l.printable]),l.printableElement=document.createElement("div"),l.printable.forEach(function(i){var e=document.createElement("img");if(e.setAttribute("style",l.imageStyle),e.src=i,o.default.isFirefox()){var b=e.src;e.src=b}var p=document.createElement("div");p.appendChild(e),l.printableElement.appendChild(p)}),l.header&&Object(r.addHeader)(l.printableElement,l),a.default.send(l,d)}}},"./src/js/init.js":function(m,c,n){n.r(c);var r=n("./src/js/browser.js"),a=n("./src/js/modal.js"),o=n("./src/js/pdf.js"),h=n("./src/js/html.js"),l=n("./src/js/raw-html.js"),d=n("./src/js/image.js"),i=n("./src/js/json.js");function e(p){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?e=function(f){return typeof f}:e=function(f){return f&&typeof Symbol=="function"&&f.constructor===Symbol&&f!==Symbol.prototype?"symbol":typeof f},e(p)}var b=["pdf","html","image","json","raw-html"];c.default={init:function(){var t={printable:null,fallbackPrintable:null,type:"pdf",header:null,headerStyle:"font-weight: 300;",maxWidth:800,properties:null,gridHeaderStyle:"font-weight: bold; padding: 5px; border: 1px solid #dddddd;",gridStyle:"border: 1px solid lightgray; margin-bottom: -1px;",showModal:!1,onError:function(C){throw C},onLoadingStart:null,onLoadingEnd:null,onPrintDialogClose:function(){},onIncompatibleBrowser:function(){},modalMessage:"Retrieving Document...",frameId:"printJS",printableElement:null,documentTitle:"Document",targetStyle:["clear","display","width","min-width","height","min-height","max-height"],targetStyles:["border","box","break","text-decoration"],ignoreElements:[],repeatTableHeader:!0,css:null,style:null,scanStyles:!0,base64:!1,onPdfOpen:null,font:"TimesNewRoman",font_size:"12pt",honorMarginPadding:!0,honorColor:!1,imageStyle:"max-width: 100%;"},f=arguments[0];if(f===void 0)throw new Error("printJS expects at least 1 attribute.");switch(e(f)){case"string":t.printable=encodeURI(f),t.fallbackPrintable=t.printable,t.type=arguments[1]||t.type;break;case"object":t.printable=f.printable,t.fallbackPrintable=typeof f.fallbackPrintable<"u"?f.fallbackPrintable:t.printable,t.fallbackPrintable=t.base64?"data:application/pdf;base64,".concat(t.fallbackPrintable):t.fallbackPrintable;for(var u in t)u==="printable"||u==="fallbackPrintable"||(t[u]=typeof f[u]<"u"?f[u]:t[u]);break;default:throw new Error('Unexpected argument type! Expected "string" or "object", got '+e(f))}if(!t.printable)throw new Error("Missing printable information.");if(!t.type||typeof t.type!="string"||b.indexOf(t.type.toLowerCase())===-1)throw new Error("Invalid print type. Available types are: pdf, html, image and json.");t.showModal&&a.default.show(t),t.onLoadingStart&&t.onLoadingStart();var E=document.getElementById(t.frameId);E&&E.parentNode.removeChild(E);var y=document.createElement("iframe");switch(r.default.isFirefox()?y.setAttribute("style","width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0"):y.setAttribute("style","visibility: hidden; height: 0; width: 0; position: absolute; border: 0"),y.setAttribute("id",t.frameId),t.type!=="pdf"&&(y.srcdoc="<html><head><title>"+t.documentTitle+"</title>",t.css&&(Array.isArray(t.css)||(t.css=[t.css]),t.css.forEach(function(w){y.srcdoc+='<link rel="stylesheet" href="'+w+'">'})),y.srcdoc+="</head><body></body></html>"),t.type){case"pdf":if(r.default.isIE())try{console.info("Print.js doesn't support PDF printing in Internet Explorer.");var v=window.open(t.fallbackPrintable,"_blank");v.focus(),t.onIncompatibleBrowser()}catch(w){t.onError(w)}finally{t.showModal&&a.default.close(),t.onLoadingEnd&&t.onLoadingEnd()}else o.default.print(t,y);break;case"image":d.default.print(t,y);break;case"html":h.default.print(t,y);break;case"raw-html":l.default.print(t,y);break;case"json":i.default.print(t,y);break}}}},"./src/js/json.js":function(m,c,n){n.r(c);var r=n("./src/js/functions.js"),a=n("./src/js/print.js");function o(l){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?o=function(i){return typeof i}:o=function(i){return i&&typeof Symbol=="function"&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i},o(l)}c.default={print:function(d,i){if(o(d.printable)!=="object")throw new Error("Invalid javascript data object (JSON).");if(typeof d.repeatTableHeader!="boolean")throw new Error("Invalid value for repeatTableHeader attribute (JSON).");if(!d.properties||!Array.isArray(d.properties))throw new Error("Invalid properties array for your JSON data.");d.properties=d.properties.map(function(e){return{field:o(e)==="object"?e.field:e,displayName:o(e)==="object"?e.displayName:e,columnSize:o(e)==="object"&&e.columnSize?e.columnSize+";":100/d.properties.length+"%;"}}),d.printableElement=document.createElement("div"),d.header&&Object(r.addHeader)(d.printableElement,d),d.printableElement.innerHTML+=h(d),a.default.send(d,i)}};function h(l){var d=l.printable,i=l.properties,e='<table style="border-collapse: collapse; width: 100%;">';l.repeatTableHeader&&(e+="<thead>"),e+="<tr>";for(var b=0;b<i.length;b++)e+='<th style="width:'+i[b].columnSize+";"+l.gridHeaderStyle+'">'+Object(r.capitalizePrint)(i[b].displayName)+"</th>";e+="</tr>",l.repeatTableHeader&&(e+="</thead>"),e+="<tbody>";for(var p=0;p<d.length;p++){e+="<tr>";for(var t=0;t<i.length;t++){var f=d[p],u=i[t].field.split(".");if(u.length>1)for(var E=0;E<u.length;E++)f=f[u[E]];else f=f[i[t].field];e+='<td style="width:'+i[t].columnSize+l.gridStyle+'">'+f+"</td>"}e+="</tr>"}return e+="</tbody></table>",e}},"./src/js/modal.js":function(m,c,n){n.r(c);var r={show:function(o){var h="font-family:sans-serif; display:table; text-align:center; font-weight:300; font-size:30px; left:0; top:0;position:fixed; z-index: 9990;color: #0460B5; width: 100%; height: 100%; background-color:rgba(255,255,255,.9);transition: opacity .3s ease;",l=document.createElement("div");l.setAttribute("style",h),l.setAttribute("id","printJS-Modal");var d=document.createElement("div");d.setAttribute("style","display:table-cell; vertical-align:middle; padding-bottom:100px;");var i=document.createElement("div");i.setAttribute("class","printClose"),i.setAttribute("id","printClose"),d.appendChild(i);var e=document.createElement("span");e.setAttribute("class","printSpinner"),d.appendChild(e);var b=document.createTextNode(o.modalMessage);d.appendChild(b),l.appendChild(d),document.getElementsByTagName("body")[0].appendChild(l),document.getElementById("printClose").addEventListener("click",function(){r.close()})},close:function(){var o=document.getElementById("printJS-Modal");o&&o.parentNode.removeChild(o)}};c.default=r},"./src/js/pdf.js":function(m,c,n){n.r(c);var r=n("./src/js/print.js"),a=n("./src/js/functions.js");c.default={print:function(l,d){if(l.base64){var i=Uint8Array.from(atob(l.printable),function(b){return b.charCodeAt(0)});o(l,d,i);return}l.printable=/^(blob|http|\/\/)/i.test(l.printable)?l.printable:window.location.origin+(l.printable.charAt(0)!=="/"?"/"+l.printable:l.printable);var e=new window.XMLHttpRequest;e.responseType="arraybuffer",e.addEventListener("error",function(){Object(a.cleanUp)(l),l.onError(e.statusText,e)}),e.addEventListener("load",function(){if([200,201].indexOf(e.status)===-1){Object(a.cleanUp)(l),l.onError(e.statusText,e);return}o(l,d,e.response)}),e.open("GET",l.printable,!0),e.send()}};function o(h,l,d){var i=new window.Blob([d],{type:"application/pdf"});i=window.URL.createObjectURL(i),l.setAttribute("src",i),r.default.send(h,l)}},"./src/js/print.js":function(m,c,n){n.r(c);var r=n("./src/js/browser.js"),a=n("./src/js/functions.js"),o={send:function(e,b){document.getElementsByTagName("body")[0].appendChild(b);var p=document.getElementById(e.frameId);p.onload=function(){if(e.type==="pdf"){r.default.isFirefox()?setTimeout(function(){return h(p,e)},1e3):h(p,e);return}var t=p.contentWindow||p.contentDocument;if(t.document&&(t=t.document),t.body.appendChild(e.printableElement),e.type!=="pdf"&&e.style){var f=document.createElement("style");f.innerHTML=e.style,t.head.appendChild(f)}var u=t.getElementsByTagName("img");u.length>0?l(Array.from(u)).then(function(){return h(p,e)}):h(p,e)}}};function h(i,e){try{if(i.focus(),r.default.isEdge()||r.default.isIE())try{i.contentWindow.document.execCommand("print",!1,null)}catch{i.contentWindow.print()}else i.contentWindow.print()}catch(b){e.onError(b)}finally{r.default.isFirefox()&&(i.style.visibility="hidden",i.style.left="-1px"),Object(a.cleanUp)(e)}}function l(i){var e=i.map(function(b){if(b.src&&b.src!==window.location.href)return d(b)});return Promise.all(e)}function d(i){return new Promise(function(e){var b=function p(){!i||typeof i.naturalWidth>"u"||i.naturalWidth===0||!i.complete?setTimeout(p,500):e()};b()})}c.default=o},"./src/js/raw-html.js":function(m,c,n){n.r(c);var r=n("./src/js/print.js");c.default={print:function(o,h){o.printableElement=document.createElement("div"),o.printableElement.setAttribute("style","width:100%"),o.printableElement.innerHTML=o.printable,r.default.send(o,h)}}},"./src/sass/index.scss":function(m,c,n){},0:function(m,c,n){m.exports=n("./src/index.js")}}).default})}(T)),T.exports}var N=J();const H=A(N),z={class:"ub ub-ver w100"},K={class:"w100"},F={class:"mt-3 print-box",id:"print"},V={class:"dataTable",border:"",cellpadding:"0",cellspacing:"0"},X=L({__name:"index",setup(S){const M=I(["temn","MPN","CPN","ODM PO","CN Descr","HS Code","Coo","Qty(Pcs)","Package","Urit price","Amount","CCY","Net Weight","No of Carton","Pallet ID","Gross Weight","Gross Length","Width","Height"]),m=[{field1:"John Doe",field2:"John Doe",field3:"John Doe",field4:"John Doe",field5:"John Doe",field6:"John Doe",field7:"John Doe",field8:"John Doe",field9:"John Doe",field10:"John Doe",field11:"John Doe",field12:"John Doe",field13:"John Doe",field14:"John Doe",field15:"John Doe",field16:"John Doe",field17:"John Doe",field18:"John Doe",field19:"John Doe"}],c=()=>{H({printable:"print",type:"html",style:`@page { margin: 0 } @media print {

    .print-box {
      width: 100%;
      padding: 0 3px;
      box-sizing: border-box;
    }
    .formTable {
      width:100%;
      border-color: #000;
    }
    .formTable td {
      width: 25%;
      text-indent: 5px;
      box-sizing: border-box;
      line-height: 30px;
      font-size:12px;
      border-color: #000;
    }

    .formTable tr>td.first{
      border-top:none;
      border-right:none;
      border-left:none;
      text-align:center;
      font-weight: bold;
    }
    .formTable tr>td.no-border{
      border:none;
    }
    .formTable tr.two > td:nth-child(odd) {
      width: 15%;
    }
    .formTable tr.two > td:nth-child(even) {
      width: 35%;
    }

    .formTable tr.two td.two.two-first {
      border-left: none;
    }
    .formTable tr.two td.two {
      border-right: none;
    }

    .formTable tr.three.address td {
      line-height: 40px;
    }
    .formTable tr.three td.three-first {
      border-left: none;
    }
    .formTable tr.three td {
      border-top: none;
      border-right: none;
    }
    .formTable tr.three td:last-child {
      border-left: none;
    }

    .formTable tr.three > td:nth-child(2) {
      width: 15%;
    }

    .formTable tr.four td {
      border-top: none;
      border-right: none;
    }
    .formTable tr.four td:first-child {
      width: 15%;
      border-left: none;
    }
    .formTable tr.four.last td {
      border-bottom: none;
    }


    .dataTable {
      margin-top: 10px;
      width: 100%;
      border-color: #000;
      box-sizing: border-box;
    }
    .dataTable thead tr > th:nth-child(1) {
      border-left: none;
    }

    .dataTable tr > td:nth-child(1) {
      border-left: none;
    }
    .dataTable thead tr > th {
      line-height: 30px;
      background-color: #f1f1f1;
      font-size: 12px;
      border-top:none;
      border-right:none;
    }
    .dataTable tr td {
      line-height: 30px;
      font-size: 12px;
      border-top: none;
      border-right: none;
    }
    .dataTable tbody > tr:last-child td {
      border-bottom: none;
    }
  }`,scanStyles:!1})};return(n,r)=>{const a=B("a-button");return j(),P("div",z,[s("div",K,[W(a,{onClick:c},{default:U(()=>r[0]||(r[0]=[R("打印")])),_:1})]),s("div",F,[r[1]||(r[1]=s("table",{class:"formTable",border:"",cellpadding:"0",cellspacing:"0"},[s("tbody",null,[s("tr",null,[s("td",{class:"first",colspan:"4",style:{"border-right":"none","border-bottom":"none"}}," Proforma invoice and Packing Slip ")]),s("tr",{class:"two"},[s("td",{class:"two two-first"},"Ship From:"),s("td",{class:"two"}),s("td",{class:"two"},"Ship To:"),s("td",{class:"two"})]),s("tr",{class:"three"},[s("td",{class:"three-first",colspan:"2"},"发件人姓名:"),s("td",{class:"three"},"OOM Company:"),s("td",{class:"three no-bl"}),s("td",{class:"three no-bl"})]),s("tr",{class:"three address"},[s("td",{class:"three-first",colspan:"2"},"发件人详细地址:"),s("td",{class:"three"},"Address:"),s("td",{class:"three no-bl"}),s("td",{class:"three no-bl"})]),s("tr",{class:"four"},[s("td",{class:"four"},"SO#:"),s("td",{class:"three",colspan:"3"})]),s("tr",{class:"four"},[s("td",{class:"four"},"Total Pallet:"),s("td",{class:"three",colspan:"3"})]),s("tr",{class:"four last"},[s("td",{class:"four"},"Tota! GW:"),s("td",{class:"three",colspan:"3"})])])],-1)),s("table",V,[s("thead",null,[s("tr",null,[(j(!0),P(O,null,x(M.value,(o,h)=>(j(),P("th",{key:h},g(o),1))),128))])]),s("tbody",null,[(j(),P(O,null,x(m,(o,h)=>s("tr",{key:h},[s("td",null,g(o.field1),1),s("td",null,g(o.field2),1),s("td",null,g(o.field3),1),s("td",null,g(o.field4),1),s("td",null,g(o.field5),1),s("td",null,g(o.field6),1),s("td",null,g(o.field7),1),s("td",null,g(o.field8),1),s("td",null,g(o.field9),1),s("td",null,g(o.field10),1),s("td",null,g(o.field11),1),s("td",null,g(o.field12),1),s("td",null,g(o.field13),1),s("td",null,g(o.field14),1),s("td",null,g(o.field15),1),s("td",null,g(o.field16),1),s("td",null,g(o.field17),1),s("td",null,g(o.field18),1),s("td",null,g(o.field19),1)])),64))])])])])}}});export{X as default};
