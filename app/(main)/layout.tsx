import { ThemeProvider } from "@/components/Theme-provider";
import Header from "@/components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ThemeProvider
            attribute="class"
            enableSystem
            defaultTheme="system"
            disableTransitionOnChange
          >
            <Header/>
            <main className="min-h-screen container md:ml-64 mx-auto mt-24 mb-20 md:w-[82%]">
              {children}
            </main>
        
        </ThemeProvider>
  );
}
