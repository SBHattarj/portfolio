import type { GetSession, Handle } from '@sveltejs/kit';
import { getSessionWithBlitz } from 'app/blitz-server';

export const getSession: GetSession = getSessionWithBlitz(() => ({}))