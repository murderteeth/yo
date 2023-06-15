export interface Vault {
	address: string,
  name: string,
  version: string,
  token: {
    address: string,
    name: string,
    symbol: string
  },
  inception: number,
  details: {
    managementFee: number,
    performanceFee: number
  },
  apy: {
    gross_apr: number,
    net_apy: number
  }, tvl: {
    tvl: number
  }
}

export interface FlatVault {
  address: string;
  name: string;
  version: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  inception: number;
  details_management_fee: number;
  details_performance_fee: number;
  apy_gross_apr: number;
  apy_net_apy: number;
  tvl_tvl: number;
}


export const defaultVault: Vault = {
  address: '',
  name: '',
  version: '',
  token: { 
    address: '',
    name: '',
    symbol: ''
  },
  inception: 0,
  details: {
    managementFee: 0,
    performanceFee: 0
  },
  apy: {
    gross_apr: 0,
    net_apy: 0
  }, 
  tvl: {
    tvl: 0
  }
}
