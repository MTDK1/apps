import React from 'react';

import { AppProps, I18nProps, BareProps } from '@polkadot/ui-app/types';
import { api } from '@polkadot/ui-api';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import translate from './translate';

import { TYPES } from './types';
import { Switch, Route } from 'react-router';
import Home from './transfer';

type Props = AppProps & BareProps & I18nProps;

interface State {
  tabs: TabItem[];
}

class TcrApp extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);

    api.registerTypes(TYPES);

    const { t } = props;
    this.state = {
      tabs: [
        {
          isRoot: true,
          name: 'overview',
          text: t('Transfer')
        },
      ]
    };
  }

  public render(): React.ReactNode {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <main className='tcr--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route component={Home} />
        </Switch>
      </main>
    );
  }

}

export default translate(TcrApp);
