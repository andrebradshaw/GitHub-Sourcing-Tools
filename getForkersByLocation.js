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

function hoverSwitch() { /* { used_in: [mapComanyViews] } */
  var back = this.style.background;
  var colr = this.style.color;
  this.style.background = colr;
  this.style.color = back;
  this.style.transition = "all 123ms";
}

function dragElement() {
var elmnt = this.parentElement;
var pos1 = 0,  pos2 = 0,  pos3 = 0,  pos4 = 0;
if (document.getElementById(this.id)) {
  document.getElementById(this.id).onmousedown = dragMouseDown;
} else {
  this.onmousedown = dragMouseDown;
}

function dragMouseDown(e) {
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  elmnt.style.opacity = "0.85";
  elmnt.style.transition = "opacity 700ms";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
  elmnt.style.opacity = "1";
}
}

function createSearchContainer(){
  if(gi(document, 'download_cont')) gi(document, 'download_cont').outerHTML = '';

 var cont = ele("div");
  document.body.appendChild(cont);
  attr(cont, "id", "download_cont");
  attr(cont, 'style', 'position: fixed; top: 20%; left: 50%; width: 360px; height: 260px; background: transparent; z-index: 12000;');

  var head = ele("div");
  attr(head, "id", "download_header");
  attr(head, 'style', 'background: #004471; height: 9%; border: 1.5px solid #004471; border-top-right-radius: 0.25em; border-top-left-radius: 0.25em; padding: 0px; cursor: move;');
  cont.appendChild(head);
  head.onmouseover = dragElement;


  var closeBtn = ele("div");
  attr(closeBtn, "id", "search_btn_close");
  attr(closeBtn, 'style', 'background: transparent; width: 15px; height: 15px; transform: scale(1.8, 1.2) translate(4px, 2px); border-radius: 1em; padding: 0px; color: Crimson; cursor: pointer');
  head.appendChild(closeBtn);
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", close);

  var body = ele("div");
  attr(body, "id", "download_body");
  attr(body, 'style', 'background: #fff; height: 90%; border: 1.5px solid #004471; border-bottom-right-radius: 0.25em; border-bottom-left-radius: 0.25em; padding: 6px;');
  cont.appendChild(body);

  var dbody = ele("div");
  attr(dbody, "id", "download_body_type");
  attr(dbody, 'style', 'background: #fff; border-radius: 0.25em; padding: 6px;');
  body.appendChild(dbody);

  var label = ele('div');
  attr(label, "id", "download_body_label");
  label.innerText = 'Location Search';
  dbody.appendChild(label);

  var hinput = ele("input");
  attr(hinput, "id", "geosearch_string");
  attr(hinput, "placeholder", "Germany OR Finland");
  attr(hinput, 'style', 'width: 98%; background: #fff; color: #004471; border-radius: 0.25em; border: 1px solid #004471; padding: 6px; cursor: text;');
  dbody.appendChild(hinput);

  var dlBtn = ele("div");
  attr(dlBtn, "id", "downloadr_btn");
  attr(dlBtn, 'style', 'background: #fff; width: 30%; color: #004471; border: 1px solid #004471; border-radius: 0.25em; padding: 6px; cursor: pointer; text-align: center;');
  dbody.appendChild(dlBtn);
  dlBtn.innerText = 'Run Search';
  dlBtn.onmouseover = hoverSwitch;
  dlBtn.onmouseout = hoverSwitch;
  dlBtn.onclick = initForkSearch;

  function close() {
    document.body.removeChild(cont);
  }
}

function initForkSearch(){
  var geoSearch = gi(document,'geosearch_string').value;
  getMatchingProfiles(geoSearch,reg(/(?<=github.com\/).+?\/.+?(?=\/|$)/.exec(window.location.href),0));
}

createSearchContainer();

function convertToTSV(fileData) {
  var firstLevel = fileData.map(el => Object.entries(el));
  var lens = Math.max(...firstLevel.map(el => el.length));
  var header = unq(firstLevel.map(el => el.map(itm => itm[0])).flat());
  var table = [header];
  var str = (o) => typeof o == 'object' ? JSON.stringify(o).replace(/\n|\r/g, ' ') : o.toString().replace(/\n|\r/g, ' ');
  for (var i = 0; i < firstLevel.length; i++) {
    var arr = [];
    var row = [];
    for (var s = 0; s < firstLevel[i].length; s++) {
      var place = header.indexOf(firstLevel[i][s][0]);
      arr[place] = firstLevel[i][s][1];
    }
    for (var a = 0; a < arr.length; a++) {
      if (arr[a]) {
        row.push(arr[a]);
      } else {
        row.push('');
      }
    }
    table.push(row);
  }
  var output = table.map(el => el.map(itm => str(itm)));
return output;
}

function parseAsRegexArr(bool) {
  function rxReady(s){ return s ? s.replace(/"/g, '\\b').trim().replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '.{0,2}').replace(/\//g, '\\/').replace(/\+/g, '\\+').replace(/\s*\*\s*/g, '\\s*\\w*\\s+') : s;}
  function checkSimpleOR(s) { return /\bor\b/i.test(s) && /\(/.test(s) === false;}
  if (checkSimpleOR(bool)) {
    var x = new RegExp(bool.replace(/\s+OR\s+|\s*\|\s*/gi, '|').replace(/\//g, '\\/').replace(/"/g, '\\b').replace(/\s+/g, '.{0,2}').replace(/\s*\*\s*/g, '\\s*\\w*\\s+'), 'i');
    var xArr = [x];
    return xArr;
  } else {
    var orx = "\\(.+?\\)|(\\(\\w+\\s{0,1}OR\\s|\\w+\\s{0,1}OR\\s)+((\\w+\s)+?|(\\w+)\\)+)+?";
    var orMatch = bool ? bool.match(new RegExp(orx, 'g')) : [];
    var orArr = orMatch ? orMatch.map(function(b) {return rxReady(b.replace(/\s+OR\s+|\s*\|\s*/gi, '|'))}) : [];
    var noOrs = bool ? bool.replace(new RegExp(orx, 'g'), '').split(/\s+[AND\s+]+/i) : bool;
    var ands = noOrs ? noOrs.map(function(a) { return rxReady(a)}) : [];
    var xArr = ands.concat(orArr).filter(function(i){ return i != ''}).map(function(x){return new RegExp(x, 'i')});
    return xArr;
  }
}

function booleanSearch(bool,target){
  var arr = parseAsRegexArr(bool);
  return arr.every(function(x){
    return x.test(target);
  });
}

async function getHoverCard(userId,geoSearch){
  var res = await fetch("https://github.com/hovercards?user_id="+userId, {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9","x-requested-with":"XMLHttpRequest"}});
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var isMatch = booleanSearch(geoSearch,doc.body.innerText);
  return isMatch;
}

async function getForkerIdsByRepo(path){
  var res = await fetch("https://github.com/"+path+"/network/members");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repos = Array.from(cn(doc,'repo')).map(el=> 
	[reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0), reg(/(?<=user_id=)\d+/.exec(tn(el,'a')[0].getAttribute('data-hovercard-url')),0)]).filter(el=> el[1]);
  return repos;
}

async function loopThroughForkersSearchGeo(geoSearch,repoPath){
  var matchingProfilePaths = [];
  var forkers = await getForkerIdsByRepo(repoPath);
  for(var i=0; i<forkers.length; i++){
    gi(document,'download_body_label').innerText = 'Grabbing forker ids... '+(i+1)+' of '+forkers.length;
    var geoMatch = await getHoverCard(forkers[i][1],geoSearch);
    if(geoMatch) matchingProfilePaths.push(forkers[i][0]);
    await delay(rando(300));    
  }
  return unq(matchingProfilePaths); 
}


var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if(v) { r[k] = v; return r;
    } else { return r; }
  }, {});

function downloadr(arr2D, filename) {
  var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el=> el.reduce((a,b) => a+'\t'+b )).reduce((a,b) => a+'\r'+b);
  var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
  var file = new Blob([data], {    type: type  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement('a'),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

async function getPatches(link) {
  var res = await fetch(link);
  var html = await res.text();
  var email = reg(/[\w\.+]+@\S+\.[a-zA-Z]+/.exec(html.replace(/\w+@users.noreply.github.com|\+.+?(?=@)/g, '')),0);
  var check = /users.noreply.github.com/i.test(email) ? '' : email;
  return check;
}

async function getProfileRepoData(url) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}

function parseRepo(doc,type){
  return Array.from(cn(doc,`col-12 d-flex width-full py-4 border-bottom public ${type}`)).map(el=> {
   var stars = cn(el, 'octicon-star')[0] ? cn(el, 'octicon-star')[0].parentElement.innerText.trim() : 0;
   return {
     repo: reg(/(?<=github.com\/.+?\/).+?$/.exec(tn(el,'a')[0].href),0),
     lang: cn(el, 'ml-0 mr-3')[0] ? cn(el, 'ml-0 mr-3')[0].innerText.trim() : '',
     time: tn(el,'relative-time')[0] ? new Date(tn(el,'relative-time')[0].getAttribute('datetime')).getTime() : 0,
     stars: stars == 'Unstar' ? 0 : parseInt(stars.replace(/\D+/g,'')),
     forks: cn(el,'octicon octicon-repo-forked')[0] ? parseInt(cn(el,'octicon octicon-repo-forked')[0].parentElement.innerText.trim().replace(/\D+/g,'')) : 0
   };
  });
}

function getFollowCounts(elm,type){
  var follower_a = Array.from(tn(elm,'a')).filter(el=> type.test(el.innerText))[0];
  var follower_s = follower_a ? cn(follower_a,'Counter') : null;
  var followerCount = follower_s[0] ? parseInt(follower_s[0].innerText.trim()) : 0;
  return followerCount;
}

async function loopThroughRepos(path){
  var prop = (arr,str) => arr.filter(el=> el.getAttribute('itemprop') == str).map(el=> el ? el.innerText.trim() : '');
  var res = await getProfileRepoData(`https://github.com/${path}?tab=repositories`);
  var mainDoc = await getProfileRepoData(`https://github.com/${path}`);
  var owns = parseRepo(res,'source');
  var forks = parseRepo(res,'fork');
  var fullname = cn(res,'vcard-fullname')[0] ? cn(res,'vcard-fullname')[0].innerText : '';
  var vcard = cn(res,'vcard-details ')[0] ? Array.from(tn(cn(res,'vcard-details ')[0],'li')) : null;
  var geo = vcard ? prop(vcard,'homeLocation') : null;
  var email = vcard ? prop(vcard,'email') : null;
  var website = vcard ? prop(vcard,'url') : null;
  var worksFor = vcard ? prop(vcard,'worksFor') : null;
  var followers = getFollowCounts(res,/followers/i);
  var following = getFollowCounts(res,/following/i);
  var bio = cn(res,'p-note user-profile-bio js-user-profile-bio')[0] ? cn(res,'p-note user-profile-bio js-user-profile-bio')[0].innerText.trim() : '';
  var contributions = cn(mainDoc,'graph-before-activity-overview')[0] ? Array.from(cn(cn(mainDoc,'graph-before-activity-overview')[0],'day')).map(el=> {return {date: new Date(el.getAttribute('data-date')).getTime(), commits: parseInt(el.getAttribute('data-count'))}}).filter(el=> el.commits) : null;
  var pagenate = cn(res,'paginate-container')[0] ? Array.from(tn(cn(res,'paginate-container')[0],'a')).filter(el=> el.innerText == 'Next').map(el=> el.href) : [];
  var pages = cn(res,'UnderlineNav-item mr-0 mr-md-1 mr-lg-3 selected ')[0] ? Math.ceil(parseInt(cn(res,'UnderlineNav-item mr-0 mr-md-1 mr-lg-3 selected ')[0].innerText.replace(/\D+/g,''))/30) : 0;
  for(var i=2; i<=pages; i++){
    var res2 = await getProfileRepoData(pagenate[0]);
    parseRepo(res2,'fork').forEach(el=> forks.push(el));
    parseRepo(res2,'source').forEach(el=> owns.push(el));
  }
  if(email == null || email.length == 0){
    for(var r=0; r<owns.length; r++){
      var link = `https://github.com/${path}/${owns[r].repo}/commit/master.patch`;
      var patchEmail = await getPatches(link);
      if(patchEmail) {console.log(patchEmail); email.push(patchEmail); break};
    }
  }
  var langs = unq(owns.map(el=> el.lang).filter(el=> el != ''));
  var interest = unq(forks.map(el=> el.lang).filter(el=> el != ''));
  var recognized = owns.filter(el=> (el.forks > 0 || el.stars > 0) && el.lang).sort((a,b) => b.time - a.time);
  var profile = {
    fullname: fullname ? fullname : null,
    bio: bio ? bio : null,
    github: 'github.com/'+path,
    followers: followers,
    following: following,
    geo: geo ? geo.toString(): null,
    worksFor: worksFor && worksFor.length > 0 ? worksFor.toString() : null,
    email: email && email.length > 0 ? unq(email) : null,
    website: website && website.length > 0 ? website.toString() : null,
    langs: langs && langs.length > 0 ? langs : null,
    interest: interest && interest.length > 0 ? interest : null,
    owns: owns.length > 0 ? owns : null,
    forks: forks.length > 0 ? forks : null,
    recognized: recognized && recognized.length > 0 ? recognized : null,
    contributions: contributions && contributions.length > 0 ? contributions : null,
    totalContributions: contributions && contributions.length > 0 ? contributions.map(el=> el.commits).reduce((a,b) => a+b) : null
  };
  return cleanObject(profile);
}

async function getMatchingProfiles(geoSearch,targetRepo){
  var containArr = [];
  var profiles = await loopThroughForkersSearchGeo(geoSearch,targetRepo);
  for(var i=0; i<profiles.length; i++){
    gi(document,'download_body_label').innerText = 'Getting profile details... '+(i+1)+' of '+profiles.length;
	var userj = await loopThroughRepos(profiles[i]);
    containArr.push(userj);
    await delay(rando(133)+1303);
  }
  var output = convertToTSV(containArr);
  await delay(1111);
  downloadr(output,geoSearch+'+forks_'+targetRepo+'.tsv');
  gi(document,'download_body_label').innerText = 'Completed';
}
