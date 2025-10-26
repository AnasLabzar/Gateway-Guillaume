import React, { useState, useEffect } from 'react';
// === JDID: Importer Link mn React Router ===
import { Link } from 'react-router-dom'; 
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// Optional: If using icon library like react-icons
import { FaLock, FaCreditCard } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// === Configuration des Thèmes par Domaine ===
const themes = {
    '1rdv1mandat.com': { // Thème pour 1rdv1mandat
        primaryColor: '#FF6600',    // Orange 1rdv (pour bouton principal)
        secondaryColor: '#232323',  // Bleu foncé 1rdv (panneau gauche)
        logoUrl: 'https://1rdv1mandat.com/wp-content/uploads/2023/05/logo-footer-white-300x62.png',
        // --- Couleurs pour fond sombre ---
        rightPanelBg: '#fafafaff',     // Fond sombre pour formulaire
        formTextColor: '#000000ff',    // Texte blanc sur fond sombre
        inputBgColor: 'rgba(249, 249, 249, 1)ff',     // Fond gris foncé pour inputs
        inputTextColor: '#151515ff',   // Texte blanc dans inputs
        inputBorderColor: '#e8e8e8ff', // Bordure grise pour inputs
        dividerColor: '#555555',     // Couleur séparateur sur fond sombre
    },
    'default': { // Thème par défaut
        primaryColor: '#007bff',       // Bleu standard (bouton)
        secondaryColor: 'rgb(0 45 111)',// Bleu standard (panneau gauche)
        logoUrl: null,
        // --- Couleurs par défaut (fond clair) ---
        rightPanelBg: '#FFFFFF',     // Fond blanc
        formTextColor: '#333333',    // Texte noir
        inputBgColor: '#FFFFFF',     // Fond blanc
        inputTextColor: '#333333',   // Texte noir
        inputBorderColor: '#CCCCCC', // Bordure grise claire
        dividerColor: '#e0e0e0',     // Couleur séparateur sur fond clair
    }
};

// === FormulairePaiement (Modifications UI/UX + Fix Thème) ===
// === Composant FormulairePaiement ===
const FormulairePaiement = ({ orderInfo, theme = themes['default'] }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState('');
    const [nomSurCarte, setNomSurCarte] = useState('');
    const [countries, setCountries] = useState([]);
    const [pays, setPays] = useState('');
    const [zip, setZip] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [paymentError, setPaymentError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Charger les pays (reste identique)
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesResponse = await fetch('/countries.json');
                if (!countriesResponse.ok) throw new Error('Erreur pays');
                const allCountries = await countriesResponse.json();
                setCountries(allCountries);
                if (allCountries.length > 0) setPays(allCountries[0].name);
            } catch (error) { console.error("Erreur chargement pays:", error); }
            finally { setIsLoading(false); }
        };
        loadCountries();
    }, []);

    // Pré-remplir email/nom
    useEffect(() => {
        if (orderInfo) {
            setEmail(orderInfo.email || '');
            setNomSurCarte(orderInfo.nom_reseau || '');
        }
    }, [orderInfo]);

    // Gérer la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true); setPaymentError(null);
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card', card: cardElement,
            billing_details: { name: nomSurCarte, email: email, address: { country: countries.find(c => c.name === pays)?.code, postal_code: zip } }
        });

        if (error) { setPaymentError(error.message); setIsProcessing(false); return; }

        const dataToSend = {
            email: email, nomSurCarte: nomSurCarte, pays: countries.find(c => c.name === pays)?.code, zip: zip,
            stripePaymentMethodId: paymentMethod.id,
            // Données venant de l'URL
            entry_id: orderInfo?.entry_id, // Utiliser entry_id
            total: orderInfo?.total, produit: orderInfo?.produit, origin: orderInfo?.origin
        };

        const API_ENDPOINT = `${process.env.REACT_APP_API_URL}/save-payment-details`;
        try {
            const response = await fetch(API_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend) });
            if (!response.ok) throw new Error('Erreur API sauvegarde');
            const result = await response.json();
            console.log('API SUCCESS:', result);
            // TODO: Redirection vers page de merci sur le site d'origine
            window.location.href = orderInfo?.origin ? `https://${orderInfo.origin}/merci` : '/merci';
        } catch (err) { console.error('Erreur API:', err); setPaymentError('Erreur sauvegarde.'); }
        setIsProcessing(false);
    };

    // Styles CardElement adaptés au thème
    const cardElementOptions = {
        style: {
            base: { fontSize: '16px', color: theme.inputTextColor, '::placeholder': { color: theme.formTextColor === '#FFFFFF' ? '#AAAAAA' : '#6a6a6a' }, padding: '12px' },
            invalid: { color: '#fa755a', iconColor: '#fa755a' }
        }, hidePostalCode: true
    };

    // Styles dynamiques
   const subscribeButtonStyle = { ...styles.subscribeButton, backgroundColor: theme.primaryColor };
    const labelStyle = { ...styles.label, color: theme.formTextColor };
    const inputStyle = { ...styles.input, backgroundColor: theme.inputBgColor, color: theme.inputTextColor, borderColor: theme.inputBorderColor };
    const cardContainerStyle = { ...styles.cardElementContainer, backgroundColor: theme.inputBgColor, borderColor: theme.inputBorderColor };
    const selectStyle = { ...inputStyle };
    const securityTextStyle = { ...styles.securityText, color: theme.formTextColor === '#FFFFFF' ? '#CCCCCC' : styles.securityText.color }; // Ajustement couleur texte sécurité
    const headerDividerStyle = { ...styles.formHeaderDivider, borderBottomColor: theme.dividerColor };
    // --- JDID: Style dynamique pour le séparateur ---

    return (
        <div style={styles.formContainer}>
            {/* --- En-tête du Formulaire --- */}
            <div style={styles.formHeader}>
                <h3 style={{ ...styles.formTitle, color: theme.formTextColor }}>Informations de Paiement</h3>
                <div style={styles.cardIcons}>
                    <img src="/payment-card.png" alt="Cartes acceptées" style={styles.cardIconsImage} />
                </div>
            </div>
            <hr style={headerDividerStyle} />

            <form onSubmit={handleSubmit}>
                {/* --- Champs du formulaire --- */}
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />

                <label style={labelStyle}>Informations de la carte</label>
                <div style={cardContainerStyle}><CardElement options={cardElementOptions} /></div>

                <label htmlFor="nomSurCarte" style={labelStyle}>Nom sur la carte</label>
                <input id="nomSurCarte" type="text" value={nomSurCarte} onChange={(e) => setNomSurCarte(e.target.value)} style={inputStyle} required />

                <label htmlFor="pays" style={labelStyle}>Pays ou région</label>
                <select id="pays" value={pays} onChange={(e) => setPays(e.target.value)} style={selectStyle} required disabled={isLoading}>
                     {isLoading ? (<option>Chargement...</option>) : (countries.map((c)=>(<option key={c.code} value={c.name}>{c.name}</option>)))}
                 </select>

                {paymentError && (<div style={styles.errorText}>{paymentError}</div>)}

                <button type="submit" style={subscribeButtonStyle} disabled={!stripe || isLoading || isProcessing}>
                    {isProcessing ? 'Traitement...' : "Valider le Paiement"}
                </button>

                {/* --- Section Sécurité --- */}
                <div style={styles.securityInfo}>
                     <p style={securityTextStyle}>
                        Vos informations de paiement sont cryptées et transmises de manière sécurisée via SSL. Nous respectons les normes PCI DSS pour garantir la protection de vos données.
                    </p>
                </div>
            </form>
        </div>
    );
};
// -----------------------------------------------------------

const PasserelleDePaiement = () => {

    const [orderInfo, setOrderInfo] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // Initialise avec le thème par défaut pour éviter l'erreur
    const [currentTheme, setCurrentTheme] = useState(themes['default']);

    // Lire URL et appliquer thème (reste identique)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const origin = params.get('origin') || 'default';
        const themeToApply = themes[origin] || themes['default'];
        setCurrentTheme(themeToApply);

        // Lire les autres données de l'URL
        const orderDataFromUrl = {
            total: params.get('total') || "0.00",
            produit: params.get('produit') || "Produit inconnu",
            email: params.get('email') || "",
            tel: params.get('tel'), // Garder tel, nom_reseau etc. si besoin
            nom_reseau: params.get('nom_reseau'),
            logo: params.get('logo'), // Utiliser le logo de l'URL
            entry_id: params.get('entry_id'), // Garder entry_id
            signature: params.get('signature'), // Garder signature pour l'instant
            origin: origin // Stocker l'origine
        };
        console.log("Données de commande lues depuis l'URL:", orderDataFromUrl);

        // Mettre à jour l'état directement
        setOrderInfo(orderDataFromUrl);
        // Resize listener
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Styles dynamiques
    const pageContainerStyle = isMobile ? styles.pageContainerMobile : styles.pageContainer;
    const leftPanelStyle = { ...(isMobile ? styles.leftPanelMobile : styles.leftPanel), backgroundColor: currentTheme.secondaryColor };
    const rightPanelStyle = { ...(isMobile ? styles.rightPanelMobile : styles.rightPanel), backgroundColor: currentTheme.rightPanelBg };

    const options = { appearance: { theme: 'stripe' } };

    // Helper Panier Moderne
    const renderProductList = (productString) => {
        if (!productString) return <div style={styles.productItem}>Aucun produit</div>;
        const products = productString.split(',').map(name => name.trim()).filter(name => name); // Nettoyer la liste
        if (products.length === 0) return <div style={styles.productItem}>Aucun produit</div>;

        return products.map((name, index) => (
            <div key={index} style={styles.productItem}>
                <span style={styles.productItemName}>{name}</span>
                {/* On pourrait essayer d'extraire le prix si on le passe différemment */}
            </div>
        ));
    };

    return (
        <div style={pageContainerStyle}>
            {/* Colonne GAUCHE (Résumé) */}
            <div style={leftPanelStyle}>
                <a href={orderInfo?.origin ? `https://${orderInfo.origin}` : '#'} style={styles.backLink}>← Retour</a>
                {orderInfo ? (
                    <div style={styles.summaryContainer}>
                        {(orderInfo.logo || currentTheme.logoUrl) && <img src={orderInfo.logo || currentTheme.logoUrl} alt="Logo" style={styles.summaryLogo} />}
                        <h4 style={styles.summaryTitle}>Récapitulatif de la commande</h4>
                        <div style={styles.productList}>{renderProductList(orderInfo.produit)}</div>
                        <hr style={styles.summarySeparator} />
                        <div style={styles.totalRow}>
                            <span style={styles.totalLabel}>Total à payer</span>
                            <span style={styles.totalPrice}>€{parseFloat(orderInfo.total).toFixed(2)}</span>
                        </div>
                    </div>
                ) : ( <div style={styles.summaryContainer}><h1 style={styles.priceText}>Chargement...</h1></div> )}
                
                {/* === BDDELNA HNA: Les liens utilisent <Link> === */}
                <div style={styles.footerLinks}>
                    {/* Zidna ?origin=... bach les pages légales yakhdo l thème s7i7 */}
                    <Link to={`/conditions?origin=${orderInfo?.origin || 'default'}`} style={styles.footerLink}>Conditions</Link>
                    <Link to={`/confidentialite?origin=${orderInfo?.origin || 'default'}`} style={styles.footerLink}>Confidentialité</Link>
                    <Link to={`/cookies?origin=${orderInfo?.origin || 'default'}`} style={styles.footerLink}>Cookies</Link>
                </div>
                 {/* === FIN TBEDAL === */}
            </div>

            {/* Colonne DROITE (Formulaire) */}
            <div style={rightPanelStyle}>
                <Elements stripe={stripePromise} options={options}>
                    <FormulairePaiement orderInfo={orderInfo} theme={currentTheme} />
                </Elements>
            </div>
        </div>
    );
};
// -----------------------------------------------------------

// Styles (Les mêmes que la version précédente)
const styles = {
    pageContainer: { display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' },
    pageContainerMobile: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
    leftPanel: { flex: 1, color: 'white', padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    leftPanelMobile: { width: '100%', color: 'white', padding: '30px 20px', order: 1 },
    summaryContainer: { flexGrow: 1, marginTop: '30px' },
    backLink: { color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '16px', marginBottom: '30px', display: 'inline-block' }, // Espace en bas
    summaryLogo: { maxWidth: '150px', maxHeight: '50px', objectFit: 'contain', marginBottom: '30px', display: 'block' },
    summaryTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.9)' },
    productList: { marginBottom: '20px' },
    productItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '16px', opacity: 0.9, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
    productItemName: { fontWeight: 500 },
    summarySeparator: { border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.2)', margin: '20px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', marginTop: '15px' }, // Taille ajustée
    totalLabel: { opacity: 0.9 },
    totalPrice: { /* Style spécifique si besoin */ },
    footerLinks: { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }, // Ligne au dessus
    footerLink: { color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '14px', marginRight: '20px' },
    rightPanel: { flex: 1, backgroundColor: 'white', padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }, // Permettre scroll si besoin
    rightPanelMobile: { width: '100%', backgroundColor: 'white', padding: '30px 20px', order: 2, paddingTop: '20px' },
    formContainer: { maxWidth: '450px', margin: '0 auto', width: '100%' },
    applePayButton: { width: '100%', padding: '15px 0', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 500, cursor: 'pointer', marginBottom: '10px' },
    orDivider: { textAlign: 'center', color: '#6a6a6a', fontSize: '14px', margin: '20px 0' },
    label: { display: 'block', fontSize: '14px', color: '#333', marginBottom: '5px', marginTop: '15px' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' },
    cardElementContainer: { padding: '12px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxSizing: 'border-box', marginTop: '5px' },
    subscribeButton: { width: '100%', padding: '15px 0', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 500, cursor: 'pointer', marginTop: '25px', transition: 'background-color 0.2s' },
    termsText: { fontSize: '12px', color: '#6a6a6a', textAlign: 'center', marginTop: '15px', lineHeight: 1.4 },
    errorText: { color: 'red', fontSize: '14px', marginTop: '10px' },
    // ... (Styles Panneau Gauche et Panier Moderne - Aucune modif ici) ...
    pageContainer: { display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' },
    pageContainerMobile: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
    leftPanel: { flex: 1, color: 'white', padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    leftPanelMobile: { width: '100%', color: 'white', padding: '30px 20px', order: 1 },
    summaryContainer: { flexGrow: 1, marginTop: '30px' },
    backLink: { color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '16px', marginBottom: '30px', display: 'inline-block' },
    summaryLogo: { maxWidth: '150px', maxHeight: '50px', objectFit: 'contain', marginBottom: '30px', display: 'block' },
    summaryTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.9)' },
    productList: { marginBottom: '20px' },
    productItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '16px', opacity: 0.9, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
    productItemName: { fontWeight: 500 },
    summarySeparator: { border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.2)', margin: '20px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', marginTop: '15px' },
    totalLabel: { opacity: 0.9 },
    totalPrice: { /* Style spécifique si besoin */ },
    footerLinks: { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' },
    footerLink: { color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '14px', marginRight: '20px' },

    // --- Styles Panneau Droit (Thème appliqué dynamiquement) ---
    rightPanel: { flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', transition: 'background-color 0.3s' },
    rightPanelMobile: { width: '100%', padding: '30px 20px', order: 2, paddingTop: '20px', transition: 'background-color 0.3s' },

    formContainer: { maxWidth: '450px', margin: '0 auto', width: '100%' },

    // --- JDID: Styles Header Formulaire ---
    formHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px', // Espace réduit avant séparateur
    },
    formTitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 600,
    },
    cardIcons: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.4em', // Taille icônes ajustée
        opacity: 0.7,
        gap: '8px', // Espace entre icônes
    },
    // --- JDID: Style Séparateur Header ---
    formHeaderDivider: {
        border: 'none',
        borderBottom: '1px solid', // Couleur appliquée dynamiquement
        margin: '0 0 25px 0', // Espace après séparateur
    },
    // --- FIN Header ---

    applePayButton: { width: '100%', padding: '15px 0', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 500, cursor: 'pointer', marginBottom: '30px' },
    // orDivider SUPPRIMÉ

    // --- Styles Inputs/Labels (Couleurs thème appliquées dans le composant) ---
    label: { display: 'block', fontSize: '14px', marginBottom: '5px', marginTop: '15px', fontWeight: '500' },
    input: { width: '100%', padding: '12px', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', border: '1px solid', transition: 'background-color 0.3s, color 0.3s, border-color 0.3s' },
    cardElementContainer: { padding: '12px', borderRadius: '4px', width: '100%', boxSizing: 'border-box', marginTop: '5px', border: '1px solid', transition: 'background-color 0.3s, border-color 0.3s' },

    // --- Style Bouton Principal (Couleur thème appliquée dans le composant) ---
    subscribeButton: { width: '100%', padding: '15px 0', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 500, cursor: 'pointer', marginTop: '25px', transition: 'background-color 0.2s' },

    // --- JDID: Styles Section Sécurité ---
    securityInfo: {
        marginTop: '30px',
        textAlign: 'center',
    },
    securityIcons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '10px',
        fontSize: '1.1em', // Taille icônes ajustée
        opacity: 0.7,
    },
    cardIconsImage: {
        maxHeight: '20px', // L 3lou maximum (bqiti tbeddel had raqam)
        width: 'auto',     // Bach ybqa l 3erd mnasb
        display: 'block',  // Bach maydirch espace zayd
    },
    securityText: {
        fontSize: '12px', // Légèrement plus petit
        lineHeight: 1.5,
        maxWidth: '400px',
        margin: '0 auto',
        opacity: 0.8, // Légèrement transparent
    },
    // --- FIN Section Sécurité ---

    // termsText SUPPRIMÉ (remplacé par securityText)
    errorText: { color: 'red', fontSize: '14px', marginTop: '10px' }
};

export default PasserelleDePaiement;