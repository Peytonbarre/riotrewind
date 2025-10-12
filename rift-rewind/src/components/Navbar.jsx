import './Navbar.css'

export default function Navbar() {
    return(
    <div className="navbar">
        {/* search */}
        <div className='midnav'>
            <h2>search</h2>
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