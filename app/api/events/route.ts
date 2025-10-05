import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SpaceYEvents as SeedEvents } from './data';

const DATA_FILE = path.join(process.cwd(), 'app', 'api', 'events', 'events.json');

async function readEvents() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // file missing or invalid -> return seed in-memory data
    return SeedEvents;
  }
}

export async function GET() {
  try {
    const events = await readEvents();

    const apodEvents = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      explanation: event.description,
      url: event.image,
      hdurl: event.image,
      media_type: 'image',
      service_version: 'v1'
    }));

    const neoEvents = events.map((event: any) => ({
      id: event.id,
      name: event.title,
      close_approach_date: event.date,
      miss_distance: {
        kilometers: event.scientific?.distance || '0'
      },
      estimated_diameter: {
        meters: {
          estimated_diameter_min: 10,
          estimated_diameter_max: 50
        }
      },
      is_potentially_hazardous: event.type === 'meteor' || event.type === 'comet',
      relative_velocity: {
        kilometers_per_hour: event.scientific?.speed || '0'
      }
    }));

    const eonetEvents = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      link: `https://example.com/event/${event.id}`,
      categories: [{
        id: 1,
        title: (event.type || '').charAt(0).toUpperCase() + (event.type || '').slice(1)
      }],
      sources: [{
        id: '1',
        url: `https://example.com/source/${event.id}`
      }],
      geometry: [{
        date: event.date,
        type: 'Point',
        coordinates: [0, 0]
      }]
    }));

    return NextResponse.json({
      apod: apodEvents,
      neo: neoEvents,
      eonet: eonetEvents,
      all: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
