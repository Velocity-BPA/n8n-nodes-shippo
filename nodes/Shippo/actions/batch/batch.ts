/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, shippoApiRequestAllItems } from '../../transport/shippoApi';
import { LABEL_FILE_TYPES } from '../../constants/constants';

export const batchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['batch'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new batch',
        action: 'Create a batch',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a batch by ID',
        action: 'Get a batch',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many batches',
        action: 'Get many batches',
      },
      {
        name: 'Add Shipments',
        value: 'addShipments',
        description: 'Add shipments to a batch',
        action: 'Add shipments to a batch',
      },
      {
        name: 'Remove Shipments',
        value: 'removeShipments',
        description: 'Remove shipments from a batch',
        action: 'Remove shipments from a batch',
      },
      {
        name: 'Purchase',
        value: 'purchase',
        description: 'Purchase all labels in a batch',
        action: 'Purchase a batch',
      },
    ],
    default: 'create',
  },
];

export const batchFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Default Carrier Account',
    name: 'defaultCarrierAccount',
    type: 'string',
    required: true,
    default: '',
    description: 'Default carrier account ID for the batch',
    displayOptions: {
      show: {
        resource: ['batch'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Default Service Level Token',
    name: 'defaultServicelevelToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'e.g., usps_priority',
    description: 'Default service level token for the batch',
    displayOptions: {
      show: {
        resource: ['batch'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Batch Shipments (JSON)',
    name: 'batchShipments',
    type: 'json',
    required: true,
    default: '[]',
    description: 'Array of batch shipment objects in JSON format',
    displayOptions: {
      show: {
        resource: ['batch'],
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
        resource: ['batch'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Label File Type',
        name: 'labelFiletype',
        type: 'options',
        default: 'PDF',
        options: LABEL_FILE_TYPES,
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Batch ID',
    name: 'batchId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the batch',
    displayOptions: {
      show: {
        resource: ['batch'],
        operation: ['get', 'addShipments', 'removeShipments', 'purchase'],
      },
    },
  },

  // Add/Remove Shipments fields
  {
    displayName: 'Shipments (JSON)',
    name: 'shipments',
    type: 'json',
    required: true,
    default: '[]',
    description: 'Array of shipment objects or IDs in JSON format',
    displayOptions: {
      show: {
        resource: ['batch'],
        operation: ['addShipments'],
      },
    },
  },
  {
    displayName: 'Shipment IDs',
    name: 'shipmentIds',
    type: 'string',
    required: true,
    default: '',
    description: 'Comma-separated list of batch shipment IDs to remove',
    displayOptions: {
      show: {
        resource: ['batch'],
        operation: ['removeShipments'],
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
        resource: ['batch'],
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
        resource: ['batch'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

export async function executeBatchOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const defaultCarrierAccount = this.getNodeParameter('defaultCarrierAccount', itemIndex) as string;
      const defaultServicelevelToken = this.getNodeParameter('defaultServicelevelToken', itemIndex) as string;
      const batchShipments = this.getNodeParameter('batchShipments', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      let parsedShipments: IDataObject[];
      try {
        parsedShipments = JSON.parse(batchShipments) as IDataObject[];
      } catch {
        throw new Error('Invalid JSON format for batch shipments');
      }

      const batchData: IDataObject = {
        default_carrier_account: defaultCarrierAccount,
        default_servicelevel_token: defaultServicelevelToken,
        batch_shipments: parsedShipments,
      };

      if (additionalFields.labelFiletype) {
        batchData.label_filetype = additionalFields.labelFiletype;
      }
      if (additionalFields.metadata) {
        batchData.metadata = additionalFields.metadata;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/batches',
        body: batchData,
      });
      break;
    }

    case 'get': {
      const batchId = this.getNodeParameter('batchId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/batches/${batchId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/batches',
        },
        {
          returnAll,
          limit,
        },
      );
      break;
    }

    case 'addShipments': {
      const batchId = this.getNodeParameter('batchId', itemIndex) as string;
      const shipments = this.getNodeParameter('shipments', itemIndex) as string;

      let parsedShipments: IDataObject[];
      try {
        parsedShipments = JSON.parse(shipments) as IDataObject[];
      } catch {
        throw new Error('Invalid JSON format for shipments');
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: `/batches/${batchId}/add_shipments`,
        body: parsedShipments,
      });
      break;
    }

    case 'removeShipments': {
      const batchId = this.getNodeParameter('batchId', itemIndex) as string;
      const shipmentIds = this.getNodeParameter('shipmentIds', itemIndex) as string;

      const idsArray = shipmentIds.split(',').map((s) => s.trim());

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: `/batches/${batchId}/remove_shipments`,
        body: idsArray,
      });
      break;
    }

    case 'purchase': {
      const batchId = this.getNodeParameter('batchId', itemIndex) as string;

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: `/batches/${batchId}/purchase`,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
