import React from 'react';
// === JDID: Importer les outils de routing ===
import { Routes, Route, useLocation } from 'react-router-dom';

// === JDID: Importer les composants de page ===
import PasserelleDePaiement from './CheckoutPage'; // Renommer si besoin
import LegalPageLayout from './LegalPageLayout';
import ConditionsPage from './ConditionsPage';
import ConfidentialitePage from './ConfidentialitePage';
import CookiesPage from './CookiesPage';

// === JDID: Importer (ou redéfinir) les thèmes ===
// import { themes } from './CheckoutPage'; // Idéalement, mettez themes dans un fichier séparé
// --- COPIE TEMPORAIRE (à remplacer par import) ---
const themes = {
    '1rdv1mandat.com': { primaryColor: '#FF6600', secondaryColor: '#002D6F', logoUrl: '...', rightPanelBg: '#232323', formTextColor: '#FFFFFF', inputBgColor: '#333333', inputTextColor: '#FFFFFF', inputBorderColor: '#555555', dividerColor: '#555555' },
    'default': { primaryColor: '#007bff', secondaryColor: 'rgb(0 45 111)', logoUrl: null, rightPanelBg: '#FFFFFF', formTextColor: '#333333', inputBgColor: '#FFFFFF', inputTextColor: '#333333', inputBorderColor: '#CCCCCC', dividerColor: '#e0e0e0' }
};
// --- FIN COPIE TEMPORAIRE ---


// === JDID: Composant helper pour extraire l'origine/thème de l'URL ===
// (Important pour que les pages légales aient aussi le bon thème)
const ThemeWrapper = ({ children }) => {
    const location = useLocation(); // Hook pour accéder à l'URL actuel
    const params = new URLSearchParams(location.search);
    const origin = params.get('origin') || 'default';
    const currentTheme = themes[origin] || themes['default'];
    
    // Clone l'enfant (ex: LegalPageLayout) et lui passe 'theme' et 'origin'
    return React.cloneElement(children, { theme: currentTheme, origin: origin });
};


function App() {
  return (
    // Routes définit les différentes "pages" de l'application
    <Routes>
      {/* Route pour la page de paiement (URL de base "/") */}
      <Route path="/" element={<PasserelleDePaiement />} /> 
      
      {/* Routes pour les pages légales */}
      {/* Chaque page légale utilise ThemeWrapper pour obtenir le thème */}
      {/* et LegalPageLayout pour la structure à deux colonnes */}
      
      <Route 
        path="/conditions" 
        element={
          <ThemeWrapper> 
            <LegalPageLayout title="Conditions Générales d'Utilisation">
              <ConditionsPage />
            </LegalPageLayout>
          </ThemeWrapper>
        } 
      />
      <Route 
        path="/confidentialite" 
        element={
           <ThemeWrapper>
             <LegalPageLayout title="Politique de Confidentialité">
               <ConfidentialitePage />
             </LegalPageLayout>
           </ThemeWrapper>
        } 
      />
       <Route 
        path="/cookies" 
        element={
           <ThemeWrapper>
             <LegalPageLayout title="Politique de Cookies">
               <CookiesPage />
             </LegalPageLayout>
           </ThemeWrapper>
         } 
       />

       {/* Optionnel: Route pour page 404 si l'URL ne correspond à rien */}
       {/* <Route path="*" element={<div>Erreur 404: Page non trouvée</div>} /> */}
    </Routes>
  );
}

export default App;