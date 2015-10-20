// ==UserScript==
// @name           Last.fm link to Metal Archives
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    Creates a small M in front of each artist link on www.last.fm. The M's are linked to perform a band search on www.metal-archives.com
// @version        2.2
// @include        http://www.last.fm*
// @include        http://www.lastfm.*
// @include        http://cn.last.fm*
// ==/UserScript==

function addStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    try {
        style.innerHTML = css;
    } catch(err) {
        style.innerText = css;
    }
    head.appendChild(style);
}

addStyle('.LMAa { font-size: 70% !important; display: inline}' +
         '.grid-items-item-aux-text>.LMAa, .countbar-bar-slug>.LMAa, .header-info-primary>.LMAa, .venn_title>LMAa, .chartlist-name>.LMAa, .site-links .LMAa {display:none}'
         );

function parser(doc)
{
    //Create a node-list of all a-tags
    var nodeListA = doc.getElementsByTagName('a');

    //Regular expression
    //Match /music/ and one or more characters which is not /
    var re = /\/music\/([^/#]+)$/i;
    var id;

    //Iterate through the node-list
    for (var i = 0; i < nodeListA.length; i++) {
        var artistLink = nodeListA[i];

        if (artistLink.className.search(/(LMA)/) > -1 || artistLink.parentNode.className.search(/js-period/) > -1)
            continue;

        //Match the href against the regular expression
        if (id = artistLink.href.match(re)) {

            // Filter
            var artist = id[1].replace(/\?.+$/, '');

            //Use className as a marker
            artistLink.className += ' LMA';

            //Create the M
            var metalLink = doc.createElement('a');
            metalLink.href = 'http://www.metal-archives.com/search?type=band_name&searchString=' + artist;
            metalLink.className = 'LMAa';
            metalLink.title = 'Search ' + artist + ' on Metal Archives';

            if (artistLink.className.search(/featured-track-subtitle/) > -1) {
                metalLink.innerHTML = "Metal Archives";
                metalLink.className += ' metadata-title';
                artistLink.parentNode.insertBefore(metalLink, artistLink);
            } else {
                metalLink.innerHTML = 'M ';
                artistLink.parentNode.insertBefore(metalLink, artistLink);
            }

            //Since the nodelist is "live".
            i++;
        }
    }

    //Init the ticker
    ticker(doc,i);
}

//Method to check if the document has changed
function ticker(doc,aCount)
{
    //if there are new a-tags
    if(aCount != doc.getElementsByTagName('a').length) {
        parser(doc);
        return;
    }

    //Call the ticker again
    window.setTimeout(function() {ticker(doc,aCount);}, 1000);
}

parser(document);
