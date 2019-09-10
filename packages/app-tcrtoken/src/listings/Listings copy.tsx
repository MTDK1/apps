// // Hash から Listings を表示する
// import React from 'react';
// import styled from 'styled-components';
// import { withCallDiv, api } from '@polkadot/ui-api';
// import valueToText from '@polkadot/ui-params/valueToText';
// import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-api/with/types';
// import { QueryParams, ListingItem } from '../types';

// interface Props {
//   className?: string;
//   label?: string;
//   value: QueryParams;
// }

// interface State {
//   Component?: React.ComponentType<{}>;
// }

// interface CacheInstance {
//   Component: React.ComponentType<any>;
//   render: RenderFn;
//   refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>;
// }

// const cache: CacheInstance[] = [];

// class Listings extends React.PureComponent<Props, State> {
//   public state: State = {};

//   public static getCachedComponent(props: QueryParams): CacheInstance {

//     const { id, params } = props;
//     const key = api.query.tcr.listings;
//     // console.log("api.query.token", api.query.token);

//     if (!cache[id]) {
//       let ps: any[] = params ? params.map((v: any) => v) : [];
//       let renderHelper;
//       let type: string;
//       // let key = api.query.tcr.owner;
//       // render function to create an element for the query results which is plugged to the api
//       // withCallDiv: <div>値</div>
//       renderHelper = withCallDiv('subscribe', {
//         paramName: 'params',
//         paramValid: true,
//         params: [key, ...ps]
//       });
//       type = key.creator ?
//         key.creator.meta
//           ? key.creator.meta.type.toString()
//           : 'Data'
//         : 'Data';


//       const defaultProps = {};//{ className: 'ui--output' };
//       const Component = renderHelper(
//         // By default we render a simple div node component with the query results in it
//         (value: any): React.ReactNode => {
//           // console.log("listing item=", value, value ? value.toString(): "no data");
//           const itemS = value ? value.toString() : "{}";
//           const item: ListingItem = JSON.parse(itemS);
//           // console.log("listing item = ", JSON.stringify(item, null, 2));
//           const { id, data, owner, deposit, application_expiry, whitelisted, challenge_id } = item;
//           const date = new Date(application_expiry * 1000);
//           const dateS = date.toLocaleString();

//           var dataString: string | null = null;

//           function stringFromUTF8Array(data: number[]) {
//             const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
//             var count = data.length;
//             var str = "";

//             for (var index = 0; index < count;) {
//               var ch = data[index++];
//               if (ch & 0x80) {
//                 var extra = extraByteMap[(ch >> 3) & 0x07];
//                 if (!(ch & 0x40) || !extra || ((index + extra) > count))
//                   return null;

//                 ch = ch & (0x3F >> extra);
//                 for (; extra > 0; extra -= 1) {
//                   var chx = data[index++];
//                   if ((chx & 0xC0) != 0x80)
//                     return null;

//                   ch = (ch << 6) | (chx & 0x3F);
//                 }
//               }

//               str += String.fromCharCode(ch);
//             }

//             return str;
//           }
//           try {
//             console.log("Listing",dataString = stringFromUTF8Array(data));
//           } catch {
//             console.log("Listing Error", data);
//           }

//           return (
//             <div>
//               <div>ID: {id}</div>
//               <div>Data: {dataString ? dataString : data}</div>
//               <div>Owner: {owner}</div>
//               <div>Deposit: {deposit}</div>
//               <div>Application Expiry: {dateS}</div>
//               <div>Whitelisted: {whitelisted ? "YES" : "NO"}</div>
//               <div>Challenge ID: {challenge_id}</div>
//             </div>
//           )
//           // valueToText(type, value, true, true)
//         },
//         defaultProps
//       );

//       cache[id] = Listings.createComponent(type, Component, defaultProps, renderHelper);
//     }
//     return cache[id];
//   }
//   public static createComponent(
//     type: string,
//     Component: React.ComponentType<any>,
//     defaultProps: DefaultProps,
//     renderHelper: ComponentRenderer): {
//       Component: React.ComponentType<any>;
//       render: (createComponent: RenderFn) => React.ComponentType<any>;
//       refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>
//     } {
//     return {
//       Component,
//       // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
//       render: (createComponent: RenderFn): React.ComponentType<any> => {
//         return renderHelper(createComponent, defaultProps);
//       },
//       // In order to modify the parameters which are used to render the default component, we can use this method
//       refresh: (swallowErrors: boolean, contentShorten: boolean): React.ComponentType<any> => {
//         return renderHelper(
//           (value: any): React.ReactNode => valueToText(type, value, swallowErrors, contentShorten),
//           defaultProps
//         );
//       }
//     };
//   }
//   public render(): React.ReactNode {
//     // const { className, label } = this.props;
//     const { Component } = this.state;

//     if (Component) {
//       return (
//         <Component />
//       );
//     } else {
//       return null;
//     }
//   }
//   public static getDerivedStateFromProps({ value }: Props): Pick<State, never> {

//     // console.log("getDerivedStateFromProps", value);
//     const Component = Listings.getCachedComponent(value).Component;

//     return {
//       Component
//     };
//   }

// }

// export default styled(Listings as React.ComponentClass<Props>)`
// margin-bottom: 0.25em;

// label {
//   text-transform: none !important;
// }

// .ui.disabled.dropdown.selection {
//   color: #aaa;
//   opacity: 1;
// }

// .ui--IdentityIcon {
//   margin: -10px 0;
//   vertical-align: middle;
// }
// `;
