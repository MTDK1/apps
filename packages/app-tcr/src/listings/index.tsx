import React from 'react';

import { default as ListingCount } from './listingCount';
import { default as ListingHash } from './ListingHash';
import { default as ListingIndexSelector } from './ListingIndexSelector';
import { ListingItem } from './Listings';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';


// local imports and components
import translate from '../translate';
import { api } from '@polkadot/ui-api';

import { TxButton, Button, TxComponent } from '@polkadot/ui-app';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { AccountSelector } from '../account-selector';
import Challenge from '../challenges';
import { LocationProps } from '@polkadot/app-contracts/types';

// define out internal types
// type Props = AppProps & I18nProps;
type Props = AppProps & I18nProps & LocationProps;
interface State {
  accountId?: string;
  Component?: React.ComponentType<{}>;
  listingIdx?: number;
  hash?: string;
  count?: number;
  challengeId?: number;
}

class App extends TxComponent<Props, State> {
  public state: State = {
    count: 0,
  };

  constructor(props: Props) {
    super(props);
  }
  public render(): React.ReactNode {
    const { accountId, count } = this.state;
    const { t } = this.props;

    const resolveExtrinsic = this.getResolveExtrinsic();
    const challengeExtrinsic = this.getChallengeExtrinsic();

    return (
      <section>
        <AccountSelector onChangeAccount={this.onAccountChange} />
        <ListingCount
          className="listingCount"
          label="Listing Count"
          onChange={(count: number) => { this.nextState({ count }) }}
        />
        <ListingIndexSelector
          className="listingCount"
          label="Listing Index"
          count={Number(count)}
          onSelected={(idx: number) => {
            this.nextState({ listingIdx: idx })
          }}
        />
        <ListingHash
          label="Listing Hash"
          listingIdx={this.state.listingIdx}
          onChange={(hash: string) => this.nextState({ hash })}
        />
        <h2>Item</h2>
        <ListingItem id={Number(this.state.listingIdx)} hash={this.state.hash} onChallngeIdChanged={(id: number) => { this.nextState({ challengeId: id }) }} />
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
        <h2>Chllenge</h2>
        <Challenge challengeId={this.state.challengeId ? this.state.challengeId : 0} />
        ----
        </section>
    );

  }

  private nextState = (newState: State): void => {
    this.setState((prevState: State) => {
      const {
        accountId = prevState.accountId,
        Component = prevState.Component,
        listingIdx = prevState.listingIdx,
        count = prevState.count } = newState;
      var {
        hash = prevState.hash,
        challengeId = prevState.challengeId,
      } = newState;

      if (isNaN(Number(listingIdx)) || Number(listingIdx) < 0) {
        hash = undefined;
        challengeId = undefined;
      }

      if (listingIdx !== prevState.listingIdx) {
        hash = undefined;
        challengeId = undefined;
      }

      return {
        accountId,
        Component,
        listingIdx,
        hash,
        count,
        challengeId
      }

    });
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

export const Listings = translate(App);
