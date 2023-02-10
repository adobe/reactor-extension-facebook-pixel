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

import Event from '../sendPurchaseEvent';
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

const getField = () =>
  screen.getByLabelText(/number of items/i, { selector: '[name="num_items"]' });

describe('Number of Items field', () => {
  test('is set with the number value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: 500
      }
    });

    const input = getField();

    expect(input.value).toBe('500');
  });

  test('is set with 0 from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: 0
      }
    });

    const input = getField();

    expect(input.value).toBe('0');
  });

  test('is set with the data element token from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: '%a%'
      }
    });

    const input = getField();

    expect(input.value).toBe('%a%');
  });

  test('value is added to the settings object when input has a data element as value', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: '%a%'
      }
    });

    const input = getField();

    await changeInputValue(input, '%ab%');

    expect(extensionBridge.getSettings()).toEqual({
      num_items: '%ab%'
    });
  });

  test('value is added to the settings object when input has a number value', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: 500
      }
    });

    const input = getField();

    await changeInputValue(input, '600');

    expect(extensionBridge.getSettings()).toEqual({
      num_items: 600
    });
  });

  test('value is added to the settings object when input has value 0', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: 500
      }
    });

    const input = getField();

    await changeInputValue(input, '0');

    expect(extensionBridge.getSettings()).toEqual({
      num_items: 0
    });
  });

  test('value is not added to the settings object when input is empty', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        num_items: 500
      }
    });

    const input = getField();

    await changeInputValue(input, '');

    expect(extensionBridge.getSettings()).toEqual({});
  });

  test('validates when the value is a number', async () => {
    renderView(Event);

    extensionBridge.init();

    const input = getField();
    expect(input).not.toHaveAttribute('aria-invalid');

    await changeInputValue(input, '5');
    await extensionBridge.validate();

    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('validates when the value is a data element', async () => {
    renderView(Event);

    extensionBridge.init();

    const input = getField();
    expect(input).not.toHaveAttribute('aria-invalid');

    await changeInputValue(input, '%a%');
    await extensionBridge.validate();

    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('validates when the value is a string that is not a data element', async () => {
    renderView(Event);

    extensionBridge.init();

    const input = getField();
    expect(input).not.toHaveAttribute('aria-invalid');

    await changeInputValue(input, 'a');
    await extensionBridge.validate();

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
