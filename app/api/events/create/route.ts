import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { SpaceYEvents as SeedEvents } from '../data';

const DATA_FILE = path.join(process.cwd(), 'app', 'api', 'events', 'events.json');

async function readEvents() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return SeedEvents;
  }
}

async function writeEvents(events: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.title || !body.date) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const events = await readEvents();

    const newEvent = {
      id: uuidv4(),
      title: String(body.title),
      date: String(body.date),
      type: String(body.type || 'planetary'),
      description: String(body.description || ''),
      image: String(body.image || ''),
      images: Array.isArray(body.images) ? body.images.map(String) : (body.images ? [String(body.images)] : []),
      visibility: {
        rating: Number(body.visibility?.rating ?? 1),
        conditions: String(body.visibility?.conditions ?? ''),
        bestTime: String(body.visibility?.bestTime ?? ''),
        duration: String(body.visibility?.duration ?? '')
      },
      location: {
        name: String(body.location?.name ?? ''),
        coordinates: String(body.location?.coordinates ?? ''),
        hemisphere: String(body.location?.hemisphere ?? 'global'),
        timezone: String(body.location?.timezone ?? '')
      },
      scientific: {
        magnitude: body.scientific?.magnitude !== undefined ? Number(body.scientific.magnitude) : undefined,
        distance: body.scientific?.distance ? String(body.scientific.distance) : undefined,
        size: body.scientific?.size ? String(body.scientific.size) : undefined,
        speed: body.scientific?.speed ? String(body.scientific.speed) : undefined,
        phase: body.scientific?.phase ? String(body.scientific.phase) : undefined
      },
      isUpcoming: new Date(String(body.date)).getTime() > Date.now()
    };

    events.push(newEvent);
    await writeEvents(events);

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}