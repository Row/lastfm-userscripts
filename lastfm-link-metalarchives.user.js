// ==UserScript==
// @name           Last.fm link to Metal Archives
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    Creates a small M in front of each artist link on www.last.fm. The M's are linked to perform a band search on www.metal-archives.com
// @version        3.0
// @include        https://www.last.fm*
// @include        https://www.lastfm.*
// @include        https://cn.last.fm*
// ==/UserScript==

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    try {
        style.innerHTML = css;
    } catch (err) {
        style.innerText = css;
    }
    head.appendChild(style);
}

addStyle(`
    .LMAa {
        font-size: 70% !important;
        display: inline;
    }
    .grid-items-item-aux-text .LMAa, .featured-item-details .LMAa {
        float: left;
        margin-right: 0.5em;
    }
`);

function parser() {
    // Create a node-list of all a-tags
    const selector = 'a'+
                     ':not(.LMA)' +
                     ':not(.auth-dropdown-menu-item)' +
                     ':not([aria-hidden="true"])' +
                     '[href^="/music"]';

    const nodeListA = document.querySelectorAll(selector);

    // Match /music/ and one or more characters which is not / or #
    const re = /\/music\/([^/#]+)$/i;

    nodeListA.forEach(artistLink => {
        const match = artistLink.href.match(re);
        if (!match) return;

        // Remove uri query string if present
        const artist = match[1].replace(/\?.+$/, '');

        // Use className as a marker
        artistLink.className += ' LMA';

        // Create the M
        const metalLink = document.createElement('a');
        metalLink.href = 'http://www.metal-archives.com/search?type=band_name&searchString=' + artist;
        metalLink.className = 'LMAa';
        metalLink.title = 'Search ' + artist + ' on Metal Archives';
        metalLink.innerHTML = 'M ';
        artistLink.parentNode.insertBefore(metalLink, artistLink);
    });

    // Init the ticker
    window.setTimeout(parser, 1000);
}

parser();
