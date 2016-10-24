var validOptions = [];
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
	chrome.storage.sync.get({
		'disabledContent': []
	}, function (options) {
		validOptions = [];
		options.disabledContent.forEach(function (item) {
			if (tab.url.indexOf(item.url) > -1) {
				validOptions.push(item);
			}
		});
	});

	if (validOptions.length > 0) {
		chrome.pageAction.show(tab.id);
		chrome.tabs.executeScript(tab.id, {
			file: 'src/content/content.js'
		}, function () {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
			}
		});
	}
});