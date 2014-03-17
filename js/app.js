/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var debug = false;
var initialized = false;
var counter = 0;

function _updateCounterButton(count) {
  navigator.mozL10n.localize(
    document.querySelector('button'),
    'counter',
    {
      times: count
    }
  );
}

window.addEventListener('localized', function localized() {
  debug && console.log('We have l10n working!');
  if (initialized) {
    return;
  }
  counter = 0;
  _updateCounterButton(counter);
  document.getElementById('increase-counter').addEventListener('click', function() {
    ++counter;
    _updateCounterButton(counter);
  });

  document.getElementById('launch-notification').addEventListener('click', function() {
    navigator.mozApps.getSelf().onsuccess = function (evt) {
      var app = evt.target.result;
      var options = {
        icon: app.installOrigin + app.manifest.icons['60'],
        body: 'Check the body of the message'
      };
      var notification = new Notification('Basic app notification', options);
      notification.addEventListener('click', function () {
        app.launch();
      });
    };
  });

  window.navigator.mozSetMessageHandler(
    'notification',
    function onNotification() {
      navigator.mozApps.getSelf().onsuccess = function (evt) {
        var app = evt.target.result;
        app.launch();
      };
    }
  );

  initialized = true;
});