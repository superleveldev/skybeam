export const Placeholder = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center h-full">
      <section className="flex w-full max-w-7xl flex-1 items-center justify-center border border-dashed border-blue-500">
        {children}
      </section>
    </main>
  );
};
