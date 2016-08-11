//chrome.runtime.onMessage.addListener(function(msg, sender) {
//  // First, validate the message's structure
//  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
//    // Enable the page-action for the requesting tab
//    chrome.pageAction.show(sender.tab.id);
//  }
//});

var validOptions = [];
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    chrome.storage.sync.get({
        'disabledContent': []
    }, function (options) {

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
