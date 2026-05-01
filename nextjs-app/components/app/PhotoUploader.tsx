// Profile photo uploader. Uploads to the avatars bucket, then writes the
// public URL to profiles.photo_url for the current user.
'use client'

import { useRef, useState, useTransition } from 'react'
import { createClient } from '../../lib/supabase/client'

type Props = {
  initialPhotoUrl?: string | null
  size?: number
  onUpload?: (publicUrl: string) => void
}

export function PhotoUploader({ initialPhotoUrl = null, size = 96, onUpload }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function pickFile() {
    fileRef.current?.click()
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    const allowed = ['image/jpeg','image/png','image/webp','image/heic']
    if (!allowed.includes(file.type)) {
      setError('JPG, PNG, WebP, or HEIC only.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max 5 MB.')
      return
    }

    start(async () => {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setError('Sign in first.')
        return
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${user.id}/avatar-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(path, file, { cacheControl: '3600', upsert: true })

      if (uploadError) {
        setError(uploadError.message)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setPhotoUrl(publicUrl)
      onUpload?.(publicUrl)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={pickFile}
        disabled={pending}
        aria-label="Upload photo"
        style={{ width: size, height: size }}
        className="relative rounded-full overflow-hidden border-2 border-[var(--color-border-bright)] hover:border-[var(--color-brand)] transition disabled:opacity-50 group"
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-white/[0.04] text-[var(--color-text-muted)] gap-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.8" />
              <path d="M21 15l-5-5-9 9" />
            </svg>
            <span className="text-[10px] font-medium">Add photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
          {pending ? <Spinner /> : <span className="text-[12px] font-bold">Change</span>}
        </div>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={onFile}
        className="sr-only"
      />

      {error && <p className="text-[11px] text-[var(--color-danger)] text-center max-w-[180px]">{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
