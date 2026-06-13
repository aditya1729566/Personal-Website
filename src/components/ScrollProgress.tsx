"use client";

type ProgressProps = {
  activePage: number;
  totalPages: number;
};

export default function ScrollProgress({ activePage, totalPages }: ProgressProps) {
  const percentage = totalPages > 1 ? (activePage / (totalPages - 1)) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-charcoal">
      <div
        className="h-full bg-gradient-to-r from-accent-gold via-poker-red to-accent-gold transition-all duration-500 ease-out shadow-[0_0_10px_rgba(207,168,70,0.5)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
