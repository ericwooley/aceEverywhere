'use strict';
/* global $ */
/* global ace */
var numEditors = 0, editor, aceEditor;
function Editor(){
	this.containerId = 'aceEverywhereContainer'+numEditors;
	this.editorId = 'aceEverywhereEditor'+numEditors;
	this.el = $('<div class="aceEverywhereContainer" id="aceEverywhereContainer'+numEditors+'" style=""><div class="aceEverywhereEditor" id="aceEverywhereEditor'+(numEditors++)+'" ></div><button >√</button></div>');

	return this;
}
function matchEle(e1, e2){
	e1 = $(e1);
	e2 = $(e2);
	// e2.html(e1.html());
	// var girth = 4;
	var position = e1.offset();
	// position.left -= girth;
	// position.top -= girth;
	e2.offset(position);
	e2.width(e1.width());
	e2.height(e1.height());
}
function destroy(el, editor){
	editor.destroy();
	el.remove();
}
function editorEvent(){
	var ta = $(this);
	editor = new Editor();
	ta.after(editor.el);
	editor.el.resizable({
		stop: function(event, ui) {
			console.log('set height width' ,ui.size);
	    ta.data('editorSize',ui.size);
		}
	});
	matchEle(this, editor.el);

	aceEditor = ace.edit(editor.editorId);
	aceEditor.setOptions({
		maxLines: 'infinity'
	});
	
	if(ta.data('position')){
		aceEditor.getSession().setValue(ta.html());
		aceEditor.moveCursorToPosition(ta.data('position'));
	} else {
		aceEditor.getSession().setValue(ta.html(), 1);
	}
	if(ta.data('editorSize')){
		editor.el.width(ta.data('editorSize').width);
		editor.el.height(ta.data('editorSize').height);
	}
	aceEditor.focus();
	aceEditor.on('change', function(){
		ta.html(aceEditor.getSession().getValue());
	});
	aceEditor.on('blur', function(){
		ta.data('position', aceEditor.getCursorPosition());
		destroy(editor.el, aceEditor);
	});
}

function setup(){
	$('textarea').focus(editorEvent);
}

var syncKey = 'AceEverywhere:';
var currentUrl = syncKey+window.location.href;
var currentlySetup = false;
$(document).ready(function(){
	chrome.storage.sync.get(currentUrl, function(obj){
		console.log('got sync', obj);
			if(obj[currentUrl]){
				setup();
				currentlySetup = true;
			}
	});
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if(namespace !== 'sync') {
		return;
	}
 if(changes[currentUrl].newValue){
 	setup();
 } else {
 	$('textarea').unbind('focus', editorEvent);
 }
});
