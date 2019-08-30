import React from 'react';
import styled from 'styled-components';
import { Labelled } from '@polkadot/ui-app';
import { api } from '@polkadot/ui-api';


const NOOP = () => { };

type Props = {
  className?: string;
  label?: string;
  onChange?: (count: number) => void;
}

interface State {
  // Component?: React.ComponentType<{}>;
  count: number
}

class ListingCount extends React.PureComponent<Props, State> {

  public state: State = {
    count: -1,
  };

  constructor(props: Props) {
    super(props);

    this.onChangeCount.bind(this);
  }

  public render(): React.ReactNode {

    const { className, label } = this.props;

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
            <div className='ui--count'>{this.state.count}</div>
          </Labelled>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.subscribe().then(NOOP).catch(NOOP);
  }
  componentWillUnmount() {
    this.unsubscribe().then(NOOP).catch(NOOP);
  }

  private async unsubscribe(): Promise<void> {
    if (this.destroy) {
      this.destroy();
      this.destroy = undefined;
    }
  }

  private destroy?: () => void;
  private async subscribe(): Promise<void> {
    await this.unsubscribe();
    this.destroy = await api.query.tcr.listingCount((value) => {
      const count = Number(value.toString());
      this.nextState({ count });
    });
  }
  private nextState = (newState: Partial<State>): void => {
    this.setState(
      (prevState: State): State => {
        const {
          count = prevState.count
        } = newState;
        if (prevState.count != count) {
          this.onChangeCount(count).then(NOOP).catch(NOOP);
        }
        return { count };
      }
    );
  }
  private async onChangeCount(count: number): Promise<void> {
    if (this.props.onChange) {
      this.props.onChange(count);
    }
  }
}

export default styled(ListingCount as React.ComponentClass<Props>)`
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
.ui--count {
  padding-left: 1.45rem;
  padding-top: 2.5rem;
  padding-bottom: 1rem;
  padding-right: 1rem;
  font-size: 30px;
  background: #fefefe;
  border-radius: 4px;
  border: 1px dashed #eee;
  box-sizing: border-box;
  line-height: 1rem;
  margin: .25rem;
 position: relative;
  word-wrap: break-word;
}
`;
