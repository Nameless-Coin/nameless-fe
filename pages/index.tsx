import { ChangeTickerDialog } from "@/components/dialogs/change-ticker";

export default function Page() {
  return (
    <div className="flex flex-col items-center text-balance text-center justify-center w-full">
      {/* cURRENT COİN image rounded square  */}
      <img
        src="https://pbs.twimg.com/profile_images/1793260373006528512/35L4fwJj_400x400.jpg"
        className="rounded-full h-24 w-24 bg-primary-500"
      />
      {/* Current Coin strikethrough */}
      <h1 className="text-2xl font-bold text-center mt-4">
        <span className="line-through">Nameless Coin</span>{" "}
        <span className="text-primary-500 text-lg">Current Coin</span>
      </h1>
      {/* Current Coin Description */}
      <p className="text-center mt-2">
        Current Coin is the first dynamic coin on Sui.
      </p>
      {/* Change Ticker Button and price to change */}
      <div className="flex flex-col items-center gap-2 mt-8">
        <ChangeTickerDialog />
        <p>
          Current Price To Change:{" "}
          <span className="text-primary-500">0.0001 Sui</span>
        </p>
      </div>
    </div>
  );
}
