import f from"./RichEidtor-e55eb418.js";import{r as g,f as w}from"./index-8bef1c81.js";import{o as x}from"./antDesign-5cb4b61a.js";import{d as b,f as o,w as y,W as p,X as k,a0 as V,k as r,Z as T,u as B,G as C,a1 as s,F as S}from"./vue-d39115fd.js";import"./echarts-de64fab6.js";const E=i=>g({method:"POST",url:"/report/super",data:i}),F=s("div",null,"待开发中...",-1),H={class:"w100 ub",style:{height:"800px"}},I={class:"ub ub-f1",style:{height:"100%"}},N={class:"ub ub-f1 ml-2 editor-content-view",style:{height:"100%"}},U=["innerHTML"],z=b({__name:"index",setup(i){const c=w();o("");const a=o(""),l=o("");function d(t){const e=[];for(let n=0;n<t.length;n+=5)e.push(t.substr(n,5));return e}const _=t=>t?d(t).join("-"):"",v=t=>{t.target.value;const e=t.target.value.replace(/-/g,""),n=_(e);l.value=n},m=async()=>{await E({path:"/docs/fe/html/standard2.html",url:"https://www.flypa.cn/vue-super-ui/docs/fe/html/standard2.html"})};return y(()=>a.value,t=>{}),o({Authorization:c?"Bearer "+c:void 0}),o(!1),o([]),(t,e)=>{const n=p("a-input"),h=p("a-button");return k(),V(S,null,[F,r(n,{value:l.value,"onUpdate:value":e[0]||(e[0]=u=>l.value=u),onInput:v},null,8,["value"]),r(h,{onClick:m},{default:T(()=>[r(B(x)),C(" 上报 ")]),_:1}),s("div",H,[s("div",I,[r(f,{value:a.value,"onUpdate:value":e[1]||(e[1]=u=>a.value=u)},null,8,["value"])]),s("div",N,[s("div",{class:"w100 px-1",id:"editor-content-view",innerHTML:a.value},null,8,U)])])],64)}}});export{z as default};