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

import ValueCurrency from '../valueCurrency';
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

const getFromFields = () => {
  return {
    valueInput: screen.queryByLabelText(/value/i),
    currencyInput: screen.queryByLabelText(/currency/i)
  };
};

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(ValueCurrency);

    extensionBridge.init({
      settings: {
        value: 'abc',
        currency: 'USD'
      }
    });

    const { valueInput, currencyInput } = getFromFields();

    expect(valueInput.value).toBe('abc');
    expect(currencyInput.value).toBe('USD');
  });

  test('sets settings from form values', async () => {
    renderView(ValueCurrency);

    extensionBridge.init({
      settings: {
        value: 'abc',
        currency: 'USD'
      }
    });

    const { valueInput, currencyInput } = getFromFields();

    await changeInputValue(valueInput, 'abcd');
    await changeInputValue(currencyInput, 'EUR');

    expect(extensionBridge.getSettings()).toEqual({
      value: 'abcd',
      currency: 'EUR'
    });
  });
});
