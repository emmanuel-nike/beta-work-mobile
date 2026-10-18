import { ARTISAN_SERVICES } from './artisanServices'

/** Options for the "Primary skill" dropdown and "Other services" checklist. */
export const SKILL_OPTIONS: readonly string[] = ARTISAN_SERVICES.map((service) => service.label)

/** Weekdays in display order, used to build the weekly schedule. */
export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type Weekday = typeof WEEKDAYS[number]

export type DaySchedule = Readonly<{
  enabled: boolean
  start: string
  end: string
}>

export type WeeklySchedule = Record<Weekday, DaySchedule>

export type ServicePrice = Readonly<{
  /** Local id so rows stay stable while editing. */
  id: string
  service: string
  minPrice: string
  maxPrice: string
}>

/** Everything the three-step "Update your portfolio" wizard collects. */
export type PortfolioForm = {
  // Step 1 — Tell us about your service
  photoUri: string | null
  primarySkill: string
  otherServices: string[]
  yearsOfExperience: string
  certificateUri: string | null
  bio: string
  // Step 2 — Showcase your best work
  languages: string[]
  portfolioImages: string[]
  servicePricing: ServicePrice[]
  // Step 3 — Set your working hours
  isAvailable: boolean
  minimumLeadTimeHours: string
  weeklySchedule: WeeklySchedule
}

export const LANGUAGE_OPTIONS = [
  'English',
  'Pidgin',
  'Igbo',
  'Yoruba',
  'Hausa',
  'French',
] as const

export const MAX_BIO_LENGTH = 300
export const MAX_PORTFOLIO_IMAGES = 6

function createDefaultSchedule(): WeeklySchedule {
  return WEEKDAYS.reduce((schedule, day) => {
    // Weekdays and Saturday default to on; Sunday starts off, matching the design.
    schedule[day] = {
      enabled: day !== 'Sunday',
      start: '08:00',
      end: '18:00',
    }
    return schedule
  }, {} as WeeklySchedule)
}

let serviceRowCounter = 0

export function createServiceRow(): ServicePrice {
  serviceRowCounter += 1
  return {
    id: `service-${Date.now()}-${serviceRowCounter}`,
    service: '',
    minPrice: '',
    maxPrice: '',
  }
}

function isCompleteService(row: ServicePrice): boolean {
  return (
    row.service.trim().length > 0 &&
    row.minPrice.trim().length > 0 &&
    row.maxPrice.trim().length > 0
  )
}

function hasScheduledDay(schedule: WeeklySchedule): boolean {
  return WEEKDAYS.some((day) => {
    const value = schedule[day]
    return value.enabled && value.start.trim().length > 0 && value.end.trim().length > 0
  })
}

/** First blocking message for a wizard step, or null when that step is complete. */
export function getPortfolioStepError(form: PortfolioForm, step: number): string | null {
  if (step === 0) {
    if (!form.photoUri) {
      return 'Please add a profile photo.'
    }
    if (!form.primarySkill.trim()) {
      return 'Please select your primary skill.'
    }
    if (!form.yearsOfExperience.trim()) {
      return 'Please enter your years of experience.'
    }
    return null
  }

  if (step === 1) {
    if (form.languages.length === 0) {
      return 'Please select at least one language.'
    }
    if (form.portfolioImages.length === 0) {
      return 'Please upload at least one portfolio image.'
    }
    if (!form.servicePricing.some(isCompleteService)) {
      return 'Please add at least one service with a name, min price, and max price.'
    }
    return null
  }

  if (!form.minimumLeadTimeHours.trim()) {
    return 'Please enter your minimum lead time.'
  }
  if (!hasScheduledDay(form.weeklySchedule)) {
    return 'Please enable at least one working day with a start and end time.'
  }
  return null
}

export function createDefaultPortfolioForm(): PortfolioForm {
  return {
    photoUri: null,
    primarySkill: '',
    otherServices: [],
    yearsOfExperience: '',
    certificateUri: null,
    bio: '',
    languages: ['English'],
    portfolioImages: [],
    servicePricing: [createServiceRow()],
    isAvailable: true,
    minimumLeadTimeHours: '1',
    weeklySchedule: createDefaultSchedule(),
  }
}
