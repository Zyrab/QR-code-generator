import { ActionKey } from "@/lib/actions";

export const landing = {
  title: {
    title: "Générateur de QR Code gratuit, sans inscription, sans expiration",
    subtitle: "Générez des QR codes statiques pour vos URL instantanément. Téléchargez, imprimez et utilisez-les pour toujours."
  },
  whatIsQr: {
    title: "Qu'est-ce qu'un QR Code ?",
    subtitle: [
      "Un QR code est un type de code-barres qui ouvre un lien lorsqu'il est scanné avec l'appareil photo d'un téléphone. Il est couramment utilisé pour partager des sites web, des vidéos, des menus, des formulaires et des pages de contact, surtout sur des supports imprimés.",
      "Contrairement aux liens courts, les QR codes fonctionnent instantanément et ne nécessitent aucune saisie.",
    ],
    img: "scanning-qr"
  },
  staticVsDynamic: {
    title: "QR Codes Statiques vs Dynamiques",
    content: [
      {
        title: "QR Codes Statiques (Gratuits)",
        items: ["Le lien est intégré directement dans le QR code", "N'expirent jamais", "Fonctionnent hors ligne après création", "Idéal pour l'impression"],
        footer: "C'est ce que vous générez gratuitement sur cette page."
      },
      {
        title: "QR Codes Dynamiques (Payants)",
        items: ["Le QR code pointe vers une redirection", "La destination peut être modifiée plus tard", "Nécessite un serveur pour rester actif", "Utile pour les campagnes et le suivi"],
        footer: "Utile lorsque vous devez modifier les liens après l'impression."
      },
    ],
    footer:
      "De nombreux générateurs « gratuits » utilisent des codes dynamiques par défaut, qui cessent de fonctionner si vous ne payez pas. Cet outil vous donne des QR codes statiques dès le départ, sans expiration cachée.",
  },
  unsure: {
    title: "Vous ne savez pas lequel choisir ?",
    subtitle: "Commencez par un QR code statique gratuit, passez à la version supérieure uniquement si vous avez besoin de plus de contrôle.",
    button: { label: "Générer un QR code gratuit", action: "scroll_to_generator" satisfies ActionKey } as const
  },
  examples: {
    title: "Des QR Codes de haute qualité personnalisables",
    subtitle: "Un QR code doit se scanner instantanément tout en restant esthétique à l'impression. Personnalisez les couleurs, les formes et les logos sans nuire à la lisibilité.",
    images: [],
    notice: "Tous les exemples sont des QR codes statiques sans expiration.",
    content: [
      { title: "Formes personnalisées", subtitle: "Commencez par un QR code statique gratuit, améliorez-le si nécessaire.", img: "custum-shapes" },
      { title: "Couleurs de marque", subtitle: "Respectez votre image de marque tout en gardant un fort contraste pour un scan fiable.", img: "custumize-colors" },
      { title: "Support de logo", subtitle: "Ajoutez votre logo au centre, suppression de l'arrière-plan incluse.", img: "logo-support" },
      { title: "Prêt pour l'impression", subtitle: "Des QR codes nets et haute résolution adaptés à l'impression et au numérique.", img: "high-quality-export" },
    ],
    footer: "Le générateur empêche les combinaisons qui réduisent la scannabilité."
  },
  pricing: {
    title: "Gratuit et Payant. Ce qui est inclus",
    subtitle: "Vous pouvez générer et télécharger des QR codes statiques gratuitement. Créez un compte uniquement si vous souhaitez les sauvegarder ou les gérer.",
    content: [
      {
        title: "Gratuit (Sans compte)",
        items: ["Générez des QR codes statiques illimités", "Téléchargement instantané", "Aucune expiration", "Pas de suivi (tracking)", "Non sauvegardé sur le serveur"],
        button: { label: "Générer un QR code gratuit", action: "scroll_to_generator" satisfies ActionKey },
      },
      {
        title: "Compte gratuit",
        items: ["Sauvegardez jusqu'à 10 QR codes statiques", "Accès depuis n'importe quel appareil", "Modifier le design (l'URL reste la même)"],
        button: { label: "Créer un compte gratuit", action: "go_to_login" satisfies ActionKey }
      },
      {
        title: "À partir de 3 $ / mois",
        items: ["Changez le lien de destination à tout moment", "Tableau de bord de gestion", "Conçu pour les campagnes et mises à jour", "Nécessite un plan actif"],
        button: { label: "Obtenir des QR codes dynamiques", action: "go_to_pricing" satisfies ActionKey }
      }
    ],
    footer: "Les QR codes statiques conviennent à la plupart des usages imprimés. Les codes dynamiques ne sont nécessaires que si la destination doit changer après l'impression."
  },
  usefullness: {
    title: "Quand les QR Codes dynamiques sont-ils utiles ?",
    content: [
      { title: "Mise à jour des menus", text: "Mettre à jour un menu de restaurant sans réimprimer", icon: "utensils", color: "#E6D839" },
      { title: "Modifier un lien de campagne", text: "Changer le lien d'une campagne après son lancement", icon: "unlink", color: "#E42929" },
      { title: "Redirections temporaires", text: "Rediriger les utilisateurs pendant des promotions à durée limitée", icon: "discount", color: "#1C8D00" },
      { title: "Gestion multi-sites", text: "Gérer plusieurs emplacements à partir d'un seul QR code", icon: "alt_location", color: "#2288C7" },
    ],
    note: "Si rien de tout cela ne s'applique, un QR code statique gratuit est généralement suffisant."
  },
  faq: {
    title: "Foire Aux Questions",
    content: [
      {
        question: "Les QR codes gratuits le sont-ils vraiment ?",
        answer: "Oui. Les QR codes statiques générés ici sont gratuits à créer, télécharger et utiliser. Ils n'expirent pas."
      },
      {
        question: "Ai-je besoin d'un compte pour générer un QR code ?",
        answer: "Non. Vous pouvez générer et télécharger des QR codes statiques sans vous connecter. Un compte n'est nécessaire que pour les sauvegarder et les gérer."
      },
      {
        question: "Mon QR code cessera-t-il de fonctionner plus tard ?",
        answer: "Les QR codes statiques continueront de fonctionner tant que l'URL de destination existe."
      },
      {
        question: "Quelle est la différence entre les QR codes statiques et dynamiques ?",
        answer: "Les QR codes statiques contiennent le lien directement et ne peuvent pas être modifiés. Les codes dynamiques redirigent via un serveur, permettant de mettre à jour la destination plus tard."
      },
      {
        question: "Les QR codes dynamiques sont-ils gratuits ?",
        answer: "Non. Les QR codes dynamiques nécessitent un plan actif car ils dépendent d'une infrastructure serveur."
      },
      {
        question: "Puis-je utiliser ces QR codes pour l'impression ?",
        answer: "Oui. Les QR codes générés sont en haute résolution et conviennent aux affiches, menus, emballages et cartes de visite."
      },
      {
        question: "Ajoutez-vous un suivi ou des analyses aux QR codes gratuits ?",
        answer: "Non. Les QR codes statiques n'incluent pas de suivi."
      },
    ],
  },
  why: {
    title: "Pourquoi ce générateur de QR Code existe",
    subtitle: ["De nombreux outils de QR code se disent « gratuits » mais reposent sur des liens qui expirent ou des restrictions cachées. Ce projet a été conçu pour offrir une alternative simple et honnête.", "Les QR codes statiques gratuits doivent rester gratuits. Les fonctionnalités payantes doivent être claires et optionnelles."],
    img: "others-vs-us",
    notice: "Pas de pièges. Pas d'inscriptions forcées. Pas de surprises."
  }
};