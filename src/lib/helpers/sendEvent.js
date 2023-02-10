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

module.exports = function (eventName, settings) {
  var fbq = require('../helpers/getFbQueue');
  var extraArguments = {};

  var extensionSettings = turbine.getExtensionSettings();
  var eventId = extensionSettings && extensionSettings.eventId;

  if (settings && settings.event_id) {
    eventId = settings.event_id;
    delete settings.event_id;
  }

  if (eventId) {
    extraArguments.eventID = eventId;
  }

  var extraArgumentsLog = JSON.stringify(extraArguments);
  var settingsLog = (settings && JSON.stringify(settings)) || '';

  fbq('track', eventName, settings, extraArguments);

  turbine.logger.log(
    `Queue command: fbq("track", "${eventName}"${
      settingsLog && settingsLog !== '{}' ? `, ${settingsLog}` : ''
    }${
      extraArguments && extraArgumentsLog !== '{}'
        ? `, ${extraArgumentsLog}`
        : ''
    }).`
  );
};
