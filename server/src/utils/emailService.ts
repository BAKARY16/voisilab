/**
 * EmailJS Service - Envoi de notifications par email
 * Envoie des emails à l'administrateur lors de nouvelles soumissions
 */

import emailjs from '@emailjs/nodejs';
import logger from '../config/logger';

// Configuration EmailJS depuis les variables d'environnement
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'bakary.sinon@uvci.edu.ci';

// Template IDs
const TEMPLATE_CONTACT_NOTIFICATION = process.env.EMAILJS_TEMPLATE_CONTACT || '';
const TEMPLATE_PROJECT_NOTIFICATION = process.env.EMAILJS_TEMPLATE_PROJECT || '';

/**
 * Envoie une notification email pour un nouveau message de contact
 */
export async function sendContactNotificationEmail(contactData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contactId: number;
}): Promise<boolean> {
  try {
    // Vérifier la configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !TEMPLATE_CONTACT_NOTIFICATION) {
      logger.warn('⚠️  EmailJS non configuré pour les notifications de contact');
      return false;
    }

    const templateParams = {
      to_email: ADMIN_EMAIL,
      from_name: contactData.name,
      from_email: contactData.email,
      from_phone: contactData.phone || 'Non renseigné',
      subject: contactData.subject,
      message: contactData.message,
      contact_id: contactData.contactId,
      admin_url: process.env.ADMIN_URL || 'https://admin.fablab.voisilab.online',
      contact_link: `${process.env.ADMIN_URL || 'https://admin.fablab.voisilab.online'}/contacts/${contactData.contactId}`
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_CONTACT_NOTIFICATION,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    logger.info(`✅ Email de notification envoyé pour le contact #${contactData.contactId} (${contactData.email})`);
    return true;
  } catch (error: any) {
    const errStatus = error?.status;
    const errText   = error?.text || error?.message || String(error);
    logger.error(`\u274c Email contact non envoy\u00e9 [${errStatus || '?'}]: ${errText}`, {
      contactId: contactData.contactId,
      email: contactData.email,
      hint: errStatus === 403 ? 'Activez \'Allow non-browser\' sur dashboard.emailjs.com/admin/account' : ''
    });
    // Ne pas bloquer la création du contact si l'email échoue
    return false;
  }
}

/**
 * Envoie une notification email pour une nouvelle soumission de projet
 */
export async function sendProjectNotificationEmail(projectData: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
  filesCount: number;
  projectId: number;
}): Promise<boolean> {
  try {
    // Vérifier la configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !TEMPLATE_PROJECT_NOTIFICATION) {
      logger.warn('⚠️  EmailJS non configuré pour les notifications de projet');
      return false;
    }

    const templateParams = {
      to_email: ADMIN_EMAIL,
      from_name: projectData.name,
      from_email: projectData.email,
      from_phone: projectData.phone || 'Non renseigné',
      project_type: projectData.projectType,
      budget: projectData.budget || 'Non spécifié',
      timeline: projectData.timeline || 'Non spécifié',
      description: projectData.description,
      files_count: projectData.filesCount,
      project_id: projectData.projectId,
      admin_url: process.env.ADMIN_URL || 'https://admin.fablab.voisilab.online',
      project_link: `${process.env.ADMIN_URL || 'https://admin.fablab.voisilab.online'}/voisilab/projects`
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_PROJECT_NOTIFICATION,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    logger.info(`✅ Email de notification envoyé pour le projet #${projectData.projectId} (${projectData.email})`);
    return true;
  } catch (error: any) {
    const errStatus = error?.status;
    const errText   = error?.text || error?.message || String(error);
    logger.error(`\u274c Email projet non envoy\u00e9 [${errStatus || '?'}]: ${errText}`, {
      projectId: projectData.projectId,
      email: projectData.email,
      hint: errStatus === 403 ? 'Activez \'Allow non-browser\' sur dashboard.emailjs.com/admin/account' : ''
    });
    // Ne pas bloquer la création du projet si l'email échoue
    return false;
  }
}

/**
 * Vérifie la configuration EmailJS au démarrage du serveur
 */
export function validateEmailConfig(): void {
  const missingVars: string[] = [];

  if (!EMAILJS_SERVICE_ID) missingVars.push('EMAILJS_SERVICE_ID');
  if (!EMAILJS_PUBLIC_KEY) missingVars.push('EMAILJS_PUBLIC_KEY');
  if (!EMAILJS_PRIVATE_KEY) missingVars.push('EMAILJS_PRIVATE_KEY');
  if (!TEMPLATE_CONTACT_NOTIFICATION) missingVars.push('EMAILJS_TEMPLATE_CONTACT');
  if (!TEMPLATE_PROJECT_NOTIFICATION) missingVars.push('EMAILJS_TEMPLATE_PROJECT');

  if (missingVars.length > 0) {
    logger.warn(`⚠️  EmailJS partiellement configuré. Variables manquantes: ${missingVars.join(', ')}`);
    logger.warn('🔔 Les notifications par email seront désactivées');
  } else {
    logger.info(`✅ EmailJS configuré - Notifications email activées vers ${ADMIN_EMAIL}`);
  }
}
