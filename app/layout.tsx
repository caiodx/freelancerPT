import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreelancerPT — Gestão fiscal para freelancers em Portugal",
  description:
    "Sabe exatamente quanto guardar de cada fatura. IVA, IRS e SS calculados automaticamente para freelancers em Portugal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
