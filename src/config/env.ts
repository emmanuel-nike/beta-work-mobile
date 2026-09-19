import { API_BASE_URL as ENV_API_BASE_URL } from '@env'

const trimmed = (ENV_API_BASE_URL || 'https://api.beta-work.com/api/v1').replace(/\/$/, '')

export const API_BASE_URL = trimmed
