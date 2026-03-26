export type ResourceFieldType = "text" | "date" | "select" | "number" | "textarea";

export interface ResourceColumnDefinition {
    key: string;
    label: string;
    type?: "date" | "currency";
}

export interface ResourceFieldDefinition {
    name: string;
    label: string;
    type: ResourceFieldType;
    required?: boolean;
    maxLength?: number;
    placeholder?: string;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface CrudService {
    list: () => Promise<unknown>;
    getById: (id: string | number | undefined) => Promise<unknown>;
    create: (payload: Record<string, unknown>) => Promise<unknown>;
    update: (id: string | number | undefined, payload: Record<string, unknown>) => Promise<unknown>;
    remove: (id: string | number | undefined) => Promise<unknown>;
}

export interface ResourceDefinition {
    key: string;
    path: string;
    section: string;
    labels: {
        singular: string;
        plural: string;
    };
    description: string;
    service: CrudService;
    columns: ResourceColumnDefinition[];
    fields: ResourceFieldDefinition[];
    optionLoaders: Record<string, () => Promise<SelectOption[]>>;
}

export type ModuleStatus = "live" | "planned" | "standby";

export interface ModuleDefinition {
    key: string;
    section: string;
    title: string;
    description: string;
    status: ModuleStatus;
    path?: string;
    createPath?: string;
}
