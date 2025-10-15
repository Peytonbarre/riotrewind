import styles from './page.module.css'

interface MatchData {
    info: {
        gameMode: string;
        gameDuration: number;
        participants: Array<{
            puuid: string;
            championName: string;
            kills: number;
            deaths: number;
            assists: number;
            win: boolean;
            totalMinionsKilled: number;
            neutralMinionsKilled: number;
            visionScore: number;
        }>;
    };
}

export default async function SummonerPage({
    params
}: {
    params: Promise<{ name: string }>
}) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    // Parse Riot ID: GameName#TAG
    const nameParts = decodedName.split('#');
    const gameName = nameParts[0].trim();
    const tagLine = nameParts[1]?.trim() || 'NA1';
    const region = 'na1';

    let summonerData: any = null;
    let rankedData: any = null;
    let matchData: MatchData[] = [];
    let error = null;

    try {
        // Fetch summoner data
        const summonerResponse = await fetch(
            `http://localhost:3000/api/summoner?region=${region}&gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`,
            { cache: 'no-store' }
        );

        if (summonerResponse.ok) {
            summonerData = await summonerResponse.json();

            // Fetch ranked data
            const rankedResponse = await fetch(
                `http://localhost:3000/api/ranked?region=${region}&summonerId=${summonerData.id}`,
                { cache: 'no-store' }
            );

            if (rankedResponse.ok) {
                rankedData = await rankedResponse.json();
            }

            // Fetch match history
            const matchResponse = await fetch(
                `http://localhost:3000/api/matches?region=${region}&puuid=${summonerData.puuid}`,
                { cache: 'no-store' }
            );

            if (matchResponse.ok) {
                matchData = await matchResponse.json();
            }
        } else {
            const errorData = await summonerResponse.json();
            error = errorData.error || 'Failed to fetch summoner';
        }
    } catch (err) {
        error = 'Network error - could not connect to API';
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <strong>Error:</strong> {error}
                </div>
            </div>
        );
    }

    if (!summonerData) {
        return <div className={styles.loading}>Loading...</div>;
    }

    // Calculate stats from match data
    const recentMatches = matchData.slice(0, 20);
    const playerMatches = recentMatches.map(match => {
        const participant = match.info.participants.find(p => p.puuid === summonerData.puuid);
        return participant;
    }).filter(Boolean);

    const recentWins = playerMatches.filter(p => p?.win).length;
    const recentLosses = playerMatches.length - recentWins;
    const winRate = playerMatches.length > 0 ? Math.round((recentWins / playerMatches.length) * 100) : 0;

    // Get champion stats
    const championStats = new Map();
    playerMatches.forEach(match => {
        if (!match) return;
        const champ = match.championName;
        if (!championStats.has(champ)) {
            championStats.set(champ, { wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0 });
        }
        const stats = championStats.get(champ);
        if (match.win) stats.wins++;
        else stats.losses++;
        stats.kills += match.kills;
        stats.deaths += match.deaths;
        stats.assists += match.assists;
    });

    const topChampions = Array.from(championStats.entries())
        .map(([name, stats]: [string, any]) => ({
            name,
            games: stats.wins + stats.losses,
            winRate: Math.round((stats.wins / (stats.wins + stats.losses)) * 100),
            kda: ((stats.kills + stats.assists) / Math.max(stats.deaths, 1)).toFixed(2)
        }))
        .sort((a, b) => b.games - a.games)
        .slice(0, 3);

    // Get ranked info
    const soloQueue = rankedData?.find((q: any) => q.queueType === 'RANKED_SOLO_5x5');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.profileIcon}>{summonerData.summonerLevel}</div>
                <div className={styles.profileInfo}>
                    <h1>{gameName} #{tagLine}</h1>
                    <p>Level {summonerData.summonerLevel}</p>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.sidebar}>
                    {/* Ranked Stats */}
                    <div className={styles.statCard}>
                        <h3>Ranked Solo</h3>
                        {soloQueue ? (
                            <>
                                <div className={styles.rankInfo}>
                                    <div className={styles.rankBadge}>
                                        {soloQueue.tier?.charAt(0)}
                                        {soloQueue.rank}
                                    </div>
                                    <div className={styles.rankDetails}>
                                        <h4>{soloQueue.tier} {soloQueue.rank}</h4>
                                        <p>{soloQueue.leaguePoints} LP</p>
                                    </div>
                                </div>
                                <div className={styles.winrate}>
                                    <div className={styles.winrateBar}>
                                        <div className={styles.winBar} style={{ width: `${(soloQueue.wins / (soloQueue.wins + soloQueue.losses)) * 100}%` }}>
                                            {soloQueue.wins}W
                                        </div>
                                        <div className={styles.lossBar} style={{ width: `${(soloQueue.losses / (soloQueue.wins + soloQueue.losses)) * 100}%` }}>
                                            {soloQueue.losses}L
                                        </div>
                                    </div>
                                    <p style={{ textAlign: 'center', margin: '0.5rem 0 0', color: '#999', fontSize: '0.9rem' }}>
                                        {Math.round((soloQueue.wins / (soloQueue.wins + soloQueue.losses)) * 100)}% Win Rate
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p style={{ color: '#999' }}>Unranked</p>
                        )}
                    </div>

                    {/* Recent Stats */}
                    <div className={styles.statCard}>
                        <h3>Recent Stats (Last {playerMatches.length} Games)</h3>
                        <div className={styles.winrate}>
                            <div className={styles.winrateBar}>
                                <div className={styles.winBar} style={{ width: `${winRate}%` }}>
                                    {recentWins}W
                                </div>
                                <div className={styles.lossBar} style={{ width: `${100 - winRate}%` }}>
                                    {recentLosses}L
                                </div>
                            </div>
                            <p style={{ textAlign: 'center', margin: '0.5rem 0 0', color: '#999', fontSize: '0.9rem' }}>
                                {winRate}% Win Rate
                            </p>
                        </div>
                    </div>

                    {/* Top Champions */}
                    <div className={styles.statCard}>
                        <h3>Top Champions</h3>
                        <div className={styles.championList}>
                            {topChampions.map(champ => (
                                <div key={champ.name} className={styles.championItem}>
                                    <div className={styles.championIcon}>{champ.name.slice(0, 2)}</div>
                                    <div className={styles.championStats}>
                                        <h4>{champ.name}</h4>
                                        <p>{champ.kda} KDA • {champ.games} games</p>
                                    </div>
                                    <div className={`${styles.championWinrate} ${champ.winRate === 100 ? styles.winrate100 : ''}`}>
                                        {champ.winRate}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Match History */}
                <div>
                    <div className={styles.statCard}>
                        <h3>Match History</h3>
                        <div className={styles.matchHistory}>
                            {matchData.slice(0, 5).map((match, idx) => {
                                const participant = match.info.participants.find(p => p.puuid === summonerData.puuid);
                                if (!participant) return null;

                                const kda = ((participant.kills + participant.assists) / Math.max(participant.deaths, 1)).toFixed(2);
                                const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
                                const duration = Math.floor(match.info.gameDuration / 60);

                                return (
                                    <div key={idx} className={`${styles.matchCard} ${participant.win ? styles.win : styles.loss}`}>
                                        <div className={styles.matchHeader}>
                                            <span className={styles.matchType}>{match.info.gameMode} • {duration}m</span>
                                            <span className={`${styles.matchResult} ${participant.win ? styles.win : styles.loss}`}>
                                                {participant.win ? 'Victory' : 'Defeat'}
                                            </span>
                                        </div>
                                        <div className={styles.matchContent}>
                                            <div className={styles.matchChampion}>
                                                <div className={styles.matchChampionIcon}>
                                                    {participant.championName.slice(0, 3)}
                                                </div>
                                                <strong>{participant.championName}</strong>
                                            </div>
                                            <div className={styles.matchStats}>
                                                <div className={styles.statGroup}>
                                                    <h5>KDA</h5>
                                                    <p className={styles.kda}>
                                                        {participant.kills}/{participant.deaths}/{participant.assists} ({kda})
                                                    </p>
                                                </div>
                                                <div className={styles.statGroup}>
                                                    <h5>CS</h5>
                                                    <p>{cs} ({(cs / duration).toFixed(1)}/m)</p>
                                                </div>
                                                <div className={styles.statGroup}>
                                                    <h5>Vision</h5>
                                                    <p>{participant.visionScore}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}