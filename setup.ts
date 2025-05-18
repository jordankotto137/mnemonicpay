// Test setup file
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend matchers
expect.extend({
  // Add custom matchers here if needed
});

// Global teardown
afterEach(() => {
  cleanup();
});
