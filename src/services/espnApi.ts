// ESPN API - Free, no key required, real-time World Cup 2026 data
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

export interface MatchEvent {
  type: string;
  clock: string;
  teamId: string;
  playerName: string;
  assistName: string;
}

export interface MatchStats {
  homePossession: string;
  awayPossession: string;
  homeShots: string;
  awayShots: string;
  homeShotsOnTarget: string;
  awayShotsOnTarget: string;
  homeCorners: string;
  awayCorners: string;
  homeFouls: string;
  awayFouls: string;
}

export interface ProcessedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeId: string;
  awayId: string;
  homeAbbr: string;
  awayAbbr: string;
  homeScore: string;
  awayScore: string;
  status: 'live' | 'upcoming' | 'finished';
  statusText: string;
  clock: string;
  venue: string;
  city: string;
  group: string;
  date: string;
  broadcasts: string;
  events: MatchEvent[];
  stats: MatchStats | null;
}

function getStatVal(stats: any[], abbr: string): string {
  const s = stats?.find((st: any) => st.abbreviation === abbr);
  return s?.displayValue || '0';
}

function processMatch(event: any): ProcessedMatch {
  const comp = event.competitions?.[0];
  const empty: ProcessedMatch = {
    id: event.id, homeTeam: '', awayTeam: '', homeLogo: '', awayLogo: '',
    homeId: '', awayId: '', homeAbbr: '', awayAbbr: '', homeScore: '0', awayScore: '0',
    status: 'upcoming', statusText: '', clock: '', venue: '', city: '',
    group: '', date: event.date || '', broadcasts: '', events: [], stats: null,
  };
  if (!comp) return empty;

  const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
  const away = comp.competitors?.find((c: any) => c.homeAway === 'away');

  const stateMap: Record<string, 'live' | 'upcoming' | 'finished'> = {
    pre: 'upcoming', in: 'live', post: 'finished',
  };
  const status = stateMap[comp.status?.type?.state] || 'upcoming';

  let statusText = '';
  if (status === 'live') statusText = comp.status?.displayClock || comp.status?.type?.shortDetail || 'جارية';
  else if (status === 'finished') statusText = comp.status?.type?.detail || 'FT';
  else statusText = comp.status?.type?.shortDetail || '';

  const broadcastNames = comp.broadcasts?.flatMap((b: any) => b.names) || [];

  // Parse events (goals, cards etc) from details array
  const events: MatchEvent[] = [];
  for (const d of comp.details || []) {
    events.push({
      type: d.type?.text || d.type?.id || '',
      clock: d.clock?.displayValue || '',
      teamId: d.team?.id || '',
      playerName: d.athletesInvolved?.[0]?.displayName || '',
      assistName: '',
    });
  }

  // Parse stats
  let stats: MatchStats | null = null;
  if (home?.statistics?.length && away?.statistics?.length) {
    stats = {
      homePossession: getStatVal(home.statistics, 'PP'),
      awayPossession: getStatVal(away.statistics, 'PP'),
      homeShots: getStatVal(home.statistics, 'SHOT'),
      awayShots: getStatVal(away.statistics, 'SHOT'),
      homeShotsOnTarget: getStatVal(home.statistics, 'SOG'),
      awayShotsOnTarget: getStatVal(away.statistics, 'SOG'),
      homeCorners: getStatVal(home.statistics, 'CW'),
      awayCorners: getStatVal(away.statistics, 'CW'),
      homeFouls: getStatVal(home.statistics, 'FC'),
      awayFouls: getStatVal(away.statistics, 'FC'),
    };
  }

  return {
    id: event.id,
    homeTeam: home?.team?.displayName || 'TBD',
    awayTeam: away?.team?.displayName || 'TBD',
    homeLogo: home?.team?.logo || '',
    awayLogo: away?.team?.logo || '',
    homeId: home?.id || '',
    awayId: away?.id || '',
    homeAbbr: home?.team?.abbreviation || '',
    awayAbbr: away?.team?.abbreviation || '',
    homeScore: home?.score ?? '0',
    awayScore: away?.score ?? '0',
    status, statusText,
    clock: comp.status?.displayClock || '',
    venue: comp.venue?.fullName || '',
    city: comp.venue?.address?.city || '',
    group: comp.altGameNote || '',
    date: event.date,
    broadcasts: broadcastNames.join(', '),
    events, stats,
  };
}

export async function fetchTodayMatches(): Promise<ProcessedMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/scoreboard`);
    const data = await res.json();
    return (data.events || []).map(processMatch);
  } catch (err) { console.error('ESPN error:', err); return []; }
}

export async function fetchMatchesByDate(date: string): Promise<ProcessedMatch[]> {
  try {
    const res = await fetch(`${ESPN_BASE}/scoreboard?dates=${date}`);
    const data = await res.json();
    return (data.events || []).map(processMatch);
  } catch (err) { console.error('ESPN error:', err); return []; }
}

// ===== Group Standings =====
export interface GroupTeam {
  name: string; logo: string; played: number; wins: number;
  draws: number; losses: number; goalsFor: number; goalsAgainst: number;
  goalDiff: number; points: number; rank: number; qualified: boolean;
}
export interface GroupStanding { name: string; teams: GroupTeam[]; }

function getStat(stats: any[], name: string): number {
  return stats?.find((s: any) => s.name === name)?.value || 0;
}

export async function fetchAllGroupStandings(): Promise<GroupStanding[]> {
  try {
    const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings');
    const data = await res.json();
    return (data.children || []).map((child: any) => {
      const teams = (child.standings?.entries || []).map((e: any) => ({
        name: e.team?.displayName || '',
        logo: e.team?.logos?.[0]?.href || '',
        played: getStat(e.stats, 'gamesPlayed'),
        wins: getStat(e.stats, 'wins'),
        draws: getStat(e.stats, 'ties'),
        losses: getStat(e.stats, 'losses'),
        goalsFor: getStat(e.stats, 'pointsFor'),
        goalsAgainst: getStat(e.stats, 'pointsAgainst'),
        goalDiff: getStat(e.stats, 'pointDifferential'),
        points: getStat(e.stats, 'points'),
        rank: getStat(e.stats, 'rank'),
        qualified: getStat(e.stats, 'advanced') === 1,
      })).sort((a: GroupTeam, b: GroupTeam) => a.rank - b.rank);
      return { name: child.name || '', teams };
    });
  } catch (err) { console.error('Standings error:', err); return []; }
}
