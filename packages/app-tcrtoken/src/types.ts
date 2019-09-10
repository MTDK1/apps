import { StorageEntryPromise } from "@polkadot/api/types";

// app-tcr 内で使用する type

interface Base {
  // 
}

interface IdQuery extends Base {
  id: number;
}

interface PartialModuleQuery extends Base {
  key: StorageEntryPromise;
  params?: any;
}

export type QueryParams = IdQuery & PartialModuleQuery;

export const TYPES = {
  Listing: {
     "id": "u32",
     "data": "Vec<u8>",
     "deposit": "Balance",
     "owner": "AccountId",
     "application_expiry": "Moment",
     "whitelisted": "bool",
     "challenge_id": "u32" },
  Challenge: {
      "listing_hash": "Hash",
      "deposit": "Balance",
      "owner": "AccountId",
      "voting_ends": "Moment",
      "resolved": "bool",
      "reward_pool": "Balance",
      "total_tokens": "Balance" },
  Poll: {
      "listing_hash": "Hash",
      "votes_for": "Balance",
      "votes_against": "Balance",
      "passed": "bool" },
  Vote: {
      "value": "bool",
      "deposit": "Balance",
      "claimed": "bool" },
  TokenBalance: "u128"
};

export interface ListingItem {
    "id": number,
    "data": number[],
    "deposit": number,
    "owner": string,
    "application_expiry": number,
    "whitelisted": boolean,
    "challenge_id": number
}