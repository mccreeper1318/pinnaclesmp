(() => {
  const STATUS_API='https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun';
  const CACHE_KEY='pinnacle-server-status', CACHE_TTL=25000, REQUEST_TIMEOUT=5000;
  let inFlightRequest=null;
  const normalize=list=>{const n=p=>typeof p==='string'?p:(p&&typeof p.name==='string'?p.name:null);return Array.isArray(list)?list.map(n).filter(Boolean):(list&&typeof list==='object'?Object.values(list).map(n).filter(Boolean):[])};
  const unavailable=()=>({available:false,online:false,playersOnline:0,playersMax:20,onlinePlayers:[],version:'Paper 26.2'});
  const read=()=>{try{const c=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'null');return c&&Date.now()-c.cachedAt<=CACHE_TTL?c.status:null}catch{return null}};
  const write=status=>{try{sessionStorage.setItem(CACHE_KEY,JSON.stringify({cachedAt:Date.now(),status}))}catch{}};
  async function request(){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT);try{const response=await fetch(STATUS_API,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('Bad response');const data=await response.json(),onlinePlayers=normalize(data?.players?.list),playersOnline=Number.isFinite(Number(data?.players?.online))?Number(data.players.online):onlinePlayers.length,playersMax=Number.isFinite(Number(data?.players?.max))?Number(data.players.max):20;return{available:true,online:!!data.online,playersOnline,playersMax,onlinePlayers,version:data.version||'Paper 26.2'}}finally{clearTimeout(timer)}}
  async function fetchServerStatus({force=false}={}){const cached=!force?read():null;if(cached)return cached;if(!inFlightRequest)inFlightRequest=request().then(s=>(write(s),s)).catch(()=>read()||unavailable()).finally(()=>inFlightRequest=null);return inFlightRequest}
  window.PinnacleServerStatus={fetchServerStatus};
  const retro=document.querySelector('link[href$="assets/style.css"]');
  if(!retro&&!document.querySelector('script[data-major-loader]')){const inProfiles=/\/profiles\//.test(location.pathname),script=document.createElement('script');script.src=`${inProfiles?'../':''}assets/script.js`;script.dataset.majorLoader='true';script.defer=true;document.head.appendChild(script)}
})();
