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
import { json } from '@iso4217/json';
import { isDataElementToken } from '../../../../utils/validators';
import WrappedComboboxField from '../../../../components/wrappedComboBox';

const currencies = json.$data[0].$data
  .map((x) => x.$data[2]?.$data)
  .sort()
  .filter((value, index, self) => value && self.indexOf(value) === index)
  .map((x) => ({ id: x, name: x }));

export default {
  label: 'Currency',
  hasDataElementSupport: true,
  render: ({ key, label, description }) => (
    <WrappedComboboxField
      key={key}
      aria-label="currency"
      minWidth="size-4600"
      width="size-4600"
      name={key}
      description={description}
      label={label}
      supportDataElement
      allowsCustomValue
      defaultItems={currencies}
    />
  ),

  description:
    'ISO-4217 compliant currency code for the value specified or a data element.',
  validate: ({ currency }) => {
    const errors = {};

    if (isDataElementToken(currency)) {
      return errors;
    }

    if (currency && currency.length < 3) {
      errors.currency =
        'The currency must be a ISO-8601  currency code or a data element.';
    }

    return errors;
  }
};
