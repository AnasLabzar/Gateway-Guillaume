import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// === Configuration des Thèmes par Domaine ===
const themes = {
    '1rdv1mandat.com': {
        primaryColor: '#FF6600', // Orange 1rdv
        secondaryColor: '#002D6F', // Bleu foncé 1rdv
        logoUrl: 'https://1rdv1mandat.com/wp-content/uploads/2023/05/logo-footer-white-300x62.png', // Logo blanc 1rdv (ajuster si besoin)
    },
    'default': {
        primaryColor: '#007bff',
        secondaryColor: 'rgb(0 45 111)', // Bleu par défaut (ancien)
        logoUrl: null,
    }
};

// === FormulairePaiement (Minimal Changes) ===
const FormulairePaiement = ({ orderInfo, theme }) => {
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

    // Pré-remplir email/nom depuis orderInfo (reste identique)
    useEffect(() => {
        if (orderInfo) {
            setEmail(orderInfo.email || '');
            setNomSurCarte(orderInfo.nom_reseau || ''); // Utiliser nom_reseau pour l'instant
        }
    }, [orderInfo]);

    // ✅ **MIS À JOUR :** `handleSubmit` pour gérer le paiement Stripe
    const handleSubmit = async (event) => {
        event.preventDefault();
        setPaymentError(null); // Réinitialiser les erreurs

        // S'assurer que Stripe et Elements sont chargés
        if (!stripe || !elements) {
            console.log("Stripe.js n'est pas encore chargé.");
            return;
        }

        setIsProcessing(true); setPaymentError(null);
        // 1. Récupérer une référence au CardElement
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

    const cardElementOptions = { style: { base: { fontSize: '16px', color: '#333', '::placeholder': { color: '#6a6a6a' }, padding: '12px' }, invalid: { color: '#fa755a', iconColor: '#fa755a' } }, hidePostalCode: true };
    const subscribeButtonStyle = { ...styles.subscribeButton, backgroundColor: theme.primaryColor };

    return (
        <div style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <button type='button' style={styles.applePayButton}> Payer</button>
                <p style={styles.orDivider}>ou payer par carte</p>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                <label style={styles.label}>Informations de la carte</label>
                <div style={styles.cardElementContainer}><CardElement options={cardElementOptions} /></div>
                <label htmlFor="nomSurCarte" style={styles.label}>Nom sur la carte</label>
                <input id="nomSurCarte" type="text" value={nomSurCarte} onChange={(e) => setNomSurCarte(e.target.value)} style={styles.input} required />
                <label htmlFor="pays" style={styles.label}>Pays ou région</label>
                <select id="pays" value={pays} onChange={(e) => setPays(e.target.value)} style={styles.input} required disabled={isLoading}>
                    {isLoading ? (<option>Chargement...</option>) : (countries.map((c) => (<option key={c.code} value={c.name}>{c.name}</option>)))}
                </select>
                <label htmlFor="zip" style={styles.label}>CODE POSTAL</label>
                <input id="zip" type="text" value={zip} onChange={(e) => setZip(e.target.value)} style={styles.input} required />

                {paymentError && (<div style={styles.errorText}>{paymentError}</div>)}
                <button type="submit" style={subscribeButtonStyle} disabled={!stripe || isLoading || isProcessing}>
                    {isProcessing ? 'Traitement...' : "Valider le Paiement"} {/* Texte Bouton */}
                </button>
                <p style={styles.termsText}>En confirmant, vous autorisez le prélèvement sur votre carte...</p> {/* Texte Conditions */}
            </form>
        </div>
    );
};

// -----------------------------------------------------------

/**
 * Composant principal de la Passerelle de Paiement
 */
const PasserelleDePaiement = () => {
    // === BDDELNA HNA: OrderInfo initialisé à null ===
    const [orderInfo, setOrderInfo] = useState(null); // Sera rempli par l'URL
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [currentTheme, setCurrentTheme] = useState(themes['default']);

    // === BDDELNA HNA: useEffect simple qui lit l'URL SANS appeler l'API ===
    useEffect(() => {
        console.log("Lecture des paramètres URL...");
        const params = new URLSearchParams(window.location.search);

        const origin = params.get('origin') || 'default'; // Lire l'origine
        const themeToApply = themes[origin] || themes['default'];
        console.log("Application du thème pour l'origine:", origin, themeToApply);
        setCurrentTheme(themeToApply); // Appliquer le thème

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

        // Resize listener (reste identique)
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // <-- Se lance une seule fois

    // Styles dynamiques
    const pageContainerStyle = isMobile ? styles.pageContainerMobile : styles.pageContainer;
    const leftPanelStyle = isMobile
        ? { ...styles.leftPanelMobile, backgroundColor: currentTheme.secondaryColor }
        : { ...styles.leftPanel, backgroundColor: currentTheme.secondaryColor };
    const rightPanelStyle = isMobile ? styles.rightPanelMobile : styles.rightPanel;
    const backLinkStyle = { ...styles.backLink, /* Pas de couleur dynamique ici */ }; // Lien retour standard

    const options = { appearance: { theme: 'stripe' } };

    // Helper pour afficher la liste des produits
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

                {/* Lien retour utilise l'origine stockée */}
                <a href={orderInfo?.origin ? `https://${orderInfo.origin}` : '#'} style={backLinkStyle}>← Retour</a>

                {/* === BDDELNA HNA: Affichage direct SANS loading/error state === */}
                {orderInfo ? (
                    <div style={styles.summaryContainer}>
                        {/* Utiliser le logo de l'URL ou celui du thème comme fallback */}
                        {/* Kaychof wach kayn logo f l URL, ila makanch kaystakhdem dyal Theme */}
                        {(orderInfo.logo || currentTheme.logoUrl) &&
                            <img
                                src={orderInfo.logo || currentTheme.logoUrl}
                                alt="Logo"
                                style={styles.summaryLogo} // Kay'appliquer lih had style
                            />}
                        {/* ============================================== */}

                        <h4 style={styles.summaryTitle}>Récapitulatif de la commande</h4>

                        <div style={styles.productList}>
                            {renderProductList(orderInfo.produit)}
                        </div>

                        <hr style={styles.summarySeparator} />

                        <div style={styles.totalRow}>
                            <span style={styles.totalLabel}>Total à payer</span>
                            <span style={styles.totalPrice}>€{parseFloat(orderInfo.total).toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
                    // Message si orderInfo est encore null (ne devrait pas arriver longtemps)
                    <div style={styles.summaryContainer}><h1 style={styles.priceText}>Chargement...</h1></div>
                )}

                <div style={styles.footerLinks}>
                    <a href="#" style={styles.footerLink}>Conditions</a>
                    <a href="#" style={styles.footerLink}>Confidentialité</a>
                </div>
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

// Styles (Les mêmes que la version précédente, avec panier moderne et logo)
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
    errorText: { color: 'red', fontSize: '14px', marginTop: '10px' }
};

export default PasserelleDePaiement;