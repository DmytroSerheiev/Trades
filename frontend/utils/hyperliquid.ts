import {
  AssetCtx,
  Cancel,
  CandleSnapshot,
  Chain,
  ChainId,
  Meta,
  OrderRequest,
  OrderType,
  SubAccount,
} from '@/types/hyperliquid';
import { constants, providers, utils } from 'ethers';
import { signInner } from './signing';
import { timestamp } from './timestamp';

export class Hyperliquid {
  private chain: Chain;
  private base_url: string;

  // ----------------- INITIALIZER -----------------
  constructor(base_url: string, chain = Chain.ArbitrumTestnet) {
    this.base_url = base_url;
    this.chain = chain;
  }

  // ----------------- PROTECTED -----------------
  #post = async (
    request: Record<string, any>
  ): Promise<{
    success: boolean;
    data: Record<string, any> | SubAccount[] | null | string;
    msg: String | null;
  }> => {
    return fetch(this.base_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include',
    }).then((res) => res.json());
  };

  // ----------------- EXCHANGE => PLACE ORDER <= -----------------

  placeOrder = async (
    order: OrderRequest,
    vaultAdress: string | null = null
  ) => {
    let orders = [order].reduce((acc: OrderRequest[], order) => {
      acc.push({
        asset: order.asset,
        isBuy: order.isBuy,
        limitPx: order.limitPx,
        sz: order.sz,
        reduceOnly: order.reduceOnly,
        orderType: order.orderType,
        ...(order?.cloid && { cloid: order.cloid }),
      });

      return acc;
    }, []);

    let action = {
      grouping: 'na',
      orders,
    };

    let request = {
      endpoint: 'exchange',
      type: 'order',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  cancelOrder = async (
    cancels: Cancel[],
    vaultAdress: string | null = null
  ) => {
    let action = {
      cancels,
    };

    let request = {
      endpoint: 'exchange',
      type: 'cancel',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  normalTpSl = async (
    normal: OrderRequest,
    tp?: OrderRequest,
    sl?: OrderRequest,
    vaultAdress: string | null = null
  ) => {
    // if no tp and sl,throw an error
    if (!tp && !sl) {
      throw new Error('No tp and sl');
    }

    let orders = [normal, tp, sl].reduce((acc: OrderRequest[], order) => {
      if (order) {
        acc.push({
          asset: order.asset,
          isBuy: order.isBuy,
          limitPx: order.limitPx.toString(),
          reduceOnly: order.reduceOnly,
          sz: order.sz.toString(),
          orderType: order.orderType,
          ...(order?.cloid && { cloid: order.cloid }),
        });
      }
      return acc;
    }, []);

    let action = {
      grouping: 'normalTpsl',
      orders,
    };

    let request = {
      endpoint: 'exchange',
      type: 'order',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  scaleOrderDistribution = (
    sz: number | string,
    szDecimals: number,
    startPx: number,
    endPx: number,
    orderCount: number,
    skew: number = 1.0,
    extraArgs?: {
      asset: number;
      isBuy: boolean;
      reduceOnly: boolean;
      orderType: OrderType;
      cloid?: string | null;
    }
  ) => {
    let totalSz = parseFloat(sz.toString());

    let baseSz = totalSz / ((orderCount * (1 + skew)) / 2);

    let endSz = baseSz * skew;

    let remaining = orderCount - 1;

    let sizeStep = (endSz - baseSz) / remaining;

    let priceStep = (endPx - startPx) / remaining;

    let orders = Array.from({ length: orderCount }, (_, i) => ({
      limitPx: parsePrice(startPx + priceStep * i),
      sz: parseSize(baseSz + sizeStep * i, szDecimals),
      ...extraArgs,
    }));

    return orders;
  };

  updateLeverage = async (
    asset: number,
    isCross: boolean,
    leverage: number,
    vaultAdress: string | null = null
  ) => {
    let action = {
      asset,
      isCross,
      leverage,
    };

    let request = {
      endpoint: 'exchange',
      type: 'updateLeverage',
      action,
      isFrontend: true,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  updateIsolatedMargin = async (
    asset: number,
    isBuy: boolean,
    ntli: number,
    vaultAdress: string | null = null
  ) => {
    let action = {
      asset,
      isBuy,
      ntli: utils.parseUnits(ntli.toString(), 6).toNumber(),
    };

    let request = {
      endpoint: 'exchange',
      type: 'updateIsolatedMargin',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  // ----------------- EXCHANGE => TWAP <= -----------------
  placeTwapOrder = async (
    asset: number,
    isBuy: boolean,
    minutes: number,
    reduceOnly: boolean,
    sz: number | string,
    randomize: boolean,
    frequency: number = 30,
    vaultAdress: string | null = null
  ) => {
    let request = {
      endpoint: 'exchange',
      type: 'twapOrder',
      action: {
        asset,
        isBuy,
        runtime: minutes * 60, // minutes to seconds
        reduceOnly,
        sz: parseFloat(sz.toString()),
        randomize,
        frequency,
      },
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  // ----------------- EXCHANGE => SUB ACCOUNTS <= -----------------

  createSubAccount = async (
    name: String,
    vaultAdress: string | null = null
  ) => {
    let action = {
      name,
    };

    let request = {
      endpoint: 'exchange',
      type: 'createSubAccount',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  subAccountModify = async (
    name: String,
    subAccountUser: String,
    vaultAdress: string | null = null
  ) => {
    let action = {
      subAccountUser,
      name,
    };

    let request = {
      endpoint: 'exchange',
      type: 'subAccountModify',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  subAccountTransfer = async (
    isDeposit: boolean,
    subAccountUser: String,
    usd: number | string,
    vaultAdress: string | null = null
  ) => {
    let action = {
      subAccountUser,
      isDeposit,
      usd: utils.parseUnits(usd.toString(), 6).toNumber(),
    };

    let request = {
      endpoint: 'exchange',
      type: 'subAccountTransfer',
      action,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  connect = async (user: String) => {
    return this.#post({
      endpoint: 'connect',
      user,
    });
  };

  connectAgent = async (
    signer: providers.JsonRpcSigner,
    agentAddress: string,
    agentName?: string,
    vaultAdress?: string
  ) => {
    let nonce = timestamp();

    let hyperliquidChain =
      this.chain === Chain.Arbitrum ? 'Mainnet' : 'Testnet';

    agentName = (agentName || '').trim();

    let chainId =
      this.chain === Chain.Arbitrum
        ? ChainId.Arbitrum
        : ChainId.ArbitrumTestnet;

    let action = {
      hyperliquidChain,
      agentAddress,
      nonce,
      type: 'approveAgent',
      signatureChainId: `0x${Number(chainId).toString(16)}`,
      agentName,
    };

    let domain = {
      chainId,
      name: 'HyperliquidSignTransaction',
      verifyingContract: constants.AddressZero,
      version: '1',
    };

    let types = {
      'HyperliquidTransaction:ApproveAgent': [
        { name: 'hyperliquidChain', type: 'string' },
        { name: 'agentAddress', type: 'address' },
        { name: 'agentName', type: 'string' },
        { name: 'nonce', type: 'uint64' },
      ],
    };

    let signature = await signInner(signer, domain, types, action);

    // @ts-ignore
    if (!agentName) delete action.agentName;

    let request = {
      endpoint: 'exchange',
      type: 'approveAgent',
      action,
      nonce,
      signature,
      ...(vaultAdress && { vaultAdress }),
    };

    return this.#post(request);
  };

  // ----------------- INFO => SUB ACCOUNTS <= -----------------

  subAccounts = async (user: String) => {
    let request = {
      endpoint: 'info',
      type: 'subAccounts',
      user,
    };

    return this.#post(request);
  };

  historicalOrders = async (user: String) => {
    let request = {
      endpoint: 'info',
      type: 'historicalOrders',
      user,
    };

    return this.#post(request);
  };

  userFees = async (user: String) => {
    let request = {
      endpoint: 'info',
      type: 'userFees',
      user,
    };

    return this.#post(request);
  };

  spotMeta = async () => {
    let request = {
      endpoint: 'info',
      type: 'spotMeta',
    };

    return this.#post(request);
  };

  candleSnapshot = async (req: CandleSnapshot) => {
    let request = {
      endpoint: 'info',
      type: 'candleSnapshot',
      req,
    };

    return this.#post(request);
  };

  metaAndAssetCtxs = async (meta: Meta, assetCtxs: AssetCtx[]) => {
    return meta.universe.map((universe, assetId) => ({
      assetId,
      universe,
      assetCtx: assetCtxs[assetId],
    }));
  };
}

export const parsePrice = (px: number) => {
  let pxFormatted = px.toFixed(6);

  let pxAdjusted: string;
  if (pxFormatted.startsWith('0.')) {
    pxAdjusted = pxFormatted;
  } else {
    let pxSplit = pxFormatted.split('.');
    let whole = pxSplit[0];
    let decimals = pxSplit[1];

    let diff = 5 - whole.length; // 0
    let sep = diff > 0 ? '.' : '';

    pxAdjusted =
      sep === '' ? `${whole}` : toFixed(`${whole}${sep}${decimals}`, diff);
  }

  let pxCleaned = removeTrailingZeros(pxAdjusted);

  return positive(pxCleaned);
};

/**
 * @param n number toFixed
 * @param fixed number of decimals
 * @returns string
 * @description
 *
 * @example
 * toFixed(1.2345, 2) => '1.23'
 * toFixed(1.2345, 4) => '1.2345'
 * toFixed(1.2345, 5) => '1.23450'
 *
 * @source https://quickref.me/truncate-a-number-to-a-given-number-of-decimal-places-without-rounding.html
 */
export const toFixed = (n: number | string, fixed: number) =>
  `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))![0];

export const parseSize = (sz: number | string, szDecimals: number) => {
  let px = removeTrailingZeros(toFixed(sz, szDecimals));

  return positive(px);
};

const removeTrailingZeros = (s: string) => {
  let result = s;
  while (result.endsWith('0') && result.includes('.')) {
    result = result.slice(0, -1);
  }
  if (result.endsWith('.')) {
    result = result.slice(0, -1);
  }
  return result;
};

const positive = (value: string) => {
  return value.startsWith('-') ? '0' : value;
};
