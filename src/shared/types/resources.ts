export type ResourceFieldType = "text" | "date" | "select" | "number" | "textarea";

export interface ResourceColumnDefinition {
    key: string;
    label: string;
    type?: "date" | "currency";
    lookupSource?: string;
}

export interface ResourceFieldDefinition {
    name: string;
    label: string;
    type: ResourceFieldType;
    required?: boolean;
    maxLength?: number;
    placeholder?: string;
    defaultValue?: string | number | boolean;
    valueType?: "boolean";
    copyFrom?: string;
    copyWhen?: {
        field: string;
        value: string | number | boolean;
    };
    readOnlyWhen?: {
        field: string;
        value: string | number | boolean;
    };
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface CrudService {
    list: () => Promise<unknown>;
    getById: (id: string | number) => Promise<unknown>;
    create: (payload: Record<string, unknown>) => Promise<unknown>;
    update: (id: string | number, payload: Record<string, unknown>) => Promise<unknown>;
    remove: (id: string | number) => Promise<unknown>;
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
