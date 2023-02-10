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

/* eslint-disable camelcase */

jest.mock('../../helpers/getFbQueue.js');

var setupTests = require('../../__test_helpers__/setupTests');
var sendEvent = require('../sendEvent');
var getFbQueue = require('../../helpers/getFbQueue.js');

describe('send event function', function () {
  beforeEach(() => {
    setupTests.setup();
  });

  afterEach(() => {
    setupTests.teardown();
  });

  test('adds call to facebook queue with the received event name and parameters', function () {
    sendEvent('AddPaymentInfo', {
      value: '100',
      currency: 'USD'
    });

    expect(getFbQueue.mock.calls[0]).toEqual([
      'track',
      'AddPaymentInfo',
      {
        value: '100',
        currency: 'USD'
      },
      {}
    ]);
  });

  test(
    'adds call to facebook queue with the event id present inside the ' +
      'settings object',
    function () {
      sendEvent('AddPaymentInfo', {
        value: '100',
        currency: 'USD',
        event_id: 'ABCD'
      });

      expect(getFbQueue.mock.calls[0]).toEqual([
        'track',
        'AddPaymentInfo',
        {
          value: '100',
          currency: 'USD'
        },
        { eventID: 'ABCD' }
      ]);
    }
  );

  test(
    'adds call to facebook queue with the event id present inside the ' +
      'extension settings object',
    function () {
      setupTests.setup({ getExtensionSettings: () => ({ eventId: 'AZA' }) });

      sendEvent('AddPaymentInfo', {
        value: '100',
        currency: 'USD'
      });

      expect(getFbQueue.mock.calls[0]).toEqual([
        'track',
        'AddPaymentInfo',
        {
          value: '100',
          currency: 'USD'
        },
        { eventID: 'AZA' }
      ]);
    }
  );

  test(
    'adds call to facebook queue with the event id present inside the ' +
      'settings object even when the extension setttings contains an event id too',
    function () {
      setupTests.setup({ getExtensionSettings: () => ({ eventId: 'AZA' }) });

      sendEvent('AddPaymentInfo', {
        value: '100',
        currency: 'USD',
        event_id: 'ABCD'
      });

      expect(getFbQueue.mock.calls[0]).toEqual([
        'track',
        'AddPaymentInfo',
        {
          value: '100',
          currency: 'USD'
        },
        { eventID: 'ABCD' }
      ]);
    }
  );

  test('logs message to turbine when no settings are present', function () {
    sendEvent('AddPaymentInfo');

    expect(turbine.logger.log.mock.calls[0]).toEqual([
      'Queue command: fbq("track", "AddPaymentInfo").'
    ]);
  });

  test('logs message to turbine when settings is an empty object', function () {
    sendEvent('AddPaymentInfo', {});

    expect(turbine.logger.log.mock.calls[0]).toEqual([
      'Queue command: fbq("track", "AddPaymentInfo").'
    ]);
  });

  test('logs message to turbine when settings is present', function () {
    sendEvent('AddPaymentInfo', { value: 100 });

    expect(turbine.logger.log.mock.calls[0]).toEqual([
      'Queue command: fbq("track", "AddPaymentInfo", {"value":100}).'
    ]);
  });

  test(
    'logs message to turbine when event id is present inside ' +
      ' the settings object',
    function () {
      sendEvent('AddPaymentInfo', { value: 100, event_id: 'ABC' });

      expect(turbine.logger.log.mock.calls[0]).toEqual([
        'Queue command: fbq("track", "AddPaymentInfo", {"value":100}, {"eventID":"ABC"}).'
      ]);
    }
  );

  test(
    'logs message to turbine when event id is present inside ' +
      ' the extension settings object',
    function () {
      setupTests.setup({ getExtensionSettings: () => ({ eventId: 'AAA' }) });
      sendEvent('AddPaymentInfo', { value: 100 });

      expect(turbine.logger.log.mock.calls[0]).toEqual([
        'Queue command: fbq("track", "AddPaymentInfo", {"value":100}, {"eventID":"AAA"}).'
      ]);
    }
  );
});
