// ==UserScript==
// @name           Last.fm link to Metal Archives
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    Creates a small M in front of each artist link on www.last.fm
//                 The M's are linked to perform a band search on www.metal-archives.com
// @version        4.1
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
            display: inline-block;
            padding-right: 2px;
        }
        .grid-items-item-aux-text .LMAa, .featured-item-details .LMAa {
            float: left;
            margin-right: 0.5em;
        }
    `);
    const selector = 'a:not(.auth-dropdown-menu-item):not([aria-hidden="true"])[href^="/music"]';

    function addMetalArchivesLink(artistLink) {
        const artistPath = new URL(artistLink.href).pathname;
        const match = artistPath.match(/\/music\/([^/#]+)$/i);
        if (!match) return;

        const artistName = decodeURIComponent(match[1]);
        if (!artistName) return;

        const metalLink = createMetalArchivesLink(artistName);
        artistLink.parentNode.insertBefore(metalLink, artistLink);
    }

    function createMetalArchivesLink(artistName) {
        const metalLink = document.createElement('a');
        metalLink.href = `https://www.metal-archives.com/search?type=band_name&searchString=${encodeURIComponent(artistName)}`;
        metalLink.className = 'LMAa';
        metalLink.title = `Search ${artistName} on Metal Archives`;
        metalLink.innerText = 'M ';
        return metalLink;
    }

    function addMetalArchivesLinks(node) {
        const nodeListA = node.querySelectorAll(selector);
        for (const artistLink of nodeListA) {
            addMetalArchivesLink(artistLink);
        }
    }

    addMetalArchivesLinks(document);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addMetalArchivesLinks(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
