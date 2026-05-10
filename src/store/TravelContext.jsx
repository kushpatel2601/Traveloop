import { createContext, useContext, useReducer, useEffect } from 'react';

const CITIES_DB = [
  { id: 'c1', name: 'Paris', country: 'France', region: 'Europe', costIndex: 4, popularity: 95, image: '🗼', description: 'City of Light, romance, and world-class cuisine', lat: 48.8566, lng: 2.3522, tags: ['Historical', 'Culinary'] },
  { id: 'c2', name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 4, popularity: 92, image: '🏯', description: 'A fusion of ultramodern and traditional culture', lat: 35.6762, lng: 139.6503, tags: ['Adventure', 'Culinary', 'Nightlife'] },
  { id: 'c3', name: 'New York', country: 'USA', region: 'North America', costIndex: 5, popularity: 93, image: '🗽', description: 'The city that never sleeps', lat: 40.7128, lng: -74.006, tags: ['Nightlife', 'SoloTravel'] },
  { id: 'c4', name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 2, popularity: 88, image: '🏝️', description: 'Tropical paradise with ancient temples', lat: -8.3405, lng: 115.092, tags: ['BeachVibes', 'Nature', 'Relaxation'] },
  { id: 'c5', name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 3, popularity: 87, image: '⛪', description: 'Gaudí architecture meets Mediterranean vibes', lat: 41.3874, lng: 2.1686, tags: ['Historical', 'BeachVibes'] },
  { id: 'c6', name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 5, popularity: 85, image: '🏙️', description: 'Futuristic skyline and luxury experiences', lat: 25.2048, lng: 55.2708, tags: ['Adventure', 'Nightlife'] },
  { id: 'c7', name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 3, popularity: 90, image: '🏛️', description: 'Eternal city of history and art', lat: 41.9028, lng: 12.4964, tags: ['Historical', 'Culinary'] },
  { id: 'c8', name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 1, popularity: 86, image: '🛕', description: 'Street food capital with golden temples', lat: 13.7563, lng: 100.5018, tags: ['Culinary', 'Nightlife'] },
  { id: 'c9', name: 'London', country: 'UK', region: 'Europe', costIndex: 5, popularity: 91, image: '🎡', description: 'Historic charm meets modern energy', lat: 51.5074, lng: -0.1278, tags: ['Historical', 'SoloTravel'] },
  { id: 'c10', name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 4, popularity: 84, image: '🏖️', description: 'Stunning harbors and beaches', lat: -33.8688, lng: 151.2093, tags: ['BeachVibes', 'Adventure'] },
  { id: 'c11', name: 'Istanbul', country: 'Turkey', region: 'Europe', costIndex: 2, popularity: 83, image: '🕌', description: 'Where East meets West', lat: 41.0082, lng: 28.9784, tags: ['Historical', 'Culinary'] },
  { id: 'c12', name: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 2, popularity: 78, image: '🏜️', description: 'Vibrant souks and desert charm', lat: 31.6295, lng: -7.9811, tags: ['Historical', 'Adventure'] },
  { id: 'c13', name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 3, popularity: 82, image: '⛩️', description: 'Ancient capital of temples and geishas', lat: 35.0116, lng: 135.7681, tags: ['Historical', 'Nature'] },
  { id: 'c14', name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 2, popularity: 80, image: '🏔️', description: 'Where mountains meet the ocean', lat: -33.9249, lng: 18.4241, tags: ['Nature', 'Adventure'] },
  { id: 'c15', name: 'Lisbon', country: 'Portugal', region: 'Europe', costIndex: 2, popularity: 81, image: '🚃', description: 'Hilly coastal city with pastel buildings', lat: 38.7223, lng: -9.1393, tags: ['Historical', 'BeachVibes'] },
  { id: 'c16', name: 'Mumbai', country: 'India', region: 'Asia', costIndex: 1, popularity: 79, image: '🌆', description: 'Bollywood dreams and bustling streets', lat: 19.076, lng: 72.8777, tags: ['Culinary', 'Nightlife'] },
  { id: 'c17', name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 4, popularity: 86, image: '🌅', description: 'Iconic sunsets and white-washed villages', lat: 36.3932, lng: 25.4615, tags: ['BeachVibes', 'Relaxation'] },
  { id: 'c18', name: 'Cusco', country: 'Peru', region: 'South America', costIndex: 1, popularity: 77, image: '🏔️', description: 'Gateway to Machu Picchu', lat: -13.532, lng: -71.9675, tags: ['Historical', 'Nature', 'Adventure'] },
];

const ACTIVITIES_DB = [
  { id: 'a1', name: 'City Walking Tour', type: 'Sightseeing', cost: 25, duration: 3, physicalActivity: 'Medium', cityIds: ['c1','c3','c5','c7','c9'], description: 'Explore landmarks with a local guide', image: '🚶' },
  { id: 'a2', name: 'Food Tasting Tour', type: 'Food', cost: 60, duration: 3, physicalActivity: 'Low', cityIds: ['c1','c2','c5','c7','c8'], description: 'Sample local delicacies and street food', image: '🍜' },
  { id: 'a3', name: 'Museum Visit', type: 'Culture', cost: 20, duration: 2, physicalActivity: 'Low', cityIds: ['c1','c3','c7','c9','c2'], description: 'Discover art and history collections', image: '🖼️' },
  { id: 'a4', name: 'Scuba Diving', type: 'Adventure', cost: 120, duration: 4, physicalActivity: 'High', cityIds: ['c4','c10','c17'], description: 'Explore underwater coral reefs', image: '🤿' },
  { id: 'a5', name: 'Temple Visit', type: 'Culture', cost: 10, duration: 2, physicalActivity: 'Low', cityIds: ['c2','c4','c8','c13'], description: 'Visit ancient temples and shrines', image: '🛕' },
  { id: 'a6', name: 'Desert Safari', type: 'Adventure', cost: 80, duration: 5, physicalActivity: 'High', cityIds: ['c6','c12'], description: 'Thrilling dune bashing and camel rides', image: '🐪' },
  { id: 'a7', name: 'Sunset Cruise', type: 'Relaxation', cost: 90, duration: 3, physicalActivity: 'Low', cityIds: ['c4','c10','c17','c14'], description: 'Watch the sunset from the water', image: '⛵' },
  { id: 'a8', name: 'Cooking Class', type: 'Food', cost: 55, duration: 3, physicalActivity: 'Low', cityIds: ['c1','c5','c7','c8','c2'], description: 'Learn to cook traditional dishes', image: '👨‍🍳' },
  { id: 'a9', name: 'Hiking Trail', type: 'Adventure', cost: 15, duration: 5, physicalActivity: 'High', cityIds: ['c4','c14','c18','c10'], description: 'Trek through stunning landscapes', image: '🥾' },
  { id: 'a10', name: 'Spa & Wellness', type: 'Relaxation', cost: 100, duration: 3, physicalActivity: 'Low', cityIds: ['c4','c6','c2','c8'], description: 'Rejuvenate with traditional treatments', image: '🧖' },
  { id: 'a11', name: 'Night Market Tour', type: 'Food', cost: 30, duration: 2, physicalActivity: 'Medium', cityIds: ['c2','c8','c16','c11'], description: 'Street food under the stars', image: '🌃' },
  { id: 'a12', name: 'Art Gallery Hopping', type: 'Culture', cost: 35, duration: 3, physicalActivity: 'Low', cityIds: ['c1','c3','c9','c15'], description: 'Contemporary and classic art', image: '🎨' },
  { id: 'a13', name: 'Surfing Lesson', type: 'Adventure', cost: 70, duration: 3, physicalActivity: 'High', cityIds: ['c4','c10','c15','c14'], description: 'Catch waves with expert instructors', image: '🏄' },
  { id: 'a14', name: 'Wine Tasting', type: 'Food', cost: 65, duration: 2, physicalActivity: 'Low', cityIds: ['c1','c5','c7','c14','c15'], description: 'Sample regional wines', image: '🍷' },
  { id: 'a15', name: 'Historical Tour', type: 'Sightseeing', cost: 30, duration: 4, physicalActivity: 'Medium', cityIds: ['c7','c11','c18','c13'], description: 'Walk through centuries of history', image: '🏰' },
  { id: 'a16', name: 'Shopping Experience', type: 'Sightseeing', cost: 0, duration: 3, physicalActivity: 'Low', cityIds: ['c3','c6','c2','c11','c12'], description: 'From luxury malls to local bazaars', image: '🛍️' },
];

const DEFAULT_PACKING = [
  { id: 'p1', text: 'Passport & ID', category: 'Documents', checked: false },
  { id: 'p2', text: 'Travel Insurance', category: 'Documents', checked: false },
  { id: 'p3', text: 'Phone Charger', category: 'Electronics', checked: false },
  { id: 'p4', text: 'Power Adapter', category: 'Electronics', checked: false },
  { id: 'p5', text: 'Sunscreen', category: 'Toiletries', checked: false },
  { id: 'p6', text: 'Comfortable Shoes', category: 'Clothing', checked: false },
  { id: 'p7', text: 'Rain Jacket', category: 'Clothing', checked: false },
  { id: 'p8', text: 'First Aid Kit', category: 'Health', checked: false },
  { id: 'p9', text: 'Water Bottle', category: 'Essentials', checked: false },
  { id: 'p10', text: 'Camera', category: 'Electronics', checked: false },
];

const initialState = {
  user: null,
  trips: [],
  cities: CITIES_DB,
  activities: ACTIVITIES_DB,
  communityPosts: [
    { id: 'cp1', userId: 'demo', userName: 'Alex Traveler', avatar: '🧑‍✈️', tripName: 'European Dream', description: 'Amazing 2-week journey through Paris, Rome, and Barcelona!', cities: ['Paris', 'Rome', 'Barcelona'], likes: 42, comments: 8, createdAt: '2026-04-15' },
    { id: 'cp2', userId: 'demo2', userName: 'Maya Explorer', avatar: '👩‍🦱', tripName: 'Asian Adventure', description: 'Temples, street food, and incredible sunsets across Asia.', cities: ['Tokyo', 'Bangkok', 'Bali'], likes: 38, comments: 12, createdAt: '2026-04-20' },
    { id: 'cp3', userId: 'demo3', userName: 'Sam Wanderer', avatar: '🧔', tripName: 'African Safari', description: 'From Cape Town to Marrakech - a journey of a lifetime!', cities: ['Cape Town', 'Marrakech'], likes: 55, comments: 15, createdAt: '2026-05-01' },
  ],
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SIGNUP':
      return { ...state, user: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'CREATE_TRIP': {
      const newTrip = { ...action.payload, id: generateId(), stops: [], packingList: DEFAULT_PACKING.map(p => ({ ...p, id: generateId() })), notes: [], createdAt: new Date().toISOString() };
      return { ...state, trips: [...state.trips, newTrip] };
    }
    case 'UPDATE_TRIP': {
      return { ...state, trips: state.trips.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    }
    case 'DELETE_TRIP':
      return { ...state, trips: state.trips.filter(t => t.id !== action.payload) };
    case 'ADD_STOP': {
      const { tripId, stop } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === tripId ? { ...t, stops: [...t.stops, { ...stop, id: generateId(), activities: [] }] } : t) };
    }
    case 'REMOVE_STOP': {
      const { tripId: tid, stopId } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === tid ? { ...t, stops: t.stops.filter(s => s.id !== stopId) } : t) };
    }
    case 'REORDER_STOPS': {
      const { tripId: rtid, stops: newStops } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === rtid ? { ...t, stops: newStops } : t) };
    }
    case 'ADD_ACTIVITY_TO_STOP': {
      const { tripId: atid, stopId: asid, activity, dayIndex } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === atid ? { ...t, stops: t.stops.map(s => s.id === asid ? { ...s, activities: [...(s.activities || []), { ...activity, instanceId: generateId(), dayIndex: dayIndex || 0 }] } : s) } : t) };
    }
    case 'UPDATE_TRIP_BUDGET': {
      const { tripId: btid, budget, categoryCosts } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === btid ? { ...t, budget, categoryCosts } : t) };
    }
    case 'REMOVE_ACTIVITY_FROM_STOP': {
      const { tripId: ratid, stopId: rasid, instanceId } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === ratid ? { ...t, stops: t.stops.map(s => s.id === rasid ? { ...s, activities: s.activities.filter(a => a.instanceId !== instanceId) } : s) } : t) };
    }
    case 'TOGGLE_PACKING_ITEM': {
      const { tripId: ptid, itemId } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === ptid ? { ...t, packingList: t.packingList.map(p => p.id === itemId ? { ...p, checked: !p.checked } : p) } : t) };
    }
    case 'ADD_PACKING_ITEM': {
      const { tripId: aptid, item } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === aptid ? { ...t, packingList: [...t.packingList, { ...item, id: generateId(), checked: false }] } : t) };
    }
    case 'REMOVE_PACKING_ITEM': {
      const { tripId: rptid, itemId: rpid } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === rptid ? { ...t, packingList: t.packingList.filter(p => p.id !== rpid) } : t) };
    }
    case 'ADD_NOTE': {
      const { tripId: ntid, note } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === ntid ? { ...t, notes: [...(t.notes || []), { ...note, id: generateId(), createdAt: new Date().toISOString() }] } : t) };
    }
    case 'DELETE_NOTE': {
      const { tripId: dntid, noteId } = action.payload;
      return { ...state, trips: state.trips.map(t => t.id === dntid ? { ...t, notes: (t.notes || []).filter(n => n.id !== noteId) } : t) };
    }
    case 'ADD_COMMUNITY_POST': {
      return { ...state, communityPosts: [{ ...action.payload, id: generateId(), likes: 0, comments: 0, createdAt: new Date().toISOString().split('T')[0] }, ...state.communityPosts] };
    }
    case 'LIKE_POST': {
      return { ...state, communityPosts: state.communityPosts.map(p => p.id === action.payload ? { ...p, likes: p.likes + 1 } : p) };
    }
    default:
      return state;
  }
}

const TravelContext = createContext();

export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('traveloop_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, cities: CITIES_DB, activities: ACTIVITIES_DB };
      }
    } catch (e) { /* ignore */ }
    return init;
  });

  useEffect(() => {
    const { cities, activities, ...toSave } = state;
    localStorage.setItem('traveloop_state', JSON.stringify(toSave));
  }, [state]);

  return <TravelContext.Provider value={{ state, dispatch }}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be inside TravelProvider');
  return ctx;
}

export { CITIES_DB, ACTIVITIES_DB };
