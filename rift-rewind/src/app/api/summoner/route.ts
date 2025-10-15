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
    const gameName = searchParams.get('gameName');
    const tagLine = searchParams.get('tagLine');

    if(!region || !gameName || !tagLine){
        return NextResponse.json({error:'Missing parameters (region, gameName, tagLine required)'}, {status:400});
    }

    try{
        // Get continental endpoint for Riot ID lookup
        const continentalEndpoint = getRegionalEndpoint(region);

        // First, get account info by Riot ID
        const accountResponse = await fetch(
            `https://${continentalEndpoint}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
            {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY!
                }
            }
        );

        if(!accountResponse.ok){
            return NextResponse.json(
                {error: 'Account not found'},
                {status: accountResponse.status}
            );
        }

        const accountData = await accountResponse.json();

        // Get summoner data using PUUID
        const summonerResponse = await fetch(
            `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
            {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY!
                }
            }
        );

        if(!summonerResponse.ok){
            return NextResponse.json(
                {error: 'Summoner data not found'},
                {status: summonerResponse.status}
            );
        }

        const summonerData = await summonerResponse.json();

        // Combine account and summoner data
        return NextResponse.json({
            ...accountData,
            ...summonerData
        });

    } catch (error){
        return NextResponse.json(
            {error:'Failed to fetch'},
            {status:500}
        )
    }
}