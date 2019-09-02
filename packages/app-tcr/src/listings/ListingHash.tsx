// Index から Hash を取得し、Listings を表示する

import React from 'react';
import styled from 'styled-components';
import { withCallDiv, api } from '@polkadot/ui-api';
import valueToText from '@polkadot/ui-params/valueToText';
import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-api/with/types';
import { Labelled } from '@polkadot/ui-app';
import { u8aToHex } from '@polkadot/util';

interface Props {
  className?: string;
  label?: string;
  listingIdx?: number;
  onChange?: (hash: string) => void;
}

interface State {
  Component?: React.ComponentType<{}>;
  hash?: string;
}

interface CacheInstance {
  Component: React.ComponentType<any>;
  render: RenderFn;
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>;
}

const cache: CacheInstance[] = [];

class ListingHash extends React.PureComponent<Props, State> {
  public state: State = {};

  public static getCachedComponent({ listingIdx, onChange }: { listingIdx: number, onChange?: (hash: string) => void }): CacheInstance {

    if (!cache[listingIdx]) {
      const key = api.query.tcr.listingIndexHash;
      let ps: any[] = [listingIdx];
      let renderHelper;
      let type: string;
      renderHelper = withCallDiv('subscribe', {
        paramName: 'params',
        paramValid: true,
        params: [key, ...ps]
      });
      type = key.creator ?
        key.creator.meta
          ? key.creator.meta.type.toString()
          : 'Data'
        : 'Data';


      const defaultProps = { className: 'ui--output' };
      const Component = renderHelper(
        // By default we render a simple div node component with the query results in it
        (value: any): React.ReactNode => {
          if (value) {
            const hash = u8aToHex(value.toU8a(true), -1);
            if (onChange) onChange(hash);
            return hash;
          } else {
            return (<div>no data</div>)
          }
        },
        defaultProps
      );

      cache[listingIdx] = ListingHash.createComponent(type, Component, defaultProps, renderHelper);
    }
    return cache[listingIdx];
  }
  public static createComponent(
    type: string,
    Component: React.ComponentType<any>,
    defaultProps: DefaultProps,
    renderHelper: ComponentRenderer): {
      Component: React.ComponentType<any>;
      render: (createComponent: RenderFn) => React.ComponentType<any>;
      refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>
    } {
    return {
      Component,
      // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
      render: (createComponent: RenderFn): React.ComponentType<any> => {
        return renderHelper(createComponent, defaultProps);
      },
      // In order to modify the parameters which are used to render the default component, we can use this method
      refresh: (swallowErrors: boolean, contentShorten: boolean): React.ComponentType<any> => {
        return renderHelper(
          (value: any): React.ReactNode => valueToText(type, value, swallowErrors, contentShorten),
          defaultProps
        );
      }
    };
  }
  public render(): React.ReactNode {
    const { className, label } = this.props;
    const { Component } = this.state;

    if (Component) {
      return (
        <div className={`tcr--Owner tcr--actionrow ${className}`}>
          <div className='tcr--actionrow-value'>
            <Labelled
              label={
                <div className='ui--Param-text'>
                  {label}
                </div>
              }
            >
              <Component />
            </Labelled>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  public static getDerivedStateFromProps({ listingIdx, onChange }: Props): Pick<State, never> {

    // パラメータチェック
    if (isNaN(Number(listingIdx)) || Number(listingIdx) < 0) {
      // 数字以外、0以下の場合は画面表示しない
      console.warn("ListingHash Index is", listingIdx);
      return { Component: undefined };
    }
    console.info("ListingHash Index is", listingIdx);
    const param = {
      listingIdx: Number(listingIdx),
      onChange: onChange
    }
    const Component = ListingHash.getCachedComponent(param).Component;

    return {
      Component
    };
  }

}

export default styled(ListingHash as React.ComponentClass<Props>)`
margin-bottom: 0.25em;

label {
  text-transform: none !important;
}

.ui.disabled.dropdown.selection {
  color: #aaa;
  opacity: 1;
}

.ui--IdentityIcon {
  margin: -10px 0;
  vertical-align: middle;
}
`;
