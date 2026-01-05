/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest } from '../../transport/shippoApi';
import { COMMON_CARRIERS } from '../../constants/constants';

export const trackingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tracking'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Register a tracking number',
        action: 'Create a tracking',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get tracking status',
        action: 'Get tracking status',
      },
    ],
    default: 'create',
  },
];

export const trackingFields: INodeProperties[] = [
  // Common fields
  {
    displayName: 'Carrier',
    name: 'carrier',
    type: 'options',
    required: true,
    default: 'usps',
    options: COMMON_CARRIERS,
    displayOptions: {
      show: {
        resource: ['tracking'],
        operation: ['create', 'get'],
      },
    },
  },
  {
    displayName: 'Tracking Number',
    name: 'trackingNumber',
    type: 'string',
    required: true,
    default: '',
    description: 'The tracking number to register or retrieve',
    displayOptions: {
      show: {
        resource: ['tracking'],
        operation: ['create', 'get'],
      },
    },
  },

  // Create-specific fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['tracking'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
        description: 'Custom metadata for your own reference',
      },
    ],
  },
];

export async function executeTrackingOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  const carrier = this.getNodeParameter('carrier', itemIndex) as string;
  const trackingNumber = this.getNodeParameter('trackingNumber', itemIndex) as string;

  switch (operation) {
    case 'create': {
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      const trackingData: IDataObject = {
        carrier,
        tracking_number: trackingNumber,
      };

      if (additionalFields.metadata) {
        trackingData.metadata = additionalFields.metadata;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/tracks',
        body: trackingData,
      });
      break;
    }

    case 'get': {
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/tracks/${carrier}/${trackingNumber}`,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
