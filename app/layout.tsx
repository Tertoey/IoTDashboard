import type { Metadata } from "next";
import { Inter, Kanit} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavWrapper } from "@/context/Navcontext";
import { Toaster } from "@/components/ui/toaster";
import Sidebars from "@/components/layout/Sidebars";
import Nav from "@/components/layout/Nav";

const inter = Kanit({ subsets: ["latin"], weight:['500']});

export const metadata: Metadata = {
  title: "Smart IoT Platform",
  description: "Smart",
  icons: {icon: '/takodachi.svg'}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"suppressHydrationWarning>
      <body className={`${inter.className} flex items-start justify-between`}>
      <NavWrapper>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        
        <Toaster/>
        <Sidebars/>
        {/* <Nav/> */}
        <main className="py-5 flex flex-col w-full max-h-screen min-h-screen overflow-auto bg-secondary">
          <section className="">
            {children}
          </section>
        </main>
        </ThemeProvider>
        </NavWrapper>
      </body>
    </html>
  );
}
