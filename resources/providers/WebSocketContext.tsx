import React, { createContext, useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from "pusher-js";


interface EchoProviderProps {
  children: React.ReactNode;
}

interface MyWindow extends Window {
    PUSHER_APP_KEY: string;
}

declare var window: MyWindow;


const EchoContext = createContext<Echo | null>(null);

export const useEcho = () => {
  return useContext(EchoContext);
};

export const EchoProvider: React.FC<EchoProviderProps> = ({ children }) => {

const [echo, setEcho] = useState<Echo | null>(null);

useEffect(() => {
    // Initialize Pusher
    window.Pusher = Pusher;

    // Initialize Echo
    const echoInstance = new Echo({
        broadcaster: "pusher",
        key: window.PUSHER_APP_KEY,  // <- Use the global variable here

        cluster: 'mt1',
        wsHost: window.location.hostname,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
    });

    setEcho(echoInstance);  // <- Set the Echo instance to the state

    return () => {
        // Disconnect Echo when the component is unmounted
        echoInstance.disconnect();
    };
}, []);

return (
    <EchoContext.Provider value={echo}>
        {children}
    </EchoContext.Provider>
);
};
