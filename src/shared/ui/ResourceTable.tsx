import { Link } from "react-router-dom";
import type { LookupMap, ResourceColumnDefinition, ResourceDefinition } from "../types/resources";

const euroCurrencyFormatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
});

type ResourceItem = Record<string, unknown> & { id: string | number };

interface ResourceTableProps {
    resource: ResourceDefinition;
    items: ResourceItem[];
    onDelete: (item: ResourceItem) => void;
    lookups?: LookupMap;
}

function formatCellValue(column: ResourceColumnDefinition, value: unknown, lookups?: LookupMap) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (column.lookupSource && lookups) {
        const map = lookups[column.lookupSource];
        if (map) {
            const key =
                typeof value === "object" && value !== null && "id" in value
                    ? (value as Record<string, unknown>).id as string | number
                    : (value as string | number);
            if (map.has(key)) {
                return map.get(key) as string;
            }
        }
    }

    if (
        column.type === "date" &&
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        const [year, month, day] = value.split("-");
        return `${day}/${month}/${year}`;
    }

    if (column.type === "currency") {
        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "—";
        }

        return euroCurrencyFormatter.format(numericValue);
    }

    if (typeof value === "object" && value !== null) {
        if ("first_name" in value && "last_name" in value) {
            return `${String(value.first_name)} ${String(value.last_name)}`;
        }

        if ("description" in value) {
            return String(value.description);
        }
    }

    return String(value);
}

export function ResourceTable({ resource, items, onDelete, lookups }: ResourceTableProps) {
    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] shadow-[0_14px_40px_rgba(20,36,60,0.08)]">
            <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full">
                    <thead className="bg-[color:var(--app-panel)] text-left text-xs uppercase tracking-[0.22em] text-slate-200">
                        <tr>
                            {resource.columns.map((column) => (
                                <th key={column.key} className="px-5 py-4 font-medium">
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-5 py-4 font-medium">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-emerald-50/40"
                            >
                                {resource.columns.map((column) => (
                                    <td key={column.key} className="px-5 py-4 align-top">
                                        {formatCellValue(column, item[column.key], lookups)}
                                    </td>
                                ))}
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/${resource.path}/${item.id}/edit`}
                                            className="btn btn-primary"
                                        >
                                            Modifica
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item)}
                                            className="btn btn-danger"
                                        >
                                            Elimina
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-4 p-4 lg:hidden">
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-[1.25rem] border border-[color:var(--app-border)] bg-slate-50 p-4"
                    >
                        <div className="space-y-3">
                            {resource.columns.map((column) => (
                                <div
                                    key={column.key}
                                    className="flex items-start justify-between gap-4 text-sm"
                                >
                                    <span className="font-semibold text-slate-500">{column.label}</span>
                                    <span className="text-right text-slate-800">
                                        {formatCellValue(column, item[column.key], lookups)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Link to={`/${resource.path}/${item.id}/edit`} className="btn btn-primary">
                                Modifica
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete(item)}
                                className="btn btn-danger"
                            >
                                Elimina
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
