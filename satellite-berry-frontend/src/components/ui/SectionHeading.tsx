interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps): JSX.Element {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-200">{eyebrow}</p>
      ) : null}
      <div className="space-y-1">
        <h2 className="font-display text-2xl tracking-tight text-foreground md:text-[2rem]">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-mutedForeground">{description}</p> : null}
      </div>
    </div>
  );
}
