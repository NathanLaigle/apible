import { ResourceInteractionEvent } from './interactions.type';

export type GetAllOptions<T> = {
  queryFilters?: Partial<Record<keyof T, string> | Record<string, string>>;
  interaction?: ResourceInteractionEvent<T>;
};
