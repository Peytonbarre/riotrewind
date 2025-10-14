'use client';

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import './Navbar.css'
import React from 'react';

export default function Navbar() {
    const [summonerSearch, setSummonerSearch] = useState('')
    const router = useRouter();

    const handleSearchInputChange = (e) => {
        setSummonerSearch(e.target.value);
    };

    const handleInputSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!summonerSearch.trim()) return;

        router.push(`/summoner/${encodeURIComponent(summonerSearch)}`);
    };

    return(
        <div className="navbar">
            {/* search */}
            <div className='midnav'>
                <form className='searchbar' onSubmit={handleInputSubmit}>
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