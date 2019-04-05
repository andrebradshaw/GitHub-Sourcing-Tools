var reg = (el, n) => el ? el[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() + n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var csvTable = (arr) => arr.map(itm => itm.toString().replace(/$/, '\r')).toString().replace(/\r,/g, '\r');

var targetUrl = window.location.href.replace(/\?.+/, '')+"?tab=";

async function getDoc(url){
  var res = await fetch(url);
  var text = await res.text();
  return new DOMParser().parseFromString(text, 'text/html');
}

async function getFollow(url,type){
  var doc = await getDoc(url+type);
  var followers = Array.from(cn(doc, 'd-table table-fixed col-12 width-full py-4 border-bottom border-gray-light')).map(div=> tn(div, 'a')[0].href);
  return followers;
}

async function getTargets(url){
  var following = await getFollow(url,'following');
  var followers = await getFollow(url,'followers');
  var targets = followers.concat(following);
  return targets;
}
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
  var email = reg(/[\w|\.]+@\S+\.[a-zA-Z]+/.exec(html),0);
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

async function getProfileDetails(url) {
  var parseVcard = (attr) => vcard.filter(elm => elm.getAttribute('itemprop') == attr)[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == attr)[0].innerText.trim().replace(/,/g,'') : '';
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var fullname = cn(doc, 'p-name vcard-fullname')[0] ? cn(doc, 'p-name vcard-fullname')[0].innerText.trim().replace(/,/g,'') : '';
  var vcard = Array.from(tn(cn(doc, 'vcard-details')[0], 'li'));
  var geo = parseVcard('homeLocation');
  var empl = parseVcard('worksFor');
  var web =  parseVcard('url');
  var emailCheck = await getEmailFromProfile(url);
  var email = emailCheck && /noreply/i.test(emailCheck) === false ? emailCheck : '';
  return [fullname, empl, geo, email, web, url];
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

async function looper(url){
  var two2arr = ['Full Name','Employer','Location','Email','Website','Github'];
  var links = await getTargets(url);
  for(var i=0; i<links.length; i++){
    var row = await getProfileDetails(links[i]);
    two2arr.push(row);
  }
  downloadr(csvTable(two2arr), /(?<=\.com\/)\w+/.exec(targetUrl)[0] + '_followlist.csv');
}

if(/github\.com\/\w+/.test(targetUrl)) looper(targetUrl);

