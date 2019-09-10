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

var langOpts = ["ActionScript", "C", "C#", "C++", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "MATLAB", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "Vim script", "1C Enterprise", "ABAP", "ABNF", "Ada", "Adobe Font Metrics", "Agda", "AGS Script", "Alloy", "Alpine Abuild", "Altium Designer", "AMPL", "AngelScript", "Ant Build System", "ANTLR", "ApacheConf", "Apex", "API Blueprint", "APL", "Apollo Guidance Computer", "AppleScript", "Arc", "AsciiDoc", "ASN.1", "ASP", "AspectJ", "Assembly", "Asymptote", "ATS", "Augeas", "AutoHotkey", "AutoIt", "Awk", "Ballerina", "Batchfile", "Befunge", "BibTeX", "Bison", "BitBake", "Blade", "BlitzBasic", "BlitzMax", "Bluespec", "Boo", "Brainfuck", "Brightscript", "C-ObjDump", "C2hs Haskell", "Cabal Config", "Cap'n Proto", "CartoCSS", "Ceylon", "Chapel", "Charity", "ChucK", "Cirru", "Clarion", "Clean", "Click", "CLIPS", "Closure Templates", "Cloud Firestore Security Rules", "CMake", "COBOL", "ColdFusion", "ColdFusion CFC", "COLLADA", "Common Lisp", "Common Workflow Language", "Component Pascal", "CoNLL-U", "Cool", "Coq", "Cpp-ObjDump", "Creole", "Crystal", "CSON", "Csound", "Csound Document", "Csound Score", "CSV", "Cuda", "CWeb", "Cycript", "Cython", "D", "D-ObjDump", "Darcs Patch", "Dart", "DataWeave", "desktop", "Dhall", "Diff", "DIGITAL Command Language", "DM", "DNS Zone", "Dockerfile", "Dogescript", "DTrace", "Dylan", "E", "Eagle", "Easybuild", "EBNF", "eC", "Ecere Projects", "ECL", "ECLiPSe", "EditorConfig", "Edje Data Collection", "edn", "Eiffel", "EJS", "Elixir", "Elm", "Emacs Lisp", "EmberScript", "EML", "EQ", "Erlang", "F#", "F*", "Factor", "Fancy", "Fantom", "FIGlet Font", "Filebench WML", "Filterscript", "fish", "FLUX", "Formatted", "Forth", "Fortran", "FreeMarker", "Frege", "G-code", "Game Maker Language", "GAML", "GAMS", "GAP", "GCC Machine Description", "GDB", "GDScript", "Genie", "Genshi", "Gentoo Ebuild", "Gentoo Eclass", "Gerber Image", "Gettext Catalog", "Gherkin", "Git Attributes", "Git Config", "GLSL", "Glyph", "Glyph Bitmap Distribution Format", "GN", "Gnuplot", "Golo", "Gosu", "Grace", "Gradle", "Grammatical Framework", "Graph Modeling Language", "GraphQL", "Graphviz (DOT)", "Groovy", "Groovy Server Pages", "Hack", "Haml", "Handlebars", "HAProxy", "Harbour", "Haxe", "HCL", "HiveQL", "HLSL", "HolyC", "HTML+Django", "HTML+ECR", "HTML+EEX", "HTML+ERB", "HTML+PHP", "HTML+Razor", "HTTP", "HXML", "Hy", "HyPhy", "IDL", "Idris", "Ignore List", "IGOR Pro", "Inform 7", "INI", "Inno Setup", "Io", "Ioke", "IRC log", "Isabelle", "Isabelle ROOT", "J", "Jasmin", "Java Properties", "Java Server Pages", "JavaScript+ERB", "JFlex", "Jison", "Jison Lex", "Jolie", "JSON", "JSON with Comments", "JSON5", "JSONiq", "JSONLD", "Jsonnet", "JSX", "Julia", "Jupyter Notebook", "KiCad Layout", "KiCad Legacy Layout", "KiCad Schematic", "Kit", "Kotlin", "KRL", "LabVIEW", "Lasso", "Latte", "Lean", "Less", "Lex", "LFE", "LilyPond", "Limbo", "Linker Script", "Linux Kernel Module", "Liquid", "Literate Agda", "Literate CoffeeScript", "Literate Haskell", "LiveScript", "LLVM", "Logos", "Logtalk", "LOLCODE", "LookML", "LoomScript", "LSL", "LTspice Symbol", "M", "M4", "M4Sugar", "Makefile", "Mako", "Markdown", "Marko", "Mask", "Mathematica", "Maven POM", "Max", "MAXScript", "mcfunction", "MediaWiki", "Mercury", "Meson", "Metal", "MiniD", "Mirah", "MLIR", "Modelica", "Modula-2", "Modula-3", "Module Management System", "Monkey", "Moocode", "MoonScript", "Motorola 68K Assembly", "MQL4", "MQL5", "MTML", "MUF", "mupad", "Myghty", "nanorc", "NCL", "Nearley", "Nemerle", "nesC", "NetLinx", "NetLinx+ERB", "NetLogo", "NewLisp", "Nextflow", "Nginx", "Nim", "Ninja", "Nit", "Nix", "NL", "NSIS", "Nu", "NumPy", "ObjDump", "Objective-C++", "Objective-J", "ObjectScript", "OCaml", "Omgrofl", "ooc", "Opa", "Opal", "OpenCL", "OpenEdge ABL", "OpenRC runscript", "OpenSCAD", "OpenStep Property List", "OpenType Feature File", "Org", "Ox", "Oxygene", "Oz", "P4", "Pan", "Papyrus", "Parrot", "Parrot Assembly", "Parrot Internal Representation", "Pascal", "Pawn", "Pep8", "Perl 6", "Pic", "Pickle", "PicoLisp", "PigLatin", "Pike", "PLpgSQL", "PLSQL", "Pod", "Pod 6", "PogoScript", "Pony", "PostCSS", "PostScript", "POV-Ray SDL", "PowerBuilder", "PowerShell", "Processing", "Prolog", "Propeller Spin", "Protocol Buffer", "Public Key", "Pug", "Puppet", "Pure Data", "PureBasic", "PureScript", "Python console", "Python traceback", "q", "QMake", "QML", "Quake", "Racket", "Ragel", "RAML", "Rascal", "Raw token data", "RDoc", "REALbasic", "Reason", "Rebol", "Red", "Redcode", "Regular Expression", "Ren'Py", "RenderScript", "reStructuredText", "REXX", "RHTML", "Rich Text Format", "Ring", "RMarkdown", "RobotFramework", "Roff", "Roff Manpage", "Rouge", "RPC", "RPM Spec", "RUNOFF", "Rust", "Sage", "SaltStack", "SAS", "Sass", "Scaml", "Scheme", "Scilab", "SCSS", "sed", "Self", "ShaderLab", "ShellSession", "Shen", "Slash", "Slice", "Slim", "Smali", "Smalltalk", "Smarty", "SmPL", "SMT", "Solidity", "SourcePawn", "SPARQL", "Spline Font Database", "SQF", "SQL", "SQLPL", "Squirrel", "SRecode Template", "SSH Config", "Stan", "Standard ML", "Stata", "STON", "Stylus", "SubRip Text", "SugarSS", "SuperCollider", "Svelte", "SVG", "SystemVerilog", "Tcl", "Tcsh", "Tea", "Terra", "Texinfo", "Text", "Textile", "Thrift", "TI Program", "TLA", "TOML", "TSQL", "TSX", "Turing", "Turtle", "Twig", "TXL", "Type Language", "TypeScript", "Unified Parallel C", "Unity3D Asset", "Unix Assembly", "Uno", "UnrealScript", "UrWeb", "V", "Vala", "VCL", "Verilog", "VHDL", "Visual Basic", "Volt", "Vue", "Wavefront Material", "Wavefront Object", "wdl", "Web Ontology Language", "WebAssembly", "WebIDL", "WebVTT", "Windows Registry Entries", "wisp", "Wollok", "World of Warcraft Addon Data", "X BitMap", "X Font Directory Index", "X PixMap", "X10", "xBase", "XC", "XCompose", "XML", "XML Property List", "Xojo", "XPages", "XProc", "XQuery", "XS", "XSLT", "Xtend", "Yacc", "YAML", "YANG", "YARA", "YASnippet", "ZAP", "Zeek", "ZenScript", "Zephir", "Zig", "ZIL", "Zimpl"];

function createSearchBox() {
  if(gi(document,'githubber_search')) gi(document,'githubber_search').outerHTML = '';

  var inputLabels = ['Name', 'Location', '# Followers', '# of Repos'];
  var inputPlaceholders = ['Evan You', 'California', '>20', '10..100'];

  var box = ele('div');
  attr(box, 'style', `position: fixed; top: 5%; left: 5%; width: 33%; border: 1px solid #004471; border-radius: 0.3em; padding: 16px; background: #fff;`);
  attr(box, 'id', 'githubber_search');
  document.body.appendChild(box);

  var head = ele('div');
  attr(head,'style',`width: 100%; height: 40px; cursor: move;`);

  for (var i = 0; i < inputLabels.length; i++) {
    var cont = ele('div');
    attr(cont, 'style', 'width: 100%;');
    box.appendChild(cont);

    var label = ele('div');
    attr(cont, 'style', 'width: 100%;');
    label.innerText = inputLabels[i];
    cont.appendChild(label);

    var input = ele('input');
    attr(input, 'style', `width: 100%; border: 1px solid #004471; border-radius: 0.3em; padding: 3px;`);
    attr(input, 'placeholder', inputPlaceholders[i]);
    cont.appendChild(input);
  }

  var selc = ele('div');
  attr(selc, 'style', ``);
  box.appendChild(selc);

  var lab = ele('div');
  lab.innerText = 'Language';
  selc.appendChild(lab);

  var selector = ele('select');
  attr(selector, 'style', `width: 100%; border: 1px solid #004471; border-radius: 0.3em; padding: 3px;`);
  selc.appendChild(selector);

  for (var i = 0; i<langOpts.length; i++) {
    var opt = ele('option');
    attr(opt, 'value', langOpts[i]);
    attr(opt, 'style', `width: 100%; border-bottom: 1px solid #004471; cursor: pointer;`);
    selector.appendChild(opt);
    opt.innerText = langOpts[i];
  }

}

createSearchBox()
