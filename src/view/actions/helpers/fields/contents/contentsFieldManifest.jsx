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
import ContentsEditor from './contentsEditor';
import { isDataElementToken } from '../../../../utils/validators';
import parseJson from '../../../../utils/parseJson';
import getOrdinalNumber from '../../../../utils/getOrdinalNumber';
import {
  isNumber,
  castToNumberIfString
} from '../../../../utils/stringAndNumberUtils';

export default {
  label: 'Contents',
  description: (
    <span>
      An array of JSON objects that contains the quantity and the International
      Article Number (EAN) when applicable, or other product or content
      identifier(s). <strong>id</strong> and <strong>quantity</strong> are the
      required fields.
    </span>
  ),
  render: ({ key, label, description }) => (
    <ContentsEditor key={key} label={label} description={description} />
  ),
  getInitialValues: (settings) => {
    let contentsRaw = settings?.contents || '';

    if (typeof contentsRaw !== 'string') {
      contentsRaw = JSON.stringify(contentsRaw, null, 2);
    }

    return {
      contentsType: 'raw',
      contentsRaw,
      contentsJsonPairs: []
    };
  },
  getSettings: ({ contentsRaw, contentsJsonPairs, contentsType }) => {
    let contents;
    const settings = {};

    if (contentsType === 'json') {
      contents = contentsJsonPairs.filter((p) => p.id || p.quantity);
      if (Object.keys(contents).length === 0) {
        contents = null;
      }
    } else {
      try {
        contents = JSON.parse(contentsRaw);
      } catch {
        contents = contentsRaw;
      }
    }

    if (contents) {
      if (Array.isArray(contents)) {
        contents = contents.map(({ id, quantity }) => ({
          id: String(id),
          quantity: isDataElementToken(quantity)
            ? quantity
            : castToNumberIfString(quantity)
        }));
      }
      settings.contents = contents;
    }

    return settings;
  },
  validate: ({ contentsType, contentsJsonPairs, contentsRaw }) => {
    const errors = {};
    if (contentsType === 'json') {
      contentsJsonPairs
        .filter((item) => item.id || item.quantity)
        .forEach((element, id) => {
          if (!element.id) {
            errors[`contentsJsonPairs.${id}.id`] = 'Please provide an ID.';
          }

          if (!element.quantity) {
            errors[`contentsJsonPairs.${id}.quantity`] =
              'Please provide a value for quantity.';
          }

          if (
            !isDataElementToken(element.quantity) &&
            !isNumber(castToNumberIfString(element.quantity))
          ) {
            errors[
              `contentsJsonPairs.${id}.quantity`
            ] = `The quantity value must be a number or a data element.`;
          }
        });
    }

    if (isDataElementToken(contentsRaw) || !contentsRaw) {
      return errors;
    }

    const { result, parsedJson } = parseJson(contentsRaw);
    if (!result) {
      errors.contentsRaw =
        'The field must contain either a data element or a JSON array.';

      return errors;
    }

    if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
      errors.contentsRaw =
        'The JSON must be an array on JSON objects. ' +
        'Each object must have the "id" and "quantity" keys.';

      return errors;
    }

    for (let i = 0; i < parsedJson.length; i += 1) {
      const element = parsedJson[i];
      if (!element.id) {
        errors.contentsRaw = `The ${getOrdinalNumber(
          i + 1
        )} element of the array doesn't have a value for ID.`;

        break;
      }

      if (!element.quantity) {
        errors.contentsRaw = `The ${getOrdinalNumber(
          i + 1
        )} element of the array doesn't have a value for quantity.`;

        break;
      }

      if (
        !isDataElementToken(element.quantity) &&
        !isNumber(castToNumberIfString(element.quantity))
      ) {
        errors.contentsRaw = `The quantity value of ${getOrdinalNumber(
          i + 1
        )} element of the array must be a number or a data element.`;

        break;
      }
    }

    return errors;
  }
};
