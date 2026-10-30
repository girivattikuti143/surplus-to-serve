import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  Pin,
  useMap
} from '@vis.gl/react-google-maps';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Play, 
  Pause, 
  RotateCcw, 
  CornerUpRight, 
  CornerUpLeft, 
  ArrowUp, 
  CheckCircle2, 
  Utensils, 
  Building2, 
  ExternalLink,
  X,
  Layers,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Users,
  Compass,
  Bike,
  Key,
  Check,
  AlertCircle
} from 'lucide-react';
import { Donation } from '../types';

declare const google: any;

// Google Maps Route Renderer using Directions / Polyline
const GoogleMapsRouteRenderer: React.FC<{
  deliveries: ActiveFoodDelivery[];
  isFleetMode: boolean;
  selectedDelivery: ActiveFoodDelivery;
}> = ({ deliveries, isFleetMode, selectedDelivery }) => {
  const map = useMap();
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Clean up previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (isFleetMode) {
      deliveries.forEach(del => {
        const poly = new google.maps.Polyline({
          path: del.routeCoordinates.map(c => ({ lat: c[0], lng: c[1] })),
          geodesic: true,
          strokeColor: del.routeColor,
          strokeOpacity: 0.85,
          strokeWeight: 4,
          map,
        });
        polylinesRef.current.push(poly);
      });

      const bounds = new google.maps.LatLngBounds();
      deliveries.forEach(del => {
        bounds.extend({ lat: del.pickupCoords[0], lng: del.pickupCoords[1] });
        bounds.extend({ lat: del.deliveryCoords[0], lng: del.deliveryCoords[1] });
      });
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } else {
      const glowPoly = new google.maps.Polyline({
        path: selectedDelivery.routeCoordinates.map(c => ({ lat: c[0], lng: c[1] })),
        geodesic: true,
        strokeColor: '#047857',
        strokeOpacity: 0.35,
        strokeWeight: 8,
        map,
      });
      polylinesRef.current.push(glowPoly);

      const mainPoly = new google.maps.Polyline({
        path: selectedDelivery.routeCoordinates.map(c => ({ lat: c[0], lng: c[1] })),
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.95,
        strokeWeight: 5,
        map,
      });
      polylinesRef.current.push(mainPoly);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: selectedDelivery.pickupCoords[0], lng: selectedDelivery.pickupCoords[1] });
      bounds.extend({ lat: selectedDelivery.deliveryCoords[0], lng: selectedDelivery.deliveryCoords[1] });
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    }

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, isFleetMode, selectedDelivery, deliveries]);

  return null;
};

export interface ActiveFoodDelivery {
  id: string;
  foodName: string;
  category: string;
  servings: number;
  quantity: string;
  temperatureType: string;
  imageUrl: string;
  donorName: string;
  donorAddress: string;
  pickupCoords: [number, number]; // [lat, lng]
  ngoName: string;
  ngoAddress: string;
  deliveryCoords: [number, number]; // [lat, lng]
  volunteerName: string;
  volunteerPhone: string;
  vehicleType: 'Car' | 'Van' | 'Electric Bike' | 'EV Scooter';
  vehiclePlate: string;
  driverAvatar: string;
  status: 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered';
  routeCoordinates: [number, number][];
  routeColor: string;
  turnByTurn: Array<{ instruction: string; distance: string; icon: 'straight' | 'left' | 'right' | 'arrive' }>;
  estimatedMins: number;
  distanceKm: number;
  speedKmh: number;
}

// 4 Distinct Volunteer Deliveries across Metro City with unique coordinates & food
export const ALL_ACTIVE_DELIVERIES: ActiveFoodDelivery[] = [
  {
    id: 'del_101',
    foodName: 'Catering Buffet Surplus: Rice, Vegetable Curry & Roasted Chicken',
    category: 'Cooked Meals',
    servings: 60,
    quantity: '45 Containers (~60 Servings)',
    temperatureType: 'Hot (Insulated Warmers)',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    donorName: 'Grand Horizon Banquet & Hotel',
    donorAddress: '450 Grand Avenue, Financial District',
    pickupCoords: [34.0537, -118.2512],
    ngoName: 'Hope Harbor Community Kitchen',
    ngoAddress: '124 Hope Street, Downtown East',
    deliveryCoords: [34.0462, -118.2628],
    volunteerName: 'David Chen',
    volunteerPhone: '+1 (555) 901-2345',
    vehicleType: 'Car',
    vehiclePlate: 'CA-88-SF',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'In Transit',
    routeColor: '#059669', // Emerald
    estimatedMins: 9,
    distanceKm: 2.4,
    speedKmh: 34,
    routeCoordinates: [
      [34.0537, -118.2512],
      [34.0528, -118.2525],
      [34.0506, -118.2558],
      [34.0485, -118.2575],
      [34.0465, -118.2592],
      [34.0442, -118.2618],
      [34.0450, -118.2635],
      [34.0462, -118.2628],
    ],
    turnByTurn: [
      { instruction: 'Depart Grand Horizon Kitchen Bay 2 on S Grand Ave', distance: '150 m', icon: 'straight' },
      { instruction: 'Turn right onto W 4th Street', distance: '350 m', icon: 'right' },
      { instruction: 'Turn left onto S Olive Street (Express Corridor)', distance: '1.1 km', icon: 'left' },
      { instruction: 'Turn right onto W 8th Street', distance: '400 m', icon: 'right' },
      { instruction: 'Turn right onto S Hope Street', distance: '250 m', icon: 'right' },
      { instruction: 'Arrived at Hope Harbor Community Kitchen (124 Hope St)', distance: 'Destination', icon: 'arrive' },
    ]
  },
  {
    id: 'del_102',
    foodName: 'Farm Fresh Organic Produce: Apples, Oranges, Spinach & Carrots',
    category: 'Fruits & Veggies',
    servings: 120,
    quantity: '6 Wooden Crates (~95 kg)',
    temperatureType: 'Refrigerated Cold-Storage',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    donorName: 'Organic Harvest Supermarket',
    donorAddress: '710 Greenview Blvd, Northside',
    pickupCoords: [34.0670, -118.2450],
    ngoName: 'Care & Nourish Youth Shelter',
    ngoAddress: '550 Pine Valley Way, South Park',
    deliveryCoords: [34.0320, -118.2710],
    volunteerName: 'Elena Rodriguez',
    volunteerPhone: '+1 (555) 912-3456',
    vehicleType: 'Van',
    vehiclePlate: 'CA-44-VN',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'In Transit',
    routeColor: '#2563eb', // Blue
    estimatedMins: 16,
    distanceKm: 4.8,
    speedKmh: 42,
    routeCoordinates: [
      [34.0670, -118.2450],
      [34.0610, -118.2490],
      [34.0550, -118.2540],
      [34.0480, -118.2600],
      [34.0400, -118.2660],
      [34.0350, -118.2690],
      [34.0320, -118.2710],
    ],
    turnByTurn: [
      { instruction: 'Depart Northside Loading Bay C on Greenview Blvd', distance: '300 m', icon: 'straight' },
      { instruction: 'Merge onto Broadway Southbound Freeway connector', distance: '2.4 km', icon: 'straight' },
      { instruction: 'Take exit 14B toward South Park District', distance: '800 m', icon: 'right' },
      { instruction: 'Turn left onto Pine Valley Way', distance: '600 m', icon: 'left' },
      { instruction: 'Arrive at Care & Nourish Youth Shelter Gate', distance: 'Destination', icon: 'arrive' },
    ]
  },
  {
    id: 'del_103',
    foodName: 'Fresh Baked Artisan Loaves, Baguettes & Whole Wheat Rolls',
    category: 'Bakery & Bread',
    servings: 80,
    quantity: '30 Loaves & 45 Rolls',
    temperatureType: 'Room Temp (Clean Kraft Crates)',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    donorName: 'Artisan Sourdough Bakery',
    donorAddress: '88 Baker St, West End',
    pickupCoords: [34.0410, -118.2750],
    ngoName: 'St. Jude Community Food Pantry',
    ngoAddress: '310 Riverbank Way, East Channel',
    deliveryCoords: [34.0490, -118.2320],
    volunteerName: 'Marcus Lee',
    volunteerPhone: '+1 (555) 923-4567',
    vehicleType: 'Electric Bike',
    vehiclePlate: 'E-BIKE-12',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    status: 'In Transit',
    routeColor: '#f59e0b', // Amber
    estimatedMins: 14,
    distanceKm: 3.9,
    speedKmh: 24,
    routeCoordinates: [
      [34.0410, -118.2750],
      [34.0425, -118.2650],
      [34.0440, -118.2550],
      [34.0460, -118.2450],
      [34.0480, -118.2380],
      [34.0490, -118.2320],
    ],
    turnByTurn: [
      { instruction: 'Exit Baker Street bakery lane onto West End Ave', distance: '200 m', icon: 'straight' },
      { instruction: 'Follow designated cycle priority path eastbound', distance: '1.8 km', icon: 'straight' },
      { instruction: 'Cross Central Bridge over Metro Canal', distance: '750 m', icon: 'straight' },
      { instruction: 'Turn left on Riverbank Way', distance: '400 m', icon: 'left' },
      { instruction: 'Arrive at St. Jude Food Pantry distribution tent', distance: 'Destination', icon: 'arrive' },
    ]
  },
  {
    id: 'del_104',
    foodName: 'Wholesome Dairy Pack: Greek Yogurt, Cheddar Cheese & Fresh Milk',
    category: 'Dairy & Beverages',
    servings: 50,
    quantity: '40 Cartons / Tubs',
    temperatureType: 'Chilled Insulated Cooler',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    donorName: 'Sunrise Metro Cafe & Deli',
    donorAddress: '220 Sunset Blvd, Uptown',
    pickupCoords: [34.0610, -118.2590],
    ngoName: 'Hope Harbor Community Kitchen',
    ngoAddress: '124 Hope Street, Downtown East',
    deliveryCoords: [34.0462, -118.2628],
    volunteerName: 'Priya Patel',
    volunteerPhone: '+1 (555) 934-5678',
    vehicleType: 'EV Scooter',
    vehiclePlate: 'ECO-77',
    driverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    status: 'In Transit',
    routeColor: '#8b5cf6', // Purple
    estimatedMins: 8,
    distanceKm: 1.9,
    speedKmh: 28,
    routeCoordinates: [
      [34.0610, -118.2590],
      [34.0570, -118.2600],
      [34.0520, -118.2610],
      [34.0480, -118.2620],
      [34.0462, -118.2628],
    ],
    turnByTurn: [
      { instruction: 'Depart Sunset Cafe parking bay south on Sunset Blvd', distance: '250 m', icon: 'straight' },
      { instruction: 'Continue south down Figueroa Corridor', distance: '1.1 km', icon: 'straight' },
      { instruction: 'Turn left onto Hope Street', distance: '300 m', icon: 'left' },
      { instruction: 'Arrive at Hope Harbor Kitchen delivery door', distance: 'Destination', icon: 'arrive' },
    ]
  }
];

interface DeliveryTrackingMapProps {
  donation?: Donation | null;
  onClose?: () => void;
  inline?: boolean;
}

export const DeliveryTrackingMap: React.FC<DeliveryTrackingMapProps> = ({ 
  donation, 
  onClose,
  inline = false 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const animatedMarkerRef = useRef<L.Marker | null>(null);

  // View Mode: 'fleet' (show all volunteers & locations) or specific delivery ID
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('fleet');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.35); // 0 to 1
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [activeTurnStep, setActiveTurnStep] = useState<number>(1);

  // Google Maps API Key & Engine State (Configured with user's key)
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      localStorage.getItem('GOOGLE_MAPS_API_KEY') ||
      'AIzaSyAWW209WV-etPTj_hV8BzphPQxbB1smiaY'
    );
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      localStorage.getItem('GOOGLE_MAPS_API_KEY') ||
      'AIzaSyAWW209WV-etPTj_hV8BzphPQxbB1smiaY'
    );
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [engineMode, setEngineMode] = useState<'google' | 'leaflet'>('google');

  const handleSaveApiKey = (newKey: string) => {
    const trimmed = newKey.trim();
    if (trimmed) {
      localStorage.setItem('GOOGLE_MAPS_API_KEY', trimmed);
      setApiKey(trimmed);
      setEngineMode('google');
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowKeyModal(false);
      }, 1200);
    } else {
      localStorage.removeItem('GOOGLE_MAPS_API_KEY');
      setApiKey('');
      setEngineMode('leaflet');
      setShowKeyModal(false);
    }
  };

  // Match active delivery if a specific donation prop was passed
  useEffect(() => {
    if (donation) {
      const match = ALL_ACTIVE_DELIVERIES.find(d => 
        d.id === donation.id || 
        d.donorName === donation.donorName || 
        d.volunteerName === donation.assignedVolunteerName
      );
      if (match) {
        setSelectedDeliveryId(match.id);
      }
    }
  }, [donation]);

  const activeDelivery = ALL_ACTIVE_DELIVERIES.find(d => d.id === selectedDeliveryId) || ALL_ACTIVE_DELIVERIES[0];
  const isFleetMode = selectedDeliveryId === 'fleet';

  // Helper: interpolate GPS coordinate along an array of waypoints
  const getInterpolatedPoint = (coords: [number, number][], prog: number): [number, number] => {
    const totalSegments = coords.length - 1;
    const currentSegmentFloat = prog * totalSegments;
    const index = Math.min(Math.floor(currentSegmentFloat), totalSegments - 1);
    const segmentProgress = currentSegmentFloat - index;

    const p1 = coords[index];
    const p2 = coords[index + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    return [lat, lng];
  };

  // Initialize Leaflet Map (when engineMode is 'leaflet')
  useEffect(() => {
    if (engineMode !== 'leaflet') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [34.0500, -118.2560],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [engineMode]);

  // Update Map Tiles (Map vs Satellite)
  useEffect(() => {
    if (engineMode !== 'leaflet' || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
    }
  }, [mapType, engineMode]);

  // Render Markers & Routes based on selectedDeliveryId (Fleet View vs Single Delivery)
  useEffect(() => {
    if (engineMode !== 'leaflet' || !mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    if (isFleetMode) {
      // 1. FLEET OVERVIEW: Show ALL 4 Volunteers, ALL 4 Donor Pickups, and ALL 4 Shelters!
      const bounds: [number, number][] = [];

      ALL_ACTIVE_DELIVERIES.forEach((del, idx) => {
        bounds.push(del.pickupCoords);
        bounds.push(del.deliveryCoords);

        // A. Donor Pickup Pin
        const donorIcon = L.divIcon({
          className: 'custom-fleet-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background: #15803d; color: white; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 1.5px solid #86efac;">
                🍲 ${del.donorName.split(' ')[0]}: ${del.servings} Servings
              </div>
              <div style="width: 10px; height: 10px; background: #15803d; transform: rotate(45deg); margin-top: -5px; border-right: 1.5px solid #86efac; border-bottom: 1.5px solid #86efac;"></div>
            </div>
          `,
          iconSize: [140, 36],
          iconAnchor: [70, 36]
        });
        const dMarker = L.marker(del.pickupCoords, { icon: donorIcon }).addTo(layer);
        dMarker.on('click', () => setSelectedDeliveryId(del.id));

        // B. NGO Drop-Off Pin
        const ngoIcon = L.divIcon({
          className: 'custom-fleet-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background: #1e3a8a; color: white; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 1.5px solid #93c5fd;">
                🏠 ${del.ngoName.split(' ')[0]} Shelter
              </div>
              <div style="width: 10px; height: 10px; background: #1e3a8a; transform: rotate(45deg); margin-top: -5px; border-right: 1.5px solid #93c5fd; border-bottom: 1.5px solid #93c5fd;"></div>
            </div>
          `,
          iconSize: [140, 36],
          iconAnchor: [70, 36]
        });
        const nMarker = L.marker(del.deliveryCoords, { icon: ngoIcon }).addTo(layer);
        nMarker.on('click', () => setSelectedDeliveryId(del.id));

        // C. Route Polyline
        L.polyline(del.routeCoordinates, {
          color: del.routeColor,
          weight: 4,
          opacity: 0.8,
          dashArray: '6, 6'
        }).addTo(layer);

        // D. Volunteer Moving Vehicle Pin
        const currentCoord = getInterpolatedPoint(del.routeCoordinates, 0.2 + (idx * 0.2));
        const vehicleEmoji = del.vehicleType === 'Van' ? '🚐' : del.vehicleType === 'Car' ? '🚗' : del.vehicleType === 'Electric Bike' ? '🚲' : '🛵';
        const volIcon = L.divIcon({
          className: 'custom-vol-fleet-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background: #0f172a; color: white; padding: 2px 6px; border-radius: 6px; font-size: 9px; font-weight: 800; white-space: nowrap; border: 1.5px solid ${del.routeColor}; box-shadow: 0 2px 6px rgba(0,0,0,0.4); margin-bottom: 2px;">
                ${del.volunteerName} (${del.vehicleType})
              </div>
              <div style="width: 32px; height: 32px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid ${del.routeColor};">
                <span style="font-size: 16px;">${vehicleEmoji}</span>
              </div>
            </div>
          `,
          iconSize: [130, 48],
          iconAnchor: [65, 48]
        });
        const vMarker = L.marker(currentCoord, { icon: volIcon }).addTo(layer);
        vMarker.on('click', () => setSelectedDeliveryId(del.id));
      });

      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    } else {
      // 2. INDIVIDUAL VOLUNTEER DELIVERY VIEW
      const del = activeDelivery;

      // Donor Pin
      const donorIcon = L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #15803d; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #86efac;">
              🍲 Donor: ${del.donorName}
            </div>
            <div style="width: 14px; height: 14px; background: #15803d; transform: rotate(45deg); margin-top: -7px; border-right: 2px solid #86efac; border-bottom: 2px solid #86efac;"></div>
          </div>
        `,
        iconSize: [180, 42],
        iconAnchor: [90, 42]
      });
      L.marker(del.pickupCoords, { icon: donorIcon }).addTo(layer);

      // NGO Pin
      const ngoIcon = L.divIcon({
        className: 'custom-ngo-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #1e3a8a; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #93c5fd;">
              🏠 Shelter: ${del.ngoName}
            </div>
            <div style="width: 14px; height: 14px; background: #1e3a8a; transform: rotate(45deg); margin-top: -7px; border-right: 2px solid #93c5fd; border-bottom: 2px solid #93c5fd;"></div>
          </div>
        `,
        iconSize: [180, 42],
        iconAnchor: [90, 42]
      });
      L.marker(del.deliveryCoords, { icon: ngoIcon }).addTo(layer);

      // Route Glow Backing
      L.polyline(del.routeCoordinates, {
        color: '#1e40af',
        weight: 7,
        opacity: 0.4,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);

      // Active Swiggy Green Route
      L.polyline(del.routeCoordinates, {
        color: '#00E676',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);

      // Animated Rider Marker
      const initialLatLng = getInterpolatedPoint(del.routeCoordinates, progress);
      const vehicleEmoji = del.vehicleType === 'Van' ? '🚐' : del.vehicleType === 'Car' ? '🚗' : del.vehicleType === 'Electric Bike' ? '🚲' : '🛵';
      const riderIcon = L.divIcon({
        className: 'custom-rider-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; background: rgba(5, 150, 105, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 36px; height: 36px; background: #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(0,0,0,0.4); border: 2.5px solid #10b981;">
              <span style="font-size: 18px;">${vehicleEmoji}</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });
      const riderMarker = L.marker(initialLatLng, { icon: riderIcon }).addTo(layer);
      animatedMarkerRef.current = riderMarker;

      map.fitBounds(L.latLngBounds([del.pickupCoords, del.deliveryCoords]), { padding: [60, 60] });
    }
  }, [selectedDeliveryId, activeDelivery, isFleetMode]);

  // Live movement animation loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        setProgress(prev => {
          const stepDelta = delta * 0.035 * speedMultiplier;
          const next = prev + stepDelta;
          if (next >= 1) return 1;
          return next;
        });
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speedMultiplier]);

  // Update animated marker position
  useEffect(() => {
    if (!animatedMarkerRef.current || isFleetMode) return;
    const latLng = getInterpolatedPoint(activeDelivery.routeCoordinates, progress);
    animatedMarkerRef.current.setLatLng(latLng);

    const stepIdx = Math.min(
      Math.floor(progress * activeDelivery.turnByTurn.length),
      activeDelivery.turnByTurn.length - 1
    );
    setActiveTurnStep(stepIdx);
  }, [progress, activeDelivery, isFleetMode]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(activeDelivery.donorAddress)}&destination=${encodeURIComponent(activeDelivery.ngoAddress)}&travelmode=driving`;

  const remainingMins = Math.max(1, Math.round(activeDelivery.estimatedMins * (1 - progress)));
  const remainingDist = Math.max(0.1, (activeDelivery.distanceKm * (1 - progress))).toFixed(1);

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden border border-stone-200 shadow-2xl transition-all bg-white text-stone-900 ${
      inline ? 'w-full h-[660px]' : 'w-full max-w-5xl h-[92vh]'
    }`}>
      
      {/* 1. TOP BAR: FLEET & VOLUNTEER LOCATION SELECTOR */}
      <div className="bg-stone-900 text-white p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5 shrink-0">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Locations & Food Deliveries:</span>
          </span>

          {/* Fleet View Button (Show each location for all) */}
          <button
            onClick={() => setSelectedDeliveryId('fleet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              isFleetMode
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-lime-300" />
            <span>Show All Volunteer Locations (Fleet View)</span>
          </button>

          {/* Distinct Volunteer Deliveries Tabs */}
          {ALL_ACTIVE_DELIVERIES.map(del => (
            <button
              key={del.id}
              onClick={() => {
                setSelectedDeliveryId(del.id);
                setProgress(0.25);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedDeliveryId === del.id
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              <span>{del.volunteerName}</span>
              <span className="text-[10px] opacity-75">({del.category.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Map Engine, Type & Google Maps Key Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Google Maps API Key Button */}
          <button
            onClick={() => {
              setInputKey(apiKey);
              setShowKeyModal(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              apiKey
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/50 hover:bg-amber-900'
            }`}
            title="Configure Google Maps API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'Google Maps: Key Set' : 'Add Google Maps API Key'}</span>
            {apiKey && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>

          {/* Engine Selector if key is present */}
          {apiKey && (
            <div className="bg-stone-800 p-0.5 rounded-lg flex items-center border border-stone-700 text-xs">
              <button
                onClick={() => setEngineMode('google')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${engineMode === 'google' ? 'bg-blue-600 text-white' : 'text-stone-400'}`}
              >
                Google Maps
              </button>
              <button
                onClick={() => setEngineMode('leaflet')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${engineMode === 'leaflet' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
              >
                OSM
              </button>
            </div>
          )}

          {/* Map vs Satellite */}
          <div className="bg-stone-800 p-0.5 rounded-lg flex items-center border border-stone-700 text-xs">
            <button
              onClick={() => setMapType('streets')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold ${mapType === 'streets' ? 'bg-emerald-700 text-white' : 'text-stone-400'}`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold ${mapType === 'satellite' ? 'bg-emerald-700 text-white' : 'text-stone-400'}`}
            >
              Satellite
            </button>
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            title="Open in Google Maps App"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. GOOGLE MAPS API KEY CONFIGURATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Google Maps API Key</h3>
                  <p className="text-xs text-stone-500">Enable Google Maps JavaScript API for live tracking</p>
                </div>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>How to provide your Google Maps API Key:</span>
              </div>
              <p>
                1. <strong>Direct Paste (instant):</strong> Enter your key below and click <em>Save & Activate</em>.
              </p>
              <p>
                2. <strong>Via Environment:</strong> Set in <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-900 font-mono text-[11px]">.env</code>:
              </p>
              <div className="bg-stone-900 text-emerald-400 p-2 rounded-xl font-mono text-[11px] select-all">
                VITE_GOOGLE_MAPS_API_KEY="AIzaSy..."
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Google Maps API Key</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Google Maps API Key saved! Google Maps engine activated.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {apiKey ? (
                <button
                  type="button"
                  onClick={() => handleSaveApiKey('')}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear Key
                </button>
              ) : (
                <span className="text-xs text-stone-400">No key active</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveApiKey(inputKey)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Save & Activate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LIVE ETA / STATUS OVERLAY (When a specific food delivery is tracked) */}
      {!isFleetMode && (
        <div className="absolute top-16 left-4 z-400 max-w-sm w-full pointer-events-none">
          <div className="pointer-events-auto bg-stone-900/95 text-white p-3 rounded-2xl shadow-2xl border border-stone-800 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Food Cargo: {activeDelivery.servings} Servings
              </span>
              <span className="text-stone-400">ETA: {remainingMins} mins ({remainingDist} km)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-stone-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                {activeDelivery.turnByTurn[activeTurnStep]?.icon === 'left' ? (
                  <CornerUpLeft className="w-4 h-4" />
                ) : activeDelivery.turnByTurn[activeTurnStep]?.icon === 'right' ? (
                  <CornerUpRight className="w-4 h-4" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">
                {activeDelivery.turnByTurn[activeTurnStep]?.instruction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SIMULATION CONTROLS */}
      {!isFleetMode && (
        <div className="absolute top-16 right-4 z-400 flex flex-col gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xl transition flex items-center justify-center cursor-pointer"
            title={isPlaying ? 'Pause Movement' : 'Resume Live Movement'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={() => {
              const nextSpeed = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1;
              setSpeedMultiplier(nextSpeed);
            }}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
            title="Simulation Speed"
          >
            <span>{speedMultiplier}x</span>
          </button>

          <button
            onClick={() => setProgress(0)}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 shadow-xl transition flex items-center justify-center cursor-pointer"
            title="Restart Route"
          >
            <RotateCcw className="w-4 h-4 text-sky-600" />
          </button>
        </div>
      )}

      {/* 5. MAP CANVAS: GOOGLE MAPS (when key active) OR LEAFLET (built-in fallback) */}
      {engineMode === 'google' && apiKey ? (
        <div className="w-full flex-1 z-10 relative" style={{ minHeight: '340px' }}>
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              style={{ width: '100%', height: '100%', minHeight: '340px' }}
              defaultCenter={{ lat: 34.0500, lng: -118.2560 }}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              mapTypeId={mapType === 'satellite' ? 'hybrid' : 'roadmap'}
              disableDefaultUI={false}
            >
              <GoogleMapsRouteRenderer 
                deliveries={ALL_ACTIVE_DELIVERIES} 
                isFleetMode={isFleetMode} 
                selectedDelivery={activeDelivery} 
              />

              {/* Markers */}
              {isFleetMode ? (
                ALL_ACTIVE_DELIVERIES.map((del, idx) => {
                  const volPos = getInterpolatedPoint(del.routeCoordinates, 0.2 + (idx * 0.2));
                  const vehicleEmoji = del.vehicleType === 'Van' ? '🚐' : del.vehicleType === 'Car' ? '🚗' : del.vehicleType === 'Electric Bike' ? '🚲' : '🛵';
                  return (
                    <React.Fragment key={del.id}>
                      <AdvancedMarker 
                        position={{ lat: del.pickupCoords[0], lng: del.pickupCoords[1] }} 
                        onClick={() => setSelectedDeliveryId(del.id)}
                      >
                        <div className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg border border-emerald-300 flex items-center gap-1 cursor-pointer">
                          <span>🍲 {del.donorName.split(' ')[0]}</span>
                        </div>
                      </AdvancedMarker>
                      <AdvancedMarker 
                        position={{ lat: del.deliveryCoords[0], lng: del.deliveryCoords[1] }} 
                        onClick={() => setSelectedDeliveryId(del.id)}
                      >
                        <div className="bg-blue-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg border border-blue-300 flex items-center gap-1 cursor-pointer">
                          <span>🏠 {del.ngoName.split(' ')[0]}</span>
                        </div>
                      </AdvancedMarker>
                      <AdvancedMarker 
                        position={{ lat: volPos[0], lng: volPos[1] }} 
                        onClick={() => setSelectedDeliveryId(del.id)}
                      >
                        <div className="bg-stone-900 border-2 border-emerald-400 p-1.5 rounded-full shadow-lg flex items-center justify-center text-sm cursor-pointer">
                          {vehicleEmoji}
                        </div>
                      </AdvancedMarker>
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  <AdvancedMarker position={{ lat: activeDelivery.pickupCoords[0], lng: activeDelivery.pickupCoords[1] }}>
                    <div className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg border-2 border-emerald-300 flex items-center gap-1">
                      <span>🍲 Donor: {activeDelivery.donorName}</span>
                    </div>
                  </AdvancedMarker>
                  <AdvancedMarker position={{ lat: activeDelivery.deliveryCoords[0], lng: activeDelivery.deliveryCoords[1] }}>
                    <div className="bg-blue-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg border-2 border-blue-300 flex items-center gap-1">
                      <span>🏠 Shelter: {activeDelivery.ngoName}</span>
                    </div>
                  </AdvancedMarker>
                  {(() => {
                    const riderCoord = getInterpolatedPoint(activeDelivery.routeCoordinates, progress);
                    const vehicleEmoji = activeDelivery.vehicleType === 'Van' ? '🚐' : activeDelivery.vehicleType === 'Car' ? '🚗' : activeDelivery.vehicleType === 'Electric Bike' ? '🚲' : '🛵';
                    return (
                      <AdvancedMarker position={{ lat: riderCoord[0], lng: riderCoord[1] }}>
                        <div className="relative flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-stone-900 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-lg animate-pulse">
                            {vehicleEmoji}
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })()}
                </>
              )}
            </GoogleMap>
          </APIProvider>
        </div>
      ) : (
        <div 
          ref={mapContainerRef} 
          className="w-full flex-1 z-10"
          style={{ minHeight: '340px' }}
        />
      )}

      {/* 5. BOTTOM DRAWER: DETAILS OF DELIVERING FOOD & VOLUNTEER LOCATIONS */}
      <div className="bg-white border-t border-stone-200 p-4 sm:p-5 z-20 space-y-3 shadow-lg">
        {isFleetMode ? (
          /* FLEET VIEW: Summary of All 4 Active Deliveries */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Active Volunteer Fleet Locations ({ALL_ACTIVE_DELIVERIES.length} Deliveries Across Metro City)
              </span>
              <span className="text-emerald-700 font-semibold text-[11px]">
                Click any volunteer to inspect live turn-by-turn route
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ALL_ACTIVE_DELIVERIES.map(del => (
                <div
                  key={del.id}
                  onClick={() => {
                    setSelectedDeliveryId(del.id);
                    setProgress(0.25);
                  }}
                  className="p-3 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-emerald-50/50 hover:border-emerald-400 transition cursor-pointer space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{del.volunteerName}</span>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-bold">
                      {del.vehicleType}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-800 line-clamp-1">
                    🍲 {del.foodName}
                  </p>
                  <div className="text-[10px] text-stone-500 space-y-0.5">
                    <p className="truncate"><strong>From:</strong> {del.donorName}</p>
                    <p className="truncate"><strong>To:</strong> {del.ngoName}</p>
                  </div>
                  <div className="pt-1 border-t border-stone-200 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                    <span>{del.servings} Servings</span>
                    <span>~{del.estimatedMins} mins ETA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SINGLE DELIVERY VIEW: Food & Driver Profile */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Driver Profile */}
            <div className="md:col-span-5 bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeDelivery.driverAvatar}
                  alt={activeDelivery.volunteerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-stone-900">{activeDelivery.volunteerName}</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      4.9 ★
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Vehicle: {activeDelivery.vehicleType} • Plate: {activeDelivery.vehiclePlate}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Food Rescue Volunteer Pilot
                  </span>
                </div>
              </div>

              <a
                href={`tel:${activeDelivery.volunteerPhone}`}
                className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm flex items-center gap-1 text-xs font-bold shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>

            {/* Food Cargo & Locations Connected */}
            <div className="md:col-span-7 bg-stone-50 rounded-2xl p-3 border border-stone-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                  Delivering Food:
                </span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded font-semibold text-[10px]">
                  {activeDelivery.temperatureType}
                </span>
              </div>
              <p className="text-stone-800 font-medium text-xs line-clamp-1">{activeDelivery.foodName} ({activeDelivery.servings} Servings)</p>

              <div className="pt-1.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                <span className="truncate">
                  <strong>Pickup:</strong> {activeDelivery.donorName}
                </span>
                <span className="truncate">
                  <strong>Drop-off:</strong> {activeDelivery.ngoName}
                </span>
                <span className="text-emerald-700 font-bold shrink-0">
                  Speed: {activeDelivery.speedKmh} km/h
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
