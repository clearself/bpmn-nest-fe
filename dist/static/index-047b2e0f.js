import{j as R,$ as l,t as ee,l as te}from"./index-8bef1c81.js";import{i as ae,F as se,d as oe}from"./formModel-b6808524.js";import{d as le,f as b,r as D,o as ne,W as d,X as y,a0 as w,a1 as g,k as t,Z as o,u as e,G as x,a5 as c,a8 as h,Y as ie,F as B,g as de}from"./vue-d39115fd.js";import{i as re,m as ue}from"./antDesign-5cb4b61a.js";import"./echarts-de64fab6.js";const ce=()=>({columns:[{lang:"columns.index",dataIndex:"index",width:50},{lang:"post.columns.postCode",dataIndex:"postCode",ellipsis:!0},{lang:"post.columns.postName",dataIndex:"postName",ellipsis:!0},{lang:"post.columns.state",dataIndex:"status",ellipsis:!0},{lang:"post.columns.createTime",dataIndex:"createTime",ellipsis:!0},{lang:"columns.operation",dataIndex:"operation",width:120}]}),pe={class:"search-wrapper"},me={class:"ub ub-ac ub-pj top-opt w100"},_e={class:"mt-1 w100",id:"postTable"},fe={key:0},ve={key:2},we=le({__name:"index",setup(F){const{proxy:U}=de(),{sys_normal_disable:k}=U.useDict("sys_normal_disable"),{filterOption:M}=te(),{pagination:i,loading:p,scrollY:V}=R(),{columns:$}=ce(),C=b(!1),N=b("add"),T=b([]),I=b([]);let z=D({});const n=D({postCode:"",postName:"",status:void 0}),A=()=>{n.postCode="",n.postName="",n.status=void 0};ne(()=>{m()});const O=()=>{m()},P=r=>new Promise(async a=>{const u=await oe({ids:r.postId});(u==null?void 0:u.code)===200&&(ue.success(l("opeateSuccess")),m()),a(!0)}),j=()=>{N.value="add",C.value=!0},E=r=>{z=r,N.value="edit",C.value=!0},m=async()=>{p.value=!0;const r={postCode:n.postCode,postName:n.postName,status:n.status,pageNum:i.current,pageSize:i.pageSize,orderByColumn:"create_time",isAsc:"descending"},a=await ae(r);if((a==null?void 0:a.code)===200){p.value=!1;const{total:u=0,list:_=[]}=a.data;i.total=u,T.value=_}else p.value=!1},L=()=>{i.current=1,m()},Y=()=>{i.current=1,A(),m()},G=r=>{i.current=r.current,i.pageSize=r.pageSize,m()};return(r,a)=>{const u=d("a-input"),_=d("a-form-item"),K=d("a-select"),f=d("a-button"),W=d("a-form"),S=d("a-card"),X=d("fields-setting"),Z=d("dict-tag"),q=d("a-popconfirm"),H=d("a-table");return y(),w(B,null,[g("div",pe,[t(S,{size:"small"},{default:o(()=>[t(W,{model:n,layout:"inline"},{default:o(()=>[t(_,{label:e(l)("post.columns.postCode")},{default:o(()=>[t(u,{allowClear:"",value:n.postCode,"onUpdate:value":a[0]||(a[0]=s=>n.postCode=s),valueModifiers:{trim:!0},placeholder:e(l)("inputTips"),style:{width:"220px"}},null,8,["value","placeholder"])]),_:1},8,["label"]),t(_,{label:e(l)("post.columns.postName")},{default:o(()=>[t(u,{allowClear:"",value:n.postName,"onUpdate:value":a[1]||(a[1]=s=>n.postName=s),valueModifiers:{trim:!0},placeholder:e(l)("inputTips"),style:{width:"220px"}},null,8,["value","placeholder"])]),_:1},8,["label"]),t(_,{label:e(l)("post.columns.state")},{default:o(()=>[t(K,{"show-search":"","filter-option":e(M),options:e(k),allowClear:"",placeholder:e(l)("selectTips"),style:{width:"220px"},value:n.status,"onUpdate:value":a[2]||(a[2]=s=>n.status=s)},null,8,["filter-option","options","placeholder","value"])]),_:1},8,["label"]),t(_,null,{default:o(()=>[g("div",null,[t(f,{loading:e(p),type:"primary",onClick:L},{default:o(()=>[x(c(e(l)("opts.search")),1)]),_:1},8,["loading"]),t(f,{loading:e(p),class:"ml-1",onClick:Y},{default:o(()=>[x(c(e(l)("opts.reset")),1)]),_:1},8,["loading"])])]),_:1})]),_:1},8,["model"])]),_:1})]),g("div",me,[g("div",null,[t(f,{size:"small",type:"primary",onClick:j},{icon:o(()=>[t(e(re))]),default:o(()=>[x(" "+c(e(l)("opts.add")),1)]),_:1})]),g("div",null,[t(f,{type:"link",ref:"ref2",shape:"circle"},{default:o(()=>[t(X,{tabKey:"post-table",value:I.value,"onUpdate:value":a[3]||(a[3]=s=>I.value=s),columns:e($)},null,8,["value","columns"])]),_:1},512)])]),t(S,{size:"small"},{default:o(()=>[g("div",_e,[t(H,{class:"ant-table-striped","row-class-name":(s,v)=>v%2===1?"table-striped":null,bordered:"",size:"small",columns:I.value,"row-key":s=>s.deptId,"data-source":T.value,pagination:e(i),loading:e(p),scroll:{y:e(V)},onChange:G},{bodyCell:o(({column:s,record:v,index:J})=>[s.dataIndex==="index"?(y(),w("a",fe,c((e(i).current-1)*e(i).pageSize+parseInt(J)+1),1)):h("",!0),s.dataIndex==="status"?(y(),ie(Z,{key:1,options:e(k),value:v.status},null,8,["options","value"])):h("",!0),s.dataIndex==="createTime"?(y(),w("span",ve,c(e(ee)(v.createTime)),1)):h("",!0),s.dataIndex==="operation"?(y(),w(B,{key:3},[t(f,{type:"link",size:"small",onClick:Q=>E(v)},{default:o(()=>[x(c(e(l)("opts.edit")),1)]),_:2},1032,["onClick"]),t(q,{title:e(l)("sureTips"),"ok-text":e(l)("opts.sure"),"cancel-text":e(l)("opts.cancel"),onConfirm:Q=>P(v)},{default:o(()=>[t(f,{type:"link",size:"small",danger:""},{default:o(()=>[x(c(e(l)("opts.delete")),1)]),_:1})]),_:2},1032,["title","ok-text","cancel-text","onConfirm"])],64)):h("",!0)]),_:1},8,["row-class-name","columns","row-key","data-source","pagination","loading","scroll"])])]),_:1}),t(se,{show:C.value,"onUpdate:show":a[4]||(a[4]=s=>C.value=s),status:N.value,"cur-data":e(z),sysNormalDisable:e(k),onSuccess:O},null,8,["show","status","cur-data","sysNormalDisable"])],64)}}});export{we as default};