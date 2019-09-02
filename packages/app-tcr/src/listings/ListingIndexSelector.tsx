import React from 'react';
import styled from 'styled-components';
import { Labelled } from '@polkadot/ui-app';

type Props = {
  className?: string;
  label?: string;
  onSelected?: (index: number) => void;
  count: number;
}

interface State {
}

class ListingIndexSelector extends React.PureComponent<Props, State> {

  public state: State = {};

  public render(): React.ReactNode {
    const { className, label, count } = this.props;

    var options = [];

    for (let index = 0; index < count; index++) {
      options.push(<option key={index} value={index}>{index}</option>)
    }

    return (
      <div className={`tcr--Owner tcr--actionrow ${className}`}>
        <div className='tcr--actionrow-value'>
          <Labelled
            label={<div className='ui--Param-text'>{label}</div>}>
            <div className="ui--output">
              <select name=' idx' onChange={this.onChange}>
                <option value={-1}>------</option>
                {options}
              </select>
            </div>
          </Labelled>
        </div>
      </div>
    );
  }
  onChange = (e: React.FormEvent<HTMLSelectElement>) => {

    console.log("SELECT", e.currentTarget.value);
    const { onSelected } = this.props;
    if (onSelected) {
      onSelected(Number(e.currentTarget.value));
    } else {
      console.log('イベントリスナーが登録されていない(onSeleted)', e.currentTarget.value);
    }
  }
}

export default styled(ListingIndexSelector as React.ComponentClass<Props>)`
              margin-bottom: 0.25em;
              
label {
                  text - transform: none !important;
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
