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

var dateString = (s) => new Date(s).toString().replace(/^\S+/, '').replace(/\d\d:\d\d.+/, '').trim().replace(/(?<=[a-zA-Z]{3})\s\d+/, '');
var parseYearMonths = (n) => {
  var m = n / 2629800000;
  var years = Math.trunc(m / 12);
  var months = Math.round(12 * ((m / 12) - years));
  var str = months && years ? `${years} yr${years>1?'s':''} ${months} mo${months>1?'s':''}` : years && months == 0 ? `${years} year${years>1?'s':''}` : `${months} month${months>1?'s':''}`;
  return str;
}

function mapLangPerc(arr){
  var containArr = [];
  var obj = {};
  var langs = unq(arr.map(el => el.lang).filter(el => el != '')).forEach(el=> obj[el] = []);
  for(var i=0; i<arr.length; i++){
    var obs = Object.entries(obj);
    for(var o = 0; o<obs.length; o++){
      if(arr[i].lang == obs[o][0]){
        obs[o][1].push(arr[i].time)
      }
    }
  }
  var obe = Object.entries(obj);
  var total = obe.map(el=> el[1].length).reduce((a,b)=> a+b);
  for(var i=0; i<obe.length; i++){
    var earliest = Math.min(...obe[i][1]);
    var latest = Math.max(...obe[i][1]);
    var duration = parseYearMonths(latest - earliest);
    var perc = Math.round((obe[i][1].length / total)*10000)/100;
    var out = {lang: obe[i][0],percent: perc, start: dateString(earliest), end: dateString(latest), duration: duration};
    containArr.push(out)
  }
console.log(containArr)
  return containArr.sort((a,b)=> a.percent - b.percent).reverse();
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
  var followerCount = follower_s[0] ? parseInt(follower_s[0].innerText.trim()) : 0;
  return followerCount;
}



async function loopThroughRepos(path) {
  var prop = (arr, str) => arr.filter(el => el.getAttribute('itemprop') == str).map(el => el ? el.innerText.trim() : '');
  var res = await getProfileRepoData(`https://github.com/${path}?tab=repositories`);
  var mainDoc = await getProfileRepoData(`https://github.com/${path}`);
  var owns = parseRepo(res, 'source');
  var forks = parseRepo(res, 'fork');
  var fullname = cn(res, 'vcard-fullname')[0] ? cn(res, 'vcard-fullname')[0].innerText : '';
  var vcard = cn(res, 'vcard-details ')[0] ? Array.from(tn(cn(res, 'vcard-details ')[0], 'li')) : null;
  var geo = vcard ? prop(vcard, 'homeLocation') : null;
  var email = vcard ? prop(vcard, 'email') : null;
  var website = vcard ? prop(vcard, 'url') : null;
  var worksFor = vcard ? prop(vcard, 'worksFor') : null;
  var followers = getFollowCounts(res, /followers/i);
  var following = getFollowCounts(res, /following/i);
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
  if (email == null || email.length == 0) {
    for (var r = (owns.length-1); r > (0 || (owns.length-5)); r++) { /*starts from oldest repo since this is most likely to have an email*/
      var link = `https://github.com/${path}/${owns[r].repo}/commit/master.patch`;
      var patchEmail = await getPatches(link);
      if (patchEmail) {
        email.push(patchEmail);
        break
      };
    }
  }
  var langs = unq(owns.map(el => el.lang).filter(el => el != ''));
  var interest = unq(forks.map(el => el.lang).filter(el => el != ''));
  var recognized = owns.filter(el => (el.forks > 0 || el.stars > 0) && el.lang).sort((a, b) => b.time - a.time);
  var lastActive = owns && owns.length > 0 ? new Date(Math.max(...owns.map(el=> el.time))) : 'never';
  var profile = {
    email: email && email.length > 0 ? unq(email).toString() : null,
    website: website && website.length > 0 ? website.toString() : null,
    worksFor: worksFor && worksFor.length > 0 ? worksFor.toString() : null,
    interest: interest && interest.length > 0 ? interest : null,
    langs: langs && langs.length > 0 ? langs : null,
    repos: owns.length > 0 ? owns : null,
    followers: followers,
    following: following,
    forks: forks.length > 0 ? forks : null,
    recognized: recognized && recognized.length > 0 ? recognized : null,
    contributions: contributions && contributions.length > 0 ? contributions : null,
    totalCommits: contributions && contributions.length > 0 ? contributions.map(el => el.commits).reduce((a, b) => a + b) : null,
    lastActive: lastActive
  };
  return cleanObject(profile);
}

async function getProfileData() {
  var cardElms = cn(document, 'user-list-item');
  var paths = cardElms ? Array.from(cardElms).map(el => reg(/(?<=github.com\/).+?(?=\/|$)/.exec(tn(el, 'a')[0].href), 0)) : [];
  for (var i = 0; i < paths.length; i++) {
    var cont = cn(cardElms[i], 'user-list-info ml-2 min-width-0')[0];
    var res = await loopThroughRepos(paths[i]);
    if (res) {
      createCard(cont, res);
    }
  }
}

function createCard(elm, res) {
  var cont = ele('div');
  attr(cont, 'style', `border: 1px solid #004471; border-radius: .3em; width: 100%; font-size: 0.75em;`);
  elm.appendChild(cont);

  var itms = Object.entries(res).filter(el => el);
  for (var i = 0; i < itms.length; i++) {
    var islen = (itms[i][0] == 'recognized' || itms[i][0] == 'forks' || itms[i][0] == 'contributions' || itms[i][0] == 'repos');
    var txt = islen ? itms[i][1].length : itms[i][1].toString().replace(/,\s*/g, ', ');
    var txt2 = itms[i][0];
    var border1 = i != (itms.length - 1) ? ' border-bottom: 1px solid #004471;' : '';
    var border2 = i != (itms.length - 1) ? ' border-bottom: 1px solid #fff;' : '';

    if(txt2 == 'langs'){
      var info = mapLangPerc(res.repos);
      info.forEach(el=> {
        var grid = ele('div');
        attr(grid, 'style', `display: grid; grid-template-columns: 25% 75%;`);
        cont.appendChild(grid);

        var label = ele('div');
        attr(label, 'style', `grid-area: 1 / 1; background: #004471; color: #fff;${border2} padding: 6px; text-align: center;`);
        label.innerText = el.lang;
        grid.appendChild(label);

        var val = ele('div');
        attr(val, 'style', `grid-area: 1 / 2;${border1} padding: 6px;`);
        val.innerHTML = `${el.percent}% of repos<br>${el.start} to ${el.end} - <i>${el.duration}<i>`;
        grid.appendChild(val);
      });
    }else{
        var grid = ele('div');
        attr(grid, 'style', `display: grid; grid-template-columns: 25% 75%;`);
        cont.appendChild(grid);

        var label = ele('div');
        attr(label, 'style', `grid-area: 1 / 1; background: #004471; color: #fff;${border2} padding: 6px; text-align: center;`);
        label.innerText = txt2;
        grid.appendChild(label);

        var val = ele('div');
        attr(val, 'style', `grid-area: 1 / 2;${border1} padding: 6px;`);
        val.innerText = txt;
        grid.appendChild(val);
    }
  }  
}
getProfileData();
