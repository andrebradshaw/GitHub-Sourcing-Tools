var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);
var reChar = (s) => s.match(/&#.+?;/g) && s.match(/&#.+?;/g).length > 0 ? s.match(/&#.+?;/g).map(el => [el, String.fromCharCode(/d+/.exec(el)[0])]).map(m => s = s.replace(new RegExp(m[0], 'i'), m[1])).pop() : s;

function parseAsRegexArr(bool) {
  if (typeof bool == 'object') {
    return Array.isArray(bool) ? bool : [bool];
  } else {
    var rxReady = (s) => s ? s.replace(/"/g, '\\b').trim().replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '.{0,2}').replace(/\//g, '\\/').replace(/\+/g, '\\+').replace(/\s*\*\s*/g, '\\s*\\w*\\s+') : s;
    var checkSimpleOR = (s)=> /\bor\b/i.test(s) && /\(/.test(s) === false && /\b\s+and\s\b/.test(s) === false;
    var checkAndOrSimple = (s) => [/\bor\b/i,/\band\b/i].every(el=> el.test(s) && /\(/.test(s) === false);

    if(checkAndOrSimple(bool)){
      return bool.replace(/\s+OR\s+|\s*\|\s*/gi, '|').replace(/\//g, '\\/').replace(/"/g, '\\b').replace(/\s+/g, '.{0,2}').replace(/\s*\*\s*/g, '\\s*\\w*\\s+').split(/\band\b/).map(el=> new RegExp(el.trim(), 'i'));

    } else if (checkSimpleOR(bool)) {
      return [new RegExp(bool.replace(/\s+OR\s+|\s*\|\s*/gi, '|').replace(/\//g, '\\/').replace(/"/g, '\\b').replace(/\s+/g, '.{0,2}').replace(/\s*\*\s*/g, '\\s*\\w*\\s+'), 'i')];

    } else {
      var orx = "\\(.+?\\)|(\\(\\w+\\s{0,1}OR\\s|\\w+\\s{0,1}OR\\s)+((\\w+\s)+?|(\\w+)\\)+)+?";
      var orMatch = bool ? bool.match(new RegExp(orx, 'g')) : [];
      var orArr = orMatch ? orMatch.map(b=> rxReady(b.replace(/\s+OR\s+|\s*\|\s*/gi, '|')) ) : [];
      var noOrs = bool ? bool.replace(new RegExp(orx, 'g'), '').split(/\s+[AND\s+]+/i) : bool;
      var ands = noOrs ? noOrs.map(a=> rxReady(a)) : [];
      var xArr = ands.concat(orArr).filter(i=> i != '').map(x=> new RegExp(x, 'i') );
      return xArr;
    }
  }
}
var booleanSearch = (bool, target) => parseAsRegexArr(bool).every(x=> x.test(target));

var langOpts = ["ActionScript", "C", "C#", "C++", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "MATLAB", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "Vim script", "1C Enterprise", "ABAP", "ABNF", "Ada", "Adobe Font Metrics", "Agda", "AGS Script", "Alloy", "Alpine Abuild", "Altium Designer", "AMPL", "AngelScript", "Ant Build System", "ANTLR", "ApacheConf", "Apex", "API Blueprint", "APL", "Apollo Guidance Computer", "AppleScript", "Arc", "AsciiDoc", "ASN.1", "ASP", "AspectJ", "Assembly", "Asymptote", "ATS", "Augeas", "AutoHotkey", "AutoIt", "Awk", "Ballerina", "Batchfile", "Befunge", "BibTeX", "Bison", "BitBake", "Blade", "BlitzBasic", "BlitzMax", "Bluespec", "Boo", "Brainfuck", "Brightscript", "C-ObjDump", "C2hs Haskell", "Cabal Config", "Cap'n Proto", "CartoCSS", "Ceylon", "Chapel", "Charity", "ChucK", "Cirru", "Clarion", "Clean", "Click", "CLIPS", "Closure Templates", "Cloud Firestore Security Rules", "CMake", "COBOL", "ColdFusion", "ColdFusion CFC", "COLLADA", "Common Lisp", "Common Workflow Language", "Component Pascal", "CoNLL-U", "Cool", "Coq", "Cpp-ObjDump", "Creole", "Crystal", "CSON", "Csound", "Csound Document", "Csound Score", "CSV", "Cuda", "CWeb", "Cycript", "Cython", "D", "D-ObjDump", "Darcs Patch", "Dart", "DataWeave", "desktop", "Dhall", "Diff", "DIGITAL Command Language", "DM", "DNS Zone", "Dockerfile", "Dogescript", "DTrace", "Dylan", "E", "Eagle", "Easybuild", "EBNF", "eC", "Ecere Projects", "ECL", "ECLiPSe", "EditorConfig", "Edje Data Collection", "edn", "Eiffel", "EJS", "Elixir", "Elm", "Emacs Lisp", "EmberScript", "EML", "EQ", "Erlang", "F#", "F*", "Factor", "Fancy", "Fantom", "FIGlet Font", "Filebench WML", "Filterscript", "fish", "FLUX", "Formatted", "Forth", "Fortran", "FreeMarker", "Frege", "G-code", "Game Maker Language", "GAML", "GAMS", "GAP", "GCC Machine Description", "GDB", "GDScript", "Genie", "Genshi", "Gentoo Ebuild", "Gentoo Eclass", "Gerber Image", "Gettext Catalog", "Gherkin", "Git Attributes", "Git Config", "GLSL", "Glyph", "Glyph Bitmap Distribution Format", "GN", "Gnuplot", "Golo", "Gosu", "Grace", "Gradle", "Grammatical Framework", "Graph Modeling Language", "GraphQL", "Graphviz (DOT)", "Groovy", "Groovy Server Pages", "Hack", "Haml", "Handlebars", "HAProxy", "Harbour", "Haxe", "HCL", "HiveQL", "HLSL", "HolyC", "HTML+Django", "HTML+ECR", "HTML+EEX", "HTML+ERB", "HTML+PHP", "HTML+Razor", "HTTP", "HXML", "Hy", "HyPhy", "IDL", "Idris", "Ignore List", "IGOR Pro", "Inform 7", "INI", "Inno Setup", "Io", "Ioke", "IRC log", "Isabelle", "Isabelle ROOT", "J", "Jasmin", "Java Properties", "Java Server Pages", "JavaScript+ERB", "JFlex", "Jison", "Jison Lex", "Jolie", "JSON", "JSON with Comments", "JSON5", "JSONiq", "JSONLD", "Jsonnet", "JSX", "Julia", "Jupyter Notebook", "KiCad Layout", "KiCad Legacy Layout", "KiCad Schematic", "Kit", "Kotlin", "KRL", "LabVIEW", "Lasso", "Latte", "Lean", "Less", "Lex", "LFE", "LilyPond", "Limbo", "Linker Script", "Linux Kernel Module", "Liquid", "Literate Agda", "Literate CoffeeScript", "Literate Haskell", "LiveScript", "LLVM", "Logos", "Logtalk", "LOLCODE", "LookML", "LoomScript", "LSL", "LTspice Symbol", "M", "M4", "M4Sugar", "Makefile", "Mako", "Markdown", "Marko", "Mask", "Mathematica", "Maven POM", "Max", "MAXScript", "mcfunction", "MediaWiki", "Mercury", "Meson", "Metal", "MiniD", "Mirah", "MLIR", "Modelica", "Modula-2", "Modula-3", "Module Management System", "Monkey", "Moocode", "MoonScript", "Motorola 68K Assembly", "MQL4", "MQL5", "MTML", "MUF", "mupad", "Myghty", "nanorc", "NCL", "Nearley", "Nemerle", "nesC", "NetLinx", "NetLinx+ERB", "NetLogo", "NewLisp", "Nextflow", "Nginx", "Nim", "Ninja", "Nit", "Nix", "NL", "NSIS", "Nu", "NumPy", "ObjDump", "Objective-C++", "Objective-J", "ObjectScript", "OCaml", "Omgrofl", "ooc", "Opa", "Opal", "OpenCL", "OpenEdge ABL", "OpenRC runscript", "OpenSCAD", "OpenStep Property List", "OpenType Feature File", "Org", "Ox", "Oxygene", "Oz", "P4", "Pan", "Papyrus", "Parrot", "Parrot Assembly", "Parrot Internal Representation", "Pascal", "Pawn", "Pep8", "Perl 6", "Pic", "Pickle", "PicoLisp", "PigLatin", "Pike", "PLpgSQL", "PLSQL", "Pod", "Pod 6", "PogoScript", "Pony", "PostCSS", "PostScript", "POV-Ray SDL", "PowerBuilder", "PowerShell", "Processing", "Prolog", "Propeller Spin", "Protocol Buffer", "Public Key", "Pug", "Puppet", "Pure Data", "PureBasic", "PureScript", "Python console", "Python traceback", "q", "QMake", "QML", "Quake", "Racket", "Ragel", "RAML", "Rascal", "Raw token data", "RDoc", "REALbasic", "Reason", "Rebol", "Red", "Redcode", "Regular Expression", "Ren'Py", "RenderScript", "reStructuredText", "REXX", "RHTML", "Rich Text Format", "Ring", "RMarkdown", "RobotFramework", "Roff", "Roff Manpage", "Rouge", "RPC", "RPM Spec", "RUNOFF", "Rust", "Sage", "SaltStack", "SAS", "Sass", "Scaml", "Scheme", "Scilab", "SCSS", "sed", "Self", "ShaderLab", "ShellSession", "Shen", "Slash", "Slice", "Slim", "Smali", "Smalltalk", "Smarty", "SmPL", "SMT", "Solidity", "SourcePawn", "SPARQL", "Spline Font Database", "SQF", "SQL", "SQLPL", "Squirrel", "SRecode Template", "SSH Config", "Stan", "Standard ML", "Stata", "STON", "Stylus", "SubRip Text", "SugarSS", "SuperCollider", "Svelte", "SVG", "SystemVerilog", "Tcl", "Tcsh", "Tea", "Terra", "Texinfo", "Text", "Textile", "Thrift", "TI Program", "TLA", "TOML", "TSQL", "TSX", "Turing", "Turtle", "Twig", "TXL", "Type Language", "TypeScript", "Unified Parallel C", "Unity3D Asset", "Unix Assembly", "Uno", "UnrealScript", "UrWeb", "V", "Vala", "VCL", "Verilog", "VHDL", "Visual Basic", "Volt", "Vue", "Wavefront Material", "Wavefront Object", "wdl", "Web Ontology Language", "WebAssembly", "WebIDL", "WebVTT", "Windows Registry Entries", "wisp", "Wollok", "World of Warcraft Addon Data", "X BitMap", "X Font Directory Index", "X PixMap", "X10", "xBase", "XC", "XCompose", "XML", "XML Property List", "Xojo", "XPages", "XProc", "XQuery", "XS", "XSLT", "Xtend", "Yacc", "YAML", "YANG", "YARA", "YASnippet", "ZAP", "Zeek", "ZenScript", "Zephir", "Zig", "ZIL", "Zimpl"];

function dragElement() {
  var el = this.parentElement;
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(this.id)) document.getElementById(this.id).onmousedown = dragMouseDown;
  else this.onmousedown = dragMouseDown;

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
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
    el.style.opacity = "0.85";
    el.style.transition = "opacity 700ms";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    el.style.opacity = "1";
  }
}

var svgs = {
	close: `<svg x="0px" y="0px" viewBox="0 0 100 100"><g style="transform: scale(0.85, 0.85)" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2, 2)" stroke="#e21212" stroke-width="8"><path d="M47.806834,19.6743435 L47.806834,77.2743435" transform="translate(49, 50) rotate(225) translate(-49, -50) "/><path d="M76.6237986,48.48 L19.0237986,48.48" transform="translate(49, 50) rotate(225) translate(-49, -50) "/></g></g></svg>`,
};

function closeView() {
  this.parentElement.parentElement.outerHTML = '';
  if(gi(document,'langOptions_container')) gi(document,'langOptions_container').outerHTML = '';
}

function aninCloseBtn() {
  var l1 = tn(this, 'path')[0];
  var l2 = tn(this, 'path')[1];
  l1.style.transform = "translate(49px, 50px) rotate(45deg) translate(-49px, -50px)";
  l1.style.transition = "all 333ms";
  l2.style.transform = "translate(49px, 50px) rotate(135deg) translate(-49px, -50px)";
  l2.style.transition = "all 133ms";
}

function anoutCloseBtn() {
  var l1 = tn(this, 'path')[0];
  var l2 = tn(this, 'path')[1];
  l1.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
  l1.style.transition = "all 333ms";
  l2.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
  l2.style.transition = "all 133ms";
}

function createSearchBox() {
  if(gi(document,'githubber_search')) gi(document,'githubber_search').outerHTML = '';

  var inputLabels = ['Full Name', 'Location', '# Followers', '# of Repos'];
  var inputPlaceholders = ['Evan You', 'California', '>20', '10..100'];

  var main = ele('div');
  attr(main, 'style', `position: fixed; top: 5%; left: 5%; width: 33%; z-index: 12212`);
  attr(main, 'id', 'githubber_search');
  document.body.appendChild(main);

  var head = ele('div');
  attr(head,'style',`background: #24292e; width: 100%; height: 40px; border: 1.6px solid #1c1c1c; border-top-right-radius: 0.3em; border-top-left-radius: 0.3em; cursor: move;`);
  main.appendChild(head);
  head.onmouseover = dragElement;

    var cls = ele('div');
    head.appendChild(cls);
    attr(cls, 'style', 'grid-area: 1 / 3; width: 30px; height: 30px; cursor: pointer; transform: scale(1.2, 1.2); float: right;');
    cls.innerHTML = svgs.close;
    cls.onmouseenter = aninCloseBtn;
    cls.onmouseleave = anoutCloseBtn;
    cls.onclick = closeView;

  var box = ele('div');
  attr(box, 'style', `border: 1.6px solid #004471;  border-bottom-left-radius: 0.3em; border-bottom-right-radius: 0.3em; padding: 16px; background: #fff;`);
  attr(box, 'id', 'githubber_search');
  main.appendChild(box);

  for (var i = 0; i < inputLabels.length; i++) {
    var cont = ele('div');
    attr(cont, 'style', 'width: 100%;');
    box.appendChild(cont);

    var label = ele('div');
    attr(cont, 'style', 'width: 100%;');
    label.innerText = inputLabels[i];
    cont.appendChild(label);

    var input = ele('input');
    attr(input, 'id', inputLabels[i].replace(/^.*?(?=[A-Z])/, '').replace(/\s+/g,'').toLowerCase() + '__');
    attr(input, 'style', `width: 100%; border: 1px solid #004471; border-radius: 0.3em; padding: 3px;`);
    attr(input, 'placeholder', inputPlaceholders[i]);
    cont.appendChild(input);
    input.onkeyup = keyupRun;
  }

  var selc = ele('div');
  attr(selc, 'style', ``);
  box.appendChild(selc);

  var lab = ele('div');
  lab.innerText = 'Language';
  selc.appendChild(lab);

  var langSearch = ele('input');
  attr(langSearch,'id','language__');
  attr(langSearch, 'placeholder', 'JavaScript'); 
  attr(langSearch, 'style', `width: 100%; border: 1px solid #004471; border-radius: 0.3em; padding: 3px;`);
  selc.appendChild(langSearch);
  langSearch.onkeydown = listenForArrow;
  langSearch.onkeyup = listenForLang;


  var empt = ele('div');
  attr(empt, 'style', `width: 100%; height: 20px; border: 1px solid #fff; border-radius: 0.3em; padding: 3px;`);
  box.appendChild(empt);

  var search = ele('div');
  attr(search, 'style', `width: 100%; border: 1px solid #004471; border-radius: 0.3em; padding: 3px; text-align: center; color: #004471; cursor: pointer;`);
  attr(search,'id','githubber_search_btn');
  box.appendChild(search);
  search.innerText = 'Search';
  search.onmouseup = runSearch;
  search.onmouseenter = sBtnIn;
  search.onmouseleave = sBtnOut;
  function sBtnIn(){this.style.background = '#defff2';};
  function sBtnOut(){this.style.background = '#fff';};
}


function listenForArrow(e){
  if(e.key == "ArrowDown"){
   gi(document,'language__').value = cn(document,'lang_opts')[0].innerText;
  if(gi(document,'langOptions_container')) gi(document,'langOptions_container').outerHTML = '';
  }
}

function listenForLang(e){
  if(gi(document,'langOptions_container')) gi(document,'langOptions_container').outerHTML = '';
  var langs = langOpts.filter(el=> booleanSearch(this.value.trim(),el));  
  var parent = ele('div');
  var rect = this.getBoundingClientRect();
  attr(parent,'style', `position: fixed; top: ${rect.bottom}px; left: ${rect.left}px; background: #fff; border: 1px solid #004471; border-bottom-left-radius: 0.2em; border-bottom-right-radius: 0.2em; padding: 9px; z-index: 13212;`);
  attr(parent,'id', `langOptions_container`);
  document.body.appendChild(parent);
  createOptions(parent,langs);
  if(e.key == 'Enter') {
    runSearch();
    if(gi(document,'langOptions_container')) gi(document,'langOptions_container').outerHTML = '';
  }
  if(this.value.trim().length<1) gi(document,'langOptions_container').outerHTML = '';
}

function createOptions(parent,langs){
  for (var i = 0; i<langs.length; i++) {
    var opt = ele('div');
    attr(opt, 'class', 'lang_opts');
    attr(opt, 'data', langs[i]);
    attr(opt, 'style', `width: 100%; border-bottom: 1px solid #004471; cursor: pointer; padding: 4px; z-index: 13212;`);
    parent.appendChild(opt);
    opt.innerText = langs[i];
    opt.onmouseenter = mousein;
    opt.onmouseleave = mouseout;
    opt.onmousedown = mousedown;
    opt.onmouseup = mouseup;
  }
}

function mousein(){
  this.style.background = '#cbf2e3';
  this.style.transition = 'all 200ms';
}
function mouseout(){
  this.style.background = '#fff';
  this.style.transition = 'all 200ms';
}
function mousedown(){
  this.style.background = '#b1f0d8';
  this.style.transition = 'all 200ms';
}
function mouseup(){
  gi(document,'language__').value = this.innerText.trim();
  this.style.background = '#cbf2e3';
  this.style.transition = 'all 200ms';  
  this.parentElement.outerHTML = '';  
}
function keyupRun(e){
  if(e.key == "Enter") {runSearch()}
}

function runSearch(){
  var nm = gi(document,'fullname__');
  var lc = gi(document,'location__');
  var fl = gi(document,'followers__');
  var rp = gi(document,'repos__');
  var lg = gi(document,'language__');  
  var name = nm && nm.value ? `fullname%3A${nm.value.trim()}` : '';
  var geo = lc && lc.value && lc.value.split(/,\s*/).length > 1 
? ('+location%3A')+(lc.value.split(/,\s*/).reduce((a,b)=> a+`+location%3A`+b)) : lc && lc.value && /\b\s+\bOR\b\s+\b/.test(lc.value) 
? (('+location%3A')+(lc.value.split(/\b\s+\bOR\b\s+\b/).reduce((a,b)=> a+`+location%3A`+b))).replace(/(?<=%3A)(?=[\w\s]+)/, '"').replace(/(?<=%3A"[\w\s]+)(?=\+)/, '"') : lc && lc.value && /\b\s+\b/.test(lc.value) 
? 'location%3A%22'+lc.value+'%22' : lc && lc.value 
? 'location%3A'+lc.value : '';

  var folw = fl && fl.value ? `+followers%3A${fl.value}` : '';
  var repo = rp && rp.value ? `+repos%3A${rp.value}` : '';
  var lang = lg && lg.value ? `+language%3A${lg.value}` : '';
  var out = (`https://github.com/search?q=`+name+geo+repo+lang+folw+`&type=Users&ref=advsearch`).replace(/\=\+/, '=');
  if(gi(document,'langOptions_container')) gi(document,'langOptions_container').outerHTML = '';
  window.open(out);
}
createSearchBox()
