// Quick build based on Adam Kovacs question at SourceCon. Great Idea!

var currentPage = window.location.href;
var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() + n);

var csvTable = (arr) => arr.map(itm => itm.toString().replace(/$/, '\r')).toString().replace(/\r,/g, '\r');

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


async function getContr(url) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var contributors = Array.from(document.getElementsByClassName('contrib-person'))
  var mapCommits = contributors.map(itm => {
    var green = parseInt(itm.getElementsByClassName('text-green')[0].innerText.replace(/\D+/g, ''));
    var red = parseInt(itm.getElementsByClassName('text-red')[0].innerText.replace(/\D+/g, ''));
    var link = itm.getElementsByTagName('a')[0].href;
    return [link, green, red];
  });
  var output = mapCommits.filter(arr => (arr[1] < arr[2]) && arr[2] > 999);
  return output;
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

async function getProfileDetails(url) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var fullname = cn(doc, 'p-name vcard-fullname')[0] ? cn(doc, 'p-name vcard-fullname')[0].innerText.trim() : '';
  var vcard = Array.from(tn(cn(doc, 'vcard-details')[0], 'li'))
  var geo = vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0].innerText.trim() : '';
  var empl = vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0].innerText.trim() : '';
  var emailCheck = await getEmailFromProfile(url);
  var email = emailCheck && /noreply/i.test(emailCheck) === false ? emailCheck : url;
  return [fullname, empl, geo, email];
}

async function downloadCSVofMatches(url) {
  var filename = reg(/(?<=\.com\/).+?\/\w+/.exec(url), 0).replace(/\W+/g, '_');
  var resArr = await getContr(url);
  var temp = [
    ['Full Name', 'Company', 'Location', 'Email - Url']
  ];
  for (var i = 0; i < resArr.length; i++) {
    var row = await getProfileDetails(resArr[i][0]);
    temp.push(row);
  }
  downloadr(csvTable(temp), filename + '.csv')
}

if (/graphs\/contributors/.test(currentPage)) downloadCSVofMatches(currentPage);
