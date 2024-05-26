import { getBase64 } from "@/lib/image";
import {
  getMetadata,
  updateCoin as updateCoinImp,
  getCurrentPrice,
} from "@/sdk";
import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { useSuiProvider, useWallet } from "@suiet/wallet-kit";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";

type AppContextType = {
  client: SuiClient;
  coin: {
    name: string;
    symbol: string;
    iconUrl: string;
    description: string;
  };
  currentPrice: string;
  loading: boolean;
  connected: boolean;
  updateCoin: (
    name: string,
    symbol: string,
    description: string,
    image: File
  ) => Promise<TransactionBlock>;
  refetch: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const wallet = useWallet();
  const client = useSuiProvider("https://fullnode.testnet.sui.io:443");
  const [coin, setCoin] = useState({
    name: "Nameless Coin",
    symbol: "NLC",
    iconUrl:
      "https://pbs.twimg.com/profile_images/1793260373006528512/35L4fwJj_400x400.jpg",
    description: "The first dynamic coin on Sui",
  });
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getMetadata(client).then((coin) => {
      setCoin(coin);
    });

    getCurrentPrice(client).then((price) => {
      setCurrentPrice(Number(price / MIST_PER_SUI).toFixed(2));
    });
  }, [client]);

  useEffect(() => {
    // if the coin symbol is nlc, then we are loading
    // if the price is not set, we are loading
    setLoading(coin.symbol === "NLC" || currentPrice === "");
  }, [coin, currentPrice]);

  useInterval(async () => {
    getMetadata(client).then((coin) => {
      setCoin(coin);
    });

    getCurrentPrice(client).then((price) => {
      setCurrentPrice(Number(price / MIST_PER_SUI).toFixed(2));
    });
  }, 5000);

  return (
    <AppContext.Provider
      value={{
        client,
        coin,
        connected: wallet.connected,
        loading,
        currentPrice,
        updateCoin: async (name, symbol, description, image) => {
          return updateCoinImp(
            client,
            name,
            symbol,
            description,
            await getBase64(image)
          );
        },
        refetch: async () => {
          getMetadata(client).then((coin) => {
            setCoin(coin);
          });

          getCurrentPrice(client).then((price) => {
            setCurrentPrice(Number(price / MIST_PER_SUI).toFixed(2));
          });
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};
