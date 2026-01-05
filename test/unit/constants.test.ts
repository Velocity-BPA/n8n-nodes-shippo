/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  SHIPPO_API_BASE_URL,
  DISTANCE_UNITS,
  MASS_UNITS,
  LABEL_FILE_TYPES,
  CONTENTS_TYPES,
  SIGNATURE_TYPES,
  WEBHOOK_EVENTS,
  COMMON_CARRIERS,
} from '../../nodes/Shippo/constants/constants';

describe('Shippo Constants', () => {
  describe('API Base URL', () => {
    it('should have correct base URL', () => {
      expect(SHIPPO_API_BASE_URL).toBe('https://api.goshippo.com');
    });
  });

  describe('Distance Units', () => {
    it('should contain all standard distance units', () => {
      const values = DISTANCE_UNITS.map(u => u.value);
      expect(values).toContain('in');
      expect(values).toContain('cm');
      expect(values).toContain('ft');
      expect(values).toContain('mm');
      expect(values).toContain('m');
      expect(values).toContain('yd');
    });

    it('should have name and value for each unit', () => {
      DISTANCE_UNITS.forEach(unit => {
        expect(unit).toHaveProperty('name');
        expect(unit).toHaveProperty('value');
        expect(typeof unit.name).toBe('string');
        expect(typeof unit.value).toBe('string');
      });
    });
  });

  describe('Mass Units', () => {
    it('should contain all standard mass units', () => {
      const values = MASS_UNITS.map(u => u.value);
      expect(values).toContain('g');
      expect(values).toContain('oz');
      expect(values).toContain('lb');
      expect(values).toContain('kg');
    });

    it('should have name and value for each unit', () => {
      MASS_UNITS.forEach(unit => {
        expect(unit).toHaveProperty('name');
        expect(unit).toHaveProperty('value');
        expect(typeof unit.name).toBe('string');
        expect(typeof unit.value).toBe('string');
      });
    });
  });

  describe('Label File Types', () => {
    it('should contain common label formats', () => {
      const values = LABEL_FILE_TYPES.map(t => t.value);
      expect(values).toContain('PDF');
      expect(values).toContain('PDF_4x6');
      expect(values).toContain('PNG');
      expect(values).toContain('ZPLII');
    });
  });

  describe('Contents Types', () => {
    it('should contain standard customs contents types', () => {
      const values = CONTENTS_TYPES.map(t => t.value);
      expect(values).toContain('MERCHANDISE');
      expect(values).toContain('DOCUMENTS');
      expect(values).toContain('GIFT');
      expect(values).toContain('SAMPLE');
      expect(values).toContain('RETURN_MERCHANDISE');
      expect(values).toContain('OTHER');
    });
  });

  describe('Signature Types', () => {
    it('should contain signature confirmation options', () => {
      const values = SIGNATURE_TYPES.map((t: { value: string }) => t.value);
      expect(values).toContain('STANDARD');
      expect(values).toContain('ADULT');
    });
  });

  describe('Webhook Events', () => {
    it('should contain all webhook event types', () => {
      const values = WEBHOOK_EVENTS.map((e: { value: string }) => e.value);
      expect(values).toContain('track_updated');
      expect(values).toContain('transaction_created');
      expect(values).toContain('transaction_updated');
      expect(values).toContain('batch_created');
      expect(values).toContain('batch_purchased');
    });

    it('should have name and value for each event', () => {
      WEBHOOK_EVENTS.forEach((event: { name: string; value: string }) => {
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('value');
      });
    });
  });

  describe('Common Carriers', () => {
    it('should contain major US carriers', () => {
      const values = COMMON_CARRIERS.map(c => c.value);
      expect(values).toContain('usps');
      expect(values).toContain('ups');
      expect(values).toContain('fedex');
      expect(values).toContain('dhl_express');
    });

    it('should have at least 10 carriers', () => {
      expect(COMMON_CARRIERS.length).toBeGreaterThanOrEqual(10);
    });
  });
});
