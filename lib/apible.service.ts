import Axios from 'axios';
import { Subject } from 'rxjs';

export type ResourceInteractionEventType = 'create' | 'delete' | 'update';

export type ResourceInteractionEvent<T> = {
  type: ResourceInteractionEventType;
  resource?: T;
  metaData?: string | string[];
};

export type InteractivityOptions = {
  handleInteractivity: boolean;
  customInteractionMetaData: string | string[];
};

export class Apible<TResource, TAdditionalQueryFilters = string[]> {
  event: Subject<ResourceInteractionEvent<TResource>> = new Subject<
    ResourceInteractionEvent<TResource>
  >();

  /**
   *
   * @param options
   * @returns Promise<T[]>
   */
  async getAll(options: {
    url: string;
    queryFilters?: Record<
      keyof (TResource | TAdditionalQueryFilters),
      string
    >[];
  }): Promise<TResource[]> {
    const { url, queryFilters } = options;

    let generatedUrl: string = url;

    queryFilters.map((filter, index, queryFiltersInstance) => {
      generatedUrl += index ? `${generatedUrl}&` : `${generatedUrl}?`;
      generatedUrl += `${Object.keys(queryFiltersInstance)[index]}=${filter}`;
    });

    try {
      return (await Axios.get<TResource[]>(generatedUrl)).data;
    } catch (error) {
      throw error;
    }
  }
}
