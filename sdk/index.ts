import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { bcs } from "@mysten/sui.js/bcs";

const COIN_METADATA =
  "0x5e6eb9aaa4b3853f39959a1bef27fff42bebfc0983d0b641d581ae6e2a1214b8";
const TREASURY_CAP_WRAPPER =
  "0xe1a5a1d29d78e03a2b43c23789798908f2c72d83a528fef2b7420d9847ff6e82";
const PACKAGE_ADDRESS =
  "0xd8743353eb2ea969b8db770c53f0ddd6e468aa91dc33b925a552fe167447f98f";
const PACKAGE_NAME = "nameless";
const INSPECT_ADDRESS =
  "0xa5b1611d756c1b2723df1b97782cacfd10c8f94df571935db87b7f54ef653d66";
const DEV_OBJECT_ID =
  "0xfd89f91280ebd07dc83444ee71c6e56f494beb2663f7e7d5d3f9cdabfb7a2c0d";

export async function getMetadata(client: SuiClient) {
  let metadata = await client.getCoinMetadata({
    coinType: `${PACKAGE_ADDRESS}::${PACKAGE_NAME}::NAMELESS`,
  });
  if (!metadata) throw new Error("Coin metadata not found");

  const symbol = metadata?.symbol;
  const name = metadata?.name ?? symbol;
  const iconUrl = metadata?.iconUrl;
  const description = metadata?.description;

  return { symbol, name, iconUrl, description } as {
    symbol: string;
    name: string;
    iconUrl: string;
    description: string;
  };
}

export async function updateCoin(
  client: SuiClient,
  name: string,
  symbol: string,
  description: string,
  image: string
) {
  let txb = new TransactionBlock();
  let current_price = await getCurrentPrice(client);

  txb.moveCall({
    target: `${PACKAGE_ADDRESS}::${PACKAGE_NAME}::update`,
    arguments: [
      txb.object(TREASURY_CAP_WRAPPER),
      txb.object(COIN_METADATA),
      txb.object(SUI_CLOCK_OBJECT_ID),
      txb.object(txb.splitCoins(txb.gas, [current_price])),
      txb.pure(name),
      txb.pure(symbol),
      txb.pure(description),
      txb.pure(image),
    ],
  });

  return txb;
}

export async function getCurrentPrice(client: SuiClient): Promise<bigint> {
  let txb = new TransactionBlock();

  txb.moveCall({
    target: `${PACKAGE_ADDRESS}::${PACKAGE_NAME}::current_price`,
    arguments: [
      txb.object(TREASURY_CAP_WRAPPER),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  });

  const devInspectResult = await client.devInspectTransactionBlock({
    transactionBlock: txb,
    sender: INSPECT_ADDRESS,
  });

  if (!devInspectResult.results) return BigInt(0);
  if (!devInspectResult.results[0]) return BigInt(0);
  if (!devInspectResult.results[0].returnValues) return BigInt(0);

  const rawAmountBytes = devInspectResult.results[0].returnValues[0][0];
  const price = bcs.de("u64", new Uint8Array(rawAmountBytes));

  return BigInt(price);
}

export async function withdraw() {
  let txb = new TransactionBlock();

  txb.moveCall({
    target: `${PACKAGE_ADDRESS}::${PACKAGE_NAME}::withdraw`,
    arguments: [txb.object(DEV_OBJECT_ID), txb.object(TREASURY_CAP_WRAPPER)],
  });

  return txb;
}
