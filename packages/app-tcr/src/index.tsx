// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// some types, AppProps for the app and I18nProps to indicate
// translatable strings. Generally the latter is quite "light",
// `t` is inject into props (see the HOC export) and `t('any text')
// does the translation
import { AppProps, I18nProps } from '@polkadot/ui-app/types';

// external imports (including those found in the packages/*
// of this repo)
import React from 'react';

// local imports and components
import AccountSelector from './AccountSelector';
import translate from './translate';
import { ApiProps } from '@polkadot/ui-api/types';
import { withApi, api } from '@polkadot/ui-api';

import Owner from './Owner';
import { TYPES } from './types';
import Transfer from './transfer';
import Propose from './propose';
import { TxComponent } from '@polkadot/ui-app';
import { Listings } from './listings';

// define out internal types
// type Props = AppProps & I18nProps;
type Props = AppProps & ApiProps & I18nProps;
interface State {
  accountId?: string;
  Component?: React.ComponentType<{}>;
  listingIdx?: number;
  hash?: string;
}

class App extends TxComponent<Props, State> {
  public state: State = {};

  constructor(props: Props) {
    super(props);
    api.registerTypes(TYPES);
  }
  public render(): React.ReactNode {
    const { Component } = this.state;

    // console.log("Tcr.render() porps = ", this.props);
    const { api } = this.props;
    // console.log("Tcr.render() api = ", api);
    if (Component) {
      return (
        <main>
          <AccountSelector onChange={this.onAccountChange} />
        </main>
      );
    } else {
      let index = 0;
      return (
        // in all apps, the main wrapper is setup to allow the padding
        // and margins inside the application. (Just from a consistent pov)
        <main>
          {/* <SummaryBar /> */}
          <AccountSelector onChange={this.onAccountChange} />
          {/* <Transfer accountId={accountId} /> */}
          <Owner
            className="owner"
            value={{ id: index++, key: api.query.tcr.owner }}
            label="Owner" />
          {/* <ListingCount
            className="listingCount"
         /> */}
          <hr />
          <h1>Listings</h1>
          <Listings />
          <hr />
          <h2>Transfer</h2>
          <Transfer />
          <hr />
          <h2>Propose</h2>
          <Propose />
        </main>
      );
    }
  }

  private onAccountChange = (accountId?: string): void => {
    this.setState({ accountId });
  }

}

export default translate(withApi(App));
