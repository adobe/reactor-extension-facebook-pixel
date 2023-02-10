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

/* eslint-disable camelcase */

export default ({ name, parameters, event_id }) => {
  const settings = {
    name
  };

  parameters = parameters.filter(
    (parameter) => parameter.key && parameter.value
  );

  if (parameters.length) {
    settings.parameters = parameters;
  }

  if (event_id) {
    settings.event_id = event_id;
  }

  return settings;
};
