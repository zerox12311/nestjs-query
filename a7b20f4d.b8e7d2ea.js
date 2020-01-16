/*! For license information please see a7b20f4d.b8e7d2ea.js.LICENSE */
(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{108:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return p}));var r=n(1),a=(n(0),n(122));n(126),n(127);const i={title:"Concepts",sidebar_label:"Concepts"},o={id:"introduction/concepts",title:"Concepts",description:"import Tabs from '@theme/Tabs';",source:"@site/docs/introduction/concepts.mdx",permalink:"/nestjs-query/docs/introduction/concepts",editUrl:"https://github.com/doug-martin/nestjs-query/edit/master/website/docs/introduction/concepts.mdx",sidebar_label:"Concepts",sidebar:"docs",previous:{title:"Getting Started",permalink:"/nestjs-query/docs/introduction/getting-started"},next:{title:"Example",permalink:"/nestjs-query/docs/introduction/example"}},l=[{value:"Queries",id:"queries",children:[]},{value:"Services",id:"services",children:[]},{value:"Resolvers",id:"resolvers",children:[{value:"CRUDResolver",id:"crudresolver",children:[]}]}],c={rightToc:l},b="wrapper";function p({components:e,...t}){return Object(a.b)(b,Object(r.a)({},c,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"queries"},"Queries"),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"core")," package defines a ",Object(a.b)("inlineCode",{parentName:"p"},"Query")," type that is used by the ",Object(a.b)("inlineCode",{parentName:"p"},"query-typeorm")," and ",Object(a.b)("inlineCode",{parentName:"p"},"nestjs-query"),"."),Object(a.b)("p",null,"The query interface contains three optional fields"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"filter")," - option to filter records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"paging")," - option to page records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"sorting")," - option to sort records.")),Object(a.b)("p",null,"To read more about queries take a look at the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"../typeorm/query"}),"typeorm query")," docs."),Object(a.b)("h2",{id:"services"},"Services"),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"core")," package defines a ",Object(a.b)("inlineCode",{parentName:"p"},"QueryService")," interface that has the following methods."),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"query")," - find multiple records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"queryOne")," - find one record."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"findById")," - find a record by its id."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"getById")," - get a record by its id or return a rejected promise with a NotFound error."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"createMany")," - create multiple records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"createOne")," - create one record."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"updateMany")," - update many records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"updateOne")," - update a single record."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"deleteMany")," - delete multiple records."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"deleteOne")," - delete a single record.")),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"@nestjs-query/query-typeorm")," package defines a base class ",Object(a.b)("inlineCode",{parentName:"p"},"TypeormQueryService")," that uses a ",Object(a.b)("inlineCode",{parentName:"p"},"typeorm")," repository\nto create and execute queries. ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"../guides/typeorm"}),"Read about the TypeormQueryService")),Object(a.b)("p",null,"You can create your own service as long as it implements the ",Object(a.b)("inlineCode",{parentName:"p"},"QueryService")," interface."),Object(a.b)("h2",{id:"resolvers"},"Resolvers"),Object(a.b)("h3",{id:"crudresolver"},"CRUDResolver"),Object(a.b)("p",null,"Resolvers work the same as they do in ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://docs.nestjs.com/graphql/resolvers-map"}),Object(a.b)("inlineCode",{parentName:"a"},"@nestjs/graphql")),". The only\ndifference is you extend ",Object(a.b)("inlineCode",{parentName:"p"},"CRUDResolver")," which will add a base set of CRUD methods."),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Queries")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"todoItems")," - Find multiple ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItem"),"s."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"todoItem")," - Find one ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItem"),". This method still takes query arguments however it will will only find one record.")),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Mutations")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"createManyTodoItems")," - create multiple ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItems"),"."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"createOneTodoItems")," - create one ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItem"),"."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"updateManyTodoItems")," - update multiple ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItems"),"."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"updateOneTodoItems")," - update one ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItem"),"."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"deleteManyTodoItems")," - delete multiple ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItems"),"."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"deleteOneTodoItems")," - delete one ",Object(a.b)("inlineCode",{parentName:"li"},"TodoItem"),".")),Object(a.b)("p",null,"You can read more about the graphql features ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"../guides/graphql"}),"here")))}p.isMDXComponent=!0},121:function(e,t,n){var r;!function(){"use strict";var n={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var i=typeof r;if("string"===i||"number"===i)e.push(r);else if(Array.isArray(r)&&r.length){var o=a.apply(null,r);o&&e.push(o)}else if("object"===i)for(var l in r)n.call(r,l)&&r[l]&&e.push(l)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(r=function(){return a}.apply(t,[]))||(e.exports=r)}()},122:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return O}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var b=a.a.createContext({}),p=function(e){var t=a.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):l({},t,{},e)),n},s=function(e){var t=p(e.components);return a.a.createElement(b.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,b=c(e,["components","mdxType","originalType","parentName"]),s=p(n),u=r,m=s["".concat(o,".").concat(u)]||s[u]||d[u]||i;return n?a.a.createElement(m,l({ref:t},b,{components:n})):a.a.createElement(m,l({ref:t},b))}));function O(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:r,o[1]=l;for(var b=2;b<i;b++)o[b]=n[b];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},126:function(e,t,n){"use strict";var r=n(0),a=n.n(r),i=n(121),o=n.n(i),l=n(84),c=n.n(l);const b={left:37,right:39};t.a=function(e){const{block:t,children:n,defaultValue:i,values:l}=e,[p,s]=Object(r.useState)(i),u=[];return a.a.createElement("div",null,a.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:o()("tabs",{"tabs--block":t})},l.map(({value:e,label:t})=>a.a.createElement("li",{role:"tab",tabIndex:"0","aria-selected":p===e,className:o()("tab-item",c.a.tabItem,{"tab-item--active":p===e}),key:e,ref:e=>u.push(e),onKeyDown:e=>((e,t,n)=>{switch(n.keyCode){case b.right:((e,t)=>{const n=e.indexOf(t)+1;e[n]?e[n].focus():e[0].focus()})(e,t);break;case b.left:((e,t)=>{const n=e.indexOf(t)-1;e[n]?e[n].focus():e[e.length-1].focus()})(e,t)}})(u,e.target,e),onFocus:()=>s(e),onClick:()=>s(e)},t))),a.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},r.Children.toArray(n).filter(e=>e.props.value===p)[0]))}},127:function(e,t,n){"use strict";var r=n(0),a=n.n(r);t.a=function(e){return a.a.createElement("div",null,e.children)}}}]);