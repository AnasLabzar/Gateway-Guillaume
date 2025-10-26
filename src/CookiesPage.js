import React from 'react';

const CookiesPage = () => (
    <>
        <p><strong>Dernière mise à jour :</strong> [Date - ex: 27 octobre 2025]</p>
        
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
            Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile par votre navigateur web lorsque vous visitez certains sites internet. 
            Il permet au site de se souvenir de vos actions et préférences (comme la connexion, la langue, la taille de la police et d'autres préférences d'affichage) pendant une certaine période, 
            afin que vous n'ayez pas à les re-saisir chaque fois que vous revenez sur le site ou naviguez d'une page à l'autre.
        </p>

        <h2>2. Comment utilisons-nous les cookies sur paiement-service.fr ?</h2>
        <p>
            Notre passerelle de paiement, paiement-service.fr, utilise principalement des cookies **strictement nécessaires** pour assurer son bon fonctionnement et la sécurité du processus de paiement. Ces cookies sont essentiels pour :
        </p>
        <ul>
            <li>Maintenir votre session active pendant le processus de paiement.</li>
            <li>Assurer la sécurité de la transaction (par exemple, prévention de la fraude via des tokens de session).</li>
            <li>Faciliter l'intégration avec notre partenaire de paiement Stripe (Stripe peut également déposer ses propres cookies nécessaires, régis par leur politique).</li>
        </ul>
        <p>
            Ces cookies sont généralement des **cookies de session**, qui sont supprimés lorsque vous fermez votre navigateur.
        </p>
        <p>
            Nous n'utilisons **pas** de cookies de performance, de fonctionnalité ou de ciblage/publicité directement sur la passerelle paiement-service.fr. 
            Le site d'origine ([Nom de l'Entreprise Origine] - 1rdv1mandat.com) peut utiliser d'autres types de cookies, qui sont décrits dans sa propre politique de cookies.
        </p>

        <h2>3. Cookies Tiers</h2>
        <p>
            Comme mentionné, notre partenaire de paiement **Stripe** peut déposer ses propres cookies techniques nécessaires au traitement sécurisé du paiement. 
            Nous vous invitons à consulter la politique de cookies de Stripe pour plus d'informations sur leur utilisation.
        </p>
        <p>
            [Mentionner ici si vous utilisez d'autres services tiers qui déposent des cookies sur la passerelle, ex: Google Analytics (peu probable sur une simple passerelle), outils de monitoring, etc. Sinon, supprimer ce paragraphe.]
        </p>

        <h2>4. Gestion des Cookies</h2>
        <p>
            Étant donné que nous n'utilisons que des cookies strictement nécessaires au fonctionnement de la passerelle de paiement, votre consentement n'est pas requis pour leur dépôt.
        </p>
        <p>
            Vous pouvez cependant contrôler et/ou supprimer les cookies comme vous le souhaitez via les paramètres de votre navigateur. Pour plus de détails, consultez aboutcookies.org. 
            Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et configurer la plupart des navigateurs pour qu'ils les bloquent. 
            Toutefois, si vous faites cela, vous devrez peut-être ajuster manuellement certaines préférences chaque fois que vous visitez un site et certains services et fonctionnalités peuvent ne pas fonctionner.
        </p>

        <h2>5. Modifications de la Politique</h2>
        <p>
            Nous pouvons mettre à jour cette politique de cookies. Nous vous encourageons à la consulter régulièrement.
        </p>

        <h2>6. Contact</h2>
        <p>
             Pour toute question concernant notre utilisation des cookies, veuillez nous contacter à l'adresse fournie dans notre Politique de Confidentialité.
        </p>
    </>
);

export default CookiesPage;