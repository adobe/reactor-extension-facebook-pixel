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
import { TextField, Flex } from '@adobe/react-spectrum';
import WrappedTextField from '../../components/wrappedTextField';
import fieldsData from './fields';

export default (fields) => {
  return {
    getInitialValues: ({ initInfo }) => {
      const { settings } = initInfo;
      const initValues = {};

      fields.forEach((fieldKey) => {
        initValues[fieldKey] = settings?.[fieldKey] || '';
      });

      return initValues;
    },

    getSettings: ({ values }) => {
      const settings = {};

      Object.entries(values).forEach(([name, value]) => {
        if (value) {
          settings[name] = value;
        }
      });

      return settings;
    },
    validate: () => {
      const errors = {};

      return errors;
    },
    getReactComponent: () => {
      return (
        <Flex direction="column" gap="size-65">
          {fields.map((fieldKey) => {
            const {
              label,
              hasDataElementSupport,
              description,
              contextualHelp
            } = fieldsData[fieldKey];
            return (
              <WrappedTextField
                key={fieldKey}
                name={fieldKey}
                component={TextField}
                width="size-4600"
                label={label}
                description={description}
                contextualHelp={contextualHelp}
                supportDataElement={hasDataElementSupport}
              />
            );
          })}
        </Flex>
      );
    }
  };
};
