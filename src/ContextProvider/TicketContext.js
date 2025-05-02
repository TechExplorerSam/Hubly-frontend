import React, { createContext, useState, useContext } from 'react';

const TicketContext = createContext();

export const useTicket = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const [ticketId, setTicketId] = useState(null);
  const [ticketName, setTicketName] = useState(null);
  const [isNavigatedTroughDashboard, setIsNavigatedTroughDashboard] = useState(false);
const  assignTicketName=()=>setTicketName(ticketName)
  const assignTicketId =()=> setTicketId(ticketId);
  const  assignIsNavigatedThroughDashboard=()=>setIsNavigatedTroughDashboard(false)
  const assignIsNavigatedTroughDashboardTrue=()=>setIsNavigatedTroughDashboard(true)
  return (
    <TicketContext.Provider value={{ ticketId, setTicketId ,assignTicketName,assignTicketId,assignIsNavigatedThroughDashboard,assignIsNavigatedTroughDashboardTrue,ticketName}}>
      {children}
    </TicketContext.Provider>
  );


};

export const useTicketContext=()=>{
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
}
