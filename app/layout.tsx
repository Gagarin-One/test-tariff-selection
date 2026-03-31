import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Выбор тарифа',
  description: 'Выберите подходящий тариф для достижения ваших целей',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="font-montserrat">
        {children}
      </body>
    </html>
  )
}
