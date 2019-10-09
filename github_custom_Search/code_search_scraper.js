/*
Still under development
*/
var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);
var reChar = (s) => s.match(/&#.+?;/g) && s.match(/&#.+?;/g).length > 0 ? s.match(/&#.+?;/g).map(el=> [el,String.fromCharCode(/d+/.exec(el)[0])]).map(m=> s = s.replace(new RegExp(m[0], 'i'), m[1])).pop() : s;


async function initCodeLooper(){
  var pathContainArr = [];
  var currentSearch = window.location.href;
  var nextObj = await getCodeSearchResPage(currentSearch);
  var totalResults = reg(/Showing ([\d,]+) available code results/.exec(document.body.innerText),1);
  var totalPages = totalResults ? parseInt(totalResults.replace(/\D+/g,'')) / 10 : 0;
  var nextUrl = nextObj.next;
  var paths = nextObj.paths;
  paths.forEach(el=> pathContainArr.push(el));

  for(var i=2; i<totalPages; i++){
    var res = await getCodeSearchResPage(nextUrl);
	nextObj = res;
	nextUrl = nextObj.next;
 	paths = nextObj.paths;
	await delay(rando(1000)+1000);
    paths.forEach(el=> pathContainArr.push(el));
  }
console.log(pathContainArr);
}

async function getCodeSearchResPage(url){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  var next = getNextPageUrl(doc);
  var paths = getUserPath(doc);
  console.log(next);
  console.log(paths); 
  return {next: next, paths: paths}; 
}

function getUserPath(doc){
  var cards = Array.from(cn(doc,'code-list-item'));
  var paths = cards.length ? cards.map(el=> tn(el,'a').length ? reg(/(?<=github.com\/).+?(?=\/)/.exec(tn(el,'a')[0].href),0) : '') : null;
  return paths;
}
function getNextPageUrl(doc){
  var next = Array.from(tn(doc,'a')).filter(el=> el.getAttribute('rel') == 'next');
  return next.length ? next[0].href : null;
}

initCodeLooper()