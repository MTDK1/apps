import { api } from "@polkadot/ui-api";
import React from "react";

import Params from '@polkadot/ui-params';
import { Codec } from "@polkadot/types/types";
import { TypeDef, getTypeDef } from '@polkadot/types';
import { Button, TxButton, TxComponent, Input } from "@polkadot/ui-app";


// Challenge

type Props = {
  accountId?: string;
  challengeId: number;
}
interface State {
  challenge?: any;
  voteDeposit: number
}

class Challenge extends TxComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      voteDeposit: 0,
    };
  }

  render() {
    // console.log(`Challenge > ${this.state.challenge}`);
    if (this.state.challenge) {
      const { challenge, voteDeposit } = this.state;
      const { accountId, challengeId } = this.props;

      const types: Record<string, string> = challenge.Type;
      const params = Object.keys(types).map((name): { name: string; type: TypeDef } => ({
        name,
        type: getTypeDef(types[name])
      }));
      const values = challenge.toArray().map((value: any, idx: number): { isValid: boolean; value: Codec } => {
        if (params[idx].name === 'voting_ends') {
          value = new Date(value.toString()).toLocaleString();
        }
        return ({
          isValid: true,
          value
        })
      });

      const yesExtrinsic = api.tx.tcr.vote(challengeId, true, voteDeposit);
      const noExtrinsic = api.tx.tcr.vote(challengeId, false, voteDeposit);

      return (
        <div>          <Params
          isDisabled
          params={params}
          values={values}
        />
          <Input
            className='full'
            isError={false}
            label={'Vote deposit'}
            onChange={this.onDepositChange}
            onEnter={console.log}
            value={voteDeposit}
          />
          <Button.Group>
            <TxButton
              accountId={accountId}
              isDisabled={false}
              isPrimary
              label={'YES'}
              extrinsic={yesExtrinsic}
              ref={this.button}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isDisabled={false}
              isPrimary
              label={'NO'}
              extrinsic={noExtrinsic}
              ref={this.button}
            />
          </Button.Group>
        </div>
      )
    }
    return null;
  }

  private onDepositChange = (value: string) => {
    const voteDeposit = Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Number(value)));
    if (isNaN(voteDeposit)) {
      return this.setState({ voteDeposit: 0 });
    }
    this.setState({ voteDeposit });
  }

  componentDidMount() {
    const { challengeId } = this.props;
    console.log("Challenge componentDidMount", challengeId);
    if (0 < challengeId) {
      api.query.tcr.challenges(challengeId)
        .then((challenge: any) => {
          this.setState({ challenge });
        });
    } else {
      this.setState({ challenge: null });
    }
  }
}
type MyState = State & { challengeId: number };
class Dis extends React.PureComponent<Props, MyState> {

  constructor(props: Props) {
    super(props);
    this.state = { challengeId: -1, voteDeposit: 0 };
  }
  render() {
    const { accountId, challengeId } = this.props;

    if (challengeId <= 0) return null;

    const component = this.createNode(challengeId, accountId);
    return (
      <div>
        {component}
      </div>
    );
  }

  createNode(id: number, accountId?: string) {
    return (
      <Challenge accountId={accountId} challengeId={id} />

    );
  }
}

export default Dis;