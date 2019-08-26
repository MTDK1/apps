import BN from 'bn.js';
import React from "react";
import { InputAddress, Labelled} from "@polkadot/ui-app";
import TokenBalance from "./TokenBalance";
import translate from '../translate';
import { withApi, withMulti } from '@polkadot/ui-api';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nonce } from '@polkadot/ui-reactive';
import Balance from './Balance';

type Props = ApiProps & I18nProps & {
  onChangeAccount: (accountId: string) => void;
};

interface State {
  isValid: boolean;
  accountNonce?: BN;
  accountId?: string;
  transferTo?: string;
  transferValue?: BN;
}

class AccountSelector extends React.PureComponent<Props, State> {
  public state: State = {
    isValid: false,
    // isValidUnsigned: false
  };
  public render(): React.ReactNode {
    const { t } = this.props;
    const { accountId } = this.state;

    return (
      <div className='tcr--AccountSelector'>

        <InputAddress
          label={t('using the selected account')}
          onChange={this.onChangeSender}
          type='account'
        />
        <div className='ui--row'>
          <Balance
            className='medium'
            label={t('with an account balance')}
            params={accountId}
          />
          <TokenBalance
            className='medium'
            label={t('with an account token balance')}
            params={accountId}
          />
          <Labelled
            className='medium'
            label={t('with a transaction nonce')}
          >
            <Nonce
              className='ui disabled dropdown selection'
              callOnResult={this.onChangeNonce}
              params={accountId}
            />
          </Labelled>
        </div>
      </div>

    );
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
    
    if (newState.accountId && this.state.accountId != newState.accountId) {
      this.props.onChangeAccount(newState.accountId);
    }
  }

  private onChangeNonce = (accountNonce: BN = new BN(0)): void => {
    this.nextState({ accountNonce });
  }

  private onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) });
  }

}

export default withMulti(
  AccountSelector,
  translate,
  withApi
);
