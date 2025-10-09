import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./components/DashboardOverview";
import { ContractsPage } from "./components/ContractsPage";
import { TrainersPage } from "./components/TrainersPage";
import { CalendarPage } from "./components/CalendarPage";
import { ImportPage } from "./components/ImportPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userName, setUserName] = useState("");

  const handleLogin = (phone: string) => {
    setUserName(phone);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "contracts":
        return <ContractsPage />;
      case "trainers":
        return <TrainersPage />;
      case "calendar":
        return <CalendarPage />;
      case "import":
        return <ImportPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      userName={userName}
    >
      {renderPage()}
    </DashboardLayout>
  );
}