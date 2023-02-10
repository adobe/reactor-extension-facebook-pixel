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
import { useFormContext } from 'react-hook-form';

import getEmptyDataJson from './getContentsEditorEmptyValue';
import Row from './contentsRow';
import RawJsonEditor from '../../../../components/rawJsonEditor';
import { isDataElementToken } from '../../../../utils/validators';
import { castToNumberIfString } from '../../../../utils/stringAndNumberUtils';

const PARAMETER_NAME = 'contents';
const PRIMARY_KEY = 'id';

const rawVariable = `${PARAMETER_NAME}Raw`;
const jsonVariable = `${PARAMETER_NAME}JsonPairs`;
const typeVariable = `${PARAMETER_NAME}Type`;

export default function ContentsEditor({ label, description }) {
  const { setValue, watch } = useFormContext();
  const [dataRaw, dataJsonPairs] = watch([rawVariable, jsonVariable]);
  return (
    <RawJsonEditor
      label={label}
      radioLabel="Select the way you want to provide the content"
      description={description}
      typeVariable={typeVariable}
      rawVariable={rawVariable}
      jsonVariable={jsonVariable}
      getEmptyJsonValueFn={getEmptyDataJson}
      row={Row}
      onTypeSwitch={(v) => {
        // Auto Update Data Content
        if (v === 'json') {
          let variables = [];
          try {
            variables = JSON.parse(dataRaw);
          } catch (e) {
            // Don't do anything
          }
          if (variables.length === 0) {
            variables.push(getEmptyDataJson());
          }

          setValue(jsonVariable, variables, {
            shouldValidate: true,
            shouldDirty: true
          });
        } else if (dataJsonPairs.length > 1 || dataJsonPairs[0][PRIMARY_KEY]) {
          let entity = JSON.stringify(
            dataJsonPairs.map(({ id, quantity }) => ({
              id,
              quantity: isDataElementToken(quantity)
                ? quantity
                : castToNumberIfString(quantity)
            })),
            null,
            2
          );

          if (entity === '{}') {
            entity = '';
          }

          setValue(rawVariable, entity, {
            shouldValidate: true,
            shouldDirty: true
          });
        }
        // END: Auto Update Data Content
      }}
    />
  );
}
