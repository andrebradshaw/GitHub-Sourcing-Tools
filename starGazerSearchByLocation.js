var currentPage = window.location.href;
var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() + n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var csvTable = (arr) => arr.map(itm => itm.toString().replace(/$/, '\r')).toString().replace(/\r,/g, '\r');

var geoSearchLoc = "Sweden or Sverige or Stockholm";
var geoSearch = geoSearchLoc ? new RegExp(geoSearchLoc.replace(/\s+OR\s+/gi, '|').trim(), 'i') : null;

async function getEmailFromProfile(url) {
  var res = await fetch(url + '?tab=repositories');
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repos = doc.getElementsByClassName('col-12 d-flex width-full py-4 border-bottom public source');
  var targetRepos = Array.from(repos).map(itm => itm.getElementsByTagName('a')[0].href + '/commit/master.patch');
  return checkEmailPatch(targetRepos);
}

async function getPatches(link) {
  var res = await fetch(link);
  var html = await res.text();
  var email = /[\w|\.]+@\S+\.[a-zA-Z]+/.exec(html)[0];
  return email;
}

async function checkEmailPatch(repos) {
  for (i = 0; i < repos.length; i++) {
    var email = await getPatches(repos[i]);
    if (email != '') {
      return email;
    }
  }
}

async function downloadr(str, name) {
  var type = "data:text/plain;charset=utf-8,";
  var file = new Blob([str], {
    type: type
  });
  var a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  await delay(10);
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

async function getHoverCard(userId,geoSearch){
  var res = await fetch("https://github.com/hovercards?user_id="+userId, {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9","x-requested-with":"XMLHttpRequest"}});
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return geoSearch.test(doc.body.innerText);
}
// getHoverCard();

async function getStarGazers(url){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repositoryCont = cn(doc, 'repository-content')[0];
  var numGazers = cn(repositoryCont,'Counter')[0] ? parseInt(cn(repositoryCont,'Counter')[0].innerText.replace(/\D+/g, '')) : 0;
  var followers = cn(repositoryCont,'follow-list-name') ? Array.from(cn(repositoryCont,'follow-list-name'))
.map(i=> [tn(i, 'a')[0].getAttribute('data-hovercard-url').replace(/\D+/g, ''), tn(i, 'a')[0].href]) : [];
  var filteredFollowers = [];

  for(var i=0; i<followers.length; i++){
    var isMatch = await getHoverCard(followers[i][0],geoSearch);
    if(isMatch) filteredFollowers.push(followers[i][1]);
  }
  var pages = cn(doc,'paginate-container')[0] ? Array.from(tn(cn(doc,'paginate-container')[0],'a')).map() : []
  //TODO return {nextPage: url, filteredFollowers: filteredFollowers};
  return filteredFollowers;
}



async function getProfileDetails(url,geoSearch) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var fullname = cn(doc, 'p-name vcard-fullname')[0] ? cn(doc, 'p-name vcard-fullname')[0].innerText.trim() : '';
  var vcard = Array.from(tn(cn(doc, 'vcard-details')[0], 'li'))
  var geo = vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0].innerText.trim() : '';
  var empl = vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0].innerText.trim() : '';

  if(geoSearch){
      var emailCheck = await getEmailFromProfile(url);
      var email = emailCheck && /noreply/i.test(emailCheck) === false ? emailCheck : '';
      return [fullname, empl, geo, email, url];
    }else{
      return [];
    }
}

async function downloadCSVofMatches(url) {
  var filename = reg(/(?<=\.com\/).+?\/\w+/.exec(url), 0).replace(/\W+/g, '_');
  var resArr = await getStarGazers(url);
//TODO: need a loop through next page. return more than 
  var temp = [
    ['Full Name', 'Company', 'Location', 'Email', 'Github Url']
  ];
  for (var i = 0; i < resArr.length; i++) {
    var row = await getProfileDetails(resArr[i], geoSearch);
    if(row.length > 0) temp.push(row);
  }
  downloadr(csvTable(temp), filename + '.csv')
}



// if (/\/stargazers/.test(currentPage)) downloadCSVofMatches(currentPage);

//   getStarGazers(currentPage)

/*
async function loopThroughGazerPages(){
  getStarGazers(currentPage)

}
*/
