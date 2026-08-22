import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "tr" | "en" | "fr";
export const LOCALES: { code: Locale; label: string }[] = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

type Dict = Record<string, { tr: string; en: string; fr: string }>;

export const dict: Dict = {
  "nav.books": { tr: "Kitaplar", en: "Books", fr: "Livres" },
  "nav.collections": { tr: "Koleksiyonlar", en: "Collections", fr: "Collections" },
  "nav.english": { tr: "İngilizce", en: "English", fr: "Anglais" },
  "nav.french": { tr: "Fransızca", en: "French", fr: "Français" },
  "nav.about": { tr: "Hakkımızda", en: "About", fr: "À propos" },
  "nav.account": { tr: "Hesabım", en: "Account", fr: "Compte" },
  "nav.wishlist": { tr: "Favoriler", en: "Wishlist", fr: "Favoris" },
  "nav.cart": { tr: "Sepet", en: "Cart", fr: "Panier" },
  "nav.search": { tr: "Ara", en: "Search", fr: "Rechercher" },
  "nav.home": { tr: "Ana Sayfa", en: "Home", fr: "Accueil" },
  "nav.explore": { tr: "Keşfet", en: "Explore", fr: "Explorer" },
  "nav.admin": { tr: "Yönetim", en: "Admin", fr: "Admin" },

  "hero.eyebrow": { tr: "Bolu'dan tüm Türkiye'ye", en: "From Bolu to all of Türkiye", fr: "De Bolu vers toute la Turquie" },
  "hero.title": {
    tr: "İngilizce ve Fransızca kitaplar, akıllıca seçildi.",
    en: "English and French books, intelligently curated.",
    fr: "Des livres anglais et français, choisis avec intelligence.",
  },
  "hero.subtitle": {
    tr: "Dünyanın en çok konuşulan kitapları, hızlı teslimat ve dürüst fiyatlarla.",
    en: "The world's most talked-about titles, with fast delivery and honest pricing.",
    fr: "Les titres les plus commentés au monde, livrés vite et à prix honnête.",
  },
  "hero.cta": { tr: "Kitapları Keşfet", en: "Explore Books", fr: "Explorer les livres" },
  "hero.cta2": { tr: "Şu An Trend", en: "Trending Now", fr: "Tendances" },

  "section.viewAll": { tr: "Tümünü gör", en: "View all", fr: "Tout voir" },
  "why.title": { tr: "Neden LIVORA?", en: "Why LIVORA?", fr: "Pourquoi LIVORA ?" },
  "why.1.t": { tr: "Özenle seçilmiş", en: "Carefully selected", fr: "Sélection soignée" },
  "why.1.d": { tr: "Katalog büyüklüğü değil, doğru kitaplar.", en: "Not catalogue size — the right books.", fr: "Pas la taille du catalogue, les bons livres." },
  "why.2.t": { tr: "Sadece yeni kitap", en: "New books only", fr: "Livres neufs uniquement" },
  "why.2.d": { tr: "İkinci el yok, kusurlu baskı yok.", en: "No second-hand, no damaged copies.", fr: "Pas d'occasion, pas d'exemplaires abîmés." },
  "why.3.t": { tr: "EN & FR uzmanı", en: "English & French specialists", fr: "Spécialistes EN & FR" },
  "why.3.d": { tr: "Tek odağımız uluslararası kitaplar.", en: "International books are our only focus.", fr: "Les livres internationaux, notre seul métier." },
  "why.4.t": { tr: "Güvenli ödeme", en: "Secure payment", fr: "Paiement sécurisé" },
  "why.4.d": { tr: "3D Secure destekli altyapı.", en: "3D Secure ready infrastructure.", fr: "Infrastructure compatible 3D Secure." },

  "news.title": { tr: "Okuma listene ilham kat", en: "Fuel your reading list", fr: "Nourrissez votre liste de lecture" },
  "news.sub": { tr: "Ayda iki kez, yeni gelenler ve editör seçkileri.", en: "Twice a month: new arrivals and editor picks.", fr: "Deux fois par mois : nouveautés et sélections." },
  "news.cta": { tr: "Abone ol", en: "Subscribe", fr: "S'abonner" },
  "news.ok": { tr: "Teşekkürler! Kaydınız alındı.", en: "Thanks! You're subscribed.", fr: "Merci ! Vous êtes inscrit." },
  "news.email": { tr: "E-posta adresiniz", en: "Your email address", fr: "Votre adresse e-mail" },

  "partners.title": { tr: "Kurucularımız ve destekçilerimiz", en: "Our founders & backers", fr: "Nos fondateurs et partenaires" },

  "book.addToCart": { tr: "Sepete ekle", en: "Add to cart", fr: "Ajouter au panier" },
  "book.buyNow": { tr: "Hemen al", en: "Buy now", fr: "Acheter" },
  "book.why": { tr: "Neden beğeneceksiniz", en: "Why you'll like it", fr: "Pourquoi vous l'aimerez" },
  "book.details": { tr: "Künye", en: "Details", fr: "Détails" },
  "book.related": { tr: "Benzer kitaplar", en: "Related books", fr: "Livres similaires" },
  "book.reviews": { tr: "Yorumlar", en: "Reviews", fr: "Avis" },
  "book.delivery": { tr: "Tahmini teslimat", en: "Estimated delivery", fr: "Livraison estimée" },
  "book.language": { tr: "Kitap dili", en: "Book language", fr: "Langue du livre" },
  "book.publisher": { tr: "Yayınevi", en: "Publisher", fr: "Éditeur" },
  "book.pages": { tr: "Sayfa", en: "Pages", fr: "Pages" },
  "book.format": { tr: "Format", en: "Format", fr: "Format" },
  "book.published": { tr: "Yayın tarihi", en: "Publication date", fr: "Date de publication" },

  "stock.in_stock": { tr: "Stokta", en: "In stock", fr: "En stock" },
  "stock.low_stock": { tr: "Son birkaç adet", en: "Low stock", fr: "Stock faible" },
  "stock.available_to_order": { tr: "Siparişe açık", en: "Available to order", fr: "Sur commande" },
  "stock.preorder": { tr: "Ön sipariş", en: "Pre-order", fr: "Précommande" },
  "stock.out_of_stock": { tr: "Tükendi", en: "Out of stock", fr: "Épuisé" },

  "catalog.title": { tr: "Tüm kitaplar", en: "All books", fr: "Tous les livres" },
  "catalog.filters": { tr: "Filtreler", en: "Filters", fr: "Filtres" },
  "catalog.sort": { tr: "Sırala", en: "Sort", fr: "Trier" },
  "catalog.results": { tr: "sonuç", en: "results", fr: "résultats" },
  "catalog.empty": { tr: "Aramanıza uygun kitap bulamadık.", en: "No books matched your search.", fr: "Aucun livre ne correspond." },
  "catalog.clear": { tr: "Filtreleri temizle", en: "Clear filters", fr: "Effacer les filtres" },
  "sort.recommended": { tr: "Önerilen", en: "Recommended", fr: "Recommandé" },
  "sort.bestsellers": { tr: "Çok satanlar", en: "Best sellers", fr: "Meilleures ventes" },
  "sort.price_asc": { tr: "Fiyat: artan", en: "Price: low to high", fr: "Prix croissant" },
  "sort.price_desc": { tr: "Fiyat: azalan", en: "Price: high to low", fr: "Prix décroissant" },
  "sort.newest": { tr: "En yeni", en: "Newest", fr: "Nouveautés" },

  "cart.title": { tr: "Sepetiniz", en: "Your cart", fr: "Votre panier" },
  "cart.empty": { tr: "Sepetiniz boş.", en: "Your cart is empty.", fr: "Votre panier est vide." },
  "cart.subtotal": { tr: "Ara toplam", en: "Subtotal", fr: "Sous-total" },
  "cart.shipping": { tr: "Kargo", en: "Shipping", fr: "Livraison" },
  "cart.discount": { tr: "İndirim", en: "Discount", fr: "Remise" },
  "cart.total": { tr: "Toplam", en: "Total", fr: "Total" },
  "cart.free": { tr: "Ücretsiz", en: "Free", fr: "Offerte" },
  "cart.checkout": { tr: "Ödemeye geç", en: "Checkout", fr: "Commander" },
  "cart.coupon": { tr: "Kupon kodu", en: "Coupon code", fr: "Code promo" },
  "cart.apply": { tr: "Uygula", en: "Apply", fr: "Appliquer" },
  "cart.freeShipHint": { tr: "kaldı, ücretsiz kargo için", en: "away from free shipping", fr: "pour la livraison offerte" },
  "cart.continue": { tr: "Alışverişe devam et", en: "Continue shopping", fr: "Continuer mes achats" },

  "checkout.title": { tr: "Ödeme", en: "Checkout", fr: "Paiement" },
  "checkout.contact": { tr: "İletişim bilgileri", en: "Contact details", fr: "Coordonnées" },
  "checkout.address": { tr: "Teslimat adresi", en: "Shipping address", fr: "Adresse de livraison" },
  "checkout.payment": { tr: "Ödeme yöntemi", en: "Payment method", fr: "Moyen de paiement" },
  "checkout.bankTransfer": { tr: "Ziraat Bankası havalesi", en: "Ziraat Bank transfer", fr: "Virement bancaire Ziraat" },
  "checkout.bankDetails": { tr: "Banka bilgileri", en: "Bank transfer details", fr: "Coordonnées bancaires" },
  "checkout.bank": { tr: "Banka", en: "Bank", fr: "Banque" },
  "checkout.iban": { tr: "IBAN", en: "IBAN", fr: "IBAN" },
  "checkout.accountHolder": { tr: "Hesap sahibi", en: "Account holder", fr: "Titulaire du compte" },
  "checkout.reference": { tr: "Referans", en: "Reference", fr: "Référence" },
  "checkout.proofUpload": { tr: "Dekont yükle", en: "Upload payment proof", fr: "Téléverser le justificatif" },
  "checkout.proofReady": { tr: "Dekont inceleme için hazır.", en: "Payment proof ready for review.", fr: "Justificatif prêt à être vérifié." },
  "checkout.proofUploading": { tr: "Yükleniyor…", en: "Uploading…", fr: "Téléversement…" },
  "checkout.place": { tr: "Siparişi tamamla", en: "Place order", fr: "Valider la commande" },
  "checkout.guest": { tr: "Üye olmadan devam edebilirsiniz.", en: "You can continue as a guest.", fr: "Vous pouvez continuer en tant qu'invité." },
  "checkout.sandbox": {
    tr: "Ödeme sağlayıcısı henüz bağlanmadı. Sipariş test modunda oluşturulur.",
    en: "No payment provider connected yet. Orders are created in test mode.",
    fr: "Aucun prestataire de paiement connecté. Commandes créées en mode test.",
  },
  "checkout.success": { tr: "Siparişiniz alındı", en: "Your order is confirmed", fr: "Votre commande est confirmée" },

  "account.orders": { tr: "Siparişlerim", en: "My orders", fr: "Mes commandes" },
  "account.profile": { tr: "Profil", en: "Profile", fr: "Profil" },
  "account.signout": { tr: "Çıkış yap", en: "Sign out", fr: "Se déconnecter" },
  "auth.signin": { tr: "Giriş yap", en: "Sign in", fr: "Se connecter" },
  "auth.signup": { tr: "Kayıt ol", en: "Create account", fr: "Créer un compte" },
  "auth.email": { tr: "E-posta", en: "Email", fr: "E-mail" },
  "auth.password": { tr: "Şifre", en: "Password", fr: "Mot de passe" },
  "auth.confirmPassword": { tr: "Şifreyi tekrar yazın", en: "Confirm password", fr: "Confirmer le mot de passe" },
  "auth.name": { tr: "Ad Soyad", en: "Full name", fr: "Nom complet" },
  "auth.phone": { tr: "Telefon", en: "Phone", fr: "Téléphone" },
  "auth.passwordMismatch": { tr: "Şifreler eşleşmiyor.", en: "Passwords do not match.", fr: "Les mots de passe ne correspondent pas." },
  "auth.confirmationSent": { tr: "Doğrulama bağlantısını e-postanıza gönderdik.", en: "We sent a verification link to your email.", fr: "Nous avons envoyé un lien de vérification à votre adresse e-mail." },
  "auth.signupComplete": { tr: "Hesabınız hazır. Şimdi giriş yapabilirsiniz.", en: "Your account is ready. You can sign in now.", fr: "Votre compte est prêt. Vous pouvez maintenant vous connecter." },
  "auth.welcome": {
    tr: "LIVORA'ya hoş geldiniz, evinizde okumanızı sağlayan uluslararası akıllı kütüphaneniz! SINIRLAR OLMADAN okuyun!",
    en: "Welcome to LIVORA, your international smart library allowing you to read like at home! Read WITHOUT BORDERS!",
    fr: "Bienvenue chez LIVORA, votre bibliothèque internationale intelligente pour lire comme chez vous ! Lisez SANS FRONTIÈRES !",
  },

  "common.loading": { tr: "Yükleniyor…", en: "Loading…", fr: "Chargement…" },
  "common.save": { tr: "Kaydet", en: "Save", fr: "Enregistrer" },
  "common.cancel": { tr: "Vazgeç", en: "Cancel", fr: "Annuler" },
  "common.delete": { tr: "Sil", en: "Delete", fr: "Supprimer" },
  "common.edit": { tr: "Düzenle", en: "Edit", fr: "Modifier" },
  "common.new": { tr: "Yeni", en: "New", fr: "Nouveau" },
  "common.demo": { tr: "DEMO veri", en: "DEMO data", fr: "Données DEMO" },
};

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: keyof typeof dict | string) => string };
const LanguageContext = createContext<Ctx>({ locale: "tr", setLocale: () => {}, t: (k) => String(k) });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const stored = window.localStorage.getItem("livora.locale") as Locale | null;
    if (stored && LOCALES.some((l) => l.code === stored)) setLocaleState(stored);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale: (l) => {
        setLocaleState(l);
        window.localStorage.setItem("livora.locale", l);
      },
      t: (key) => {
        const entry = dict[key as string];
        return entry ? entry[locale] : String(key);
      },
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useI18n = () => useContext(LanguageContext);

export function localized<T extends Record<string, unknown>>(row: T, base: string, locale: Locale): string {
  return (row[`${base}_${locale}`] as string) ?? (row[`${base}_en`] as string) ?? "";
}
