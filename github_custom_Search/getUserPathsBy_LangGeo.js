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

async function gitSearch(obj,p,ordr) {
  var res = await fetch(`https://github.com/search?o=${ordr}&p=${p}&q=location%3A${obj.geo}+language%3A${obj.lang}${obj.follower}&s=${obj.sort}${obj.repos}&type=Users`);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}

async function loopGitSearch(lang,geoName){
  var getTotalResults = (d) => cn(d,'flex-md-row flex-justify-between')[0] ? reg(/[\d,]+(?=\s+users)/.exec(cn(d,'flex-md-row flex-justify-between')[0].innerText),0).replace(/\D+/g,'') : 0;
  var getTotalPages = (s) => s ? Math.ceil(parseInt(s) / 10) : 0;
  var getPages2Loop = (s) => s > 100 ? 100 : s;

  var containArr = [];
  var search = {lang: lang, geo: geoName, sort: "repositories", follower: "", repos: ""};

  var doc = await gitSearch(search,1,'desc');

  var results = getTotalResults(doc);
  var totalPages = getTotalPages(results);

  async function loopAlternates(searchObj,ordr){
    var check = await gitSearch(search,1,'desc');
    var strRes = getTotalResults(check);
    var t_pages = getTotalPages(strRes);
    var loops = getPages2Loop(t_pages);
    console.log(t_pages);
    for(var i=1; i<=loops; i++){
      var doc2 = await gitSearch(searchObj,i,'desc');
      var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
      item2.forEach(el=> containArr.push(el));
      await delay(rando(1050)+1500);
      if(i == 25 || i == 50 || i == 75 || i == 100) await delay(rando(1050)+10000);
    }
    if(t_pages > 100){
      for(var i=1; i<=loops; i++){
        var doc2 = await gitSearch(searchObj,i,'asc');
        var item2 = Array.from(cn(doc2,'user-list-info')).map(el => reg(/(?<=github.com\/).+/.exec(tn(el,'a')[0].href),0));
        item2.forEach(el=> containArr.push(el));
        await delay(rando(1050)+1500);
      }
    }
  }

  if(totalPages){
    await loopAlternates(search,totalPages);
  }

  if(totalPages > 200){
    await delay(rando(150)+1500);
    await loopAlternates({lang: lang, geo: geoName, sort: "joined", follower: "", repos: ""});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "", repos: "+repos%3A>10"});
  }

  if(totalPages > 300){
    await delay(rando(150)+1500);
    await loopAlternates({lang: lang, geo: geoName, sort: "followers", follower: "", repos: ""});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: ""});
  }

  if(totalPages > 400){
    await delay(rando(150)+1500);
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "", repos: "+repos%3A>25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "", repos: "+repos%3A<25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A>10"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A<10"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A>10"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A<10"});
  }

  if(totalPages > 500){
    await delay(rando(150)+1500);
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A>25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A<25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A>25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A<25"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A>5"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<5", repos: "+repos%3A<5"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A>5"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A<5"});
  }

  if(totalPages > 600){
    await delay(rando(150)+1500);
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<10", repos: "+repos%3A>5"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<10", repos: "+repos%3A<5"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>5", repos: "+repos%3A>50"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A>10", repos: "+repos%3A<50"});
    await loopAlternates({lang: lang, geo: geoName, sort: "", follower: "+followers%3A<200", repos: "+repos%3A>50"});
  }
  var paths = unq(containArr);
  var pathObj = {lang: decodeURIComponent(lang.replace(/"/g,'')).replace(/\+/g, ' '), paths: paths};
  console.log(paths);
  if(containArr.length>0) downloadr(pathObj,lang+'_'+geoName.replace(/\+/g,'-')+'.json');
}

async function loopLangsByLocal(targetGeo){
  var targetlangs = ["ActionScript","HTML","Java","C","C%23","C%2B%2B","Clojure","CoffeeScript","CSS","Go","Haskell","JavaScript","Lua","MATLAB","Objective-C","Perl","PHP","Python","R","Ruby","Scala","Shell","Swift","TeX","\"Vim+script\"","\"1C+Enterprise\"","ABAP","ABNF","Ada","\"Adobe+Font+Metrics\"","Agda","\"AGS+Script\"","Alloy","\"Alpine+Abuild\"","\"Altium+Designer\"","AMPL","AngelScript","\"Ant+Build+System\"","ANTLR","ApacheConf","Apex","\"API+Blueprint\"","APL","\"Apollo+Guidance+Computer\"","AppleScript","Arc","AsciiDoc","ASN.1","ASP","AspectJ","Assembly","Asymptote","ATS","Augeas","AutoHotkey","AutoIt","Awk","Ballerina","Batchfile","Befunge","Bison","BitBake","Blade","BlitzBasic","BlitzMax","Bluespec","Boo","Brainfuck","Brightscript","C-ObjDump","\"C2hs+Haskell\"","\"Cabal+Config\"","\"Cap'n+Proto\"","CartoCSS","Ceylon","Chapel","Charity","ChucK","Cirru","Clarion","Clean","Click","CLIPS","\"Closure+Templates\"","\"Cloud+Firestore+Security+Rules\"","CMake","COBOL","ColdFusion","\"ColdFusion+CFC\"","COLLADA","\"Common+Lisp\"","\"Common+Workflow+Language\"","\"Component+Pascal\"","CoNLL-U","Cool","Coq","Cpp-ObjDump","Creole","Crystal","CSON","Csound","\"Csound+Document\"","\"Csound+Score\"","CSV","Cuda","CWeb","Cycript","Cython","D","D-ObjDump","\"Darcs+Patch\"","Dart","DataWeave","desktop","Dhall","Diff","\"DIGITAL+Command+Language\"","DM","\"DNS+Zone\"","Dockerfile","Dogescript","DTrace","Dylan","E","Eagle","Easybuild","EBNF","eC","\"Ecere+Projects\"","ECL","ECLiPSe","EditorConfig","\"Edje+Data+Collection\"","edn","Eiffel","EJS","Elixir","Elm","\"Emacs+Lisp\"","EmberScript","EML","EQ","Erlang","F%23","F*","Factor","Fancy","Fantom","\"FIGlet+Font\"","\"Filebench+WML\"","Filterscript","fish","FLUX","Formatted","Forth","Fortran","FreeMarker","Frege","G-code","\"Game+Maker+Language\"","GAMS","GAP","\"GCC+Machine+Description\"","GDB","GDScript","Genie","Genshi","\"Gentoo+Ebuild\"","\"Gentoo+Eclass\"","\"Gerber+Image\"","\"Gettext+Catalog\"","Gherkin","\"Git+Attributes\"","\"Git+Config\"","GLSL","Glyph","\"Glyph+Bitmap+Distribution+Format\"","GN","Gnuplot","Golo","Gosu","Grace","Gradle","\"Grammatical+Framework\"","\"Graph+Modeling+Language\"","GraphQL","\"Graphviz+(DOT)\"","Groovy","\"Groovy+Server+Pages\"","Hack","Haml","Handlebars","HAProxy","Harbour","Haxe","HCL","HiveQL","HLSL","HolyC","HTML%2BDjango","HTML%2BECR","HTML%2BEEX","HTML%2BERB","HTML%2BPHP","HTML%2BRazor","HTTP","HXML","Hy","HyPhy","IDL","Idris","\"Ignore+List\"","\"IGOR+Pro\"","\"Inform+7\"","INI","\"Inno+Setup\"","Io","Ioke","\"IRC+log\"","Isabelle","\"Isabelle+ROOT\"","J","Jasmin","\"Java+Properties\"","\"Java+Server+Pages\"","JavaScript%2BERB","JFlex","Jison","\"Jison+Lex\"","Jolie","JSON","\"JSON+with+Comments\"","JSON5","JSONiq","JSONLD","Jsonnet","JSX","Julia","\"Jupyter+Notebook\"","\"KiCad+Layout\"","\"KiCad+Legacy+Layout\"","\"KiCad+Schematic\"","Kit","Kotlin","KRL","LabVIEW","Lasso","Latte","Lean","Less","Lex","LFE","LilyPond","Limbo","\"Linker+Script\"","\"Linux+Kernel+Module\"","Liquid","\"Literate+Agda\"","\"Literate+CoffeeScript\"","\"Literate+Haskell\"","LiveScript","LLVM","Logos","Logtalk","LOLCODE","LookML","LoomScript","LSL","\"LTspice+Symbol\"","M","M4","M4Sugar","Makefile","Mako","Markdown","Marko","Mask","Mathematica","\"Maven+POM\"","Max","MAXScript","mcfunction","MediaWiki","Mercury","Meson","Metal","MiniD","Mirah","Modelica","Modula-2","Modula-3","\"Module+Management+System\"","Monkey","Moocode","MoonScript","\"Motorola+68K+Assembly\"","MQL4","MQL5","MTML","MUF","mupad","Myghty","nanorc","NCL","Nearley","Nemerle","nesC","NetLinx","NetLinx%2BERB","NetLogo","NewLisp","Nextflow","Nginx","Nim","Ninja","Nit","Nix","NL","NSIS","Nu","NumPy","ObjDump","Objective-C%2B%2B","Objective-J","ObjectScript","OCaml","Omgrofl","ooc","Opa","Opal","OpenCL","\"OpenEdge+ABL\"","\"OpenRC+runscript\"","OpenSCAD","\"OpenType+Feature+File\"","Org","Ox","Oxygene","Oz","P4","Pan","Papyrus","Parrot","\"Parrot+Assembly\"","\"Parrot+Internal+Representation\"","Pascal","Pawn","Pep8","\"Perl+6\"","Pic","Pickle","PicoLisp","PigLatin","Pike","PLpgSQL","PLSQL","Pod","\"Pod+6\"","PogoScript","Pony","PostCSS","PostScript","\"POV-Ray+SDL\"","PowerBuilder","PowerShell","Processing","Prolog","\"Propeller+Spin\"","\"Protocol+Buffer\"","\"Public+Key\"","Pug","Puppet","\"Pure+Data\"","PureBasic","PureScript","\"Python+console\"","\"Python+traceback\"","q","QMake","QML","Quake","Racket","Ragel","RAML","Rascal","\"Raw+token+data\"","RDoc","REALbasic","Reason","Rebol","Red","Redcode","\"Regular+Expression\"","Ren'Py","RenderScript","reStructuredText","REXX","RHTML","\"Rich+Text+Format\"","Ring","RMarkdown","RobotFramework","Roff","\"Roff+Manpage\"","Rouge","RPC","\"RPM+Spec\"","RUNOFF","Rust","Sage","SaltStack","SAS","Sass","Scaml","Scheme","Scilab","SCSS","sed","Self","ShaderLab","ShellSession","Shen","Slash","Slice","Slim","Smali","Smalltalk","Smarty","SMT","Solidity","SourcePawn","SPARQL","\"Spline+Font+Database\"","SQF","SQL","SQLPL","Squirrel","\"SRecode+Template\"","\"SSH+Config\"","Stan","\"Standard+ML\"","Stata","STON","Stylus","\"SubRip+Text\"","SugarSS","SuperCollider","Svelte","SVG","SystemVerilog","Tcl","Tcsh","Tea","Terra","Text","Textile","Thrift","\"TI+Program\"","TLA","TOML","TSQL","TSX","Turing","Turtle","Twig","TXL","\"Type+Language\"","TypeScript","\"Unified+Parallel+C\"","\"Unity3D+Asset\"","\"Unix+Assembly\"","Uno","UnrealScript","UrWeb","Vala","VCL","Verilog","VHDL","\"Visual+Basic\"","Volt","Vue","\"Wavefront+Material\"","\"Wavefront+Object\"","wdl","\"Web+Ontology+Language\"","WebAssembly","WebIDL","WebVTT","\"Windows+Registry+Entries\"","wisp","Wollok","\"World+of+Warcraft+Addon+Data\"","\"X+BitMap\"","\"X+Font+Directory+Index\"","\"X+PixMap\"","X10","xBase","XC","XCompose","XML","Xojo","XPages","XProc","XQuery","XS","XSLT","Xtend","Yacc","YAML","YANG","YARA","YASnippet","ZAP","Zeek","ZenScript","Zephir","Zig","ZIL","Zimpl"];
 for(var i=0; i<targetlangs.length; i++){
  await loopGitSearch(targetlangs[i],targetGeo);
  await delay(rando(550)+5500);
 }
}
loopLangsByLocal('Atlanta');
