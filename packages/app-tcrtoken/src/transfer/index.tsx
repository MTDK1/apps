// トークン送信

// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTxExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React from 'react';
import { Button, InputAddress, TxButton, TxComponent, InputBalance } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';
// import { Nonce } from '@polkadot/ui-reactive';
import translate from '../translate';
// import Balance from '../account-selector/Balance';
// import TokenBalance from '../account-selector/TokenBalance';

import { AccountSelector } from '../account-selector';

type Props = ApiProps & I18nProps & {
  queueExtrinsic: QueueTxExtrinsicAdd;
};

interface State {
  isValid: boolean;
  // isValidUnsigned: boolean;
  accountNonce?: BN;
  accountId?: string;
  transferTo?: string;
  transferValue?: BN;
}

class Selection extends TxComponent<Props, State> {
  public state: State = {
    isValid: false,
    // isValidUnsigned: false
  };

  public render(): React.ReactNode {
    const { apiDefaultTxSudo, t } = this.props;
    const { isValid, accountId } = this.state;
    const extrinsic = this.getExtrinsic() || apiDefaultTxSudo;

    // console.log("extrinsic", extrinsic);

    return (
      <div className='extrinsics--Selection'>
        <h1>TCR Token 送信</h1>
        <h2>送信元</h2>
        <AccountSelector
          onChangeAccount={this.onChangeSender}
        />
        <br></br>
        <h2>送信先</h2>
        {/* 送信先 */}
        <InputAddress
          label={t('to')}
          onChange={this.onChangeTransferTo}
          type='allPlus'
        />

        {/* 送信額 */}
        <InputBalance
          help={t('送信トークン')}
          // isError={!hasAvailable}
          label={t('token')}
          onChange={this.onChangeTransferValue}
        />

        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={t('Submit Transaction')}
            extrinsic={extrinsic}
            ref={this.button}
          />
        </Button.Group>

        <br></br>
      </div>
    );
  }

  /**
   * 送信先アカウント変更イベントリスナー
   */
  private onChangeTransferTo = (transferTo: string): void => {
    this.nextState({ transferTo });
  }

  private onChangeTransferValue = (transferValue?: BN): void => {
    this.nextState({ transferValue });
  }



  private nextState(newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { accountNonce = prevState.accountNonce, accountId = prevState.accountId } = newState;
        const { transferTo = prevState.transferTo, transferValue = prevState.transferValue } = newState;
        const isValid = !!(
          accountId &&
          accountId.length &&
          transferTo &&
          transferTo.length &&
          transferValue
        );

        return {
          isValid,
          accountNonce,
          accountId,
          transferTo,
          transferValue
        };
      }
    );
  }

  // private onChangeNonce = (accountNonce: BN = new BN(0)): void => {
  //   this.nextState({ accountNonce });
  // }

  private onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) });
  }

  private getExtrinsic(): SubmittableExtrinsic | null {
    const { api } = this.props;
    const { transferTo, transferValue } = this.state;


    if (transferTo && transferTo.length != 0 && transferValue) {

      return api.tx.token.transfer(transferTo, transferValue);
    }
    return null;
  }
}

export default withMulti(
  Selection,
  translate,
  withApi
);
