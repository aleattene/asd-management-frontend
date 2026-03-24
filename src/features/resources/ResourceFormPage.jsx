import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../shared/api/client.js";
import { PageIntro } from "../../shared/ui/PageIntro.jsx";
import { StatusPanel } from "../../shared/ui/StatusPanel.jsx";
import { EntityForm } from "../../shared/ui/EntityForm.jsx";

function buildInitialValues(resource) {
    return resource.fields.reduce((values, field) => {
        return {
            ...values,
            [field.name]: "",
        };
    }, {});
}

function normalizeRecord(resource, record) {
    return resource.fields.reduce((values, field) => {
        const fieldValue = record?.[field.name];
        return {
            ...values,
            [field.name]:
                field.type === "select" && typeof fieldValue === "object"
                    ? fieldValue?.id ?? ""
                    : fieldValue ?? "",
        };
    }, {});
}

export function ResourceFormPage({ resource, mode }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = mode === "edit";

    const [formValues, setFormValues] = useState(buildInitialValues(resource));
    const [selectOptions, setSelectOptions] = useState({});
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDependencies() {
            setError("");

            try {
                const optionEntries = await Promise.all(
                    Object.entries(resource.optionLoaders).map(
                        async ([fieldName, loadOptions]) => [
                            fieldName,
                            await loadOptions(),
                        ],
                    ),
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
                    setFormValues(normalizeRecord(resource, data));
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

    function handleChange(event) {
        const { name, value, type } = event.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: type === "number" ? value : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            if (isEditMode) {
                await resource.service.update(id, formValues);
            } else {
                await resource.service.create(formValues);
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
                title={
                    isEditMode
                        ? `Modifica ${resource.labels.singular}`
                        : `Nuovo ${resource.labels.singular}`
                }
                description={resource.description}
            />

            {isLoading ? (
                <StatusPanel
                    tone="loading"
                    title="Recupero dati"
                    description="Sto preparando il form e i dati collegati."
                />
            ) : null}

            {error ? (
                <StatusPanel tone="error" title="Errore" description={error} />
            ) : null}

            {!isLoading ? (
                <EntityForm
                    resource={resource}
                    values={formValues}
                    selectOptions={selectOptions}
                    isSubmitting={isSubmitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/${resource.path}`)}
                    submitLabel={isEditMode ? "Salva modifiche" : "Crea record"}
                />
            ) : null}
        </section>
    );
}
