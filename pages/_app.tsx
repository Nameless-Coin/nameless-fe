import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { WalletProvider } from "@suiet/wallet-kit";
import { cn } from "@/lib/utils";
import Head from "next/head";
import { AppProvider } from "@/context/AppContext";
import Toaster from "@/components/shared/Toaster";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nameless Coin - First Dynamic Coin on Sui</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <main className={cn(inter.className)}>
        <WalletProvider>
          <AppProvider>
            <div className="relative flex min-h-screen w-full flex-row gap-2 container py-12">
              <Component {...pageProps} />
            </div>
          </AppProvider>
        </WalletProvider>
        <Toaster />
      </main>
    </>
  );
}
