/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, shippoApiRequestAllItems } from '../../transport/shippoApi';

export const refundOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['refund'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Request a refund for a label',
        action: 'Create a refund',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a refund by ID',
        action: 'Get a refund',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many refunds',
        action: 'Get many refunds',
      },
    ],
    default: 'create',
  },
];

export const refundFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the transaction (label) to refund',
    displayOptions: {
      show: {
        resource: ['refund'],
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
        resource: ['refund'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Async',
        name: 'async',
        type: 'boolean',
        default: false,
        description: 'Whether to process the refund request asynchronously',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Refund ID',
    name: 'refundId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the refund',
    displayOptions: {
      show: {
        resource: ['refund'],
        operation: ['get'],
      },
    },
  },

  // Get All operation fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['refund'],
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
        resource: ['refund'],
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
];

export async function executeRefundOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const transactionId = this.getNodeParameter('transactionId', itemIndex) as string;
      const options = this.getNodeParameter('options', itemIndex) as IDataObject;

      const body: IDataObject = {
        transaction: transactionId,
      };

      if (options.async !== undefined) {
        body.async = options.async;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/refunds',
        body,
      });
      break;
    }

    case 'get': {
      const refundId = this.getNodeParameter('refundId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/refunds/${refundId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

      if (returnAll) {
        responseData = await shippoApiRequestAllItems.call(this, {
          endpoint: '/refunds',
        });
      } else {
        const limit = this.getNodeParameter('limit', itemIndex) as number;
        responseData = await shippoApiRequest.call(this, {
          endpoint: '/refunds',
          qs: { results: limit },
        });
        responseData = (responseData as IDataObject).results as IDataObject[];
      }
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
