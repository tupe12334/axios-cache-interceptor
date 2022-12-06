import{_ as s,c as a,o as n,d as e}from"./app.bfbb50cb.js";const d=JSON.parse('{"title":"Invalidating Cache","description":"","frontmatter":{},"headers":[{"level":2,"title":"Revalidation after mutation","slug":"revalidation-after-mutation","link":"#revalidation-after-mutation","children":[{"level":3,"title":"Updating cache programmatically","slug":"updating-cache-programmatically","link":"#updating-cache-programmatically","children":[]},{"level":3,"title":"Updating cache through network","slug":"updating-cache-through-network","link":"#updating-cache-through-network","children":[]},{"level":3,"title":"Updating cache through external sources","slug":"updating-cache-through-external-sources","link":"#updating-cache-through-external-sources","children":[]}]},{"level":2,"title":"Keeping cache up to date","slug":"keeping-cache-up-to-date","link":"#keeping-cache-up-to-date","children":[]},{"level":2,"title":"Summing up","slug":"summing-up","link":"#summing-up","children":[]}],"relativePath":"guide/invalidating-cache.md","lastUpdated":1670290591000}'),o={name:"guide/invalidating-cache.md"},l=e(`<h1 id="invalidating-cache" tabindex="-1">Invalidating Cache <a class="header-anchor" href="#invalidating-cache" aria-hidden="true">#</a></h1><p>When using cache-first approaches to improve performance, data inconsistency becomes your major problem. That occurs because <strong>you</strong> can mutate data in the server and <strong>others</strong> also can too. Becoming impossible to really know what is the current state of the data at real time without communicating with the server.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><strong>All available revalidation methods only works when the request is successful.</strong></p><p>If you are wanting to revalidate with a non standard <code>2XX</code> status code, make sure to enable it on the <a href="https://axios-http.com/docs/handling_errors" target="_blank" rel="noreferrer"><code>validateStatus</code></a> axios option or revalidate it manually as shown <a href="#updating-cache-through-external-sources">below</a>.</p></div><p>Take a look at this simple example:</p><ol><li>User list all available posts, server return an empty array.</li><li>User proceeds to create a new post, server returns 200 OK.</li><li>Your frontend navigates to the post list page.</li><li>The post list page still shows 0 posts because it had a recent cache for that request.</li><li>Your client shows 0 posts, but the server actually has 1 post.</li></ol><h2 id="revalidation-after-mutation" tabindex="-1">Revalidation after mutation <a class="header-anchor" href="#revalidation-after-mutation" aria-hidden="true">#</a></h2><p>Most of the cases, you were the one responsible for that inconsistency, like in the above example when the client himself initiated the mutation request. When that happens, you are capable of invalidating the cache for all places you have changed too.</p><p><strong>The <code>cache.update</code> option is available for every request that you make, and it will be the go-to tool for invalidation.</strong></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>By centralizing your requests into separate methods, you are more likely to keep track of custom IDs you use for each request, thus making it easier to reference and invalidate after.</p></div><h3 id="updating-cache-programmatically" tabindex="-1">Updating cache programmatically <a class="header-anchor" href="#updating-cache-programmatically" aria-hidden="true">#</a></h3><p>If the mutation you made was just simple changes, you can get the mutation response and update programmatically your cache.</p><p>Again considering the first example, we can just to an <code>array.push</code> to the <code>list-posts</code> cache and we are good to go.</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Uses \`list-posts\` id to be able to reference it later.</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">listPosts</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    id</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">list-posts</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createPost</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">post</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    cache</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      update</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// Will perform a cache update for the \`list-posts\` respective cache entry.</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">list-posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">listPostsCache</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">createPostResponse</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// If the cache is does not has a cached state, we don&#39;t need to update it</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">listPostsCache</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">state</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">cached</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ignore</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// Imagine the server response for the \`list-posts\` request is: { posts: Post[]; }</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// And the \`create-post\` response comes with the newly created post.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// Adds the created post to the end of the post&#39;s list</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#A6ACCD;">listPostsCache</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">posts</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">push</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">createPostResponse</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">data</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// Return the same cache state, but a updated one.</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">listPostsCache</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>This will update the <code>list-posts</code> cache at the client side, making it equal to the server. When operations like this are possible to be made, they are the preferred. That&#39;s because we do not contact the server again and update ourselves the cache.</p><h3 id="updating-cache-through-network" tabindex="-1">Updating cache through network <a class="header-anchor" href="#updating-cache-through-network" aria-hidden="true">#</a></h3><p>Sometimes, the mutation you made is not simple enough and would need a lot of copied service code to replicate all changes the backend made, turning it into a duplication and maintenance nightmare.</p><p>In those cases, you can just invalidate the cache and let the next request be forwarded to the server, and updating the cache with the new network response.</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Uses \`list-posts\` id to be able to reference it later.</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">listPosts</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    id</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">list-posts</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createPost</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">post</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    cache</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      update</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// Will, internally, call storage.remove(&#39;list-posts&#39;) and let the next request</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// be forwarded to the server without you having to do any checks.</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">list-posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">delete</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>Still using the first example, while we are at the step <strong>3</strong>, automatically, the-axios cache-interceptor instance will request the server again and do required changes in the cache before the promise resolves and your page gets rendered.</p><h3 id="updating-cache-through-external-sources" tabindex="-1">Updating cache through external sources <a class="header-anchor" href="#updating-cache-through-external-sources" aria-hidden="true">#</a></h3><p>If you have any other type of external communication, like when listening to a websocket for changes, you may want to update your axios cache without be in a request context.</p><p>For that, you can operate the storage manually. It is simple as that:</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> (someLogicThatShowsIfTheCacheShouldBeInvalidated) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// Deletes the current cache for the \`list-posts\` respective request.</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">storage</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">remove</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">list-posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="keeping-cache-up-to-date" tabindex="-1">Keeping cache up to date <a class="header-anchor" href="#keeping-cache-up-to-date" aria-hidden="true">#</a></h2><p>If you were <strong>not</strong> the one responsible for that change, your client may not be aware that it has changed. E.g. When you are using a chat application, you may not be aware that a new message was sent to you.</p><p>In such cases that we do have a way to know that the cache is outdated, you may have to end up setting a custom time to live (TTL) for specific requests.</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Uses \`list-posts\` id to be able to reference it later.</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">listPosts</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    id</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">list-posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    cache</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      ttl</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1000</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">60</span><span style="color:#F07178;"> </span><span style="color:#676E95;">// 1 minute.</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createPost</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">post</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    cache</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      update</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// I still want to delete the cache when I KNOW things have</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// changed, but, by setting a TTL of 1 minute, I ensure that</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// 1 minute is the highest time interval that the cache MAY</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// get outdated.</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">list-posts</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">delete</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="summing-up" tabindex="-1">Summing up <a class="header-anchor" href="#summing-up" aria-hidden="true">#</a></h2><p>When applying any kind of cache to any kind of application, you chose to trade data consistency for performance. And, most of the time that is OK.</p><p><em>The best cache strategy is a combination of all of them. TTL, custom revalidation, stale while revalidate and all the others together are the best solution.</em></p><p>The only real tip here is to you put on a scale the amount of inconsistency you are willing to give up for the performance you are willing to gain. <strong>Sometimes, not caching is the best solution.</strong></p>`,31),p=[l];function t(c,r,i,F,y,D){return n(),a("div",null,p)}const u=s(o,[["render",t]]);export{d as __pageData,u as default};
