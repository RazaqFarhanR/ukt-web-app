import React, { createContext, useState } from 'react'
export const globalState = createContext()

function context ({ children }) {
    
    const [showSideBar, setShowSideBar] = useState(true)
    const [closeSideBar, setCloseSideBar] = useState(false)
    const [active, setActive] = useState('senam')

    return ( 
        <globalState.Provider value={{ showSideBar, setShowSideBar, setActive, closeSideBar, setCloseSideBar, active }}>
            {children}
        </globalState.Provider>
    )
}

export default context