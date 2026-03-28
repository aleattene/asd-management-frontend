import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../shared/api/client";
import { PageIntro } from "../../shared/ui/PageIntro";
import { StatusPanel } from "../../shared/ui/StatusPanel";
import { ResourceTable, type LookupMap } from "../../shared/ui/ResourceTable";
import type { ResourceDefinition } from "../../shared/types/resources";

type ResourceItem = Record<string, unknown> & { id: string | number };

interface ResourceListPageProps {
    resource: ResourceDefinition;
}

export function ResourceListPage({ resource }: ResourceListPageProps) {
    const [items, setItems] = useState<ResourceItem[]>([]);
    const [lookups, setLookups] = useState<LookupMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadItems() {
            setIsLoading(true);
            setError("");

            try {
                const data = await resource.service.list();

                const lookupSources = resource.columns
                    .filter((col) => col.lookupSource)
                    .map((col) => col.lookupSource as string);

                const uniqueSources = [...new Set(lookupSources)];
                const resolvedLookups: LookupMap = {};

                await Promise.all(
                    uniqueSources.map(async (source) => {
                        const loader = resource.optionLoaders[source];
                        if (!loader) return;
                        const options = await loader();
                        const map = new Map<string | number, string>();
                        for (const opt of options) {
                            map.set(opt.value, opt.label);
                        }
                        resolvedLookups[source] = map;
                    }),
                );

                if (!cancelled) {
                    setItems(Array.isArray(data) ? (data as ResourceItem[]) : []);
                    setLookups(resolvedLookups);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            `Impossibile caricare ${resource.labels.plural.toLowerCase()}.`,
                        ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadItems();

        return () => {
            cancelled = true;
        };
    }, [resource]);

    async function handleDelete(item: ResourceItem) {
        const confirmed = window.confirm(
            `Confermi l'eliminazione di questo ${resource.labels.singular}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await resource.service.remove(item.id);
            const data = await resource.service.list();
            setItems(Array.isArray(data) ? (data as ResourceItem[]) : []);
        } catch (err) {
            window.alert(
                getErrorMessage(
                    err,
                    `Eliminazione del ${resource.labels.singular} non riuscita.`,
                ),
            );
        }
    }

    return (
        <section className="space-y-6">
            <PageIntro
                eyebrow={resource.section}
                title={resource.labels.plural}
                description={resource.description}
                action={
                    <Link to={`/${resource.path}/new`} className="btn btn-primary">
                        Nuovo {resource.labels.singular}
                    </Link>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                <StatusPanel title="Risorsa" description={resource.labels.plural} />
                <StatusPanel
                    title="Record caricati"
                    description={isLoading ? "..." : `${items.length}`}
                />
                <StatusPanel title="Route" description={resource.path} />
            </div>

            {isLoading ? (
                <StatusPanel
                    tone="loading"
                    title="Caricamento in corso"
                    description={`Sto recuperando ${resource.labels.plural.toLowerCase()} dal backend.`}
                />
            ) : null}

            {error ? <StatusPanel tone="error" title="Errore API" description={error} /> : null}

            {!isLoading && !error && items.length === 0 ? (
                <StatusPanel
                    title="Nessun record disponibile"
                    description={`Aggiungi il primo ${resource.labels.singular} oppure verifica che l'endpoint restituisca dati.`}
                />
            ) : null}

            {!isLoading && !error && items.length > 0 ? (
                <ResourceTable resource={resource} items={items} onDelete={handleDelete} lookups={lookups} />
            ) : null}
        </section>
    );
}
