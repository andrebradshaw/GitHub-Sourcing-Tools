var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

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
  var follower_s = follower_a ? cn(follower_a,'Counter')[0] : null;
  var followerCount = follower_s ? parseInt(follower_s.innerText.trim()) : 0;
  return followerCount;
}

async function loopThroughRepos(path,primaryLang){
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
    primaryLang: primaryLang,
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
  }
  return cleanObject(profile);
}
async function loopThroughUserPaths(obj,geo){
  var userpaths = obj.paths;
  var containArr = [];
  for(var i=0; i<userpaths.length; i++){
    var res = await loopThroughRepos(userpaths[i],obj.lang.replace(/C\s\s/g,'C++'));
    containArr.push(res);
    await delay(rando(205)+2100);
  }
  downloadr(containArr,obj.lang+'_'+geo+'_users.json');
}
async function initProfileDownloadLoops(geo){
  for(var i=0; i<fileArray.length; i++){
    await loopThroughUserPaths(fileArray[i],geo);
    console.log(fileArray[i].lang);
    if(fileArray[i].paths.length > 100) await delay(rando(505)+10100);
  }
}
initProfileDownloadLoops('Atlanta');
