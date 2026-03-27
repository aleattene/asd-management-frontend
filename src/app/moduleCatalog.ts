import { resourceRegistry } from "../features/resources/resourceRegistry";
import type { ModuleDefinition } from "../shared/types/resources";

const plannedModules: ModuleDefinition[] = [
    {
        key: "financialMovements",
        section: "Amministrazione",
        title: "Movimenti finanziari",
        description:
            "Entrate e uscite dell'associazione con causale, data competenza e riconciliazione.",
        status: "planned",
    },
    {
        key: "documentGeneration",
        section: "Generazione documenti",
        title: "Generazione documenti",
        description:
            "Area futura per produrre modulistica, attestazioni ed esportazioni PDF partendo dai dati gestionali.",
        status: "standby",
    },
    {
        key: "regionalCalls",
        section: "Bandi",
        title: "Bandi regionali",
        description:
            "Gestione bandi, scadenze, requisiti, rendicontazione e stato delle candidature regionali.",
        status: "planned",
    },
];

const liveModules: ModuleDefinition[] = resourceRegistry.map((resource) => ({
    key: resource.key,
    section: resource.section,
    title: resource.labels.plural,
    description: resource.description,
    status: "live",
    path: `/${resource.path}`,
    createPath: `/${resource.path}/new`,
}));

const allModules = [...liveModules, ...plannedModules];

export const moduleSections = allModules.reduce<Record<string, ModuleDefinition[]>>(
    (sections, module) => {
        const currentSection = sections[module.section] ?? [];
        currentSection.push(module);
        sections[module.section] = currentSection;
        return sections;
    },
    {},
);
