// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// some types, AppProps for the app and I18nProps to indicate
// translatable strings. Generally the latter is quite "light",
// `t` is inject into props (see the HOC export) and `t('any text')
// does the translation
import { AppProps, I18nProps } from '@polkadot/ui-app/types';

// external imports (including those found in the packages/*
// of this repo)
import React from 'react';

// local imports and components
import AccountSelector from './AccountSelector';
import translate from './translate';
import { ApiProps } from '@polkadot/ui-api/types';
import { withApi, api } from '@polkadot/ui-api';

import Owner from './Owner';
import ListingIndexSelector from './ListingIndexSelector';
import { TYPES } from './types';
import ListingHash from './ListingHash';
import Transfer from './transfer';
import Propose from './propose';

// define out internal types
// type Props = AppProps & I18nProps;
type Props = AppProps & ApiProps & I18nProps;
interface State {
  accountId?: string;
  Component?: React.ComponentType<{}>;
  listingIdx?: number;
  hash?: string;
}

class App extends React.PureComponent<Props, State> {
  public state: State = {};

  constructor(props: Props) {
    super(props);
    api.registerTypes(TYPES);
  }
  public render(): React.ReactNode {
    const { Component } = this.state;

    // console.log("Tcr.render() porps = ", this.props);
    const { api } = this.props;
    // console.log("Tcr.render() api = ", api);
    if (Component) {
      return (
        // in all apps, the main wrapper is setup to allow the padding
        // and margins inside the application. (Just from a consistent pov)
        <main>
          {/* <SummaryBar /> */}
          <AccountSelector onChange={this.onAccountChange} />
          {/* <Transfer accountId={accountId} /> */}
          {/* <Component /> */}
          {/* <Owner 
            className="owner"
            storageEntryPromise={api.query.tcr.owner} 
            label="Owner" /> */}
        </main>
      );
    } else {
      let index = 0;
      return (
        // in all apps, the main wrapper is setup to allow the padding
        // and margins inside the application. (Just from a consistent pov)
        <main>
          {/* <SummaryBar /> */}
          <AccountSelector onChange={this.onAccountChange} />
          {/* <Transfer accountId={accountId} /> */}
          <Owner
            className="owner"
            value={{ id: index++, key: api.query.tcr.owner }}
            label="Owner" />
          <Owner
            className="listingCount"
            value={{ id: index++, key: api.query.tcr.listingCount }}
            label="Listing Count" />
          <ListingIndexSelector label="Listing Index" onSelected={(idx: number) => {
            this.setState({listingIdx: idx})
          }} />
          <ListingHash label="Listing Hash" listingIdx={this.state.listingIdx} />
          <hr />
          <h2>Transfer</h2>
          <Transfer />
          <hr />
          <h2>Propose</h2>
          <Propose />
        </main>
      );
    }
  }

  private onAccountChange = (accountId?: string): void => {
    this.setState({ accountId });
  }

  // React
  // コンポーネントが読み込まれた時に呼び出される
  // constructor と render の間に呼び出される
  // https://ja.reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  public static getDerivedStateFromProps(): Pick<State, never> {

    // export default translate(withApi(App));
    // withApi(App) のところで props に api が設定されている
    // const { api } = props;

    // let defaultValue = api.query.tcr.owner;

    // api.query.tcr.listingCount({}, (value)=>{console.log("hehehe",value.toString())})
    // .then((value) => console.log(valueToText("U32", value, true, true)));

    // const values: any[] = [defaultValue]; //params.map(({ value }): any => value);
    // let s = withCallDiv('subscribe', {
    //   paramName: 'params',
    //   paramValid: true,
    //   params: [...values]
    // });
    // const defaultProps = { className: 'ui--output' };
    // const Component = s(
    //   // By default we render a simple div node component with the query results in it
    //   (value: any): React.ReactNode => valueToText("owner", value, true, true),
    //   defaultProps
    // );

    return {
      // Component
    };

  }
}

export default translate(withApi(App));
