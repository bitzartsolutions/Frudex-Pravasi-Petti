import { Icon } from "@/components/ui/Icon";

const STEPS = [
  {
    number: "01",
    title: "CHOOSE",
    description:
      "Browse our chocolates, nuts, dry fruits and dates , all in one place.",
    tag: "Handpicked Grade",
    icon: "check_circle",
  },
  {
    number: "02",
    title: "ADD",
    description:
      "Select your gram weights (250g, 500g, 1kg) or confection counts. Watch your custom box fill up in real-time.",
    tag: "Dynamic Variant Steppers",
    icon: "tune",
  },
  {
    number: "03",
    title: "SEND",
    description:
      "Review your Pravasi Petti box and finalize your direct-from-origin order through our priority concierge WhatsApp channel.",
    tag: "Instant Dispatch Lock",
    icon: "send",
  },
];

export function HowItWorks() {
  return (
    <section className="py-space-xl bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-space-xl space-y-space-xs">
          <span className="font-label-sm text-label-sm font-bold text-secondary tracking-widest uppercase">
            How To Create Pravasi Petti
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Three Simple Steps
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Simple, artisanal curation packaged for seamless doorstep joy, delivered anywhere in
            India.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface-container-low rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-secondary-fixed font-display-lg text-headline-md flex items-center justify-center font-bold mb-space-md shadow-inner">
                {step.number}
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-space-xs group-hover:text-secondary transition-colors">
                {step.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
              <div className="mt-space-md flex items-center gap-1 text-label-sm font-label-sm text-secondary uppercase font-semibold">
                <span>{step.tag}</span>
                <Icon name={step.icon} size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
