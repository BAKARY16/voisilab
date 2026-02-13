export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  recipientEmail: process.env.NEXT_PUBLIC_EMAILJS_RECIPIENT_EMAIL || 'fablab@uvci.edu.ci',
  templates: {
    team: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_TEAM || '',
    client: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT || '',
  },
}

// Validation des variables d'environnement
if (typeof window !== 'undefined') {
  if (!emailjsConfig.serviceId) {
    console.error('❌ NEXT_PUBLIC_EMAILJS_SERVICE_ID manquant')
  }
  if (!emailjsConfig.publicKey) {
    console.error('❌ NEXT_PUBLIC_EMAILJS_PUBLIC_KEY manquant')
  }
  if (!emailjsConfig.templates.team) {
    console.error('❌ NEXT_PUBLIC_EMAILJS_TEMPLATE_TEAM manquant')
  }
  if (!emailjsConfig.templates.client) {
    console.error('❌ NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT manquant')
  }
}