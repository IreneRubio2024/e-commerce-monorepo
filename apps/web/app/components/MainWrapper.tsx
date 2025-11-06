export default function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 min-h-screen px-16 mt-32 gap-4">
      {children}
    </div>
  );
}