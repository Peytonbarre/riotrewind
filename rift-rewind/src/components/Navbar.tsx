'use client';

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation';
import './Navbar.css'
import React from 'react';

export default function Navbar() {
    const [summonerSearch, setSummonerSearch] = useState('')
    const [region, setRegion] = useState('na1')
    const router = useRouter();

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSummonerSearch(e.target.value);
    };

    const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
    };

    const handleInputSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!summonerSearch.trim()) return;

        router.push(`/summoner/${encodeURIComponent(summonerSearch)}`);
    };

    return(
        <div className="navbar">
            {/* search */}
            <div className='search-container'>
                <form className='searchbar' onSubmit={handleInputSubmit}>
                    <select value={region} onChange={handleRegionChange} className='region-select'>
                        <option value="na1">NA</option>
                        <option value="euw1">EUW</option>
                        <option value="eune1">EUNE</option>
                        <option value="kr">KR</option>
                        <option value="br1">BR</option>
                        <option value="jp1">JP</option>
                        <option value="la1">LAN</option>
                        <option value="la2">LAS</option>
                        <option value="oc1">OCE</option>
                        <option value="tr1">TR</option>
                        <option value="ru">RU</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Summoner name + #NA1"
                        value={summonerSearch}
                        onChange={handleSearchInputChange}
                        className='search-input'
                    />
                </form>
            </div>
            {/* nav buttons */}
            <div className='nav-buttons'>
                <button className='nav-btn'>Login</button>
                <button className='nav-btn'>Settings</button>
                <button className='nav-btn'>Friends</button>
            </div>
        </div>
    )
}