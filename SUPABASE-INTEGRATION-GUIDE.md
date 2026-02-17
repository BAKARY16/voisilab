# 🔌 Guide d'Intégration Supabase - Front-End Utilisateur

## 📋 Services Créés

**7 services read-only** ont été créés dans `front-end/lib/supabase/` :

1. **services.service.ts** - Services du fablab
2. **team.service.ts** - Membres de l'équipe
3. **equipment.service.ts** - Équipements et matériels
4. **ppn.service.ts** - Réseau PPN (points + membres)
5. **workshops.service.ts** - Ateliers et inscriptions
6. **blog.service.ts** - Articles de blog
7. **pages.service.ts** - Pages dynamiques (home, about, contact)

**+ Services existants:**
- **projects.service.ts** - Soumissions de projets
- **email.service.ts** - Envoi d'emails

## ✅ Configuration Complète

### Variables d'environnement (`.env`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://atzhnvrqszccpztqjzqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j15OyQqZASGQP_Lx3fc_Gg_90G6AumE
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

✅ **Déjà configuré et prêt à l'emploi !**

## 🎯 Pages à Connecter

### Pages Prioritaires

1. **Page d'Accueil** (`app/page.tsx`)
   - Services du fablab → `servicesService.getActiveServices()`
   - Statistiques → Calculer depuis les données
   - Équipe → `teamService.getActiveTeamMembers()`

2. **Page À Propos** (`app/about/info.tsx`)
   - Équipe complète → `teamService.getActiveTeamMembers()`
   - Contenu dynamique → `pagesService.getPageByKey('about')`

3. **Page Matériels** (`app/materiels/material.tsx`)
   - Liste équipements → `equipmentService.getAllEquipment()`
   - Filtre par catégorie → `equipmentService.getEquipmentByCategory(category)`

4. **Page Services** (`app/service/`)
   - À créer avec → `servicesService.getActiveServices()`

5. **Carte PPN** (`app/ppn/ppn.tsx`)
   - Points géographiques → `ppnService.getActivePPNLocations()`
   - Membres → `ppnService.getActivePPNMembers()`

6. **Page Blog** (`app/blog/`)
   - À créer avec → `blogService.getPublishedPosts()`

## 📝 Exemple d'Utilisation

### Exemple 1 : Récupérer les Services

```typescript
// Dans une page Next.js
import { servicesService } from '@/lib/supabase'

export default async function ServicesPage() {
  // Récupération côté serveur (Server Component)
  const { data: services, error } = await servicesService.getActiveServices()

  if (error) {
    return <div>Erreur de chargement des services</div>
  }

  return (
    <div>
      <h1>Nos Services</h1>
      <div className="grid">
        {services?.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {service.image_url && (
              <img src={service.image_url} alt={service.title} />
            )}
            <ul>
              {service.features?.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {service.price_info && (
              <p className="price">{service.price_info}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Exemple 2 : Récupérer l'Équipe

```typescript
// Dans app/about/info.tsx
import { teamService } from '@/lib/supabase'

export default async function AboutPage() {
  const { data: team, error } = await teamService.getActiveTeamMembers()

  if (error) {
    console.error('Erreur chargement équipe:', error)
    // Fallback sur données statiques ou message d'erreur
  }

  return (
    <div>
      <h2>Notre Équipe</h2>
      <div className="team-grid">
        {team?.map(member => (
          <div key={member.id} className="team-member">
            {member.avatar_url && (
              <img src={member.avatar_url} alt={member.name} />
            )}
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p>{member.bio}</p>
            <div className="social-links">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank">LinkedIn</a>
              )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank">Twitter</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Exemple 3 : Récupérer les Équipements

```typescript
// Dans app/materiels/material.tsx
'use client'

import { useEffect, useState } from 'react'
import { equipmentService } from '@/lib/supabase'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true)
      const result = category === 'all'
        ? await equipmentService.getAllEquipment()
        : await equipmentService.getEquipmentByCategory(category)

      if (!result.error && result.data) {
        setEquipment(result.data)
      }
      setLoading(false)
    }

    fetchEquipment()
  }, [category])

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <h1>Nos Équipements</h1>

      {/* Filtré par catégorie */}
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="all">Toutes catégories</option>
        <option value="Imprimante 3D">Imprimante 3D</option>
        <option value="Découpe laser">Découpe laser</option>
        <option value="Électronique">Électronique</option>
      </select>

      <div className="equipment-grid">
        {equipment.map(item => (
          <div key={item.id} className="equipment-card">
            {item.image_url && (
              <img src={item.image_url} alt={item.name} />
            )}
            <h3>{item.name}</h3>
            <span className="category">{item.category}</span>
            <p>{item.description}</p>
            <span className={`status status-${item.status}`}>
              {item.status === 'available' && '🟢 Disponible'}
              {item.status === 'in_use' && '🟡 En utilisation'}
              {item.status === 'maintenance' && '🔴 En maintenance'}
            </span>
            {item.location && <p>📍 {item.location}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Exemple 4 : Carte PPN Interactive

```typescript
// Dans app/ppn/ppn.tsx
'use client'

import { useEffect, useState } from 'react'
import { ppnService } from '@/lib/supabase'

export default function PPNMap() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await ppnService.getActivePPNLocations()

      if (!error && data) {
        setLocations(data)
      }
      setLoading(false)
    }

    fetchLocations()
  }, [])

  if (loading) return <div>Chargement de la carte...</div>

  return (
    <div>
      <h1>Réseau PPN</h1>

      {/* Carte Leaflet avec markers */}
      <div className="map-container">
        {/* Intégrer votre composante de carte ici */}
        {locations.map(location => (
          <div key={location.id} className="marker"
            data-lat={location.latitude}
            data-lng={location.longitude}>
            <h4>{location.name}</h4>
            <p>{location.city}</p>
          </div>
        ))}
      </div>

      {/* Liste des points */}
      <div className="locations-list">
        {locations.map(location => (
          <div key={location.id} className="location-card">
            <h3>{location.name}</h3>
            <p>{location.description}</p>
            <p>📍 {location.address}, {location.postal_code} {location.city}</p>
            {location.phone && <p>📞 {location.phone}</p>}
            {location.email && <p>📧 {location.email}</p>}
            {location.website && (
              <a href={location.website} target="_blank">🌐 Site web</a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Exemple 5 : Inscription Atelier

```typescript
// Formulaire d'inscription à un atelier
'use client'

import { useState } from 'react'
import { workshopsService } from '@/lib/supabase'

export default function WorkshopRegistration({ workshopId }: { workshopId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error: submitError } = await workshopsService.registerToWorkshop(
      workshopId,
      formData
    )

    if (submitError) {
      setError('Erreur lors de l\'inscription')
    } else {
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }
  }

  if (success) {
    return (
      <div className="success-message">
        ✅ Inscription enregistrée ! Vous recevrez une confirmation par email.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="workshop-form">
      <input
        type="text"
        placeholder="Nom complet"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <textarea
        placeholder="Message (optionnel)"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit">S'inscrire</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

## 🔄 Pattern Recommandé

### Server Components (Recommandé pour Next.js 13+)

```typescript
// Meilleure performance - données chargées côté serveur
export default async function MyPage() {
  const { data } = await servicesService.getActiveServices()

  return <div>{/* Render data */}</div>
}
```

### Client Components (Pour interactivité)

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function MyPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await servicesService.getActiveServices()
      setData(result.data)
    }
    fetchData()
  }, [])

  return <div>{/* Render data */}</div>
}
```

## 🎨 Stratégie de Migration

### Approche Progressive

1. **Phase 1** : Garder les données statiques comme fallback
   ```typescript
   const { data } = await servicesService.getActiveServices()
   const services = data || STATIC_SERVICES // Fallback
   ```

2. **Phase 2** : Ajouter des états de chargement
   ```typescript
   if (loading) return <Skeleton />
   if (error) return <ErrorMessage />
   return <Content data={data} />
   ```

3. **Phase 3** : Supprimer les données statiques une fois validé
   ```typescript
   const { data } = await servicesService.getActiveServices()
   if (!data) throw new Error('Services non disponibles')
   ```

## 🚀 Avantages

✅ **Contenu dynamique** : Modifiable depuis l'admin sans redéploiement
✅ **Temps réel** : Les modifications admin sont instantanément visibles
✅ **SEO optimisé** : Server Components pour un meilleur référencement
✅ **Performance** : Caching automatique Next.js
✅ **Type-safe** : Services TypeScript avec types stricts

## 📊 Prochaines Étapes

1. Connecter la page d'accueil (`app/page.tsx`)
2. Connecter la page à propos (`app/about/info.tsx`)
3. Connecter la page matériels (`app/materiels/material.tsx`)
4. Créer la page services (`app/service/page.tsx`)
5. Créer les pages blog (`app/blog/`)
6. Intégrer la carte PPN interactive

## 🔧 Maintenance

### Ajouter un Nouveau Service

1. Créer le service dans `front-end/lib/supabase/`
2. L'exporter dans `index.ts`
3. L'utiliser dans vos pages

### Debugging

```typescript
// Activer les logs Supabase
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('active', true)

console.log('Data:', data)
console.log('Error:', error)
```

---

**Tous les services sont prêts !** Il suffit maintenant de les intégrer dans vos pages existantes en suivant les exemples ci-dessus. 🎉
