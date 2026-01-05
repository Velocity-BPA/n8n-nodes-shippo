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
  buildParcelObject,
} from '../../transport/shippoApi';
import { LABEL_FILE_TYPES, DISTANCE_UNITS, MASS_UNITS } from '../../constants/constants';

export const transactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a transaction (purchase a label)',
        action: 'Create a transaction',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a transaction by ID',
        action: 'Get a transaction',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many transactions',
        action: 'Get many transactions',
      },
    ],
    default: 'create',
  },
];

export const transactionFields: INodeProperties[] = [
  // Create operation - Method selection
  {
    displayName: 'Creation Method',
    name: 'creationMethod',
    type: 'options',
    required: true,
    default: 'fromRate',
    options: [
      {
        name: 'From Rate ID',
        value: 'fromRate',
        description: 'Purchase a label using an existing rate ID',
      },
      {
        name: 'One-Call (Shipment + Purchase)',
        value: 'oneCall',
        description: 'Create shipment and purchase label in one call',
      },
    ],
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
      },
    },
  },

  // From Rate method
  {
    displayName: 'Rate ID',
    name: 'rateId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the rate to purchase',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['fromRate'],
      },
    },
  },

  // One-Call method fields
  {
    displayName: 'Carrier Account',
    name: 'carrierAccount',
    type: 'string',
    required: true,
    default: '',
    description: 'The carrier account ID to use',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Service Level Token',
    name: 'servicelevelToken',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'e.g., usps_priority',
    description: 'The service level token (e.g., usps_priority, ups_ground)',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },

  // One-Call Address From
  {
    displayName: 'From Name',
    name: 'ocFromName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'From Street',
    name: 'ocFromStreet1',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'From City',
    name: 'ocFromCity',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'From State',
    name: 'ocFromState',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'From ZIP',
    name: 'ocFromZip',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'From Country',
    name: 'ocFromCountry',
    type: 'string',
    required: true,
    default: 'US',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },

  // One-Call Address To
  {
    displayName: 'To Name',
    name: 'ocToName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'To Street',
    name: 'ocToStreet1',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'To City',
    name: 'ocToCity',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'To State',
    name: 'ocToState',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'To ZIP',
    name: 'ocToZip',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'To Country',
    name: 'ocToCountry',
    type: 'string',
    required: true,
    default: 'US',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },

  // One-Call Parcel
  {
    displayName: 'Length',
    name: 'ocLength',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Width',
    name: 'ocWidth',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Height',
    name: 'ocHeight',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Distance Unit',
    name: 'ocDistanceUnit',
    type: 'options',
    required: true,
    default: 'in',
    options: DISTANCE_UNITS,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Weight',
    name: 'ocWeight',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },
  {
    displayName: 'Mass Unit',
    name: 'ocMassUnit',
    type: 'options',
    required: true,
    default: 'lb',
    options: MASS_UNITS,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['create'],
        creationMethod: ['oneCall'],
      },
    },
  },

  // Common create fields
  {
    displayName: 'Label File Type',
    name: 'labelFileType',
    type: 'options',
    default: 'PDF',
    options: LABEL_FILE_TYPES,
    displayOptions: {
      show: {
        resource: ['transaction'],
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
        resource: ['transaction'],
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
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
        description: 'Custom metadata for your own reference',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the transaction to retrieve',
    displayOptions: {
      show: {
        resource: ['transaction'],
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
        resource: ['transaction'],
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
        resource: ['transaction'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Object Status',
        name: 'objectStatus',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Success', value: 'SUCCESS' },
          { name: 'Pending', value: 'PENDING' },
          { name: 'Error', value: 'ERROR' },
          { name: 'Refunded', value: 'REFUNDED' },
          { name: 'Refund Pending', value: 'REFUNDPENDING' },
          { name: 'Refund Rejected', value: 'REFUNDREJECTED' },
        ],
        description: 'Filter by transaction status',
      },
      {
        displayName: 'Tracking Status',
        name: 'trackingStatus',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Unknown', value: 'UNKNOWN' },
          { name: 'Delivered', value: 'DELIVERED' },
          { name: 'Transit', value: 'TRANSIT' },
          { name: 'Failure', value: 'FAILURE' },
          { name: 'Returned', value: 'RETURNED' },
        ],
        description: 'Filter by tracking status',
      },
    ],
  },
];

export async function executeTransactionOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const creationMethod = this.getNodeParameter('creationMethod', itemIndex) as string;
      const labelFileType = this.getNodeParameter('labelFileType', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      const transactionData: IDataObject = {
        label_file_type: labelFileType,
      };

      if (additionalFields.async !== undefined) {
        transactionData.async = additionalFields.async;
      }
      if (additionalFields.metadata) {
        transactionData.metadata = additionalFields.metadata;
      }

      if (creationMethod === 'fromRate') {
        transactionData.rate = this.getNodeParameter('rateId', itemIndex) as string;
      } else {
        // One-call method
        transactionData.carrier_account = this.getNodeParameter('carrierAccount', itemIndex) as string;
        transactionData.servicelevel_token = this.getNodeParameter('servicelevelToken', itemIndex) as string;

        transactionData.shipment = {
          address_from: buildAddressObject({
            name: this.getNodeParameter('ocFromName', itemIndex, '') as string,
            street1: this.getNodeParameter('ocFromStreet1', itemIndex) as string,
            city: this.getNodeParameter('ocFromCity', itemIndex) as string,
            state: this.getNodeParameter('ocFromState', itemIndex) as string,
            zip: this.getNodeParameter('ocFromZip', itemIndex) as string,
            country: this.getNodeParameter('ocFromCountry', itemIndex) as string,
          }),
          address_to: buildAddressObject({
            name: this.getNodeParameter('ocToName', itemIndex, '') as string,
            street1: this.getNodeParameter('ocToStreet1', itemIndex) as string,
            city: this.getNodeParameter('ocToCity', itemIndex) as string,
            state: this.getNodeParameter('ocToState', itemIndex) as string,
            zip: this.getNodeParameter('ocToZip', itemIndex) as string,
            country: this.getNodeParameter('ocToCountry', itemIndex) as string,
          }),
          parcels: [
            buildParcelObject({
              length: this.getNodeParameter('ocLength', itemIndex) as number,
              width: this.getNodeParameter('ocWidth', itemIndex) as number,
              height: this.getNodeParameter('ocHeight', itemIndex) as number,
              distanceUnit: this.getNodeParameter('ocDistanceUnit', itemIndex) as string,
              weight: this.getNodeParameter('ocWeight', itemIndex) as number,
              massUnit: this.getNodeParameter('ocMassUnit', itemIndex) as string,
            }),
          ],
        };
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/transactions',
        body: transactionData,
      });
      break;
    }

    case 'get': {
      const transactionId = this.getNodeParameter('transactionId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/transactions/${transactionId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;
      const filters = this.getNodeParameter('filters', itemIndex) as IDataObject;

      const qs: IDataObject = {};
      if (filters.objectStatus) {
        qs.object_status = filters.objectStatus;
      }
      if (filters.trackingStatus) {
        qs.tracking_status = filters.trackingStatus;
      }

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/transactions',
          qs,
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
