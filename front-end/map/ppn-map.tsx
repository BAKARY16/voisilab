"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./ppn-map.css"
import { MapPin, Mail, Phone, Users, Award, Target, X, Route, Navigation2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Fix icônes Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

interface PPNLocation {
  id: string
  name: string
  city: string
  region: string
  address: string
  type: "Urban" | "Rural" | "Mixed"
  coordinates: { lat: number; lng: number }
  services: string[]
  email: string
  phone: string
  manager: string
  openingYear: number
  status: "active" | "construction" | "planned"
}

interface PPNMapProps {
  locations: PPNLocation[]
  selectedPPN?: string | null
}

interface UserLocation {
  lat: number
  lng: number
  accuracy: number
}

// ✅ Composant pour capturer l'instance de la carte
function MapInstanceHandler({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap()
  
  useEffect(() => {
    onMapReady(map)
  }, [map, onMapReady])
  
  return null
}

// ✅ CORRECTION CRITIQUE : Composant avec désactivation complète
function LiveLocationTracker({
  onLocationUpdate,
  isActive,
}: {
  onLocationUpdate: (location: UserLocation) => void
  isActive: boolean
}) {
  const lastPositionRef = useRef<UserLocation | null>(null)

  useEffect(() => {
    // ✅ CORRECTION : Ne rien faire si désactivé
    if (!isActive) {
      return
    }

    let watchId: number | null = null

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }

          // ✅ CORRECTION : Ne mettre à jour que si la distance > 5 mètres
          if (lastPositionRef.current) {
            const distance = calculateDistance(
              lastPositionRef.current.lat,
              lastPositionRef.current.lng,
              location.lat,
              location.lng
            )
            
            // Ne mettre à jour que si déplacement significatif (> 5m)
            if (distance < 0.005) { // ~5 mètres en degrés
              return
            }
          }

          lastPositionRef.current = location
          onLocationUpdate(location)
        },
        (error) => console.error("Erreur GPS:", error),
        {
          enableHighAccuracy: true,
          maximumAge: 5000, // ✅ CORRECTION : Cache pendant 5 secondes
          timeout: 10000,
        }
      )
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        console.log("🛑 Suivi GPS arrêté")
      }
    }
  }, [onLocationUpdate, isActive]) // ✅ CORRECTION : Dépendance sur isActive

  return null
}

// ✅ NOUVEAU : Fonction pour calculer la distance entre deux points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Composant de routing avec OSRM - SANS ZOOM AUTOMATIQUE
function RoutingMachine({
  userLocation,
  destination,
  onRouteFound,
}: {
  userLocation: UserLocation | null
  destination: UserLocation | null
  onRouteFound?: (distance: number, duration: number) => void
}) {
  const map = useMap()
  const [routePath, setRoutePath] = useState<[number, number][]>([])

  useEffect(() => {
    if (!userLocation || !destination) {
      setRoutePath([])
      return
    }

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        const response = await fetch(url)
        const data = await response.json()

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const coordinates = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          )
          
          setRoutePath(coordinates)

          const distance = route.distance / 1000
          const duration = route.duration

          if (onRouteFound) onRouteFound(distance, duration)

          // ✅ SUPPRIMÉ : Zoom automatique désactivé
          // const bounds = L.latLngBounds(coordinates)
          // setTimeout(() => {
          //   map.flyToBounds(bounds, {
          //     padding: [80, 80],
          //     duration: 1.5,
          //     easeLinearity: 0.25,
          //     maxZoom: 14,
          //   })
          // }, 300)
        }
      } catch (error) {
        console.error("Erreur routing:", error)
      }
    }

    fetchRoute()
  }, [userLocation, destination, map, onRouteFound])

  if (routePath.length === 0) return null

  return (
    <Polyline
      positions={routePath}
      pathOptions={{
        color: "#10b981",
        weight: 5,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
      }}
    />
  )
}

// Composant pour voler vers un PPN
function FlyToMarker({ selectedPPN, locations }: { selectedPPN?: string | null; locations: PPNLocation[] }) {
  const map = useMap()

  useEffect(() => {
    if (selectedPPN) {
      const ppn = locations.find((loc) => loc.id === selectedPPN)
      if (ppn) {
        map.flyTo([ppn.coordinates.lat, ppn.coordinates.lng], 13, { duration: 1.5 })
      }
    }
  }, [selectedPPN, locations, map])

  return null
}

// Icône minimaliste selon type
const createCustomIcon = (type: "Urban" | "Rural" | "Mixed", status: string) => {
  const colors = {
    Urban: "#3b82f6",
    Rural: "#10b981",
    Mixed: "#8b5cf6",
  }
  const color = colors[type]

  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="position: relative;">
        <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.3 0 0 6.3 0 14c0 9.6 14 24 14 24s14-14.4 14-24c0-7.7-6.3-14-14-14z" 
                fill="${color}" 
                stroke="white" 
                stroke-width="2"/>
          <circle cx="14" cy="14" r="5" fill="white"/>
          <circle cx="14" cy="14" r="3" fill="${status === "active" ? "#10b981" : "#f59e0b"}"/>
        </svg>
      </div>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  })
}

// Icône position utilisateur - minimaliste
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

export function PPNMap({ locations, selectedPPN }: PPNMapProps) {
  const [mounted, setMounted] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [destination, setDestination] = useState<UserLocation | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null)
  const [gpsError, setGpsError] = useState<string>("")
  const [isLoadingGPS, setIsLoadingGPS] = useState(false)
  const [showRoutePanel, setShowRoutePanel] = useState(false)
  const [isTrackingLive, setIsTrackingLive] = useState(false)
  const [pendingNavigationPPN, setPendingNavigationPPN] = useState<PPNLocation | null>(null)
  
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (userLocation && pendingNavigationPPN) {
      console.log("🚀 Position obtenue, lancement de la navigation vers:", pendingNavigationPPN.name)
      setDestination({
        lat: pendingNavigationPPN.coordinates.lat,
        lng: pendingNavigationPPN.coordinates.lng,
        accuracy: 0,
      })
      setShowRoutePanel(true)
      setPendingNavigationPPN(null)
      
      // ✅ CORRECTION CRITIQUE : Arrêter le suivi GPS
      setIsTrackingLive(false)
    }
  }, [userLocation, pendingNavigationPPN])

  const getUserLocation = () => {
    setIsLoadingGPS(true)
    setGpsError("")

    if (!navigator.geolocation) {
      setGpsError("Géolocalisation non supportée")
      setIsLoadingGPS(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setUserLocation(userPos)
        setIsLoadingGPS(false)
        setIsTrackingLive(true)
        console.log("✅ Position GPS obtenue:", userPos)
      },
      (error) => {
        setIsLoadingGPS(false)
        setPendingNavigationPPN(null)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError("Accès à la position refusé. Veuillez autoriser la géolocalisation.")
            break
          case error.POSITION_UNAVAILABLE:
            setGpsError("Position indisponible. Vérifiez votre connexion GPS.")
            break
          case error.TIMEOUT:
            setGpsError("Délai dépassé. Réessayez.")
            break
          default:
            setGpsError("Erreur de géolocalisation")
        }
        console.error("❌ Erreur GPS:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    )
  }

  const handleLocationUpdate = (location: UserLocation) => {
    // ✅ AJOUT : Ne pas mettre à jour pendant la navigation active
    if (destination) {
      return
    }

    if (!userLocation) {
      setUserLocation(location)
      return
    }

    // Ne mettre à jour que si déplacement significatif (> 10m)
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      location.lat,
      location.lng
    )

    if (distance > 0.01) { // ~10 mètres
      setUserLocation(location)
    }
  }

  const startNavigation = (ppn: PPNLocation) => {
    console.log("🎯 Clic sur Itinéraire pour:", ppn.name)
    
    if (!userLocation) {
      console.log("📍 Pas de position GPS, demande en cours...")
      setPendingNavigationPPN(ppn)
      getUserLocation()
      return
    }

    console.log("🚀 Navigation directe vers:", ppn.name)
    
    // ✅ CORRECTION CRITIQUE : Arrêter le suivi GPS AVANT
    setIsTrackingLive(false)
    
    setDestination({
      lat: ppn.coordinates.lat,
      lng: ppn.coordinates.lng,
      accuracy: 0,
    })
    setShowRoutePanel(true)
  }

  const cancelNavigation = () => {
    setDestination(null)
    setRouteInfo(null)
    setShowRoutePanel(false)
    setPendingNavigationPPN(null)
    
    // ✅ CORRECTION : Réactiver le suivi GPS après annulation
    if (userLocation) {
      setIsTrackingLive(true)
      console.log("🔄 Suivi GPS réactivé")
    }
    
    if (mapRef.current) {
      if (userLocation) {
        mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12, {
          duration: 1,
        })
      } else {
        mapRef.current.flyTo([7.539989, -5.54708], 7, {
          duration: 1,
        })
      }
    }
  }

  const recenterMap = () => {
    if (mapRef.current && userLocation && destination) {
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        [destination.lat, destination.lng],
      ])
      mapRef.current.flyToBounds(bounds, {
        padding: [80, 80],
        duration: 1,
        maxZoom: 14,
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}min`
    return `${minutes}min`
  }

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-muted/30 rounded-xl flex items-center justify-center border border-border">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={[7.539989, -5.54708]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapInstanceHandler onMapReady={(map) => { mapRef.current = map }} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ CORRECTION FINALE : Passer isActive en prop */}
        <LiveLocationTracker 
          onLocationUpdate={handleLocationUpdate}
          isActive={isTrackingLive && !destination}
        />

        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
              <Popup className="custom-popup-minimal">
                <div className="p-4 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="text-blue-600" size={16} />
                    <span className="font-semibold text-sm">Votre position</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Lat: {userLocation.lat.toFixed(6)}</p>
                    <p>Lng: {userLocation.lng.toFixed(6)}</p>
                    <p className="text-green-600 font-medium pt-2 border-t border-border">
                      Précision: ±{userLocation.accuracy.toFixed(0)}m
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          </>
        )}

        {locations.map((ppn) => (
          <Marker key={ppn.id} position={[ppn.coordinates.lat, ppn.coordinates.lng]} icon={createCustomIcon(ppn.type, ppn.status)}>
            <Popup maxWidth={300} className="custom-popup-minimal">
              <div className="p-0 min-w-[280px]">
                <div className="p-4 border-b border-border bg-muted/20">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {ppn.type === "Urban" ? "Urbain" : ppn.type === "Rural" ? "Rural" : "Mixte"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      Actif
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1">{ppn.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={12} />
                    {ppn.city}, {ppn.region}
                  </p>
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-xs text-muted-foreground flex items-start gap-2">
                    <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{ppn.address}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <a href={`mailto:${ppn.email}`} className="flex items-center gap-2 text-xs text-foreground hover:text-primary truncate">
                      <Mail size={14} className="flex-shrink-0" />
                      {ppn.email}
                    </a>
                    <a href={`tel:${ppn.phone}`} className="flex items-center gap-2 text-xs text-foreground hover:text-primary">
                      <Phone size={14} className="flex-shrink-0" />
                      {ppn.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <Users size={14} className="flex-shrink-0" />
                    {ppn.manager}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={12} className="text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Services</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ppn.services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="text-xs bg-muted/50 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {ppn.services.length > 3 && (
                        <span className="text-xs bg-muted/50 px-2 py-1 rounded">
                          +{ppn.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    {/* <a
                      href={`mailto:${ppn.email}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                      <Mail size={14} className="mr-1.5" />
                      Contact
                    </a> */}
                    <Button
                      onClick={() => startNavigation(ppn)}
                      variant="outline"
                      size="sm"
                      type="button"
                      className="flex-1 cursor-pointer"
                    >
                      <Route size={14} className="mr-1.5" />
                      Itinéraire
                    </Button>
                  </div>

                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && destination && (
          <RoutingMachine
            userLocation={userLocation}
            destination={destination}
            onRouteFound={(distance, duration) => setRouteInfo({ distance, duration })}
          />
        )}

        <FlyToMarker selectedPPN={selectedPPN} locations={locations} />
      </MapContainer>

      {showRoutePanel && routeInfo && (
        <div className="absolute top-8 right-4 z-[1000] w-72">
          <Card className="border border-border shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Route className="text-foreground" size={18} />
                  <h3 className="font-semibold text-sm">Navigation</h3>
                </div>
                <button 
                  onClick={cancelNavigation} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Distance</p>
                  <p className="text-xl font-bold">{routeInfo.distance.toFixed(1)} km</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Durée</p>
                  <p className="text-xl font-bold">{formatDuration(routeInfo.duration)}</p>
                </div>
              </div>

              {userLocation && (
                <div className="text-xs bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-700 dark:text-green-400">GPS Actif</span>
                  </div>
                  <p className="text-muted-foreground">
                    Précision: <span className="font-medium text-foreground">±{userLocation.accuracy.toFixed(0)}m</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={recenterMap}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Navigation2 size={14} className="mr-1.5" />
                  Recentrer
                </Button>
                <Button
                  onClick={cancelNavigation}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="absolute top-4 right-4 z-[1000]">
        {userLocation ? (
          <div className="bg-background border border-border rounded-lg shadow-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">GPS Actif</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">±{userLocation.accuracy.toFixed(0)}m</p>
          </div>
        ) : (
          <Button
            onClick={getUserLocation}
            disabled={isLoadingGPS}
            size="sm"
            className="gap-2"
          >
            {isLoadingGPS ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                GPS...
              </>
            ) : (
              <>
                <Target size={16} />
                GPS
              </>
            )}
          </Button>
        )}
      </div>

      {gpsError && (
        <div className="absolute top-20 right-4 z-[1000] max-w-xs">
          <Card className="border border-red-500/50 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-3">
              <p className="text-xs text-red-700 dark:text-red-400">{gpsError}</p>
              <button onClick={getUserLocation} className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium mt-2">
                Réessayer
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Légende</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-muted-foreground">Votre position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-xs text-muted-foreground">Urbain ({locations.filter(p => p.type === "Urban").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-xs text-muted-foreground">Rural ({locations.filter(p => p.type === "Rural").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded"></div>
            <span className="text-xs text-muted-foreground">Mixte ({locations.filter(p => p.type === "Mixed").length})</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Total : <span className="font-semibold text-foreground">{locations.length} PPN</span>
          </p>
        </div>
      </div>

      {/* <div className="absolute top-4 left-16 z-[1000] bg-background border border-border rounded-lg px-3 py-1.5 shadow-lg">
        <p className="text-xs font-medium">
          🇨🇮 {locations.length} centres actifs
        </p>
      </div> */}
    </div>
  )
}