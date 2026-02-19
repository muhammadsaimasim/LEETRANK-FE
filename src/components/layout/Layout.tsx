//FOR NED
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

export function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isLeaderboardPage = location.pathname === ROUTES.LEADERBOARD;
  const hideChrome = isLeaderboardPage && !isAuthenticated;

  return (
    <div className="flex min-h-screen flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}




//MY OWN

// import { Outlet } from 'react-router-dom';
// import { Navbar } from './Navbar';
// import { Footer } from './Footer';

// export function Layout() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }
