function clickHandler() {
    getSelectedTab(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
            from: 'popup',
            action: 'bam'
        });
    });
}

function getSelectedTab(callback) {
    chrome.tabs.getSelected(null, callback);
}

function updatePopup(info) {
    document.getElementById('toggle').checked = info.bamEnabled;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggle').addEventListener('click', clickHandler);
    getSelectedTab(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
            from: 'popup',
            action: 'DOMInfo'
        }, updatePopup);
    });
});
