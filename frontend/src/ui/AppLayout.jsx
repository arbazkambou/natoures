import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
function AppLayout() {
  return (
    <div>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
