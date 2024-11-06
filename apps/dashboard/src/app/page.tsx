import { redirect } from 'next/navigation';

export default async function Home() {
  /** temporarily redirecting to the '/campaigns' page until we have suitable content for a root index page */
  redirect('/campaigns');

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <section className="flex w-full max-w-7xl flex-1 items-center justify-center border border-dashed border-blue-500">
        PLACEHOLDER HOME PAGE CONTENT
      </section>
    </main>
  );
}
