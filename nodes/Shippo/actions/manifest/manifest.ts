/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, shippoApiRequestAllItems } from '../../transport/shippoApi';

export const manifestOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['manifest'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a manifest (scan form)',
        action: 'Create a manifest',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a manifest by ID',
        action: 'Get a manifest',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many manifests',
        action: 'Get many manifests',
      },
    ],
    default: 'create',
  },
];

export const manifestFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Carrier Account',
    name: 'carrierAccount',
    type: 'string',
    required: true,
    default: '',
    description: 'The carrier account ID',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Shipment Date',
    name: 'shipmentDate',
    type: 'dateTime',
    required: true,
    default: '',
    description: 'Date the shipments will be handed over to the carrier',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Address From Type',
    name: 'addressFromType',
    type: 'options',
    required: true,
    default: 'id',
    options: [
      {
        name: 'Use Address ID',
        value: 'id',
        description: 'Use an existing address ID',
      },
      {
        name: 'Enter Fields',
        value: 'fields',
        description: 'Enter address details',
      },
    ],
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Address From ID',
    name: 'addressFromId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the origin address',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['id'],
      },
    },
  },
  {
    displayName: 'From Street',
    name: 'fromStreet1',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },
  {
    displayName: 'From City',
    name: 'fromCity',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },
  {
    displayName: 'From State',
    name: 'fromState',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },
  {
    displayName: 'From ZIP',
    name: 'fromZip',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },
  {
    displayName: 'From Country',
    name: 'fromCountry',
    type: 'string',
    required: true,
    default: 'US',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['create'],
        addressFromType: ['fields'],
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
        resource: ['manifest'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Async',
        name: 'async',
        type: 'boolean',
        default: false,
        description: 'Whether to process asynchronously',
      },
      {
        displayName: 'Transaction IDs',
        name: 'transactions',
        type: 'string',
        default: '',
        description: 'Comma-separated list of transaction IDs to include',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Manifest ID',
    name: 'manifestId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the manifest',
    displayOptions: {
      show: {
        resource: ['manifest'],
        operation: ['get'],
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
        resource: ['manifest'],
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
        resource: ['manifest'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

export async function executeManifestOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const carrierAccount = this.getNodeParameter('carrierAccount', itemIndex) as string;
      const shipmentDate = this.getNodeParameter('shipmentDate', itemIndex) as string;
      const addressFromType = this.getNodeParameter('addressFromType', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      const manifestData: IDataObject = {
        carrier_account: carrierAccount,
        shipment_date: shipmentDate,
      };

      if (addressFromType === 'id') {
        manifestData.address_from = this.getNodeParameter('addressFromId', itemIndex) as string;
      } else {
        manifestData.address_from = {
          street1: this.getNodeParameter('fromStreet1', itemIndex) as string,
          city: this.getNodeParameter('fromCity', itemIndex) as string,
          state: this.getNodeParameter('fromState', itemIndex) as string,
          zip: this.getNodeParameter('fromZip', itemIndex) as string,
          country: this.getNodeParameter('fromCountry', itemIndex) as string,
        };
      }

      if (additionalFields.async !== undefined) {
        manifestData.async = additionalFields.async;
      }
      if (additionalFields.transactions) {
        manifestData.transactions = (additionalFields.transactions as string)
          .split(',')
          .map((s) => s.trim());
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/manifests',
        body: manifestData,
      });
      break;
    }

    case 'get': {
      const manifestId = this.getNodeParameter('manifestId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/manifests/${manifestId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/manifests',
        },
        {
          returnAll,
          limit,
        },
      );
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
