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

export default {
  value: {
    label: 'Value',
    hasDataElementSupport: true
  },
  currency: {
    label: 'Currency',
    hasDataElementSupport: true
  },
  contents: {
    label: 'Contents',
    hasDataElementSupport: true
  },
  content_type: {
    label: 'Content Type',
    hasDataElementSupport: true
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
      "Product IDs associated with the event, such as SKUs (e.g. ['ABC123', 'XYZ789'])"
  }
};
