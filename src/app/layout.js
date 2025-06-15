import "./globals.css"
import ClientLayout from "./ClientLayout"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Vogue - Fashion IP Platform</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Inter, sans-serif" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
