var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);

async function getHoverCard(userId,geoSearch){
  var res = await fetch("https://github.com/hovercards?user_id="+userId, {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9","x-requested-with":"XMLHttpRequest"}});
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return geoSearch.test(doc.body.innerText);
}

async function getForkerIdsByRepo(path){
  var res = await fetch("https://github.com/"+path+"/network/members");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repos = Array.from(cn(doc,'repo')).map(el=> 
	[reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0), reg(/(?<=user_id=)\d+/.exec(tn(el,'a')[0].getAttribute('data-hovercard-url')),0)] 
	).filter(el=> el[1]);
  return repos;
}

async function loopThroughForkersSearchGeo(geoSearch){
  var matchingProfilePaths = [];
  var forkers = await getForkerIdsByRepo('google/shaka-player');
  for(var i=0; i<forkers.length; i++){
    var geoMatch = await getHoverCard(forkers[i][1]);
    if(geoMatch) matchingProfilePaths.push(forkers[i][0]);
    await delay(rando(400));    
  }
  return unq(matchingProfilePaths); 
}

