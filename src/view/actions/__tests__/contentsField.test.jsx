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

import Event from '../sendInitiateCheckoutEvent';
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
  rawTextarea: screen.queryByLabelText(/contents raw/i),
  jsonRadio: screen.getByLabelText(/contents type json/i),
  addButton: screen.queryByLabelText(/contents json pairs add button/i)
});

describe('Contents field', () => {
  test('raw textarea is set with the array value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        contents: [{ id: 'ABC', quantity: 5 }]
      }
    });

    const { rawTextarea } = getFields();

    expect(rawTextarea.value).toBe(
      '[\n  {\n    "id": "ABC",\n    "quantity": 5\n  }\n]'
    );
  });

  test('json editor is set with the array value from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        contents: [{ id: 'ABC', quantity: 5 }]
      }
    });

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    expect(getTextFieldByLabel('Contents JSON ID 0').value).toBe('ABC');
    expect(getTextFieldByLabel('Contents JSON Quantity 0').value).toBe('5');
  });

  test('raw textarea is set with the data element token from the settings object', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        contents: '%a%'
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
          contents: '%a%'
        }
      });

      const { rawTextarea } = getFields();

      await changeInputValue(rawTextarea, '%ab%');

      expect(extensionBridge.getSettings()).toEqual({
        contents: '%ab%'
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
          contents: [{ id: 'ABC', quantity: 5 }]
        }
      });

      const { rawTextarea } = getFields();

      await changeInputValue(rawTextarea, '[[{{"id": "VZX", "quantity": 55}]');

      expect(extensionBridge.getSettings()).toEqual({
        contents: [{ id: 'VZX', quantity: 55 }]
      });
    }
  );

  test('json editor values are added to the settings object value', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        contents: [{ id: 'ABC', quantity: 5 }]
      }
    });

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    const { addButton } = getFields();
    await click(addButton);
    await click(addButton);

    await changeInputValue(getTextFieldByLabel('Contents JSON ID 0'), 'ZZZ123');
    await changeInputValue(
      getTextFieldByLabel('Contents JSON Quantity 0'),
      '66'
    );

    await changeInputValue(getTextFieldByLabel('Contents JSON ID 2'), 'ZZZ3');
    await changeInputValue(
      getTextFieldByLabel('Contents JSON Quantity 2'),
      '%a%'
    );

    expect(extensionBridge.getSettings()).toEqual({
      contents: [
        { id: 'ZZZ123', quantity: 66 },
        { id: 'ZZZ3', quantity: '%a%' }
      ]
    });
  });

  test('value is not added to the settings object when rawTextarea is empty', async () => {
    renderView(Event);

    extensionBridge.init({
      settings: {
        contents: '%a%'
      }
    });

    const { rawTextarea } = getFields();

    await changeInputValue(rawTextarea, '');

    expect(extensionBridge.getSettings()).toEqual({});
  });

  test(
    'raw textarea validates when the value is a JSON array with objects having id and quantity ' +
      'attributes',
    async () => {
      renderView(Event);

      extensionBridge.init();

      const { rawTextarea } = getFields();
      expect(rawTextarea).not.toHaveAttribute('aria-invalid');

      await changeInputValue(rawTextarea, '[[{{"id": "123", "quantity": 5}]');
      await extensionBridge.validate();

      expect(rawTextarea).not.toHaveAttribute('aria-invalid', 'true');
    }
  );

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

  test('raw textarea does not validate when the value is a JSON with an empty array', async () => {
    renderView(Event);

    extensionBridge.init();

    const { rawTextarea } = getFields();
    expect(rawTextarea).not.toHaveAttribute('aria-invalid');

    await changeInputValue(rawTextarea, '[[]');
    await extensionBridge.validate();

    expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
    expect(rawTextarea).toHaveAccessibleDescription(
      'The JSON must be an array on JSON objects. Each object must have the "id" and "quantity" ' +
        'keys.'
    );
  });

  test(
    'raw textarea does not validate when the objects in the array do not ' +
      'have an ID',
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
        "The 2nd element of the array doesn't have a value for ID."
      );
    }
  );

  test(
    'raw textarea does not validate when the objects in the array do not ' +
      'have a quantity',
    async () => {
      renderView(Event);

      extensionBridge.init();

      const { rawTextarea } = getFields();
      expect(rawTextarea).not.toHaveAttribute('aria-invalid');

      await changeInputValue(
        rawTextarea,
        '[[{{"id": "ABC", "quantity": 5},{{"id": "F5"}]'
      );
      await extensionBridge.validate();

      expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
      expect(rawTextarea).toHaveAccessibleDescription(
        "The 2nd element of the array doesn't have a value for quantity."
      );
    }
  );

  test(
    'raw textarea does not validate when the objects in the array do not ' +
      'have a numer or data element as quantity',
    async () => {
      renderView(Event);

      extensionBridge.init();

      const { rawTextarea } = getFields();
      expect(rawTextarea).not.toHaveAttribute('aria-invalid');

      await changeInputValue(
        rawTextarea,
        '[[{{"id":"ABC","quantity":1},{{"id":"DEF","quantity"' +
          ':"%Data Element 1%"},{{"id":"G","quantity":"a"}]'
      );
      await extensionBridge.validate();

      expect(rawTextarea).toHaveAttribute('aria-invalid', 'true');
      expect(rawTextarea).toHaveAccessibleDescription(
        'The quantity value of 3rd element of the array must be a number or a data element.'
      );
    }
  );

  test('json editor does not validate when id is not provided but quantity is', async () => {
    renderView(Event);

    extensionBridge.init();

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    expect(getTextFieldByLabel('Contents JSON ID 0')).not.toHaveAttribute(
      'aria-invalid'
    );
    expect(getTextFieldByLabel('Contents JSON Quantity 0')).not.toHaveAttribute(
      'aria-invalid'
    );

    await changeInputValue(
      getTextFieldByLabel('Contents JSON Quantity 0'),
      '5'
    );

    await extensionBridge.validate();

    expect(getTextFieldByLabel('Contents JSON ID 0')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(
      getTextFieldByLabel('Contents JSON ID 0')
    ).toHaveAccessibleDescription('Please provide an ID.');
  });

  test('json editor does not validate when id is provided but quantity is not', async () => {
    renderView(Event);

    extensionBridge.init();

    const { jsonRadio } = getFields();
    await click(jsonRadio);

    expect(getTextFieldByLabel('Contents JSON ID 0')).not.toHaveAttribute(
      'aria-invalid'
    );
    expect(getTextFieldByLabel('Contents JSON Quantity 0')).not.toHaveAttribute(
      'aria-invalid'
    );

    await changeInputValue(getTextFieldByLabel('Contents JSON ID 0'), 'ABC5');

    await extensionBridge.validate();

    expect(getTextFieldByLabel('Contents JSON Quantity 0')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(
      getTextFieldByLabel('Contents JSON Quantity 0')
    ).toHaveAccessibleDescription('Please provide a value for quantity.');
  });

  test(
    'json editor does not validate when the provided quantity is not a ' +
      'number or data element',
    async () => {
      renderView(Event);

      extensionBridge.init({
        contents: [
          {
            id: 'abc',
            quantity: 4
          }
        ]
      });

      const { jsonRadio } = getFields();
      await click(jsonRadio);

      await changeInputValue(
        getTextFieldByLabel('Contents JSON Quantity 0'),
        'ABC'
      );

      await extensionBridge.validate();

      expect(getTextFieldByLabel('Contents JSON Quantity 0')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      expect(
        getTextFieldByLabel('Contents JSON Quantity 0')
      ).toHaveAccessibleDescription(
        'The quantity value must be a number or a data element.'
      );
    }
  );
});
