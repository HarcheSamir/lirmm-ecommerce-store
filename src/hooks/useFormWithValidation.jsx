// src/hooks/useFormWithValidation.js
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Custom hook that combines react-hook-form with zod validation
 * 
 * @param {Object} validationSchema - Zod schema for form validation
 * @param {Object} defaultValues - Default values for the form
 * @returns {Object} - Form methods and handlers
 */
export const useFormWithValidation = (validationSchema, defaultValues = {}) => {
  const formMethods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues
  })

  return {
    ...formMethods,
    errors: formMethods.formState.errors
  }
}