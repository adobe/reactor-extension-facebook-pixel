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

import ExtensionView from '../components/extensionView';

import ValueCurrency from './fields/valueCurrency';
import ContentCategory from './fields/contentCategory';
import ContentName from './fields/contentName';
import ContentIds from './fields/contentIds';
import Contents from './fields/contents';

import initialValues from './helpers/getInitValues';
import settings from './helpers/getSettings';
import validate from './helpers/validate';

export default function SendAddToWhislistEvent() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...initialValues(initInfo)
      })}
      getSettings={({ values }) => ({
        ...settings(values)
      })}
      validate={(values) => ({
        ...validate(values)
      })}
      render={() => (
        <>
          <ValueCurrency />
          <ContentName />
          <ContentCategory />
          <ContentIds />
          <Contents />
        </>
      )}
    />
  );
}
