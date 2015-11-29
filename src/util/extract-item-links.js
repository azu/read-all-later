// LICENSE : MIT
"use strict";
import unique from "array-unique";
import stripUTM from "strip-utm";
const defaultBlackList = [
    // Mail
    /list-manage\.com/,
    /list-manage1\.com/,
    /forward-to-friend\.com/,
    /campaign-archive\.com/,
    /campaign-archive1\.com/,
    /campaign-archive2\.com/,
    // share
    /^http:\/\/twitter.com\/intent\//,
    /^http:\/\/www.facebook.com\/sharer\//
];
export function extractItemLinks(currentURL, document, options = {}) {
    const blackList = options.blackList || defaultBlackList;
    let allLinks = document.querySelectorAll("a");
    const isNotSameURL = (url) => {
        return currentURL !== url;
    };
    const removeBlackList = (url) => {
        return !blackList.some(blackRegExp => {
            return blackRegExp.test(url);
        });
    };

    const hasNotTextSibling = (prev, next)=> {
        if (prev && next) {
            return prev.nodeName !== "#text" && next.nodeName !== "#text";
        } else if (prev) {
            return prev.nodeName !== "#text"
        } else if (next) {
            return next.nodeName !== "#text"
        }
    };
    const isEmptyTextNode = (node)=> {
        if (!node) {
            return true;
        }
        if (node.nodeName !== "#text") {
            return false;
        }
        return node.nodeValue.trim().length === 0;
    };
    const isListChild = (node)=> {
        let parent = node.parentNode;
        return parent.nodeName === "LI";
    };
    const isBR = (node)=> {
        if (!node) {
            return false;
        }
        return node.nodeName === "BR";
    };
    const isLink = (node)=> {
        if (!node) {
            return false;
        }
        return node.nodeName === "A";
    };
    const filterByOnlyChild = (aLink) => {
        let prev = aLink.previousSibling;
        let prevElement = aLink.previousElementSibling;
        let next = aLink.nextSibling;
        let nextElement = aLink.nextElementSibling;
        if ((prev == null && next == null) || (prevElement == null && nextElement == null)) {
            if (isListChild(aLink)) {
                return false;
            }
            return true;
        }
        // sibling link pattern
        if (nextElement == null && (isLink(prevElement) || isBR(prevElement))) {
            return false
        }
        if (prevElement == null && (isLink(nextElement) || isBR(nextElement))) {
            return false;
        }

        // only-child
        if (hasNotTextSibling(prev, next)) {
            return true;
        }
        // empty | link | empty
        if (isEmptyTextNode(prev) && isEmptyTextNode(next)) {
            return true;
        }

        return false;
    };
    const isAbsoluteLink = (aLink) => {
        return /^https?:\/\//.test(aLink.getAttribute("href"))
    };
    var linkArray = Array.prototype.slice.call(allLinks);
    return unique(linkArray
        .filter(filterByOnlyChild)
        .filter(isAbsoluteLink)
        .map(aLink => {
            return aLink.href;
        })
        .filter(removeBlackList)
        .filter(isNotSameURL)
        .map(stripUTM)
    );
}