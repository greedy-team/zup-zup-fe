interface StepDotsProps {
  total: number;
  current: number;
  small?: boolean;
}

export default function StepDots({ total, current, small }: StepDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all ${
            i === current
              ? small
                ? 'h-1.5 w-4 bg-teal-500'
                : 'h-2 w-4 bg-teal-500'
              : small
                ? 'h-1.5 w-1.5 bg-slate-300'
                : 'h-2 w-2 bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
