export default async function SummonerPage({ 
    params 
}: { 
    params: { name: string } 
}) {
    return (
        <div>
            <h1>Summoner: {decodeURIComponent(params.name)}</h1>
            <p>Profile page coming soon...</p>
        </div>
    );
}