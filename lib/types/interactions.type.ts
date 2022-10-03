export type ResourceInteractionEventType =
  | 'create'
  | 'delete'
  | 'update'
  | 'get';

export type ResourceInteractionEvent<T> = {
  type: ResourceInteractionEventType;
  resource?: Partial<T>;
  metaData?: string | string[];
};

export type InteractivityOptions = {
  handleInteractivity?: boolean;
  customInteractionMetaData?: string | string[];
};
