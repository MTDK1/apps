import React from "react";
import BN from 'bn.js';

import { AccountSelector } from "../account-selector";
import { TxComponent, Labelled, Input, Button, TxButton } from "@polkadot/ui-app";
import { api } from "@polkadot/ui-api";
import { Codec } from "@polkadot/types/types";
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

interface Props {

}
interface State {
  accountId: string | undefined;
  applyStageLen?: Codec;
  commitStageLen?: Codec;
  minDeposit?: Codec;
  iApplayStageLen: number;
  iCommitStageLen: number;
  iMinDeposit: number;
  isValid: boolean;
}

const NOOP = () => { };

export class Settings extends TxComponent<Props, State>{

  private destroy: any[] | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      accountId: undefined,
      iApplayStageLen: 3600,
      iCommitStageLen: 3600,
      iMinDeposit: 100,
      isValid: false
    };

  }

  render() {

    const { accountId, isValid } = this.state;
    const { applyStageLen, commitStageLen, minDeposit } = this.state;
    const { iApplayStageLen, iCommitStageLen, iMinDeposit } = this.state;

    const asl = applyStageLen ? new Date(applyStageLen.toString()).getTime() / 1000 : -1;
    const csl = commitStageLen ? new Date(commitStageLen.toString()).getTime() / 1000 : -1;
    const md = minDeposit ? Number(minDeposit.toString()) : -1;

    const extrinsic = isValid ? this.getExtrinsic() : null;

    return (
      <div>
        <h1>Settings</h1>
        <AccountSelector onChangeAccount={this.onAccountChange} />
        {this.createParamComponent('Apply Stage Length [sec]', asl < 0 ? 'ERROR' : String(asl))}
        {this.createParamComponent('Commit Stage Length [sec]', csl < 0 ? 'ERROR' : String(csl))}
        {this.createParamComponent('minimum deposit [token]', md < 0 ? 'ERROR' : String(md))}
        <hr />
        <Input
          autoFocus
          className='full'
          isError={false}
          label={'Apply Stage Length [sec]'}
          onChange={this.onApplyLenChange}
          onEnter={console.log}
          value={iApplayStageLen}
        />
        <Input
          className='full'
          isError={false}
          label={'Commit Stage Length [sec]'}
          onChange={this.onCommitLenChange}
          onEnter={console.log}
          value={iCommitStageLen}
        />
        {/* 送信額 */}
        <Input
          label={'minimum deposit token'}
          onChange={this.onMinDepositChange}
          value={iMinDeposit}
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={'Submit Transaction'}
            extrinsic={extrinsic}
            ref={this.button}
          />
        </Button.Group>

      </div>
    );
  }

  createParamComponent = (label: string, value: string) => {
    return (
      <div className={`tcr--Settings tcr--actionrow`}>
        <div className='tcr--actionrow-value'>
          <Labelled
            label={
              <div className='ui--Param-text'>
                {label}
              </div>
            }
          >
            <div className='ui--output'>{value}</div>
          </Labelled>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.subscribe().then(NOOP).catch(NOOP);
  }

  componentWillUnmount() {
    this.unsbscribe().then(NOOP).catch(NOOP);
  }

  private async subscribe(): Promise<void> {

    await this.unsbscribe();

    this.destroy = [
      api.query.tcr.applyStageLen(this.cbApplyStageLen),
      api.query.tcr.commitStageLen(this.cbCommitStageLen),
      api.query.tcr.minDeposit(this.cbMinDeposit),
    ];

  }

  private async unsbscribe(): Promise<void> {
    if (this.destroy && 0 < this.destroy.length) {
      this.destroy.forEach((des) => {
        des();
      });
    }
    this.destroy = undefined;
  }

  private onAccountChange = (accountId: string) => {
    this.nextState({ accountId });
  }
  private onApplyLenChange = (value: string) => {
    const iApplayStageLen = Number(value);
    if (!isNaN(iApplayStageLen)) {
      this.nextState({ iApplayStageLen });
    }
  }
  private onMinDepositChange = (value: string) => {
    try {
      const iMinDeposit = Number(value);
      if (!isNaN(iMinDeposit)) {
        this.nextState({ iMinDeposit });
      }
    } catch (e) {
      console.error(e);
      this.nextState({ iMinDeposit: this.state.iMinDeposit });
    }
  }

  private onCommitLenChange = (value: string) => {
    const iCommitStageLen = Number(value);
    if (!isNaN(iCommitStageLen)) {
      this.nextState({ iCommitStageLen });
    }
  }

  private cbApplyStageLen = (applyStageLen: Codec) => {
    this.nextState({ applyStageLen });
  }
  private cbCommitStageLen = (commitStageLen: Codec) => {
    this.nextState({ commitStageLen });
  }
  private cbMinDeposit = (minDeposit: Codec) => {
    this.nextState({ minDeposit });
  }

  private nextState = (newState: Partial<State>): void => {
    console.log("nextState", newState);
    this.setState(
      (prevState: State): State => {

        const {
          accountId = prevState.accountId,
          applyStageLen = prevState.applyStageLen,
          commitStageLen = prevState.commitStageLen,
          minDeposit = prevState.minDeposit,
        } = newState;

        var {
          iApplayStageLen = prevState.iApplayStageLen,
          iCommitStageLen = prevState.iCommitStageLen,
          iMinDeposit = prevState.iMinDeposit
        } = newState;

        if (newState.applyStageLen) {
          iApplayStageLen = new Date(newState.applyStageLen.toString()).getTime() / 1000;
        }
        if (newState.commitStageLen) {
          iCommitStageLen = new Date(newState.commitStageLen.toString()).getTime() / 1000;
        }
        console.log("newState.minDeposit", newState.minDeposit);
        if (newState.minDeposit) {
          console.log("newState.minDeposit", Number(newState.minDeposit.toString()));
          iMinDeposit = Number(newState.minDeposit.toString());
        }
        console.log("iMinDeposit", iMinDeposit);

        const isValid = !isNaN(iApplayStageLen) && !isNaN(iCommitStageLen) && !isNaN(iMinDeposit);

        return {
          accountId,
          applyStageLen,
          commitStageLen,
          minDeposit,
          iApplayStageLen,
          iCommitStageLen,
          iMinDeposit,
          isValid,
        };
      });
  }
  private getExtrinsic = (): SubmittableExtrinsic | null => {

    const { iMinDeposit, iApplayStageLen, iCommitStageLen } = this.state;

    const minDeposit: BN = new BN(Math.min(Number.MAX_SAFE_INTEGER, iMinDeposit));
    const applayStageLen = Math.min(Number.MAX_SAFE_INTEGER, iApplayStageLen);
    const cmmitStageLen = Math.min(Number.MAX_SAFE_INTEGER, iCommitStageLen);
    return api.tx.tcr.setConfig(minDeposit, applayStageLen, cmmitStageLen);
  }
}