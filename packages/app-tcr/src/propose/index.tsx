// TCR propse

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTxExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React from 'react';
import { Button, TxButton, TxComponent, InputBalance, Input } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';
import translate from '../translate';
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
  /**
   * TCR propse data
   */
  data: string;
}

class Propose extends TxComponent<Props, State> {
  public state: State = {
    isValid: false,
    // isValidUnsigned: false
    data: ""
  };

  public render(): React.ReactNode {
    const { apiDefaultTxSudo, t } = this.props;
    const { isValid, accountId, data } = this.state;
    const extrinsic = this.getExtrinsic() || apiDefaultTxSudo;

    // console.log("extrinsic", extrinsic);

    return (
      <div className='extrinsics--Selection'>
        <AccountSelector
          onChangeAccount={this.onChangeSender}
        />
        <br></br>

        <br></br>
        {/* DATA */}
        <Input
          autoFocus
          className='full'
          help={t('TCR に登録する文字列')}
          isError={false}
          label={t('data')}
          onChange={this.onChangeData}
          onEnter={console.log}
          value={data}
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
  // private onChangeTransferTo = (transferTo: string): void => {
  //   this.nextState({ transferTo });
  // }

  private onChangeTransferValue = (transferValue?: BN): void => {
    this.nextState({ transferValue });
  }

  private onChangeData = (data: string): void => {
    this.nextState({ data });
  }

  private nextState(newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { accountNonce = prevState.accountNonce,
          accountId = prevState.accountId,
          data = prevState.data
        } = newState;
        const { transferTo = prevState.transferTo, transferValue = prevState.transferValue } = newState;
        const isValid = !!(
          accountId &&
          accountId.length &&
          data &&
          data.length &&
          transferValue
        );

        return {
          isValid,
          accountNonce,
          accountId,
          transferTo,
          transferValue,
          data
        };
      }
    );
  }

  private onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) });
  }

  private getExtrinsic(): SubmittableExtrinsic | null {
    const { api } = this.props;
    const { transferValue, data } = this.state;


    if (data && 0 < data.length && transferValue) {

      const deposit: BN = new BN(transferValue);
      return api.tx.tcr.propose(data, deposit);
    }
    return null;
  }
}

export default withMulti(
  Propose,
  translate,
  withApi
);
