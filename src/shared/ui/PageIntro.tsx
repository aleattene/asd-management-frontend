import type { ReactNode } from "react";

interface PageIntroProps {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
}

export function PageIntro({ eyebrow, title, description, action }: PageIntroProps) {
    return (
        <header className="rounded-[1.5rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] px-6 py-6 shadow-[0_14px_40px_rgba(20,36,60,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--app-primary)]">
                        {eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-[color:var(--app-ink)]">
                        {title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--app-muted)]">
                        {description}
                    </p>
                </div>
                {action ? <div>{action}</div> : null}
            </div>
        </header>
    );
}
