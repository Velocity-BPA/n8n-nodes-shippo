/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { SHIPPO_API_BASE_URL } from '../constants/constants';

export interface IShippoRequestOptions {
  method?: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject | IDataObject[] | string[];
  qs?: IDataObject;
}

export interface IShippoPaginationOptions {
  returnAll?: boolean;
  limit?: number;
}

/**
 * Make an authenticated request to the Shippo API
 */
export async function shippoApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  options: IShippoRequestOptions,
): Promise<IDataObject> {
  const { method = 'GET', endpoint, body, qs } = options;

  const requestOptions = {
    method,
    url: `${SHIPPO_API_BASE_URL}${endpoint}`,
    json: true,
    body: body || undefined,
    qs: qs || undefined,
  };

  try {
    const response = await this.helpers.requestWithAuthentication.call(
      this,
      'shippoApi',
      requestOptions,
    );
    return response as IDataObject;
  } catch (error) {
    const err = error as Error & { description?: string };
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: err.message,
      description: err.description,
    });
  }
}

/**
 * Make a paginated request to the Shippo API and return all results
 */
export async function shippoApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  options: IShippoRequestOptions,
  paginationOptions: IShippoPaginationOptions = {},
): Promise<IDataObject[]> {
  const { returnAll = true, limit = 100 } = paginationOptions;
  const allResults: IDataObject[] = [];
  let page = 1;
  const resultsPerPage = Math.min(limit, 100);
  let hasMore = true;

  while (hasMore) {
    const qs = {
      ...options.qs,
      page,
      results: resultsPerPage,
    };

    const response = await shippoApiRequest.call(this, {
      ...options,
      qs,
    });

    const results = (response.results as IDataObject[]) || [];
    allResults.push(...results);

    if (!returnAll && allResults.length >= limit) {
      return allResults.slice(0, limit);
    }

    if (!response.next) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allResults;
}

/**
 * Validate that required fields are present
 */
export function validateRequiredFields(
  this: IExecuteFunctions,
  data: IDataObject,
  requiredFields: string[],
  itemIndex: number,
): void {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new NodeOperationError(this.getNode(), `The field "${field}" is required`, {
        itemIndex,
      });
    }
  }
}

/**
 * Build an address object from form fields
 */
export function buildAddressObject(fields: IDataObject): IDataObject {
  const address: IDataObject = {};

  const fieldMappings: Record<string, string> = {
    name: 'name',
    company: 'company',
    street1: 'street1',
    street2: 'street2',
    street3: 'street3',
    city: 'city',
    state: 'state',
    zip: 'zip',
    country: 'country',
    phone: 'phone',
    email: 'email',
    isResidential: 'is_residential',
    validate: 'validate',
    metadata: 'metadata',
  };

  for (const [inputField, apiField] of Object.entries(fieldMappings)) {
    if (fields[inputField] !== undefined && fields[inputField] !== '') {
      address[apiField] = fields[inputField];
    }
  }

  return address;
}

/**
 * Build a parcel object from form fields
 */
export function buildParcelObject(fields: IDataObject): IDataObject {
  const parcel: IDataObject = {};

  const fieldMappings: Record<string, string> = {
    length: 'length',
    width: 'width',
    height: 'height',
    distanceUnit: 'distance_unit',
    weight: 'weight',
    massUnit: 'mass_unit',
    template: 'template',
    metadata: 'metadata',
  };

  for (const [inputField, apiField] of Object.entries(fieldMappings)) {
    if (fields[inputField] !== undefined && fields[inputField] !== '') {
      parcel[apiField] = fields[inputField];
    }
  }

  return parcel;
}

/**
 * Build extras object for shipments
 */
export function buildExtrasObject(extras: IDataObject): IDataObject {
  const extrasObj: IDataObject = {};

  if (extras.signatureConfirmation) {
    extrasObj.signature_confirmation = extras.signatureConfirmation;
  }

  if (extras.insurance) {
    const insurance = extras.insurance as IDataObject;
    extrasObj.insurance = {
      amount: insurance.amount,
      currency: insurance.currency || 'USD',
      content: insurance.content,
    };
  }

  if (extras.reference1) {
    extrasObj.reference_1 = extras.reference1;
  }

  if (extras.reference2) {
    extrasObj.reference_2 = extras.reference2;
  }

  if (extras.saturdayDelivery !== undefined) {
    extrasObj.saturday_delivery = extras.saturdayDelivery;
  }

  if (extras.bypassAddressValidation !== undefined) {
    extrasObj.bypass_address_validation = extras.bypassAddressValidation;
  }

  if (extras.isReturn !== undefined) {
    extrasObj.is_return = extras.isReturn;
  }

  if (extras.cod) {
    const cod = extras.cod as IDataObject;
    extrasObj.cod = {
      amount: cod.amount,
      currency: cod.currency || 'USD',
      payment_method: cod.paymentMethod || 'ANY',
    };
  }

  return extrasObj;
}

/**
 * Log licensing notice once per node execution
 */
let licensingNoticeLogged = false;

export function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licensingNoticeLogged = true;
  }
}
