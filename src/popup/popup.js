chrome.tabs.getSelected(null, function (tab) {
	var toggle = document.getElementById('toggle');

	var port = chrome.tabs.connect(tab.id, {
		name: "popup"
	});

	function changeHandler() {
		port.postMessage({
			from: 'popup',
			action: 'bam',
			enabled: toggle.checked
		});
	}

	function updatePopup(info) {
		toggle.checked = info.bamEnabled;
	}

	toggle.addEventListener('change', changeHandler);

	port.onMessage.addListener(updatePopup);

	port.postMessage({
		from: 'popup',
		action: 'DOMInfo'
	});
});