const fs=require('fs'),vm=require('vm'),path=require('path');
let code=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
code=code.replace(/\ninit\(\);\n/,'\n// init suppressed in audit harness\n');
const store=new Map();
const noop=()=>{};
const fakeEl=()=>({
  addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],closest:()=>null,
  classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},style:{},dataset:{},setAttribute:noop,getAttribute:()=>null,
  appendChild:noop,remove:noop,showModal:noop,close:noop,focus:noop,click:noop,reset:noop,
  innerHTML:'',textContent:'',value:'',checked:false,hidden:false,open:false
});
const nodes=new Map(); const getNode=s=>{if(!nodes.has(s)){const node=fakeEl();if(s==='#modal-save')node.type='submit';if(s==='#modal-cancel')node.type='button';nodes.set(s,node);}return nodes.get(s)};
const document={querySelector:s=>getNode(s),querySelectorAll:()=>[],addEventListener:noop,removeEventListener:noop,createElement:fakeEl,body:fakeEl(),documentElement:fakeEl()};
const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear()};
const ctx={console,Date,Math,JSON,Intl,Set,Map,WeakMap,Array,Object,String,Number,Boolean,RegExp,Error,TypeError,URLSearchParams,URL,Promise,structuredClone:global.structuredClone,crypto:global.crypto,
  document,localStorage,location:{search:'',href:'http://audit.local/'},navigator:{serviceWorker:{register:async()=>({}),controller:{scriptURL:'http://audit.local/sw.js?v=none'}},storage:{estimate:async()=>({usage:0,quota:1e9})}},window:{addEventListener:noop,removeEventListener:noop,dispatchEvent:noop,matchMedia:()=>({matches:false,addEventListener:noop}),scrollTo:noop,location:{reload:noop}},
  CustomEvent:function(type,init){this.type=type;this.detail=init?.detail},Blob:global.Blob,FileReader:function(){},Image:function(){},atob:global.atob,btoa:global.btoa,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:cb=>setTimeout(cb,0),cancelAnimationFrame:clearTimeout,
  confirm:()=>true,alert:noop
};
ctx.globalThis=ctx;ctx.window.document=document;ctx.window.navigator=ctx.navigator;ctx.window.localStorage=localStorage;ctx.window.crypto=ctx.crypto;
vm.createContext(ctx);
try{vm.runInContext(code,ctx,{filename:'app.js'});}catch(e){console.error('LOAD_ERROR',e);process.exit(1)}
ctx.navigator.serviceWorker.controller.scriptURL='http://audit.local/sw.js?v='+encodeURIComponent(vm.runInContext('APP_SHELL_REVISION',ctx));
function ev(expr){return vm.runInContext(expr,ctx);}
const out={};
for(const [name,expr] of Object.entries({
 version:'APP_VERSION',core:'coreRegressionFixtureIssues()',semantic:'semanticIntegrityIssues()',render:'screenRenderIntegrityIssues()',workflow:'(()=>{const r=runFullWorkflowTest();return {total:r.checks.length,passed:r.checks.filter(x=>x.pass).length,failures:r.failures}})()'
})) {try{out[name]=ev(expr)}catch(e){out[name]={error:String(e.stack||e)}}}

const targeted={
 insuranceExcluded: ev("vaultInsuranceCoversCountry({type:'Insurance',country:'Worldwide excluding USA',expiry:'2027-01-01'},'USA')"),
 insuranceIncluded: ev("vaultInsuranceCoversCountry({type:'Insurance',country:'Worldwide excluding USA',expiry:'2027-01-01'},'France')"),
 europeExcluded: ev("vaultInsuranceCoversCountry({type:'Insurance',country:'Europe except United Kingdom',expiry:'2027-01-01'},'UK')"),
 reservationCountryOnly: ev("reservationCountryName({destination:'USA'})"),
 reservationAliasPunct: ev("reservationCountryName({destination:'New York, U.S.A.'})"),
 checklistAliasEqual: ev("checklistDestinationKeyForEntry({coverageType:'Destination',city:'London',country:'UK',type:'Standard',arrival:'2026-10-01'})===checklistDestinationKeyForEntry({coverageType:'Destination',city:'London',country:'United Kingdom',type:'Standard',arrival:'2026-10-01'})"),
 motorhomeCanada: ev("countryVisual('Canada','Motorhome').image"),
 motorhomeFrance: ev("countryVisual('France','Motorhome').image"),
 caribbeanBahamas: ev("JSON.stringify(countryVisual('Bahamas','Standard'))"),
 commaCityCountry: ev("reservationCountryName({destination:'Washington, D.C.'})"),
 commaCityLegacy: ev("legacyJourneyItineraryCandidate({id:'probe-dc',title:'Washington, D.C., United States',type:'Standard stay',start:'2026-09-01',end:'2026-09-05'}).city"),
 insuranceOrExcluded: ev("vaultInsuranceCoversCountry({type:'Insurance',country:'Worldwide excluding USA or Canada',expiry:'2027-01-01'},'USA')"),
 insuranceAndOrExcluded: ev("vaultInsuranceCoversCountry({type:'Insurance',country:'Worldwide excluding USA and/or Canada',expiry:'2027-01-01'},'Canada')"),
 insuranceBroadIdentity: ev("vaultInsuranceCoverageIdentity('Worldwide, France')"),
 checklistStateQualifierEqual: ev("checklistDestinationKeyForEntry({coverageType:'Destination',city:'Dallas, TX',country:'United States',type:'Standard',arrival:'2026-09-01'})===checklistDestinationKeyForEntry({coverageType:'Destination',city:'Dallas',country:'USA',type:'Standard',arrival:'2026-09-01'})"),
 journeyStateQualifierEqual: ev("journeyDestinationKey({type:'Standard stay',city:'Dallas, TX',country:'United States'})===journeyDestinationKey({type:'Standard stay',city:'Dallas',country:'USA'})"),
 routeStateCountry: ev("journeyCountryForRoutePlace('Dallas, TX','')"),
 launchPinPrivacy: ev("(()=>{const country=$('#splash-location-country'),city=$('#splash-location-city'),flag=$('#splash-location-flag');country.textContent='CURRENT LOCATION';city.textContent='Travel Command Centre';flag.textContent='🌐';pinLockActive=true;initialLaunchLocationStarted=false;const blocked=showInitialLaunchLocationPhase()===false&&country.textContent==='CURRENT LOCATION'&&city.textContent==='Travel Command Centre'&&flag.textContent==='🌐';pinLockActive=false;const shown=showInitialLaunchLocationPhase()===true&&initialLaunchLocationStarted&&country.textContent!=='CURRENT LOCATION';return blocked&&shown;})()")
};
console.error('TARGETED:'+JSON.stringify(targeted));

const packageIssues=[];
try{
  const manifestText=fs.readFileSync(path.join(__dirname,'manifest.webmanifest'),'utf8'),manifest=JSON.parse(manifestText);
  const description=String(manifest.description||'');
  if(/\bBuild\s+\d+\.\d+\.\d+/i.test(description))packageIssues.push('Manifest description is tied to a stale-prone build number instead of stable product metadata.');
  const indexCode=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),swCodeForRevision=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
  const revisions=text=>[...text.matchAll(/\?v=([^"'\s<>)]+)/g)].map(match=>match[1]);
  const indexRevisions=[...new Set(revisions(indexCode))],swRevisions=[...new Set(revisions(swCodeForRevision))],manifestRevisions=[...new Set(revisions(String(manifest.start_url||'')))];
  const shellRevision=indexRevisions.length===1?indexRevisions[0]:'';
  if(indexRevisions.length!==1||swRevisions.length!==1||manifestRevisions.length!==1||!shellRevision||swRevisions[0]!==shellRevision||manifestRevisions[0]!==shellRevision)packageIssues.push('Launch/runtime asset revision tags are inconsistent, allowing Safari to reuse a stale shell or startup image.');
  const cacheMatch=swCodeForRevision.match(/const CACHE='([^']+)'/);if(!cacheMatch||!shellRevision||!cacheMatch[1].includes(shellRevision))packageIssues.push('Service Worker cache identity does not match the current launch/runtime asset revision.');
}catch(e){packageIssues.push(`Manifest could not be parsed: ${e.message}`);}
try{
  const swCode=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
  if(!swCode.includes("key.startsWith(CACHE_PREFIX)&&key!==CACHE"))packageIssues.push('Service Worker activation can delete caches that do not belong to Travel Command Centre.');
  if(!swCode.includes('isAppEntryNavigation(event.request.url)'))packageIssues.push('Successful non-app navigations can overwrite the cached offline app entry point.');
  if(!swCode.includes("event.request.mode==='navigate'")||!swCode.includes("fetch(event.request,{cache:'no-cache'})"))packageIssues.push('App navigation can reuse a stale HTTP-cached shell.');
  if(swCode.includes('caches.match(event.request)'))packageIssues.push('Service Worker asset lookup can read from unrelated origin caches instead of the current Travel Command Centre cache.');
  if(!swCode.includes('isWithinAppScope(event.request.url)'))packageIssues.push('Service Worker runtime caching is not restricted to the Travel Command Centre scope.');
  if(!swCode.includes('isRuntimeCoreRequest(event.request.url)')||!swCode.includes("fetch(event.request,{cache:'no-cache'})"))packageIssues.push('Core runtime files can remain stale when the formal app version is unchanged.');
  const appCode=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
  if(!appCode.includes("{updateViaCache:'none'}"))packageIssues.push('Service Worker registration can reuse a stale HTTP-cached worker script.');
}catch(e){packageIssues.push(`Service Worker could not be audited: ${e.message}`);}
out.package=packageIssues;

console.log(JSON.stringify(out,null,2));
