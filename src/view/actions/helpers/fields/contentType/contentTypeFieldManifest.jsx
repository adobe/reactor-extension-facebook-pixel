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
import { Heading, Link, ContextualHelp, Content } from '@adobe/react-spectrum';
import { isDataElementToken } from '../../../../utils/validators';
import WrappedComboboxField from '../../../../components/wrappedComboBox';

export default {
  label: 'Content Type',
  hasDataElementSupport: true,
  description: (
    <span>
      Accepted values are <strong>product</strong>,{' '}
      <strong>product_group</strong> or a data element.
    </span>
  ),
  render: ({ key, label, description }) => (
    <WrappedComboboxField
      key={key}
      minWidth="size-4600"
      width="size-4600"
      name={key}
      description={description}
      label={label}
      supportDataElement
      allowsCustomValue
      defaultItems={[
        { id: 'product', name: 'product' },
        { id: 'product_group', name: 'product_group' }
      ]}
      contextualHelp={
        <ContextualHelp>
          <Heading>Need help?</Heading>
          <Content>
            <p>
              Either <strong>product</strong> or <strong>product_group</strong>{' '}
              based on the <strong>content_ids</strong> or{' '}
              <strong>contents</strong> being passed.
            </p>
            <p>
              If the IDs being passed in <strong>content_ids</strong> or{' '}
              <strong>contents</strong> parameter are IDs of products then the
              value should be product.{' '}
            </p>
            <p>
              If product group IDs are being passed, then the value should be{' '}
              <strong>product_group</strong>.
            </p>
            <p>
              Learn more about{' '}
              <Link>
                <a
                  href="https://developers.facebook.com/docs/meta-pixel/reference#object-properties"
                  rel="noreferrer"
                  target="_blank"
                >
                  standard events properties
                </a>
              </Link>
              .
            </p>
          </Content>
        </ContextualHelp>
      }
    />
  ),
  // eslint-disable-next-line camelcase
  validate: ({ content_type }) => {
    const errors = {};
    if (isDataElementToken(content_type)) {
      return errors;
    }

    if (
      // eslint-disable-next-line camelcase
      content_type &&
      !['product', 'product_group'].includes(content_type)
    ) {
      errors.content_type =
        'The accepted values are "product", "product_group" or a data element.';
    }

    return errors;
  }
};
