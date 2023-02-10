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
import {
  TextField,
  ContextualHelp,
  Content,
  Heading,
  Link
} from '@adobe/react-spectrum';
import WrappedTextField from '../../components/wrappedTextField';
import KeyValueEditor from '../../components/keyValueEditor';
import getEmptyProperty from './getEmptyPropertyValues';
import ParametersRow from './parametersRow';

export default function SendCustomEventsFields() {
  return (
    <>
      <WrappedTextField
        name="name"
        component={TextField}
        width="size-4600"
        label="Event Name"
        isRequired
        necessityIndicator="label"
        supportDataElement
      />

      <WrappedTextField
        name="event_id"
        component={TextField}
        width="size-4600"
        label="Event ID"
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                The Event ID parameter is an identifier that can uniquely
                distinguish between similar events sent through Meta Pixel and
                the Conversions API.
              </p>
              <p>
                Learn more about{' '}
                <Link>
                  <a
                    href="https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events"
                    rel="noreferrer"
                    target="_blank"
                  >
                    handling duplicate Pixel and Conversions API events
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <KeyValueEditor
        label="Parameters"
        isRequired
        necessityIndicator="label"
        name="parameters"
        getEmptyValueFn={getEmptyProperty}
        row={ParametersRow}
      />
    </>
  );
}
