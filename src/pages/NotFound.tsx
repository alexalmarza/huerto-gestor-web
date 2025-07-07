
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "Error 404: L'usuari ha intentat accedir a una ruta inexistent:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t('pageNotFoundMessage')}</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
