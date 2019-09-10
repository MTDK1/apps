/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { InputBalance } from '@polkadot/ui-app';

type Props = BareProps & CallProps & {
  // balances_all?: DerivedBalances;
  token_balanceOf?: any;
  label?: React.ReactNode;
};

class BalanceDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, label, style, token_balanceOf } = this.props;

    return (
      <InputBalance
        className={className}
        isDisabled
        label={label}
        style={style}
        defaultValue={token_balanceOf}
      />
    );
  }
}

export default withMulti(
  BalanceDisplay,
  withCalls<Props>(
    ['query.token.balanceOf', { paramName: 'params' }]
  )
);
