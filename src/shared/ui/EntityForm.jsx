function normalizeValue(field, value) {
    if (field.type === "select" && typeof value === "object" && value !== null) {
        return value.id ?? "";
    }

    return value ?? "";
}

export function EntityForm({
    resource,
    values,
    selectOptions,
    isSubmitting,
    onChange,
    onSubmit,
    onCancel,
    submitLabel,
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="rounded-[1.5rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-6 shadow-[0_14px_40px_rgba(20,36,60,0.08)]"
        >
            <div className="grid gap-5 md:grid-cols-2">
                {resource.fields.map((field) => {
                    const options = selectOptions[field.name] ?? [];
                    const inputValue = normalizeValue(field, values[field.name]);
                    const wideField = field.type === "textarea";

                    return (
                        <label
                            key={field.name}
                            className={wideField ? "md:col-span-2" : ""}
                        >
                            <span className="mb-2 block text-sm font-semibold text-[color:var(--app-ink)]">
                                {field.label}
                            </span>

                            {field.type === "select" ? (
                                <select
                                    name={field.name}
                                    value={inputValue}
                                    onChange={onChange}
                                    required={field.required}
                                    className="w-full rounded-xl border border-[color:var(--app-border)] bg-slate-50 px-4 py-3 text-[color:var(--app-ink)] outline-none transition focus:border-[color:var(--app-primary)] focus:bg-white"
                                >
                                    <option value="">{field.placeholder ?? "Seleziona"}</option>
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={inputValue}
                                    onChange={onChange}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    rows={5}
                                    className="w-full rounded-xl border border-[color:var(--app-border)] bg-slate-50 px-4 py-3 text-[color:var(--app-ink)] outline-none transition focus:border-[color:var(--app-primary)] focus:bg-white"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={inputValue}
                                    onChange={onChange}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    className="w-full rounded-xl border border-[color:var(--app-border)] bg-slate-50 px-4 py-3 text-[color:var(--app-ink)] outline-none transition focus:border-[color:var(--app-primary)] focus:bg-white"
                                />
                            )}
                        </label>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                >
                    {isSubmitting ? "Salvataggio..." : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-neutral"
                >
                    Annulla
                </button>
            </div>
        </form>
    );
}
