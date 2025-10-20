import React, { useState, useEffect } from 'react';
// ⚠️ Ces importations sont nécessaires pour une intégration Stripe sécurisée
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// **Étape 1 : Configurer la clé publique Stripe**
// const stripePromise = loadStripe('VOTRE_CLÉ_PUBLIQUE_STRIPE'); // Remplacez par votre clé publique

// -----------------------------------------------------------

// Liste statique des pays (utilisée comme "API" de données)
const ALL_COUNTRIES = [
    { code: 'US', name: 'États-Unis' },
    { code: 'FR', name: 'France' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'JP', name: 'Japon' },
    { code: 'AF', name: 'Afghanistan' },
    { code: 'DZ', name: 'Algérie' },
    { code: 'AR', name: 'Argentine' },
    { code: 'AU', name: 'Australie' },
    { code: 'BR', name: 'Brésil' },
    { code: 'CN', name: 'Chine' },
    { code: 'IN', name: 'Inde' },
    { code: 'MX', name: 'Mexique' },
    // ... Ajoutez tous les autres pays ici ...
];

/**
 * Composant de la colonne de paiement à droite (détails de la carte)
 */
const FormulairePaiement = () => {
    const [email, setEmail] = useState('');
    const [nomSurCarte, setNomSurCarte] = useState('');
    // Initialisation avec le nom du pays
    const [pays, setPays] = useState('États-Unis'); 
    const [zip, setZip] = useState('');

   const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Tentative de souscription...");
        console.log({ email, nomSurCarte, pays, zip });
    };

    return (
        <div style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <button style={styles.applePayButton}>
                    <span style={{ fontFamily: 'SF Pro Display, sans-serif' }}></span> Payer
                </button>

                <p style={styles.orDivider}>ou payer par carte</p>

                {/* Champ Email */}
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />

                {/* Information de Carte - ⚠️ Ceci doit être CardElement de Stripe en production */}
                <label style={styles.label}>Informations de la carte</label>
                <div style={styles.cardInfoPlaceholder}>
                    {/* Ceci est un ESPACE RÉSERVÉ pour CardElement de Stripe */}
                    <p style={{ margin: 0, color: '#6a6a6a' }}>1234 1234 1234 1234</p>
                    <div style={styles.cardLogos}>
                        <span role="img" aria-label="logos">
                            <img src="360_F_406753914_SFSBhjhp6kbHblNiUFZ1MXHcuEKe7e7P.png" alt="Visa" style={{ height: '22px', marginRight: '5px' }} />
                        </span>
                    </div>
                </div>
                <div style={styles.cardDetailsRow}>
                    {/* Champs MM/AA et CVC simulés - **ACTIVÉS** */}
                    <input style={{...styles.input, ...styles.halfInput}} placeholder="MM / AA" />
                    <input style={{...styles.input, ...styles.halfInput, marginLeft: '10px'}} placeholder="CVC" />
                </div>

                {/* Nom sur la carte */}
                <label htmlFor="nomSurCarte" style={styles.label}>Nom sur la carte</label>
                <input
                    id="nomSurCarte"
                    type="text"
                    value={nomSurCarte}
                    onChange={(e) => setNomSurCarte(e.target.value)}
                    style={styles.input}
                    required
                />

                {/* Pays ou région - Utilise la liste complète */}
                <label htmlFor="pays" style={styles.label}>Pays ou région</label>
                <select
                    id="pays"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    style={styles.input}
                    required
                >
                    {ALL_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                            {country.name}
                        </option>
                    ))}
                </select>

                {/* ZIP */}
                <label htmlFor="zip" style={styles.label}>CODE POSTAL</label>
                <input
                    id="zip"
                    type="text"
                    value={zip}
                    // ✅ Correction du bug : utilisation correcte de setZip
                    onChange={(e) => setZip(e.target.value)} 
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.subscribeButton}>
                    S'abonner
                </button>

                <p style={styles.termsText}>
                    En confirmant votre abonnement, vous autorisez Together à débiter votre carte pour ce paiement et les futurs paiements conformément à leurs conditions.
                </p>
            </form>
        </div>
    );
};

// -----------------------------------------------------------

/**
 * Composant principal de la Passerelle de Paiement
 */
const PasserelleDePaiement = () => {
    const prix = 18.00;
    const produit = "Together Professionnel";
    const domaine = "Paiement-service.fr"; 

    // **Logique de responsivité** : Détermine si l'écran est petit (< 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Définition des styles dynamiques basés sur 'isMobile'
    const pageContainerStyle = isMobile ? styles.pageContainerMobile : styles.pageContainer;
    const leftPanelStyle = isMobile ? styles.leftPanelMobile : styles.leftPanel;
    const rightPanelStyle = isMobile ? styles.rightPanelMobile : styles.rightPanel;

    return (
        <div style={pageContainerStyle}>
            {/* Colonne de GAUCHE (Résumé) */}
            <div style={leftPanelStyle}>
                <a href={`https://${domaine}`} style={styles.backLink}>← Together</a>
                
                {/* 🎯 Conteneur de résumé (summaryContainer) */}
                <div style={styles.summaryContainer}>
                    <p style={styles.subscribeText}>S'abonner à **together** Professionnel</p>
                    <h1 style={styles.priceText}>${prix.toFixed(2)}<span style={styles.perMonth}> par mois</span></h1>
                    <p style={styles.planDescription}>Le plan premium de Together pour mieux travailler ensemble</p>
                    
                    <div style={styles.itemRow}>
                        <div style={styles.itemDescription}>
                            <span style={styles.productName}>{produit}</span>
                            <span style={styles.billingCycle}>Qté 1 - Facturé mensuellement</span>
                        </div>
                        <span style={styles.itemPrice}>${prix.toFixed(2)}</span>
                    </div>
                </div>

                <div style={styles.footerLinks}>
                    <a href="#" style={styles.footerLink}>Conditions</a>
                    <a href="#" style={styles.footerLink}>Confidentialité</a>
                </div>
            </div>

            {/* Colonne de DROITE (Formulaire) */}
            <div style={rightPanelStyle}>
                <FormulairePaiement />
            </div>
        </div>
    );
};

// -----------------------------------------------------------

// Styles pour simuler l'apparence de l'image (Mise à jour des couleurs et de la responsivité)
const styles = {
    // Styles de base pour les GRANDS ÉCRANS (Desktop, Mode Colonne)
    pageContainer: {
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    // Styles pour les PETITS ÉCRANS (Mobile, Mode Pile)
    pageContainerMobile: {
        display: 'flex',
        flexDirection: 'column', // Empiler les colonnes
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    
    // COLONNE DE GAUCHE (RÉSUMÉ) - Styles pour grand écran
    leftPanel: {
        flex: 1,
        backgroundColor: 'rgb(0 45 111)', // Bleu-Cyan
        color: 'white',
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    // COLONNE DE GAUCHE (RÉSUMÉ) - Styles pour petit écran
    leftPanelMobile: {
        width: '100%',
        backgroundColor: '#0097a7',
        color: 'white',
        padding: '30px 20px',
        order: 1, // Le résumé apparaît en premier sur mobile
    },
    // 🎯 Nouveau style pour le conteneur de résumé
    summaryContainer: {
        flexGrow: 1,
    },
    
    backLink: {
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        fontSize: '16px',
        marginBottom: '40px',
    },
    subscribeText: {
        fontSize: '16px',
        opacity: 0.8,
        margin: '0 0 10px 0',
    },
    priceText: {
        fontSize: '48px',
        fontWeight: 600,
        margin: '0 0 10px 0',
    },
    perMonth: {
        fontSize: '16px',
        fontWeight: 400,
        opacity: 0.8,
        marginLeft: '5px',
    },
    planDescription: {
        fontSize: '16px',
        opacity: 0.8,
        margin: '0 0 40px 0',
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        alignItems: 'center',
    },
    itemDescription: {
        display: 'flex',
        flexDirection: 'column',
    },
    productName: {
        fontWeight: 600,
        fontSize: '16px',
    },
    billingCycle: {
        fontSize: '14px',
        opacity: 0.7,
    },
    itemPrice: {
        fontWeight: 600,
        fontSize: '16px',
    },
    footerLinks: {
        marginTop: '20px',
    },
    footerLink: {
        color: 'rgba(255, 255, 255, 0.6)',
        textDecoration: 'none',
        fontSize: '14px',
        marginRight: '20px',
    },
    
    // COLONNE DE DROITE (FORMULAIRE) - Styles pour grand écran
    rightPanel: {
        flex: 1,
        backgroundColor: 'white',
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    // COLONNE DE DROITE (FORMULAIRE) - Styles pour petit écran
    rightPanelMobile: {
        width: '100%',
        backgroundColor: 'white',
        padding: '30px 20px',
        order: 2, // Le formulaire apparaît en deuxième sur mobile
        paddingTop: '20px',
    },
    
    formContainer: {
        maxWidth: '450px',
        margin: '0 auto',
        width: '100%',
    },
    applePayButton: {
        width: '100%',
        padding: '15px 0',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '18px',
        fontWeight: 500,
        cursor: 'pointer',
    },
    orDivider: {
        textAlign: 'center',
        color: '#6a6a6a',
        fontSize: '14px',
        margin: '20px 0',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        color: '#333',
        marginBottom: '5px',
        marginTop: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    cardInfoPlaceholder: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
    },
    cardLogos: {
        color: 'blue', // Placeholder
    },
    cardDetailsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    halfInput: {
        width: 'calc(50% - 5px)',
    },
    subscribeButton: {
        width: '100%',
        padding: '15px 0',
        backgroundColor: '#007bff', // Bleu vif
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '18px',
        fontWeight: 500,
        cursor: 'pointer',
        marginTop: '25px',
    },
    termsText: {
        fontSize: '12px',
        color: '#6a6a6a',
        textAlign: 'center',
        marginTop: '15px',
        lineHeight: 1.4,
    }
};

export default PasserelleDePaiement;