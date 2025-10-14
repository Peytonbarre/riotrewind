import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const name = searchParams.get('name');

    if(!region || !name){
        return NextResponse.json({error:'Missing parameters'}, {status:400});
    }

    try{
        const response = await fetch(
            `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`,
            {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY!
                }
            }
        );

        if(!response.ok){
            return NextResponse.json(
                {error: 'Summoner not found'},
                {status: response.status}
            );
        }

        const data = await response.json();
        return NextResponse.json(data)
    } catch (error){
        return NextResponse.json(
            {error:'Failed to fetch'},
            {status:500}
        )
    }
}