import { ResourceInteractionEvent } from './interactions.type';

export type GetOneOptions<T> = {
  interaction?: ResourceInteractionEvent<T>;
};
