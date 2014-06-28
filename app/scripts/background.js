'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var syncKey = 'AceEverywhere:';
var currentUrl;
function tabLoadSetup(){
	// Get the current tab url
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// Get our sync object for this url
		currentUrl = syncKey+tabs[0].url;
		// get current setup for page.
		chrome.storage.sync.get(currentUrl, function(obj){
			// set badge accordingly
			chrome.browserAction.setBadgeText({text: obj[currentUrl]?'on':'off'});	
		});
	});	
}
tabLoadSetup();
// Update url on tab change.
chrome.tabs.onActivated.addListener(tabLoadSetup);

// Browser button clicked
chrome.browserAction.onClicked.addListener(function(){
		chrome.storage.sync.get(currentUrl, function(obj){
			// switch whatever it is
			obj[currentUrl] = !obj[currentUrl];
			// sync our change
			chrome.storage.sync.set(obj);
			// set badge accordingly
			chrome.browserAction.setBadgeText({text: obj[currentUrl]?'on':'off'});	
	});
});