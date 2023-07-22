import ky from "ky";

interface Poap {
  address: string;
  tokenId: string;
  blockchain: string;
  name: string;
  description: string;
  imageUrl: string;
  animationUrl: string;
  previewLink: string;
  traits: Array<{
    trait_type: string;
    value: string;
  }>;
  owner: string[];
  created: string;
}

interface Profile {
  address: string;
  nft: null | {
    contract_address: string;
    token_id: string;
    chain: string;
    metadata: null | {
      name: string;
      content: {
        type: string;
        image_preview_url: null | string;
        image_url: null | string;
        audio_url: null | string;
        video_url: null | string;
      };
    };
  };
  meta_information: {
    onboarded: false;
  };
}

export interface StatsResponse {
  hasWorldCoin: boolean;
  hasNotDumbTransaction: boolean;
  profile: { profiles: Profile[] };
  chainIDsWithActivity: number[];
  poapInfo: null | {
    lastOnline: null | Poap;
    lastOffline: null | Poap;
  };
  totalTransactionHappenedOverLast7DaysTotal: null | number;
  totalTransactionsLast7DaysFromOwner: null | number;
  latestOutboundTransactionDate: null | string;
  earliestTransaction: null | { chainId: number; date: string };
}

export function fetchStats(address: string) {
  return ky(`https://3degens.club/check/${address}`).json<StatsResponse>();
}
