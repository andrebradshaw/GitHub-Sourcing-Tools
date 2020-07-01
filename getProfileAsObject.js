  
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
var unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));

var prop = (arr, str) => unqHsh(arr.filter(el => el.getAttribute('itemprop') == str).map(el => el ? el.innerText.trim() : '').filter(r=> r),{});
//   var res = await getProfileRepoData();

async function gihubProfileObject(path) {
  var res = await fetch(`https://github.com/${path}?tab=repositories`);
  var text = await res.text();
  var res = new DOMParser().parseFromString(text, 'text/html');
  let all = Array.from(res.querySelectorAll('*'));  
  var items = [['name','full_name'],['additionalName','profile_path'],['homeLocation','location'],['worksFor','employer'],['url','url'],['email','email']];
  var obj = {};
  items.forEach(r=> {
    var val = prop(all, r[0]);
    if(val.length) obj[r[1]] = val[0];
  });
  return obj;
}

async function getGithubProfileData(){
  var path = reg(/(?<=github.com\/).+?(?=\/|$)/.exec(window.location.href),0);
  var obj = await gihubProfileObject(path);
  console.log(obj);

}

getGithubProfileData()
