    
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
var cleanUrl = (s) => s.replace(/&s=.+?(?=&)/, '').replace(/&o=.+?(?=&)/, '');

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

async function gitSearch(url) {
// obj,p,ordr
// `https://github.com/search?o=${ordr}&p=${p}&q=location%3A${obj.geo}+language%3A${obj.lang}${obj.follower}&s=${obj.sort}${obj.repos}&type=Users`
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}

async function loopGitSearch(){
  var getTotalResults = (d) => cn(d,'flex-md-row flex-justify-between')[0] ? reg(/[\d,]+(?=\s+users)/.exec(cn(d,'flex-md-row flex-justify-between')[0].innerText),0).replace(/\D+/g,'') : 0;
  var getTotalPages = (s) => s ? Math.ceil(parseInt(s) / 10) : 0;
  var getPages2Loop = (s) => s > 100 ? 100 : s;

  var containArr = [];
//   var search = {sort: "repositories", follower: "", repos: ""};
  var cleanedUrl = cleanUrl(window.location.href);
  var doc = await gitSearch(cleanedUrl);

  var results = getTotalResults(doc);
  var totalPages = getTotalPages(results);

  async function loopAlternates(searchObj){
    var t_url = cleanedUrl.replace(/(?<=&q=.+?)&/, searchObj.repos+searchObj.follower+'&')+`&s=${searchObj.sort}&o=desc`;

    var check = await gitSearch(t_url);
    var strRes = getTotalResults(check);
    var t_pages = getTotalPages(strRes);
    var loops = getPages2Loop(t_pages);

    console.log(t_pages);
    for(var i=1; i<=loops; i++){
      var uri = t_url+'&p='+i;
      var doc2 = await gitSearch(uri);
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> containArr.push(el));
      await delay(rando(1050)+1500);
      if(i == 25 || i == 50 || i == 75 || i == 100) await delay(rando(8050)+11000);

    }
    if(t_pages > 100){
      for(var i=1; i<=loops; i++){
        var uri = t_url+'&p='+i;
        var doc2 = await gitSearch(uri.replace(/o=desc/, 'o=asc'));
        var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
        item2.forEach(el=> containArr.push(el));
        await delay(rando(1050)+1500);
        if(i == 25 || i == 50 || i == 75 || i == 100) await delay(rando(8050)+11000);

      }
    }
  }

  if(totalPages){
    await loopAlternates({sort: "repositories", follower: "", repos: ""});
  }

  if(totalPages > 200){
    await delay(rando(150)+1500);
    await loopAlternates({sort: "joined", follower: "", repos: ""});
    await loopAlternates({sort: "", follower: "", repos: "+repos%3A>10"});
  }

  if(totalPages > 300){
    await delay(rando(150)+1500);
    await loopAlternates({sort: "followers", follower: "", repos: ""});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: ""});
  }

  if(totalPages > 400){
    await delay(rando(150)+1500);
    await loopAlternates({sort: "", follower: "", repos: "+repos%3A>25"});
    await loopAlternates({sort: "", follower: "", repos: "+repos%3A<25"});
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A>10"});
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A<10"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A>10"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A<10"});
  }

  if(totalPages > 500){
    await delay(rando(150)+1500);
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A>25"});
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A<25"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A>25"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A<25"});
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A>5"});
    await loopAlternates({sort: "", follower: "+followers%3A<5", repos: "+repos%3A<5"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A>5"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A<5"});
  }

  if(totalPages > 600){
    await delay(rando(150)+1500);
    await loopAlternates({sort: "", follower: "+followers%3A<10", repos: "+repos%3A>5"});
    await loopAlternates({sort: "", follower: "+followers%3A<10", repos: "+repos%3A<5"});
    await loopAlternates({sort: "", follower: "+followers%3A>5", repos: "+repos%3A>50"});
    await loopAlternates({sort: "", follower: "+followers%3A>10", repos: "+repos%3A<50"});
    await loopAlternates({sort: "", follower: "+followers%3A<200", repos: "+repos%3A>50"});
  }
  var paths = unq(containArr);
  console.log(paths);
  if(containArr.length>0) downloadr(paths,'gitSearchPaths.json');
}

loopGitSearch()
