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
  pixelIdInput: screen.getByLabelText(/pixel id/i),
  eventIdInput: screen.queryByLabelText(/event id/i, {
    selector: '[name="eventId"]'
  })
});

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345',
        eventId: '54321'
      }
    });

    const { pixelIdInput, eventIdInput } = getFromFields();

    expect(pixelIdInput.value).toBe('12345');
    expect(eventIdInput.value).toBe('54321');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345',
        eventId: '54321'
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

  test('handles form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345'
      }
    });

    const { pixelIdInput } = getFromFields();
    expect(pixelIdInput).not.toHaveAttribute('aria-invalid');

    await changeInputValue(pixelIdInput, '');
    await extensionBridge.validate();

    expect(pixelIdInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('event id field is not shown for new users', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: '12345'
      }
    });

    const { eventIdInput } = getFromFields();

    expect(eventIdInput).toBeNull();
  });
});
