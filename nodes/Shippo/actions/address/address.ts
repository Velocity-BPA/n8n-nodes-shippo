/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import {
  shippoApiRequest,
  shippoApiRequestAllItems,
  buildAddressObject,
} from '../../transport/shippoApi';

export const addressOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['address'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new address',
        action: 'Create an address',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an address by ID',
        action: 'Get an address',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many addresses',
        action: 'Get many addresses',
      },
      {
        name: 'Validate',
        value: 'validate',
        description: 'Validate an existing address',
        action: 'Validate an address',
      },
    ],
    default: 'create',
  },
];

export const addressFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    description: 'Full name of the recipient',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Street Address',
    name: 'street1',
    type: 'string',
    required: true,
    default: '',
    description: 'First line of the street address',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'City',
    name: 'city',
    type: 'string',
    required: true,
    default: '',
    description: 'City name',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'State',
    name: 'state',
    type: 'string',
    required: true,
    default: '',
    description: 'State or province code',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'ZIP/Postal Code',
    name: 'zip',
    type: 'string',
    required: true,
    default: '',
    description: 'Postal or ZIP code',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Country',
    name: 'country',
    type: 'string',
    required: true,
    default: 'US',
    description: 'ISO 3166-1 alpha-2 country code',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Company',
        name: 'company',
        type: 'string',
        default: '',
        description: 'Company name',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Email address',
      },
      {
        displayName: 'Is Residential',
        name: 'isResidential',
        type: 'boolean',
        default: false,
        description: 'Whether this is a residential address',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
        description: 'Custom metadata for your own reference',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Phone number',
      },
      {
        displayName: 'Street Address 2',
        name: 'street2',
        type: 'string',
        default: '',
        description: 'Second line of the street address',
      },
      {
        displayName: 'Street Address 3',
        name: 'street3',
        type: 'string',
        default: '',
        description: 'Third line of the street address',
      },
      {
        displayName: 'Validate',
        name: 'validate',
        type: 'boolean',
        default: false,
        description: 'Whether to validate the address on creation',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Address ID',
    name: 'addressId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the address to retrieve',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['get', 'validate'],
      },
    },
  },

  // GetAll operation fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['getAll'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 25,
    description: 'Max number of results to return',
    displayOptions: {
      show: {
        resource: ['address'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

export async function executeAddressOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const name = this.getNodeParameter('name', itemIndex, '') as string;
      const street1 = this.getNodeParameter('street1', itemIndex) as string;
      const city = this.getNodeParameter('city', itemIndex) as string;
      const state = this.getNodeParameter('state', itemIndex) as string;
      const zip = this.getNodeParameter('zip', itemIndex) as string;
      const country = this.getNodeParameter('country', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      const addressData = buildAddressObject({
        name,
        street1,
        city,
        state,
        zip,
        country,
        ...additionalFields,
      });

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/addresses',
        body: addressData,
      });
      break;
    }

    case 'get': {
      const addressId = this.getNodeParameter('addressId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/addresses/${addressId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/addresses',
        },
        {
          returnAll,
          limit,
        },
      );
      break;
    }

    case 'validate': {
      const addressId = this.getNodeParameter('addressId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/addresses/${addressId}/validate`,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
