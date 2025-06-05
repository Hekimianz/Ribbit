import ResponsiveAppBar from './ResponsiveAppBar';
import { Outlet } from 'react-router';
export default function Layout() {
  return (
    <>
      <ResponsiveAppBar />
      <main style={{ paddingTop: '64px' }}></main>
      <Outlet />
    </>
  );
}
