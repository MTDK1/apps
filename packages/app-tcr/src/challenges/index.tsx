import { api } from "@polkadot/ui-api";
import React from "react";

import translate from '../translate';
import { I18nProps } from "@polkadot/ui-app/types";
import Params from '@polkadot/ui-params';
import { Codec } from "@polkadot/types/types";
import { TypeDef, getTypeDef } from '@polkadot/types';


// Challenge

type Props = {
  challengeId: number;
}
interface State {
  challenge?: any;
}

class Challenge extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(`Challenge > ${this.state.challenge}`);
    if (this.state.challenge) {
      const { challenge } = this.state;
      // {"listing_hash":"0xe45f8fc9761331ac8b09d28b7dbdb50bc5e272381bfff43ece77656a652d11c3","deposit":10,"owner":"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","voting_ends":1566913120,"resolved":false,"reward_pool":0,"total_tokens":0}
      // const { listing_hash = '', deposit = 0, owner = '', voting_ends = 0, resolved = false, reward_pool = 0, total_tokens = 0 } = challenge;

      const types: Record<string, string> = challenge.Type;
      const params = Object.keys(types).map((name): { name: string; type: TypeDef } => ({
        name,
        type: getTypeDef(types[name])
      }));
      const values = challenge.toArray().map((value: any): { isValid: boolean; value: Codec } => ({
        isValid: true,
        value
      }));

      return (
        <Params
          isDisabled
          params={params}
          values={values}
        />
      )
    }
    return null;
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
    this.state = { challengeId: -1 };
  }
  render() {
    const { challengeId } = this.props;

    if (challengeId <= 0) return null;

    const component = this.createNode(challengeId);
    return (
      <div>
        {component}
      </div>
    );
  }

  createNode(id: number) {
    return (
      <Challenge challengeId={id} />

    );
  }
}

export default Dis;