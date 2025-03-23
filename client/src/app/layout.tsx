import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/Navbar";
import PlayerBar from "@/components/PlayBar";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { dark } from '@clerk/themes'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" suppressHydrationWarning>
        <body>
          <WebSocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              >
              <AudioPlayerProvider>
                <Navbar />
                {children}
                <PlayerBar />
              </AudioPlayerProvider>
            </ThemeProvider>
          </WebSocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
