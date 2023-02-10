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

import Event from '../sendViewContentEvent';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import {
  changeInputValue,
  click,
  getTextFieldByLabel
} from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFields = () => ({
  rawTextarea: screen.queryByLabelText(/content ids raw/i),
  jsonRadio: screen.getByLabelText(/content ids type json/i),
  addButton: screen.queryByLabelText(/content ids json add button/i)
});

describe('Content IDs field', () => {
  test('raw textarea is set with the array value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_ids: [1, 'ABC', '%a%']
      }
    });

    const { rawTextarea } = getFields();

    expect(rawTextarea.value).toBe('[\n  1,\n  "ABC",\n  "%a%"\n]');
  });

  test('json editor is set with the array value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_ids: [1, 'ABC', '%a%']
      }
    });

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    expect(getTextFieldByLabel('Content IDs JSON ID 0').value).toBe('1');
    expect(getTextFieldByLabel('Content IDs JSON ID 1').value).toBe('ABC');
    expect(getTextFieldByLabel('Content IDs JSON ID 2').value).toBe('%a%');
  });

  test('raw textarea is set with the data element token from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_ids: '%a%'
      }
    });

    const { rawTextarea } = getFields();

    expect(rawTextarea.value).toBe('%a%');
  });

  test(
    'raw textarea value is added to the settings object when rawTextarea has a data ' +
      'element as value',
    async () => {
      renderView(Event);

      extensionBridge.init({
        settings: {
          content_ids: '%a%'
        }
      });

      const { rawTextarea } = getFields();

      await changeInputValue(rawTextarea, '%ab%');

      expect(extensionBridge.getSettings()).toEqual({
        content_ids: '%ab%'
      });
    }
  );

  test(
    'raw textarea value is added to the settings object when rawTextarea has a JSON array ' +
      'value',
    async () => {
      renderView(Event);

      extensionBridge.init({
        settings: {
          content_ids: [1]
        }
      });

      const { rawTextarea } = getFields();

      await changeInputValue(rawTextarea, '[[1,"a","%b%"]');

      expect(extensionBridge.getSettings()).toEqual({
        content_ids: [1, 'a', '%b%']
      });
    }
  );

  test('json editor values are added to the settings object value', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_ids: [1]
      }
    });

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    const { addButton } = getFields();
    await click(addButton);
    await click(addButton);

    await changeInputValue(
      getTextFieldByLabel('Content IDs JSON ID 0'),
      'ZZZ123'
    );
    await changeInputValue(
      getTextFieldByLabel('Content IDs JSON ID 2'),
      'ZZZ3'
    );

    expect(extensionBridge.getSettings()).toEqual({
      content_ids: ['ZZZ123', 'ZZZ3']
    });
  });

  test('value is not added to the settings object when rawTextarea is empty', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        content_ids: '%a%'
      }
    });

    const { rawTextarea } = getFields();

    await changeInputValue(rawTextarea, '');

    expect(extensionBridge.getSettings()).toEqual({});
  });

  test('raw textarea validates when the value is a JSON array IDs', async () => {
    renderView(Event);

    extensionBridge.init();

    const { rawTextarea } = getFields();
    expect(rawTextarea).not.toHaveAttribute('aria-invalid');

    await changeInputValue(rawTextarea, '[[1,2]');
    await extensionBridge.validate();

    expect(rawTextarea).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('raw textarea validates when the value is a data element', async () => {
    renderView(Event);

    extensionBridge.init();

    const { rawTextarea } = getFields();
    expect(rawTextarea).not.toHaveAttribute('aria-invalid');

    await changeInputValue(rawTextarea, '%a%');
    await extensionBridge.validate();

    expect(rawTextarea).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('raw textarea does not validate when the value is a string', async () => {
    renderView(Event);

    extensionBridge.init();

    const { rawTextarea } = getFields();
    expect(rawTextarea).not.toHaveAttribute('aria-invalid');

    await changeInputValue(rawTextarea, 'aaaa');
    await extensionBridge.validate();

    expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
    expect(rawTextarea).toHaveAccessibleDescription(
      'The field must contain either a data element or a JSON array.'
    );
  });

  test('raw textarea does not validate when the value is not a valid JSON', async () => {
    renderView(Event);

    extensionBridge.init();

    const { rawTextarea } = getFields();
    expect(rawTextarea).not.toHaveAttribute('aria-invalid');

    await changeInputValue(rawTextarea, '[[{{"id": "123", "quantity": 5}');
    await extensionBridge.validate();

    expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
    expect(rawTextarea).toHaveAccessibleDescription(
      'The field must contain either a data element or a JSON array.'
    );
  });

  test(
    'raw textarea does not validate when the value is a JSON with an empty ' +
      'array',
    async () => {
      renderView(Event);

      extensionBridge.init();

      const { rawTextarea } = getFields();
      expect(rawTextarea).not.toHaveAttribute('aria-invalid');

      await changeInputValue(rawTextarea, '[[]');
      await extensionBridge.validate();

      expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
      expect(rawTextarea).toHaveAccessibleDescription(
        'The JSON must be an array. Each item of the array must be a number, ' +
          'string or a data element.'
      );
    }
  );

  test(
    'raw textarea does not validate when the item of the array is not a number, ' +
      'string or a data element',
    async () => {
      renderView(Event);

      extensionBridge.init();

      const { rawTextarea } = getFields();
      expect(rawTextarea).not.toHaveAttribute('aria-invalid');

      await changeInputValue(
        rawTextarea,
        '[[{{"id": "ABC", "quantity": 5},{{"quantity": 6}]'
      );
      await extensionBridge.validate();

      expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
      expect(rawTextarea).toHaveAccessibleDescription(
        'The 1st element of the array is not a string, number or data element.'
      );
    }
  );
});
