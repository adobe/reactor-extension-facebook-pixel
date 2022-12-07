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

jest.mock('@adobe/reactor-window', function () {
  return {};
});

jest.mock('@adobe/reactor-load-script', function () {
  return jest.fn().mockResolvedValue(true);
});

describe('getFbQueue module', function () {
  beforeEach(function () {
    global.turbine = {
      logger: { log: jest.fn() },
      getExtensionSettings: function () {
        return { pixelId: '12345' };
      }
    };
  });

  afterEach(function () {
    jest.clearAllMocks();
    delete global.turbine;
  });

  test('returns the facebook queue', function () {
    var getFbQueue = require('../getFbQueue');
    expect(getFbQueue).toEqual(expect.any(Function));
  });
});
