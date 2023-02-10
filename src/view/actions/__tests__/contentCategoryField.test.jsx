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

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';

import Event from '../sendAddToWishlistEvent';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getField = () => screen.getByLabelText(/content category/i);

describe('Content Category Field', () => {
  test('is set with the value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_category: '12345'
      }
    });

    const input = getField();

    expect(input.value).toBe('12345');
  });

  test('value is added to the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_category: '12345'
      }
    });

    const input = getField();
    await changeInputValue(input, '123456');

    expect(extensionBridge.getSettings()).toEqual({
      content_category: '123456'
    });
  });

  test('value is not added to the settings object when input is empty', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_category: 500
      }
    });

    const input = getField();

    await changeInputValue(input, '');

    expect(extensionBridge.getSettings()).toEqual({});
  });
});
