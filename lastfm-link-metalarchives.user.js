// ==UserScript==
// @name           Last.fm link to Metal Archives
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    Creates a small M in front of each artist link on www.last.fm
//                 The M's are linked to perform a band search on www.metal-archives.com
// @version        4.0
// @match          https://www.last.fm/*
// @match          https://www.lastfm.*/*
// @match          https://cn.last.fm/*
// @grant          GM_addStyle
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        .LMAa {
            font-size: 70% !important;
            display: inline;
        }
        .grid-items-item-aux-text .LMAa, .featured-item-details .LMAa {
            float: left;
            margin-right: 0.5em;
        }
    `);
    const selector = 'a:not(.auth-dropdown-menu-item):not([aria-hidden="true"])[href^="/music"]';
    function addMetalArchivesLink(artistLink) {
        const artistUrl = new URL(artistLink.href);
        const artistPath = artistUrl.pathname;
        const match = artistPath.match(/\/music\/([^/#]+)$/i);
        if (!match) return;
        const artistName = decodeURIComponent(match[1]);
        if (!artistName) return;
        if (artistLink.querySelector('.LMAa')) {
            console.log('hehehe')   
            return; // Already processed
    }
        const metalLink = document.createElement('a');
        metalLink.href = 'http://www.metal-archives.com/search?type=band_name&searchString=' + encodeURIComponent(artistName);
        metalLink.className = 'LMAa';
        metalLink.title = 'Search ' + artistName + ' on Metal Archives';
        metalLink.innerText = 'M ';
        artistLink.insertBefore(metalLink, artistLink.firstChild);
    }

    function handleAddedNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector) {
            for (const a of node.querySelectorAll(selector)) {
                addMetalArchivesLink(a);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                handleAddedNode(node);
            }
        }
    });

    const nodeListA = document.querySelectorAll(selector);
    for (const artistLink of nodeListA) {
        addMetalArchivesLink(artistLink);
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
