import {BrowserRouter,Routes, Route} from 'react-router-dom';
import Landingpage from './Pages/Landingpage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import UserDashboard from './Pages/UserDashboard';
import ContactCenter from './Pages/ContactCenter';
import TeamMembers from './Pages/TeamMembers';
import Chatbot from './Pages/Chatbot';
import Analytics from './Pages/Analytics';
import UserProfile from './Pages/UserProfile';
import { AuthProvider } from './ContextProvider/AuthContext';
import { TicketProvider } from './ContextProvider/TicketContext';
function App() {
  return (
     <TicketProvider>
    <AuthProvider>
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='*' element={<Landingpage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/dashboard' element={<UserDashboard/>}/>
        <Route path='/contactcenter' element={<ContactCenter/>}/>
        <Route path='/team' element={<TeamMembers/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/UserProfile' element={<UserProfile/>}/>

      </Routes>
      </BrowserRouter>
    
    </div>
    </AuthProvider>
    </TicketProvider>
  );
}

export default App;
