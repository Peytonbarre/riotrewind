import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const summonerId = searchParams.get('summonerId');

    if(!region || !summonerId){
        return NextResponse.json({error:'Missing parameters (region, summonerId required)'}, {status:400});
    }

    try{
        const response = await fetch(
            `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
            {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY!
                }
            }
        );

        if(!response.ok){
            return NextResponse.json(
                {error: 'Ranked data not found'},
                {status: response.status}
            );
        }

        const data = await response.json();
        return NextResponse.json(data)
    } catch (error){
        return NextResponse.json(
            {error:'Failed to fetch ranked data'},
            {status:500}
        )
    }
}
