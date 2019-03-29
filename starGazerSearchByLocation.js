var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() + n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var currentPage = window.location.href;
var startPage = currentPage.replace(/(?<=stargazers).+/, '');

var csvTable = (arr) => arr.map(itm => itm.toString().replace(/$/, '\r')).toString().replace(/\r,/g, '\r');

var popTarget = "gitStarPop";

var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() + n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var csvTable = (arr) => arr.map(itm => itm.toString().replace(/$/, '\r')).toString().replace(/\r,/g, '\r');
  
function dragElement() {
    var elmnt = this.parentElement;
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(this.id)) {
      document.getElementById(this.id).onmousedown = dragMouseDown;
    } else {
      this.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      elmnt.style.opacity = "0.85";
      elmnt.style.transition = "opacity 1000ms";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      elmnt.style.opacity = "1";
    }
  }

  function createPopTextArea(id) {
    if (document.getElementById(id)) document.getElementById(id).outerHTML = "";

    var cd = document.createElement("div");
    cd.setAttribute("id", id);
    cd.style.display = "inline-block";
    cd.style.position = "fixed";
    cd.style.top = "10%";
    cd.style.left = "50%";
    cd.style.width = "22%";
    cd.style.height = "16%";
    cd.style.background = "transparent";
    cd.style.borderRadius = ".15em";
    cd.style.padding = "2px";
    cd.style.zIndex = "10000";
    document.body.appendChild(cd);

    var cb = document.createElement("button");
    cb.setAttribute("id", id + "_close");
    cb.style.float = "left";
    cb.style.background = "#000";
    cb.style.height = "20px";
    cb.style.width = "20px";
    cb.style.borderRadius = "50%";
    cb.style.boxShadow = "0px";
    cb.style.border = "3px solid Crimson";
    cb.style.textAlign = "center";
    cb.style.cursor = "pointer";
    cb.style.userSelect = "none";
    cb.style.fontSize = "1em";
    cb.style.color = "Crimson";
    cb.style.transform = "scale(1, 1) translate(3.5px, 3.5px) rotate(0deg)";
    cb.addEventListener("click", killParent);
    cb.addEventListener("mousedown", hoverO);
    cb.addEventListener("mouseover", hoverI);
    cb.addEventListener("mouseout", hoverO);
    cd.appendChild(cb);

    var hd = document.createElement("div");
    hd.setAttribute("id", id + "_mover");
    hd.style.width = "99%";
    hd.style.height = "25%";
    hd.style.backgroundColor = "#000000";
    hd.style.borderTopLeftRadius = ".15em";
    hd.style.borderTopRightRadius = ".15em";
    hd.style.padding = "6px";
    hd.style.cursor = 'move';
    hd.style.boxShadow = "1px 1px 1px 0px #888888";
    hd.addEventListener("mouseover", dragElement);
    cd.appendChild(hd);


    var tf = document.createElement("input");
    tf.setAttribute("id", id + "_textfile");
    tf.setAttribute("placeholder", "Atlanta OR London OR New York");
    tf.style.width = "66%";
    tf.style.height = "100%";
    tf.style.padding = "3px";
    tf.style.border = "1px solid #000000";
    tf.style.background = "#0f0f0f";
    tf.style.color = "#ffffff";
    tf.style.fontSize = "1em";
    tf.style.userSelect = "none";
    tf.style.float = "right";
    tf.style.boxShadow = "1px 1px 1px 0px #888888";
    tf.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
		initSearchLoop();
      }
    });
    hd.appendChild(tf);

    var tb = document.createElement("div");
    tb.setAttribute("id", id + "_textarea");
    tb.innerText = "Add your location OR locations and press enter to start";
    tb.style.width = "99%";
    tb.style.height = "75%";
    tb.style.padding = "3px";
    tb.style.border = "1px solid #000000";
    tb.style.color = "#878787";
    tb.style.fontSize = "1em";
    tb.style.userSelect = "none";
    tb.style.boxShadow = "1px 1px 1px 0px #888888";
    cd.appendChild(tb);
    tb.style.backgroundColor = "#282828";

  }

  async function killParent() {
    this.style.background = "Crimson";
    this.style.transform = "scale(.001, .001) translate(3px, 3px)  rotate(495deg)";
    this.style.transition = "all 106ms cubic-bezier(.9,.37,.66,.96)";
    await delay(206);
    this.parentElement.outerHTML = "";
  }
  async function killElm() {
    this.outerHTML = "";
  }
  async function hoverI() {
    this.style.border = "2px solid Crimson";
    await delay(40);
    this.style.border = "1px solid Crimson";
    await delay(30);
    this.style.border = "1px solid #000";
    await delay(20);
    this.style.background = "Crimson";
    this.style.color = "#000";
    this.style.transition = "all 186ms cubic-bezier(.9,.37,.66,.96)";
  }
  async function hoverO() {
    this.style.background = "#000";
    this.style.border = "1px solid Crimson";
    await delay(66);
    this.style.border = "3px solid Crimson";
    this.style.color = "Crimson";
    this.style.transition = "all 186ms cubic-bezier(.9,.37,.66,.96)";
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

async function getNumOfStarGazers(url){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repositoryCont = cn(doc, 'repository-content')[0];
  var numGazers = cn(repositoryCont,'Counter')[0] ? parseInt(cn(repositoryCont,'Counter')[0].innerText.replace(/\D+/g, '')) : 0;
  return numGazers;
}

async function getStarGazers(url,geoSearch){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repositoryCont = cn(doc, 'repository-content')[0];
  var followers = cn(repositoryCont,'follow-list-name') ? Array.from(cn(repositoryCont,'follow-list-name'))
.map(i=> [tn(i, 'a')[0].getAttribute('data-hovercard-url').replace(/\D+/g, ''), tn(i, 'a')[0].href]) : [];
  var filteredFollowers = [];

  for(var i=0; i<followers.length; i++){
    var isMatch = await getHoverCard(followers[i][0],geoSearch);
    if(isMatch) filteredFollowers.push(followers[i][1]);
  }
  var pages = cn(doc,'paginate-container')[0] ? Array.from(tn(cn(doc,'paginate-container')[0],'a')) : null;
  var pageArray = pages ? pages.filter(i=> i.innerText == 'Next') : [];
  var pageLink = pageArray.length > 0 ? pageArray[0].href : null;

  var outputObj = {nextPage: pageLink, filteredFollowers: filteredFollowers};
  console.log(outputObj);
  return outputObj;
}



async function getProfileDetails(url,geoSearch) {
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var fullname = cn(doc, 'p-name vcard-fullname')[0] ? cn(doc, 'p-name vcard-fullname')[0].innerText.trim().replace(/,/g,'') : '';
  var vcard = Array.from(tn(cn(doc, 'vcard-details')[0], 'li'));
  var geo = vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'homeLocation')[0].innerText.trim().replace(/,/g,'') : '';
  var empl = vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0] ? vcard.filter(elm => elm.getAttribute('itemprop') == 'worksFor')[0].innerText.trim().replace(/,/g,'') : '';

  if(geoSearch){
      var emailCheck = await getEmailFromProfile(url);
      var email = emailCheck && /noreply/i.test(emailCheck) === false ? emailCheck : '';
      return [fullname, empl, geo, email, url];
    }else{
      return [];
    }
}

async function loopThroughStarGazers(url,geoSearch){
  var profilesToScrape = [];
  var numGazers = await getNumOfStarGazers(url);
  var pagesToLoop = Math.ceil(numGazers/30);
  var firstRes = await getStarGazers(url,geoSearch);
  var resLink = firstRes.nextPage;
  if(firstRes.filteredFollowers.length > 0) firstRes.filteredFollowers.forEach(u=> profilesToScrape.push(u));

  for(var i=0; i<numGazers; i++){
    var elips = '';
    if(/0$|3$|6$/.test(i.toString())){
      var elips = '.' ;
    }
    if(/1$|4$|7$/.test(i.toString())){
      var elips = '..';
    }
    if(/2$|5$|8$/.test(i.toString())){
      var elips = '...';
    }                              
    var percentComplete = Math.round((i/(pagesToLoop)*10000)/100);
    document.getElementById(popTarget+ "_textarea").innerText = 'Building List'+elips+'\n'+percentComplete+'% complete';
    if(resLink){
      var resObj = await getStarGazers(resLink,geoSearch);  
      await delay(111);
      resLink = resObj.nextPage; 
      var resArr = resObj.filteredFollowers;
      if(resObj.filteredFollowers.length > 0) resObj.filteredFollowers.forEach(u=> profilesToScrape.push(u));
    }
  }
  return profilesToScrape;
}

async function downloadCSVofMatches(url,geoSearch) {
  var filename = reg(/(?<=\.com\/).+?\/\w+/.exec(url), 0).replace(/\W+/g, '_') +'_'+ document.getElementById(popTarget+ "_textfile").value.replace(/\s+/g, '_');
  var resArr = await loopThroughStarGazers(url,geoSearch);
  var temp = [
    ['Full Name', 'Company', 'Location', 'Email', 'Github Url']
  ];
  for (var i = 0; i < resArr.length; i++) {
    var row = await getProfileDetails(resArr[i], geoSearch);
    if(row.length > 0) temp.push(row);
  }
  downloadr(csvTable(temp), filename + '.csv');
}

function initSearchLoop(){
  var geoStr = document.getElementById(popTarget+ "_textfile").value;
  var searchG = geoStr ? new RegExp(geoStr.replace(/\s+OR\s+/gi, '|').trim(), 'i') : null;
  document.getElementById(popTarget+ "_textarea").innerText = 'Initializing...';
  downloadCSVofMatches(startPage,searchG);
}
createPopTextArea(popTarget);
