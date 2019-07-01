var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

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

async function gitSearch(obj,p) {
  var res = await fetch(`https://github.com/search?l=${obj.lang}&o=${obj.order}&p=${p}&q=location%3A${obj.geo}&s=${obj.sort}&type=Users&_pjax=%23js-pjax-container`);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}
// gitSearch()

async function loopGitSearch(lang){
  var containArr = [];
  var search = {lang: lang, order: "asc", geo: "Atlanta", sort: "repositories"};
  var doc = await gitSearch(search,1);
  var results = reg(/[\d,]+(?=\s+users)/.exec(cn(doc,'flex-md-row flex-justify-between')[0].innerText),0).replace(/\D+/g,'');
  var totalPages = results ? parseInt(results) / 10 : 0;
  var pages2Loop = totalPages > 100 ? 100 : totalPages;
  var items = Array.from(cn(doc,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
  items.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});

  for(var i=2; i<=pages2Loop; i++){
    var doc2 = await gitSearch(search,i);
	var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
	item2.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});
    await delay(rando(150)+1500);
  }

  if(totalPages > 100){
    for(var i=1; i<=pages2Loop; i++){
      var doc2 = await gitSearch({lang: lang, order: "desc", geo: "Atlanta", sort: "repositories"},i);
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});
      await delay(rando(150)+1500);
    }
  }

  if(totalPages > 200){
    for(var i=1; i<=pages2Loop; i++){
      var doc2 = await gitSearch({lang: lang, order: "desc", geo: "Atlanta", sort: "joined"},i);
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});
      await delay(rando(150)+1500);
    }
    for(var i=1; i<=pages2Loop; i++){
      var doc2 = await gitSearch({lang: lang, order: "asc", geo: "Atlanta", sort: "joined"},i);
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> {if(containArr.every(itm => itm != el)) containArr.push(el)});
      await delay(rando(150)+1500);
    }

  }

  console.log(containArr);
  downloadr(containArr,lang+'_Atlanta.json')
}
loopGitSearch("Python")
