import{_ as o,c as t,a,e as s,b as l,d as n,o as p,r as c}from"./app.13a892cf.js";const r="/v1/assets/disk-cache-screenshot.93206c5d.png",R=JSON.parse('{"title":"Request specifics","description":"","frontmatter":{},"headers":[{"level":2,"title":"id","slug":"id","link":"#id","children":[]},{"level":2,"title":"cache","slug":"cache","link":"#cache","children":[]},{"level":2,"title":"cache.ttl","slug":"cache-ttl","link":"#cache-ttl","children":[]},{"level":2,"title":"cache.interpretHeader","slug":"cache-interpretheader","link":"#cache-interpretheader","children":[]},{"level":2,"title":"cache.cacheTakeover","slug":"cache-cachetakeover","link":"#cache-cachetakeover","children":[]},{"level":2,"title":"cache.methods","slug":"cache-methods","link":"#cache-methods","children":[]},{"level":2,"title":"cache.cachePredicate","slug":"cache-cachepredicate","link":"#cache-cachepredicate","children":[]},{"level":2,"title":"cache.update","slug":"cache-update","link":"#cache-update","children":[]},{"level":2,"title":"cache.etag","slug":"cache-etag","link":"#cache-etag","children":[]},{"level":2,"title":"cache.modifiedSince","slug":"cache-modifiedsince","link":"#cache-modifiedsince","children":[]},{"level":2,"title":"cache.staleIfError","slug":"cache-staleiferror","link":"#cache-staleiferror","children":[]},{"level":2,"title":"cache.override","slug":"cache-override","link":"#cache-override","children":[]}],"relativePath":"config/request-specifics.md","lastUpdated":1671998185000}'),i={name:"config/request-specifics.md"},d=s("h1",{id:"request-specifics",tabindex:"-1"},[l("Request specifics "),s("a",{class:"header-anchor",href:"#request-specifics","aria-hidden":"true"},"#")],-1),h=s("p",null,[l("Each request can have its own cache customization, by using the "),s("code",null,"cache"),l(" property. This way, you can have requests behaving differently from each other without much effort.")],-1),y=s("p",null,"The inline documentation is self explanatory, but here is a shortly brief of what each property does:",-1),D=s("h2",{id:"id",tabindex:"-1"},[l("id "),s("a",{class:"header-anchor",href:"#id","aria-hidden":"true"},"#")],-1),u=n("",3),F=n("",7),C=n("",5),A=n("",5),b=n("",10),m=n("",4),f=n("",4),_=n("",6),g=n("",4),T=n("",12),v=s("ul",null,[s("li",null,[l("Type: "),s("code",null,"boolean")]),s("li",null,[l("Default: "),s("code",null,"false")])],-1),w=s("p",null,"This option bypasses the current cache and always make a new http request. This will not delete the current cache, it will just replace the cache when the response arrives.",-1),k=s("p",null,[l("Unlike as "),s("code",null,"cache: false"),l(", this will not disable the cache, it will just ignore the pre-request cache checks before making the request. This way, all post-request options are still available and will work as expected.")],-1);function E(I,x,S,q,P,V){const e=c("Badge");return p(),t("div",null,[d,h,y,D,a(e,{text:"optional",type:"warning"}),u,a(e,{text:"optional",type:"warning"}),F,a(e,{text:"optional",type:"warning"}),C,a(e,{text:"optional",type:"warning"}),A,a(e,{text:"optional",type:"warning"}),b,a(e,{text:"optional",type:"warning"}),m,a(e,{text:"optional",type:"warning"}),f,a(e,{text:"optional",type:"warning"}),_,a(e,{text:"optional",type:"warning"}),g,a(e,{text:"optional",type:"warning"}),T,a(e,{text:"optional",type:"warning"}),v,w,k])}const H=o(i,[["render",E]]);export{R as __pageData,H as default};
