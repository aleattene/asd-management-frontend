import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../shared/api/client.js";
import { PageIntro } from "../../shared/ui/PageIntro";
import { StatusPanel } from "../../shared/ui/StatusPanel";
import { EntityForm } from "../../shared/ui/EntityForm";
import type { ResourceDefinition, SelectOption } from "../../shared/types/resources";

type FormValues = Record<string, string | number>;
type FormRecord = Record<string, unknown>;

function buildInitialValues(resource: ResourceDefinition): FormValues {
    return resource.fields.reduce<FormValues>((values, field) => {
        values[field.name] = "";
        return values;
    }, {});
}

function normalizeRecord(resource: ResourceDefinition, record: FormRecord): FormValues {
    return resource.fields.reduce<FormValues>((values, field) => {
        const fieldValue = record?.[field.name];
        values[field.name] =
            field.type === "select" && typeof fieldValue === "object" && fieldValue !== null
                ? (((fieldValue as { id?: string | number }).id ?? "") as string | number)
                : ((fieldValue ?? "") as string | number);
        return values;
    }, {});
}

function buildSubmitPayload(resource: ResourceDefinition, values: FormValues) {
    return resource.fields.reduce<Record<string, string | number>>((payload, field) => {
        const fieldValue = values[field.name];
        payload[field.name] = field.type === "number" && fieldValue !== "" ? Number(fieldValue) : fieldValue;
        return payload;
    }, {});
}

interface ResourceFormPageProps {
    resource: ResourceDefinition;
    mode: "create" | "edit";
}

export function ResourceFormPage({ resource, mode }: ResourceFormPageProps) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = mode === "edit";

    const [formValues, setFormValues] = useState<FormValues>(buildInitialValues(resource));
    const [selectOptions, setSelectOptions] = useState<Record<string, SelectOption[]>>({});
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDependencies() {
            setError("");

            try {
                const optionEntries = await Promise.all(
                    Object.entries(resource.optionLoaders).map(async ([fieldName, loadOptions]) => [
                        fieldName,
                        await loadOptions(),
                    ]),
                );

                if (!cancelled) {
                    setSelectOptions(Object.fromEntries(optionEntries));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            "Impossibile caricare i dati di supporto per il form.",
                        ),
                    );
                }
            }
        }

        loadDependencies();

        return () => {
            cancelled = true;
        };
    }, [resource]);

    useEffect(() => {
        let cancelled = false;

        async function loadRecord() {
            if (!isEditMode) {
                setFormValues(buildInitialValues(resource));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const data = await resource.service.getById(id);
                if (!cancelled) {
                    setFormValues(normalizeRecord(resource, data as FormRecord));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            `Impossibile caricare questo ${resource.labels.singular}.`,
                        ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadRecord();

        return () => {
            cancelled = true;
        };
    }, [id, isEditMode, resource]);

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const payload = buildSubmitPayload(resource, formValues);

            if (isEditMode) {
                await resource.service.update(id, payload);
            } else {
                await resource.service.create(payload);
            }

            navigate(`/${resource.path}`);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    `Salvataggio del ${resource.labels.singular} non riuscito.`,
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="space-y-6">
            <PageIntro
                eyebrow={resource.section}
                title={isEditMode ? `Modifica ${resource.labels.singular}` : `Nuovo ${resource.labels.singular}`}
                description={resource.description}
            />

            {isLoading ? (
                <StatusPanel
                    tone="loading"
                    title="Recupero dati"
                    description="Sto preparando il form e i dati collegati."
                />
            ) : null}

            {error ? <StatusPanel tone="error" title="Errore" description={error} /> : null}

            {!isLoading ? (
                <EntityForm
                    resource={resource}
                    values={formValues}
                    selectOptions={selectOptions}
                    isSubmitting={isSubmitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/${resource.path}`)}
                    submitLabel={
                        isEditMode
                            ? `Salva ${resource.labels.singular}`
                            : `Aggiungi ${resource.labels.singular}`
                    }
                />
            ) : null}
        </section>
    );
}
