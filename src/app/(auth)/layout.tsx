export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages render without the main app layout
  return <>{children}</>;
}
