export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{background:'black',color:'white',minHeight:'100vh'}}>
        {children}
      </body>
    </html>
  )
}
