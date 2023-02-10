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
import React from 'react';
import WrappedComboboxField from '../../../../components/wrappedComboBox';
import { isDataElementToken } from '../../../../utils/validators';

export default {
  label: 'Status',
  hasDataElementSupport: true,
  description:
    'Boolean that shows the status of the registration or a data element.',
  render: ({ key, label, description }) => (
    <WrappedComboboxField
      key={key}
      aria-label="status"
      minWidth="size-4600"
      width="size-4600"
      name={key}
      description={description}
      label={label}
      supportDataElement
      allowsCustomValue
      defaultItems={[
        { id: 'true', name: 'true' },
        { id: 'false', name: 'false' }
      ]}
    />
  ),
  getInitialValues: (settings) => ({
    status:
      (settings?.status !== '' &&
        settings?.status !== null &&
        settings?.status !== undefined) ||
      settings?.status === false
        ? String(settings?.status)
        : ''
  }),
  getSettings: ({ status }) => {
    const settings = {};
    if (status) {
      if (status === 'false') {
        status = false;
      } else if (status === 'true') {
        status = true;
      }

      settings.status = status;
    }

    return settings;
  },
  validate: ({ status }) => {
    const errors = {};

    if (isDataElementToken(status) || status === '') {
      return errors;
    }

    if (
      !isDataElementToken(status) &&
      status !== 'false' &&
      status !== 'true'
    ) {
      errors.status = 'The status must be a boolean or a data element.';
    }

    return errors;
  }
};
