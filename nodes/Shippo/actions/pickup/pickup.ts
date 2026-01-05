/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest, buildAddressObject } from '../../transport/shippoApi';
import { BUILDING_LOCATION_TYPES } from '../../constants/constants';

export const pickupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['pickup'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Schedule a pickup',
        action: 'Create a pickup',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a pickup by ID',
        action: 'Get a pickup',
      },
    ],
    default: 'create',
  },
];

export const pickupFields: INodeProperties[] = [
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
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Transaction IDs',
    name: 'transactions',
    type: 'string',
    required: true,
    default: '',
    description: 'Comma-separated list of transaction IDs to pickup',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Requested Start Time',
    name: 'requestedStartTime',
    type: 'dateTime',
    required: true,
    default: '',
    description: 'Earliest time for pickup',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Requested End Time',
    name: 'requestedEndTime',
    type: 'dateTime',
    required: true,
    default: '',
    description: 'Latest time for pickup',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Building Location Type',
    name: 'buildingLocationType',
    type: 'options',
    required: true,
    default: 'Front Door',
    options: BUILDING_LOCATION_TYPES,
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },

  // Location address
  {
    displayName: 'Address Type',
    name: 'addressType',
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
        resource: ['pickup'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Address ID',
    name: 'addressId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the pickup location address',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['id'],
      },
    },
  },
  {
    displayName: 'Name',
    name: 'locationName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'Street',
    name: 'locationStreet1',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'City',
    name: 'locationCity',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'State',
    name: 'locationState',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'ZIP',
    name: 'locationZip',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'Country',
    name: 'locationCountry',
    type: 'string',
    required: true,
    default: 'US',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },
  {
    displayName: 'Phone',
    name: 'locationPhone',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
        addressType: ['fields'],
      },
    },
  },

  // Additional fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Building Type',
        name: 'buildingType',
        type: 'options',
        default: '',
        options: [
          { name: 'None', value: '' },
          { name: 'Apartment', value: 'apartment' },
          { name: 'Building', value: 'building' },
          { name: 'Department', value: 'department' },
          { name: 'Floor', value: 'floor' },
          { name: 'Room', value: 'room' },
          { name: 'Suite', value: 'suite' },
        ],
      },
      {
        displayName: 'Instructions',
        name: 'instructions',
        type: 'string',
        default: '',
        description: 'Special pickup instructions',
      },
      {
        displayName: 'Is Test',
        name: 'isTest',
        type: 'boolean',
        default: false,
        description: 'Whether this is a test pickup',
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
    displayName: 'Pickup ID',
    name: 'pickupId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the pickup',
    displayOptions: {
      show: {
        resource: ['pickup'],
        operation: ['get'],
      },
    },
  },
];

export async function executePickupOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const carrierAccount = this.getNodeParameter('carrierAccount', itemIndex) as string;
      const transactions = this.getNodeParameter('transactions', itemIndex) as string;
      const requestedStartTime = this.getNodeParameter('requestedStartTime', itemIndex) as string;
      const requestedEndTime = this.getNodeParameter('requestedEndTime', itemIndex) as string;
      const buildingLocationType = this.getNodeParameter('buildingLocationType', itemIndex) as string;
      const addressType = this.getNodeParameter('addressType', itemIndex) as string;
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;

      let address: string | IDataObject;
      if (addressType === 'id') {
        address = this.getNodeParameter('addressId', itemIndex) as string;
      } else {
        address = buildAddressObject({
          name: this.getNodeParameter('locationName', itemIndex, '') as string,
          street1: this.getNodeParameter('locationStreet1', itemIndex) as string,
          city: this.getNodeParameter('locationCity', itemIndex) as string,
          state: this.getNodeParameter('locationState', itemIndex) as string,
          zip: this.getNodeParameter('locationZip', itemIndex) as string,
          country: this.getNodeParameter('locationCountry', itemIndex) as string,
          phone: this.getNodeParameter('locationPhone', itemIndex) as string,
        });
      }

      const location: IDataObject = {
        building_location_type: buildingLocationType,
        address,
      };

      if (additionalFields.buildingType) {
        location.building_type = additionalFields.buildingType;
      }
      if (additionalFields.instructions) {
        location.instructions = additionalFields.instructions;
      }

      const pickupData: IDataObject = {
        carrier_account: carrierAccount,
        location,
        transactions: transactions.split(',').map((s) => s.trim()),
        requested_start_time: requestedStartTime,
        requested_end_time: requestedEndTime,
      };

      if (additionalFields.isTest !== undefined) {
        pickupData.is_test = additionalFields.isTest;
      }
      if (additionalFields.metadata) {
        pickupData.metadata = additionalFields.metadata;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/pickups',
        body: pickupData,
      });
      break;
    }

    case 'get': {
      const pickupId = this.getNodeParameter('pickupId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/pickups/${pickupId}`,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
