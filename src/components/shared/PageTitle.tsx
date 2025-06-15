import type { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageTitle({ title, description, icon: Icon, actions }: PageTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-7 w-7 text-primary" />}
          <h1 className="text-2xl font-headline font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
