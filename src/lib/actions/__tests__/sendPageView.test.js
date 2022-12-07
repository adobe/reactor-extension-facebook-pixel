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

jest.mock('../../helpers/getFbQueue.js');

var setupTests = require('../../__test_helpers__/setupTests');
var sendPageView = require('../sendPageView');
var getFbQueue = require('../../helpers/getFbQueue.js');

describe('Send Page View module', function () {
  setupTests.setup();

  test('add call to facebook queue', function () {
    sendPageView();
    expect(getFbQueue.mock.calls[0]).toEqual([
      'track',
      'PageView',
      {},
      { eventID: setupTests.mockEventId }
    ]);
  });

  test('logs message to turbine', function () {
    sendPageView();
    expect(turbine.logger.log.mock.calls[0]).toEqual([
      `Queue command: fbq("track", "PageView") with eventId: ${setupTests.mockEventId}.`
    ]);
  });
});
