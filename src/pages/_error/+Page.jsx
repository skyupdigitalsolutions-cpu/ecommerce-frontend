import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  return (
    <section className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-12">
      <p className="text-[13px] font-bold uppercase tracking-widest text-[#0037CA]">
        {is404 ? "404" : "Something went wrong"}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F1729] sm:text-[40px]">
        {is404 ? "Page not found" : "Unexpected error"}
      </h1>
      <p className="mt-3 max-w-md text-[15px] text-[#667085]">
        {is404
          ? "The page you’re looking for doesn’t exist or may have moved."
          : "An error occurred while loading this page. Please try again."}
      </p>
      <div className="mt-8 flex gap-3">
        <a href="/" className="rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">
          Back to home
        </a>
        <a href="/categories" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA]">
          Browse categories
        </a>
      </div>
    </section>
  );
}