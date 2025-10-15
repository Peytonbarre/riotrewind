import { NextRequest, NextResponse } from 'next/server'

// Map regional endpoints to continental routing values
const getRegionalEndpoint = (region: string): string => {
    const continentalMap: Record<string, string> = {
        'na1': 'americas',
        'br1': 'americas',
        'la1': 'americas',
        'la2': 'americas',
        'euw1': 'europe',
        'eune1': 'europe',
        'tr1': 'europe',
        'ru': 'europe',
        'kr': 'asia',
        'jp1': 'asia',
        'oc1': 'sea',
    };
    return continentalMap[region] || 'americas';
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const puuid = searchParams.get('puuid');
    const count = searchParams.get('count') || '20';

    if(!region || !puuid){
        return NextResponse.json({error:'Missing parameters (region, puuid required)'}, {status:400});
    }

    try{
        const continentalEndpoint = getRegionalEndpoint(region);

        // Get match IDs
        const matchListResponse = await fetch(
            `https://${continentalEndpoint}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
            {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY!
                }
            }
        );

        if(!matchListResponse.ok){
            return NextResponse.json(
                {error: 'Match list not found'},
                {status: matchListResponse.status}
            );
        }

        const matchIds = await matchListResponse.json();

        // Fetch details for each match (limit to first 5 for now)
        const matchDetailsPromises = matchIds.slice(0, 5).map((matchId: string) =>
            fetch(
                `https://${continentalEndpoint}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
                {
                    headers: {
                        'X-Riot-Token': process.env.RIOT_API_KEY!
                    }
                }
            ).then(res => res.json())
        );

        const matchDetails = await Promise.all(matchDetailsPromises);

        return NextResponse.json(matchDetails);
    } catch (error){
        return NextResponse.json(
            {error:'Failed to fetch match data'},
            {status:500}
        )
    }
}
