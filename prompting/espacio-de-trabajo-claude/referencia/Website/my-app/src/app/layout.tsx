import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { localBusinessJsonLd } from "@/lib/seo";
import { METADATA_BASE_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SIDEAS Consultores | Infraestructura IT en Córdoba",
    template: "%s | SIDEAS Consultores",
  },
  description:
    "Empresa de servicios IT en Córdoba, Argentina. DataCenter, soporte 24/7, VoIP, MikroTik, Zabbix, Google Workspace e identidad digital. Desde 2020.",
  metadataBase: new URL(METADATA_BASE_URL),
  openGraph: {
    siteName: "SIDEAS Consultores",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
