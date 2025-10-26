import React from 'react';
import { Link } from 'react-router-dom';

const ConfidentialitePage = () => (
    <>
        <p><strong>Dernière mise à jour :</strong> [Date - ex: 27 octobre 2025]</p>
        
        <h2>1. Introduction</h2>
        <p>
            La présente Politique de Confidentialité décrit comment [Nom de l'Entreprise Origine] (exploitant 1rdv1mandat.com et la passerelle paiement-service.fr, ci-après "nous") collecte, utilise et protège vos données personnelles lorsque vous utilisez nos services. 
            Nous nous engageons à protéger votre vie privée conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables.
        </p>
        <p>
            Responsable du traitement : [Nom de l'Entreprise Origine], [Adresse Complète], Email : [Email DPO ou contact vie privée].
        </p>

        <h2>2. Données Collectées</h2>
        <p>Nous collectons différents types de données :</p>
        <ul>
            <li>
                <strong>Données fournies par vous :</strong> Lors de l'utilisation du formulaire sur 1rdv1mandat.com et de la passerelle de paiement, nous collectons : nom, prénom, adresse email, numéro de téléphone, [Lister les autres champs du formulaire WPForms], nom sur la carte, pays, code postal.
            </li>
            <li>
                <strong>Données de Paiement :</strong> Les informations complètes de votre carte bancaire sont collectées et traitées directement par notre partenaire Stripe. Nous ne stockons pas ces informations sensibles, mais nous pouvons conserver un identifiant de transaction ou les derniers chiffres de la carte à des fins de gestion.
            </li>
            <li>
                <strong>Données Techniques :</strong> Lorsque vous visitez paiement-service.fr, nous pouvons collecter automatiquement : adresse IP, type de navigateur, système d'exploitation, informations sur l'appareil, pages visitées, heure et date d'accès (via les logs serveur ou des outils d'analyse basiques).
            </li>
            <li>
                <strong>Données de l'Origine :</strong> Nous recevons des informations sur la commande (montant total, nom des produits) depuis le site d'origine (1rdv1mandat.com) via l'URL sécurisée.
            </li>
        </ul>

        <h2>3. Utilisation des Données</h2>
        <p>Nous utilisons vos données pour :</p>
        <ul>
            <li>Traiter et sécuriser vos paiements via Stripe.</li>
            <li>Vous fournir les services commandés sur 1rdv1mandat.com.</li>
            <li>Associer le paiement à votre commande initiale via l'identifiant unique.</li>
            <li>Communiquer avec vous concernant votre transaction ou votre compte.</li>
            <li>Améliorer la sécurité et la performance de notre passerelle de paiement.</li>
            <li>Respecter nos obligations légales et réglementaires.</li>
            <li>Prévenir la fraude.</li>
        </ul>
        <p>La base légale de ce traitement est l'exécution du contrat entre vous et [Nom de l'Entreprise Origine] et notre intérêt légitime à sécuriser les transactions.</p>

        <h2>4. Partage des Données</h2>
        <p>Nous ne partageons vos données personnelles qu'avec les tiers suivants :</p>
        <ul>
            <li><strong>Stripe :</strong> Notre prestataire de services de paiement, pour traiter la transaction. Stripe a sa propre politique de confidentialité.</li>
            <li><strong>[Nom de l'Entreprise Origine] :</strong> Les informations relatives au succès ou à l'échec du paiement et les identifiants nécessaires sont partagés avec le site d'origine pour finaliser la commande.</li>
            <li><strong>Autorités légales :</strong> Si requis par la loi ou pour protéger nos droits.</li>
            <li><strong>Prestataires techniques :</strong> Hébergeur (VPS), outils d'analyse (si utilisés), mais uniquement dans la mesure nécessaire à la fourniture du service.</li>
        </ul>
        <p>Nous ne vendons ni ne louons vos données personnelles.</p>

        <h2>5. Sécurité des Données</h2>
        <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées (cryptage SSL/TLS, pare-feu serveur, bonnes pratiques de développement) pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction. Les paiements sont sécurisés par Stripe.
        </p>

        <h2>6. Vos Droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
            <li><strong>Droit d'accès :</strong> Demander une copie des données que nous détenons sur vous.</li>
            <li><strong>Droit de rectification :</strong> Demander la correction des données inexactes.</li>
            <li><strong>Droit à l'effacement ("droit à l'oubli") :</strong> Demander la suppression de vos données, sous certaines conditions.</li>
            <li><strong>Droit à la limitation du traitement :</strong> Demander de limiter l'utilisation de vos données.</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et courant.</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement fondé sur notre intérêt légitime.</li>
        </ul>
        <p>Pour exercer ces droits, veuillez nous contacter à [Email DPO ou contact vie privée]. Vous avez également le droit de déposer une réclamation auprès de l'autorité de contrôle compétente (ex: la CNIL en France).</p>

        <h2>7. Cookies</h2>
        <p>
            Notre passerelle de paiement utilise des cookies essentiels au fonctionnement sécurisé de la session de paiement. Pour plus d'informations, veuillez consulter notre <Link to="/cookies">Politique de Cookies</Link>.
        </p>

        <h2>8. Modifications de la Politique</h2>
        <p>
            Nous pouvons mettre à jour cette politique. La date de la dernière mise à jour sera indiquée en haut. Nous vous encourageons à la consulter régulièrement.
        </p>

        <h2>9. Contact</h2>
        <p>
             Pour toute question relative à cette politique de confidentialité, contactez : [Email DPO ou contact vie privée] ou par courrier à l'adresse indiquée en section 1.
        </p>
    </>
);

export default ConfidentialitePage;