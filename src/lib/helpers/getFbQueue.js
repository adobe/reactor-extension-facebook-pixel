/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var window = require('@adobe/reactor-window');
var loadScript = require('@adobe/reactor-load-script');
var fbq;

var createFbQueue = function () {
  var fbq = function () {
    fbq.callMethod
      ? fbq.callMethod.apply(fbq, arguments)
      : fbq.queue.push(arguments);
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  return fbq;
};

if (!window.fbq) {
  fbq = createFbQueue();

  window.fbq = fbq;
  if (!window._fbq) {
    window._fbq = fbq;
  }
}

loadScript('https://connect.facebook.net/en_US/fbevents.js').then(
  function () {
    turbine.logger.log('Meta Pixel Base Code was successfully loaded.');
  },
  function () {
    turbine.logger.error('Meta Pixel Base Code could not be loaded.');
  }
);

window.fbq(
  'init',
  turbine.getExtensionSettings().pixelId,
  {},
  { agent: 'adobe_launch' }
);

module.exports = window.fbq;
