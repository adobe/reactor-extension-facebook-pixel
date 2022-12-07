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

import ExtensionView from '../components/extensionView';

import ValueCurrencyFields from './valueCurrencyComponents/fields';
import getValueCurrencyInitValues from './valueCurrencyComponents/getInitValues';
import getValueCurrencySettings from './valueCurrencyComponents/getSettings';
import validateValueCurrencyFields from './valueCurrencyComponents/validate';

export default function ValueCurrency() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...getValueCurrencyInitValues(initInfo)
      })}
      getSettings={({ values }) => ({
        ...getValueCurrencySettings(values)
      })}
      validate={(values) => ({
        ...validateValueCurrencyFields(values)
      })}
      render={() => <ValueCurrencyFields />}
    />
  );
}
