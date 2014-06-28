'use strict';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.sync.get(tabs[0].url, function(isRunning){
		chrome.browserAction.setBadgeText({text: isRunning?'on':'off'});	
	});
});
chrome.browserAction.onClicked.addListener(function(){
	alert('clicked');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.sync.get(tabs[0].url, function(isRunning){
			chrome.sync.set(tabs[0].url, !isRunning);
			chrome.browserAction.setBadgeText({text: !isRunning?'on':'off'});	
		});
	});
});
