import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [summonerSearch, setSummonerSearch] = useState('')

    const handleSearchInputChange = (e) => {
        setSummonerSearch(e.target.value);
    }

    return(
    <div className="navbar">
        {/* search */}
        <div className='midnav'>
            <div className='searchbar'>
                <input
                    type="text"
                    placeholder="Search Summoner"
                    value={summonerSearch}
                    onChange={handleSearchInputChange}
                />
            </div>
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