import { createCrudService } from "../../shared/api/createCrudService";
import type { ResourceDefinition, SelectOption } from "../../shared/types/resources";

const athletesService = createCrudService("athletes");
const categoriesService = createCrudService("categories");
const usersService = createCrudService("users");
const trainersService = createCrudService("trainers");
const sportDoctorsService = createCrudService("doctors");
const partnerCompaniesService = createCrudService("companies");
const countriesService = createCrudService("countries");
const paymentsService = createCrudService("payments/payments");
const sportCertificatesService = createCrudService("certificates");

function toPersonOption(item: Record<string, unknown>): SelectOption {
    return {
        value: item.id as string | number,
        label: `${item.first_name as string} ${item.last_name as string}`,
    };
}

function toUserOption(item: Record<string, unknown>): SelectOption {
    const firstName = (item.first_name as string) ?? "";
    const lastName = (item.last_name as string) ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
        value: item.id as string | number,
        label: fullName || (item.username as string) || (item.email as string),
    };
}

export const resourceRegistry: ResourceDefinition[] = [
    {
        key: "athletes",
        path: "athletes",
        section: "Anagrafiche",
        labels: {
            singular: "atleta",
            plural: "Atleti",
        },
        description:
            "Gestione anagrafica atleti, categoria sportiva e dati identificativi principali.",
        service: athletesService,
        columns: [
            { key: "first_name", label: "Nome" },
            { key: "last_name", label: "Cognome" },
            { key: "date_of_birth", label: "Data di nascita", type: "date" },
            { key: "fiscal_code", label: "Codice fiscale" },
            { key: "category", label: "Categoria" },
            { key: "is_active", label: "Attivo" },
        ],
        fields: [
            {
                name: "guardian",
                label: "Tutore",
                type: "select",
                required: true,
                placeholder: "Seleziona tutore",
            },
            { name: "first_name", label: "Nome", type: "text", required: true },
            { name: "last_name", label: "Cognome", type: "text", required: true },
            {
                name: "date_of_birth",
                label: "Data di nascita",
                type: "date",
                required: true,
            },
            {
                name: "place_of_birth",
                label: "Luogo di nascita",
                type: "text",
                required: true,
            },
            {
                name: "fiscal_code",
                label: "Codice fiscale",
                type: "text",
                required: true,
                maxLength: 16,
            },
            {
                name: "category",
                label: "Categoria",
                type: "select",
                required: true,
                placeholder: "Seleziona categoria",
            },
            {
                name: "trainer",
                label: "Allenatore",
                type: "select",
                placeholder: "Seleziona allenatore",
            },
            {
                name: "nationality",
                label: "Nazionalita'",
                type: "select",
                placeholder: "Seleziona nazionalita'",
            },
            {
                name: "is_active",
                label: "Atleta attivo",
                type: "select",
                required: true,
                defaultValue: true,
                valueType: "boolean",
                placeholder: "Seleziona stato",
            },
        ],
        optionLoaders: {
            guardian: async () => {
                const items = await usersService.list();
                return (items as Record<string, unknown>[]).map(toUserOption);
            },
            category: async () => {
                const items = await categoriesService.list();
                return (items as Record<string, unknown>[]).map((item) => ({
                    value: item.id as string | number,
                    label: `${item.code as string} - ${item.description as string}`,
                }));
            },
            trainer: async () => {
                const items = await trainersService.list();
                return (items as Record<string, unknown>[]).map(toPersonOption);
            },
            nationality: async () => {
                const items = await countriesService.list();
                return (items as Record<string, unknown>[]).map((item) => ({
                    value: item.id as string | number,
                    label: item.name as string,
                }));
            },
            is_active: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
        },
    },
    {
        key: "trainers",
        path: "trainers",
        section: "Anagrafiche",
        labels: {
            singular: "allenatore",
            plural: "Allenatori",
        },
        description:
            "Archivio allenatori con dati personali e riferimenti fiscali.",
        service: trainersService,
        columns: [
            { key: "first_name", label: "Nome" },
            { key: "last_name", label: "Cognome" },
            { key: "fiscal_code", label: "Codice fiscale" },
            { key: "is_active", label: "Attivo" },
        ],
        fields: [
            { name: "first_name", label: "Nome", type: "text", required: true },
            { name: "last_name", label: "Cognome", type: "text", required: true },
            {
                name: "fiscal_code",
                label: "Codice fiscale",
                type: "text",
                required: true,
                maxLength: 16,
            },
            {
                name: "user",
                label: "Utente collegato",
                type: "select",
                placeholder: "Seleziona utente",
            },
            {
                name: "is_active",
                label: "Allenatore attivo",
                type: "select",
                required: true,
                defaultValue: true,
                valueType: "boolean",
                placeholder: "Seleziona stato",
            },
        ],
        optionLoaders: {
            user: async () => {
                const items = await usersService.list();
                return (items as Record<string, unknown>[]).map(toUserOption);
            },
            is_active: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
        },
    },
    {
        key: "sportDoctors",
        path: "sport-doctors",
        section: "Anagrafiche",
        labels: {
            singular: "medico sportivo",
            plural: "Medici sportivi",
        },
        description:
            "Professionisti sanitari collegati ai certificati medici sportivi.",
        service: sportDoctorsService,
        columns: [
            { key: "first_name", label: "Nome" },
            { key: "last_name", label: "Cognome" },
            { key: "vat_number", label: "Partita IVA" },
            { key: "is_active", label: "Attivo" },
        ],
        fields: [
            { name: "first_name", label: "Nome", type: "text", required: true },
            { name: "last_name", label: "Cognome", type: "text", required: true },
            {
                name: "vat_number",
                label: "Partita IVA",
                type: "text",
                required: true,
                maxLength: 11,
            },
            {
                name: "is_active",
                label: "Medico attivo",
                type: "select",
                required: true,
                defaultValue: true,
                valueType: "boolean",
                placeholder: "Seleziona stato",
            },
        ],
        optionLoaders: {
            is_active: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
        },
    },
    {
        key: "partnerCompanies",
        path: "partner-companies",
        section: "Anagrafiche",
        labels: {
            singular: "societa' partner",
            plural: "Societa' partner",
        },
        description:
            "Archivio societa' convenzionate o partner dell'associazione, con riferimenti principali e stato collaborazione.",
        service: partnerCompaniesService,
        columns: [
            { key: "business_name", label: "Ragione sociale" },
            { key: "vat_number", label: "Partita IVA" },
            { key: "fiscal_code", label: "Codice fiscale" },
            { key: "is_active", label: "Attiva" },
            { key: "created_at", label: "Creata il" },
        ],
        fields: [
            {
                name: "business_name",
                label: "Ragione sociale",
                type: "text",
                required: true,
            },
            {
                name: "vat_number",
                label: "Partita IVA",
                type: "text",
                maxLength: 11,
            },
            {
                name: "fiscal_code",
                label: "Codice fiscale",
                type: "text",
                maxLength: 16,
                copyFrom: "vat_number",
                copyWhen: {
                    field: "vat_equals_fc",
                    value: true,
                },
                readOnlyWhen: {
                    field: "vat_equals_fc",
                    value: true,
                },
            },
            {
                name: "vat_equals_fc",
                label: "Partita IVA uguale a Codice fiscale",
                type: "select",
                required: true,
                placeholder: "Seleziona opzione",
                defaultValue: true,
                valueType: "boolean",
            },
            {
                name: "is_active",
                label: "Societa' attiva",
                type: "select",
                required: true,
                placeholder: "Seleziona stato",
                defaultValue: true,
                valueType: "boolean",
            },
        ],
        optionLoaders: {
            vat_equals_fc: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
            is_active: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
        },
    },
    {
        key: "payments",
        path: "payments",
        section: "Amministrazione",
        labels: {
            singular: "compenso",
            plural: "Compensi",
        },
        description:
            "Compensi trainer con data pagamento, importo e collegamento al tecnico.",
        service: paymentsService,
        columns: [
            { key: "id", label: "ID" },
            { key: "payment_date", label: "Data pagamento", type: "date" },
            { key: "amount", label: "Importo", type: "currency" },
            { key: "trainer", label: "Allenatore" },
        ],
        fields: [
            {
                name: "payment_date",
                label: "Data di pagamento",
                type: "date",
                required: true,
            },
            { name: "amount", label: "Importo", type: "number", required: true },
            {
                name: "trainer",
                label: "Allenatore",
                type: "select",
                required: true,
                placeholder: "Seleziona allenatore",
            },
        ],
        optionLoaders: {
            trainer: async () => {
                const items = await trainersService.list();
                return (items as Record<string, unknown>[]).map(toPersonOption);
            },
        },
    },
    {
        key: "sportCertificates",
        path: "sport-certificates",
        section: "Documentazione",
        labels: {
            singular: "certificato medico",
            plural: "Certificati medici",
        },
        description:
            "Documenti sanitari con scadenza, atleta associato e medico emittente.",
        service: sportCertificatesService,
        columns: [
            { key: "issue_date", label: "Emissione", type: "date" },
            { key: "expiration_date", label: "Scadenza", type: "date" },
            { key: "athlete", label: "Atleta" },
            { key: "doctor", label: "Medico sportivo" },
            { key: "is_active", label: "Attivo" },
        ],
        fields: [
            {
                name: "issue_date",
                label: "Data emissione",
                type: "date",
                required: true,
            },
            {
                name: "expiration_date",
                label: "Data scadenza",
                type: "date",
                required: true,
            },
            {
                name: "doctor",
                label: "Medico sportivo",
                type: "select",
                required: true,
                placeholder: "Seleziona medico",
            },
            {
                name: "athlete",
                label: "Atleta",
                type: "select",
                required: true,
                placeholder: "Seleziona atleta",
            },
            {
                name: "is_active",
                label: "Certificato attivo",
                type: "select",
                required: true,
                defaultValue: true,
                valueType: "boolean",
                placeholder: "Seleziona stato",
            },
        ],
        optionLoaders: {
            doctor: async () => {
                const items = await sportDoctorsService.list();
                return (items as Record<string, unknown>[]).map(toPersonOption);
            },
            athlete: async () => {
                const items = await athletesService.list();
                return (items as Record<string, unknown>[]).map(toPersonOption);
            },
            is_active: async () => [
                { value: "true", label: "Si" },
                { value: "false", label: "No" },
            ],
        },
    },
];
