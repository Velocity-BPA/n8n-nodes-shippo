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
  buildParcelObject,
} from '../../transport/shippoApi';
import { DISTANCE_UNITS, MASS_UNITS } from '../../constants/constants';

export const parcelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['parcel'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new parcel',
        action: 'Create a parcel',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a parcel by ID',
        action: 'Get a parcel',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many parcels',
        action: 'Get many parcels',
      },
    ],
    default: 'create',
  },
];

export const parcelFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Length',
    name: 'length',
    type: 'number',
    required: true,
    default: 0,
    description: 'Length of the parcel',
    displayOptions: {
      show: {
        resource: ['parcel'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Width',
    name: 'width',
    type: 'number',
    required: true,
    default: 0,
    description: 'Width of the parcel',
    displayOptions: {
      show: {
        resource: ['parcel'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Height',
    name: 'height',
    type: 'number',
    required: true,
    default: 0,
    description: 'Height of the parcel',
    displayOptions: {
      show: {
        resource: ['parcel'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Distance Unit',
    name: 'distanceUnit',
    type: 'options',
    required: true,
    default: 'in',
    description: 'Unit of measurement for dimensions',
    options: DISTANCE_UNITS,
    displayOptions: {
      show: {
        resource: ['parcel'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Weight',
    name: 'weight',
    type: 'number',
    required: true,
    default: 0,
    description: 'Weight of the parcel',
    displayOptions: {
      show: {
        resource: ['parcel'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Mass Unit',
    name: 'massUnit',
    type: 'options',
    required: true,
    default: 'lb',
    description: 'Unit of measurement for weight',
    options: MASS_UNITS,
    displayOptions: {
      show: {
        resource: ['parcel'],
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
        resource: ['parcel'],
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
      {
        displayName: 'Template',
        name: 'template',
        type: 'string',
        default: '',
        description: 'Carrier-specific parcel template (e.g., USPS_SmallFlatRateBox)',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Parcel ID',
    name: 'parcelId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the parcel to retrieve',
    displayOptions: {
      show: {
        resource: ['parcel'],
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
        resource: ['parcel'],
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
        resource: ['parcel'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

export async function executeParcelOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const length = this.getNodeParameter('length', itemIndex) as number;
      const width = this.getNodeParameter('width', itemIndex) as number;
      const height = this.getNodeParameter('height', itemIndex) as number;
      const distanceUnit = this.getNodeParameter('distanceUnit', itemIndex) as string;
      const weight = this.getNodeParameter('weight', itemIndex) as number;
      const massUnit = this.getNodeParameter('massUnit', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      const parcelData = buildParcelObject({
        length,
        width,
        height,
        distanceUnit,
        weight,
        massUnit,
        ...additionalFields,
      });

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/parcels',
        body: parcelData,
      });
      break;
    }

    case 'get': {
      const parcelId = this.getNodeParameter('parcelId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/parcels/${parcelId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/parcels',
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
