import RateCalculator from "@/components/RateCalculator";

export default function RatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-black">
      <main className="mx-auto w-full max-w-7xl px-6 py-14">
        <RateCalculator />
      </main>
    </div>
  );
}
