import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SharedProvider } from "./SharedContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tachet-Dashboard",
  description: "Dashboard for management of information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <SharedProvider>{children}</SharedProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
