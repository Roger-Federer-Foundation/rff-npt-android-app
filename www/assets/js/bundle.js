// Map NodeList to Array for forEach polyfill
if (typeof NodeList.prototype.forEach !== "function") {
   NodeList.prototype.forEach = Array.prototype.forEach;
}

// classList
(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {
  this.el = el;
  // The className needs to be trimmed and split on whitespace
  // to retrieve a list of classes.
  var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    push.call(this, classes[i]);
  }
};

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    this.el.className = this.toString();
  },
  contains: function(token) {
    return this.el.className.indexOf(token) != -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    if (!this.contains(token)) return;
    for (var i = 0; i < this.length; i++) {
      if (this[i] == token) break;
    }
    splice.call(this, i, 1);
    this.el.className = this.toString();
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();

// Polyfill find, which we use in mcqs.js,
// and which doesn't work in IE and other old browsers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

// closest()
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Load locales.yml into a locales array.

// Convert locales.yml into a JSON string.
// Note that some keys use hyphens, which are invalid JS. So to use them
// as variables, use square brackets and quotes, e.g. search['search-placeholder'].
var locales = {"en":{"iso-name":"English","local-name":"English","project":{"organisation":"","url":"","email":"","name":"","description":"","image":"","credit":"Developed by [Penreach](https://penreach.co.za/) with support from the [Roger Federer Foundation](https://www.rogerfedererfoundation.org/). Produced by [Electric Book Works](https://electricbookworks.com)."},"nav":{"home":"Home","menu":"Menu","next":"Next","previous":"Previous","back":"&larr;"},"input":{"submit":"Submit","send":"Send","show":"Show","hide":"Hide"},"search":{"search-title":"Search","placeholder":"Search","placeholder-searching":"Searching...","search-results":"Search results","results-for-singular":"result found for","results-for-plural":"results found for","results-for-none":"No results found for","jump-to-first":"Jump to first result ↓","notice":""},"contact":{"subject-line":"Enquiry","placeholder":{"name":"Name","email":"Email address","message":"Message"}},"questions":{"check-answers-button":"Check my answers","feedback-correct":"Correct!","feedback-incorrect":"Incorrect","feedback-unfinished":"You haven't selected all the correct answers.","mark-correct":"&#10003;","mark-incorrect":"&#10007;"},"quiz":{"total":"Total"},"cross-references":{"pre-page-number":"(page ","post-page-number":")"},"account":{"login":"Log in","my-account":"My account"},"annotator":{"show-sidebar-tooltip-title":"Open annotations","show-sidebar-tooltip-description":"Tap here to show the annotations sidebar. Select text to highlight and create notes on this page.","show-annotated-text-tooltip-title":"Highlight annotations","show-annotated-text-tooltip-description":"Tap here to show or hide the annotation highlights on this page."},"notifications":{"session":{"testing-version":""}}},"fr":{"iso-name":"French","local-name":"Français","project":{"organisation":"","url":"","email":"","name":"","description":"Livres créés avec le flux de travail Electric Book","image":"","credit":"Construit avec [l'Electric Book](http://electricbook.works)"},"nav":{"home":"Accueil","menu":"Table des matières","next":"Suivant","previous":"Précédent","back":"&larr;"},"input":{"submit":"Soumettre","send":"Envoyer","show":"Montrer","hide":"Cacher"},"search":{"search-title":"Recherche","placeholder":"Recherche","placeholder-searching":"Recherche...","search-results":"Résultats de la recherche","results-for-singular":"résultat trouvé pour","results-for-plural":"résultats trouvés pour","results-for-none":"Aucun résultat trouvé pour","jump-to-first":"Aller au premier résultat ↓","notice":""},"contact":{"subject-line":"Enquête","placeholder":{"name":"Nom","email":"L’adresse e-mail","message":"Message"}},"questions":{"check-answers-button":"Vérifier mes réponses","feedback-correct":"Correct!","feedback-incorrect":"Incorrect","feedback-unfinished":"Vous n'avez pas sélectionné toutes les bonnes réponses.","mark-correct":"&#10003;","mark-incorrect":"&#10007;"},"quiz":{"total":"Total"},"cross-references":{"pre-page-number":"(page ","post-page-number":")"},"account":{"login":"Connectez-vous","my-account":"Mon compte"},"annotator":{"show-sidebar-tooltip-title":"Ouvrir l'outil d'annotation","show-sidebar-tooltip-description":"Cliquer ici pour afficher la barre latérale des annotations. Vous pouvez sélectionner le texte à surligner et à annoter sur cette page.","show-annotated-text-tooltip-title":"Surligner les annotations","show-annotated-text-tooltip-description":"Cliquer ici pour afficher ou masquer les annotations surlignées sur cette page."}}};

// Or get the language from a URL parameter
// https://stackoverflow.com/a/901144/1781075
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get the page language
if (getParameterByName('lang')) {
    var pageLanguage = getParameterByName('lang');
    var pageLanguageByURLParameter = true;
    localiseText();
} else {
    var pageLanguage = document.documentElement.lang;
    // If epub, this is xml:lang
    if (!pageLanguage) {
        var pageLanguage = document.documentElement.getAttribute('xml:lang');
    }
    localiseText();
};

// Various content localisations

function localiseText() {

    // Localise HTML title element on home page
    var titleElement = document.querySelector('title');
    if (titleElement
        && document.querySelector('body.home') !== undefined
        && locales[pageLanguage].project.name
        && locales[pageLanguage].project.name !== '') {
        titleElement.innerHTML = locales[pageLanguage].project.name;
    }

    // Localise masthead
    var mastheadProjectName = document.querySelector('.masthead .masthead-series-name a');
    if (mastheadProjectName &&
        locales[pageLanguage].project.name &&
        locales[pageLanguage].project.name !== '') {
        mastheadProjectName.innerHTML = locales[pageLanguage].project.name;
    }

    // Localise search
    var searchPageHeading = document.querySelector('.search-page #content h1:first-of-type');
    if (searchPageHeading) {
        searchPageHeading.innerHTML = locales[pageLanguage].search['search-title'];
    }

    // Localise search form
    var searchLanguageToLocalise = document.querySelector('#search-language');
    if (searchLanguageToLocalise) {
        searchLanguageToLocalise.setAttribute('value', pageLanguage);
    };

    // Localise search-box placeholder
    var searchInputBox = document.querySelector('.search input.search-box');
    if (searchInputBox) {
        var searchInputBoxPlaceholder = document.querySelector('.search input.search-box').placeholder;
        if (searchInputBoxPlaceholder) {
            searchInputBoxPlaceholder = locales[pageLanguage].search['search-placeholder'];
        }
    }

    // Localise searching... notice
    var searchProgressPlaceholder = document.querySelector('.search-progress');
    if (searchProgressPlaceholder) {
        searchProgressPlaceholder.innerHTML = locales[pageLanguage].search['placeholder-searching'];
    };

    // Localise Google CSE search snippets
    var googleCSESearchBox = document.querySelector('.search input.search-box');
    if (googleCSESearchBox) {
        googleCSESearchBox.placeholder = locales[pageLanguage].search.placeholder;
    };

    // Add any notices set in locales as search.notice
    if (searchPageHeading &&
        locales[pageLanguage].search.notice &&
        locales[pageLanguage].search.notice !== '') {
        var searchNotice = document.createElement('div');
        searchNotice.classList.add('search-page-notice');
        searchNotice.innerHTML = '<p>' + locales[pageLanguage].search.notice + '</p>';
        searchPageHeading.insertAdjacentElement('afterend', searchNotice);
    };

    // We cannot localise the nav/TOC, since the root search page
    // always uses the parent-language. So we replace the nav
    // on the search page with a back button instead.
    // In case we have a back button (`$nav-bar-back-button-hide; true` in scss)
    // hide that one.
    var searchNavButtonToReplace = document.querySelector('.search-page [href="#nav"]');
    var searchNavDivToReplace = document.querySelector('.search-page #nav');
    var navBackButton = document.querySelector('.nav-back-button');
    if (searchNavButtonToReplace && navBackButton) {
        if (document.referrer != "" || window.history.length > 0) {
            navBackButton.remove();
            searchNavButtonToReplace.innerHTML = locales[pageLanguage].nav.back;
            searchNavButtonToReplace.addEventListener('click', function(ev) {
                ev.preventDefault();
                console.log('Going back...');
                window.history.back();
            });
        };
    };
    if (searchNavDivToReplace) {
        searchNavDivToReplace.innerHTML = '';
    }

    // If no results with GSE, translate 'No results' phrase
    window.addEventListener("load", function (event) {
        var noResultsGSE = document.querySelector('.gs-no-results-result .gs-snippet');
        if (noResultsGSE) {
            noResultsGSE.innerHTML = locales[pageLanguage].search['results-for-none'] + ' ‘' + searchTerm + '’';
        }
    });

    // localise questions
    var questionButtons = document.querySelectorAll('.question .check-answer-button');
    function replaceText(button) {
        button.innerHTML= locales[pageLanguage].questions['check-answers-button'];
    }
    if (questionButtons) {
        questionButtons.forEach(replaceText);
    }
}

// Give a parent elements a class name based on its child
// ------------------------------------------------------
//
// Useful for targeting an element because it contains
// a given child element. Currently not possible with CSS,
// because CSS can't target an element's parent node.
//
// E.g. before, we cannot target this h2 just because
// it contains a .place:
//
// <h2>Rebels in Snow
//     <span class="place">(Hoth)</span>
// </h2>
//
// but, after this script runs, we get:
//
// <h2 class="place-parent">Rebels in Snow
//     <span class="place">(Hoth)</span>
// </h2>
//
// Set the child element's class at Options below.


// Options: use querySelectorAll strings, comma-separated
var ebMarkParentsOfTheseChildren = 'p > img:only-child';

// Promote
function ebMarkParent(child, prefix) {
    'use strict';

    // If the child has a classlist, copy those class names
    // to the parent with a '-parent' suffix. This creates elegant classnames.
    // Otherwise, add a class to the parent made from the selector we've used.
    if (child.classList.length > 0) {
        var i;
        for (i = 0; i < child.classList.length; i += 1) {
            child.parentNode.classList.add(child.classList[i] + '-parent');
        }
    } else {
        child.parentNode.classList.add(prefix + '-parent');
    }
}

// Find the child elements we're after and, if we find any,
// loop through them to mark their parents.
function ebMarkParents(queryStrings) {
    'use strict';

    // Create an array of query strings and loop through it, so that
    // we can treat each query string separately. This lets us use each query
    // string as a fallback prefix for a parent-element class name.
    var queryArray = queryStrings.split(",");
    var i, query, children, prefix, j;
    for (i = 0; i < queryArray.length; i += 1) {
        query = queryArray[i].trim();
        children = document.querySelectorAll(query);
        prefix = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '');

        if (children.length > 0) {
            for (j = 0; j < children.length; j += 1) {
                ebMarkParent(children[j], prefix);
            }
        }
    }

}

ebMarkParents(ebMarkParentsOfTheseChildren);






    
    /*!***************************************************
 * mark.js v8.4.0
 * https://github.com/julmot/mark.js
 * Copyright (c) 2014–2016, Julian Motz
 * Released under the MIT license https://git.io/vwTVl
 *****************************************************/
"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var _extends=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},_createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol?"symbol":typeof a};!function(a,b,c){"function"==typeof define&&define.amd?define([],function(){return a(b,c)}):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports?module.exports=a(b,c):a(b,c)}(function(a,b){var c=function(){function c(a){_classCallCheck(this,c),this.ctx=a}return _createClass(c,[{key:"log",value:function a(b){var c=arguments.length<=1||void 0===arguments[1]?"debug":arguments[1],a=this.opt.log;this.opt.debug&&"object"===("undefined"==typeof a?"undefined":_typeof(a))&&"function"==typeof a[c]&&a[c]("mark.js: "+b)}},{key:"escapeStr",value:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}},{key:"createRegExp",value:function(a){return a=this.escapeStr(a),Object.keys(this.opt.synonyms).length&&(a=this.createSynonymsRegExp(a)),this.opt.ignoreJoiners&&(a=this.setupIgnoreJoinersRegExp(a)),this.opt.diacritics&&(a=this.createDiacriticsRegExp(a)),a=this.createMergedBlanksRegExp(a),this.opt.ignoreJoiners&&(a=this.createIgnoreJoinersRegExp(a)),a=this.createAccuracyRegExp(a)}},{key:"createSynonymsRegExp",value:function(a){var b=this.opt.synonyms,c=this.opt.caseSensitive?"":"i";for(var d in b)if(b.hasOwnProperty(d)){var e=b[d],f=this.escapeStr(d),g=this.escapeStr(e);a=a.replace(new RegExp("("+f+"|"+g+")","gm"+c),"("+f+"|"+g+")")}return a}},{key:"setupIgnoreJoinersRegExp",value:function(a){return a.replace(/[^(|)]/g,function(a,b,c){var d=c.charAt(b+1);return/[(|)]/.test(d)||""===d?a:a+"\0"})}},{key:"createIgnoreJoinersRegExp",value:function(a){return a.split("\0").join("[\\u00ad|\\u200b|\\u200c|\\u200d]?")}},{key:"createDiacriticsRegExp",value:function(a){var b=this.opt.caseSensitive?"":"i",c=this.opt.caseSensitive?["aàáâãäåāąă","AÀÁÂÃÄÅĀĄĂ","cçćč","CÇĆČ","dđď","DĐĎ","eèéêëěēę","EÈÉÊËĚĒĘ","iìíîïī","IÌÍÎÏĪ","lł","LŁ","nñňń","NÑŇŃ","oòóôõöøō","OÒÓÔÕÖØŌ","rř","RŘ","sšśș","SŠŚȘ","tťț","TŤȚ","uùúûüůū","UÙÚÛÜŮŪ","yÿý","YŸÝ","zžżź","ZŽŻŹ"]:["aÀÁÂÃÄÅàáâãäåĀāąĄăĂ","cÇçćĆčČ","dđĐďĎ","eÈÉÊËèéêëěĚĒēęĘ","iÌÍÎÏìíîïĪī","lłŁ","nÑñňŇńŃ","oÒÓÔÕÖØòóôõöøŌō","rřŘ","sŠšśŚșȘ","tťŤțȚ","uÙÚÛÜùúûüůŮŪū","yŸÿýÝ","zŽžżŻźŹ"],d=[];return a.split("").forEach(function(e){c.every(function(c){if(c.indexOf(e)!==-1){if(d.indexOf(c)>-1)return!1;a=a.replace(new RegExp("["+c+"]","gm"+b),"["+c+"]"),d.push(c)}return!0})}),a}},{key:"createMergedBlanksRegExp",value:function(a){return a.replace(/[\s]+/gim,"[\\s]*")}},{key:"createAccuracyRegExp",value:function(a){var b=this,c=this.opt.accuracy,d="string"==typeof c?c:c.value,e="string"==typeof c?[]:c.limiters,f="";switch(e.forEach(function(a){f+="|"+b.escapeStr(a)}),d){case"partially":default:return"()("+a+")";case"complementary":return"()([^\\s"+f+"]*"+a+"[^\\s"+f+"]*)";case"exactly":return"(^|\\s"+f+")("+a+")(?=$|\\s"+f+")"}}},{key:"getSeparatedKeywords",value:function(a){var b=this,c=[];return a.forEach(function(a){b.opt.separateWordSearch?a.split(" ").forEach(function(a){a.trim()&&c.indexOf(a)===-1&&c.push(a)}):a.trim()&&c.indexOf(a)===-1&&c.push(a)}),{keywords:c.sort(function(a,b){return b.length-a.length}),length:c.length}}},{key:"getTextNodes",value:function(a){var b=this,c="",d=[];this.iterator.forEachNode(NodeFilter.SHOW_TEXT,function(a){d.push({start:c.length,end:(c+=a.textContent).length,node:a})},function(a){return b.matchesExclude(a.parentNode,!0)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},function(){a({value:c,nodes:d})})}},{key:"matchesExclude",value:function(a,b){var c=this.opt.exclude.concat(["script","style","title","head","html"]);return b&&(c=c.concat(["*[data-markjs='true']"])),d.matches(a,c)}},{key:"wrapRangeInTextNode",value:function(a,c,d){var e=this.opt.element?this.opt.element:"mark",f=a.splitText(c),g=f.splitText(d-c),h=b.createElement(e);return h.setAttribute("data-markjs","true"),this.opt.className&&h.setAttribute("class",this.opt.className),h.textContent=f.textContent,f.parentNode.replaceChild(h,f),g}},{key:"wrapRangeInMappedTextNode",value:function(a,b,c,d,e){var f=this;a.nodes.every(function(g,h){var i=a.nodes[h+1];if("undefined"==typeof i||i.start>b){var j=function(){var i=b-g.start,j=(c>g.end?g.end:c)-g.start;if(d(g.node)){g.node=f.wrapRangeInTextNode(g.node,i,j);var k=a.value.substr(0,g.start),l=a.value.substr(j+g.start);if(a.value=k+l,a.nodes.forEach(function(b,c){c>=h&&(a.nodes[c].start>0&&c!==h&&(a.nodes[c].start-=j),a.nodes[c].end-=j)}),c-=j,e(g.node.previousSibling,g.start),!(c>g.end))return{v:!1};b=g.end}}();if("object"===("undefined"==typeof j?"undefined":_typeof(j)))return j.v}return!0})}},{key:"wrapMatches",value:function(a,b,c,d,e){var f=this,g=0===b?0:b+1;this.getTextNodes(function(b){b.nodes.forEach(function(b){b=b.node;for(var e=void 0;null!==(e=a.exec(b.textContent))&&""!==e[g];)if(c(e[g],b)){var h=e.index;if(0!==g)for(var i=1;i<g;i++)h+=e[i].length;b=f.wrapRangeInTextNode(b,h,h+e[g].length),d(b.previousSibling),a.lastIndex=0}}),e()})}},{key:"wrapMatchesAcrossElements",value:function(a,b,c,d,e){var f=this,g=0===b?0:b+1;this.getTextNodes(function(b){for(var h=void 0;null!==(h=a.exec(b.value))&&""!==h[g];){var i=h.index;if(0!==g)for(var j=1;j<g;j++)i+=h[j].length;var k=i+h[g].length;f.wrapRangeInMappedTextNode(b,i,k,function(a){return c(h[g],a)},function(b,c){a.lastIndex=c,d(b)})}e()})}},{key:"unwrapMatches",value:function(a){for(var c=a.parentNode,d=b.createDocumentFragment();a.firstChild;)d.appendChild(a.removeChild(a.firstChild));c.replaceChild(d,a),c.normalize()}},{key:"markRegExp",value:function(a,b){var c=this;this.opt=b,this.log('Searching with expression "'+a+'"');var d=0,e="wrapMatches",f=function(a){d++,c.opt.each(a)};this.opt.acrossElements&&(e="wrapMatchesAcrossElements"),this[e](a,this.opt.ignoreGroups,function(a,b){return c.opt.filter(b,a,d)},f,function(){0===d&&c.opt.noMatch(a),c.opt.done(d)})}},{key:"mark",value:function(a,b){var c=this;this.opt=b;var d=0,e="wrapMatches",f=this.getSeparatedKeywords("string"==typeof a?[a]:a),g=f.keywords,h=f.length,i=this.opt.caseSensitive?"":"i",j=function a(b){var f=new RegExp(c.createRegExp(b),"gm"+i),j=0;c.log('Searching with expression "'+f+'"'),c[e](f,1,function(a,e){return c.opt.filter(e,b,d,j)},function(a){j++,d++,c.opt.each(a)},function(){0===j&&c.opt.noMatch(b),g[h-1]===b?c.opt.done(d):a(g[g.indexOf(b)+1])})};this.opt.acrossElements&&(e="wrapMatchesAcrossElements"),0===h?this.opt.done(d):j(g[0])}},{key:"unmark",value:function(a){var b=this;this.opt=a;var c=this.opt.element?this.opt.element:"*";c+="[data-markjs]",this.opt.className&&(c+="."+this.opt.className),this.log('Removal selector "'+c+'"'),this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT,function(a){b.unwrapMatches(a)},function(a){var e=d.matches(a,c),f=b.matchesExclude(a,!1);return!e||f?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},this.opt.done)}},{key:"opt",set:function(b){this._opt=_extends({},{element:"",className:"",exclude:[],iframes:!1,separateWordSearch:!0,diacritics:!0,synonyms:{},accuracy:"partially",acrossElements:!1,caseSensitive:!1,ignoreJoiners:!1,ignoreGroups:0,each:function(){},noMatch:function(){},filter:function(){return!0},done:function(){},debug:!1,log:a.console},b)},get:function(){return this._opt}},{key:"iterator",get:function(){return this._iterator||(this._iterator=new d(this.ctx,this.opt.iframes,this.opt.exclude)),this._iterator}}]),c}(),d=function(){function a(b){var c=arguments.length<=1||void 0===arguments[1]||arguments[1],d=arguments.length<=2||void 0===arguments[2]?[]:arguments[2];_classCallCheck(this,a),this.ctx=b,this.iframes=c,this.exclude=d}return _createClass(a,[{key:"getContexts",value:function(){var a=void 0,b=[];return a="undefined"!=typeof this.ctx&&this.ctx?NodeList.prototype.isPrototypeOf(this.ctx)?Array.prototype.slice.call(this.ctx):Array.isArray(this.ctx)?this.ctx:[this.ctx]:[],a.forEach(function(a){var c=b.filter(function(b){return b.contains(a)}).length>0;b.indexOf(a)!==-1||c||b.push(a)}),b}},{key:"getIframeContents",value:function(a,b){var c=arguments.length<=2||void 0===arguments[2]?function(){}:arguments[2],d=void 0;try{var e=a.contentWindow;if(d=e.document,!e||!d)throw new Error("iframe inaccessible")}catch(a){c()}d&&b(d)}},{key:"onIframeReady",value:function(a,b,c){var d=this;try{!function(){var e=a.contentWindow,f="about:blank",g="complete",h=function(){var b=a.getAttribute("src").trim(),c=e.location.href;return c===f&&b!==f&&b},i=function(){var e=function e(){try{h()||(a.removeEventListener("load",e),d.getIframeContents(a,b,c))}catch(a){c()}};a.addEventListener("load",e)};e.document.readyState===g?h()?i():d.getIframeContents(a,b,c):i()}()}catch(a){c()}}},{key:"waitForIframes",value:function(a,b){var c=this,d=0;this.forEachIframe(a,function(){return!0},function(a){d++,c.waitForIframes(a.querySelector("html"),function(){--d||b()})},function(a){a||b()})}},{key:"forEachIframe",value:function(b,c,d){var e=this,f=arguments.length<=3||void 0===arguments[3]?function(){}:arguments[3],g=b.querySelectorAll("iframe"),h=g.length,i=0;g=Array.prototype.slice.call(g);var j=function(){--h<=0&&f(i)};h||j(),g.forEach(function(b){a.matches(b,e.exclude)?j():e.onIframeReady(b,function(a){c(b)&&(i++,d(a)),j()},j)})}},{key:"createIterator",value:function(a,c,d){return b.createNodeIterator(a,c,d,!1)}},{key:"createInstanceOnIframe",value:function(b){return new a(b.querySelector("html"),this.iframes)}},{key:"compareNodeIframe",value:function(a,b,c){var d=a.compareDocumentPosition(c),e=Node.DOCUMENT_POSITION_PRECEDING;if(d&e){if(null===b)return!0;var f=b.compareDocumentPosition(c),g=Node.DOCUMENT_POSITION_FOLLOWING;if(f&g)return!0}return!1}},{key:"getIteratorNode",value:function(a){var b=a.previousNode(),c=void 0;return c=null===b?a.nextNode():a.nextNode()&&a.nextNode(),{prevNode:b,node:c}}},{key:"checkIframeFilter",value:function(a,b,c,d){var e=!1,f=!1;return d.forEach(function(a,b){a.val===c&&(e=b,f=a.handled)}),this.compareNodeIframe(a,b,c)?(e!==!1||f?e===!1||f||(d[e].handled=!0):d.push({val:c,handled:!0}),!0):(e===!1&&d.push({val:c,handled:!1}),!1)}},{key:"handleOpenIframes",value:function(a,b,c,d){var e=this;a.forEach(function(a){a.handled||e.getIframeContents(a.val,function(a){e.createInstanceOnIframe(a).forEachNode(b,c,d)})})}},{key:"iterateThroughNodes",value:function(a,b,c,d,e){for(var f=this,g=this.createIterator(b,a,d),h=[],i=void 0,j=void 0,k=function(){var a=f.getIteratorNode(g);return j=a.prevNode,i=a.node};k();)this.iframes&&this.forEachIframe(b,function(a){return f.checkIframeFilter(i,j,a,h)},function(b){f.createInstanceOnIframe(b).forEachNode(a,c,d)}),c(i);this.iframes&&this.handleOpenIframes(h,a,c,d),e()}},{key:"forEachNode",value:function(a,b,c){var d=this,e=arguments.length<=3||void 0===arguments[3]?function(){}:arguments[3],f=this.getContexts(),g=f.length;g||e(),f.forEach(function(f){var h=function(){d.iterateThroughNodes(a,f,b,c,function(){--g<=0&&e()})};d.iframes?d.waitForIframes(f,h):h()})}}],[{key:"matches",value:function(a,b){var c="string"==typeof b?[b]:b,d=a.matches||a.matchesSelector||a.msMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector;if(d){var e=!1;return c.every(function(b){return!d.call(a,b)||(e=!0,!1)}),e}return!1}}]),a}();return a.Mark=function(a){var b=this,d=new c(a);return this.mark=function(a,c){return d.mark(a,c),b},this.markRegExp=function(a,c){return d.markRegExp(a,c),b},this.unmark=function(a){return d.unmark(a),b},this},a.Mark},window,document);
    // Get some elements
var searchTerm = getQueryVariable('query'),
    searchBox = document.querySelectorAll('.search-box');

// Ask mark.js to mark all the search terms
var markInstance = new Mark(document.querySelector("#wrapper"));
if (searchTerm) {
  markInstance.unmark().mark(searchTerm);
}

// Fill the search boxes with the current search term
function fillSearchBox() {
  if (searchTerm && searchBox) {
    // show the just-searched-term
    for (var j = 0; j < searchBox.length; ++j) {
      searchBox[j].setAttribute("value", searchTerm);
    }
  }
}

// Check whether this is a search-page
function isSearchPage() {
  var isSearchPage = document.body.classList.contains('search-page');
  if (isSearchPage) {
    return true;
  } else {
    return false;
  }
};

// get query search term from GET query string
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
    }
  }
}

// Show a summary of search terms and jump-to-first link on destination page
function jumpToSearchResult() {

  // add a summary before the first section
  var searchTerms = document.querySelectorAll('[data-markjs]');
  var numberOfSearchTerms = searchTerms.length;
  if(!!numberOfSearchTerms) {

    console.log('Page contains searched terms');

    // make the summary paragraph
    var searchResultsSummary = document.createElement('div');
    searchResultsSummary.classList.add('search-results-summary')
    if (numberOfSearchTerms == 1) {
      searchResultsSummary.innerHTML = numberOfSearchTerms + ' ' + locales[pageLanguage].search['results-for-singular'] + ' ' + '"<mark>' + searchTerm + '</mark>".';
    } else {
      searchResultsSummary.innerHTML = numberOfSearchTerms + ' ' + locales[pageLanguage].search['results-for-plural'] + ' ' + '"<mark>' + searchTerm + '</mark>".';
    }

    // add it after the first heading
    var mainHeading = document.querySelector('#content h1, #content h2, #content h3, #content h4, #content h5, #content h6');
    var contentDiv =  document.querySelector('#content');

    if (mainHeading) {
      contentDiv.insertBefore(searchResultsSummary, mainHeading.nextSibling);
    } else {
      contentDiv.insertBefore(searchResultsSummary, contentDiv.firstChild);
    }

    // add a link to the first result
    searchTerms[0].id = 'first-search-result';
    searchResultsSummary.innerHTML += ' <a href="#first-search-result"> ' + locales[pageLanguage].search['jump-to-first'] + '</a>.'

    return;
  }
}

if (isSearchPage() == false) {
  jumpToSearchResult();
} else {
  fillSearchBox();
};

    /*jslint browser */
/*globals window */

function ebNav() {
    'use strict';

    // let Opera Mini use the footer-anchor pattern
    if (navigator.userAgent.indexOf('Opera Mini') === -1) {

        // let newer browsers use js-powered menu
        if (document.querySelector !== "undefined" &&
                window.addEventListener) {

            // set js nav class
            document.documentElement.classList.add('js-nav');

            // set up the variables
            var menuLink = document.querySelector('[href="#nav"]');
            var menu = document.querySelector('#nav');

            // hide the menu until we click the link
            menu.classList.add("visuallyhidden");

            // add a close button
            var closeButton = '<button data-toggle data-nav-close>';
            closeButton += '<span class="visuallyhidden">Close menu</span>';
            closeButton += '</button>';
            menu.insertAdjacentHTML('afterBegin', closeButton);

            // hide the children and add the button for toggling
            var subMenus = document
                .querySelectorAll('#nav .has-children, #nav .has-children');
            var showChildrenButton = '<button data-toggle data-toggle-nav>';
            showChildrenButton += '<span class="visuallyhidden">Toggle</span>';
            showChildrenButton += '</button>';
            var i;
            for (i = 0; i < subMenus.length; i += 1) {
                subMenus[i].querySelector('ol, ul').classList.add('visuallyhidden');
                subMenus[i].querySelector('a, .docs-list-title')
                    .insertAdjacentHTML('afterend', showChildrenButton);
            }

            // Mark parents of active children active too
            var activeChildren = menu.querySelectorAll('li.active');
            var j, equallyActiveParent;
            for (j = 0; j < activeChildren.length; j += 1) {
                equallyActiveParent = activeChildren[j].closest('li:not(.active)');
                if (equallyActiveParent && equallyActiveParent !== 'undefined') {
                    equallyActiveParent.classList.add('active');
                }
            }

            // show the menu when we click the link
            menuLink.addEventListener("click", function (ev) {
                ev.preventDefault();
                menu.classList.toggle("visuallyhidden");
                document.documentElement.classList.toggle('js-nav-open');
            }, true);

            var ebHideMenu = function () {
                menu.classList.add("visuallyhidden");
                document.documentElement.classList.remove('js-nav-open');
            };

            // listen for clicks inside the menu
            menu.addEventListener("click", function (ev) {
                var clickedElement = ev.target || ev.srcElement;

                // hide the menu when we click the button
                if (clickedElement.hasAttribute("data-nav-close")) {
                    ev.preventDefault();
                    ebHideMenu();
                    return;
                }

                // show the children when we click a .has-children
                if (clickedElement.hasAttribute("data-toggle-nav")) {
                    ev.preventDefault();
                    clickedElement.classList.toggle('show-children');
                    clickedElement.nextElementSibling.classList.toggle('visuallyhidden');
                    return;
                }

                // if it's an anchor with an href (an in-page link)
                if (clickedElement.tagName === "A" && clickedElement.getAttribute('href')) {
                    ebHideMenu();
                    return;
                }

                // if it's an anchor without an href (a nav-only link)
                if (clickedElement.tagName === "A") {
                    clickedElement.nextElementSibling.classList.toggle('show-children');
                    clickedElement.nextElementSibling.nextElementSibling.classList.toggle('visuallyhidden');
                    return;
                }
            });

            // This enables a back button, e.g. for where we don't have a
            // browser or hardware back button, and we have Jekyll add one.
            // This button is hidden in scss with `$nav-bar-back-button-hide: true;`.
            // If the user has navigated (i.e. there is a document referrer),
            // listen for clicks on our back button and go back when clicked.
            // We check history.length > 2 because new tab plus landing page
            // can constitute 2 entries in the history (varies by browser).
            var navBackButton;
            if (document.referrer !== "" || window.history.length > 2) {
                navBackButton = document.querySelector('a.nav-back-button');
                if (navBackButton) {
                    navBackButton.addEventListener('click', function (ev) {
                        ev.preventDefault();
                        console.log('Going back...');
                        window.history.back();
                    });
                }
            } else {
                navBackButton = document.querySelector('a.nav-back-button');
                if (navBackButton) {
                    navBackButton.parentNode.removeChild(navBackButton);
                }
            }
        }
    }
}

ebNav();

    /* jslint browser */
/*globals window */

function ebVideoInit() {
    'use strict';
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector &&
            !!Array.prototype.forEach &&
            document.body.classList &&
            document.addEventListener &&
            document.querySelectorAll('.video');
}

var ebVideoHosts = {
    youtube: 'https://www.youtube.com/embed/',
    vimeo: 'https://player.vimeo.com/video/'
};

function ebGetVideoHost(videoElement) {
    'use strict';
    var videoHost;
    var classes = videoElement.classList;

    classes.forEach(function (currentClass) {
        if (ebVideoHosts.hasOwnProperty(currentClass)) {
            videoHost = currentClass;
        }
    });

    return videoHost;
}

function ebVideoSubtitles(videoElement) {
    'use strict';
    var subtitles = videoElement.getAttribute('data-video-subtitles');
    if (subtitles === 'true') {
        subtitles = 1;
        return subtitles;
    }
}

function ebVideoLanguage(videoElement) {
    'use strict';
    var language = videoElement.getAttribute('data-video-language');
    return language;
}

function ebVideoMakeIframe(host, videoId, videoLanguage, videoSubtitles) {
    'use strict';
    var hostURL = ebVideoHosts[host];

    var parametersString = '?autoplay=1';
    if (videoLanguage) {
        if (host === 'youtube') {
            parametersString += '&cc_lang_pref=' + videoLanguage;
        }
    }
    if (videoSubtitles) {
        if (host === 'youtube') {
            parametersString += '&cc_load_policy=' + videoSubtitles;
        }
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId + parametersString);

    return iframe;
}

function ebVideoShow() {
    'use strict';

    // early exit for unsupported browsers
    if (!ebVideoInit()) {
        console.log('Video JS not supported in this browser.');
        return;
    }

    // get all the videos
    var videos = document.querySelectorAll('.video');

    videos.forEach(function (currentVideo) {
        // make the iframe
        var videoHost = ebGetVideoHost(currentVideo);
        var videoId = currentVideo.id;
        var videoLanguage = ebVideoLanguage(currentVideo);
        var videoSubtitles = ebVideoSubtitles(currentVideo);
        var videoWrapper = currentVideo.querySelector('.video-wrapper');
        var iframe = ebVideoMakeIframe(videoHost, videoId, videoLanguage, videoSubtitles);

        // console.log('currentVideo: ' + currentVideo);
        // console.log('videoHost: ' + videoHost);
        // console.log('currentVideo ID: ' + videoId);

        currentVideo.addEventListener("click", function (ev) {
            videoWrapper.classList.add('contains-iframe');
            ev.preventDefault();
            // replace the link with the generated iframe
            videoWrapper.innerHTML = '';
            videoWrapper.appendChild(iframe);
        });
    });
}

ebVideoShow();

    /*jslint*/
/*globals window, locales, pageLanguage*/

// -----------------------------
// Options
// 1. If you're pining scores to a Wordpress database,
//    enter the name of the cookie it leaves here.
var wordpressCookieName = "mywpcookie";
// -----------------------------

function ebMCQsInit() {
    'use strict';
    // check for browser support of the features we use
    // and presence of mcqs
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector &&
            !!Array.prototype.forEach &&
            window.addEventListener &&
            document.querySelectorAll('.mcq');
}

function ebMCQsFindNumberOfCorrectAnswers(questionCode) {
    'use strict';
    // not digits
    var digitsRegex = /\D/;

    // apply the regex
    var matchedDigitsRegex = questionCode.match(digitsRegex);

    // grab the index of the match
    var numberOfCorrectAnswers = matchedDigitsRegex.index;

    return numberOfCorrectAnswers;
}

function ebMCQsPositionOfCorrectAnswer(trimmedQuestionCode) {
    'use strict';
    // vowels * numberOfCorrectAnswers, then consonants * numberOfCorrectAnswers, repeated numberOfCorrectAnswers times
    // vowel regex
    var vowelRegex = /[aeiou]*/;

    // apply the regex
    var matchedVowelRegex = trimmedQuestionCode.match(vowelRegex);

    // get the length of the matched thing
    var positionOfCorrectAnswer = matchedVowelRegex[0].length;

    return positionOfCorrectAnswer;
}

function ebMCQsDobfuscateQuestionCode(questionCode) {
    'use strict';
    // find the first batch of numbers in the string
    var numberOfCorrectAnswers = ebMCQsFindNumberOfCorrectAnswers(questionCode);

    // trim the string
    var questionCodeLength = questionCode.length;
    var trimmedQuestionCode = questionCode.substr(numberOfCorrectAnswers, questionCodeLength);

    // initialise our array
    var correctAnswers = [];

    // loop for the right length: numberOfCorrectAnswers long
    var i, positionOfCorrectAnswer;
    for (i = 0; i < numberOfCorrectAnswers; i += 1) {
        positionOfCorrectAnswer = ebMCQsPositionOfCorrectAnswer(trimmedQuestionCode);
        correctAnswers.push(positionOfCorrectAnswer);

        // trim the bit we've used out of the string
        trimmedQuestionCode = trimmedQuestionCode.substr(positionOfCorrectAnswer * 2, trimmedQuestionCode.length);
    }
    return correctAnswers;
}

function ebMCQsGetCorrectAnswers(question) {
    'use strict';

    // get the correct answers
    var questionCode = question.getAttribute('data-question-code');
    var correctAnswers = ebMCQsDobfuscateQuestionCode(questionCode);

    // set the default correctAnswersObj
    var correctAnswersObj = {};

    // get all the feedbacks for this questions
    var feedbacks = question.querySelectorAll('.mcq-feedback li');

    // set it all false for now
    feedbacks.forEach(function (feedback, index) {
        correctAnswersObj[index + 1] = false;
    });

    // update correctAnswersObj from the correctAnswers array
    correctAnswers.forEach(function (correctAnswer) {
        correctAnswersObj[correctAnswer] = true;
    });

    return correctAnswersObj;
}

function ebMCQsMakeOptionCheckboxes(question) {
    'use strict';
    // get all the options for this question
    var options = question.querySelectorAll('.mcq-options li');

    // loop over options
    options.forEach(function (option, index) {
        // make the checkbox
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-index', index);

        // take the string version of checkbox and add to the option li
        option.innerHTML = '<label>' + checkbox.outerHTML + option.innerHTML + '<\label>';
    });
}

function ebMCQsAddButton(question) {
    'use strict';
    // make the button
    var button = document.createElement('button');
    button.innerHTML = locales[pageLanguage].questions['check-answers-button'];
    button.classList.add('check-answer-button');

    // now add it to question, after the options
    var options = question.querySelector('.mcq-options, .question-options');
    options.insertAdjacentElement('afterend', button);
}


function ebMCQsGetAllSelected(mcqsToCheck) {
    'use strict';

    // set the default selectedOptions
    var selectedOptions = {};

    // set it all false for now
    var allTheCheckboxes = mcqsToCheck.querySelectorAll('[type="checkbox"]');
    allTheCheckboxes.forEach(function (selectedCheckbox, index) {
        selectedOptions[index + 1] = false;
    });

    // update for the selected ones
    var selectedCheckboxes = mcqsToCheck.querySelectorAll('[type="checkbox"]:checked');
    selectedCheckboxes.forEach(function (selectedCheckbox) {
        var dataIndex = parseFloat(selectedCheckbox.getAttribute('data-index'));
        selectedOptions[dataIndex + 1] = true;
    });

    return selectedOptions;
}

function ebMCQsHideAllFeedback(mcqsToCheck) {
    'use strict';
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function (feedback) {
        // reset the styles
        feedback.classList.remove('mcq-feedback-show');
    });
}

function ebMCQsShowSelectedOptions(mcqsToCheck, selectedOptions) {
    'use strict';
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function (feedback, index) {
        // if it's been selected, show it
        if (selectedOptions[index + 1]) {
            feedback.classList.add('mcq-feedback-show');
        }

    });
}

function ebMCQsShowSelectedIncorrectOptions(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs) {
    'use strict';
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function (feedback, index) {
        // if it's been selected, and it's incorrect, show it
        if (selectedOptions[index + 1] &&
                selectedOptions[index + 1] !== correctAnswersForThisMCQs[index + 1]) {
            feedback.classList.add('mcq-feedback-show');
        }

    });
}

function ebMCQsMarkSelectedOptions() {
    'use strict';
    // get all the options
    var questionOptions = document.querySelectorAll('.mcq-options li');

    // loop over them
    questionOptions.forEach(function (questionOption) {
        // listen for clicks on the label and add/remove .selected to the li
        questionOption.addEventListener('click', function () {
            if (this.querySelector('[type="checkbox"]:checked')) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
}

function ebMCQsGetAllCorrectAnswers() {
    'use strict';
    // initialise answer store
    var ebMCQsCorrectAnswersForPage = {};

    // get all the questions
    var questions = document.querySelectorAll('.mcq');

    // loop over questions
    questions.forEach(function (question) {
        // get the correct answers
        var correctAnswersObj = ebMCQsGetCorrectAnswers(question);

        // get the ID, then put the answer set into the store
        var dataQuestion = question.getAttribute('data-question');
        ebMCQsCorrectAnswersForPage[dataQuestion] = correctAnswersObj;
    });

    return ebMCQsCorrectAnswersForPage;
}

function ebMCQsExactlyRight(correctAnswersForThisMCQs, selectedOptions) {
    'use strict';
    // compare each selectedOption with the correctAnswer
    // if one is wrong, exit with false
    var optionNumber;
    for (optionNumber in selectedOptions) {
        if (selectedOptions[optionNumber] !== correctAnswersForThisMCQs[optionNumber]) {
            return false;
        }
    }

    // if we haven't been kicked out yet, it must be exactly right
    return true;
}

function ebMCQsNotAllTheCorrectAnswers(correctAnswersForThisMCQs, selectedOptions) {
    'use strict';
    var numberOfCorrectAnswers = 0;
    var numberOfSelectedCorrectAnswers = 0;
    var numberOfSelectedIncorrectAnswers = 0;

    // loop through the correct answers
    var key;
    for (key in correctAnswersForThisMCQs) {
        // count correct answers
        if (correctAnswersForThisMCQs[key]) {
            numberOfCorrectAnswers += 1;
        }

        // count selected correct answers
        if (correctAnswersForThisMCQs[key] && selectedOptions[key]) {
            numberOfSelectedCorrectAnswers += 1;
        }

        // count selected incorrect answers
        if (!correctAnswersForThisMCQs[key] && selectedOptions[key]) {
            numberOfSelectedIncorrectAnswers += 1;
        }
    }

    // if we haven't selected all the correct answers
    // and we haven't selected any incorrect answers
    if (numberOfSelectedCorrectAnswers < numberOfCorrectAnswers && numberOfSelectedIncorrectAnswers === 0) {
        return true;
    }

    return false;
}

// get the WordPress ID from a cookie, or return false if we don't have one
function ebMCQsWordPressUserId() {
    'use strict';

    var cookieName = wordpressCookieName;

    // get the cookie, split it into bits
    var cookie = document.cookie.split('; ');

    var WordPressUserIdCookie = cookie.find(function (el) {
        // if it starts with our wordpressCookieName in options above, it's our WP one
        return el.indexOf(cookieName) === 0;
    });

    if (!WordPressUserIdCookie) {
        // we're logged out, anon
        return false;
    }

    // decode it and remove the cookie name
    var decodedCookie = decodeURIComponent(WordPressUserIdCookie).replace(cookieName + '=', '');

    return decodedCookie;
}

// Add the WordPress account button to the nav,
// change the text based on logged in or not
function ebMCQsAddWordPressAccountButton() {
    'use strict';
    // get #nav
    var theNav = document.querySelector('#nav');

    // get the element in the nav that we'll insert before
    var insertBeforeTarget = theNav.querySelector('h2');

    // make the WordPress link to insert into the nav
    var accountLink = document.createElement('a');
    accountLink.innerText = locales[pageLanguage].account.login;
    accountLink.href = '/login/';
    accountLink.classList.add('wordpress-link');

    // add the account link to the nav
    theNav.insertBefore(accountLink, insertBeforeTarget);

    if (ebMCQsWordPressUserId()) {
        // change the button text and href
        accountLink.innerText = locales[pageLanguage].account['my-account'];
        accountLink.href = '/account/';
    }
}

// Send a bit of JSON for eacn question submission
function ebMCQsSendtoWordPress(quizId, score) {
    'use strict';
    // if we don't have a user id, early exit
    var userId = ebMCQsWordPressUserId();
    if (!ebMCQsWordPressUserId()) {
        return;
    }

    // make the object to send
    var data = {
        action: "quiz_score", // existing action name
        book_id: 1,
        quiz_id: quizId,
        user_id: userId,
        score: score
    };

    // set url to send json to
    var wordPressURL = '/wp-admin/admin-ajax.php';

    // send the data
    // first build the data structure into a string
    var query = [], key;

    // make an array of 'key=value' with special characters encoded
    for (key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    var dataText = query.join('&'); // join the array into 'key=value1&key2=value2...'
    // now send the data
    var req = new XMLHttpRequest(); // create the request
    req.open('POST', wordPressURL, true); // put in the target url here!
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send(dataText); // so we send the encoded data not the original data structure
}

function ebMCQsAddFeedbackLabel(mcqsToCheck, feedbackType) {
    'use strict';

    var mcqsToCheckQuestionContent = mcqsToCheck.querySelector('.question-content');

    // Remove existing feedback
    var mcqsToCheckOldLabel = mcqsToCheck.querySelector('.feedback-label');
    if (mcqsToCheckOldLabel) {
        mcqsToCheckQuestionContent.removeChild(mcqsToCheckOldLabel);
    }

    // Find feedback, create a div for the label, and insert it
    var mcqsToCheckFeedback = mcqsToCheck.querySelector('.mcq-feedback');
    var mcqsToCheckFeedbackLabel = document.createElement('div');

    mcqsToCheckFeedbackLabel.setAttribute('class', 'feedback-label');
    mcqsToCheckFeedbackLabel.innerText = locales[pageLanguage].questions[feedbackType];

    mcqsToCheckQuestionContent.insertBefore(mcqsToCheckFeedbackLabel, mcqsToCheckFeedback);
}

function ebMCQsButtonClicks() {
    'use strict';
    // get all the buttons
    var answerCheckingButtons = document.querySelectorAll('.check-answer-button');

    // for each button
    answerCheckingButtons.forEach(function (answerCheckingButton) {
        // listen for clicks on the buttons
        answerCheckingButton.addEventListener('click', function () {
            // get the mcq and it's ID
            var mcqsToCheck = this.parentNode.parentNode; // 'this' is the button
            var mcqsToCheckName = mcqsToCheck.getAttribute('data-question');
            // var mcqsToCheckCode = mcqsToCheck.getAttribute('data-question-code'); // not used

            // reset the styles
            ebMCQsHideAllFeedback(mcqsToCheck);

            // get the selected options (the checked ones)
            var selectedOptions = ebMCQsGetAllSelected(mcqsToCheck);

            // get the correct answers for this mcq
            var ebMCQsCorrectAnswersForPage = ebMCQsGetAllCorrectAnswers();
            var correctAnswersForThisMCQs = ebMCQsCorrectAnswersForPage[mcqsToCheckName];

            mcqsToCheck.classList.remove('mcq-incorrect');
            mcqsToCheck.classList.remove('mcq-partially-correct');
            mcqsToCheck.classList.remove('mcq-correct');

            // set score
            var score = 0;

            // if exactly right, mark it so, show options
            if (ebMCQsExactlyRight(correctAnswersForThisMCQs, selectedOptions)) {
                mcqsToCheck.classList.add('mcq-correct');
                ebMCQsAddFeedbackLabel(mcqsToCheck, 'feedback-correct');
                ebMCQsShowSelectedOptions(mcqsToCheck, selectedOptions);

                // set score
                score = 1;
            } else if (ebMCQsNotAllTheCorrectAnswers(correctAnswersForThisMCQs, selectedOptions)) {
                mcqsToCheck.classList.add('mcq-partially-correct');
                ebMCQsAddFeedbackLabel(mcqsToCheck, 'feedback-unfinished');
                ebMCQsShowSelectedIncorrectOptions(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs);
            } else {
                // show the feedback for the incorrect options
                mcqsToCheck.classList.add('mcq-incorrect');
                ebMCQsAddFeedbackLabel(mcqsToCheck, 'feedback-incorrect');
                ebMCQsShowSelectedIncorrectOptions(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs);
            }

            // now send it all to WordPress
            var quizNumber = mcqsToCheckName.replace('question-', '');
            ebMCQsSendtoWordPress(quizNumber, score);
        });
    });
}

function ebMCQs() {
    'use strict';
    // early exit for lack of browser support or no mcqs
    if (!ebMCQsInit()) {
        return;
    }

    // add the WordPress account button
    ebMCQsAddWordPressAccountButton();

    // mark the document, to use the class in CSS
    document.documentElement.classList.add('js-mcq');

    // get all the questions
    var questions = document.querySelectorAll('.mcq');

    // loop over questions
    questions.forEach(function (question) {
        // add the interactive stuff: the checkboxes and the buttons
        ebMCQsMakeOptionCheckboxes(question);
        ebMCQsAddButton(question);
    });

    // mark the checked ones more clearly
    ebMCQsMarkSelectedOptions();

    // listen for button clicks and show results
    ebMCQsButtonClicks();
}

ebMCQs();

    /*jslint browser */
/*globals locales, pageLanguage */

// Options
// -------
// 1. Which select elements will this script apply to?
var ebSelectLists = document.querySelectorAll('select.select-list');
// 2. Do you want to convert correct answers to plain text?
var ebSelectCorrectToText = true;


// Polyfill for IE (thanks, MDN)
Number.isInteger = Number.isInteger || function (value) {
    'use strict';

    return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
};

// Check if an option's code means it is correct or incorrect,
// returning true for correct and false for incorrect.
function ebSelectCheckCode(code) {
    'use strict';

    // Get the fifth character in the code,
    // and try to convert it to a number.
    var keyCharacter = Number(code.charAt(4));

    // If it is a number, this returns true.
    return Number.isInteger(keyCharacter);
}

function ebSelectAddMarker(selectElement, markerContent) {
    'use strict';

    // If a marker already exists from a previous attempt,
    // remove it.
    if (selectElement.nextElementSibling && selectElement.nextElementSibling.classList.contains('select-list-marker')) {
        var oldMarker = selectElement.nextElementSibling;
        oldMarker.remove();
    }

    // Add new marker
    var newMarker = document.createElement('span');
    newMarker.classList.add('select-list-marker');
    newMarker.innerHTML = markerContent;
    selectElement.insertAdjacentElement('afterend', newMarker);
}

// Convert an option to unclickable text
function ebSelectConvertToText(selectElement, optionElement) {
    'use strict';
    selectElement.outerHTML = optionElement.innerHTML;
}

// Mark a selected option as correct or incorrect.
function ebSelectMarkResult(event) {
    'use strict';

    // Get the selected option and its code.
    var selectedOption = event.target.options[event.target.selectedIndex];
    var optionCode = selectedOption.getAttribute('data-select-code');
    var selectList = selectedOption.parentNode;

    // Mark whether the option is correct or incorrect.
    // Since we can't style options, only select elements,
    // we mark the parent select element and add a span after it
    // that we can style.
    if (optionCode && ebSelectCheckCode(optionCode)) {
        selectList.classList.remove('select-option-incorrect');
        selectList.classList.add('select-option-correct');
        ebSelectAddMarker(selectList, locales[pageLanguage].questions['mark-correct']);
        if (ebSelectCorrectToText === true) {
            ebSelectConvertToText(selectList, selectedOption);
        }
    } else {
        selectList.classList.remove('select-option-correct');
        selectList.classList.add('select-option-incorrect');
        ebSelectAddMarker(selectList, locales[pageLanguage].questions['mark-incorrect']);
    }
}

// Listen for changes on a select element,
// to mark the result when the user changes the option.
function ebSelectListener(selectElement) {
    'use strict';
    selectElement.addEventListener('change', ebSelectMarkResult, false);
}

// Add a listener to each select element.
function ebSelects(selects) {
    'use strict';

    if (selects.length > 0) {
        var i;
        for (i = 0; i < selects.length; i += 1) {
            ebSelectListener(selects[i]);
        }
    }
}

// Go!
ebSelects(ebSelectLists);

    function ebTables() {
    'use strict';

    var supported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            !!Array.prototype.forEach;

    if (!supported) {
        return;
    }

    var tables = document.querySelectorAll('table');

    tables.forEach(function (table) {
        // make the wrapper and add a class
        var tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-wrapper');

        // add the wrapper to the DOM
        table.parentNode.insertBefore(tableWrapper, table);

        // move the table inside the wrapper
        tableWrapper.appendChild(table);
    });
}

ebTables();

    /* jslint browser */
/*globals window */

function ebFootnotePopups() {
    'use strict';

    // List the features we use
    var featuresSupported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== "undefined" &&
            window.addEventListener !== "undefined" &&
            !!Array.prototype.forEach;

    // Get all the .footnote s
    var footnoteLinks = document.querySelectorAll('.footnote');

    // Early exit for unsupported or if there are no footnotes
    if (!featuresSupported || footnoteLinks.length === 0) {
        return;
    }

    // Loop through footnotes
    footnoteLinks.forEach(function (current) {

        // Get the target ID
        var targetHash = current.hash;
        var targetID = current.hash.replace('#', '');

        // Escape it with double backslashes, for querySelector
        var sanitisedTargetHash = targetHash.replace(':', '\\:');

        // Find the li with the ID from the .footnote's href
        var targetReference = document.querySelector(sanitisedTargetHash);

        // Make a div.reference
        var footnoteContainer = document.createElement('div');
        footnoteContainer.classList.add('footnote-detail');
        footnoteContainer.classList.add('visuallyhidden');
        footnoteContainer.id = 'inline-' + targetID;

        // The a, up to the sup
        var theSup = current.parentNode;
        var theContainingElement = current.parentNode.parentNode;

        // Add the reference div to the sup
        // (Technically, this creates invalid HTML because a sup
        // should not contain a div. But this is necessary to
        // position the popup under the sup, and no worse than
        // making the popup a span that contains a p.)
        theSup.appendChild(footnoteContainer);

        // Move the li contents inside the div.reference
        footnoteContainer.innerHTML = targetReference.innerHTML;

        // Show on hover
        theSup.addEventListener('mouseover', function (ev) {
            if (ev.target.classList.contains('footnote')) {
                footnoteContainer.classList.remove('visuallyhidden');
            }
        });

        // Add a class to the parent
        theContainingElement.parentNode.classList.add('contains-footnote');

        // If we mouseleave footnoteContainer, hide it
        // (mouseout also fires on mouseout of children, so we use mouseleave)
        footnoteContainer.addEventListener('mouseleave', function (ev) {
            if (ev.target === this) {
                setTimeout(function () {
                    footnoteContainer.classList.add('visuallyhidden');
                }, 1000);
            }
        });

        // Clicking on the reverseFootnote link closes the footnote
        var reverseFootnote = footnoteContainer.querySelector('.reversefootnote');

        // Remove the contents since we're using
        // CSS and :before to show a close button marker
        reverseFootnote.innerText = '';

        reverseFootnote.addEventListener('click', function (ev) {
            ev.preventDefault();
            footnoteContainer.classList.add('visuallyhidden');
        });

        // Remove the href to avoiding jumping down the page
        current.removeAttribute('href');

    });
}

ebFootnotePopups();

    /*jslint browser */
/*globals locales, pageLanguage */

// Options
// -------
var ebShowHideOptions = {
    elementsToHide: '.show-hide', // a querySelectorAll string
    buttonShowText: locales[pageLanguage].input.show, // will be overriden if set in HTML as data-show-text
    buttonHideText: locales[pageLanguage].input.hide // will be overriden if set in HTML as data-hide-text
};

// Toggle visuallyhidden
function ebToggleNextSiblingVisibility(event) {
    'use strict';
    var button = event.target;
    var elementToHide = button.nextElementSibling;
    if (elementToHide.classList.contains('visuallyhidden')) {
        elementToHide.classList.remove('visuallyhidden');
        button.classList.remove('show-hide-hidden');
        button.classList.add('show-hide-visible');

        // If button text has been set in the HTML, use that,
        // otherwise use our default from ebShowHideOptions above.
        if (elementToHide.getAttribute('data-hide-text')) {
            button.innerHTML = elementToHide.getAttribute('data-hide-text');
        } else {
            button.innerHTML = ebShowHideOptions.buttonHideText;
        }
    } else {
        elementToHide.classList.add('visuallyhidden');
        button.classList.remove('show-hide-visible');
        button.classList.add('show-hide-hidden');

        // If button text has been set in the HTML, use that,
        // otherwise use our default from ebShowHideOptions above.
        if (elementToHide.getAttribute('data-show-text')) {
            button.innerHTML = elementToHide.getAttribute('data-show-text');
        } else {
            button.innerHTML = ebShowHideOptions.buttonShowText;
        }
    }
}

// Add a show/hide button
function ebShowHideAddButton(elementToHide) {
    'use strict';
    var button = document.createElement('button');
    button.classList.add('show-hide');
    button.classList.add('show-hide-hidden');
    elementToHide.insertAdjacentElement('beforebegin', button);

    // If button text has been set in the HTML, use that,
    // otherwise use our default from ebShowHideOptions above.
    if (elementToHide.getAttribute('data-show-text')) {
        button.innerHTML = elementToHide.getAttribute('data-show-text');
    } else {
        button.innerHTML = ebShowHideOptions.buttonShowText;
    }

    // Add a listener to the button
    button.addEventListener('click', ebToggleNextSiblingVisibility, false);
}

// Hide element
function ebShowHideHideInitially(elementToHide) {
    'use strict';
    elementToHide.classList.add('visuallyhidden');
}

// Process all show-hides
function ebShowHide() {
    'use strict';
    var ebShowHideElements = document.querySelectorAll(ebShowHideOptions.elementsToHide);
    var i;
    for (i = 0; i < ebShowHideElements.length; i += 1) {
        ebShowHideHideInitially(ebShowHideElements[i]);
        ebShowHideAddButton(ebShowHideElements[i]);
    }
}

// Go!
ebShowHide();

    /*jslint browser*/
/*globals window*/

var ebSlideSupports = function () {
    'use strict';
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== "undefined" &&
            window.addEventListener !== "undefined" &&
            window.onhashchange !== "undefined" &&
            !!Array.prototype.forEach &&
            document.querySelectorAll('.slides');
};

var ebSlidesMoveSummaryMeta = function (slidelines) {
    'use strict';

    slidelines.forEach(function (slideline) {

        var summary = slideline.querySelector('.summary');

        var summaryCaption, summarySubCaption, summaryFigureSource;

        // You choose: use the title or the caption for the summary
        var summaryUseTitle = false;
        if (summaryUseTitle === true) {
            // get the summary's .title, .caption and .figure-source
            summaryCaption = summary.querySelector('.title');
            summarySubCaption = summary.querySelector('.caption');
            summaryFigureSource = summary.querySelector('.figure-source');
        } else {
            // get the summary's .caption and .figure-source
            summaryCaption = summary.querySelector('.caption');
            summarySubCaption = '';
            summaryFigureSource = summary.querySelector('.figure-source');
        }

        // create a new div to put them in
        var summaryMeta = document.createElement('div');
        summaryMeta.classList.add('figure-summary-meta');

        // If they exist, move them both to after the slideline
        // (To put the caption and source somewhere else,
        // move them using insertAdjacentHTML, which takes
        // beforebegin, afterbegin, beforeend, or afterend as params.)
        if (summaryCaption !== null && summaryCaption !== '') {
            summaryMeta.insertAdjacentHTML('beforeend', summaryCaption.outerHTML);
        }
        if (summarySubCaption !== null && summarySubCaption !== '') {
            summaryMeta.insertAdjacentHTML('beforeend', summarySubCaption.outerHTML);
        }
        if (summaryFigureSource !== null && summaryFigureSource !== '') {
            summaryMeta.insertAdjacentHTML('beforeend', summaryFigureSource.outerHTML);
        }

        // Put the summary meta at the end of the slideline
        slideline.insertAdjacentHTML('beforeend', summaryMeta.outerHTML);

        // add the summary id to the slideline
        slideline.id = summary.id;

        // remove the summary figure
        slideline.removeChild(summary);
    });
};

function ebTruncateText(text, maxLength) {
    'use strict';
    var string = text;
    if (string.length > maxLength) {
        string = string.substring(0, maxLength) + "…";
    }
    return string;
}

var ebSlidesBuildNav = function (slidelines) {
    'use strict';
    slidelines.forEach(function (slideline) {

        // get all the figures
        var figures = slideline.querySelectorAll('.figure');
        var figuresCount = figures.length;

        // make the slide nav
        var slideNavigationInsert = '';
        slideNavigationInsert += '<nav class="nav-slides';
        if (figuresCount > 4) {
            slideNavigationInsert += ' nav-slides-many';
            if (figuresCount > 6) {
                slideNavigationInsert += ' nav-slides-many-many';
            }
        }
        slideNavigationInsert += '">';


        slideNavigationInsert += '<ol>';

        figures.forEach(function (figure) {
            slideNavigationInsert += '<li>';
            slideNavigationInsert += '<a href="#' + figure.id + '">';

            // add thumbnail

            // if no image, use the figure title
            if (figure.querySelector('.figure-images img')) {
                var thumb = figure.querySelector('.figure-images img').cloneNode();
                thumb.removeAttribute('srcset');
                thumb.removeAttribute('sizes');
                thumb.setAttribute('alt', '');
                slideNavigationInsert += thumb.outerHTML;
            } else {
                var thumbText = figure.querySelector('.figure-body .title').innerText;
                thumbText = ebTruncateText(thumbText, 8);
                slideNavigationInsert += '<span class="slide-thumbnail-text">';
                slideNavigationInsert += thumbText;
                slideNavigationInsert += '</span>';
            }

            slideNavigationInsert += '</a>';
            slideNavigationInsert += '</li>';
        });

        slideNavigationInsert += '</ol>';
        slideNavigationInsert += '</nav>';

        slideline.insertAdjacentHTML('afterbegin', slideNavigationInsert);
    });
};

var ebResetSlides = function (slidelines) {
    'use strict';
    slidelines.forEach(function (slideline) {

        // get all the figures, hide them
        var figures = slideline.querySelectorAll('.figure');

        figures.forEach(function (slideline) {
            slideline.classList.add('visuallyhidden');
        });

        // get the slide nav items, hide them
        var slideNavItems = slideline.previousElementSibling.querySelectorAll('.nav-slides li');
        slideNavItems.forEach(function (slideline) {
            slideline.classList.remove('slide-current');
        });

    });
};

var ebSlidesShowFirstInSlideline = function (slideline) {
    'use strict';
    // find the first figure and show it
    var figures = slideline.querySelectorAll('.figure');
    figures[0].classList.remove('visuallyhidden');
};

var ebSlidesShowFirst = function (slidelines) {
    'use strict';
    slidelines.forEach(function (slideline) {
        ebSlidesShowFirstInSlideline(slideline);
    });
};

var ebSlidesMarkNavUpToCurrent = function (slideline) {
    'use strict';
    var navItems = slideline.querySelectorAll('.nav-slides li'),
        hitCurrent = false;

    navItems.forEach(function (navItem) {
        if (hitCurrent) {
            return;
        }

        if (navItem.classList.contains('slide-current')) {
            hitCurrent = true;
            return;
        }

        navItem.classList.add('slide-current');
    });

};

var ebSlidesShow = function (slidelines) {
    'use strict';

    // check for hash
    if (!window.location.hash) {
        ebSlidesShowFirst(slidelines);
        return;
    }

    var sanitisedTargetHash = decodeURIComponent(window.location.hash.replace(':', '\\:'));
    // check if it starts with a number, after the #
    // (which means querySelector(sanitisedTargetHash) will return an error)
    if (!isNaN(sanitisedTargetHash[1])) {
        ebSlidesShowFirst(slidelines);
        return;
    }

    slidelines.forEach(function (slideline) {
        // check if hash is in this slideline
        if (!slideline.querySelector(sanitisedTargetHash)) {
            ebSlidesShowFirstInSlideline(slideline);
            return;
        }

        // show the target slideline
        slideline.querySelector(sanitisedTargetHash)
            .classList.remove('visuallyhidden');

        // reset the slide-current
        slideline.querySelectorAll('.nav-slides li').forEach(function (navItem) {
            navItem.classList.remove('slide-current');
        });

        // mark the current one with slide-current
        var selector = '.nav-slides [href="' + sanitisedTargetHash + '"]';
        var targetLinkElement = slideline.querySelector(selector);
        targetLinkElement.setAttribute('tabindex', 0);
        targetLinkElement.focus();

        var targetParent = targetLinkElement.parentNode;
        targetParent.classList.add('slide-current');

        // mark all the ones up to the current one
        ebSlidesMarkNavUpToCurrent(slideline);
    });
};

var ebSlidesKeyDown = function () {
    'use strict';
    // listen for key movements
    window.addEventListener("keydown", function (ev) {
        var keyCode = ev.key || ev.which,
            clickedElement = ev.target || ev.srcElement;

        if (document.querySelector('.slides ' + clickedElement.hash)) {
            if ((keyCode === 'ArrowLeft'
                    || keyCode === 37
                    || keyCode === 'ArrowUp'
                    || keyCode === 38) &&
                    clickedElement.parentNode.previousElementSibling) {
                ev.preventDefault();
                clickedElement.parentNode.previousElementSibling
                    .querySelector('a').click();
            } else if ((keyCode === 'ArrowRight'
                    || keyCode === 39
                    || keyCode === 'ArrowDown'
                    || keyCode === '40') &&
                    clickedElement.parentNode.nextElementSibling) {
                ev.preventDefault();
                clickedElement.parentNode.nextElementSibling
                    .querySelector('a').click();
            }
        }
    });
};

var ebSlidesAlreadyShown = function () {
    'use strict';

    // get all the nav slide links
    var navSlides = document.querySelectorAll('.nav-slides a');

    navSlides.forEach(function (navSlide) {
        // listen for clicks on each nav slide link
        navSlide.addEventListener('click', function (ev) {

            var itsCurrentlyHidden = document.querySelector(this.getAttribute('href'))
                .classList.contains('visuallyhidden');

            // if it's currently shown, stop the anchor's jump
            if (!itsCurrentlyHidden) {
                ev.preventDefault();
            }
        });
    });
};

var ebSlides = function () {
    'use strict';
    if (!ebSlideSupports()) {
        return;
    }

    // get all the slidelines
    var slidelines = document.querySelectorAll('.slides');

    // move the summary meta
    ebSlidesMoveSummaryMeta(slidelines);

    // build the nav
    ebSlidesBuildNav(slidelines);

    // get, then hide, the figures and slide nav items
    ebResetSlides(slidelines);

    // show slide from hash
    ebSlidesShow(slidelines);

    // prevent jump when clicking already shown slides
    ebSlidesAlreadyShown();

    // listen for hashchanges
    window.addEventListener("hashchange", function () {
        // get, then hide, the figures and slide nav items
        ebResetSlides(slidelines);

        // show slide from hash
        ebSlidesShow(slidelines);
    });

    // listen for keys
    ebSlidesKeyDown();
};

ebSlides();

    /* jslint browser */
/*global window */

function ebDefinitionsInit() {
    'use strict';

    // check for browser support of the features we use
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            window.addEventListener !== undefined &&
            !!Array.prototype.forEach;
}

function ebDefinitionsSlugify(snail) {
    'use strict';

    return snail.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/-+/g, '-')            // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text;
}

function ebDefinitionsMoveDefinitions() {
    'use strict';

    // get all the definition-terms and loop over them
    var definitionTerms = document.querySelectorAll('.definition-term');

    // loop over them
    definitionTerms.forEach(function (definitionTerm) {

        // visually hide the old dl, the parent of the definitionTerm
        definitionTerm.parentNode.classList.add('hidden-definition-list');

        // get the definition term
        var definitionTermText = definitionTerm.innerHTML;

        // Detect presence of em spans
        var definitionTermTextIsItalic;
        if (definitionTermText.indexOf('<em>') !== -1) {
            definitionTermTextIsItalic = true;
        }

        // Create a plain-text version of definitionTermText for matching with dataTermInText
        var termTextForMatching = definitionTermText;
        // 1. Remove em spans created from asterisks in markdown
        if (definitionTermTextIsItalic) {
            termTextForMatching = termTextForMatching.replace(/(<([^>]+)>)/ig, "*");
        }
        // 2. Straighten quotes in the HTML to match data-terms
        termTextForMatching = termTextForMatching.replace("’", "'");
        termTextForMatching = termTextForMatching.replace("‘", "'");

        // to check that we even have any terms to define:
        // find a data-term attribute
        var dataTermInText = document.querySelector('[data-term="' + termTextForMatching + '"]');
        // check that we have the term in the text
        if (!dataTermInText) {
            return;
        }


        // now we can add popups to each of them

        // find all the places where we want a popup
        var dataTermsInText = document.querySelectorAll('[data-term="' + termTextForMatching + '"]');

        // for each one, get the description and add the popup
        dataTermsInText.forEach(function (dataTermInText) {

            // if the term contained italics, put the em tags back
            if (definitionTermTextIsItalic) {
                definitionTermText = termTextForMatching.replace(/\*(.+?)\*/ig, '<em>$1</em>');
            }

            // get the description text
            var definitionDescriptionText = definitionTerm.nextElementSibling.innerHTML;

            // add it after the data-term
            var definitionPopup = document.createElement('span');
            definitionPopup.innerHTML = '<span class="definition-hover-term">' + definitionTermText + '</span>' + ' ' + definitionDescriptionText;
            definitionPopup.classList.add('visuallyhidden');
            definitionPopup.classList.add('definition-description-hover');
            definitionPopup.id = 'dd-' + ebDefinitionsSlugify(definitionTermText);
            dataTermInText.insertAdjacentElement('afterEnd', definitionPopup);

            // add the closing X as a link
            var closeButton = document.createElement('button');
            closeButton.classList.add('close');
            closeButton.innerHTML = '<span class="visuallyhidden">close</span>';
            definitionPopup.appendChild(closeButton);
        });

    });

}

function ebDefinitionsShowDescriptions() {
    'use strict';

    // get the terms
    var dataTerms = document.querySelectorAll('[data-term]');

    // loop and listen for hover on child description
    dataTerms.forEach(function (dataTerm) {

        // get the child that we want to pop up
        var childPopup = dataTerm.nextElementSibling;

        // show on click
        dataTerm.addEventListener('click', function () {
            childPopup.classList.remove('visuallyhidden');
        });

    });

}

function ebDefinitionsHideDescriptions() {
    'use strict';

    var descriptions = document.querySelectorAll('.definition-description-hover');

    descriptions.forEach(function (description) {
        // if we mouseleave description, hide it
        // (mouseout also fires on mouseout of children, so we use mouseleave)
        description.addEventListener('mouseleave', function () {
            setTimeout(function () {
                description.classList.add('visuallyhidden');
            }, 1000);
        });
    });

}

function ebDefinitionsHideDescriptionWithButton() {
    'use strict';

    var closeButtons = document.querySelectorAll('.definition-description-hover button.close');

    // listen for clicks on all close buttons
    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener('click', function () {
            // ev.preventDefault();
            closeButton.parentNode.classList.add('visuallyhidden');
        });
    });
}

var ebDefinitions = function () {
    'use strict';

    // early exit for lack of browser support
    if (!ebDefinitionsInit()) {
        return;
    }

    // move all the definitions next to their terms
    ebDefinitionsMoveDefinitions();

    // listen for hover and things
    ebDefinitionsShowDescriptions();
    ebDefinitionsHideDescriptions();
    ebDefinitionsHideDescriptionWithButton();


};

ebDefinitions();

    // Show and hide notification

// Get a notification's hidden status
function ebGetNoticationHiddenStatus(notification) {
    'use strict';
    var status = sessionStorage.getItem(notification.id);
    return status;
}

// Save a notification's hidden status
function ebStoreNotificationHiddenStatus(notification) {
    'use strict';
    sessionStorage.setItem(notification.id, 'hidden');
}

// Add a hide button and listen for hiding clicks
function ebEnableHidingNotification(notification) {
    'use strict';

    // Hide if already hidden in this session
    if (ebGetNoticationHiddenStatus(notification) === 'hidden') {
        notification.classList.add('notification-hidden');
        notification.classList.remove('notification-visible');
    }

    // Create a close button
    var closeButton = document.createElement('input');
    closeButton.type = 'checkbox';
    closeButton.name = notification.id + '--close';
    closeButton.id = notification.id + '--close';
    closeButton.classList.add('notification-close');
    closeButton.innerHTML = '×';
    notification.appendChild(closeButton);

    // Create a label for the checkbox
    var label = document.createElement('label');
    label.setAttribute('for', notification.id + '--close');
    label.innerHTML = "OK";
    closeButton.insertAdjacentElement('afterend', label);

    // Listen for clicks on checkbox
    closeButton.addEventListener('change', function () {
        var checkbox = event.target;
        if (checkbox.checked) {
            notification.style.display = 'none';
            ebStoreNotificationHiddenStatus(notification);
        }
    })
}

// Make all notifications hideable
function ebHideNotifications() {
    'use strict';
    var notifications = document.querySelectorAll('[id*="notification-"]');
    notifications.forEach(function (notification) {
        if (ebGetNoticationHiddenStatus(notification) !== 'hidden') {
            notification.classList.remove('notification-hidden');
            notification.classList.add('notification-visible');
            ebEnableHidingNotification(notification);
        }
    })
}

// Go
ebHideNotifications();


    
    !function(o,l){var r,a,s="createElement",g="getElementsByTagName",b="length",E="style",d="title",y="undefined",k="setAttribute",w="getAttribute",x=null,A="__svgInject",C="--inject-",S=new RegExp(C+"\\d+","g"),I="LOAD_FAIL",t="SVG_NOT_SUPPORTED",L="SVG_INVALID",v=["src","alt","onload","onerror"],j=l[s]("a"),G=typeof SVGRect!=y,f={useCache:!0,copyAttributes:!0,makeIdsUnique:!0},N={clipPath:["clip-path"],"color-profile":x,cursor:x,filter:x,linearGradient:["fill","stroke"],marker:["marker",
"marker-end","marker-mid","marker-start"],mask:x,pattern:["fill","stroke"],radialGradient:["fill","stroke"]},u=1,c=2,O=1;function T(e){return(r=r||new XMLSerializer).serializeToString(e)}function P(e,r){var t,n,i,o,a=C+O++,f=/url\("?#([a-zA-Z][\w:.-]*)"?\)/g,u=e.querySelectorAll("[id]"),c=r?[]:x,l={},s=[],d=!1;if(u[b]){for(i=0;i<u[b];i++)(n=u[i].localName)in N&&(l[n]=1);for(n in l)(N[n]||[n]).forEach(function(e){s.indexOf(e)<0&&s.push(e)});s[b]&&s.push(E);var v,p,m,h=e[g]("*"),y=e;for(i=-1;y!=x;
){if(y.localName==E)(m=(p=y.textContent)&&p.replace(f,function(e,r){return c&&(c[r]=1),"url(#"+r+a+")"}))!==p&&(y.textContent=m);else if(y.hasAttributes()){for(o=0;o<s[b];o++)v=s[o],(m=(p=y[w](v))&&p.replace(f,function(e,r){return c&&(c[r]=1),"url(#"+r+a+")"}))!==p&&y[k](v,m);["xlink:href","href"].forEach(function(e){var r=y[w](e);/^\s*#/.test(r)&&(r=r.trim(),y[k](e,r+a),c&&(c[r.substring(1)]=1))})}y=h[++i]}for(i=0;i<u[b];i++)t=u[i],c&&!c[t.id]||(t.id+=a,d=!0)}return d}function V(e,r,t,n){if(r){
r[k]("data-inject-url",t);var i=e.parentNode;if(i){n.copyAttributes&&function c(e,r){for(var t,n,i,o=e.attributes,a=0;a<o[b];a++)if(n=(t=o[a]).name,-1==v.indexOf(n))if(i=t.value,n==d){var f,u=r.firstElementChild;u&&u.localName.toLowerCase()==d?f=u:(f=l[s+"NS"]("http://www.w3.org/2000/svg",d),r.insertBefore(f,u)),f.textContent=i}else r[k](n,i)}(e,r);var o=n.beforeInject,a=o&&o(e,r)||r;i.replaceChild(a,e),e[A]=u,m(e);var f=n.afterInject;f&&f(e,a)}}else D(e,n)}function p(){for(var e={},r=arguments,
t=0;t<r[b];t++){var n=r[t];for(var i in n)n.hasOwnProperty(i)&&(e[i]=n[i])}return e}function _(e,r){if(r){var t;try{t=function i(e){return(a=a||new DOMParser).parseFromString(e,"text/xml")}(e)}catch(o){return x}return t[g]("parsererror")[b]?x:t.documentElement}var n=l.createElement("div");return n.innerHTML=e,n.firstElementChild}function m(e){e.removeAttribute("onload")}function n(e){console.error("SVGInject: "+e)}function i(e,r,t){e[A]=c,t.onFail?t.onFail(e,r):n(r)}function D(e,r){m(e),i(e,L,r)
}function F(e,r){m(e),i(e,t,r)}function M(e,r){i(e,I,r)}function q(e){e.onload=x,e.onerror=x}function R(e){n("no img element")}var e=function z(e,r){var t=p(f,r),h={};function n(a,f){f=p(t,f);var e=function(r){var e=function(){var e=f.onAllFinish;e&&e(),r&&r()};if(a&&typeof a[b]!=y){var t=0,n=a[b];if(0==n)e();else for(var i=function(){++t==n&&e()},o=0;o<n;o++)u(a[o],f,i)}else u(a,f,e)};return typeof Promise==y?e():new Promise(e)}function u(u,c,e){if(u){var r=u[A];if(r)Array.isArray(r)?r.push(e
):e();else{if(q(u),!G)return F(u,c),void e();var t=c.beforeLoad,n=t&&t(u)||u[w]("src");if(!n)return""===n&&M(u,c),void e();var i=[];u[A]=i;var l=function(){e(),i.forEach(function(e){e()})},s=function f(e){return j.href=e,j.href}(n),d=c.useCache,v=c.makeIdsUnique,p=function(r){d&&(h[s].forEach(function(e){e(r)}),h[s]=r)};if(d){var o,a=function(e){if(e===I)M(u,c);else if(e===L)D(u,c);else{var r,t=e[0],n=e[1],i=e[2];v&&(t===x?(t=P(r=_(n,!1),!1),e[0]=t,e[2]=t&&T(r)):t&&(n=function o(e){
return e.replace(S,C+O++)}(i))),r=r||_(n,!1),V(u,r,s,c)}l()};if(typeof(o=h[s])!=y)return void(o.isCallbackQueue?o.push(a):a(o));(o=[]).isCallbackQueue=!0,h[s]=o}!function m(e,r,t){if(e){var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==n.readyState){var e=n.status;200==e?r(n.responseXML,n.responseText.trim()):400<=e?t():0==e&&t()}},n.open("GET",e,!0),n.send()}}(s,function(e,r){var t=e instanceof Document?e.documentElement:_(r,!0),n=c.afterLoad;if(n){var i=n(t,r)||t;if(i){
var o="string"==typeof i;r=o?i:T(t),t=o?_(i,!0):i}}if(t instanceof SVGElement){var a=x;if(v&&(a=P(t,!1)),d){var f=a&&T(t);p([a,r,f])}V(u,t,s,c)}else D(u,c),p(L);l()},function(){M(u,c),p(I),l()})}}else R()}return G&&function i(e){var r=l[g]("head")[0];if(r){var t=l[s](E);t.type="text/css",t.appendChild(l.createTextNode(e)),r.appendChild(t)}}('img[onload^="'+e+'("]{visibility:hidden;}'),n.setOptions=function(e){t=p(t,e)},n.create=z,n.err=function(e,r){e?e[A]!=c&&(q(e),G?(m(e),M(e,t)):F(e,t),r&&(m(
e),e.src=r)):R()},o[e]=n}("SVGInject");"object"==typeof module&&"object"==typeof module.exports&&(module.exports=e)}(window,document);
    /*jslint browser*/
/*globals SVGInject */

// This script helps get sensible SVGs into our pages.
// It first injects all SVGs linked as img tags
// into the code of the page itself, so that they
// have access to the page's CSS. This is mostly for fonts.
// Since some SVG styles use different font names
// to the ones in the site's global CSS, this script also
// replaces font names and related attributes in injected SVGs.

// Change font-family names in style attributes
function ebSVGFontFixes(svg) {
    'use strict';

    // Get the elements in the SVG with font-family set
    var ebFontFixElements = svg.querySelectorAll('[font-family]');

    // What fonts do we want to change the names of?
    // Optionally add a new font-weight, e.g. for 'OpenSans-Bold',
    // which should be Open Sans with a bold weight.
    var fontsToChange = [
        {
            oldFontFace: 'OpenSans-Regular',
            newFontFace: 'Open Sans'
        },
        {
            oldFontFace: 'OpenSans-Bold',
            newFontFace: 'Open Sans',
            newFontWeight: 'bold'
        }
    ];

    // Loop through the elements, making all the font changes
    // that we've listed above.
    var i, j;
    for (i = 0; i < ebFontFixElements.length; i += 1) {
        for (j = 0; j < fontsToChange.length; j += 1) {
            if (ebFontFixElements[i].getAttribute('font-family')
                    === fontsToChange[j].oldFontFace) {
                ebFontFixElements[i].setAttribute('font-family',
                        fontsToChange[j].newFontFace);
                if (fontsToChange[j].newFontWeight) {
                    ebFontFixElements[i].setAttribute('font-weight',
                            fontsToChange[j].newFontWeight);
                }
            }
        }
    }
}

// SVGInject options (https://github.com/iconfu/svg-inject#svginject)
// - run the font fixes after injecting SVGs
SVGInject.setOptions({
    afterLoad: function (svg) {
        'use strict';
        ebSVGFontFixes(svg);
    }
});

// Run svg-inject.min.js on all images
// that have an 'inject-svg' class.
function ebInjectSVGs() {
    'use strict';
    var ebSVGsToInject = document.querySelectorAll('img.inject-svg:not(.no-inject-svg)');
    var i;
    for (i = 0; i < ebSVGsToInject.length; i += 1) {
        SVGInject(ebSVGsToInject[i]);
    }
}

// Go
ebInjectSVGs();

    

    /*jslint browser */
/*globals */

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function ebListToChecklistSlugify(string) {
    'use strict';

    var a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    var b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    var p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

// Return a slug of the page URL, without the hash,
// for use in localStorage key prefixes.
function ebListToChecklistLocationSlug() {
    'use strict';
    var locationSlug = ebListToChecklistSlugify(window.location.href.split('#')[0]);
    return locationSlug;
}

// Create the form from a list
function ebListToChecklistCreateForm(list, number) {
    'use strict';

    // Insert a new form
    var form = document.createElement('form');
    form.classList.add('list-to-checklist');
    form.classList.add('js-form-storage');
    list.insertAdjacentElement('afterend', form);

    // Add each list item as a checklist item
    var listItems = list.querySelectorAll('li');
    var i, listItemContent, checklistItem;
    for (i = 0; i < listItems.length; i += 1) {
        listItemContent = listItems[i].innerHTML;
        checklistItem = document.createElement('input');
        checklistItem.type = 'checkbox';
        checklistItem.id = ebListToChecklistLocationSlug()
            + '-' + ebListToChecklistSlugify(listItems[i].innerText)
            + '-' + number;
        checklistItem.name = checklistItem.id;

        // Create the label
        var label = document.createElement('label');
        label.htmlFor = checklistItem.id;
        label.innerHTML = listItemContent;

        // Create a div to wrap them in
        var itemWrapper = document.createElement('div');
        itemWrapper.classList.add('checklist-item');

        // Add them to the div
        itemWrapper.appendChild(checklistItem);
        itemWrapper.appendChild(label);

        // Add the div to the form
        form.appendChild(itemWrapper);
    }

    // Remove the list
    list.remove();
}

// Main process
function ebListToChecklist() {
    'use strict';

    // Get the lists
    var lists = document.querySelectorAll('.checklist');

    // For each one, create a form
    if (lists.length > 0) {
        console.log('Found lists to turn into checklists. Converting...');
        var i;
        for (i = 0; i < lists.length; i += 1) {
            ebListToChecklistCreateForm(lists[i], [i]);
        }
    }
}

ebListToChecklist();

    /*jslint browser, for */
/*globals */

// Convert a table to a form
// -------------------------
// This converts a simple table to a form.
// Each column sets an aspect of the form:
// - Column 1: labels (main text)
// - Column 2: input hint (small text below the label)
// - Column 3: placeholder text in the textarea
// - Column 4: sets the number of rows in the textarea
// Text in each column is optional.


// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function ebTablesToFormsSlugify(string) {
    'use strict';

    var a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    var b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    var p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

// Return a slug of the page URL, without the hash,
// for use in localStorage key prefixes.
function ebListToChecklistLocationSlug() {
    'use strict';
    var locationSlug = ebListToChecklistSlugify(window.location.href.split('#')[0]);
    return locationSlug;
}

// Connert a table
function ebTableToForm(table, number) {
    'use strict';

    // Create a new form
    var form = document.createElement('form');

    // Copy the table's classes, too,
    // and add our own
    form.classList.add(table.classList);
    form.classList.add('table-to-form');

    // Each row will be a label–input pair
    var rows = table.querySelectorAll('tr');
    var i, inputWrapper, label, input, textAreaSize,
        inputHint, labelContent, inputContent, placeholderContent;
    for (let i = 0; i < rows.length; i += 1) {

        // Create a wrapper for our form elements
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('form-input-wrapper');

        // Create an input, input-hint, and a label
        input = document.createElement('textarea');
        input.id = ebListToChecklistLocationSlug()
            + '-' + ebTablesToFormsSlugify(rows[i].innerText)
            + '-' + number;
        input.name = input.id;

        inputHint = document.createElement('p');
        inputHint.classList.add('input-hint');

        label = document.createElement('label');
        label.id = ebTablesToFormsSlugify(rows[i].innerText) + '-' + number;
        label.name = label.id;
        label.htmlFor = input.id;

        // Get the content for each
        if (rows[i].querySelector('td:nth-child(1)')) {
            labelContent = rows[i].querySelector('td:nth-child(1)').innerHTML;
        }
        if (rows[i].querySelector('td:nth-child(2)')) {
            inputContent = rows[i].querySelector('td:nth-child(2)').innerHTML;
        }
        if (rows[i].querySelector('td:nth-child(3)')) {
            placeholderContent = rows[i].querySelector('td:nth-child(3)').innerHTML;
        }

        // Get the number of rows in the textarea
        if (rows[i].querySelector('td:nth-child(4)')) {
            textAreaSize = parseInt(rows[i].querySelector('td:nth-child(4)').textContent, 10);
            if (!isNaN(textAreaSize)) {
                input.rows = textAreaSize;
            }
        }

        // Copy the content to each
        inputHint.innerHTML = inputContent;
        label.innerHTML = labelContent;
        input.placeholder = placeholderContent;

        // Insert them into the input wrapper, label first
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(inputHint);
        inputWrapper.appendChild(input);

        // Insert the wrapper into the form
        form.appendChild(inputWrapper);
    }

    // Insert the form
    table.insertAdjacentElement('afterend', form);

    // Remove the table
    table.remove();
}

// Get the tables and process each one
function ebTablesToForms() {
    'use strict';

    // Get all the tables to make into forms
    var tables = document.querySelectorAll('table.form');

    // If there are tables to convert, process each one
    if (tables.length > 0) {
        var i;
        for (i = 0; i < tables.length; i += 1) {
            ebTableToForm(tables[i], i);
        }
    }
}

// Go
ebTablesToForms();

    /*jslint browser, for */
/*globals window */

// Stores checkboxes in localStorage

// Save the value of a checkbox as 'true' or 'false'
function ebSaveCheckbox(checkbox) {
    'use strict';
    localStorage.setItem(checkbox.id, checkbox.checked);
}

// Set the value of a checkbox
function ebSetCheckbox(checkbox) {
    'use strict';
    var checkStatus = localStorage.getItem(checkbox.id);
    if (checkStatus === 'true') {
        checkbox.checked = true;
    }
}

// Listen for changes on an element
function ebCheckboxListener(checkbox) {
    'use strict';
    checkbox.addEventListener('change', function () {
        ebSaveCheckbox(checkbox);
    });
}

// Main process
function ebSaveCheckboxes() {
    'use strict';
    // Get all the checkboxes
    var checkboxes = document.querySelectorAll('[type="checkbox"]');

    // Loop through them and:
    // 1. apply their stored values
    // 2. listen for changes
    var i;
    for (i = 0; i < checkboxes.length; i += 1) {

        // Apply stored value
        ebSetCheckbox(checkboxes[i]);

        // Store on change
        ebCheckboxListener(checkboxes[i]);
    }
}

// Start
ebSaveCheckboxes();

    /*jslint browser, for */
/*globals window */

// Stores textareas on clicking any 'Save' button.

// Save the text in a textarea
function ebSaveTextarea(textarea) {
    'use strict';
    localStorage.setItem(textarea.id, textarea.value);
}

// Set the text in a textarea
function ebSetTextarea(textarea) {
    'use strict';
    var text = localStorage.getItem(textarea.id);
    if (text && text !== '') {
        textarea.innerText = text;
    }
}

// Set all the textarea values
function ebSetAllTextareas() {
    'use strict';
    var textareas = document.querySelectorAll('textarea[id]');
    textareas.forEach(function (textarea) {
        ebSetTextarea(textarea);
    });
}

// Save all the textareas (where they have IDs)
function ebSaveAllTextareas() {
    'use strict';
    var textareas = document.querySelectorAll('textarea[id]');
    textareas.forEach(function (textarea) {
        ebSaveTextarea(textarea);
    });
}

// Show save feedback
function ebTextareaSaveFeedback(button) {
    'use strict';
    button.classList.add('saved');
    button.value = 'Saved'
    setTimeout(function () {
        button.classList.remove('saved');
        button.value = 'Save'
    }, 1000);
}

// Listen for save
function ebTextareaSaveListener(button) {
    'use strict';
    button.addEventListener('click', function () {
        ebSaveAllTextareas();
        ebTextareaSaveFeedback(button)
    });
}

// Add a save button to a textarea
function ebTextareaAddSaveButton(textarea) {
    'use strict';

    // Create new elements
    var buttonWrapper = document.createElement('div');
    var button = document.createElement('input');

    // Set classes and attributes on them
    buttonWrapper.classList.add('textarea-save-button-wrapper');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Save');
    button.classList.add('button');
    button.classList.add('textarea-save-button');

    // Insert elements
    buttonWrapper.appendChild(button);
    textarea.insertAdjacentElement('afterend', buttonWrapper);

    // Add click listener
    ebTextareaSaveListener(button);
}

// Add save buttons to textareas
function ebTextareaSaveButtons() {
    'use strict';
    var textareas = document.querySelectorAll('textarea[id]');
    textareas.forEach(function (textarea) {
        ebTextareaAddSaveButton(textarea);
    });
}

// Main process
function ebTextareaStorage() {
    'use strict';
    ebSetAllTextareas();
    ebTextareaSaveButtons();
}

// Go
ebTextareaStorage();





    /* For this project, the video files need to be copied from an SD card
into the app data file upon first launch of the app.

We can't include the videos in the app itself due to bandwidth limitations.

The six video files live in a folder called "npt" in the root directorty of the
SD card.

This all also needs to work when the app is not being loaded by RFF (i.e. if
a random person downloads the app from the store), so we'll host the files on
a server as well, and trigger a direct download from there in the case where
there is no SD card. */

/*jslint browser */
/*global alert, console, cordova, FileTransfer, fetch  */

const filelist = [
    "npt-video-1.mp4", "npt-video-2.mp4", "npt-video-3.mp4",
    "npt-video-4.mp4", "npt-video-5.mp4", "npt-video-6.mp4"
];

function ebDownloadVideosFromTheInternet() {
    "use strict";

    alert(
        "Please wait while the video files download. " +
        "This could take a few minutes, depending on your internet connection. "
    );

    // Access the JSON file on our server, containing the filenames and the URLs
    // at which RFF are hosting the video files.
    let getVideoFileURLs = new Promise(function () {
        fetch("https://rff.ebw.co/URLList.json")
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            const jsonData = JSON.parse(text);
            const dataPairList = jsonData.dataPairList;

            let j = 1;
            // Loop over each pair of [dst-filename, src-url] in the json data
            dataPairList.forEach(function (datapair) {
                let src = datapair[1];
                let dst = cordova.file.dataDirectory + datapair[0];

                // Use the cordova-plugin-file-transfer plugin
                let fileTransfer = new FileTransfer();
                fileTransfer.download(
                    src,
                    dst,
                    function (entry) {
                        alert(`Video ${j} of 6 has downloaded successfully. Hit OK to continue.`);
                        if (j === 6) {
                            ebDeactivateVideoLoadingMessage();
                        }
                        j += 1;
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            });
        });
    });
}

function ebCheckForSDCard() {
    "use strict";

    // Only do this part once
    if (window.localStorage.getItem("import-done") !== "true") {
        
        // Use the cordova.plugins.diagnostic plugin to get the SD card name
        cordova.plugins.diagnostic.getExternalSdCardDetails(
            function (data) {

                if (data.length === 0) {

                    // If no SD card is detected in the device, go online
                    ebActivateVideoLoadingMessage();
                    ebDownloadVideosFromTheInternet();

                } else {

                    var sdCardRoot = data[0].path;
                    cordova.plugins.ElkFilesShare.importFile (
                        [sdCardRoot + "/npt/"],
                        function(result){
                            console.log(result);
                            window.localStorage.setItem("import-done", "true");
                        },
                        function(err){
                            console.log(err);
                        }
                    );
                }
            },
            function (error) {
                console.log(error);
            }
        );
    }

    function checkWhetherItsDone () {
        window.resolveLocalFileSystemURL(
            cordova.file.dataDirectory + filelist[3],
        
            // If the file is there, dismiss the popup
            // NOTE: This timeout is not a fancy fix, will need to do something
            // like filesize detection is we want a more accurate timer on the 
            // dismiss call.
            function success() {
                setTimeout(function(){cordova.plugin.progressDialog.dismiss()}, 30000);
            },
        
            // Else, try again
            function failure() {
                checkWhetherItsDone();
            }
        );
    }

    window.plugins.intentShim.getIntent(
        function(intent) {
            
            if (intent.action == 'android.intent.action.SEND_MULTIPLE' && intent.hasOwnProperty('clipItems')) {
                
                if (intent.clipItems.length > 0) {
                
                    var targetSaveDirectory = cordova.file.dataDirectory
                    
                    var params = [
                        intent.clipItems,
                        targetSaveDirectory
                    ];

                    cordova.plugin.progressDialog.init({
                        // theme : 'HOLO_DARK',
                        progressStyle : 'SPINNER',
                        cancelable : true,
                        title : 'Please Wait...',
                        message : 'Copying files to application storage ...',
                    });

                    cordova.plugins.ElkFilesShare.processFile(
                        params,
                        function(result) {
                            console.log(result);
                            checkWhetherItsDone();
                        },
                        function(err) {
                            console.log(err);
                            cordova.plugin.progressDialog.dismiss();
                        }
                    );
                }
            }
        },
        function () {
            console.log('Error getting launch intent');
        }
    );
}

function ebRequestExternalSdPermission() {
    "use strict";
    // Produces a standard popup on the device, requesting permission
    // to write to the device (so that we can copy videos onto the device)
    // Inspo:
    // https://github.com/dpa99c/cordova-diagnostic-plugin#example-usage-1

    cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
        switch (status) {
    
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            console.log("Permission granted");
            ebCheckForSDCard();
            break;
    
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
            console.log("Permission denied");
            break;
    
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            console.log("Permission permanently denied");
            break;
        }
    }, function (error) {
        console.log(error);
    }, cordova.plugins.diagnostic.permission.WRITE_EXTERNAL_STORAGE);
}

function ebActivateVideoLoadingMessage () {
    "use strict";

    // This activates a loading screen, so that the user cannot interrupt
    // the video loading process by navigating to a different page in the app,
    // until the videos have all copied.

    // This is only used in the case where the user is downloading the files
    // from the remote server.

    let loadingMessage = document.querySelector(".video-loading-notification-wrapper");

    if (loadingMessage && loadingMessage.classList.contains("visuallyhidden")) {
        loadingMessage.classList.remove("visuallyhidden"); // unhide the message
        let allPageLinks = document.querySelectorAll("a");
        allPageLinks.forEach(function(link) {
            link.setAttribute("style", "pointer-events: none");
        });
    }
}

function ebDeactivateVideoLoadingMessage () {
    "use strict";
    let loadingMessage = document.querySelector(".video-loading-notification-wrapper");

    if (loadingMessage) {
        loadingMessage.classList.add("visuallyhidden");
        let allPageLinks = document.querySelectorAll("a");
        allPageLinks.forEach(function(link) {
            link.setAttribute("style", "pointer-events: auto");
        });
    }
}

function ebCheckDeviceForVideoFiles() {
    "use strict";

    // Check whether the video files are currently in the app data folder
    window.resolveLocalFileSystemURL(
        cordova.file.dataDirectory + filelist[3],
    
        // If they're already in place, do nothing
        // This will be the case when the JS loads on all other pages of the book
        function success() {
            console.log("Files are already in place.");
        },
    
        // Else, start looking for an SD card
        function failure() {
            ebRequestExternalSdPermission();
        }
    );
}

// Wait for the cordova file plugin to load, before continuing
document.addEventListener("deviceready", function () {
    "use strict";
    if (window.isFilePluginReadyRaised) {
        ebCheckDeviceForVideoFiles();
    } else {
        document.addEventListener(
            "filePluginIsReady",
            ebCheckDeviceForVideoFiles(),
            false
        );
    }
});

    // Android apps need to use a plugin to open local pdf files
// but these files first need to be moved from inside the app to
// the external data directory, because the pdf viewer doesn't have
// permission to go inside the app to look for them.

// https://www.raymondcamden.com/2016/06/26/linking-to-pdfs-in-cordova-apps
// https://github.com/pwlin/cordova-plugin-file-opener2/issues/28#issuecomment-218442994


function copyPDF(filename) {
	'use strict';
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + '/www/downloads/' + filename, function (fileEntry) {
	    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
	        fileEntry.copyTo(dirEntry, filename, function (newFileEntry) {
	            cordova.plugins.fileOpener2.open(newFileEntry.nativeURL, 'application/pdf');
	        });
	    });
	});
}

function preparePDFButtons() {
	var downloadPDFButtons = document.querySelectorAll('.download-pdf');
	downloadPDFButtons.forEach(function (button) {
		button.addEventListener('click', function () {
			event.preventDefault();
			var filename = event.target.href.split('/').pop();
			copyPDF(filename);
		});
	});
}

if (window.isFilePluginReadyRaised) {
	preparePDFButtons();
} else {
	document.addEventListener('filePluginIsReady', preparePDFButtons(), false);
}







    /*jslint browser */
/*global window, ebLazyLoadImages, searchTerm, videoShow */

// console.log('Debugging accordions.js');

// --------------------------------------------------------------
// Options
//
// 1. Use CSS selectors to list the headings that will
//    define each accordion section, e.g. '#content h2'
var accordionHeads = '#content > h2';
// 2. Which heading's section should we show by default?
var defaultAccordionHead = '#content > h2:first-of-type, #content header > h2:first-of-type';
// --------------------------------------------------------------

function ebAccordionInit() {
    'use strict';

    var pageAccordionOff;

    // Check for no-accordion setting on page
    var accordionPageSetting = document.body.getAttribute('data-accordion-page');
    if (accordionPageSetting &&
            (accordionPageSetting === "none")) {
        pageAccordionOff = true;
    }

    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelectorAll !== "undefined" &&
            window.addEventListener !== "undefined" &&
            !!Array.prototype.forEach &&
            !pageAccordionOff;
}

function ebAccordionPageSetting() {
    'use strict';

    var accordionPageSetting = document.body.getAttribute('data-accordion-page');
    return accordionPageSetting;
}

function ebAccordionDefaultAccordionHeadID() {
    'use strict';

    var defaultAccordionHeadID;

    // Get the default accordion section's id
    if (defaultAccordionHead !== '') {
        defaultAccordionHeadID = document.querySelector(defaultAccordionHead).id;
        if (!defaultAccordionHeadID) {
            defaultAccordionHeadID = 'defaultAccordionSection';
        }
    }
    return defaultAccordionHeadID;
}

function ebAccordionSetUpSections(collapserButtons) {
    'use strict';

    // Exit if there are no accordionHeads
    if (!document.querySelector(accordionHeads)) {
        return;
    }

    // add role="tablist" to the parent of the role="tab"s
    var content = document.querySelector('#content');
    content.setAttribute('role', 'tablist');

    // loop through collapserButtons
    collapserButtons.forEach(function (collapserButton) {

        // make a section to move the collapsing content into
        var section = document.createElement('section');
        section.setAttribute('role', 'tabpanel');
        section.setAttribute('aria-labelledby', collapserButton.id);
        section.setAttribute('data-accordion-container', collapserButton.id);

        // add the section to the doc
        content.insertBefore(section, collapserButton);


        // make a header, add it to the section
        var header = document.createElement('header');

        //  move the toggle to the header
        header.appendChild(collapserButton);

        // make a link for this id
        var accordionLink = document.createElement('a');
        accordionLink.href = '#' + collapserButton.id;
        accordionLink.innerHTML = collapserButton.innerHTML;

        // Add the link inside the toggle
        collapserButton.innerHTML = accordionLink.outerHTML;
        collapserButton.setAttribute('role', 'tab');

        // add the header to the section
        section.appendChild(header);


        // make a div for the rest of the contents
        var container = document.createElement('div');
        container.setAttribute('data-container', true);

        // add it to the section
        section.appendChild(container);
    });
}

function ebAccordionFillSections() {
    'use strict';

    // grab the individual #contents elements of the page
    var contentItems = document.querySelectorAll('#content > *');

    var currentSection = false;
    // loop through it
    contentItems.forEach(function (contentItem) {

        // if this is a section, update currentSection, then move on
        if (contentItem.getAttribute('role') === 'tabpanel') {
            currentSection = contentItem;
            return;
        }

        // have we reached the first section yet? if not, move on
        if (!currentSection) {
            return;
        }

        // otherwise, move it inside the currentSection's data-container
        currentSection.querySelector('[data-container]')
            .appendChild(contentItem);
    });
}

function ebMoveThemeKeys() {
    'use strict';

    // get the theme keys and the theme key links
    var themeKeys = document.querySelectorAll('.theme-key');
    var themeKeysLinks = document.querySelectorAll('.theme-key a');

    themeKeysLinks.forEach(function (themeKeysLink) {
        // up to themeKeys div, up to data-container, up to section,
        // on to next section, down to heading, down to h2
        themeKeysLink.parentNode.parentNode.parentNode
            .nextElementSibling.firstChild.firstChild
            .appendChild(themeKeysLink);
    });

    // remove now empty theme keys divs
    themeKeys.forEach(function (themeKey) {
        themeKey.parentNode.removeChild(themeKey);
    });
}

function ebAccordionHideAll() {
    'use strict';

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (current) {
        current.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'closed');
        current.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'false');
    });
}

function ebAccordionShowAll() {
    'use strict';

    console.log('expanding all');

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (current) {
        current.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'open');
        current.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'true');
    });
}

function ebAccordionHideAllExceptThisOne(targetID) {
    'use strict';

    // console.log('Starting ebAccordionHideAllExceptThisOne...');

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (tabPanel) {
        // if it's the one we just clicked, skip it
        if (tabPanel.getAttribute('aria-labelledby') === targetID) {
            return;
        }

        // otherwise, hide it
        tabPanel.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'closed');
        tabPanel.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'false');
    });
}

function ebAccordionCheckParent(node) {
    'use strict';

    // if (node !== null) {
    //     console.log('Checking for parent element of "' + node.innerText.substring(0, 20) + '..."');
    // }

    // if there is no parent, or something went wrong, exit
    if (!node) {
        return false;
    }
    if (!node.parentNode) {
        return false;
    }
    if (node.tagName === "BODY") {

        // console.log('Parent node is the body element. We\'re done looking.');

        return false;
    }

    var nodeParent = node.parentNode;

    // console.log('nodeParent is "' + nodeParent.innerText.substring(0, 20) + '..."');

    var parentAttribute = nodeParent.getAttribute('data-accordion-container');

    // if there's a parent, check if it's got data-accordion-container
    // and return that value, which is copied from the id of the section heading
    if (parentAttribute) {
        return nodeParent.getAttribute('data-accordion-container');
    }
    // if (!parentAttribute) {
    //     console.log('Parent node of "' + node.innerText.substring(0, 20) + '..." is not an accordion section');
    // }

    return ebAccordionCheckParent(nodeParent);
}

// find and return containing section
// (the aria-labelledby attribute matches the ID)
function ebAccordionFindSection(targetToCheck) {
    'use strict';

    // if (targetToCheck !== null) {
    //     console.log('Finding section that contains: ' + targetToCheck.outerHTML.substring(0, 80));
    // }

    // work recursively up the DOM looking for the section
    return ebAccordionCheckParent(targetToCheck);
}

function ebWhichTarget(targetID) {
    'use strict';

    // console.log('Starting ebWhichTarget...');

    var targetToCheck;

    // if we're given an ID, use it
    if (targetID) {
        // console.log('Using targetID ' + targetID);

        // Decode the targetID URI in case it's not ASCII
        // console.log('targetID encoded: ' + targetID);
        targetID = decodeURIComponent(targetID);
        // console.log('targetID decoded: ' + targetID);

        targetToCheck = document.getElementById(targetID);
    } else {
        // else use the hash
        var trimmedHash = window.location.hash.replace('#', '');

        // Decode the trimmedHash in case it's not ASCII
        // console.log('Using trimmedHash; encoded: ' + trimmedHash);
        trimmedHash = decodeURIComponent(trimmedHash);
        // console.log('using trimmedHash; decoded: ' + trimmedHash);

        targetToCheck = document.getElementById(trimmedHash);
    }


    // if the ID doesn't exist, exit
    if (!targetToCheck) {
        return false;
    }

    return targetToCheck;
}

function ebAccordionShow(targetID) {
    'use strict';

    // console.log('Starting ebAccordionShow...');
    // console.log('ebAccordionShow\'s targetID is: ' + targetID);

    var targetToCheck = ebWhichTarget(targetID);
    if (!targetToCheck) {
        return;
    }

    var sectionID = ebAccordionFindSection(targetToCheck);
    // If we are not linking to a section or something inside it,
    // show the default section
    if (!sectionID) {
        ebAccordionShowDefaultSection();
    }

    // set the accordion, then work down to toggle and content div
    var sectionTarget = '[aria-labelledby="' + sectionID + '"]';
    var sectionToShow = document.querySelector(sectionTarget);

    // update the tab
    if (sectionToShow) {
        var tab = sectionToShow.querySelector('[role="tab"]');
        tab.setAttribute('data-accordion', 'open');

        // update the tab contents
        var tabContents = sectionToShow.querySelector('[data-container]');
        tabContents.setAttribute('aria-expanded', 'true');

        // lazyload the images inside
        var lazyimages = sectionToShow.querySelectorAll('[data-srcset]');

        // console.log('lazyimages: ' + lazyimages.innerHTML);

        if (lazyimages.innerHTML !== undefined) {
            ebLazyLoadImages(lazyimages);
        }

        // if we have a slideline in this section, check if it's a portrait one
        var slidelinesInThisSection = sectionToShow.querySelectorAll('.slides');

        slidelinesInThisSection.forEach(function (slidelineInThisSection) {
            var firstFigureImg = slidelineInThisSection.querySelector('.figure img');

            if (firstFigureImg) {
                firstFigureImg.addEventListener('load', function () {
                    var portraitSlideline = (firstFigureImg.height > firstFigureImg.width);
                    if (portraitSlideline) {
                        slidelineInThisSection.querySelector('nav').classList.add('nav-slides-portrait');
                    }
                });
            }
        });

        if (typeof(videoShow) === 'function') {
            videoShow(sectionToShow);
        }
    }
}

function ebAccordionListenForAnchorClicks() {
    'use strict';

    // console.log('Starting ebAccordionListenForAnchorClicks...');

    // listen for clicks on *all* the anchors (;_;)
    var allTheAnchors = document.querySelectorAll('#content a');
    allTheAnchors.forEach(function (oneOfTheAnchors) {

        // if it's an external link, exit
        if (oneOfTheAnchors.target === '_blank') {
            return;
        }

        oneOfTheAnchors.addEventListener("click", function (ev) {

            ev.stopPropagation();

            // Declare targetID so JSLint knows it's coming in this function.
            var targetID;

            // ignore target blank / rel noopener links
            if (this.getAttribute('rel') === 'noopener') {
                return;
            }

            // get the target ID by removing any file path and the #
            if (this.hasAttribute('href')) {
                targetID = this.getAttribute('href').replace(/.*#/, '');
                // console.log('The targetID is: ' + targetID);
            } else {
                return;
            }
            // if it's an open accordion, close it
            if (this.parentNode.getAttribute('data-accordion') === 'open') {
                ebAccordionHideAll();
                return;
            }

            // did we click on a thing that wasn't an accordion?
            // which section / accordion is it inside?
            if (!this.parentNode.getAttribute('data-accordion')) {

                // console.log('We clicked on something that is not an accordion. Now to find targetID ' + targetID + ' in the DOM...');

                // find the target of the link in the DOM
                var targetOfLink = document.getElementById(targetID);
                // recursively update targetID until we have a data-accordion
                targetID = ebAccordionFindSection(targetOfLink);
            }

            // now open the right closed accordion
            ebAccordionShow(targetID);
            ebAccordionHideAllExceptThisOne(targetID);
        });
    });
}

function ebAccordionListenForHeadingClicks() {
    'use strict';

    // also listen for heading clicks
    var allTheToggleHeaders = document.querySelectorAll('[data-accordion]');
    allTheToggleHeaders.forEach(function (oneOfTheToggleHeaders) {
        oneOfTheToggleHeaders.addEventListener("click", function () {
            // simulate anchor click
            this.querySelector('a').click();
        });
    });
}

function ebAccordionListenForNavClicks() {
    'use strict';

    // also listen for nav clicks
    var navLinks = document.querySelectorAll('#nav [href]');
    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function () {
            // get the section and click to open it if it's closed
            var theSection = document.getElementById(this.hash.replace(/.*#/, ''));
            // simulate anchor click, if it's closed
            if (theSection) {
                if (theSection.getAttribute('data-accordion') === 'closed') {
                    theSection.querySelector('a').click();
                }
            }
        });
    });
}

function ebAccordionListenForHashChange() {
    'use strict';

    // console.log('Starting ebAccordionListenForHashChange...');

    window.addEventListener("hashchange", function (event) {

        // Don't treat this like a normal click on a link
        event.preventDefault();

        // get the target ID from the hash
        var targetID = window.location.hash;
        // console.log('targetID encoded: ' + targetID);

        targetID = decodeURIComponent(targetID);
        // console.log('targetID decoded: ' + targetID);

        // get the target of the link
        var targetOfLink = document.getElementById(targetID.replace(/.*#/, ''));
        // console.log('targetOfLink: ' + targetOfLink.innerHTML);

        // check if it's in the viewport already
        var targetRect = targetOfLink.getBoundingClientRect();
        var targetInViewport = targetRect.top >= -targetRect.height
                && targetRect.left >= -targetRect.width
                && targetRect.bottom <= targetRect.height + window.innerHeight
                && targetRect.right <= targetRect.width + window.innerWidth;
        // console.log('targetInViewport of ' + targetOfLink + ": " + targetInViewport);

        // check if it's an accordion
        var targetAccordionStatus = targetOfLink.parentNode.getAttribute('data-accordion');
        // console.log('targetAccordionStatus: ' + targetAccordionStatus);

        // if it's in the viewport and it's not an accordion, then exit
        if (targetInViewport && !targetAccordionStatus) {
            return;
        }

        // if it's an accordion and it's closed, open it / jump to it
        if (targetAccordionStatus === 'closed') {
            targetOfLink.querySelector('a').click();
            return;
        }

        // otherwise, open the appropriate accordion
        var targetAccordionID = ebAccordionFindSection(targetOfLink);

        ebAccordionShow(targetAccordionID);
        ebAccordionHideAllExceptThisOne(targetAccordionID);
    });
}

function ebAccordionShowDefaultSection() {
    'use strict';
    ebAccordionHideAllExceptThisOne(ebAccordionDefaultAccordionHeadID());
    ebAccordionShow(ebAccordionDefaultAccordionHeadID());
}

function ebAccordify() {
    'use strict';

    // early exit for older browsers
    if (!ebAccordionInit()) {
        return;
    }

    // exit if there aren't any headings
    var collapserTargets = accordionHeads;
    var collapserButtons = document.querySelectorAll(collapserTargets);
    if (!collapserButtons) {
        return;
    }

    // exit if this shouldn't have an accordion
    var thisIsNotAccordiable = (document.querySelector('body').getAttribute('class').indexOf('no-accordion') !== -1);
    var thisHasNoH2s = (document.querySelector(accordionHeads) === null);
    var thisIsEndmatter = (document.querySelector('body').getAttribute('class').indexOf('endmatter') !== -1);
    if (thisIsNotAccordiable || thisHasNoH2s || thisIsEndmatter) {
        return;
    }

    ebAccordionSetUpSections(collapserButtons);
    ebAccordionFillSections();
    ebMoveThemeKeys();

    if (searchTerm) {
        // loop through sections
        var accordionSections = document.querySelectorAll('section[data-accordion-container]');
        accordionSections.forEach(function (accordionSection) {

            // check for any markjs marks
            var searchTermsInSection = accordionSection.querySelectorAll('[data-markjs]');
            var numberOfSearchTermsInSection = searchTermsInSection.length;

            // mark the sections that have the search term inside
            if (!!numberOfSearchTermsInSection) {
                var sectionHeaderLink = accordionSection.querySelector('header a');
                sectionHeaderLink.innerHTML = '<mark>' + sectionHeaderLink.innerHTML + '</mark>';

                // add a mini-summary paragraph
                var searchResultsMiniSummary = document.createElement('p');
                searchResultsMiniSummary.innerHTML = numberOfSearchTermsInSection + ' search results for ' + '"<mark>' + searchTerm + '</mark>"';
                accordionSection.querySelector('header').appendChild(searchResultsMiniSummary);
            }
        });
    }

    // if there's no hash, show the first section
    // else (there is a hash, so) show that section
    if (!window.location.hash) {
        ebAccordionShowDefaultSection();
        return;
    }

    ebAccordionHideAll();
    ebAccordionShow();
}

function ebExpand() {
    'use strict';

    // Check for expand-accordion setting on page
    if (ebAccordionPageSetting() === "expand") {
        ebAccordionShowAll();
    }
}

ebAccordify();
ebExpand();
ebAccordionListenForAnchorClicks();
ebAccordionListenForHeadingClicks();
ebAccordionListenForNavClicks();
ebAccordionListenForHashChange();





