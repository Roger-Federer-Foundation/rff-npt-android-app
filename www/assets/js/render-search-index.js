










var urls = ['../../book/text/0-1-titlepage.html','../../book/text/0-2-copyright.html','../../book/text/0-3-contents.html','../../book/text/0-4-introduction.html','../../book/text/01.html','../../book/text/02.html','../../book/text/03.html','../../book/text/04.html','../../book/text/05.html','../../book/text/06-00.html','../../book/text/06-01.html','../../book/text/06-02.html','../../book/text/06-03.html','../../book/text/06-04.html','../../book/text/06-05.html','../../book/text/06-06.html','../../book/text/06-07.html','../../book/text/06-08.html','../../book/text/06-09.html','../../book/text/06-10.html','../../book/text/06-11.html','../../book/text/06-12.html','../../book/text/07.html','../../book/text/50-01-glossary.html','../../book/text/50-02-references.html']



var fs = require('fs');
var page = require('webpage').create();
var index = "";
var count = 0;

function getPageData(url, count, callback) {
    'use strict';
    page.open(url, function () {

        // Get the title and scrub it
        var title = page.evaluate(function () {
            return document.title.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim();
        });

        // Get the content and scrub it
        var content = page.evaluate(function () {
            return document.body.querySelector('#content').textContent.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim();
        });

        // We want this for each page:
        // index.addDoc({
        //   id: n,
        //   title: "Title of page",
        //   content: "Content of page",
        // });
        var entry = 'index.addDoc({\n    id: ' + count + ',\n    title: "' + title + '",\n    content: "' + content + '"\n});\n';

        // Strip out backslashes to avoid invalid unicode escape sequences
        // e.g. at MathJax you can get \\uparrow, where \u will throw a JS exception
        var entryCleaned = entry.replace(/\\/g, '');

        // Add entry to the index array
        index += entryCleaned;

        callback();

        return true;

    });

}

function process() {
    'use strict';
    if (urls.length > 0) {

        console.log('Indexing ' + urls[0]);

        // Grab the first URL, then
        // drop it from the array
        var url = urls[0];
        urls.splice(0, 1);

        // do getPageData
        getPageData(url, count, process);

        // increment the counter for id
        count = count + 1;

    } else {
        console.log('Writing search-index.js...');
        fs.write('../../../assets/js/search-index.js', index, 'w');
        console.log('Done.');
        page.close();
        phantom.exit();
    }
}

console.log('Starting...');
process();
