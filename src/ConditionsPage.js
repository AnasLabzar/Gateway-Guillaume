import React from 'react';

const ConditionsPage = () => (
    <>
        <p><strong>Date d'entrée en vigueur :</strong> [Date - ex: 27 octobre 2025]</p>
        
        <h2>1. Introduction</h2>
        <p>
            Bienvenue sur [Nom de l'Entreprise Origine] (exploitant le site 1rdv1mandat.com) et sa passerelle de paiement associée (paiement-service.fr). 
            Les présentes Conditions Générales d'Utilisation (CGU) régissent votre utilisation de nos services, y compris le processus de paiement via notre passerelle. 
            En utilisant nos services, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
        </p>
        <p>
            La passerelle de paiement paiement-service.fr est opérée par [Nom de l'Entité Opérant la Passerelle, si différent] pour le compte de [Nom de l'Entreprise Origine], 
            située à [Adresse Complète de l'Entreprise Origine], immatriculée sous le numéro [Numéro SIRET/RC].
        </p>

        <h2>2. Description des Services</h2>
        <p>
            [Nom de l'Entreprise Origine] fournit des services de [Décrire brièvement les services principaux de 1rdv1mandat.com, ex: mise en relation immobilière, gestion de mandats, etc.]. 
            La passerelle paiement-service.fr permet le paiement sécurisé des frais associés à ces services.
        </p>

        <h2>3. Processus de Commande et de Paiement</h2>
        <p>
            Lorsque vous initiez une commande sur 1rdv1mandat.com, vous êtes redirigé vers paiement-service.fr pour finaliser le paiement. 
            Les informations de votre commande (produits/services, montant total) sont transmises de manière sécurisée. 
            Vous devrez fournir des informations de paiement valides (carte bancaire, etc.) via notre partenaire de paiement sécurisé Stripe. 
            En soumettant vos informations de paiement, vous autorisez [Nom de l'Entreprise Origine] (via Stripe) à débiter le montant indiqué.
        </p>
        <p>
            Les prix sont indiqués en [Devise, ex: Euros (€)] et incluent [Indiquer si TTC ou HT, ex: toutes taxes comprises (TTC)].
        </p>

        <h2>4. Obligations de l'Utilisateur</h2>
        <p>Vous vous engagez à :</p>
        <ul>
            <li>Fournir des informations exactes, complètes et à jour lors de la commande et du paiement.</li>
            <li>Utiliser les services conformément à la loi et aux présentes CGU.</li>
            <li>Ne pas utiliser la passerelle de paiement à des fins frauduleuses ou illégales.</li>
            <li>Être le titulaire légitime du moyen de paiement utilisé ou avoir l'autorisation de l'utiliser.</li>
        </ul>

        <h2>5. Sécurité des Paiements</h2>
        <p>
            Nous prenons la sécurité de vos paiements très au sérieux. Les transactions sont traitées par Stripe, une plateforme de paiement certifiée PCI DSS Niveau 1. 
            Vos données de carte bancaire ne sont pas stockées sur nos serveurs. Elles sont cryptées et transmises directement à Stripe via une connexion sécurisée (SSL/TLS).
        </p>

        <h2>6. Propriété Intellectuelle</h2>
        <p>
            Tous les contenus présents sur 1rdv1mandat.com et paiement-service.fr (textes, logos, images, etc.) sont la propriété exclusive de [Nom de l'Entreprise Origine] ou de ses concédants et sont protégés par les lois sur la propriété intellectuelle.
        </p>

        <h2>7. Limitation de Responsabilité</h2>
        <p>
            [Nom de l'Entreprise Origine] ne saurait être tenu responsable des interruptions de service, erreurs techniques, ou dommages indirects résultant de l'utilisation de la passerelle de paiement, sauf en cas de faute lourde ou intentionnelle de sa part. 
            Notre responsabilité est limitée au montant de la transaction concernée.
        </p>

        <h2>8. Modification des CGU</h2>
        <p>
            Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications prendront effet dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page.
        </p>

        <h2>9. Droit Applicable et Juridiction</h2>
        <p>
            Ces CGU sont régies par le droit [Pays, ex: français ou marocain]. Tout litige relatif à leur interprétation ou exécution sera soumis à la compétence exclusive des tribunaux de [Ville du Tribunal, ex: Paris ou Marrakech].
        </p>

        <h2>10. Contact</h2>
        <p>
            Pour toute question concernant ces CGU, veuillez nous contacter à :<br />
            [Nom de l'Entreprise Origine]<br />
            [Adresse Complète]<br />
            Email : [Adresse Email de Contact]<br />
            Téléphone : [Numéro de Téléphone]
        </p>
    </>
);

export default ConditionsPage;