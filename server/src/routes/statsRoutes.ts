import { Router } from 'express';
import pool from '../config/database';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Statistiques globales du dashboard
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    // Exécuter toutes les requêtes en parallèle pour performance
    const [
      contactStats,
      projectStats,
      teamStats,
      workshopStats,
      recentContacts,
      recentProjects,
      monthlyActivity
    ] = await Promise.all([
      // Stats messages de contact
      pool.query<RowDataPacket[]>(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
          SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
          SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week
        FROM contact_messages
      `),

      // Stats soumissions de projet
      pool.query<RowDataPacket[]>(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
          SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
          SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week
        FROM project_submissions
      `),

      // Stats équipe
      pool.query<RowDataPacket[]>(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as inactive
        FROM team
      `),

      // Stats ateliers (si la table existe)
      pool.query<RowDataPacket[]>(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming,
          SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM workshops
      `).catch(() => [{ total: 0, upcoming: 0, ongoing: 0, completed: 0 }]),

      // 5 derniers messages de contact
      pool.query<RowDataPacket[]>(`
        SELECT id, firstname, lastname, email, subject, status, created_at
        FROM contact_messages
        ORDER BY created_at DESC
        LIMIT 5
      `),

      // 5 dernières soumissions de projet
      pool.query<RowDataPacket[]>(`
        SELECT id, name, email, project_type, status, created_at
        FROM project_submissions
        ORDER BY created_at DESC
        LIMIT 5
      `),

      // Activité mensuelle (12 derniers mois)
      pool.query<RowDataPacket[]>(`
        SELECT
          DATE_FORMAT(created_at, '%Y-%m') as month,
          'contacts' as type,
          COUNT(*) as count
        FROM contact_messages
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')

        UNION ALL

        SELECT
          DATE_FORMAT(created_at, '%Y-%m') as month,
          'projects' as type,
          COUNT(*) as count
        FROM project_submissions
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')

        ORDER BY month DESC
      `)
    ]);

    // Calculer les tendances (comparaison avec la semaine précédente)
    const [lastWeekContacts] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) as count
      FROM contact_messages
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    const [lastWeekProjects] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) as count
      FROM project_submissions
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
        AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    const contactsThisWeek = contactStats[0][0].this_week || 0;
    const contactsLastWeek = lastWeekContacts[0][0]?.count || 0;
    const contactsTrend = contactsLastWeek > 0
      ? parseFloat(((contactsThisWeek - contactsLastWeek) / contactsLastWeek * 100).toFixed(1))
      : 0;

    const projectsThisWeek = projectStats[0][0].this_week || 0;
    const projectsLastWeek = lastWeekProjects[0][0]?.count || 0;
    const projectsTrend = projectsLastWeek > 0
      ? parseFloat(((projectsThisWeek - projectsLastWeek) / projectsLastWeek * 100).toFixed(1))
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          contacts: {
            total: contactStats[0][0].total || 0,
            unread: contactStats[0][0].unread || 0,
            today: contactStats[0][0].today || 0,
            thisWeek: contactsThisWeek,
            trend: contactsTrend
          },
          projects: {
            total: projectStats[0][0].total || 0,
            pending: projectStats[0][0].pending || 0,
            approved: projectStats[0][0].approved || 0,
            reviewing: projectStats[0][0].reviewing || 0,
            today: projectStats[0][0].today || 0,
            thisWeek: projectsThisWeek,
            trend: projectsTrend
          },
          team: {
            total: teamStats[0][0].total || 0,
            active: teamStats[0][0].active || 0,
            inactive: teamStats[0][0].inactive || 0
          },
          workshops: {
            total: workshopStats[0]?.[0]?.total || 0,
            upcoming: workshopStats[0]?.[0]?.upcoming || 0,
            ongoing: workshopStats[0]?.[0]?.ongoing || 0,
            completed: workshopStats[0]?.[0]?.completed || 0
          }
        },
        recent: {
          contacts: recentContacts[0] || [],
          projects: recentProjects[0] || []
        },
        monthlyActivity: monthlyActivity[0] || []
      }
    });
  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Statistiques détaillées par période
router.get('/period/:period', authenticate, requireAdmin, async (req, res) => {
  const { period } = req.params; // 'day', 'week', 'month', 'year'

  let dateFilter = '';
  switch (period) {
    case 'day':
      dateFilter = 'DATE(created_at) = CURDATE()';
      break;
    case 'week':
      dateFilter = 'DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
      break;
    case 'month':
      dateFilter = 'DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
      break;
    case 'year':
      dateFilter = 'DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)';
      break;
    default:
      return res.status(400).json({ success: false, message: 'Période invalide' });
  }

  try {
    const [contacts] = await pool.query<RowDataPacket[]>(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM contact_messages
      WHERE ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const [projects] = await pool.query<RowDataPacket[]>(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM project_submissions
      WHERE ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        period,
        contacts: contacts[0] || [],
        projects: projects[0] || []
      }
    });
  } catch (error) {
    console.error('Erreur stats période:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
