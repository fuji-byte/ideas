import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Ideas",
  description: "Easily capture and share your ideas anytime, anywhere.",
  keywords: ["ideas", "note app", "creativity", "memo", "idea sharing"],
  authors: [{ name: "fuji-byte", url: "https://www.touhobby.com" }],
  creator: "fuji-byte",
  metadataBase: new URL("https://www.touhobby.com"),
  openGraph: {
    title: "Ideas",
    description: "Capture and share your creative ideas easily.",
    url: "https://www.touhobby.com",
    siteName: "Ideas",
    type: "website",
  }
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="ja">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

import { Toaster } from "sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
        {children}
        <Toaster richColors /> {/* これでカラフルなトースト */}
        </main>
        <footer className="text-center text-gray-500 text-sm py-4 bottom-0">
          © 2025-{new Date().getFullYear()} www.touhobby.com
        </footer>
      </body>
    </html>
  )
}
