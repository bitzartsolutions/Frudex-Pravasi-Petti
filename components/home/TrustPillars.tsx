import { Icon } from "@/components/ui/Icon";

const PILLARS = [
  {
    icon: "verified",
    title: "100% Authentic",
    description: "Every batch is quality-checked for genuine taste, purity and freshness.",
  },
  {
    icon: "pan_tool",
    title: "Handpicked Quality",
    description: "Carefully inspected to keep every pack free of broken or bitter pieces.",
  },
  {
    icon: "handshake",
    title: "Trusted Sourcing",
    description:
      "Carefully sourced from trusted suppliers to guarantee ultra-fresh moisture content and peak aroma.",
  },
  {
    icon: "sanitizer",
    title: "Food Safe Hygienic",
    description: "Packed with strict hygiene standards to keep every order fresh and safe.",
  },
];

export function TrustPillars() {
  return (
    <section className="py-space-xl bg-surface-container-lowest text-on-surface">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-space-xl space-y-space-xs">
          <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-widest">
            Frudex Heritage Pledge
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Goodness Made To Go
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Packed with utmost care so every order reaches your doorstep fresh, anywhere in
            India.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="p-space-lg rounded-2xl bg-surface-container-low flex flex-col items-center text-center space-y-space-xs border-b-2 border-secondary"
            >
              <div className="w-12 h-12 rounded-full bg-primary-container text-secondary-fixed flex items-center justify-center mb-1">
                <Icon name={pillar.icon} size={24} />
              </div>
              <h4 className="font-headline-sm text-headline-sm text-primary">{pillar.title}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
