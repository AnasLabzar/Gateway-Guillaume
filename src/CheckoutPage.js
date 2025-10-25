import React, { useState, useEffect } from 'react';
// ⚠️ IMPORTS STRIPE NÉCESSAIRES
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ⚠️ Ces importations sont nécessaires pour une intégration Stripe sécurisée
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// **Étape 1 : Configurer la clé publique Stripe**
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
/**
 * Composant de la colonne de paiement à droite (détails de la carte)
 */
const FormulairePaiement = ({ orderInfo }) => {
    // ✅ **Hooks Stripe**
    const stripe = useStripe();
    const elements = useElements();

    // === BDDELNA HNA: Khllina l email khawi f lewwel ===
    const [email, setEmail] = useState('');
    const [nomSurCarte, setNomSurCarte] = useState('');
    const [countries, setCountries] = useState([]);
    const [pays, setPays] = useState('');
    const [zip, setZip] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // ✅ **Nouveaux états pour le paiement**
    const [paymentError, setPaymentError] = useState(null); // Pour les erreurs
    const [isProcessing, setIsProcessing] = useState(false); // Pour le bouton

    // === BDDELNA HNA: 7eyyedna l fetch dyal /get-user-info ===
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesResponse = await fetch('/countries.json'); // 1. Charger le fichier JSON
                if (!countriesResponse.ok) {
                    throw new Error('Erreur lors du chargement des pays');
                }
                const allCountries = await countriesResponse.json();
                setCountries(allCountries);

                // 7etto l bled lewwel par défaut
                if (allCountries.length > 0) {
                    setPays(allCountries[0].name);
                }

            } catch (error) {
                console.error("Erreur de chargement des données:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCountries();
    }, []); // <-- Khllina ghir l array khawi bach ykhdem merra we7da

    // === JDID: Had useEffect ghay'updater l form melli lma3loumat dyal l URL ywjdo ===
    useEffect(() => {
        if (orderInfo) {
            setEmail(orderInfo.email || '');
            setNomSurCarte(`${orderInfo.prenom || ''} ${orderInfo.nom || ''}`);
        }
    }, [orderInfo]); // Ghaykhdem melli 'orderInfo' tbeddel

    // ✅ **MIS À JOUR :** `handleSubmit` pour gérer le paiement Stripe
    const handleSubmit = async (event) => {
        event.preventDefault();
        setPaymentError(null); // Réinitialiser les erreurs

        // S'assurer que Stripe et Elements sont chargés
        if (!stripe || !elements) {
            console.log("Stripe.js n'est pas encore chargé.");
            return;
        }

        setIsProcessing(true); // Bloquer le bouton

        // 1. Récupérer une référence au CardElement
        const cardElement = elements.getElement(CardElement);

        // 2. Créer un "PaymentMethod" (le token sécurisé)
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: nomSurCarte,
                email: email,
                address: {
                    country: countries.find(c => c.name === pays)?.code, // Envoyer le code pays (ex: "FR")
                    postal_code: zip,
                },
            },
        });

        if (error) {
            console.error(error);
            setPaymentError(error.message); // Afficher l'erreur à l'utilisateur
            setIsProcessing(false);
            return;
        }

        // 3. (SUCCÈS) Envoyer le token (paymentMethod.id) à votre backend
        console.log('PaymentMethod créé:', paymentMethod);

        // === BDDELNA HNA: Qadina l objet 'data' li ghaytsift l backend ===
        const dataToSend = {
            // Data mn l Form
            email: email,
            nomSurCarte: nomSurCarte,
            pays: countries.find(c => c.name === pays)?.code, // Nsifto l code (ex: FR)
            zip: zip,

            // Data mn Stripe
            stripePaymentMethodId: paymentMethod.id,

            // Data mn WordPress (li jat f l URL)
            order_id_wp: orderInfo.order_id_wp,
            total: orderInfo.total,
            produit: orderInfo.produit
        };

        const API_ENDPOINT = `${process.env.REACT_APP_API_URL}/save-payment-details`;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // === BDDELNA HNA: Sifetna l objet 'dataToSend' ===
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('La réponse du serveur n\'est pas OK');
            }

            const result = await response.json();
            console.log('API SUCCESS:', result);

        } catch (error) {
            console.error('Erreur lors de l\'appel API:', error);
        }

        setIsProcessing(false); // Réactiver le bouton
    };

    // ✅ **NOUVEAU :** Style pour le composant CardElement
    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#333',
                '::placeholder': {
                    color: '#6a6a6a',
                },
                padding: '12px'
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        },
        hidePostalCode: true // On gère le code postal séparément
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
                {/* ✅ **REMPLACEMENT :** Utiliser CardElement de Stripe */}
                <label style={styles.label}>Informations de la carte</label>
                <div style={styles.cardElementContainer}>
                    <CardElement options={cardElementOptions} />
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

                {/* ... (Pays et ZIP restent identiques) ... */}
                <label htmlFor="pays" style={styles.label}>Pays ou région</label>
                <select
                    id="pays"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    style={styles.input}
                    required
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <option>Chargement...</option>
                    ) : (
                        countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))
                    )}
                </select>

                <label htmlFor="zip" style={styles.label}>CODE POSTAL</label>
                <input
                    id="zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    style={styles.input}
                    required
                />

                {/* ✅ Affichage des erreurs de paiement */}
                {paymentError && (
                    <div style={styles.errorText}>{paymentError}</div>
                )}

                <button
                    type="submit"
                    style={styles.subscribeButton}
                    disabled={!stripe || isLoading || isProcessing} // Désactiver pendant le paiement
                >
                    {isProcessing ? 'Traitement...' : "S'abonner"}
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

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // === JDID: Khllina had l state bach nkhzno fih lma3loumat dyal l URL ===
    const [orderInfo, setOrderInfo] = useState({
        produit: "Chargement...", // Default
        total: "0.00",          // Default
        email: "",
        nom: "",
        prenom: "",
        order_id_wp: ""
    });

    // === BDDELNA HNA: Zidna l code dyal qraya dyal l URL ===
    useEffect(() => {
        // 1. Qra lma3loumat mn l URL
        const params = new URLSearchParams(window.location.search);

        const total = params.get('total') || "0.00";
        const produit = params.get('produit') || "Commande";
        const email = params.get('email') || "";
        const nom = params.get('nom') || "";
        const prenom = params.get('prenom') || "";
        const order_id_wp = params.get('order_id_wp') || "";

        // 2. 7ett lma3loumat f l state
        setOrderInfo({
            total: parseFloat(total).toFixed(2), // Nqado taman
            produit: produit,
            email: email,
            nom: nom,
            prenom: prenom,
            order_id_wp: order_id_wp
        });

        // 3. Khllina l code dyal isMobile
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // <-- Khllih khawi bach ykhdem merra we7da

    const pageContainerStyle = isMobile ? styles.pageContainerMobile : styles.pageContainer;
    const leftPanelStyle = isMobile ? styles.leftPanelMobile : styles.leftPanel;
    const rightPanelStyle = isMobile ? styles.rightPanelMobile : styles.rightPanel;

    // ✅ **Étape 2 : Configuration des options pour Stripe Elements**
    const options = {
        // Idéalement, vous devriez créer un "PaymentIntent" sur votre serveur
        // et passer le 'clientSecret' ici.
        // Pour une simple sauvegarde de carte, ce n'est pas obligatoire,
        // mais c'est nécessaire pour un paiement direct.
        // clientSecret: 'pi_..._secret_...', 
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <div style={pageContainerStyle}>
            {/* Colonne de GAUCHE (Résumé) */}
            <div style={leftPanelStyle}>

                {/* === BDDELNA HNA: Rje3na l site dyal WordPress === */}
                <a href="https://1rdv1mandat.com" style={styles.backLink}>← Retour</a>

                <div style={styles.summaryContainer}>
                    {/* === BDDELNA HNA: Stakhdmna lma3loumat dyal l URL === */}
                    <p style={styles.subscribeText}>Finaliser le paiement pour</p>
                    <h1 style={styles.priceText}>€{orderInfo.total}
                        <span style={styles.perMonth}></span> {/* 7iyedna 'par mois' */}
                    </h1>
                    <p style={styles.planDescription}>Votre commande: {orderInfo.produit}</p>

                    <div style={styles.itemRow}>
                        <div style={styles.itemDescription}>
                            <span style={styles.productName}>{orderInfo.produit}</span>
                            <span style={styles.billingCycle}>Qté 1</span>
                        </div>
                        <span style={styles.itemPrice}>€{orderInfo.total}</span>
                    </div>
                </div>

                <div style={styles.footerLinks}>
                    <a href="#" style={styles.footerLink}>Conditions</a>
                    <a href="#" style={styles.footerLink}>Confidentialité</a>
                </div>
            </div>

            {/* Colonne de DROITE (Formulaire) */}
            <div style={rightPanelStyle}>
                <Elements stripe={stripePromise} options={options}>
                    {/* === BDDELNA HNA: Dowwezna lma3loumat l l component dyal l form === */}
                    <FormulairePaiement orderInfo={orderInfo} />
                </Elements>
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
    },
    // Style pour le conteneur du CardElement de Stripe
    cardElementContainer: {
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
    },
    errorText: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
    }
};

export default PasserelleDePaiement;