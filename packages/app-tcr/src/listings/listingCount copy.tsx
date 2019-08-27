// import React from 'react';
// import styled from 'styled-components';
// import { withCallDiv } from '@polkadot/ui-api';
// import valueToText from '@polkadot/ui-params/valueToText';
// // import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-api/with/types';
// import { Labelled } from '@polkadot/ui-app';
// import { api } from '@polkadot/ui-api';

// type Props = {
//   className?: string;
//   // label?: string;
//   // onSelected?: (index: number) => void;
//   onChange?: (count: number) => void;
// }

// interface State {
//   // Component?: React.ComponentType<{}>;
//   count: number
// }

// class ListingCount extends React.PureComponent<Props, State> {

//   public state: State = {
//     count: 0,
//   };

//   public render(): React.ReactNode {
//     const { className } = this.props;
//     const { count } = this.state;
//     const key = api.query.tcr.listingCount;
//     const renderHelper = withCallDiv('subscribe', {
//       paramName: 'params',
//       paramValid: true,
//       params: [key]
//     });
//     const type = key.creator ?
//       key.creator.meta
//         ? key.creator.meta.type.toString()
//         : 'Data'
//       : 'Data';

//     const Component1 = renderHelper(
//       // By default we render a simple div node component with the query results in it
//       (value: any): React.ReactNode => {
//         this.nextState({ count: value });
//         return (
//           <div>
//             {valueToText(type, value, true, true)}
//           </div>
//         )
//       },
//       { className: 'ui--output' }
//     );
//     const Component2 = renderHelper(
//       // By default we render a simple div node component with the query results in it
//       (value: any): React.ReactNode => {
//         var options = [];

//         for (let index = 0; index < value; index++) {
//           options.push(<option value={index}>{index}</option>)
//         }

//         return (
//           <div>
//             <select name=' idx' onChange={this.onChange}>
//               <option value={-1}>------</option>
//               {options}
//             </select>
//           </div>
//         )
//       },
//       { className: 'ui--output' }
//     );
//     return (
//       <div className={`tcr--Owner tcr--actionrow ${className}`}>
//         <div className='tcr--actionrow-value'>
//           <Labelled
//             label={
//               <div className='ui--Param-text'>
//                 Listing Count
//               </div>
//             }
//           >
//             <Component1 />
//           </Labelled>
//           <Labelled
//             label={
//               <div className='ui--Param-text'>
//                 Listing Index
//               </div>
//             }
//           >
//             <Component2 />
//           </Labelled>
//         </div>
//       </div>
//     );
//   }
//   private nextState = (newState: Partial<State>): void => {
//     this.setState(
//       (prevState: State): State => {
//         const { count = prevState.count } = newState;
//         return { count };
//       }
//     );
//   }
//   // onChange = (e: React.FormEvent<HTMLSelectElement>) => {
//   //   const { onSelected } = this.props;
//   //   if (onSelected) {
//   //     onSelected(Number(e.currentTarget.value));
//   //   } else {
//   //     console.log('イベントリスナーが登録されていない(onSeleted)', e.currentTarget.value);
//   //   }
//   // }
//   private onChangeCount = (count: number) {

//   }
// }

// export default styled(ListingCount as React.ComponentClass<Props>)`
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
