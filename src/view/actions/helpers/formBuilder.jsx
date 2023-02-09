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
import { TextField, Flex, Link } from '@adobe/react-spectrum';
import WrappedTextField from '../../components/wrappedTextField';
import fieldsData from './fields';

export default (fields) => {
  return {
    getInitialValues: ({ initInfo }) => {
      const { settings } = initInfo;
      let initValues = {};

      fields.forEach((fieldKey) => {
        const values = fieldsData[fieldKey].getInitialValues?.(settings);

        if (values) {
          initValues = { ...initValues, ...values };
        } else {
          const v = settings?.[fieldKey];
          if (v !== null && v !== undefined && v !== '') {
            initValues[fieldKey] = v;
          } else {
            initValues[fieldKey] = '';
          }
        }
      });

      return initValues;
    },

    getSettings: ({ values }) => {
      let settings = {};

      fields.forEach((fieldKey) => {
        const fieldSettings = fieldsData[fieldKey].getSettings?.(values);

        if (fieldSettings) {
          settings = { ...settings, ...fieldSettings };
        } else if (values[fieldKey] !== null && values[fieldKey] !== '') {
          settings[fieldKey] = values[fieldKey];
        }
      });

      return settings;
    },
    validate: (values) => {
      let errors = {};

      fields.forEach((fieldKey) => {
        const fieldErrors = fieldsData[fieldKey].validate?.(values);
        if (fieldErrors) {
          errors = { ...errors, ...fieldErrors };
        }
      });

      return errors;
    },
    getReactComponent: () => {
      return (
        <Flex direction="column" gap="size-65">
          <Link>
            <a
              href="https://developers.facebook.com/docs/meta-pixel/reference"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about Meta Pixel&rsquo;s standard events.
            </a>
          </Link>

          {fields.map((fieldKey) => {
            const {
              label,
              hasDataElementSupport,
              description,
              contextualHelp,
              render
            } = fieldsData[fieldKey];

            return (
              render?.({
                key: fieldKey,
                label,
                description,
                hasDataElementSupport
              }) || (
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
              )
            );
          })}
        </Flex>
      );
    }
  };
};
