import React from "react";
import { DefaultProps, ComponentRenderer, RenderFn } from "@polkadot/ui-api/with/types";
import { Labelled } from "@polkadot/ui-app";
import { withCallDiv, api } from "@polkadot/ui-api";
import valueToText from "@polkadot/ui-params/valueToText";
import styled from "styled-components";

// Index のドロップダウンリストを表示
// 選択された Index に対する Listings を表示する

interface ListingIndexSelectorProps {
  // インデックス撰択
  onSelected?: (index: number) => void;
  count: number;
}

interface ListingIndexSelectorState {
  // nothing
}

const cache: CacheInstance[] = [];

class ListingIndexSelector extends React.PureComponent<ListingIndexSelectorProps, ListingIndexSelectorState> {

  constructor(props: ListingIndexSelectorProps) {
    super(props);
  }

  render() {

    const { count } = this.props;

    var options = [];
    for (let index = 0; index < count; index++) {
      options.push(<option value={index}>{index}</option>)
    }
    console.log(options);
    return (
      <select name=' month' onChange={this.onChange}>
        <option value={-1}>------</option>
        {options}
      </select>
    )
  }

  onChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { onSelected } = this.props;
    if (onSelected) {
      onSelected(Number(e.currentTarget.value));
    } else {
      console.log('イベントリスナーが登録されていない(onSeleted)', e.currentTarget.value);
    }
  }
}

interface Props {
  // インデックス撰択
  onSelected?: (index: number) => void;
  // 撰択
  selected?: number;
  className?: string;
  label?: string;
  // value: QueryParams;
}
interface State {
  Component?: React.ComponentType<{}>;
}

interface CacheInstance {
  Component: React.ComponentType<any>;
  render: RenderFn;
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>;
}

class ListingSelector extends React.PureComponent<Props, State> {

  public static getCachedComponent(props: Props): CacheInstance {

    if (!cache[0]) {
      const key = api.query.tcr.listingCount;

      const renderHelper = withCallDiv('subscribe', {
        paramName: 'params',
        paramValid: true,
        params: [key]
      });
      const type = key.creator ?
        key.creator.meta
          ? key.creator.meta.type.toString()
          : 'Data'
        : 'Data';


      const defaultProps = { className: 'ui--output' };
      const Component = renderHelper(
        // By default we render a simple div node component with the query results in it
        (value: any): React.ReactNode => (<ListingIndexSelector onSelected={props.onSelected} count={Number(value)} />), //valueToText(type, value, true, true),
        defaultProps
      );

      cache[0] = ListingSelector.createComponent(type, Component, defaultProps, renderHelper);
    }
    return cache[0];
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
  public static getDerivedStateFromProps(props: Props): Pick<State, never> {

    console.log("getDerivedStateFromProps", props);
    const Component = ListingSelector.getCachedComponent(props).Component;

    return {
      Component
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
      return null;
    }
  }
}

export default styled(ListingSelector as React.ComponentClass<Props>)`
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