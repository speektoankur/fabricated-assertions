/**
 * Environment Configuration
 * Supports multiple environments with flexible switching
 */

export type Environment = 'dev' | 'staging' | 'prod';

const ENV: Environment = (process.env.ENV as Environment) || 'dev';

interface EnvironmentConfig {
  baseUrl: string;
  apiUrl?: string;
  timeout: number;
}

const environments: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://parabank.parasoft.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://parabank.parasoft.com',
    timeout: 30000,
  },
  prod: {
    baseUrl: 'https://parabank.parasoft.com',
    timeout: 30000,
  },
};

export const config = environments[ENV];
export const currentEnv = ENV;

