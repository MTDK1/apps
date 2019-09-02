// Hash から Listings を表示する

import { BaseProps } from "@polkadot/ui-api/types";
import React from "react";
import { withCall, api } from "@polkadot/ui-api";

import Params from '@polkadot/ui-params';
import { Codec } from "@polkadot/types/types";
import { TypeDef, getTypeDef } from '@polkadot/types';

interface Props<T> extends BaseProps<T> {
  callResult?: T;
  onChangeChallengeId?: (challengeId: number) => void;
}

type CallResult = any & {
  id: number,
  data: any,
  owner: string,
  deposit: number,
  application_expiry: number,
  whitelisted: boolean,
  challenge_id: string
}

function stringFromUTF8Array(data: number[]) {
  const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
  var count = data.length;
  var str = "";

  for (var index = 0; index < count;) {
    var ch = data[index++];
    if (ch & 0x80) {
      var extra = extraByteMap[(ch >> 3) & 0x07];
      if (!(ch & 0x40) || !extra || ((index + extra) > count))
        return null;

      ch = ch & (0x3F >> extra);
      for (; extra > 0; extra -= 1) {
        var chx = data[index++];
        if ((chx & 0xC0) != 0x80)
          return null;

        ch = (ch << 6) | (chx & 0x3F);
      }
    }

    str += String.fromCharCode(ch);
  }

  return str;
}

function listingItem(hash: string, onChallngeIdChanged: (id: number) => void) {

  class Inner extends React.PureComponent<Props<CallResult>> {

    private onChllengeIdChanged: (id: number) => void;
    constructor(props: any) {
      super(props);
      this.onChllengeIdChanged = onChallngeIdChanged;
    }

    public render(): React.ReactNode {

      const { callResult } = this.props;
      if (!callResult) return null;

      const types: Record<string, string> = callResult.Type;
      const params = Object.keys(types).map((name): { name: string; type: TypeDef } => ({
        name,
        type: getTypeDef(types[name])
      }));
      const values = callResult.toArray().map((value: any, idx: any): { isValid: boolean; value: Codec } => {
        if (params[idx].name === 'data') {
          value = stringFromUTF8Array(value);
        }
        return ({
          isValid: true,
          value
        })
      });

      return (
        <Params
          isDisabled
          params={params}
          values={values}
        />
      )
    }

    componentDidUpdate(_prevProps: Props<CallResult>, _prevState: any) {
      const { callResult } = this.props
      const { onChllengeIdChanged } = this;
      if (onChllengeIdChanged && callResult) {
        console.log("ChallengeID", Number(callResult.challenge_id))
        onChllengeIdChanged(Number(callResult.challenge_id));
      }
    }
  }

  const key = api.query.tcr.listings;
  const ps = [hash];
  const options =
  {
    paramName: 'params',
    paramValid: true,
    params: [key, ...ps]
  }
  const endpoint = 'subscribe';
  return withCall(endpoint, { ...options, propName: 'callResult' })(Inner);
};

export class ListingItem extends React.PureComponent<{ hash: string, onChallngeIdChanged: (id: number) => void }> {

  render() {
    console.log("ListingItem hash", this.props.hash);
    const Component = listingItem(this.props.hash, this.props.onChallngeIdChanged)
    return <Component />
  }
}