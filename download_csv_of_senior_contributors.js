// Quick build based on Adam Kovacs question at SourceCon. Great Idea!
// run on a contributor page, e,g., https://github.com/helm/charts/graphs/contributors
async function initGithubContributorsDownloader(){
  var ele = (t) => document.createElement(t);
  var attr = (o, k, v) => o.setAttribute(k, v);
  var a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));
  var cn = (ob, nm) => ob.getElementsByClassName(nm);
  var tn = (ob, nm) => ob.getElementsByTagName(nm);
  var gi = (ob, nm) => ob.getElementById(nm);
  var delay = (ms) => new Promise(res => setTimeout(res, ms));
  var rando = (n) => Math.round(Math.random() + n);
  function setQuickliCSS(main_cont_id){
    if(gi(document,`${main_cont_id}_style`)) gi(document,`${main_cont_id}_style`).outerHTML = '';
    let csselm = ele('style');
    a(csselm,[['class',`${main_cont_id}_style`]]);
    document.head.appendChild(csselm);
    csselm.innerHTML = `
        .always_white always_white{
            color: #3d00ad;
        }
        .always_white:hover {
            color: #ffffff;
        }
        .quickli_options_container_main {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradient_quickli 3s ease infinite;
        }
        @keyframes gradient_quickli {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }`;
}
setQuickliCSS('quickli_options_container_main');
  function createDownloadHTML() {
    if(gi(document,'downloading_notifier')) gi(document,'downloading_notifier').outerHTML = '';
    const body_width = document.body.getBoundingClientRect().width;
    const download_bar_width = body_width * 0.8;
    let cont = ele('div');
    a(cont, [['id', 'downloading_notifier'], ['style', `position: fixed; top: 100px; left: ${((body_width - download_bar_width)/2)}px; width: ${download_bar_width}px; z-index: ${topZIndexer()}; background: #1c1c1c; border: 2px solid #1c1c1c; border-radius: 0.2em;`]]);
    document.body.appendChild(cont);
    let perc = ele('div');
    a(perc, [['id', 'downloading_percentage_bar'],['class','quickli_options_container_main'], ['style', `width: 0px; height: 50px; border-bottom-right-radius: 0.2em; border-top-right-radius: 0.2em; transition: all 1s;`]]);
    cont.appendChild(perc);
    let txt = ele('div');
    a(txt, [['id', 'downloading_percentage_txt'], ['style', `color: #ffffff; width: ${download_bar_width}px;`]]);
    perc.appendChild(txt);
    txt.innerHTML = 'initiating download...';
}
  function updateDownloadBar(obj){
      const {text,img,iteration,total_results,status} = obj;
      const body_width = document.body.getBoundingClientRect().width;
      const download_bar_width = body_width * 0.8;
      let cont = gi(document,'downloading_notifier');
      let perc = gi(document,'downloading_percentage_bar');
      let txt = gi(document,'downloading_percentage_txt');
      inlineStyler(cont,`{width: ${download_bar_width}px;}`);
      perc.style.width = `${( download_bar_width * ( iteration / total_results ) )}px`;
      let img_html = `<img style="justify-content: center; border-radius: 50%; width: ${img ? '45' : '32'}px; height: ${img ? '45' : '32'}px;" src="${img || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAEV0lEQVRoge2aW4hVVRjHf6eZsSyHMJwSa6KQrLFJK8ksxpLsAol0gcKHSqEofKmHHnyJKJIQ6yEoSF8yEKfQh25kkFIJhTXhJWJMu4mCF2oooqKxzH8sWCdWa9Zee++z9zn0sP6wYH9nf+v/ff+9LnuttQ8JCQkJCQkJCQkJCS2hkVVJUquc04Frgcvt9enAOHAM2Ad8CvzQ7uZqNMLSumuMcT1wH3ADMACcFvD524r+ENgEjNQYvxpMCxcsD0g6pNbwnaR7SsQqXEqjAPEcSQdbFOrjG0mzOyG41TG8ClgT+P0UsN2WPcCPwF/AJKAPuAq4FVicwfso8GIdPTRrDGci8vReDrTQCUnPSDq7YAtMk7RG0skA19r/U5d+KZDgsKSeFhObLOmdAOfzJXkattQq+LFAYstrGnMrA9yPlKh/l6RxSW9JelbSUFXBCwIJLa1zkpF0byDGQMG6T3j1VlUVPOIRPlyz2GZ53IuzrWC9jU6dUUlZk2Ihwcu8JDa1SWyzbPXi3Vmgzl7Hf4uk86sI3umQmdl4epsFX+wJ/ijHv1fSr47/akUmrdDyz8U8YIFjvwAcL/30yuGg9y6+EbgiwjATmOLYe2PR8gTf4dkbahBUBK94PksideZ49v4Yf0yw2QBc59i78shqhGmlUYduYYT6Uuf6N9tDWhJsuvOVjv1xh8SG4s2O+Ln3zE7s9xhpTPAsYJpjf52fY634yiG7CDgvg9wd3wfyEogJ9gMc6YzOf+EfEkwN+PTZh9HEaMDnP4gJ7vHsE6XSrY4/c/LBzjNdjv1FXtSY4D88u7eN4kI40/ttPODjj+1v80hjgo969oWFU60HMxwW07vGAqyXOdfHqwo24+GwYw90SGgTc53r74Gfc3z2FSGNCd5t371NLCqaaU1wt3hfZlDOcq4LvUVigk3r7nDsmV4S7cTNQL/Dvz0Qq9/r9rkTVp5gg7c9e2WHBLtxzE5ga8BnrmcX6tKZcHYjb3q7l/lt3i0t8uK9luH3pOc3w71fRfCQRzzSZsH7vXjzMvxed3wO+PerCPbJDda3SeyrXpx1Ed89jt/mugX3SfrFS2Z1zWLXevxH7almyHeqPYxo4qm6BZuyWBOxoSaxwwHuoYh/t6SFkh6U9Iak29oh2JQVgcQO2VPNVoSapI8FOJdVfYh1CTbl/kCCBp9IWiKpKyeZHnuO/FmAY0zSJQVF9UuaUlZwq9+W5gMfAGcF7plF/vt2lTZm18FnAOcCVwO32G/GIawD1lv+hn0Hd9kyDPxk67wL3G53VGYx9PkEYTV+W3LHkT+rVsEpW7IwaOM+Z4eBuX5a0pEyLZy30orhJLDCLjk32i+HVdCI9TgHg8A2aw7bOucUjVvnXx4mA0uBm4BrgAvsHrrbds1WMcnWG7Q7OHNsvBPYYuNtBpZPEJbRpdvxH48meu2Tryq42fKHnVOQu+3Z9XvAQ8FKZcdwQkJCQkJCQkJCQgkA/wBND93iSe1b/QAAAABJRU5ErkJggg=='}"></img>`;
  txt.innerHTML = `<div style="display: grid; grid-template-columns: 50px 40px 160px ${(download_bar_width - 270)}px; grid-gap: 8px;">${img_html}<div style="transform:translate(0px,15px);">${Math.ceil( ( iteration / total_results ) * 100)}%</div><div style="transform:translate(0px,15px);">complete</div><div style="transform:translate(0px,15px);">${text}</div></div>`;
      if(status !== true) cont.outerHTML = '';
  }
    function convertToTSV(params) {
      const {fileArray,file_name} = params;
      const transpose = (a)=>  a[0].map((_, c)=> a.map(r=> r[c]));
      var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
      var firstLevel = fileArray.map(el => Object.entries(el));
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
    
      function downloadr(arr2D, filename) {
        var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el => el.reduce((a, b) => a + '\t' + b)).reduce((a, b) => a + '\r' + b);
        var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
        var file = new Blob([data], {
          type: type
        });
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
      var output = table.map(el => el.map(itm => str(itm)));
      downloadr((output), file_name+'.tsv');
  }
  function ymdFormat(d){
      let date = new Date(d);
      let yr = date.getFullYear();
      let mo = date.getMonth()+1;
      let day = date.getDate();
      return `${yr}-${(mo < 10 ? '0'+mo.toString() : mo)}-${(day < 10 ? '0'+day.toString() : day)}`;
  }
  async function getContributors(path){
      console.log(path);
      var res = await fetch(`https://github.com/${path}/graphs/contributors-data`, {
        "headers": {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Microsoft Edge\";v=\"97\", \"Chromium\";v=\"97\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": `https://github.com/${path}/graphs/contributors`,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });
      var d = await res.json();
      
      var top100 = d.map(r=> {
              let index_c = Math.max(...r.weeks?.map(i=> i.c));
              
              let info = {
                  added:r.weeks?.map(i=> i.a).reduce((a,b)=> a+b),
                  deleted:r.weeks?.map(i=> i.d).reduce((a,b)=> a+b),
                  commits:r.weeks?.map(i=> i.c).reduce((a,b)=> a+b),
                  last_commit_week:ymdFormat( Math.max(...r.weeks?.map(i=> i.w)) * 1000),
                  peak_commit_week:ymdFormat( r.weeks[r.weeks?.findIndex(i=> i.c == index_c)].w  * 1000 )
              }
              return {

                  ...r.author,
                  ...info
              }
          })
      return top100;
  }




  var cleanNumbers = (s)=>  /k/.test(s) ? parseFloat(s.replace(/k/))* 1000 : /\d/.test(s) ? parseFloat(s) : s;
  
  var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if( v != null && v != undefined && v !== "" && ( ['string','number','boolean','function','symbol'].some(opt=> typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true) ) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
    return r; 
    }
  }, {});
  

  function topZIndexer(){
    let n = new Date().getTime() / 1000000;
    let r = (n - Math.floor(n)) * 100000;
    return (Math.ceil(n+r) * 10);
  }

  function inlineStyler(elm,css){
    Object.entries(JSON.parse(
    css.replace(/(?<=:)\s*(\b|\B)(?=.+?;)/g,'"')
        .replace(/(?<=:\s*.+?);/g,'",')
        .replace(/[a-zA-Z-]+(?=:)/g, k=> k.replace(/^\b/,'"').replace(/\b$/,'"'))
        .replace(/\s*,\s*\}/g,'}')
    )).forEach(kv=> { elm.style[kv[0]] = kv[1]});
  }

  async function getEmailFromProfile(url) {
    var res = await fetch(url + '?tab=repositories');
    var text = await res.text();
    var doc = new DOMParser().parseFromString(text, 'text/html');
    var repos = doc.getElementsByClassName('col-12 d-flex width-full py-4 border-bottom public source');
    var targetRepos = Array.from(repos).map(itm => itm.getElementsByTagName('a')[0].href + '/commit/master.patch');
    return await checkEmailPatch(targetRepos);
  }

  async function getPatches(link) {
    var res = await fetch(link);
    var html = await res.text();
    var email = /\b[\w\.\-\+]+@[\w\-]+\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13}|\b)/i.exec(html)?.[0];
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
      var snakeCaser = (s) => s.split(/(?<=[a-z])\B(?=[A-Z])/).map(i=> i.toLowerCase()).reduce((a,b)=> a+'_'+b)
      var res = await fetch(url);
      var text = await res.text();
      var doc = new DOMParser().parseFromString(text, 'text/html');
      let follow_hrefs = Array.from(doc.getElementsByTagName('a'))?.filter(i=> /tab\=follow/.test(i.href));
      var email_check = await getEmailFromProfile(url);
      var email = email_check && /noreply/i.test(email_check) === false ? email_check : '';
      let vcards = Array.from(Array.from(doc.getElementsByTagName('ul')).filter(i=> i.getAttribute('class') == 'vcard-details')?.[0]?.getElementsByTagName('li')).map(li=> {
        return {
          [snakeCaser(li.getAttribute('itemprop'))]:li.innerText?.trim()?.replace(/^.+?\n/,'')?.trim()
        }
      });
      
      let output = cleanObject({
        ...{
          num_following:cleanNumbers(follow_hrefs?.filter(i=> /tab\=following/.test(i.href))?.[0]?.getElementsByTagName('span')?.[0]?.innerText?.trim()),
          num_followers:cleanNumbers(follow_hrefs?.filter(i=> /tab\=follower/.test(i.href))?.[0]?.getElementsByTagName('span')?.[0]?.innerText?.trim()),
          bio: doc.getElementsByClassName('user-profile-bio')?.[0]?.innerText?.trim()?.replace(/\t|\n|\r/g, ' '),
          fullname: doc.getElementsByClassName('vcard-fullname')?.[0]?.innerText?.trim()?.replace(/\t|\n|\r/g, ' '),
          email:email,
        },
        ...(vcards?.length ? vcards.reduce((a,b)=> {return {...a,...b}}) : {})
      })
      return output;
  }
  async function loopThroughUserProfiles(){
    var contain_arr = [];
    createDownloadHTML();
    let top_contributors = await getContributors(/(?<=\.\w+\/)\S+?\/\S+?(?=\/)/.exec(window.location.href)?.[0]);
    for(let i =0; i<top_contributors.length; i++){
      let profile = await getProfileDetails(`https://github.com${top_contributors[i].path}`);
      contain_arr.push({...top_contributors[i],...profile});
      console.log(i);
      await delay(rando(1111));
      updateDownloadBar({text:top_contributors[i].path,img:top_contributors[i].avatar,iteration:i,total_results:top_contributors.length,status:true});
    }
    convertToTSV({
      fileArray:contain_arr,
      file_name:`${/(?<=\.\w+\/)\S+?\/\S+?(?=\/)/.exec(window.location.href)?.[0]?.replace(/\W+/g,'_')} github contributors`
    });
    updateDownloadBar({text:'complete',img:null,iteration:100,total_results:100,status:false});
  }
  loopThroughUserProfiles()
}

initGithubContributorsDownloader()
