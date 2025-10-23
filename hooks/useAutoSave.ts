'use client'

import { useEffect, useRef, useState } from 'react'
import { debounce } from '@/lib/utils'

export const useAutoSave = <T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000
) => {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const debouncedSave = useRef(
    debounce(async (dataToSave: T) => {
      try {
        setIsSaving(true)
        setError(null)
        await saveFunction(dataToSave)
        setLastSaved(new Date())
      } catch (err: any) {
        setError(err.message || 'Failed to save')
      } finally {
        setIsSaving(false)
      }
    }, delay)
  ).current

  useEffect(() => {
    if (data) {
      debouncedSave(data)
    }
  }, [data, debouncedSave])

  const forceSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      await saveFunction(data)
      setLastSaved(new Date())
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isSaving,
    lastSaved,
    error,
    forceSave,
  }
}
