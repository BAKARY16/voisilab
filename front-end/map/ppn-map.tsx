"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./ppn-map.css"
import { MapPin, Mail, Phone, Users, Award, Navigation, Locate, X, Route, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  accuracy: number // Précision en mètres
}

// Composant pour suivre la position en temps réel
function LiveLocationTracker({
  onLocationUpdate,
}: {
  onLocationUpdate: (location: UserLocation) => void
}) {
  useEffect(() => {
    let watchId: number | null = null

    if (navigator.geolocation) {
      // Surveillance continue de la position
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          onLocationUpdate(location)
        },
        (error) => {
          console.error("Erreur de suivi GPS:", error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      )
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [onLocationUpdate])

  return null
}

// Composant pour la navigation GPS avec OSRM directement
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

    // Appel direct à l'API OSRM pour obtenir l'itinéraire
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        
        console.log("🔍 Requête OSRM:", url)
        
        const response = await fetch(url)
        const data = await response.json()

        console.log("📡 Réponse OSRM:", data)

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          
          // Convertir les coordonnées GeoJSON en format Leaflet [lat, lng]
          const coordinates = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          )
          
          setRoutePath(coordinates)

          // Calculer distance et durée
          const distance = route.distance / 1000 // en km
          const duration = route.duration // en secondes

          console.log("✅ Itinéraire trouvé:")
          console.log("  📏 Distance:", distance.toFixed(2), "km")
          console.log("  ⏱️ Durée:", duration, "secondes")
          console.log("  📍 Points:", coordinates.length)

          if (onRouteFound) {
            onRouteFound(distance, duration)
          }

          // Ajuster la vue pour voir tout l'itinéraire
          const bounds = L.latLngBounds(coordinates)
          map.fitBounds(bounds, { padding: [50, 50] })
        } else {
          console.error("❌ Erreur OSRM:", data)
          setRoutePath([])
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'itinéraire:", error)
        setRoutePath([])
      }
    }

    fetchRoute()
  }, [userLocation, destination, map, onRouteFound])

  // Afficher la ligne de l'itinéraire
  if (routePath.length === 0) return null

  return (
    <Polyline
      positions={routePath}
      pathOptions={{
        color: "#10b981",
        weight: 6,
        opacity: 0.8,
        dashArray: undefined,
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
        map.flyTo([ppn.coordinates.lat, ppn.coordinates.lng], 13, {
          duration: 1.5,
        })
      }
    }
  }, [selectedPPN, locations, map])

  return null
}

// Icône personnalisée selon type
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
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 26 16 26s16-15 16-26c0-8.8-7.2-16-16-16z" 
                fill="${color}" 
                stroke="#fff" 
                stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="#fff"/>
          <circle cx="16" cy="16" r="4" fill="${status === "active" ? "#10b981" : "#f59e0b"}"/>
        </svg>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  })
}

// Icône pour la position de l'utilisateur (point de départ)
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <!-- Cercle pulsant -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        <!-- Point central -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
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

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fonction pour obtenir la position GPS de l'utilisateur avec haute précision
  const getUserLocation = () => {
    setIsLoadingGPS(true)
    setGpsError("")

    if (!navigator.geolocation) {
      setGpsError("❌ Votre navigateur ne supporte pas la géolocalisation")
      setIsLoadingGPS(false)
      return
    }

    // Demander la position avec haute précision
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        console.log("📍 Position GPS récupérée:")
        console.log("  - Latitude:", userPos.lat)
        console.log("  - Longitude:", userPos.lng)
        console.log("  - Précision:", userPos.accuracy, "mètres")

        setUserLocation(userPos)
        setIsLoadingGPS(false)
        setGpsError("")
        setIsTrackingLive(true) // Activer le suivi en temps réel
      },
      (error) => {
        console.error("❌ Erreur GPS:", error)
        setIsLoadingGPS(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError(
              "❌ Vous avez refusé l'accès à votre position. Veuillez autoriser la géolocalisation dans les paramètres de votre navigateur."
            )
            break
          case error.POSITION_UNAVAILABLE:
            setGpsError("❌ Position GPS indisponible. Vérifiez votre connexion et que le GPS est activé sur votre appareil.")
            break
          case error.TIMEOUT:
            setGpsError("⏱️ Délai d'attente dépassé. Réessayez.")
            break
          default:
            setGpsError("❌ Erreur inconnue lors de la géolocalisation.")
        }
      },
      {
        enableHighAccuracy: true, // Haute précision (utilise le GPS)
        timeout: 20000, // 20 secondes
        maximumAge: 0, // Ne pas utiliser de cache
      }
    )
  }

  // Mise à jour de la position en temps réel
  const handleLocationUpdate = (location: UserLocation) => {
    console.log("🔄 Position mise à jour:", location)
    setUserLocation(location)
  }

  // Fonction pour démarrer la navigation
  const startNavigation = (ppn: PPNLocation) => {
    console.log("🚀 Démarrage navigation vers:", ppn.name)

    if (!userLocation) {
      console.log("⏳ Activation GPS en cours...")
      getUserLocation()
      
      // Créer un intervalle pour vérifier quand la position est disponible
      const checkInterval = setInterval(() => {
        if (userLocation) {
          clearInterval(checkInterval)
          setDestination({
            lat: ppn.coordinates.lat,
            lng: ppn.coordinates.lng,
            accuracy: 0,
          })
          setShowRoutePanel(true)
        }
      }, 500)
      
      // Nettoyer après 10 secondes si aucune position
      setTimeout(() => clearInterval(checkInterval), 10000)
      return
    }

    setDestination({
      lat: ppn.coordinates.lat,
      lng: ppn.coordinates.lng,
      accuracy: 0,
    })
    setShowRoutePanel(true)
  }

  // Fonction pour annuler la navigation
  const cancelNavigation = () => {
    setDestination(null)
    setRouteInfo(null)
    setShowRoutePanel(false)
  }

  // Formater la durée
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200">
      <MapContainer
        center={[7.539989, -5.54708]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Suivi en temps réel de la position */}
        {isTrackingLive && <LiveLocationTracker onLocationUpdate={handleLocationUpdate} />}

        {/* Marker de la position utilisateur (POINT DE DÉPART) */}
        {userLocation && (
          <>
            {/* Point de départ animé */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
              <Popup>
                <div className="text-center font-semibold">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <Target className="text-blue-600" size={18} />
                    <span className="text-blue-600">POINT DE DÉPART</span>
                  </div>
                  <p className="text-sm font-bold">📍 Votre position</p>
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>Latitude: {userLocation.lat.toFixed(6)}</p>
                    <p>Longitude: {userLocation.lng.toFixed(6)}</p>
                    <p className="text-green-600 font-medium">Précision: ±{userLocation.accuracy.toFixed(0)}m</p>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Cercle de précision */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Markers pour chaque PPN (POINTS D'ARRIVÉE) */}
        {locations.map((ppn) => (
          <Marker key={ppn.id} position={[ppn.coordinates.lat, ppn.coordinates.lng]} icon={createCustomIcon(ppn.type, ppn.status)}>
            <Popup maxWidth={320} className="custom-popup">
              <div className="p-0 min-w-[280px]">
                <div
                  className="p-4 text-white"
                  style={{
                    background:
                      ppn.type === "Urban"
                        ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                        : ppn.type === "Rural"
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {ppn.type === "Urban" ? "🏙️ Urbain" : ppn.type === "Rural" ? "🌾 Rural" : "🏘️ Mixte"}
                    </Badge>
                    <Badge
                      className={
                        ppn.status === "active"
                          ? "bg-green-500/30 text-white border-green-300/50 text-xs"
                          : "bg-yellow-500/30 text-white border-yellow-300/50 text-xs"
                      }
                    >
                      {ppn.status === "active" ? "✅ Actif" : "🚧 Construction"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{ppn.name}</h3>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <MapPin size={14} />
                    {ppn.city}, {ppn.region}
                  </p>
                </div>

                <div className="p-4 space-y-3 bg-white">
                  <div className="text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      {ppn.address}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <a href={`mailto:${ppn.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Mail size={14} />
                      <span className="truncate">{ppn.email}</span>
                    </a>
                    <a href={`tel:${ppn.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Phone size={14} />
                      {ppn.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                    <Users size={14} className="text-gray-400" />
                    <span>{ppn.manager}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-1 text-gray-900">
                      <Award size={12} />
                      Services
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {ppn.services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {ppn.services.length > 3 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-medium">+{ppn.services.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2 pt-3">
                    <a
                      href={`mailto:${ppn.email}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Mail size={14} className="mr-2" />
                      Contacter
                    </a>
                    <button
                      onClick={() => startNavigation(ppn)}
                      className="px-3 flex items-center justify-center py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Route size={16} className="mr-1" />
                      Itinéraire
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Composant de routing avec OSRM direct */}
        {userLocation && destination && (
          <RoutingMachine
            userLocation={userLocation}
            destination={destination}
            onRouteFound={(distance, duration) => {
              console.log("✅ Itinéraire calculé:", distance, "km,", formatDuration(duration))
              setRouteInfo({ distance, duration })
            }}
          />
        )}

        <FlyToMarker selectedPPN={selectedPPN} locations={locations} />
      </MapContainer>

      {/* Panel d'information de l'itinéraire */}
      {showRoutePanel && routeInfo && (
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <Card className="border-2 border-blue-500 shadow-2xl bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Route className="text-blue-600" size={20} />
                  Navigation active
                </h3>
                <button onClick={cancelNavigation} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">📏 Distance</p>
                    <p className="text-2xl font-bold text-blue-600">{routeInfo.distance.toFixed(1)} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">⏱️ Durée estimée</p>
                    <p className="text-2xl font-bold text-green-600">{formatDuration(routeInfo.duration)}</p>
                  </div>
                </div>

                <div className="text-xs bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg space-y-2">
                  <p className="flex items-center gap-2 font-medium">
                    <Target className="text-blue-600" size={14} />
                    <span className="text-blue-700">Point de départ (Vous)</span>
                  </p>
                  <div className="border-l-2 border-dashed border-blue-400 ml-1.5 h-4"></div>
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="text-red-600" size={14} />
                    <span className="text-red-700">Point d'arrivée (PPN)</span>
                  </p>
                </div>

                {userLocation && (
                  <div className="text-xs bg-green-50 p-3 rounded-lg">
                    <p className="font-semibold text-green-700 mb-1">🎯 Précision GPS</p>
                    <p className="text-gray-600">±{userLocation.accuracy.toFixed(0)} mètres</p>
                  </div>
                )}

                <button
                  onClick={cancelNavigation}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Annuler la navigation
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bouton de géolocalisation */}
      <div className="absolute top-4 right-4 z-[1000]">
        {userLocation ? (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">GPS ACTIF</span>
            </div>
            <p className="text-xs opacity-90">Précision: ±{userLocation.accuracy.toFixed(0)}m</p>
          </div>
        ) : (
          <button
            onClick={getUserLocation}
            disabled={isLoadingGPS}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow-xl hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
          >
            {isLoadingGPS ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Localisation GPS...
              </>
            ) : (
              <>
                <Target size={20} />
                Activer GPS
              </>
            )}
          </button>
        )}
      </div>

      {/* Message d'erreur GPS */}
      {gpsError && (
        <div className="absolute top-24 right-4 z-[1000] max-w-sm">
          <Card className="border-2 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <p className="text-sm text-red-700 font-medium">{gpsError}</p>
              <button onClick={getUserLocation} className="mt-2 text-xs text-red-600 hover:text-red-800 font-bold underline">
                🔄 Réessayer
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Légende améliorée */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 shadow-xl">
        <h4 className="font-bold text-sm mb-3 text-gray-900">🗺️ Légende</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs text-gray-700 font-medium">Votre position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-xs text-gray-700 font-medium">Urbain ({locations.filter((p) => p.type === "Urban").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-xs text-gray-700 font-medium">Rural ({locations.filter((p) => p.type === "Rural").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-xs text-gray-700 font-medium">Mixte ({locations.filter((p) => p.type === "Mixed").length})</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Total : <strong className="text-gray-900">{locations.length} PPN</strong>
          </p>
        </div>
      </div>

      {/* Badge info */}
      <div className="absolute top-4 left-4 z-[1000] bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl px-4 py-2 shadow-lg">
        <p className="text-xs font-bold">
          🇨🇮 {locations.length} centres à travers la Côte d'Ivoire
        </p>
      </div>
    </div>
  )
}