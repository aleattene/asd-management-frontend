import type {
    ResourceDefinition,
    ResourceFieldDefinition,
    SelectOption,
} from "../types/resources";
import type { ChangeEvent, FormEvent } from "react";

type FormValues = Record<string, string | number>;

type EntityFormChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

interface EntityFormProps {
    resource: ResourceDefinition;
    values: FormValues;
    selectOptions: Record<string, SelectOption[]>;
    isSubmitting: boolean;
    onChange: (event: EntityFormChangeEvent) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    submitLabel: string;
}

function normalizeValue(field: ResourceFieldDefinition, value: unknown) {
    if (field.type === "select" && typeof value === "object" && value !== null) {
        return (value as { id?: string | number }).id ?? "";
    }

    return (value ?? "") as string | number;
}

function normalizeComparableValue(value: string | number | boolean) {
    return typeof value === "boolean" ? String(value) : value;
}

function isFieldReadOnly(field: ResourceFieldDefinition, values: FormValues) {
    if (!field.readOnlyWhen) {
        return false;
    }

    return values[field.readOnlyWhen.field] === normalizeComparableValue(field.readOnlyWhen.value);
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
}: EntityFormProps) {
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
                    const readOnly = isFieldReadOnly(field, values);
                    const inputClassName = `w-full rounded-xl border border-[color:var(--app-border)] px-4 py-3 text-[color:var(--app-ink)] outline-none transition ${
                        readOnly
                            ? "cursor-not-allowed bg-slate-100 text-slate-500"
                            : "bg-slate-50 focus:border-[color:var(--app-primary)] focus:bg-white"
                    }`;

                    return (
                        <label key={field.name} className={wideField ? "md:col-span-2" : ""}>
                            <span className="mb-2 block text-sm font-semibold text-[color:var(--app-ink)]">
                                {field.label}
                            </span>

                            {field.type === "select" ? (
                                <select
                                    name={field.name}
                                    value={inputValue}
                                    onChange={onChange}
                                    disabled={readOnly}
                                    required={field.required}
                                    className={inputClassName}
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
                                    readOnly={readOnly}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    rows={5}
                                    className={inputClassName}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={inputValue}
                                    onChange={onChange}
                                    readOnly={readOnly}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    className={inputClassName}
                                />
                            )}
                        </label>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? "Salvataggio..." : submitLabel}
                </button>
                <button type="button" onClick={onCancel} className="btn btn-neutral">
                    Annulla
                </button>
            </div>
        </form>
    );
}
