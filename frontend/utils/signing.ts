import { Chain } from '@/types/hyperliquid';
import { serialize as packb } from '@ygoe/msgpack';
import {
  TypedDataDomain,
  TypedDataField,
  Wallet,
  constants,
  providers,
  utils,
} from 'ethers';

export const actionHash = (
  action: Record<string, any>,
  vaultAddress: String | null,
  nonce: number
) => {
  let data_binary = packb(action);

  let encoded = Buffer.from(data_binary).toString('hex');

  encoded += nonce.toString(16).padStart(16, '0');

  encoded += vaultAddress ? `01${vaultAddress}` : `00`;

  let decoded = new Uint8Array(Buffer.from(encoded, 'hex'));

  return utils.keccak256(decoded);
};

export const constructPhantomAgent = (
  connectionId: string,
  isMainnet: boolean
) => {
  return { source: isMainnet ? 'a' : 'b', connectionId };
};

export const signL1Action = async (
  signer: Wallet,
  action: Record<string, any>,
  nonce: number,
  chain: Chain,
  vaultAddress: String | null = null
): Promise<{ r: string; s: string; v: number }> => {
  let hash = actionHash(action, vaultAddress, nonce);

  let isMainnet = chain === Chain.Arbitrum;

  let phantomAgent = constructPhantomAgent(hash, isMainnet);

  let domain = {
    chainId: 1337,
    name: 'Exchange',
    verifyingContract: constants.AddressZero,
    version: '1',
  };

  let types = {
    Agent: [
      { name: 'source', type: 'string' },
      { name: 'connectionId', type: 'bytes32' },
    ],
  };
  return signInner(signer, domain, types, phantomAgent);
};

export const signInner = async (
  signer: providers.JsonRpcSigner | Wallet,
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
) => {
  let signature = await signer._signTypedData(domain, types, value);

  let { r, s, v } = utils.splitSignature(signature);

  return { r, s, v };
};

export const transferSign = async () => {
  // TODO: Implement transferSign
};

export const withdrawSign = async () => {
  // TODO: Implement withdrawSign
};
