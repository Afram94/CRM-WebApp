import React, { createContext, useContext, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from "pusher-js";


interface EchoProviderProps {
  children: React.ReactNode;
}

const EchoContext = createContext<Echo | null>(null);

export const useEcho = () => {
  return useContext(EchoContext);
};

export const EchoProvider: React.FC<EchoProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Pusher
window.Pusher = Pusher;

// Initialize Echo
const echo = new Echo({
  broadcaster: "pusher",
  key: "mySecretKey67890",
  cluster: 'mt1',
  wsHost: window.location.hostname,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
});

    return () => {
      // Disconnect Echo when the component is unmounted
      echo.disconnect();
    };
  }, []);

  return (
    <EchoContext.Provider value={window.Echo}>
      {children}
    </EchoContext.Provider>
  );
};
