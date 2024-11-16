import type { Metadata } from "next";
import "./globals.css";
import { kanit } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    template: " %s | Urgent AI",
    default: "Urgent AI"
  },
  description: "Emergency helping service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossOrigin="" />
        <script defer src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossOrigin=""></script>

      </head>
      <body
        className={`${kanit.className} antialiased text-[19px] bg-background scroll-m-0 `}
      >
        {children}
      </body>
    </html>
  );
}
