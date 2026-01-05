/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, shippoApiRequestAllItems } from '../../transport/shippoApi';
import { COMMON_CARRIERS } from '../../constants/constants';

export const carrierAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a carrier account',
        action: 'Create a carrier account',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a carrier account',
        action: 'Delete a carrier account',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a carrier account by ID',
        action: 'Get a carrier account',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many carrier accounts',
        action: 'Get many carrier accounts',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a carrier account',
        action: 'Update a carrier account',
      },
    ],
    default: 'getAll',
  },
];

export const carrierAccountFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Carrier',
    name: 'carrier',
    type: 'options',
    required: true,
    default: '',
    options: COMMON_CARRIERS,
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['create'],
      },
    },
    description: 'The carrier type',
  },
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    description: 'The account number with the carrier',
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Parameters (JSON)',
    name: 'parameters',
    type: 'json',
    required: true,
    default: '{}',
    description: 'Carrier-specific credentials and settings as JSON',
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the carrier account is active',
      },
      {
        displayName: 'Test',
        name: 'test',
        type: 'boolean',
        default: false,
        description: 'Whether this is a test account',
      },
    ],
  },

  // Get, Update, Delete operation fields
  {
    displayName: 'Carrier Account ID',
    name: 'carrierAccountId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the carrier account',
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['get', 'update', 'delete'],
      },
    },
  },

  // Update operation fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        description: 'The account number with the carrier',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the carrier account is active',
      },
      {
        displayName: 'Parameters (JSON)',
        name: 'parameters',
        type: 'json',
        default: '{}',
        description: 'Carrier-specific credentials and settings as JSON',
      },
    ],
  },

  // Get All operation fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 25,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['carrierAccount'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Carrier',
        name: 'carrier',
        type: 'options',
        default: '',
        options: [{ name: 'All Carriers', value: '' }, ...COMMON_CARRIERS],
        description: 'Filter by carrier type',
      },
    ],
  },
];

export async function executeCarrierAccountOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const carrier = this.getNodeParameter('carrier', itemIndex) as string;
      const accountId = this.getNodeParameter('accountId', itemIndex) as string;
      const parameters = this.getNodeParameter('parameters', itemIndex) as string;
      const options = this.getNodeParameter('options', itemIndex) as IDataObject;

      let parsedParams: IDataObject;
      try {
        parsedParams = JSON.parse(parameters) as IDataObject;
      } catch {
        throw new Error('Invalid JSON in parameters field');
      }

      const body: IDataObject = {
        carrier,
        account_id: accountId,
        parameters: parsedParams,
      };

      if (options.active !== undefined) {
        body.active = options.active;
      }
      if (options.test !== undefined) {
        body.test = options.test;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/carrier_accounts',
        body,
      });
      break;
    }

    case 'get': {
      const carrierAccountId = this.getNodeParameter('carrierAccountId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/carrier_accounts/${carrierAccountId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const filters = this.getNodeParameter('filters', itemIndex) as IDataObject;

      const qs: IDataObject = {};
      if (filters.carrier) {
        qs.carrier = filters.carrier;
      }

      if (returnAll) {
        responseData = await shippoApiRequestAllItems.call(this, {
          endpoint: '/carrier_accounts',
          qs,
        });
      } else {
        const limit = this.getNodeParameter('limit', itemIndex) as number;
        qs.results = limit;
        responseData = await shippoApiRequest.call(this, {
          endpoint: '/carrier_accounts',
          qs,
        });
        responseData = (responseData as IDataObject).results as IDataObject[];
      }
      break;
    }

    case 'update': {
      const carrierAccountId = this.getNodeParameter('carrierAccountId', itemIndex) as string;
      const updateFields = this.getNodeParameter('updateFields', itemIndex) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.accountId) {
        body.account_id = updateFields.accountId;
      }
      if (updateFields.active !== undefined) {
        body.active = updateFields.active;
      }
      if (updateFields.parameters) {
        try {
          body.parameters = JSON.parse(updateFields.parameters as string) as IDataObject;
        } catch {
          throw new Error('Invalid JSON in parameters field');
        }
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'PUT',
        endpoint: `/carrier_accounts/${carrierAccountId}`,
        body,
      });
      break;
    }

    case 'delete': {
      const carrierAccountId = this.getNodeParameter('carrierAccountId', itemIndex) as string;
      await shippoApiRequest.call(this, {
        method: 'DELETE',
        endpoint: `/carrier_accounts/${carrierAccountId}`,
      });
      responseData = { success: true, deleted: carrierAccountId };
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
