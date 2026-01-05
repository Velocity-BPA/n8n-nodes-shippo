/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  buildAddressObject,
  buildParcelObject,
  buildExtrasObject,
} from '../../nodes/Shippo/transport/shippoApi';

describe('Shippo API Utilities', () => {
  describe('buildAddressObject', () => {
    it('should build a complete address object', () => {
      const input = {
        name: 'John Doe',
        company: 'Acme Inc',
        street1: '123 Main St',
        street2: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
        phone: '415-555-1234',
        email: 'john@example.com',
        isResidential: true,
      };

      const result = buildAddressObject(input);

      expect(result).toEqual({
        name: 'John Doe',
        company: 'Acme Inc',
        street1: '123 Main St',
        street2: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
        phone: '415-555-1234',
        email: 'john@example.com',
        is_residential: true,
      });
    });

    it('should exclude empty optional fields', () => {
      const input = {
        name: 'John Doe',
        street1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      };

      const result = buildAddressObject(input);

      expect(result).toEqual({
        name: 'John Doe',
        street1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      });
      expect(result.company).toBeUndefined();
      expect(result.street2).toBeUndefined();
    });

    it('should handle street3 field', () => {
      const input = {
        name: 'John Doe',
        street1: '123 Main St',
        street2: 'Building A',
        street3: 'Floor 3',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
      };

      const result = buildAddressObject(input);

      expect(result.street3).toBe('Floor 3');
    });

    it('should handle validate flag', () => {
      const input = {
        name: 'John Doe',
        street1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
        validate: true,
      };

      const result = buildAddressObject(input);

      expect(result.validate).toBe(true);
    });

    it('should handle metadata', () => {
      const input = {
        name: 'John Doe',
        street1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
        metadata: 'Customer ID: 12345',
      };

      const result = buildAddressObject(input);

      expect(result.metadata).toBe('Customer ID: 12345');
    });
  });

  describe('buildParcelObject', () => {
    it('should build a complete parcel object', () => {
      const input = {
        length: 10,
        width: 8,
        height: 6,
        distanceUnit: 'in',
        weight: 2.5,
        massUnit: 'lb',
      };

      const result = buildParcelObject(input);

      expect(result).toEqual({
        length: 10,
        width: 8,
        height: 6,
        distance_unit: 'in',
        weight: 2.5,
        mass_unit: 'lb',
      });
    });

    it('should include template when provided', () => {
      const input = {
        length: 10,
        width: 8,
        height: 6,
        distanceUnit: 'in',
        weight: 2.5,
        massUnit: 'lb',
        template: 'USPS_FlatRateEnvelope',
      };

      const result = buildParcelObject(input);

      expect(result.template).toBe('USPS_FlatRateEnvelope');
    });

    it('should include metadata when provided', () => {
      const input = {
        length: 10,
        width: 8,
        height: 6,
        distanceUnit: 'in',
        weight: 2.5,
        massUnit: 'lb',
        metadata: 'Order #12345',
      };

      const result = buildParcelObject(input);

      expect(result.metadata).toBe('Order #12345');
    });

    it('should handle metric units', () => {
      const input = {
        length: 25,
        width: 20,
        height: 15,
        distanceUnit: 'cm',
        weight: 1,
        massUnit: 'kg',
      };

      const result = buildParcelObject(input);

      expect(result.distance_unit).toBe('cm');
      expect(result.mass_unit).toBe('kg');
    });
  });

  describe('buildExtrasObject', () => {
    it('should build extras with signature confirmation', () => {
      const input = {
        signatureConfirmation: 'STANDARD',
        reference1: 'REF001',
        reference2: 'REF002',
      };

      const result = buildExtrasObject(input);

      expect(result).toEqual({
        signature_confirmation: 'STANDARD',
        reference_1: 'REF001',
        reference_2: 'REF002',
      });
    });

    it('should build extras with insurance object', () => {
      const input = {
        insurance: {
          amount: 100.0,
          currency: 'USD',
          content: 'Electronics',
        },
      };

      const result = buildExtrasObject(input);

      expect(result).toEqual({
        insurance: {
          amount: 100.0,
          currency: 'USD',
          content: 'Electronics',
        },
      });
    });

    it('should default insurance currency to USD', () => {
      const input = {
        insurance: {
          amount: 50.0,
          content: 'Books',
        },
      };

      const result = buildExtrasObject(input);

      expect(result.insurance).toEqual({
        amount: 50.0,
        currency: 'USD',
        content: 'Books',
      });
    });

    it('should include boolean flags', () => {
      const input = {
        saturdayDelivery: true,
        bypassAddressValidation: true,
        isReturn: true,
      };

      const result = buildExtrasObject(input);

      expect(result).toEqual({
        saturday_delivery: true,
        bypass_address_validation: true,
        is_return: true,
      });
    });

    it('should handle false boolean flags', () => {
      const input = {
        saturdayDelivery: false,
        bypassAddressValidation: false,
        isReturn: false,
      };

      const result = buildExtrasObject(input);

      expect(result).toEqual({
        saturday_delivery: false,
        bypass_address_validation: false,
        is_return: false,
      });
    });

    it('should build extras with COD', () => {
      const input = {
        cod: {
          amount: 25.0,
          currency: 'USD',
          paymentMethod: 'CASH',
        },
      };

      const result = buildExtrasObject(input);

      expect(result).toEqual({
        cod: {
          amount: 25.0,
          currency: 'USD',
          payment_method: 'CASH',
        },
      });
    });

    it('should default COD values', () => {
      const input = {
        cod: {
          amount: 25.0,
        },
      };

      const result = buildExtrasObject(input);

      expect(result.cod).toEqual({
        amount: 25.0,
        currency: 'USD',
        payment_method: 'ANY',
      });
    });

    it('should return empty object for empty input', () => {
      const result = buildExtrasObject({});
      expect(result).toEqual({});
    });

    it('should handle adult signature', () => {
      const input = {
        signatureConfirmation: 'ADULT',
      };

      const result = buildExtrasObject(input);

      expect(result.signature_confirmation).toBe('ADULT');
    });
  });
});
