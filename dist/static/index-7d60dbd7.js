import{j as J,$ as l,t as Q,l as ee}from"./index-39ae9cb3.js";import{i as te,F as ae,d as se}from"./formModel-6d2598d3.js";import{d as oe,f as v,r as B,o as le,W as n,X as y,a0 as C,a1 as m,k as t,Z as s,u as e,G as b,a5 as _,Y as S,a8 as N,F as U,g as ne}from"./vue-58c0951e.js";import{j as de,m as ie}from"./antDesign-96db8487.js";import"./echarts-de64fab6.js";const ue=()=>({columns:[{lang:"dept.columns.deptName",dataIndex:"deptName",ellipsis:!0},{lang:"dept.columns.state",dataIndex:"status",ellipsis:!0},{lang:"dept.columns.createTime",dataIndex:"createTime",ellipsis:!0},{lang:"columns.operation",dataIndex:"operation",width:120}]}),ce={class:"search-wrapper"},re={class:"ub ub-ac ub-pj top-opt w100"},pe={class:"mt-1 w100",id:"deptTable"},me={key:1},we=oe({__name:"index",setup(V){const{proxy:I}=ne(),{sys_normal_disable:g}=I.useDict("sys_normal_disable"),{filterOption:$}=ee(),{loading:u,scrollY:j}=J(),{columns:A}=ue(),w=v(!1),x=v("add"),T=v([]),D=v(1),k=v([]);let F=B({});const d=B({deptName:"",status:void 0}),E=()=>{d.deptName="",d.status=void 0};le(()=>{f()});const M=()=>{f()},O=c=>new Promise(async a=>{const i=await se({id:c.deptId});(i==null?void 0:i.code)===200&&(ie.success(l("opeateSuccess")),f()),a(!0)}),P=()=>{x.value="add",w.value=!0},K=c=>{F=c,x.value="edit",w.value=!0},f=async()=>{u.value=!0;const c={deptName:d.deptName,status:d.status},a=await te(c);if((a==null?void 0:a.code)===200){u.value=!1;const{data:i=[]}=a;D.value++,T.value=I.handleTree(i,"deptId")}else u.value=!1},L=()=>{f()},Y=()=>{E(),f()};return(c,a)=>{const i=n("a-input"),h=n("a-form-item"),G=n("a-select"),r=n("a-button"),R=n("a-form"),z=n("a-card"),W=n("fields-setting"),X=n("dict-tag"),Z=n("a-popconfirm"),q=n("a-table");return y(),C(U,null,[m("div",ce,[t(z,{size:"small"},{default:s(()=>[t(R,{model:d,layout:"inline"},{default:s(()=>[t(h,{label:e(l)("dept.columns.deptName")},{default:s(()=>[t(i,{allowClear:"",value:d.deptName,"onUpdate:value":a[0]||(a[0]=o=>d.deptName=o),valueModifiers:{trim:!0},placeholder:e(l)("inputTips"),style:{width:"220px"}},null,8,["value","placeholder"])]),_:1},8,["label"]),t(h,{label:e(l)("dept.columns.state")},{default:s(()=>[t(G,{"show-search":"","filter-option":e($),options:e(g),allowClear:"",placeholder:e(l)("selectTips"),style:{width:"220px"},value:d.status,"onUpdate:value":a[1]||(a[1]=o=>d.status=o)},null,8,["filter-option","options","placeholder","value"])]),_:1},8,["label"]),t(h,null,{default:s(()=>[m("div",null,[t(r,{loading:e(u),type:"primary",onClick:L},{default:s(()=>[b(_(e(l)("opts.search")),1)]),_:1},8,["loading"]),t(r,{loading:e(u),class:"ml-1",onClick:Y},{default:s(()=>[b(_(e(l)("opts.reset")),1)]),_:1},8,["loading"])])]),_:1})]),_:1},8,["model"])]),_:1})]),m("div",re,[m("div",null,[t(r,{size:"small",type:"primary",onClick:P},{icon:s(()=>[t(e(de))]),default:s(()=>[b(" "+_(e(l)("opts.add")),1)]),_:1})]),m("div",null,[t(r,{type:"link",ref:"ref2",shape:"circle"},{default:s(()=>[t(W,{tabKey:"dept-table",value:k.value,"onUpdate:value":a[2]||(a[2]=o=>k.value=o),columns:e(A)},null,8,["value","columns"])]),_:1},512)])]),t(z,{size:"small"},{default:s(()=>[m("div",pe,[(y(),S(q,{key:D.value,defaultExpandAllRows:!0,class:"ant-table-striped","row-class-name":(o,p)=>p%2===1?"table-striped":null,bordered:"",size:"small",columns:k.value,"row-key":o=>o.deptId,"data-source":T.value,pagination:!1,loading:e(u),scroll:{y:e(j)}},{bodyCell:s(({column:o,record:p})=>[o.dataIndex==="status"?(y(),S(X,{key:0,options:e(g),value:p.status},null,8,["options","value"])):N("",!0),o.dataIndex==="createTime"?(y(),C("span",me,_(e(Q)(p.createTime)),1)):N("",!0),o.dataIndex==="operation"?(y(),C(U,{key:2},[t(r,{type:"link",size:"small",onClick:H=>K(p)},{default:s(()=>[b(_(e(l)("opts.edit")),1)]),_:2},1032,["onClick"]),t(Z,{title:e(l)("sureTips"),"ok-text":e(l)("opts.sure"),"cancel-text":e(l)("opts.cancel"),onConfirm:H=>O(p)},{default:s(()=>[t(r,{type:"link",size:"small",danger:""},{default:s(()=>[b(_(e(l)("opts.delete")),1)]),_:1})]),_:2},1032,["title","ok-text","cancel-text","onConfirm"])],64)):N("",!0)]),_:1},8,["row-class-name","columns","row-key","data-source","loading","scroll"]))])]),_:1}),t(ae,{show:w.value,"onUpdate:show":a[3]||(a[3]=o=>w.value=o),status:x.value,"cur-data":e(F),sysNormalDisable:e(g),onSuccess:M},null,8,["show","status","cur-data","sysNormalDisable"])],64)}}});export{we as default};