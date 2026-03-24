import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../shared/api/client.js";
import { PageIntro } from "../../shared/ui/PageIntro.jsx";
import { StatusPanel } from "../../shared/ui/StatusPanel.jsx";
import { ResourceTable } from "../../shared/ui/ResourceTable.jsx";

export function ResourceListPage({ resource }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadItems() {
            setIsLoading(true);
            setError("");

            try {
                const data = await resource.service.list();
                if (!cancelled) {
                    setItems(Array.isArray(data) ? data : []);
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

    async function handleDelete(item) {
        const confirmed = window.confirm(
            `Confermi l'eliminazione di questo ${resource.labels.singular}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await resource.service.remove(item.id);
            const data = await resource.service.list();
            setItems(Array.isArray(data) ? data : []);
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
                    <Link
                        to={`/${resource.path}/new`}
                        className="btn btn-primary"
                    >
                        Nuovo {resource.labels.singular}
                    </Link>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                <StatusPanel
                    title="Risorsa"
                    description={resource.labels.plural}
                />
                <StatusPanel
                    title="Record caricati"
                    description={isLoading ? "..." : `${items.length}`}
                />
                <StatusPanel
                    title="Route"
                    description={resource.path}
                />
            </div>

            {isLoading ? (
                <StatusPanel
                    tone="loading"
                    title="Caricamento in corso"
                    description={`Sto recuperando ${resource.labels.plural.toLowerCase()} dal backend.`}
                />
            ) : null}

            {error ? (
                <StatusPanel tone="error" title="Errore API" description={error} />
            ) : null}

            {!isLoading && !error && items.length === 0 ? (
                <StatusPanel
                    title="Nessun record disponibile"
                    description={`Aggiungi il primo ${resource.labels.singular} oppure verifica che l'endpoint restituisca dati.`}
                />
            ) : null}

            {!isLoading && !error && items.length > 0 ? (
                <ResourceTable
                    resource={resource}
                    items={items}
                    onDelete={handleDelete}
                />
            ) : null}
        </section>
    );
}
