// Listings
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
import translate from '../translate';
import { ApiProps } from '@polkadot/ui-api/types';
import { withApi, api } from '@polkadot/ui-api';

import { TYPES } from '../types';
import { TxButton, Button, TxComponent } from '@polkadot/ui-app';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ListingCount, ListingHash, ListingIndexSelector, ListingItem } from '.';
import { AccountSelector } from '../account-selector';


// define out internal types
// type Props = AppProps & I18nProps;
type Props = AppProps & ApiProps & I18nProps;
interface State {
  accountId?: string;
  Component?: React.ComponentType<{}>;
  listingIdx?: number;
  hash?: string;
  count: number;
}

class App extends TxComponent<Props, State> {
  public state: State = {
    count: 0,
  };

  constructor(props: Props) {
    super(props);
    api.registerTypes(TYPES);
  }
  public render(): React.ReactNode {
    const { Component, accountId, count } = this.state;

    // console.log("Tcr.render() porps = ", this.props);
    const { t } = this.props;
    // console.log("Tcr.render() api = ", api);
    if (Component) {
      return (
        <AccountSelector onChangeAccount={this.onAccountChange} />
      );
    } else {
      const resolveExtrinsic = this.getResolveExtrinsic();
      const challengeExtrinsic = this.getChallengeExtrinsic();
      // const Comp = listingItem('' + this.state.hash);
      return (
        // in all apps, the main wrapper is setup to allow the padding
        // and margins inside the application. (Just from a consistent pov)
        <section>
          <AccountSelector onChangeAccount={this.onAccountChange} />
          <ListingCount
            className="listingCount"
            label="Listing Count"
            onChange={(count: number) => { this.setState({ count }) }}
          />
          <ListingIndexSelector
            className="listingCount"
            label="Listing Index"
            count={count}
            onSelected={(idx: number) => {
              this.setState({ listingIdx: idx })
            }}
          />
          <ListingHash
            label="Listing Hash"
            listingIdx={this.state.listingIdx}
            onChange={(hash: string) => this.setState({ hash })}
          />
          <ListingItem hash={'' + this.state.hash} />
          <Button.Group>
            <TxButton
              accountId={accountId}
              isDisabled={false}
              isPrimary
              label={t('Challenge')}
              extrinsic={challengeExtrinsic}
              ref={this.button}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isDisabled={false}
              isPrimary
              label={t('Resolve')}
              extrinsic={resolveExtrinsic}
              ref={this.button}
            />
          </Button.Group>
        </section>
      );
    }
  }

  private onAccountChange = (accountId?: string): void => {
    this.setState({ accountId });
  }

  private getResolveExtrinsic(): SubmittableExtrinsic {
    const idx = this.state.listingIdx;
    return api.tx.tcr.resolve(idx);
  }

  private getChallengeExtrinsic(): SubmittableExtrinsic {
    const idx = this.state.listingIdx;
    const deposit = 10;
    return api.tx.tcr.challenge(idx, deposit);
  }
}

export default translate(withApi(App));
