'use strict';

String.prototype.contains = function (substring) {
    return this.indexOf(substring) > -1;
};

var bamEnabled = false;
var originalButtonCursorStyle;
var disabledContent = [];

function executeOnButton(option, modify) {
    var aTags = document.getElementsByTagName("button");

    for (var i = 0; i < aTags.length; i++) {
        if (isButtonSelected(aTags[i], option.selector)) {
            modify(aTags[i]);
        }
    }
}

function isButtonSelected(button, content) {
    return button.textContent.contains(content);
}

chrome.storage.sync.get({
    'disabledContent': []
}, function (options) {
    disabledContent = options.disabledContent;
    disabledContent.forEach(function (item) {
        executeOnButton(item, function (button) {
            if (item.disable) {
                button.disabled = true;
                originalButtonCursorStyle = button.style.cursor;
                button.style.cursor = 'not-allowed';
            }
            if (item.color) {
                button.className = button.className + ' red';
            }
        });
    });
});


function messageListener(request, sender, callback) {
    switch (request.from) {
        case 'popup':
            handlePopupRequest(request, sender, callback);
            break;
        default:
            console.warn('From not valid ' + request.from);
    }
}

/*
This method has to have this particular signature (3 params) and it will be executed
every time the content script receives a call (a request)
*/
function changeBamStatus(request, sender, callback) {
    bamEnabled = !bamEnabled;
    if (bamEnabled) {
        disabledContent.forEach(function (item) {
            executeOnButton(item, function (button) {
                button.disabled = false;
                button.style.cursor = originalButtonCursorStyle;
            });
        });
    } else {
        disabledContent.forEach(function (item) {
            executeOnButton(item, function (button) {
                if (item.disable) {
                    button.disabled = true;
                    originalButtonCursorStyle = button.style.cursor;
                    button.style.cursor = 'not-allowed';
                }
            });
        });
    }
}

/*
Here we are asking the content scripts to listen to the phone calls (requests) and
to call the method named ListeningMethod when it actually listens the ring
*/
chrome.extension.onMessage.addListener(messageListener);

// Listen for messages from the popup
function handlePopupRequest(request, sender, response) {
    switch (request.action) {
        case 'DOMInfo':
            var domInfo = {
                bamEnabled: bamEnabled
            };
            response(domInfo);
            break;
        case 'bam':
            changeBamStatus(request, sender, response);

    }
}
