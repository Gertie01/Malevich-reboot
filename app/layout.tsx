import './globals.css';
export const metadata = { title: 'ruDALL-E Malevich Generator' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html><body>{children}</body></html>);
}