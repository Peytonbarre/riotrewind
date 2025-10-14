import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [summonerSearch, setSummonerSearch] = useState('')
    const [summonerData, setSummonerData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSearchInputChange = (e) => {
        setSummonerSearch(e.target.value);
    }

    const handleInputSubmit = async (e) => {
        e.preventDefault();
        if(!summonerSearch.trim()) return;

        setLoading(true);
        setError('');
        setSummonerData(null);

        try{
            const REGION = 'na1';
            const summonerResponse = await fetch(
                'https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerSearch)}',
                {
                    headers: {
                        'X-Riot-Token': 'API_KEY'
                    }
                }
            );

            if(!summonerResponse.ok){
                if(summonerResponse.status === 404) {
                    throw new Error('Summoner not found');
                }
                throw new Error('Failed to fetch summoner data');
            }

            const data = await summonerResponse.json();
            setSummonerData(data);
            console.log('Summoner data:', data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    }

    return(
    <div className="navbar">
        {/* search */}
        <div className='midnav'>
            <form className='searchbar'>
                <input
                    type="text"
                    placeholder="Search Summoner"
                    value={summonerSearch}
                    onChange={handleSearchInputChange}
                />
                <button type="submit">search</button>
            </form>
        </div>
        {/* login + settings + friends */}
        <div className='rightnav'>
            <h2>login</h2>
            <h2>settings</h2>
            <h2>friends</h2>
        </div>
    </div>
    )
}