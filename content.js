'use strict'
String.prototype.contains = function (substring) {
    return this.indexOf(substring) > -1;
}

var bamEnabled = false;
var buttonStyle;

function executeOnButton(condition, modify) {
    var aTags = document.getElementsByTagName("button");

    for (var i = 0; i < aTags.length; i++) {
        if (condition(aTags[i])) {
            modify(aTags[i]);
        }
    }
}

function isLiveButton(button) {
    return button.textContent.contains('Promote to live');
}

executeOnButton(isLiveButton, function (button) {
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    button.className = 'button red';
});

/*
This method has to have this particular signature (3 params) and it will be executed
every time the content script receives a call (a request)
*/
function changeBamStatus(request, sender, callback) {
    if (request.action === 'bam') {
        bamEnabled = !bamEnabled;
        if (bamEnabled) {
            executeOnButton(isLiveButton, function (button) {
                button.disabled = false;
                button.style.cursor = originalButtonCursorStyle;
            });
        } else {
            executeOnButton(isLiveButton, function (button) {
                button.disabled = true;
                originalButtonCursorStyle = button.style.cursor;
                button.style.cursor = 'not-allowed';
            });
        }
    } else {
        console.error('Action not defined');
    }
}

/*
Here we are asking the content scripts to listen to the phone calls (requests) and
to call the method named ListeningMethod when it actually listens the ring
*/
chrome.extension.onMessage.addListener(changeBamStatus);

// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        // Collect the necessary data
        // (For your specific requirements `document.querySelectorAll(...)`
        //  should be equivalent to jquery's `$(...)`)
        var domInfo = {
            bamEnabled: bamEnabled
        };

        // Directly respond to the sender (popup),
        // through the specified callback */
        response(domInfo);
    }
});