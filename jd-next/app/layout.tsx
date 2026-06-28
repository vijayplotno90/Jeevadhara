import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Jeevadhara AgriTech | జీవధార",
  description: "Farm-fresh produce direct from Indian farmers. No middlemen. Powered by AWS Aurora.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <NavBar />
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Jeevadhara AgriTech · జీవధార</p>
            <p>Connecting India's farmers directly to consumers · Zero middlemen · Powered by AWS Aurora</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
