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
            <main className="min-h-screen">
              {children}
            </main>
        
        </ThemeProvider>
  );
}
