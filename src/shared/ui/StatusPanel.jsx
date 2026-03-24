export function StatusPanel({ title, description, tone = "neutral" }) {
    const tones = {
        neutral:
            "border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] text-[color:var(--app-ink)]",
        loading:
            "border-[color:var(--app-primary)]/20 bg-[color:var(--app-primary-soft)] text-[color:var(--app-panel)]",
        error:
            "border-[color:var(--app-danger)]/20 bg-[color:var(--app-danger-soft)] text-[color:var(--app-danger)]",
    };

    return (
        <div
            className={`rounded-[1.25rem] border px-5 py-4 shadow-sm ${tones[tone] ?? tones.neutral}`}
        >
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm opacity-80">{description}</p>
        </div>
    );
}
