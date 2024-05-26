import { ChangeTickerDialog } from "@/components/dialogs/change-ticker";
import { useApp } from "@/context/AppContext";
import { ConnectButton } from "@suiet/wallet-kit";
import Image from "next/image";

export default function Page() {
  const { coin, currentPrice, loading, connected } = useApp();

  return (
    <div className="flex flex-col items-center text-balance text-center justify-center w-full">
      {loading ? (
        <>
          {/* Loading Skeletons */}
          <div className="animate-pulse h-24 w-24 bg-gray-300 rounded-full"></div>
          <div className="animate-pulse h-8 w-32 bg-gray-300 rounded-md mt-4"></div>
          <div className="animate-pulse h-4 w-24 bg-gray-300 rounded-md mt-2"></div>
          <div className="animate-pulse h-4 w-24 bg-gray-300 rounded-md mt-2"></div>
          <div className="animate-pulse h-4 w-24 bg-gray-300 rounded-md mt-2"></div>
        </>
      ) : (
        <>
          <Image
            src={coin.iconUrl}
            className="rounded-full h-24 w-24 bg-primary-500"
            alt="Current Coin Logo"
            height={96}
            width={96}
          />
          {/* Current Coin strikethrough */}
          <h1 className="text-2xl font-bold text-center mt-4">
            <span className="line-through">Nameless Coin</span>{" "}
            <span className="text-primary-500 text-lg">{coin.name}</span>
          </h1>
          {/* ticker */}
          <p className="text-center mt-2">{coin.symbol}</p>
          {/* Current Coin Description */}
          <p className="text-center mt-2">{coin.description}</p>
        </>
      )}
      {/* Change Ticker Button and price to change */}
      <div className="flex flex-col items-center gap-2 mt-8">
        {loading ? (
          <>
            <div className="animate-pulse h-8 w-32 bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-4 w-24 bg-gray-300 rounded-md"></div>
          </>
        ) : (
          <>
            {connected ? (
              <ChangeTickerDialog />
            ) : (
              <ConnectButton className="bg-gray-800 text-white rounded-md px-4 py-2">
                Connect Wallet
              </ConnectButton>
            )}
            <p>
              Current Price To Change:{" "}
              <span className="text-primary-500">{currentPrice} Sui</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
