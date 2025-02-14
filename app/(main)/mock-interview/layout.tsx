import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
  }

export default function Layout({ children} : LayoutProps) {
  return (
    <div className="px-5">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}