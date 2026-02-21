import { cn } from "@/lib/utils";

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeaturesSectionWithHoverEffects({
  features,
}: {
  features: Feature[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10">
      {features.map((feature, index) => (
        <FeatureCard key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
  index,
}: Feature & { index: number }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature",
        (index === 0 || index === 3) && "lg:border-l",
        index < 3 && "lg:border-b"
      )}
      style={{ borderColor: "var(--neutral-200)" }}
    >
      {index < 3 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, var(--primary-50), transparent)",
          }}
        />
      )}
      {index >= 3 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--primary-50), transparent)",
          }}
        />
      )}
      <div
        className="mb-4 relative z-10 px-10"
        style={{ color: "var(--neutral-600)" }}
      >
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[var(--neutral-300)] group-hover/feature:bg-[var(--accent-400)] transition-all duration-200 origin-center" />
        <span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block"
          style={{ color: "var(--primary-900)" }}
        >
          {title}
        </span>
      </div>
      <p
        className="text-sm max-w-xs relative z-10 px-10"
        style={{ color: "var(--neutral-600)" }}
      >
        {description}
      </p>
    </div>
  );
};
