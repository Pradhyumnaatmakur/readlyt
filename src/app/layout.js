import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Readlyt",
  description: "Transform reading into personal movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
