// Hash から Listings を表示する

import { BaseProps } from "@polkadot/ui-api/types";
import React from "react";
import { withCall, api } from "@polkadot/ui-api";
import { Labelled } from "@polkadot/ui-app";


interface Props<T> extends BaseProps<T> {
  callResult?: T;
}

interface CallResult {
  id: number,
  data: any,
  owner: string,
  deposit: number,
  application_expiry: number,
  whitelisted: boolean,
  challenge_id: string
}

const defaultProps = { className: 'ui--output' };


class Inner extends React.PureComponent<Props<CallResult>> {

  public render(): React.ReactNode {

    const { callResult, callUpdated, className = defaultProps.className, label = '', style } = this.props;

    console.log(callResult);

    return (
      <div
        {...defaultProps}
        className={[className, callUpdated ? 'rx--updated' : undefined].join(' ')}
        style={style}
      >
        <Labelled
          label={
            <div className='ui--Param-text'>
              {label}
            </div>
          }
        >
        </Labelled>

        {item('id', '' + (callResult ? callResult.id : ''))}
        {item('owner', '' + (callResult ? callResult.owner : ''))}
        {item('whitelisted', '' + (callResult ? callResult.whitelisted : ''))}
        {item('application_expiry', '' + (callResult ? callResult.application_expiry : ''))}
        {item('deposit', '' + (callResult ? callResult.deposit : ''))}
        {item('challenge_id', '' + (callResult ? callResult.challenge_id : ''))}
        {item('data', '' + (callResult ? stringFromUTF8Array(callResult.data) : ''))}
      </div>
    );
  }
}

function item(label: string, value: string) {
  return (
    // <div className={`storage--Query storage--actionrow ${defaultProps.className}`}>
    <div className='storage--actionrow-value'>
      <Labelled
        label={
          <div className='ui--Param-text'>
            {label}
          </div>
        }
      >
        <div className='ui--output '>{value}</div>
      </Labelled>
    </div>
    // </div>
  );
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

function listingItem(hash: string) {

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

export class ListingItem extends React.PureComponent<{ hash: string }> {

  render() {
    const Component = listingItem(this.props.hash)
    return <Component />
  }
}