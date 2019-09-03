import React from 'react';
import BN from 'bn.js';

import { default as ListingCount } from './listingCount';
import { default as ListingHash } from './ListingHash';
import { default as ListingIndexSelector } from './ListingIndexSelector';
import { ListingItem } from './Listings';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';


// local imports and components
import translate from '../translate';
import { api } from '@polkadot/ui-api';

import { TxButton, Button, TxComponent, Input } from '@polkadot/ui-app';
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
  challengeDeposit: number;
}

class App extends TxComponent<Props, State> {
  public state: State = {
    count: 0,
    challengeDeposit: 0,
  };

  constructor(props: Props) {
    super(props);
  }
  public render(): React.ReactNode {
    const { accountId, count, challengeDeposit } = this.state;
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
          onChange={(hash: string) => {
            new Promise(() => { this.nextState({ hash }) }).then(() => { }).catch(() => { })
          }}
        />
        <h2>Item</h2>
        <ListingItem id={Number(this.state.listingIdx)} hash={this.state.hash} onChallngeIdChanged={(id: number) => { this.nextState({ challengeId: id }) }} />
        <Input
          className='full'
          isError={false}
          label={'Challenge deposit'}
          onChange={this.onDepositChange}
          onEnter={console.log}
          value={challengeDeposit}
        />
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
        <Challenge accountId={accountId} challengeId={this.state.challengeId ? this.state.challengeId : 0} />
        ----
        </section>
    );

  }

  private onDepositChange = (value: string) => {
    // console.log("onDepositChanged", value);
    var challengeDeposit = Number(value);
    if (isNaN(challengeDeposit)) challengeDeposit = 0;
    this.nextState({ challengeDeposit });
  }
  private nextState = (newState: Partial<State>): void => {
    this.setState((prevState: State) => {
      const {
        accountId = prevState.accountId,
        Component = prevState.Component,
        listingIdx = prevState.listingIdx,
        count = prevState.count,
      } = newState;
      var {
        hash = prevState.hash,
        challengeId = prevState.challengeId,
        challengeDeposit = prevState.challengeDeposit,
      } = newState;

      if (isNaN(Number(listingIdx)) || Number(listingIdx) < 0) {
        hash = undefined;
        challengeId = undefined;
      }

      if (listingIdx !== prevState.listingIdx) {
        hash = undefined;
        challengeId = undefined;
      }
      challengeDeposit = Math.min(Number.MAX_SAFE_INTEGER, challengeDeposit);
      return {
        accountId,
        Component,
        listingIdx,
        hash,
        count,
        challengeId,
        challengeDeposit
      }

    });
  }

  private onAccountChange = (accountId?: string): void => {
    this.setState({ accountId });
  }

  private getResolveExtrinsic = (): SubmittableExtrinsic => {
    const idx = this.state.listingIdx;
    return api.tx.tcr.resolve(idx);
  }

  private getChallengeExtrinsic = (): SubmittableExtrinsic => {
    const idx = this.state.listingIdx;
    var { challengeDeposit } = this.state;
    if (isNaN(Number(challengeDeposit))) {
      challengeDeposit = 0;
    }
    return api.tx.tcr.challenge(idx, new BN(challengeDeposit));
  }
}

export const Listings = translate(App);
