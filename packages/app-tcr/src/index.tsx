import React from 'react';

import { AppProps, I18nProps, BareProps } from '@polkadot/ui-app/types';
import { api } from '@polkadot/ui-api';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import translate from './translate';

import { TYPES } from './types';
import Propose from './propose';
import { Listings } from './listings';
import { Switch, Route } from 'react-router';
import { Settings } from './settings';
import { Home } from './home';

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
          text: t('Home')
        },
        {
          name: 'listings',
          text: t('Listings')
        },
        {
          name: 'propose',
          text: t('Propose')
        },
        {
          name: 'settings',
          text: t('Settings')
        }

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
          <Route path={`${basePath}/listings`} component={Listings} />
          <Route path={`${basePath}/propose`} component={Propose} />
          <Route path={`${basePath}/settings`} component={Settings} />
          <Route component={Home} />
        </Switch>
      </main>
    );
  }

}

export default translate(TcrApp);
