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
var sendSearchEvent = require('../sendSearchEvent');
var getFbQueue = require('../../helpers/getFbQueue.js');

describe('send event function', function () {
  beforeEach(() => {
    setupTests.setup();
  });

  afterEach(() => {
    setupTests.teardown();
  });

  test('adds call to facebook queue when the old search settings property is used', function () {
    sendSearchEvent({
      searchEvent: 'ABC'
    });

    expect(getFbQueue.mock.calls[0]).toEqual([
      'track',
      'Search',
      {
        search_event: 'ABC'
      },
      {}
    ]);
  });
});
