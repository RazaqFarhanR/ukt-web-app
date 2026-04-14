import React, { createContext, useEffect, useState } from 'react'
export const globalState = createContext()

function context ({ children }) {
    const [showSideBar, setShowSideBar] = useState(true)
    const [closeSideBar, setCloseSideBar] = useState(false)
    const [active, setActive] = useState('senam')

    useEffect(() => {
        if (typeof window === 'undefined') return
        const savedShow = window.localStorage.getItem('showSideBar')
        const savedClose = window.localStorage.getItem('closeSideBar')

        if (savedShow !== null) setShowSideBar(JSON.parse(savedShow))
        if (savedClose !== null) setCloseSideBar(JSON.parse(savedClose))
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem('showSideBar', JSON.stringify(showSideBar))
        window.localStorage.setItem('closeSideBar', JSON.stringify(closeSideBar))
    }, [showSideBar, closeSideBar])

    return ( 
        <globalState.Provider value={{ showSideBar, setShowSideBar, setActive, closeSideBar, setCloseSideBar, active }}>
            {children}
        </globalState.Provider>
    )
}

export default context