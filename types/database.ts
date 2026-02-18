export type Role = 'admin' | 'bureau' | 'conducteur';
export type ProfilVehicule = 'VL' | 'PL';
export type AbsenceType = 'cp' | 'cp_anticipation' | 'sans_solde' | 'maladie' | 'accident_travail' | 'exceptionnelle';
export type AbsenceStatut = 'en_attente' | 'validee' | 'refusee';
export type ReleveStatut = 'brouillon' | 'soumis' | 'valide' | 'corrige' | 'conteste';
export type PeriodeStatut = 'ouverte' | 'cloturee';
export type MessageType = 'note_service' | 'info' | 'rappel' | 'urgent';
export type Destinataires = 'tous' | 'conducteurs_pl' | 'conducteurs_vl' | 'bureau';
export type CategorieType = 'frais' | 'prime';
export type CategorieVehicule = 'VL' | 'PL' | 'tous';

export interface Profile {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: Role;
    profil_vehicule: ProfilVehicule | null;
    actif: boolean;
    created_at: string;
}

export interface Absence {
    id: string;
    employe_id: string;
    type: AbsenceType;
    date_dernier_jour_travaille: string;
    date_reprise: string;
    choix_dates_2: { dernier_jour: string; reprise: string } | null;
    choix_dates_3: { dernier_jour: string; reprise: string } | null;
    commentaire: string | null;
    statut: AbsenceStatut;
    motif_refus: string | null;
    validee_par: string | null;
    date_validation: string | null;
    derniere_minute: boolean;
    created_at: string;
    updated_at: string;
    // Joined
    employe?: Profile;
    validateur?: Profile;
}

export interface PeriodeFrais {
    id: string;
    date_debut: string;
    date_fin: string;
    statut: PeriodeStatut;
    created_at: string;
}

export interface ReleveFrais {
    id: string;
    employe_id: string;
    periode_id: string;
    statut: ReleveStatut;
    total_frais: number;
    total_primes: number;
    total_general: number;
    validee_par: string | null;
    date_validation: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    employe?: Profile;
    periode?: PeriodeFrais;
    lignes_frais?: LigneFrais[];
    lignes_primes?: LignePrime[];
}

export interface CategorieFrais {
    id: string;
    nom: string;
    montant_defaut: number;
    profil_vehicule: CategorieVehicule;
    type: CategorieType;
    ordre_affichage: number;
    actif: boolean;
}

export interface LigneFrais {
    id: string;
    releve_id: string;
    date_jour: string;
    categorie_id: string;
    montant: number;
    coche: boolean;
    corrige_par_admin: boolean;
    categorie?: CategorieFrais;
}

export interface LignePrime {
    id: string;
    releve_id: string;
    date_jour: string;
    categorie_id: string;
    montant: number;
    quantite: number;
    corrige_par_admin: boolean;
    categorie?: CategorieFrais;
}

export interface CorrectionFrais {
    id: string;
    releve_id: string;
    admin_id: string;
    champ_modifie: string;
    ancienne_valeur: string;
    nouvelle_valeur: string;
    date_correction: string;
    notes: string | null;
    admin?: Profile;
}

export interface Contestation {
    id: string;
    releve_id: string;
    employe_id: string;
    message: string;
    statut: 'ouverte' | 'resolue';
    created_at: string;
    resolue_at: string | null;
}

export interface Message {
    id: string;
    auteur_id: string;
    titre: string;
    contenu: string;
    type: MessageType;
    destinataires: Destinataires;
    piece_jointe_url: string | null;
    created_at: string;
    lu_par: string[];
    auteur?: Profile;
}

export interface Notification {
    id: string;
    destinataire_id: string;
    type: string;
    titre: string;
    contenu: string;
    lue: boolean;
    lien: string | null;
    created_at: string;
    lue_at: string | null;
}

// Supabase Database type (simplified)
export interface Database {
    public: {
        Tables: {
            profiles: { Row: Profile; Insert: Omit<Profile, 'created_at'>; Update: Partial<Profile> };
            absences: { Row: Absence; Insert: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'employe' | 'validateur'>; Update: Partial<Absence> };
            periodes_frais: { Row: PeriodeFrais; Insert: Omit<PeriodeFrais, 'id' | 'created_at'>; Update: Partial<PeriodeFrais> };
            releves_frais: { Row: ReleveFrais; Insert: Omit<ReleveFrais, 'id' | 'created_at' | 'updated_at' | 'employe' | 'periode' | 'lignes_frais' | 'lignes_primes'>; Update: Partial<ReleveFrais> };
            categories_frais: { Row: CategorieFrais; Insert: Omit<CategorieFrais, 'id'>; Update: Partial<CategorieFrais> };
            lignes_frais: { Row: LigneFrais; Insert: Omit<LigneFrais, 'id' | 'categorie'>; Update: Partial<LigneFrais> };
            lignes_primes: { Row: LignePrime; Insert: Omit<LignePrime, 'id' | 'categorie'>; Update: Partial<LignePrime> };
            corrections_frais: { Row: CorrectionFrais; Insert: Omit<CorrectionFrais, 'id' | 'admin'>; Update: Partial<CorrectionFrais> };
            contestations: { Row: Contestation; Insert: Omit<Contestation, 'id' | 'created_at'>; Update: Partial<Contestation> };
            messages: { Row: Message; Insert: Omit<Message, 'id' | 'created_at' | 'auteur'>; Update: Partial<Message> };
            notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Notification> };
        };
    };
}
