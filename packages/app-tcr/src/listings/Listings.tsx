// Hash から Listings を表示する

import { ApiProps } from "@polkadot/ui-api/types";
import React from "react";
import { withCall, api } from "@polkadot/ui-api";

import Params from '@polkadot/ui-params';
import { Codec } from "@polkadot/types/types";
import { TypeDef, getTypeDef } from '@polkadot/types';

interface Props {
  id: number;
  hash?: string;
  onChallngeIdChanged?: (id: number) => void;
  callResult?: CallResult;
  onChangeChallengeId?: (challengeId: number) => void;
}

interface State {
  Component: React.ComponentType;
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

function listingItem(props: Props, onChallngeIdChanged: (id: number) => void) {

  const { hash } = props;

  class Inner extends React.PureComponent<Props & ApiProps> {

    private onChllengeIdChanged: (id: number) => void;
    constructor(props: any) {
      super(props);
      this.onChllengeIdChanged = onChallngeIdChanged;
      this.state = {
        id: -1
      }
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
        } else if (params[idx].name === 'application_expiry') {
          value = new Date(value.toString()).toLocaleString();
        }
        return ({
          isValid: true,
          value
        })
      });

      console.log("ST");
      this.update().then(() => {console.log("NXT-2"); }).catch(() => { console.log("NXT-3");});
      console.log("NXT-1");

      return (
        <Params
          isDisabled
          params={params}
          values={values}
        />
      )
    }

    private async update() {
      if (this.onChllengeIdChanged && this.props.callResult) {
        const id = Number(this.props.callResult.challenge_id);
        if (!isNaN(id) && 0 < id) {
          console.log("ListingItem challenge_id", id);
          this.onChllengeIdChanged(id);
        }
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



export class ListingItem extends React.PureComponent<Props, State> {

  render() {

    const { id, hash } = this.props;
    const { Component } = this.state;
    if (Component) {
      return (
        <div>
          <Component />
        </div>
      );
    }
    return (
      <div>No DATA({id}: {hash})</div>
    );;
  }
  
  componentWillUnmount() {
    caches = [];
  }

  private static getCachedComponent(props: Props) {

    const { id, hash, onChallngeIdChanged = (id: any) => { } } = props;

    if (!hash || hash === 'undefined') {
      return null;
    }

    if (!caches[id]) {

      caches[id] = listingItem(props, onChallngeIdChanged);
    }
    return caches[id];
  }

  public static getDerivedStateFromProps(props: Props): Pick<State, never> {

    const Component = ListingItem.getCachedComponent(props);

    return {
      Component
    };
  }

}

var caches: React.ComponentType[] = [];