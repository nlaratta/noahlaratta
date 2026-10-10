import type { AppProps } from 'next/app'
import { type FC } from 'react'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  )
}

export default App
