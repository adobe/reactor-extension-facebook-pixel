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
import { isDataElementToken } from '../../../../utils/validators';

export default {
  label: 'Predicted lifetime value',
  hasDataElementSupport: true,
  description: 'The value of a user performing this event to the business.',
  getSettings: ({ predicted_ltv: predictedLtv }) => {
    const settings = {};
    if (predictedLtv) {
      const v = isDataElementToken(predictedLtv)
        ? predictedLtv
        : Number(predictedLtv);

      settings.predicted_ltv = v;
    }

    return settings;
  },
  validate: ({ predicted_ltv: predictedLtv }) => {
    const errors = {};

    if (isDataElementToken(predictedLtv)) {
      return errors;
    }

    if (predictedLtv) {
      const numberValue = Number(predictedLtv);
      if (Number.isNaN(numberValue)) {
        errors.predicted_ltv = 'The value must be a number or a data element.';
      }
    }

    return errors;
  }
};
