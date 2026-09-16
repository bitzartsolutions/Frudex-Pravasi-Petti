export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-space-lg first:pt-0 last:pb-0 border-b border-surface-variant/60 last:border-b-0 space-y-space-md">
      <div>
        <h3 className="font-label-lg text-label-lg font-bold text-primary uppercase tracking-wider">
          {title}
        </h3>
        {description ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
