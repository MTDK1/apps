// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment } from '@polkadot/types';

type Ticker = (now: Date) => void;

interface Props extends BareProps {
  value?: Moment | Date | number;
}

interface State {
  now?: Date;
}

const TICK_TIMEOUT = 100;
const tickers = new Map<Elapsed, Ticker>();

function tick (): void {
  const now = new Date();

  for (const ticker of tickers.values()) {
    ticker(now);
  }

  setTimeout(tick, TICK_TIMEOUT);
}

tick();

export default class Elapsed extends React.PureComponent<Props, State> {
  public state: State = {};

  public componentWillMount (): void {
    tickers.set(this, (now: Date): void => {
      this.setState({
        now
      });
    });
  }

  public componentWillUnmount (): void {
    tickers.delete(this);
  }

  public render (): React.ReactNode {
    const { className, style, value } = this.props;
    const { now } = this.state;

    return (
      <div
        className={['ui--Elapsed', className].join(' ')}
        style={style}
      >
        {this.getDisplayValue(now, value)}
      </div>
    );
  }

  private getDisplayValue (now?: Date, value?: Moment | Date | number): string {
    const tsNow = (now && now.getTime()) || 0;
    const tsValue = (value && ((value as any).getTime ? (value as any).getTime() : value)) || 0;
    let display = '0.0s';

    if (tsNow && tsValue) {
      const elapsed = Math.max(Math.abs(tsNow - tsValue), 0) / 1000;

      if (elapsed < 15) {
        display = `${elapsed.toFixed(1)}s`;
      } else if (elapsed < 60) {
        display = `${elapsed | 0}s`;
      } else if (elapsed < 3600) {
        display = `${elapsed / 60 | 0}m`;
      } else {
        display = `${elapsed / 3600 | 0}h`;
      }
    }

    return display;
  }
}
