chrome.tabs.getSelected(null, function (tab) {

	var port = chrome.tabs.connect(tab.id, {
		name: "popup"
	});

	function changeHandler() {
		port.postMessage({
			from: 'popup',
			action: 'bam'
		});
	}

	function updatePopup(info) {
		document.getElementById('toggle').checked = info.bamEnabled;
	}

	document.getElementById('toggle').addEventListener('change', changeHandler);

	port.onMessage.addListener(updatePopup);

	port.postMessage({
		from: 'popup',
		action: 'DOMInfo'
	});
});