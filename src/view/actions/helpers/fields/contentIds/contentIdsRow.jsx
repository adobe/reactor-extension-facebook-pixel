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

import { ActionButton, Flex, View } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import WrappedField from '../../../../components/wrappedTextField';

export default function ContentIdsRow(remove, variable, index, variables) {
  const { id, key } = variable;

  return (
    <Flex direction="row" gap="size-200" key={`data${id}`}>
      <View flex>
        <WrappedField
          name={`contentIdsJson.${index}.id`}
          defaultValue={key}
          aria-label={`Content IDs JSON ID ${index}`}
          width="100%"
          supportDataElement
        />
      </View>
      <View width="size-450">
        {variables.length > 1 && (
          <ActionButton
            aria-label={`Delete Content IDs Row ${index}`}
            isQuiet
            onPress={() => {
              remove(index);
            }}
          >
            <Delete />
          </ActionButton>
        )}
      </View>
    </Flex>
  );
}
