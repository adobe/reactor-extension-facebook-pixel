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

/* eslint-disable no-template-curly-in-string */

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';

import SendCustomEvent from '../sendCustomEvent';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import {
  changeInputValue,
  click,
  getTextFieldByLabel,
  queryTextFieldByLabel
} from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => {
  return {
    eventNameInput: screen.queryByLabelText(/name/i),
    addButton: screen.queryByLabelText(/add another/i)
  };
};

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(SendCustomEvent);

    extensionBridge.init({
      settings: {
        name: 'custom event',
        parameters: [{ key: 'a', value: 'b' }]
      }
    });

    const { eventNameInput } = getFromFields();
    expect(eventNameInput.value).toBe('custom event');

    expect(getTextFieldByLabel('Parameters Key 0').value).toBe('a');
    expect(getTextFieldByLabel('Parameters Value 0').value).toBe('b');
  });

  test('sets settings from form values', async () => {
    renderView(SendCustomEvent);

    extensionBridge.init({
      settings: {
        name: 'custom event',
        parameters: [{ key: 'a', value: 'b' }]
      }
    });

    const { eventNameInput } = getFromFields();

    await changeInputValue(eventNameInput, 'custom event 2');
    await changeInputValue(getTextFieldByLabel('Parameters Key 0'), 'aa');
    await changeInputValue(getTextFieldByLabel('Parameters Value 0'), 'bb');

    expect(extensionBridge.getSettings()).toEqual({
      name: 'custom event 2',
      parameters: [{ key: 'aa', value: 'bb' }]
    });
  });

  test('handles form validation correctly', async () => {
    renderView(SendCustomEvent);

    extensionBridge.init({
      settings: {
        name: 'custom event',
        parameters: [{ key: 'a', value: 'b' }]
      }
    });

    const { eventNameInput } = getFromFields();

    // Validate case when inputs have empty values.
    // 1. Check fields are not invalid.
    expect(eventNameInput).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(eventNameInput, '');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(eventNameInput).toHaveAttribute('aria-invalid', 'true');

    // Validate case when key input is not empty and value input is empty.
    // 1. Check fields are not invalid.

    let keyInput = getTextFieldByLabel('Parameters Key 0');
    let valueInput = getTextFieldByLabel('Parameters Value 0');

    expect(keyInput).not.toHaveAttribute('aria-invalid');
    expect(valueInput).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(valueInput, '');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(keyInput).not.toHaveAttribute('aria-invalid');
    expect(valueInput).toHaveAttribute('aria-invalid');

    // Validate case when key input is empty and value input is not empty.

    extensionBridge.init({
      settings: {
        name: 'custom event',
        parameters: [{ key: 'a', value: 'b' }]
      }
    });

    // 1. Check fields are not invalid.
    keyInput = getTextFieldByLabel('Parameters Key 0');
    valueInput = getTextFieldByLabel('Parameters Value 0');

    expect(keyInput).not.toHaveAttribute('aria-invalid');
    expect(valueInput).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(keyInput, '');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(keyInput).toHaveAttribute('aria-invalid');
    expect(valueInput).not.toHaveAttribute('aria-invalid');

    // Validate case when key input is duplicated.

    extensionBridge.init({
      settings: {
        name: 'custom event',
        parameters: [
          { key: 'a', value: 'b' },
          { key: 'c', value: 'd' }
        ]
      }
    });

    // 1. Check fields are not invalid.
    keyInput = getTextFieldByLabel('Parameters Key 0');
    valueInput = getTextFieldByLabel('Parameters Value 0');

    const keyInput1 = getTextFieldByLabel('Parameters Key 1');
    const valueInput1 = getTextFieldByLabel('Parameters Value 1');

    expect(keyInput).not.toHaveAttribute('aria-invalid');
    expect(valueInput).not.toHaveAttribute('aria-invalid');
    expect(keyInput1).not.toHaveAttribute('aria-invalid');
    expect(valueInput1).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(keyInput1, 'a');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(keyInput1).toHaveAttribute('aria-invalid');
    expect(valueInput1).not.toHaveAttribute('aria-invalid');
  });

  describe('key value editor', () => {
    test('allows you to add a new row', async () => {
      renderView(SendCustomEvent);

      extensionBridge.init({
        settings: {
          name: 'custom event',
          parameters: [{ key: 'a', value: 'b' }]
        }
      });

      const { addButton } = getFromFields();
      await click(addButton);

      const keyInput = getTextFieldByLabel('Parameters Key 1');
      const valueInput = getTextFieldByLabel('Parameters Value 1');

      await changeInputValue(keyInput, 'c');
      await changeInputValue(valueInput, 'd');

      expect(extensionBridge.getSettings()).toEqual({
        name: 'custom event',
        parameters: [
          { key: 'a', value: 'b' },
          { key: 'c', value: 'd' }
        ]
      });
    });

    test('allows you to delete a row', async () => {
      renderView(SendCustomEvent);

      extensionBridge.init({
        settings: {
          name: 'custom event',
          parameters: [
            { key: 'a', value: 'b' },
            { key: 'c', value: 'd' }
          ]
        }
      });

      await click(getTextFieldByLabel('Delete Parameters Row 1'));

      expect(extensionBridge.getSettings()).toEqual({
        name: 'custom event',
        parameters: [{ key: 'a', value: 'b' }]
      });
    });

    test('adds an empty row when there are no parameters', async () => {
      renderView(SendCustomEvent);

      extensionBridge.init({
        settings: {
          name: 'custom event'
        }
      });

      const keyInput = getTextFieldByLabel('Parameters Key 0');
      const valueInput = getTextFieldByLabel('Parameters Value 0');

      expect(keyInput).not.toBeNull();
      expect(valueInput).not.toBeNull();
    });

    test('does not show a delete button when there is only one empty row', async () => {
      renderView(SendCustomEvent);

      extensionBridge.init({
        settings: {
          name: 'custom event'
        }
      });
      await click();
      const deleteButton = queryTextFieldByLabel('Delete Parameters Row 0');
      expect(deleteButton).toBeNull();
    });
  });
});
