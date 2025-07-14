import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faBell, IconDefinition, faHome, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import NeumorphEyebrow from '../../commons/neumorph-eyebrow';
import NeumorphButton from '@/components/commons/neumorph-button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { environment } from '@/environments/environment';
import { useCookies } from 'react-cookie';

function NavItem({ icon, title, active = false }: { icon: IconDefinition, title: string, active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-2 w-full rounded-xl cursor-pointer transition-colors mb-2
      ${active
          ? 'bg-black text-white'
          : ' hover:bg-gray-100'}`}
    >
      <FontAwesomeIcon icon={icon} className="text-xl" />
      <span className="font-bold text-lg">{title}</span>
    </div>
  );
}

export default function LeftSidenav() {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const signOut = () => {
    const token = cookies.access_token;
    axios.get(`${environment.services.auth}/auth/logout`,
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  return (
    <div className='flex flex-col items-start justify-between p-4 bg-white border-r border-gray-200 h-screen w-full'>
      <div className="flex flex-col items-start justify-start h-screen w-full">
        <div className="flex items-start justify-start mb-6">
          <div className="bg-black p-2 rounded-full">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"></svg>
          </div>
          <h1 className="text-2xl font-bold ml-2">Awesome Babushka <NeumorphEyebrow style={{ fontSize: '0.75rem' }}>pre-alpha</NeumorphEyebrow></h1>
        </div>
        <NavItem icon={faHome} active title="Home" />
        <NavItem icon={faUser} title="Profile" />
        <NavItem icon={faEnvelope} title="Messages" />
        <NavItem icon={faBell} title="Notifications" />
      </div>
      <div className="flex items-center justify-center w-full mt-4">
        <NeumorphButton fullWidth intent={'white'} className="mb-4" onClick={signOut}>
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            <span className="font-bold ml-2">Sign Out</span>
          </div>
        </NeumorphButton>
      </div>
    </div>
  );
}