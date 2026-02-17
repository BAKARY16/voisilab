import React from 'react'

interface HoneypotProps {
  onChange: (value: string) => void
}

/**
 * Composant Honeypot pour protection anti-spam
 * Invisible pour les utilisateurs humains, mais rempli par les bots
 */
export const Honeypot: React.FC<HoneypotProps> = ({ onChange }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor="website_url">
        Website (do not fill this out):
      </label>
      <input
        type="text"
        id="website_url"
        name="website_url"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
      />
    </div>
  )
}