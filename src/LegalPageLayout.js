import React from 'react';
import { Link } from 'react-router-dom'; // Import Link pour navigation

// Réutiliser les styles et les thèmes du fichier principal
// Assurez-vous que l'exportation des styles et thèmes est correcte
// depuis votre fichier principal (ex: CheckoutPage.js)
// Ici, on suppose qu'ils sont importés ou passés en props
// Pour simplifier, on les redéfinit ici, mais l'idéal est de les partager

// NOTE: Importez 'themes' et 'styles' depuis votre fichier principal
// import { themes, styles } from './PasserelleDePaiement'; // Ou le nom de votre fichier

// --- COPIE TEMPORAIRE (à remplacer par import) ---
const themes = {
    '1rdv1mandat.com': { primaryColor: '#FF6600', secondaryColor: '#002D6F', logoUrl: '...', rightPanelBg: '#232323', formTextColor: '#FFFFFF', inputBgColor: '#333333', inputTextColor: '#FFFFFF', inputBorderColor: '#555555', dividerColor: '#555555' },
    'default': { primaryColor: '#007bff', secondaryColor: 'rgb(0 45 111)', logoUrl: null, rightPanelBg: '#FFFFFF', formTextColor: '#333333', inputBgColor: '#FFFFFF', inputTextColor: '#333333', inputBorderColor: '#CCCCCC', dividerColor: '#e0e0e0' }
};
// Simulez les styles ici aussi ou importez-les
const styles = { /* ... Collez vos styles ici ... */ }; 
// --- FIN COPIE TEMPORAIRE ---


const LegalPageLayout = ({ children, title, theme, origin }) => {
    const isMobile = window.innerWidth < 768; // Ou utilisez un state si besoin

    // Appliquer les styles dynamiques comme dans PasserelleDePaiement
    const leftPanelStyle = { 
        ...(isMobile ? styles.leftPanelMobile : styles.leftPanel), 
        backgroundColor: theme.secondaryColor 
    };
    const rightPanelStyle = { 
        ...(isMobile ? styles.rightPanelMobile : styles.rightPanel), 
        backgroundColor: theme.rightPanelBg,
        color: theme.formTextColor // Appliquer couleur texte au panneau droit
    };
    
    // Style pour le contenu légal
    const legalContentStyle = {
        maxWidth: '800px', // Ajuster la largeur max du texte
        margin: '0 auto',
        padding: '20px',
        lineHeight: 1.6,
        color: theme.formTextColor // Utiliser couleur du thème
    };
    const headingStyle = {
        color: theme.primaryColor, // Utiliser couleur primaire pour titres
        marginTop: '30px',
        marginBottom: '15px',
        borderBottom: `1px solid ${theme.dividerColor}`,
        paddingBottom: '10px'
    };
    const paragraphStyle = {
        marginBottom: '15px',
    };
    const listStyle = {
        marginLeft: '20px',
        marginBottom: '15px',
    };

    return (
        <div style={isMobile ? styles.pageContainerMobile : styles.pageContainer}>
            {/* Colonne GAUCHE (Logo + Liens) */}
            <div style={leftPanelStyle}>
                {/* Lien Retour */}
                <a href={origin ? `https://${origin}` : '#'} style={styles.backLink}>← Retour</a>
                
                {/* Logo */}
                <div style={styles.summaryContainer}>
                     {(theme.logoUrl) && 
                         <img src={theme.logoUrl} alt="Logo" style={styles.summaryLogo} />}
                    {/* On peut laisser vide ou ajouter un titre */}
                </div>

                {/* Liens Footer */}
                <div style={styles.footerLinks}>
                    {/* Utiliser Link de react-router-dom */}
                    <Link to="/conditions" style={styles.footerLink}>Conditions</Link>
                    <Link to="/confidentialite" style={styles.footerLink}>Confidentialité</Link>
                    <Link to="/cookies" style={styles.footerLink}>Cookies</Link>
                </div>
            </div>

            {/* Colonne DROITE (Contenu Légal) */}
            <div style={rightPanelStyle}>
                 <div style={legalContentStyle}>
                    <h1 style={{...headingStyle, marginTop: 0, fontSize: '2em'}}>{title}</h1>
                    {/* Appliquer styles aux enfants */}
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            let style = {};
                            if (child.type === 'h2' || child.type === 'h3') style = headingStyle;
                            if (child.type === 'p') style = paragraphStyle;
                            if (child.type === 'ul' || child.type === 'ol') style = listStyle;
                            return React.cloneElement(child, { style });
                        }
                        return child;
                    })}
                </div>
            </div>
        </div>
    );
};

export default LegalPageLayout;