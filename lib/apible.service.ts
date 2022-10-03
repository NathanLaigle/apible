import Axios from 'axios';
import { Subject } from 'rxjs';

import {
  GetAllOptions,
  GetOneOptions,
  InteractivityOptions,
  Primitive,
  ResourceInteractionEvent,
  ResourceInteractionEventType,
} from './types';

export class Apible<TResource extends { id?: Primitive }> {
  /**
   * @description events property is an RXJS subject that can observed to get
   * any interactions on the current apible managed resource.
   */
  events: Subject<ResourceInteractionEvent<TResource>> = new Subject<
    ResourceInteractionEvent<TResource>
  >();

  /**
   * @description get all resource
   * @param url string
   * @param options GetAllOptions
   * @returns Promise<T[]>
   */
  async getAll(
    url: string,
    options?: GetAllOptions<TResource>
  ): Promise<TResource[]> {
    let generatedUrl: string = url;

    if (options?.queryFilters) {
      const { queryFilters } = options;

      Object.entries(queryFilters).map(([filter, value], index) => {
        generatedUrl += index ? `&` : `?`;
        generatedUrl += `${filter}=${value}`;
      });
    }

    try {
      const response = (await Axios.get<TResource[]>(generatedUrl)).data;

      this.checkInteractions(options);

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @return Promise
   * @param url string
   * @param id any
   * @param options GetOneOptions
   */
  async getOne(
    url: string,
    id: Primitive,
    options?: GetOneOptions<TResource>
  ): Promise<TResource> {
    try {
      const response = (await Axios.get<TResource>(`${url}/${String(id)}`))
        .data;

      this.checkInteractions(options);

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description create a resource
   * @param url string
   * @param resource TResource
   * @param options InteractivityOptions
   * @returns Promise<TCreateResponse>
   */
  async create<TCreateResponse>(
    url: string,
    resource: TResource,
    options?: InteractivityOptions
  ): Promise<TCreateResponse> {
    try {
      const response = (await Axios.post<TCreateResponse>(url, resource)).data;

      const handleInteractivity =
        options?.handleInteractivity !== undefined
          ? options?.handleInteractivity
          : true;

      this.checkInteractions({
        type: 'create',
        handleInteractivity: handleInteractivity,
        customInteractionMetaData: options?.customInteractionMetaData,
        resource,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description delete a resource
   * @param url string
   * @param id any
   * @param options InteractivityOptions
   * @returns Promise
   */
  async delete<TDeleteResponse>(
    url: string,
    id: Primitive,
    options: InteractivityOptions
  ): Promise<TDeleteResponse> {
    try {
      const response = (
        await Axios.delete<TDeleteResponse>(`${url}/${String(id)}`)
      ).data;

      const handleInteractivity =
        options?.handleInteractivity !== undefined
          ? options?.handleInteractivity
          : true;

      this.checkInteractions({
        type: 'delete',
        handleInteractivity: handleInteractivity,
        customInteractionMetaData: options?.customInteractionMetaData,
        resource: { id: id } as Partial<TResource>,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description update a resource
   * @param url string
   * @param resource TResource & { id: Primitive }
   * @param options InteractivityOptions
   * @returns Promise
   */
  async update<TUpdateResponse>(
    url: string,
    resource: TResource & { id: Primitive },
    options?: InteractivityOptions
  ): Promise<TUpdateResponse> {
    const { id } = resource;

    try {
      const response = (
        await Axios.patch<TUpdateResponse>(`${url}/${String(id)}`, resource)
      ).data;

      const handleInteractivity =
        options?.handleInteractivity !== undefined
          ? options?.handleInteractivity
          : true;

      this.checkInteractions({
        type: 'update',
        handleInteractivity: handleInteractivity,
        customInteractionMetaData: options?.customInteractionMetaData,
        resource: resource as Partial<TResource>,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description check interactions and update events property if need
   * @param options ResourceInteractionEvent
   * @return void
   */
  private checkInteractions(
    options: {
      interaction?: ResourceInteractionEvent<TResource>;
      resource?: Partial<TResource> & { id?: Primitive };
      type?: ResourceInteractionEventType;
    } & InteractivityOptions
  ): void {
    if (options?.interaction) {
      // If interaction has been manually set
      this.events.next(options.interaction);
    } else if (options?.handleInteractivity) {
      // If interaction is the default behavior
      this.events.next({
        type: options?.type,
        metaData: options?.customInteractionMetaData,
        resource: options?.resource,
      });
    }
  }
}
