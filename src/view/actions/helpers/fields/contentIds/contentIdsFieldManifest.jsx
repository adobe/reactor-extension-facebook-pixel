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
import ContentIdsEditor from './contentIdsEditor';
import { isDataElementToken } from '../../../../utils/validators';
import parseJson from '../../../../utils/parseJson';
import getOrdinalNumber from '../../../../utils/getOrdinalNumber';
import { isNumber, isString } from '../../../../utils/stringAndNumberUtils';

export default {
  label: 'Content IDs',
  description:
    'Product IDs associated with the event, such as SKUs (e.g. ["ABC123", ' +
    '"XYZ789"]). The value must be an array of integers or strings or a data element.',
  render: ({ key, label, description }) => (
    <ContentIdsEditor key={key} label={label} description={description} />
  ),
  getInitialValues: (settings) => {
    let contentIdsRaw = settings?.content_ids || '';

    if (typeof contentIdsRaw !== 'string') {
      contentIdsRaw = JSON.stringify(contentIdsRaw, null, 2);
    }

    return {
      contentIdsType: 'raw',
      contentIdsRaw,
      contentsIdsJson: []
    };
  },
  getSettings: ({ contentIdsRaw, contentIdsJson, contentIdsType }) => {
    let contentIds;
    const settings = {};

    if (contentIdsType === 'json') {
      contentIds = contentIdsJson.filter((p) => p.id);
      if (Object.keys(contentIds).length === 0) {
        contentIds = null;
      } else {
        contentIds = contentIds.map(({ id }) => id);
      }
    } else {
      try {
        contentIds = JSON.parse(contentIdsRaw);
      } catch {
        contentIds = contentIdsRaw;
      }
    }

    if (contentIds) {
      if (Array.isArray(contentIds)) {
        contentIds = contentIds.map((c) => {
          const parsedNumber = Number(c);
          if (Number.isNaN(parsedNumber)) {
            return c;
          }
          return parsedNumber;
        });
      }
      settings.content_ids = contentIds;
    }

    return settings;
  },
  validate: ({ contentIdsType, contentIdsRaw }) => {
    const errors = {};
    if (contentIdsType === 'json') {
      return errors;
    }

    if (isDataElementToken(contentIdsRaw) || !contentIdsRaw) {
      return errors;
    }

    const { result, parsedJson } = parseJson(contentIdsRaw);
    if (!result) {
      errors.contentIdsRaw =
        'The field must contain either a data element or a JSON array.';

      return errors;
    }

    if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
      errors.contentIdsRaw =
        'The JSON must be an array. ' +
        'Each item of the array must be a number, string or a data element.';

      return errors;
    }

    for (let i = 0; i < parsedJson.length; i += 1) {
      const element = parsedJson[i];
      if (!isString(element) && !isNumber(element)) {
        errors.contentIdsRaw = `The ${getOrdinalNumber(
          i + 1
        )} element of the array is not a string, number or data element.`;

        break;
      }
    }

    return errors;
  }
};
