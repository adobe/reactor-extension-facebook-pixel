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

import Configuration from '../configuration';
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

const getFromFields = () => ({
  pixelIdInput: screen.queryByLabelText(/pixel id/i),
  eventIdInput: screen.queryByLabelText(/event id/i)
});

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345'
      }
    });

    const { pixelIdInput, eventIdInput } = getFromFields();

    expect(pixelIdInput.value).toBe('12345');
    // test empty eventId
    expect(eventIdInput.value).toBe('');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345'
      }
    });

    const { pixelIdInput, eventIdInput } = getFromFields();

    await changeInputValue(pixelIdInput, '123456');
    await changeInputValue(eventIdInput, '111111');

    expect(extensionBridge.getSettings()).toEqual({
      pixelId: '123456',
      eventId: '111111'
    });
  });

  test.only('handles form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345'
      }
    });

    const { pixelIdInput } = getFromFields();

    // Validate case when inputs have empty values.
    // 1. Check fields are not invalid.
    expect(pixelIdInput).not.toHaveAttribute('aria-invalid');

    // 2. Change input values.
    await changeInputValue(pixelIdInput, '');

    await extensionBridge.validate();

    // 3. Assert result.
    expect(pixelIdInput).toHaveAttribute('aria-invalid', 'true');
  });
});
