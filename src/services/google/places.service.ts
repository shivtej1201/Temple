import { prisma } from '@/lib/db/prisma';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.GOOGLE_PLACES_API_KEY;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': GOOGLE_API_KEY || '',
  'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
};

/**
 * Standardized temple response format expected by our frontend
 */
export interface StandardTempleResponse {
  id: string;
  name: string;
  slug: string | null;
  deity?: { name: string };
  location: {
    city?: string;
    district?: string;
    state?: string;
    latitude: number;
    longitude: number;
  };
  address: string;
  image?: { url: string; source: string };
  rating?: number;
  ratingCount?: number;
  googlePlaceId: string;
  isMajor: boolean;
  verificationStatus: string;
  isVIPDarshanAvailable?: boolean;
}

/**
 * Maps a Google Place API response + Local Temple DB match to the standard format
 */
export function mapToStandardTempleResponse(place: any, localTemple: any | null): StandardTempleResponse {
  // Use a reliable neutral placeholder if no images exist.
  // We NEVER display unrelated temple images.
  const NEUTRAL_PLACEHOLDER = "https://images.unsplash.com/photo-1542868727-4bb3342eb6f5?auto=format&fit=crop&q=80&w=800";
  
  let imageUrl = NEUTRAL_PLACEHOLDER;
  let imageSource = "Placeholder";

  if (place.photos && place.photos.length > 0) {
    imageUrl = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=800&maxWidthPx=800&key=${GOOGLE_API_KEY}`;
    imageSource = place.photos[0].authorAttributions?.[0]?.displayName || "Google Maps";
  }

  return {
    id: localTemple?.id || place.id,
    name: localTemple?.name || place.displayName?.text || 'Unknown Temple',
    slug: localTemple?.slug || `p_${place.id}`,
    deity: localTemple?.primaryDeity ? { name: localTemple.primaryDeity.name } : undefined,
    location: {
      latitude: place.location?.latitude || localTemple?.latitude || 0,
      longitude: place.location?.longitude || localTemple?.longitude || 0,
    },
    address: place.formattedAddress || 'Address not available',
    image: { url: imageUrl, source: imageSource },
    rating: place.rating,
    ratingCount: place.userRatingCount,
    googlePlaceId: place.id,
    isMajor: localTemple?.isMajor || false,
    verificationStatus: localTemple?.isVerified ? "VERIFIED" : "DISCOVERED",
    isVIPDarshanAvailable: localTemple?.vipDarshanAvailable || false
  };
}

export const GooglePlacesService = {
  async searchTemples(query: string) {
    if (!GOOGLE_API_KEY) return [];

    const res = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos'
      },
      body: JSON.stringify({
        textQuery: `${query} Hindu temple`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Places API error');

    const places = data.places || [];
    
    return Promise.all(places.map(async (place: any) => {
      const localTemple = await prisma.temple.findFirst({
        where: { googlePlaceId: place.id },
        include: { primaryDeity: true }
      });
      return mapToStandardTempleResponse(place, localTemple);
    }));
  },

  async findNearbyTemples(lat: number, lng: number, radiusMeters: number = 10000) {
    if (!GOOGLE_API_KEY) return [];

    const res = await fetch(`https://places.googleapis.com/v1/places:searchNearby`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos'
      },
      body: JSON.stringify({
        includedTypes: ['hindu_temple'],
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters <= 50000 ? radiusMeters : 50000
          }
        },
        maxResultCount: 20
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Places API error');

    const places = data.places || [];
    
    return Promise.all(places.map(async (place: any) => {
      const localTemple = await prisma.temple.findFirst({
        where: { googlePlaceId: place.id },
        include: { primaryDeity: true }
      });
      return mapToStandardTempleResponse(place, localTemple);
    }));
  },

  async searchAlongRoute(encodedPolyline: string) {
    if (!GOOGLE_API_KEY) return [];

    const res = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos'
      },
      body: JSON.stringify({
        textQuery: "Hindu temple",
        searchAlongRouteParameters: {
          polyline: { encodedPolyline }
        }
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Places API error');

    const places = data.places || [];
    
    return Promise.all(places.map(async (place: any) => {
      const localTemple = await prisma.temple.findFirst({
        where: { googlePlaceId: place.id },
        include: { primaryDeity: true }
      });
      return mapToStandardTempleResponse(place, localTemple);
    }));
  },

  async getPlaceDetails(slugOrId: string) {
    // if (!GOOGLE_API_KEY) throw new Error("Google Maps API Key is missing");

    const isPlaceId = slugOrId.startsWith('p_') || !slugOrId.includes('-');
    let lookupId = slugOrId.replace('p_', '');

    let localTemple = await prisma.temple.findFirst({
      where: isPlaceId ? { googlePlaceId: lookupId } : { slug: lookupId },
      include: { 
        primaryDeity: true,
        region: true,
        city: true,
        darshans: { where: { isActive: true } },
        festivals: { include: { festival: true } },
        events: true,
        deities: { include: { deity: true } }
      }
    });

    const placeIdToFetch = localTemple?.googlePlaceId || lookupId;

    let googleData: any = null;
    if (GOOGLE_API_KEY) {
      try {
        const res = await fetch(`https://places.googleapis.com/v1/places/${placeIdToFetch}`, {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,userRatingCount,photos,regularOpeningHours,internationalPhoneNumber,websiteUri'
          }
        });
        if (res.ok) {
          googleData = await res.json();
        } else {
          const error = await res.json();
          console.warn("Failed to fetch Google Places data:", error);
        }
      } catch (err) {
        console.warn("Failed to fetch Google Places data:", err);
      }
    }

    // If neither exists, it's a 404
    if (!localTemple && !googleData) {
      return null;
    }

    const standardResponse = mapToStandardTempleResponse(googleData || { id: placeIdToFetch }, localTemple);

    return {
      ...standardResponse,
      localTempleData: localTemple, // Include rich local relational data
      regularOpeningHours: googleData?.regularOpeningHours,
      internationalPhoneNumber: googleData?.internationalPhoneNumber,
      websiteUri: googleData?.websiteUri
    };
  }
};
