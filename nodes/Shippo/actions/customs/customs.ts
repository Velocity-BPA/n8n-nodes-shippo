/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shippoApiRequest } from '../../transport/shippoApi';
import { CONTENTS_TYPES, NON_DELIVERY_OPTIONS, MASS_UNITS, INCOTERMS } from '../../constants/constants';

export const customsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['customs'],
      },
    },
    options: [
      {
        name: 'Create Declaration',
        value: 'createDeclaration',
        description: 'Create a customs declaration',
        action: 'Create a customs declaration',
      },
      {
        name: 'Get Declaration',
        value: 'getDeclaration',
        description: 'Get a customs declaration by ID',
        action: 'Get a customs declaration',
      },
      {
        name: 'Create Item',
        value: 'createItem',
        description: 'Create a customs item',
        action: 'Create a customs item',
      },
      {
        name: 'Get Item',
        value: 'getItem',
        description: 'Get a customs item by ID',
        action: 'Get a customs item',
      },
    ],
    default: 'createDeclaration',
  },
];

export const customsFields: INodeProperties[] = [
  // Create Declaration fields
  {
    displayName: 'Contents Type',
    name: 'contentsType',
    type: 'options',
    required: true,
    default: 'MERCHANDISE',
    options: CONTENTS_TYPES,
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
  },
  {
    displayName: 'Non-Delivery Option',
    name: 'nonDeliveryOption',
    type: 'options',
    required: true,
    default: 'RETURN',
    options: NON_DELIVERY_OPTIONS,
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
  },
  {
    displayName: 'Certify',
    name: 'certify',
    type: 'boolean',
    required: true,
    default: true,
    description: 'Whether to certify that the information provided is accurate',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
  },
  {
    displayName: 'Certify Signer',
    name: 'certifySigner',
    type: 'string',
    required: true,
    default: '',
    description: 'Name of the person certifying the declaration',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
  },
  {
    displayName: 'Customs Items',
    name: 'customsItems',
    type: 'string',
    required: true,
    default: '',
    description: 'Comma-separated list of customs item IDs',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
  },
  {
    displayName: 'Declaration Additional Fields',
    name: 'declarationAdditionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createDeclaration'],
      },
    },
    options: [
      {
        displayName: 'AES/ITN',
        name: 'aesItn',
        type: 'string',
        default: '',
        description: 'AES/ITN number for exports',
      },
      {
        displayName: 'B13A Filing Option',
        name: 'b13aFilingOption',
        type: 'options',
        default: '',
        options: [
          { name: 'None', value: '' },
          { name: 'Filed Electronically', value: 'FILED_ELECTRONICALLY' },
          { name: 'Summary Reporting', value: 'SUMMARY_REPORTING' },
          { name: 'Not Required', value: 'NOT_REQUIRED' },
        ],
      },
      {
        displayName: 'B13A Number',
        name: 'b13aNumber',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Certificate',
        name: 'certificate',
        type: 'string',
        default: '',
        description: 'Certificate number',
      },
      {
        displayName: 'Contents Explanation',
        name: 'contentsExplanation',
        type: 'string',
        default: '',
        description: 'Explanation of contents (required when contents type is OTHER)',
      },
      {
        displayName: 'EEL/PFC',
        name: 'eelPfc',
        type: 'string',
        default: '',
        description: 'EEL or PFC code',
      },
      {
        displayName: 'Exporter Reference',
        name: 'exporterReference',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Importer Reference',
        name: 'importerReference',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Incoterm',
        name: 'incoterm',
        type: 'options',
        default: '',
        options: [
          { name: 'None', value: '' },
          ...INCOTERMS,
        ],
      },
      {
        displayName: 'Invoice',
        name: 'invoice',
        type: 'string',
        default: '',
        description: 'Invoice number',
      },
      {
        displayName: 'License',
        name: 'license',
        type: 'string',
        default: '',
        description: 'Export license number',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
      },
    ],
  },

  // Get Declaration fields
  {
    displayName: 'Declaration ID',
    name: 'declarationId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the customs declaration',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['getDeclaration'],
      },
    },
  },

  // Create Item fields
  {
    displayName: 'Description',
    name: 'itemDescription',
    type: 'string',
    required: true,
    default: '',
    description: 'Description of the item',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Quantity',
    name: 'quantity',
    type: 'number',
    required: true,
    default: 1,
    description: 'Quantity of the item',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Net Weight',
    name: 'netWeight',
    type: 'number',
    required: true,
    default: 0,
    description: 'Net weight of the item',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Mass Unit',
    name: 'itemMassUnit',
    type: 'options',
    required: true,
    default: 'lb',
    options: MASS_UNITS,
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Value Amount',
    name: 'valueAmount',
    type: 'number',
    required: true,
    default: 0,
    description: 'Value of the item',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Value Currency',
    name: 'valueCurrency',
    type: 'string',
    required: true,
    default: 'USD',
    description: 'Currency of the value (ISO 4217)',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Origin Country',
    name: 'originCountry',
    type: 'string',
    required: true,
    default: 'US',
    description: 'Country of origin (ISO 3166-1 alpha-2)',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
  },
  {
    displayName: 'Item Additional Fields',
    name: 'itemAdditionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['createItem'],
      },
    },
    options: [
      {
        displayName: 'ECCN/EAR99',
        name: 'eccnEar99',
        type: 'string',
        default: '',
        description: 'Export Control Classification Number',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'string',
        default: '',
      },
      {
        displayName: 'SKU Code',
        name: 'skuCode',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Tariff Number',
        name: 'tariffNumber',
        type: 'string',
        default: '',
        description: 'Harmonized System tariff number',
      },
    ],
  },

  // Get Item fields
  {
    displayName: 'Item ID',
    name: 'itemId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the customs item',
    displayOptions: {
      show: {
        resource: ['customs'],
        operation: ['getItem'],
      },
    },
  },
];

export async function executeCustomsOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[];

  switch (operation) {
    case 'createDeclaration': {
      const contentsType = this.getNodeParameter('contentsType', itemIndex) as string;
      const nonDeliveryOption = this.getNodeParameter('nonDeliveryOption', itemIndex) as string;
      const certify = this.getNodeParameter('certify', itemIndex) as boolean;
      const certifySigner = this.getNodeParameter('certifySigner', itemIndex) as string;
      const customsItems = this.getNodeParameter('customsItems', itemIndex) as string;
      const additionalFields = this.getNodeParameter('declarationAdditionalFields', itemIndex) as IDataObject;

      const declarationData: IDataObject = {
        contents_type: contentsType,
        non_delivery_option: nonDeliveryOption,
        certify,
        certify_signer: certifySigner,
        items: customsItems.split(',').map((s) => s.trim()),
      };

      if (additionalFields.contentsExplanation) {
        declarationData.contents_explanation = additionalFields.contentsExplanation;
      }
      if (additionalFields.exporterReference) {
        declarationData.exporter_reference = additionalFields.exporterReference;
      }
      if (additionalFields.importerReference) {
        declarationData.importer_reference = additionalFields.importerReference;
      }
      if (additionalFields.invoice) {
        declarationData.invoice = additionalFields.invoice;
      }
      if (additionalFields.license) {
        declarationData.license = additionalFields.license;
      }
      if (additionalFields.certificate) {
        declarationData.certificate = additionalFields.certificate;
      }
      if (additionalFields.notes) {
        declarationData.notes = additionalFields.notes;
      }
      if (additionalFields.eelPfc) {
        declarationData.eel_pfc = additionalFields.eelPfc;
      }
      if (additionalFields.aesItn) {
        declarationData.aes_itn = additionalFields.aesItn;
      }
      if (additionalFields.incoterm) {
        declarationData.incoterm = additionalFields.incoterm;
      }
      if (additionalFields.b13aFilingOption) {
        declarationData.b13a_filing_option = additionalFields.b13aFilingOption;
      }
      if (additionalFields.b13aNumber) {
        declarationData.b13a_number = additionalFields.b13aNumber;
      }
      if (additionalFields.metadata) {
        declarationData.metadata = additionalFields.metadata;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/customs/declarations',
        body: declarationData,
      });
      break;
    }

    case 'getDeclaration': {
      const declarationId = this.getNodeParameter('declarationId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/customs/declarations/${declarationId}`,
      });
      break;
    }

    case 'createItem': {
      const itemDescription = this.getNodeParameter('itemDescription', itemIndex) as string;
      const quantity = this.getNodeParameter('quantity', itemIndex) as number;
      const netWeight = this.getNodeParameter('netWeight', itemIndex) as number;
      const massUnit = this.getNodeParameter('itemMassUnit', itemIndex) as string;
      const valueAmount = this.getNodeParameter('valueAmount', itemIndex) as number;
      const valueCurrency = this.getNodeParameter('valueCurrency', itemIndex) as string;
      const originCountry = this.getNodeParameter('originCountry', itemIndex) as string;
      const additionalFields = this.getNodeParameter('itemAdditionalFields', itemIndex) as IDataObject;

      const itemData: IDataObject = {
        description: itemDescription,
        quantity,
        net_weight: netWeight,
        mass_unit: massUnit,
        value_amount: valueAmount.toString(),
        value_currency: valueCurrency,
        origin_country: originCountry,
      };

      if (additionalFields.tariffNumber) {
        itemData.tariff_number = additionalFields.tariffNumber;
      }
      if (additionalFields.skuCode) {
        itemData.sku_code = additionalFields.skuCode;
      }
      if (additionalFields.eccnEar99) {
        itemData.eccn_ear99 = additionalFields.eccnEar99;
      }
      if (additionalFields.metadata) {
        itemData.metadata = additionalFields.metadata;
      }

      responseData = await shippoApiRequest.call(this, {
        method: 'POST',
        endpoint: '/customs/items',
        body: itemData,
      });
      break;
    }

    case 'getItem': {
      const itemId = this.getNodeParameter('itemId', itemIndex) as string;
      responseData = await shippoApiRequest.call(this, {
        endpoint: `/customs/items/${itemId}`,
      });
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return responseData;
}
