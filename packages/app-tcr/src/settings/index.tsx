import React from "react";
import { AccountSelector } from "../account-selector";
import { TxComponent, Labelled } from "@polkadot/ui-app";
import { api } from "@polkadot/ui-api";
import { Codec } from "@polkadot/types/types";

interface Props {

}
interface State {
  accountId: string | undefined;
  applyStageLen?: Codec;
  commitStageLen?: Codec;
  minDeposit?: Codec;
}

const NOOP = () => { };

export class Settings extends TxComponent<Props, State>{

  private destroy: any[] | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      accountId: undefined,
    };

  }

  render() {

    const { applyStageLen, commitStageLen, minDeposit } = this.state;

    const asl = applyStageLen ? new Date(applyStageLen.toString()).getTime() / 1000 : -1;
    const csl = commitStageLen ? new Date(commitStageLen.toString()).getTime() / 1000 : -1;
    const md = minDeposit? Number(minDeposit.toString()): -1;

    return (
      <div>
        <h1>Settings</h1>
        <AccountSelector onChangeAccount={this.onAccountChange} />
        {this.createParamComponent('Apply Stage Length [sec]', asl < 0 ? 'ERROR' : String(asl))}
        {this.createParamComponent('Commit Stage Length [sec]', csl < 0 ? 'ERROR' : String(csl))}
        {this.createParamComponent('minimum deposit [token]', md < 0 ? 'ERROR' : String(md))}
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

        return {
          accountId,
          applyStageLen,
          commitStageLen,
          minDeposit,
        };
      });
  }
}