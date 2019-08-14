// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Tcr from '@polkadot/app-tcr';

export default ([
  {
    Component: Tcr,
    display: {
      isHidden: false,
      needsAccounts: false,
      needsApi: [
        'query.tcr.owner'
      ]
    },
    i18n: {
      defaultValue: 'Tcr'
    },
    icon: 'th',
    name: 'TCR'
  }
] as Routes);
