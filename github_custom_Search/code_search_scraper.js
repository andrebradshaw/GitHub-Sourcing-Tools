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
  var totalPages = totalResults ? Math.floor(parseInt(totalResults.replace(/\D+/g,'')) / 10) : 0;
  var nextUrl = nextObj.next;
  var paths = nextObj.paths;
  if(paths && paths.length) paths.forEach(el=> pathContainArr.push(el));

  for(var i=2; i<totalPages; i++){
    var res = await getCodeSearchResPage(nextUrl);
	nextObj = res;
	nextUrl = nextObj.next;
 	paths = nextObj.paths;
	await delay(rando(1000)+1000);
    if(paths && paths.length) paths.forEach(el=> pathContainArr.push(el));
  }
  var users = unq(pathContainArr);
  return users;
}

async function loopThroughUsers(){
  var containArr = [];
  var userpaths = await initCodeLooper();
  for(var i=0; i<userpaths.length; i++){
    var userData = await loopThroughRepos(userpaths[i]);
    containArr.push(userData);
  }
console.log(containArr);
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



var dateString = (s) => new Date(s).toString().replace(/^\S+/, '').replace(/\d\d:\d\d.+/, '').trim().replace(/(?<=[a-zA-Z]{3})\s\d+/, '');
var parseYearMonths = (n) => {
  var m = n / 2629800000;
  var years = Math.trunc(m / 12);
  var months = Math.round(12 * ((m / 12) - years));
  var str = months && years ? `${years} yr${years>1?'s':''} ${months} mo${months>1?'s':''}` : years && months == 0 ? `${years} year${years>1?'s':''}` : `${months} month${months>1?'s':''}`;
  return str;
};

var svgs = {
  close: `<svg x="0px" y="0px" viewBox="0 0 100 100"><g style="transform: scale(0.85, 0.85)" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2, 2)" stroke="#e21212" stroke-width="8"><path d="M47.806834,19.6743435 L47.806834,77.2743435" transform="translate(49, 50) rotate(225) translate(-49, -50) "/><path d="M76.6237986,48.48 L19.0237986,48.48" transform="translate(49, 50) rotate(225) translate(-49, -50) "/></g></g></svg>`,
  li: `<svg viewBox="0 0 98 98"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g sketch:type="MSLayerGroup" /><g transform="translate(20, 2)"; sketch:type="MSLayerGroup" stroke="#314E55" stroke-width="2" fill="#81A4E3"><g sketch:type="MSShapeGroup"><path d="M35.9955151,27.6266598 C35.9955151,23.8394326 33.0511715,20.8297982 29.7726613,20.8297982 C27.2676024,20.8297982 25.0529201,20.8297982 23.5815904,23.9999995 C23.3099556,24.5852775 22.9955155,26.2895184 22.9955155,27.1324171 L22.9955155,43.4999995 L15.036777,43.4999989 L15.0367767,22.7102582 L15.0367767,12.455873 L23.3012671,12.455873 L23.7089346,16.5 L23.8873426,16.5 C25.0805776,14.5783603 27.7924258,12.455873 32.6850041,12.455873 C38.6490801,12.455873 43.9955153,17.1766025 43.9955153,25.8297979 L43.9955153,43.4999995 L35.9955151,43.4999995 L35.9955151,27.6266598 Z M4.32081087,8.76648024 C1.71699591,8.76648024 0.036776724,6.92405932 0.036776724,4.64751022 C0.036776724,2.3156217 1.7713812,0.525677812 4.42767319,0.525677812 C7.08396519,0.525677812 8.71170734,2.31466757 8.76609263,4.64751022 C8.76704675,6.92405932 7.08491932,8.76648024 4.32081087,8.76648024 L4.32081087,8.76648024 Z M0.995515537,43.4999995 L0.995515303,12.4558734 L7.98371812,12.4558737 L7.98371835,43.4999999 L0.995515537,43.4999995 Z"/></g></g></g></svg>`
};

function mapLangPerc(arr) {
  var containArr = [];
  var obj = {};
  var langs = unq(arr.map(el => el.lang).filter(el => el != '')).forEach(el => obj[el] = []);
  for (var i = 0; i < arr.length; i++) {
    var obs = Object.entries(obj);
    for (var o = 0; o < obs.length; o++) {
      if (arr[i].lang == obs[o][0]) {
        obs[o][1].push(arr[i].time)
      }
    }
  }
  var obe = Object.entries(obj);
  var total = obe.map(el => el[1].length).reduce((a, b) => a + b);
  for (var i = 0; i < obe.length; i++) {
    var earliest = Math.min(...obe[i][1]);
    var latest = Math.max(...obe[i][1]);
    var duration = parseYearMonths(latest - earliest);
    var perc = Math.round((obe[i][1].length / total) * 10000) / 100;
    var out = {
      lang: obe[i][0],
      percent: perc,
      start: dateString(earliest),
      end: dateString(latest),
      duration: duration
    };
    containArr.push(out)
  }
  console.log(containArr)
  return containArr.sort((a, b) => a.percent - b.percent).reverse();
}

var cleanObject = (ob) =>
  Object.entries(ob).reduce((r, [k, v]) => {
    if (v) {
      r[k] = v;
      return r;
    } else {
      return r;
    }
  }, {});

async function getPatches(link) {
  var res = await fetch(link);
  var html = await res.text();
  var email = reg(/\b[\w\.\-\+]+@[\w\-]+\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13}|\b)/.exec(html.replace(/\w+@users.noreply.github.com|\+.+?(?=@)/g, '')), 0);
  var check = /users.noreply.github.com|@users.noreply.github/i.test(email) ? '' : email;
  return check;
}

async function getProfileRepoData(url) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}

function parseRepo(doc, type) {
  return Array.from(cn(doc, `col-12 d-flex width-full py-4 border-bottom public ${type}`)).map(el => {
    var stars = cn(el, 'octicon-star')[0] ? cn(el, 'octicon-star')[0].parentElement.innerText.trim() : 0;
    return {
      repo: reg(/(?<=github.com\/.+?\/).+?$/.exec(tn(el, 'a')[0].href), 0),
      lang: cn(el, 'ml-0 mr-3')[0] ? cn(el, 'ml-0 mr-3')[0].innerText.trim() : '',
      time: tn(el, 'relative-time')[0] ? new Date(tn(el, 'relative-time')[0].getAttribute('datetime')).getTime() : 0,
      stars: stars == 'Unstar' ? 0 : parseInt(stars.replace(/\D+/g, '')),
      forks: cn(el, 'octicon octicon-repo-forked')[0] ? parseInt(cn(el, 'octicon octicon-repo-forked')[0].parentElement.innerText.trim().replace(/\D+/g, '')) : 0
    };
  });
}

function getFollowCounts(elm, type) {
  var follower_a = Array.from(tn(elm, 'a')).filter(el => type.test(el.innerText))[0];
  var follower_s = follower_a ? cn(follower_a, 'Counter') : null;
  var followerCount = follower_s && follower_s[0] ? parseInt(follower_s[0].innerText.trim()) : 0;
  return followerCount;
}

async function loopThroughRepos(path) {
  var prop = (arr, str) => arr.filter(el => el.getAttribute('itemprop') == str).map(el => el ? el.innerText.trim() : '');
  var res = await getProfileRepoData(`https://github.com/${path}?tab=repositories`);
  var mainDoc = res;
  var owns = parseRepo(res, 'source');
  var forks = parseRepo(res, 'fork');
  var vcard = cn(res, 'vcard-details ')[0] ? Array.from(tn(cn(res, 'vcard-details ')[0], 'li')) : null;

  var bio = cn(res,'p-note user-profile-bio js-user-profile-bio')[0] ? cn(res,'p-note user-profile-bio js-user-profile-bio')[0].innerText.trim() : '';

  var contributions = cn(mainDoc,'graph-before-activity-overview')[0] ? Array.from(cn(cn(mainDoc,'graph-before-activity-overview')[0],'day')).map(el=> {return {date: new Date(el.getAttribute('data-date')).getTime(), commits: parseInt(el.getAttribute('data-count'))}}).filter(el=> el.commits) : null;

  var fullname = cn(res,'vcard-fullname')[0] ? cn(res,'vcard-fullname')[0].innerText : '';
  var geo = vcard ? prop(vcard,'homeLocation') : null;

  var email = vcard ? prop(vcard, 'email') : null;
  var website = vcard ? prop(vcard, 'url') : null;
  var worksFor = vcard ? prop(vcard, 'worksFor') : null;
  var followers = getFollowCounts(res, /followers/i);
  var following = getFollowCounts(res, /following/i);
  var commits = cn(mainDoc, 'graph-before-activity-overview')[0] ? Array.from(cn(cn(mainDoc, 'graph-before-activity-overview')[0], 'day')).map(el => {
    return {
      date: new Date(el.getAttribute('data-date')).getTime(),
      commits: parseInt(el.getAttribute('data-count'))
    }
  }).filter(el => el.commits) : null;

  var bio = cn(res, 'p-note user-profile-bio js-user-profile-bio')[0] ? cn(res, 'p-note user-profile-bio js-user-profile-bio')[0].innerText.trim() : '';
  var contributions = cn(mainDoc, 'graph-before-activity-overview')[0] ? Array.from(cn(cn(mainDoc, 'graph-before-activity-overview')[0], 'day')).map(el => {
    return {
      date: new Date(el.getAttribute('data-date')).getTime(),
      commits: parseInt(el.getAttribute('data-count'))
    }
  }).filter(el => el.commits) : null;
  var pagenate = cn(res, 'paginate-container')[0] ? Array.from(tn(cn(res, 'paginate-container')[0], 'a')).filter(el => el.innerText == 'Next').map(el => el.href) : [];
  var pages = cn(res, 'UnderlineNav-item mr-0 mr-md-1 mr-lg-3 selected ')[0] ? Math.ceil(parseInt(cn(res, 'UnderlineNav-item mr-0 mr-md-1 mr-lg-3 selected ')[0].innerText.replace(/\D+/g, '')) / 30) : 0;
  for (var i = 2; i <= pages; i++) {
    var res2 = await getProfileRepoData(pagenate[0]);
    parseRepo(res2, 'fork').forEach(el => forks.push(el));
    parseRepo(res2, 'source').forEach(el => owns.push(el));
  }
  if ((email == null || email.length == 0) && owns[0]) {
    for (var r = (owns.length - 1); r > ((owns.length - 5) || -1); r--) { //starts from oldest repo since this is most likely to have an email
      var link = `https://github.com/${path}/${owns[r].repo}/commit/master.patch`;
      var patchEmail = await getPatches(link);
      console.log(`${r} of ${owns.length-1}`);
      if (patchEmail) {
        email.push(patchEmail);
        console.log(`finished on ${r} of ${owns.length-1}`);
        r = -1;
        break;
      };
    }
  }

  var langs = unq(owns.map(el => el.lang).filter(el => el != ''));
  var interest = unq(forks.map(el => el.lang).filter(el => el != ''));
  var recognized = owns.filter(el => (el.forks > 0 || el.stars > 0) && el.lang).sort((a, b) => b.time - a.time);
  var lastActive = owns && owns.length > 0 ? new Date(Math.max(...owns.map(el => el.time))) : 'never';
  var profile = {
	fullname: fullname,
	path_id: path,
    location: geo ? geo.toString() : null,
    email: email && email.length > 0 ? unq(email).toString() : null,
    langs: langs && langs.length > 0 ? langs : null,
    website: website && website.length > 0 ? website.toString() : null,
    worksFor: worksFor && worksFor.length > 0 ? worksFor.toString() : null,
    interests: interest && interest.length > 0 ? interest : null,
    followers: followers,
    following: following,
    repos: owns.length > 0 ? owns : null,
    forks: forks.length > 0 ? forks : null,
    recognized: recognized && recognized.length > 0 ? recognized : null,
    contributions: contributions && contributions.length > 0 ? contributions : null,
    totalCommits: contributions && contributions.length > 0 ? contributions.map(el => el.commits).reduce((a, b) => a + b) : null,
    lastActive: lastActive,
    bio: cn(mainDoc, 'p-note user-profile-bio js-user-profile-bio')[0] ? cn(mainDoc, 'p-note user-profile-bio js-user-profile-bio')[0].innerText.trim() : '',
    num_commits: commits && commits.length ? commits.map(el => el.commits).reduce((a, b) => a + b) : null,
    percent_active: commits && commits.length ? Math.round((commits.length / (365 - (8 - new Date().getDay()))) * 1000) / 10 : '',
    langs: langs,
    link: 'https://www.github.com/'+path
  };
  return cleanObject(profile);
}

loopThroughUsers()
