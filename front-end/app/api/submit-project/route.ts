import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('RESEND_API_KEY manquant')
      return NextResponse.json(
        { success: false, error: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)
    const body = await request.json()
    const { name, email, phone, projectType, budget, timeline, description } = body

    // Email à l'admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Voisilab <onboarding@resend.dev>', // Utilisez votre domaine vérifié plus tard
      to: 'fablab@uvci.edu.ci', // Email admin
      subject: `🚀 Nouvelle demande de projet - ${projectType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #3b82f6; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📋 Nouvelle demande de projet</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Soumis depuis le formulaire Voisilab</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Nom complet</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">📧 Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                ${phone ? `
                <div class="field">
                  <div class="label">📞 Téléphone</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">🛠️ Type de projet</div>
                  <div class="value">${projectType}</div>
                </div>
                
                ${budget ? `
                <div class="field">
                  <div class="label">💰 Budget estimé</div>
                  <div class="value">${budget}</div>
                </div>
                ` : ''}
                
                ${timeline ? `
                <div class="field">
                  <div class="label">⏱️ Délai souhaité</div>
                  <div class="value">${timeline}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">📝 Description du projet</div>
                  <div class="value" style="white-space: pre-wrap;">${description}</div>
                </div>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé automatiquement depuis le site Voisilab</p>
                <p>Veuillez répondre au client dans les 48h</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Email de confirmation au client
    const clientEmailResponse = await resend.emails.send({
      from: 'Voisilab <onboarding@resend.dev>',
      to: email,
      subject: '✅ Confirmation - Votre demande de projet a été reçue',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success-icon { font-size: 48px; margin-bottom: 10px; }
              .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success-icon">✅</div>
                <h1 style="margin: 0;">Demande bien reçue !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${name}</strong>,</p>
                
                <p>Nous avons bien reçu votre demande de projet concernant : <strong>${projectType}</strong></p>
                
                <p>Notre équipe d'experts va étudier votre demande et vous recontactera dans les <strong>48 heures</strong> pour :</p>
                
                <ul>
                  <li>Discuter en détail de votre projet</li>
                  <li>Évaluer la faisabilité technique</li>
                  <li>Vous proposer un devis personnalisé</li>
                </ul>
                
                <p>En attendant, n'hésitez pas à nous contacter si vous avez des questions :</p>
                
                <ul>
                  <li>📧 Email : <a href="mailto:fablab@uvci.edu.ci">fablab@uvci.edu.ci</a></li>
                  <li>📞 Téléphone : +225 05 00 00 00 00</li>
                  <li>📍 Adresse : Cocody Angré, Abidjan</li>
                </ul>
                
                <div style="text-align: center;">
                  <a href="https://voisilab.fr" class="button">Visiter notre site</a>
                </div>
              </div>
              <div class="footer">
                <p>Merci de votre confiance !</p>
                <p><strong>L'équipe Voisilab</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Emails envoyés avec succès',
      adminEmailId: adminEmailResponse.data?.id,
      clientEmailId: clientEmailResponse.data?.id,
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi des emails' },
      { status: 500 }
    )
  }
}