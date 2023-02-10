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
import { ContextualHelp, Heading, Content, Link } from '@adobe/react-spectrum';

import contents from './fields/contents/contentsFieldManifest';
import contentIds from './fields/contentIds/contentIdsFieldManifest';
import contentType from './fields/contentType/contentTypeFieldManifest';
import currency from './fields/currency/currencyFieldManifest';
import status from './fields/status/statusFieldManifest';
import value from './fields/value/valueFieldManifest';
import predictedLtv from './fields/predictedLtv/predictedLtvFieldManifest';
import { isDataElementToken } from '../../utils/validators';

export default {
  num_items: {
    label: 'Number of Items',
    hasDataElementSupport: true,
    description: 'The number of items when checkout was initiated.',
    // eslint-disable-next-line camelcase
    getSettings: ({ num_items: numItems }) => {
      const settings = {};
      if (numItems) {
        settings.num_items = isDataElementToken(numItems)
          ? numItems
          : Number(numItems);
      }

      return settings;
    },
    validate: ({ num_items: numItems }) => {
      const errors = {};

      if (isDataElementToken(numItems)) {
        return errors;
      }

      if (numItems) {
        const numItemsNumberValue = Number(numItems);
        if (Number.isNaN(numItemsNumberValue)) {
          errors.num_items =
            'The number of items must be a number or a data element.';
        }
      }

      return errors;
    }
  },
  content_name: {
    label: 'Content Name',
    hasDataElementSupport: true
  },
  event_id: {
    label: 'Event ID',
    hasDataElementSupport: true,
    contextualHelp: (
      <ContextualHelp>
        <Heading>Need help?</Heading>
        <Content>
          <p>
            The Event ID parameter is an identifier that can uniquely
            distinguish between similar events sent through Meta Pixel and the
            Conversions API.
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
    )
  },
  content_category: {
    label: 'Content Category',
    hasDataElementSupport: true
  },
  search_string: {
    label: 'Search String',
    hasDataElementSupport: true,
    description: 'The string entered by the user for the search.',
    getInitialValues: (settings) => {
      const searchString =
        settings?.searchString || settings?.search_string || '';

      return {
        search_string: searchString
      };
    }
  },
  status,
  value,
  currency,
  contents,
  content_ids: contentIds,
  content_type: contentType,
  predicted_ltv: predictedLtv
};
