import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';

// Import notification helper
const createNotification = async (userId: number, type: string, title: string, message: string, link: string) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, message, link]
    );
  } catch (error) {
    console.error('Erreur lors de la création de notification:', error);
  }
};

interface PPNLocation extends RowDataPacket {
  id: string;
  name: string;
  city: string;
  region: string;
  address?: string;
  type: 'Urban' | 'Rural' | 'Mixed';
  latitude?: number;
  longitude?: number;
  services?: string;
  email?: string;
  phone?: string;
  manager?: string;
  opening_year?: number;
  status: 'planned' | 'construction' | 'active';
  image?: string;
  created_at: Date;
  updated_at: Date;
}

// GET tous les PPN
export const getAllPpns = asyncHandler(async (req: Request, res: Response) => {
  const [rows] = await pool.query<PPNLocation[]>(
    'SELECT * FROM ppn_locations ORDER BY created_at DESC'
  );
  
  res.json({ success: true, data: rows });
});

// GET un PPN par ID
export const getPpnById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const [rows] = await pool.query<PPNLocation[]>(
    'SELECT * FROM ppn_locations WHERE id = ?',
    [id]
  );
  
  if (rows.length === 0) {
    res.status(404).json({ success: false, message: 'PPN non trouvé' });
    return;
  }
  
  res.json({ success: true, data: rows[0] });
});

// CREATE un nouveau PPN
export const createPpn = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    city,
    region,
    address,
    type = 'Urban',
    latitude,
    longitude,
    services,
    email,
    phone,
    manager,
    opening_year,
    status = 'planned',
    image
  } = req.body;

  // Validation
  if (!name || !city || !region) {
    res.status(400).json({ 
      success: false, 
      message: 'Le nom, la ville et la région sont requis' 
    });
    return;
  }

  const id = `PPN-${uuidv4().substring(0, 8).toUpperCase()}`;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO ppn_locations 
    (id, name, city, region, address, type, latitude, longitude, services, email, phone, manager, opening_year, status, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, city, region, address, type, latitude, longitude, services, email, phone, manager, opening_year, status, image]
  );

  // Créer une notification pour tous les admins
  try {
    const [admins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = "admin"'
    );

    for (const admin of admins) {
      await createNotification(
        admin.id,
        'ppn',
        'Nouveau PPN créé',
        `Un nouveau point PPN "${name}" a été créé à ${city}`,
        '/voisilab/ppn'
      );
    }
  } catch (error) {
    console.error('Erreur lors de la création des notifications:', error);
  }

  res.status(201).json({
    success: true,
    message: 'PPN créé avec succès',
    data: { id, name, city, region, type, status }
  });
});

// UPDATE un PPN
export const updatePpn = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    city,
    region,
    address,
    type,
    latitude,
    longitude,
    services,
    email,
    phone,
    manager,
    opening_year,
    status,
    image
  } = req.body;

  // Vérifier si le PPN existe
  const [existing] = await pool.query<PPNLocation[]>(
    'SELECT * FROM ppn_locations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    res.status(404).json({ success: false, message: 'PPN non trouvé' });
    return;
  }

  await pool.query(
    `UPDATE ppn_locations SET
    name = COALESCE(?, name),
    city = COALESCE(?, city),
    region = COALESCE(?, region),
    address = COALESCE(?, address),
    type = COALESCE(?, type),
    latitude = COALESCE(?, latitude),
    longitude = COALESCE(?, longitude),
    services = COALESCE(?, services),
    email = COALESCE(?, email),
    phone = COALESCE(?, phone),
    manager = COALESCE(?, manager),
    opening_year = COALESCE(?, opening_year),
    status = COALESCE(?, status),
    image = COALESCE(?, image)
    WHERE id = ?`,
    [name, city, region, address, type, latitude, longitude, services, email, phone, manager, opening_year, status, image, id]
  );

  // Créer une notification pour tous les admins
  try {
    const [admins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = "admin"'
    );

    for (const admin of admins) {
      await createNotification(
        admin.id,
        'ppn',
        'PPN modifié',
        `Le point PPN "${name || existing[0].name}" a été mis à jour`,
        '/voisilab/ppn'
      );
    }
  } catch (error) {
    console.error('Erreur lors de la création des notifications:', error);
  }

  res.json({
    success: true,
    message: 'PPN mis à jour avec succès'
  });
});

// DELETE un PPN
export const deletePpn = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Récupérer le nom du PPN avant suppression
  const [existing] = await pool.query<PPNLocation[]>(
    'SELECT name FROM ppn_locations WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    res.status(404).json({ success: false, message: 'PPN non trouvé' });
    return;
  }

  const ppnName = existing[0].name;

  await pool.query('DELETE FROM ppn_locations WHERE id = ?', [id]);

  // Créer une notification pour tous les admins
  try {
    const [admins] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = "admin"'
    );

    for (const admin of admins) {
      await createNotification(
        admin.id,
        'ppn',
        'PPN supprimé',
        `Le point PPN "${ppnName}" a été supprimé`,
        '/voisilab/ppn'
      );
    }
  } catch (error) {
    console.error('Erreur lors de la création des notifications:', error);
  }

  res.json({
    success: true,
    message: 'PPN supprimé avec succès'
  });
});
