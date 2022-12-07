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

import { Flex } from '@adobe/react-spectrum';

import ExtensionView from '../components/extensionView';

import CustomEventFields from './sendCustomEventComponents/fields';
import getCustomEventInitValues from './sendCustomEventComponents/getInitValues';
import getCustomEventSettings from './sendCustomEventComponents/getSettings';
import validateCustomEventFields from './sendCustomEventComponents/validate';

export default function SendCustomEvent() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...getCustomEventInitValues(initInfo)
      })}
      getSettings={({ values }) => ({
        ...getCustomEventSettings(values)
      })}
      validate={(values) => ({
        ...validateCustomEventFields(values)
      })}
      render={() => (
        <Flex direction="column" gap="size-65">
          <CustomEventFields />
        </Flex>
      )}
    />
  );
}
