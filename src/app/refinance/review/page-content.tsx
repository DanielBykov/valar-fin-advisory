import RefinanceReviewRequest from "@/components/calculators/refinance-review-request";

export default function ReviewContent({
  token,
  firstName,
  kind,
}: {
  token: string;
  firstName: string | null;
  kind: "review" | "address";
}) {
  return (
    <div data-cmp="RefinanceReviewPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section className="bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col space-y-3">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
              Refinance
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Let&apos;s review your mortgage<span className="text-valar-amber">.</span>
          </h1>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <RefinanceReviewRequest token={token} firstName={firstName} kind={kind} />
        </div>
      </section>
    </div>
  );
}
