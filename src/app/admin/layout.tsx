import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Admin - SB Alliance",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-gray-900">{children}</div>
    </AuthProvider>
  );
}
