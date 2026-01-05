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
  buildExtrasObject,
} from '../../transport/shippoApi';
import { DISTANCE_UNITS, MASS_UNITS, SIGNATURE_TYPES } from '../../constants/constants';

export const shipmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['shipment'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new shipment and get rates',
        action: 'Create a shipment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a shipment by ID',
        action: 'Get a shipment',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many shipments',
        action: 'Get many shipments',
      },
    ],
    default: 'create',
  },
];

export const shipmentFields: INodeProperties[] = [
  // Create operation - Address From
  {
    displayName: 'Address From Type',
    name: 'addressFromType',
    type: 'options',
    required: true,
    default: 'fields',
    options: [
      {
        name: 'Enter Fields',
        value: 'fields',
        description: 'Enter address details',
      },
      {
        name: 'Use Address ID',
        value: 'id',
        description: 'Use an existing address ID',
      },
    ],
    displayOptions: {
      show: {
        resource: ['shipment'],
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
        resource: ['shipment'],
        operation: ['create'],
        addressFromType: ['id'],
      },
    },
  },
  {
    displayName: 'From Name',
    name: 'fromName',
    type: 'string',
    default: '',
    description: 'Sender name',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },
  {
    displayName: 'From Street',
    name: 'fromStreet1',
    type: 'string',
    required: true,
    default: '',
    description: 'Sender street address',
    displayOptions: {
      show: {
        resource: ['shipment'],
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
    description: 'Sender city',
    displayOptions: {
      show: {
        resource: ['shipment'],
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
    description: 'Sender state',
    displayOptions: {
      show: {
        resource: ['shipment'],
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
    description: 'Sender ZIP code',
    displayOptions: {
      show: {
        resource: ['shipment'],
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
    description: 'Sender country (ISO code)',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressFromType: ['fields'],
      },
    },
  },

  // Address To
  {
    displayName: 'Address To Type',
    name: 'addressToType',
    type: 'options',
    required: true,
    default: 'fields',
    options: [
      {
        name: 'Enter Fields',
        value: 'fields',
        description: 'Enter address details',
      },
      {
        name: 'Use Address ID',
        value: 'id',
        description: 'Use an existing address ID',
      },
    ],
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Address To ID',
    name: 'addressToId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the destination address',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['id'],
      },
    },
  },
  {
    displayName: 'To Name',
    name: 'toName',
    type: 'string',
    default: '',
    description: 'Recipient name',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },
  {
    displayName: 'To Street',
    name: 'toStreet1',
    type: 'string',
    required: true,
    default: '',
    description: 'Recipient street address',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },
  {
    displayName: 'To City',
    name: 'toCity',
    type: 'string',
    required: true,
    default: '',
    description: 'Recipient city',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },
  {
    displayName: 'To State',
    name: 'toState',
    type: 'string',
    required: true,
    default: '',
    description: 'Recipient state',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },
  {
    displayName: 'To ZIP',
    name: 'toZip',
    type: 'string',
    required: true,
    default: '',
    description: 'Recipient ZIP code',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },
  {
    displayName: 'To Country',
    name: 'toCountry',
    type: 'string',
    required: true,
    default: 'US',
    description: 'Recipient country (ISO code)',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        addressToType: ['fields'],
      },
    },
  },

  // Parcel
  {
    displayName: 'Parcel Type',
    name: 'parcelType',
    type: 'options',
    required: true,
    default: 'fields',
    options: [
      {
        name: 'Enter Fields',
        value: 'fields',
        description: 'Enter parcel details',
      },
      {
        name: 'Use Parcel ID',
        value: 'id',
        description: 'Use an existing parcel ID',
      },
    ],
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Parcel ID',
    name: 'parcelId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the parcel',
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['id'],
      },
    },
  },
  {
    displayName: 'Length',
    name: 'parcelLength',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },
  {
    displayName: 'Width',
    name: 'parcelWidth',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },
  {
    displayName: 'Height',
    name: 'parcelHeight',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },
  {
    displayName: 'Distance Unit',
    name: 'parcelDistanceUnit',
    type: 'options',
    required: true,
    default: 'in',
    options: DISTANCE_UNITS,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },
  {
    displayName: 'Weight',
    name: 'parcelWeight',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },
  {
    displayName: 'Mass Unit',
    name: 'parcelMassUnit',
    type: 'options',
    required: true,
    default: 'lb',
    options: MASS_UNITS,
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
        parcelType: ['fields'],
      },
    },
  },

  // Additional Fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Async',
        name: 'async',
        type: 'boolean',
        default: false,
        description: 'Whether to fetch rates asynchronously',
      },
      {
        displayName: 'Carrier Accounts',
        name: 'carrierAccounts',
        type: 'string',
        default: '',
        description: 'Comma-separated list of carrier account IDs to get rates for',
      },
      {
        displayName: 'Customs Declaration ID',
        name: 'customsDeclaration',
        type: 'string',
        default: '',
        description: 'Customs declaration ID for international shipments',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
        description: 'Custom metadata for your own reference',
      },
      {
        displayName: 'Return Address ID',
        name: 'addressReturn',
        type: 'string',
        default: '',
        description: 'Return address ID (if different from origin)',
      },
    ],
  },
  {
    displayName: 'Extra Services',
    name: 'extras',
    type: 'collection',
    placeholder: 'Add Service',
    default: {},
    displayOptions: {
      show: {
        resource: ['shipment'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Bypass Address Validation',
        name: 'bypassAddressValidation',
        type: 'boolean',
        default: false,
        description: 'Whether to bypass address validation',
      },
      {
        displayName: 'Insurance Amount',
        name: 'insuranceAmount',
        type: 'number',
        default: 0,
        description: 'Insurance amount',
      },
      {
        displayName: 'Insurance Currency',
        name: 'insuranceCurrency',
        type: 'string',
        default: 'USD',
        description: 'Insurance currency',
      },
      {
        displayName: 'Is Return',
        name: 'isReturn',
        type: 'boolean',
        default: false,
        description: 'Whether this is a return shipment',
      },
      {
        displayName: 'Reference 1',
        name: 'reference1',
        type: 'string',
        default: '',
        description: 'First reference field',
      },
      {
        displayName: 'Reference 2',
        name: 'reference2',
        type: 'string',
        default: '',
        description: 'Second reference field',
      },
      {
        displayName: 'Saturday Delivery',
        name: 'saturdayDelivery',
        type: 'boolean',
        default: false,
        description: 'Whether to enable Saturday delivery',
      },
      {
        displayName: 'Signature Confirmation',
        name: 'signatureConfirmation',
        type: 'options',
        default: '',
        options: [
          { name: 'None', value: '' },
          ...SIGNATURE_TYPES,
        ],
        description: 'Signature confirmation type',
      },
    ],
  },

  // Get operation fields
  {
    displayName: 'Shipment ID',
    name: 'shipmentId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the shipment to retrieve',
    displayOptions: {
      show: {
        resource: ['shipment'],
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
        resource: ['shipment'],
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
        resource: ['shipment'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

export async function executeShipmentOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'create': {
      const shipmentData: IDataObject = {};

      // Build address_from
      const addressFromType = this.getNodeParameter('addressFromType', itemIndex) as string;
      if (addressFromType === 'id') {
        shipmentData.address_from = this.getNodeParameter('addressFromId', itemIndex) as string;
      } else {
        shipmentData.address_from = buildAddressObject({
          name: this.getNodeParameter('fromName', itemIndex, '') as string,
          street1: this.getNodeParameter('fromStreet1', itemIndex) as string,
          city: this.getNodeParameter('fromCity', itemIndex) as string,
          state: this.getNodeParameter('fromState', itemIndex) as string,
          zip: this.getNodeParameter('fromZip', itemIndex) as string,
          country: this.getNodeParameter('fromCountry', itemIndex) as string,
        });
      }

      // Build address_to
      const addressToType = this.getNodeParameter('addressToType', itemIndex) as string;
      if (addressToType === 'id') {
        shipmentData.address_to = this.getNodeParameter('addressToId', itemIndex) as string;
      } else {
        shipmentData.address_to = buildAddressObject({
          name: this.getNodeParameter('toName', itemIndex, '') as string,
          street1: this.getNodeParameter('toStreet1', itemIndex) as string,
          city: this.getNodeParameter('toCity', itemIndex) as string,
          state: this.getNodeParameter('toState', itemIndex) as string,
          zip: this.getNodeParameter('toZip', itemIndex) as string,
          country: this.getNodeParameter('toCountry', itemIndex) as string,
        });
      }

      // Build parcel
      const parcelType = this.getNodeParameter('parcelType', itemIndex) as string;
      if (parcelType === 'id') {
        shipmentData.parcels = [this.getNodeParameter('parcelId', itemIndex) as string];
      } else {
        shipmentData.parcels = [
          buildParcelObject({
            length: this.getNodeParameter('parcelLength', itemIndex) as number,
            width: this.getNodeParameter('parcelWidth', itemIndex) as number,
            height: this.getNodeParameter('parcelHeight', itemIndex) as number,
            distanceUnit: this.getNodeParameter('parcelDistanceUnit', itemIndex) as string,
            weight: this.getNodeParameter('parcelWeight', itemIndex) as number,
            massUnit: this.getNodeParameter('parcelMassUnit', itemIndex) as string,
          }),
        ];
      }

      // Additional fields
      const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;
      if (additionalFields.async !== undefined) {
        shipmentData.async = additionalFields.async;
      }
      if (additionalFields.carrierAccounts) {
        shipmentData.carrier_accounts = (additionalFields.carrierAccounts as string)
          .split(',')
          .map((s) => s.trim());
      }
      if (additionalFields.customsDeclaration) {
        shipmentData.customs_declaration = additionalFields.customsDeclaration;
      }
      if (additionalFields.metadata) {
        shipmentData.metadata = additionalFields.metadata;
      }
      if (additionalFields.addressReturn) {
        shipmentData.address_return = additionalFields.addressReturn;
      }

      // Extra services
      const extras = this.getNodeParameter('extras', itemIndex) as IDataObject;
      if (Object.keys(extras).length > 0) {
        const extrasData: IDataObject = {};

        if (extras.signatureConfirmation) {
          extrasData.signatureConfirmation = extras.signatureConfirmation;
        }
        if (extras.insuranceAmount) {
          extrasData.insurance = {
            amount: extras.insuranceAmount,
            currency: extras.insuranceCurrency || 'USD',
          };
        }
        if (extras.reference1) {
          extrasData.reference1 = extras.reference1;
        }
        if (extras.reference2) {
          extrasData.reference2 = extras.reference2;
        }
        if (extras.saturdayDelivery !== undefined) {
          extrasData.saturdayDelivery = extras.saturdayDelivery;
        }
        if (extras.bypassAddressValidation !== undefined) {
          extrasData.bypassAddressValidation = extras.bypassAddressValidation;
        }
        if (extras.isReturn !== undefined) {
          extrasData.isReturn = extras.isReturn;
        }

        if (Object.keys(extrasData).length > 0) {
          shipmentData.extra = buildExtrasObject(extrasData);
        }
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/shipments',
        body: shipmentData,
      });
      break;
    }

    case 'get': {
      const shipmentId = this.getNodeParameter('shipmentId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/shipments/${shipmentId}`,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
      const limit = this.getNodeParameter('limit', itemIndex, 25) as number;

      responseData = await shippoApiRequestAllItems.call(
        this,
        {
          endpoint: '/shipments',
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
