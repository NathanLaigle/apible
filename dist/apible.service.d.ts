import { Subject } from 'rxjs';
export declare type ResourceInteractionEventType = 'create' | 'delete' | 'update';
export declare type ResourceInteractionEvent<T> = {
    type: ResourceInteractionEventType;
    resource?: T;
    metaData?: string | string[];
};
export declare type InteractivityOptions = {
    handleInteractivity: boolean;
    customInteractionMetaData: string | string[];
};
export declare class Apible<TResource, TAdditionalQueryFilters = string[]> {
    event: Subject<ResourceInteractionEvent<TResource>>;
    getAll(options: {
        url: string;
        queryFilters?: Record<keyof (TResource | TAdditionalQueryFilters), string>[];
    }): Promise<TResource[]>;
}
