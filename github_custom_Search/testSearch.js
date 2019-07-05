function parseAsRegexArr(bool) {
  function rxReady(s){ return s ? s.replace(/"/g, '\\b').trim().replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '.{0,2}').replace(/\//g, '\\/').replace(/\+/g, '\\+').replace(/\s*\*\s*/g, '\\s*\\w*\\s+') : s;}
  function checkSimpleOR(s) { return /\bor\b/i.test(s) && /\(/.test(s) === false;}
  if (checkSimpleOR(bool)) {
    var x = new RegExp(bool.replace(/\s+OR\s+|\s*\|\s*/gi, '|').replace(/\//g, '\\/').replace(/"/g, '\\b').replace(/\s+/g, '.{0,2}').replace(/\s*\*\s*/g, '\\s*\\w*\\s+'), 'i');
    var xArr = [x];
    return xArr;
  } else {
    var orx = "\\(.+?\\)|(\\(\\w+\\s{0,1}OR\\s|\\w+\\s{0,1}OR\\s)+((\\w+\s)+?|(\\w+)\\)+)+?";
    var orMatch = bool ? bool.match(new RegExp(orx, 'g')) : [];
    var orArr = orMatch ? orMatch.map(function(b) {return rxReady(b.replace(/\s+OR\s+|\s*\|\s*/gi, '|'))}) : [];
    var noOrs = bool ? bool.replace(new RegExp(orx, 'g'), '').split(/\s+[AND\s+]+/i) : bool;
    var ands = noOrs ? noOrs.map(function(a) { return rxReady(a)}) : [];
    var xArr = ands.concat(orArr).filter(function(i){ return i != ''}).map(function(x){return new RegExp(x, 'i')});
    return xArr;
  }
}

function booleanSearch(bool,target){
  var arr = parseAsRegexArr(bool);
  return arr.every(function(x){
    return x.test(target);
  });
}

var repoNameSearch = (arr,str) => arr.filter(el=> el.owns).filter(el => el.owns.some(itm=> booleanSearch(str,itm.repo)));
var repoNameOrLangSearch = (arr,str) => arr.filter(el=> el.owns).filter(el => el.owns.some(itm=> booleanSearch(str,itm.lang) || booleanSearch(str,itm.repo)));

var forkNameSearch = (arr,str) => arr.filter(el=> el.forks).filter(el => el.forks.some(itm=> booleanSearch(str,itm.repo)));
var forkNameOrLangSearch = (arr,str) => arr.filter(el=> el.forks).filter(el => el.forks.some(itm=> booleanSearch(str,itm.lang) || booleanSearch(str,itm.repo)));

var langSearch = (arr,str) => arr.filter(el=> el.langs).filter(el => el.langs.some(itm=> booleanSearch(str,itm)));
var interestSearch = (arr,str) => arr.filter(el=> el.interest).filter(el => el.interest.some(itm=> booleanSearch(str,itm)));

var primaryLangSearch = (arr,str) => arr.filter(el=> el.primaryLang).filter(el => booleanSearch(str,el.primaryLang));

var bioSearch = (arr,str) => arr.filter(el=> el.bio).filter(el => booleanSearch(str,el.bio));

forkNameOrLangSearch(fileArray,'"R"')
