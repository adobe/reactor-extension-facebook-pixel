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

export default {
  value: {
    label: 'Value',
    hasDataElementSupport: true,
    description: 'The value of a user performing this event to the business.'
  },
  currency: {
    label: 'Currency',
    hasDataElementSupport: true,
    description: 'The currency for the value specified.'
  },
  contents: {
    label: 'Contents',
    hasDataElementSupport: true,
    description: (
      <span>
        An array of JSON objects that contains the quantity and the
        International Article Number (EAN) when applicable, or other product or
        content identifier(s). <strong>id</strong> and <strong>quantity</strong>{' '}
        are the required fields.
      </span>
    )
  },
  content_type: {
    label: 'Content Type',
    hasDataElementSupport: true,
    contextualHelp: (
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
    )
  },
  content_name: {
    label: 'Content Name',
    hasDataElementSupport: true
  },
  content_category: {
    label: 'Content Category',
    hasDataElementSupport: true
  },
  content_ids: {
    label: 'Content IDs',
    hasDataElementSupport: true,
    description:
      'Product IDs associated with the event, such as SKUs (e.g. ["ABC123", ' +
      '"XYZ789"]). The value must be an array of integers or strings.'
  }
};
