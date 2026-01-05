/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest } from '../../transport/shippoApi';

export const rateOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['rate'],
      },
    },
    options: [
      {
        name: 'Get for Shipment',
        value: 'getForShipment',
        description: 'Get rates for a shipment',
        action: 'Get rates for a shipment',
      },
    ],
    default: 'getForShipment',
  },
];

export const rateFields: INodeProperties[] = [
  {
    displayName: 'Shipment ID',
    name: 'shipmentId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the shipment to get rates for',
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['getForShipment'],
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
        resource: ['rate'],
        operation: ['getForShipment'],
      },
    },
    options: [
      {
        displayName: 'Currency Code',
        name: 'currencyCode',
        type: 'string',
        default: 'USD',
        description: 'Filter rates by currency (ISO 4217 code)',
      },
    ],
  },
];

export async function executeRateOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'getForShipment': {
      const shipmentId = this.getNodeParameter('shipmentId', itemIndex) as string;
      const options = this.getNodeParameter('options', itemIndex) as IDataObject;

      const qs: IDataObject = {};
      if (options.currencyCode) {
        qs.currency = options.currencyCode;
      }

      responseData = await shippoApiRequest.call(this, {
        endpoint: `/shipments/${shipmentId}/rates`,
        qs,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
