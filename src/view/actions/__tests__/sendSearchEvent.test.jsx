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

import SendSearchEvent from '../sendSearchEvent';
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
    searchStringInput: screen.queryByLabelText(/search string/i)
  };
};

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(SendSearchEvent);

    extensionBridge.init({
      settings: {
        searchString: '12345'
      }
    });

    const { searchStringInput } = getFromFields();

    expect(searchStringInput.value).toBe('12345');
  });

  test('sets settings from form values', async () => {
    renderView(SendSearchEvent);

    extensionBridge.init({
      settings: {
        searchString: '12345'
      }
    });

    const { searchStringInput } = getFromFields();

    await changeInputValue(searchStringInput, '123456');

    expect(extensionBridge.getSettings()).toEqual({
      searchString: '123456'
    });
  });

  test('handles form validation correctly', async () => {
    renderView(SendSearchEvent);

    extensionBridge.init({
      settings: {
        stringSearch: '12345'
      }
    });

    const { searchStringInput } = getFromFields();

    // Validate case when inputs have empty values.
    // 1. Check fields are not invalid.
    expect(searchStringInput).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(searchStringInput, '');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(searchStringInput).toHaveAttribute('aria-invalid', 'true');
  });
});
