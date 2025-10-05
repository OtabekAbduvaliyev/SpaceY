export interface SpaceYEvent {
  id: string;
  title: string;
  date: string;
  type: 'eclipse' | 'meteor' | 'comet' | 'planetary' | 'aurora' | 'launch' | 'conjunction' | 'opposition';
  description: string;
  image: string;
  images: string[];
  visibility: {
    rating: number;
    conditions: string;
    bestTime: string;
    duration: string;
  };
  location: {
    name: string;
    coordinates: string;
    hemisphere: 'northern' | 'southern' | 'global';
    timezone: string;
  };
  scientific: {
    magnitude?: number;
    distance?: string;
    size?: string;
    speed?: string;
    phase?: string;
  };
  isUpcoming: boolean;
}

// In-memory list (dev-only). Import this from GET and POST handlers.
export let SpaceYEvents: SpaceYEvent[] = [
  // UPCOMING EVENTS (10) - All after 10/5/2025
  {
    id: 'upcoming-11',
    title: 'Venus-Jupiter Conjunction',
    date: '2026-07-21',
    type: 'conjunction',
    description: 'Venus and Jupiter will appear extremely close in the evening sky, separated by just 0.3 degrees. This is one of the most spectacular planetary conjunctions of the year.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Clear western horizon',
      bestTime: '30 minutes after sunset',
      duration: '1-2 hours'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -2.1,
      distance: 'Venus: 0.7 AU, Jupiter: 5.2 AU',
      size: 'Venus: 12.6", Jupiter: 33.4"',
      speed: 'Venus: 35.0 km/s, Jupiter: 13.1 km/s'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-1',
    title: 'Total Solar Eclipse 2025',
    date: '2025-10-15',
    type: 'eclipse',
    description: 'A spectacular total solar eclipse crossing North America from Mexico through the United States and Canada. The Moon will completely block the Sun, creating a breathtaking celestial phenomenon.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Perfect viewing conditions expected',
      bestTime: '18:20 UTC',
      duration: '4 minutes 28 seconds'
    },
    location: {
      name: 'North America',
      coordinates: '40.7128° N, 74.0060° W',
      hemisphere: 'northern',
      timezone: 'UTC-5 to UTC-8'
    },
    scientific: {
      magnitude: 1.057,
      distance: '149.6 million km',
      size: 'Moon appears 5.2% larger than Sun',
      speed: '1,670 km/h shadow speed'
    },
    isUpcoming: true
  },
  {
    id: 'passed-4',
    title: 'Jupiter Impact 1994',
    date: '1994-07-16',
    type: 'planetary',
    description: 'Comet Shoemaker-Levy 9 collided with Jupiter, creating massive fireballs visible from Earth. This was the first observed collision between two solar system bodies.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 4,
      conditions: 'Telescope required',
      bestTime: 'All night',
      duration: '6 days'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 0.0,
      distance: '5.2 AU from Earth',
      size: 'Impact scars 12,000 km across',
      speed: '60 km/s impact velocity'
    },
    isUpcoming: false
  },
  {
    id: 'upcoming-2',
    title: 'Perseids Meteor Shower Peak',
    date: '2025-11-20',
    type: 'meteor',
    description: 'One of the most spectacular meteor showers of the year, with up to 100 meteors per hour at peak. The Perseids are known for their bright, fast meteors and long trails.',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 4,
      conditions: 'Dark sky required for best viewing',
      bestTime: '21:00 - 05:00 local time',
      duration: 'All night'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 2.2,
      distance: 'Comet Swift-Tuttle debris',
      size: 'Dust particles 1-10mm',
      speed: '59 km/s'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-3',
    title: 'Jupiter Opposition',
    date: '2025-12-10',
    type: 'planetary',
    description: 'Jupiter reaches opposition, appearing at its largest and brightest in the night sky. Perfect for telescope observation of its moons and Great Red Spot.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Excellent viewing with telescope',
      bestTime: 'All night',
      duration: 'Several months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -2.9,
      distance: '4.2 AU from Earth',
      size: '49.9 arcseconds apparent diameter',
      speed: '13.1 km/s orbital speed'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-4',
    title: 'Comet C/2025 A3 (Tsuchinshan-ATLAS)',
    date: '2026-01-15',
    type: 'comet',
    description: 'A newly discovered comet that may become visible to the naked eye. This comet is expected to reach magnitude 0.5, making it one of the brightest comets in recent years.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 3,
      conditions: 'Binoculars recommended',
      bestTime: 'Pre-dawn hours',
      duration: 'Several weeks'
    },
    location: {
      name: 'Northern Hemisphere',
      coordinates: 'Northern latitudes',
      hemisphere: 'northern',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 0.5,
      distance: '0.39 AU from Earth',
      size: 'Estimated 1-2 km nucleus',
      speed: '42.1 km/s'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-5',
    title: 'Aurora Borealis Display',
    date: '2026-02-20',
    type: 'aurora',
    description: 'Enhanced aurora activity expected due to increased solar wind. The Northern Lights may be visible as far south as New York and London.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 4,
      conditions: 'Clear skies, away from city lights',
      bestTime: '22:00 - 02:00 local time',
      duration: '4-6 hours'
    },
    location: {
      name: 'Northern Latitudes',
      coordinates: 'Above 45° N',
      hemisphere: 'northern',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 6.0,
      distance: '80-1000 km altitude',
      size: 'Can span thousands of kilometers',
      speed: 'Solar wind: 400-800 km/s'
    },
    isUpcoming: true
  },

  {
    id: 'upcoming-7',
    title: 'Gemini Meteor Shower',
    date: '2026-04-30',
    type: 'meteor',
    description: 'The Geminids are known for their bright, colorful meteors. This shower produces up to 120 meteors per hour at peak, with many fireballs.',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 4,
      conditions: 'Dark sky location preferred',
      bestTime: '02:00 local time',
      duration: 'All night'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 2.6,
      distance: 'Asteroid 3200 Phaethon debris',
      size: 'Dust particles 1-5mm',
      speed: '35 km/s'
    },
    isUpcoming: true
  },
  {
    id: 'passed-10',
    title: 'Great Conjunction 2020',
    date: '2020-12-21',
    type: 'conjunction',
    description: 'Jupiter and Saturn appeared closer together than they had in 800 years, separated by just 0.1 degrees. This rare event was dubbed the "Christmas Star".',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Clear western horizon',
      bestTime: '30 minutes after sunset',
      duration: '1-2 hours'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -1.0,
      distance: 'Jupiter: 5.2 AU, Saturn: 10.1 AU',
      size: 'Jupiter: 33.4", Saturn: 15.1"',
      speed: 'Jupiter: 13.1 km/s, Saturn: 9.7 km/s'
    },
    isUpcoming: false
  },
  {
    id: 'upcoming-8',
    title: 'Mars Opposition',
    date: '2026-05-15',
    type: 'opposition',
    description: 'Mars reaches opposition, appearing larger and brighter than usual. The Red Planet will be at its closest approach to Earth in over two years.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Excellent with telescope',
      bestTime: 'All night',
      duration: 'Several months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -1.4,
      distance: '0.64 AU from Earth',
      size: '14.6 arcseconds apparent diameter',
      speed: '24.1 km/s orbital speed'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-9',
    title: 'SpaceX Starship Launch',
    date: '2026-06-10',
    type: 'launch',
    description: 'Historic SpaceX Starship launch to Mars. This will be the first crewed mission to the Red Planet, marking a new era in space exploration.',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Clear skies required',
      bestTime: 'Launch window: 14:00 UTC',
      duration: '2-3 hours'
    },
    location: {
      name: 'Boca Chica, Texas',
      coordinates: '25.9961° N, 97.1558° W',
      hemisphere: 'northern',
      timezone: 'UTC-6'
    },
    scientific: {
      magnitude: 6.0,
      distance: 'Launch to Low Earth Orbit',
      size: '120m tall, 9m diameter',
      speed: '7.8 km/s orbital velocity'
    },
    isUpcoming: true
  },
  {
    id: 'upcoming-10',
    title: 'Venus-Jupiter Conjunction',
    date: '2026-07-20',
    type: 'conjunction',
    description: 'Venus and Jupiter will appear extremely close in the evening sky, separated by just 0.3 degrees. This is one of the most spectacular planetary conjunctions of the year.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Clear western horizon',
      bestTime: '30 minutes after sunset',
      duration: '1-2 hours'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -2.1,
      distance: 'Venus: 0.7 AU, Jupiter: 5.2 AU',
      size: 'Venus: 12.6", Jupiter: 33.4"',
      speed: 'Venus: 35.0 km/s, Jupiter: 13.1 km/s'
    },
    isUpcoming: true
  },

  // PASSED EVENTS (10)
  {
    id: 'passed-1',
    title: 'Great American Eclipse 2017',
    date: '2017-08-21',
    type: 'eclipse',
    description: 'The first total solar eclipse visible from coast to coast across the United States in 99 years. Millions of people witnessed this spectacular celestial event.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Perfect viewing conditions',
      bestTime: '18:26 UTC',
      duration: '2 minutes 40 seconds'
    },
    location: {
      name: 'United States',
      coordinates: '37.0902° N, 95.7129° W',
      hemisphere: 'northern',
      timezone: 'UTC-4 to UTC-8'
    },
    scientific: {
      magnitude: 1.031,
      distance: '149.6 million km',
      size: 'Moon appears 3.1% larger than Sun',
      speed: '1,500 km/h shadow speed'
    },
    isUpcoming: false
  },
  {
    id: 'passed-2',
    title: 'Leonids Meteor Storm 2001',
    date: '2001-11-18',
    type: 'meteor',
    description: 'One of the most intense meteor storms in history, with rates exceeding 1,000 meteors per hour. The Leonids produced spectacular fireballs and persistent trains.',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Exceptional viewing',
      bestTime: '02:00 - 04:00 local time',
      duration: '2-3 hours'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 1.5,
      distance: 'Comet 55P/Tempel-Tuttle debris',
      size: 'Dust particles 0.1-1mm',
      speed: '71 km/s'
    },
    isUpcoming: false
  },
  {
    id: 'passed-3',
    title: 'Comet Hale-Bopp',
    date: '1997-03-22',
    type: 'comet',
    description: 'One of the brightest comets of the 20th century, visible to the naked eye for 18 months. Hale-Bopp was visible even from light-polluted cities.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Visible from cities',
      bestTime: 'Evening and morning',
      duration: '18 months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -0.8,
      distance: '1.32 AU from Earth',
      size: '40-80 km nucleus',
      speed: '44.9 km/s'
    },
    isUpcoming: false
  },

  {
    id: 'passed-5',
    title: 'Aurora Australis 2003',
    date: '2003-10-30',
    type: 'aurora',
    description: 'Extreme solar storm created aurora visible as far north as Florida and Texas. The aurora was so bright it cast shadows and was visible during daylight.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Visible in daylight',
      bestTime: 'All day and night',
      duration: '3 days'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 6.0,
      distance: '80-1000 km altitude',
      size: 'Global coverage',
      speed: 'Solar wind: 2,000 km/s'
    },
    isUpcoming: false
  },
  {
    id: 'passed-6',
    title: 'Venus Transit 2012',
    date: '2012-06-05',
    type: 'eclipse',
    description: 'The last Venus transit of the Sun until 2117. Venus appeared as a small black dot crossing the solar disk, visible with proper solar filters.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 4,
      conditions: 'Solar filter required',
      bestTime: '22:09 - 04:49 UTC',
      duration: '6 hours 40 minutes'
    },
    location: {
      name: 'Pacific, Asia, Australia',
      coordinates: 'Pacific region',
      hemisphere: 'global',
      timezone: 'UTC'
    },
    scientific: {
      magnitude: -4.0,
      distance: 'Venus: 0.29 AU from Earth',
      size: 'Venus: 12,104 km diameter',
      speed: '35.0 km/s orbital velocity'
    },
    isUpcoming: false
  },
  {
    id: 'passed-7',
    title: 'Mars Opposition 2003',
    date: '2003-08-27',
    type: 'opposition',
    description: 'The closest Mars approach in 60,000 years. Mars appeared larger and brighter than ever recorded, with surface features visible in small telescopes.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Exceptional viewing',
      bestTime: 'All night',
      duration: 'Several months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: -2.9,
      distance: '0.37 AU from Earth',
      size: '25.1 arcseconds apparent diameter',
      speed: '24.1 km/s orbital speed'
    },
    isUpcoming: false
  },
  {
    id: 'passed-8',
    title: 'Apollo 11 Moon Landing',
    date: '1969-07-20',
    type: 'launch',
    description: 'The first human landing on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface, watched by millions worldwide.',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Television broadcast',
      bestTime: '20:17 UTC',
      duration: '2 hours 31 minutes'
    },
    location: {
      name: 'Moon, Sea of Tranquility',
      coordinates: '0.6741° N, 23.4730° E',
      hemisphere: 'global',
      timezone: 'UTC'
    },
    scientific: {
      magnitude: 0.0,
      distance: '384,400 km from Earth',
      size: 'Lunar Module: 4.3m tall',
      speed: '1.6 km/s lunar orbital velocity'
    },
    isUpcoming: false
  },
  {
    id: 'upcoming-6',
    title: 'Saturn Opposition',
    date: '2026-03-25',
    type: 'opposition',
    description: 'Saturn reaches opposition, offering the best views of its magnificent ring system. The rings will be tilted at 2.4°, providing excellent visibility.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 5,
      conditions: 'Excellent with telescope',
      bestTime: 'All night',
      duration: 'Several months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 0.2,
      distance: '8.9 AU from Earth',
      size: '18.5 arcseconds apparent diameter',
      speed: '9.7 km/s orbital speed'
    },
    isUpcoming: true
  },
  {
    id: 'passed-9',
    title: 'Halley\'s Comet 1986',
    date: '1986-02-09',
    type: 'comet',
    description: 'The most famous comet in history made its closest approach to Earth. Although not as spectacular as in 1910, it was still a significant astronomical event.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709265405-183ed1e8f762?w=800&h=600&fit=crop'
    ],
    visibility: {
      rating: 3,
      conditions: 'Binoculars recommended',
      bestTime: 'Pre-dawn hours',
      duration: 'Several months'
    },
    location: {
      name: 'Global',
      coordinates: 'Any location',
      hemisphere: 'global',
      timezone: 'Local time'
    },
    scientific: {
      magnitude: 2.1,
      distance: '0.42 AU from Earth',
      size: '15x8x8 km nucleus',
      speed: '54.6 km/s'
    },
    isUpcoming: false
  },


];