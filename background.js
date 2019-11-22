"use strict";

const requestFilter = {
    urls: ["https://*.twitter.com/*"]
};

const extraInfoSpec = ['requestHeaders', 'blocking', 'extraHeaders'];
// Chrome will call your listener function in response to every
// HTTP request
const handler = function (details) {

    let headers = details.requestHeaders;
    let blockingResponse = {};
    const l = headers.length;
    for (let i = 0; i < l; ++i) {
        if (headers[i].name === 'User-Agent') {
            headers[i].value = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
        } else if (headers[i].name === 'Cookie') {
            headers[i].value = headers[i].value.replace(/rweb_optin=.*?(; .*)?$/i, "rweb_optin=off$1");
        }
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};

function removeCookie() {
    chrome.browsingData.remove({"origins": ["https://twitter.com"]}, {"cacheStorage": true, "cache": true});
    chrome.tabs.query({url: "*://*.twitter.com/*"}, function (result) {
        result.forEach(function (tab) {
            chrome.tabs.reload(tab.id)
        })
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(handler, requestFilter, extraInfoSpec);
chrome.runtime.onInstalled.addListener(removeCookie);
