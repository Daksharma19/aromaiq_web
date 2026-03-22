export default function OurStoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">{children}</div>
  );
}
