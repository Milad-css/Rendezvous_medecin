from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# ── Palette "Dark Elegance" ──────────────────────────────────────────────────
BG           = RGBColor(0x0F, 0x0F, 0x1A)   # fond quasi-noir
PANEL        = RGBColor(0x1A, 0x1A, 0x2E)   # panneaux sombres
CARD         = RGBColor(0x16, 0x21, 0x3E)   # cartes bleu marine
PURPLE       = RGBColor(0x9B, 0x59, 0xB6)   # violet principal
PURPLE_LIGHT = RGBColor(0xBB, 0x86, 0xFC)   # violet clair
GOLD         = RGBColor(0xF3, 0xC6, 0x23)   # doré accent
TEAL         = RGBColor(0x00, 0xD2, 0xBF)   # turquoise accent
PINK         = RGBColor(0xFF, 0x63, 0x84)   # rose accent
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)
OFF_WHITE    = RGBColor(0xE0, 0xE0, 0xFF)   # blanc légèrement bleuté
GRAY         = RGBColor(0xA0, 0xA0, 0xC0)   # texte secondaire
GREEN_ACC    = RGBColor(0x00, 0xE5, 0x76)   # vert accent
ORANGE_ACC   = RGBColor(0xFF, 0x8C, 0x00)   # orange accent

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

# ── Helpers ──────────────────────────────────────────────────────────────────
def rect(slide, l, t, w, h, fill=None, line=None, lw=0):
    sh = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    sh.fill.solid() if fill else sh.fill.background()
    if fill: sh.fill.fore_color.rgb = fill
    if line and lw:
        sh.line.color.rgb = line
        sh.line.width = Pt(lw)
    else:
        sh.line.fill.background()
    return sh

def txt(slide, text, l, t, w, h, size=14, bold=False, color=WHITE,
        align=PP_ALIGN.LEFT, italic=False, wrap=True):
    tb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tb.word_wrap = wrap
    tf = tb.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    return tb

def add_para(tf, text, size=13, bold=False, color=OFF_WHITE,
             align=PP_ALIGN.LEFT, sp=7, italic=False):
    p = tf.add_paragraph()
    p.alignment = align
    p.space_before = Pt(sp)
    r = p.add_run()
    r.text = text
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    return p

def bg(slide):
    """Fond sombre uniforme."""
    rect(slide, 0, 0, 13.33, 7.5, fill=BG)

def side_bar(slide, color=PURPLE):
    """Barre verticale décorative à gauche."""
    rect(slide, 0, 0, 0.07, 7.5, fill=color)

def header_line(slide, title, sub=None, accent=PURPLE):
    """Titre avec ligne de soulignement colorée."""
    txt(slide, title, 0.35, 0.25, 12.0, 0.75,
        size=30, bold=True, color=WHITE)
    if sub:
        txt(slide, sub, 0.35, 0.95, 12.0, 0.4,
            size=13, color=GRAY, italic=True)
    # ligne
    rect(slide, 0.35, 1.0 if not sub else 1.3, 2.0, 0.06, fill=accent)
    rect(slide, 2.38 if not sub else 2.38, 1.0 if not sub else 1.3,
         0.06, 0.06, fill=GOLD)
    # pied de page
    rect(slide, 0, 7.3, 13.33, 0.2, fill=PANEL)
    txt(slide, "RendezVous App  |  Projet de Stage  |  2025-2026",
        0.3, 7.3, 12.7, 0.2, size=9, color=GRAY, align=PP_ALIGN.CENTER)

def badge(slide, label, l, t, color=PURPLE):
    rect(slide, l, t, len(label) * 0.09 + 0.3, 0.32, fill=color)
    txt(slide, label, l + 0.08, t + 0.04, len(label) * 0.09 + 0.2, 0.26,
        size=10, bold=True, color=WHITE)

def card(slide, l, t, w, h, accent=PURPLE, title=None, items=None, desc=None):
    """Carte sombre avec bord coloré en haut."""
    rect(slide, l, t, w, h, fill=CARD)
    rect(slide, l, t, w, 0.06, fill=accent)
    if title:
        txt(slide, title, l + 0.15, t + 0.12, w - 0.3, 0.42,
            size=13, bold=True, color=accent)
    if desc:
        txt(slide, desc, l + 0.15, t + 0.55, w - 0.3, h - 0.65,
            size=11, color=OFF_WHITE, wrap=True)
    if items:
        tb = slide.shapes.add_textbox(
            Inches(l + 0.15), Inches(t + 0.55),
            Inches(w - 0.3), Inches(h - 0.65))
        tb.word_wrap = True
        tf = tb.text_frame; tf.word_wrap = True
        for j, item in enumerate(items):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.space_before = Pt(6)
            r = p.add_run()
            r.text = "  " + item
            r.font.size = Pt(11.5)
            r.font.color.rgb = OFF_WHITE

# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 1 — TITRE
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s)
# Lignes décoratives diagonales simulées par des rectangles fins
rect(s, 0, 0, 13.33, 0.06, fill=PURPLE)
rect(s, 0, 7.44, 13.33, 0.06, fill=GOLD)

# Bloc central
rect(s, 1.8, 1.3, 9.7, 4.8, fill=PANEL)
rect(s, 1.8, 1.3, 9.7, 0.08, fill=PURPLE)
rect(s, 1.8, 6.02, 9.7, 0.08, fill=GOLD)

# Carré décoratif
rect(s, 1.8, 1.3, 0.08, 4.8, fill=PURPLE)
rect(s, 11.42, 1.3, 0.08, 4.8, fill=GOLD)

# Icône
txt(s, "🏥", 5.9, 1.5, 1.5, 1.1, size=52, align=PP_ALIGN.CENTER)

txt(s, "RendezVous App", 2.0, 2.5, 9.3, 1.1,
    size=46, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

# Ligne accent
rect(s, 3.5, 3.65, 6.3, 0.05, fill=PURPLE)
rect(s, 5.65, 3.65, 2.0, 0.05, fill=GOLD)

txt(s, "Système de Gestion des Rendez-Vous Médicaux",
    2.0, 3.8, 9.3, 0.55, size=18, color=PURPLE_LIGHT, align=PP_ALIGN.CENTER)

txt(s, "React  ·  Laravel 12  ·  Redux  ·  TailwindCSS  ·  Sanctum",
    2.0, 4.45, 9.3, 0.4, size=12, color=TEAL, align=PP_ALIGN.CENTER)

txt(s, "Rapport de Stage — Développement Web Full-Stack",
    2.0, 4.95, 9.3, 0.4, size=12, italic=True, color=GRAY, align=PP_ALIGN.CENTER)

txt(s, "Réalisé par : Milad Aanas     |     Année : 2025-2026",
    2.0, 5.45, 9.3, 0.35, size=11, color=GOLD, align=PP_ALIGN.CENTER)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 2 — PLAN
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, GOLD)
header_line(s, "Sommaire", accent=GOLD)

sections = [
    ("01", "Contexte & Objectifs",        PURPLE),
    ("02", "Présentation du Projet",       TEAL),
    ("03", "Architecture Technique",       PINK),
    ("04", "Stack Technologique",          GOLD),
    ("05", "Fonctionnalités Clés",         GREEN_ACC),
    ("06", "Base de Données",              ORANGE_ACC),
    ("07", "Sécurité & Auth",             PURPLE_LIGHT),
    ("08", "API RESTful",                 TEAL),
    ("09", "Interface Utilisateur",        PINK),
    ("10", "Conclusion & Perspectives",    GOLD),
]
cols = [0.4, 6.9]
for i, (num, title, color) in enumerate(sections):
    col = i % 2; row = i // 2
    lx = cols[col]; ty = 1.6 + row * 1.08
    rect(s, lx, ty, 6.1, 0.9, fill=CARD)
    rect(s, lx, ty, 0.06, 0.9, fill=color)
    rect(s, lx + 0.15, ty + 0.15, 0.55, 0.6, fill=PANEL)
    txt(s, num, lx + 0.15, ty + 0.18, 0.55, 0.55,
        size=16, bold=True, color=color, align=PP_ALIGN.CENTER)
    txt(s, title, lx + 0.85, ty + 0.22, 5.1, 0.5,
        size=14, color=WHITE)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 3 — CONTEXTE & OBJECTIFS
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, PURPLE)
header_line(s, "Contexte & Objectifs", "Pourquoi ce projet ?", PURPLE)

# Colonne gauche
rect(s, 0.35, 1.55, 5.95, 5.6, fill=CARD)
rect(s, 0.35, 1.55, 5.95, 0.06, fill=PURPLE)
txt(s, "⚕  Problématique", 0.5, 1.65, 5.7, 0.45, size=14, bold=True, color=PURPLE_LIGHT)
ctx = [
    "La prise de RDV médicaux reste souvent manuelle,\ncronophage et sujette aux erreurs.",
    "Les patients doivent appeler, attendre et oublient parfois leurs créneaux.",
    "Les secrétaires gèrent des agendas papier difficiles à maintenir.",
    "Le secteur médical a besoin de sa transformation numérique.",
]
ty = 2.2
for item in ctx:
    rect(s, 0.5, ty, 0.04, 0.5, fill=PURPLE)
    txt(s, item, 0.65, ty - 0.05, 5.5, 0.65, size=12, color=OFF_WHITE, wrap=True)
    ty += 0.78

# Colonne droite
rect(s, 6.8, 1.55, 6.15, 5.6, fill=CARD)
rect(s, 6.8, 1.55, 6.15, 0.06, fill=GOLD)
txt(s, "🎯  Objectifs", 6.95, 1.65, 5.9, 0.45, size=14, bold=True, color=GOLD)
objs = [
    ("Développer", "une app web full-stack de gestion de RDV médicaux"),
    ("Implémenter", "un système multi-rôles complet (Patient / Médecin / Secrétaire)"),
    ("Concevoir", "une API RESTful sécurisée avec Laravel Sanctum"),
    ("Créer", "une interface React moderne, réactive et intuitive"),
    ("Maîtriser", "les bonnes pratiques du développement web professionnel"),
]
ty = 2.2
for kw, rest in objs:
    rect(s, 6.95, ty, 5.8, 0.72, fill=PANEL)
    rect(s, 6.95, ty, 0.06, 0.72, fill=GOLD)
    txt(s, kw, 7.1, ty + 0.06, 1.2, 0.35, size=12, bold=True, color=GOLD)
    txt(s, rest, 7.1, ty + 0.36, 5.5, 0.3, size=11, color=GRAY, wrap=True)
    ty += 0.85


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 4 — PRÉSENTATION DU PROJET
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, TEAL)
header_line(s, "Présentation du Projet", "Qui utilise l'application ?", TEAL)

txt(s, "Une plateforme médicale connectant Patients, Médecins et Secrétaires autour de la gestion intelligente des rendez-vous.",
    0.35, 1.55, 12.6, 0.55, size=13, color=GRAY, italic=True, wrap=True)

roles = [
    ("👤", "Patient", TEAL, [
        "Inscription & connexion sécurisée",
        "Consulter les services disponibles",
        "Prendre un RDV en ligne",
        "Suivre le statut (en attente / confirmé / annulé)",
        "Annuler un RDV",
        "Modifier son profil",
    ]),
    ("🩺", "Médecin", PURPLE, [
        "Créer & gérer son profil médical",
        "Définir ses services (nom, durée, prix)",
        "Créer ses créneaux horaires",
        "Vue calendrier interactive",
        "Créer un compte secrétaire",
        "Voir tous ses RDV",
    ]),
    ("📋", "Secrétaire", GOLD, [
        "Voir la liste de tous les patients",
        "Gérer tous les rendez-vous",
        "Confirmer des RDV en attente",
        "Annuler ou supprimer des RDV",
        "Assistance administrative complète",
        "Interface dédiée et sécurisée",
    ]),
]
for i, (icon, role, color, items) in enumerate(roles):
    lx = 0.35 + i * 4.32
    rect(s, lx, 2.25, 4.1, 4.9, fill=CARD)
    rect(s, lx, 2.25, 4.1, 0.08, fill=color)
    rect(s, lx, 2.25, 4.1, 0.7, fill=PANEL)
    txt(s, icon + "  " + role, lx + 0.15, 2.32, 3.8, 0.55,
        size=18, bold=True, color=color)
    tb = s.shapes.add_textbox(Inches(lx + 0.15), Inches(3.05), Inches(3.8), Inches(4.0))
    tb.word_wrap = True
    tf = tb.text_frame; tf.word_wrap = True
    for j, item in enumerate(items):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.space_before = Pt(7)
        r = p.add_run(); r.text = "›  " + item
        r.font.size = Pt(12); r.font.color.rgb = OFF_WHITE


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 5 — ARCHITECTURE TECHNIQUE
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, PINK)
header_line(s, "Architecture Technique", "Architecture 3-Tiers — SPA + REST API + BDD", PINK)

layers = [
    ("🖥", "FRONTEND", "Client React", TEAL, [
        "React 19  (SPA)",
        "Redux Toolkit",
        "TailwindCSS 4",
        "React Router DOM",
        "Axios HTTP Client",
        "FullCalendar 6",
        "Vite 8 (build)",
    ]),
    ("⚙", "BACKEND", "API Laravel", PURPLE, [
        "Laravel 12  (PHP 8.2)",
        "Laravel Sanctum (auth)",
        "Eloquent ORM",
        "7 Contrôleurs",
        "7 Modèles Eloquent",
        "50+ Routes API",
        "Middleware RBAC",
    ]),
    ("🗄", "DATABASE", "Données", GOLD, [
        "SQLite / MySQL",
        "8 Migrations",
        "7 Tables relationnelles",
        "Clés étrangères (FK)",
        "Factories & Seeders",
        "Timestamps auto",
        "PHPUnit Tests",
    ]),
]

for i, (icon, label, sublabel, color, items) in enumerate(layers):
    lx = 0.35 + i * 4.32
    # cadre
    rect(s, lx, 1.6, 4.0, 5.55, fill=CARD)
    rect(s, lx, 1.6, 4.0, 0.08, fill=color)
    # en-tête
    rect(s, lx, 1.6, 4.0, 0.9, fill=PANEL)
    txt(s, icon, lx + 0.15, 1.62, 0.6, 0.85, size=28, color=color)
    txt(s, label, lx + 0.75, 1.68, 3.1, 0.38, size=14, bold=True, color=color)
    txt(s, sublabel, lx + 0.75, 2.04, 3.1, 0.3, size=10, color=GRAY)
    # items
    tb = s.shapes.add_textbox(Inches(lx + 0.2), Inches(2.6), Inches(3.6), Inches(4.4))
    tb.word_wrap = True
    tf = tb.text_frame; tf.word_wrap = True
    for j, item in enumerate(items):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.space_before = Pt(6)
        r = p.add_run(); r.text = "▸  " + item
        r.font.size = Pt(12.5); r.font.color.rgb = OFF_WHITE

# Flèches entre les couches
for fx in [4.37, 8.7]:
    txt(s, "⟶", fx, 3.8, 0.6, 0.55, size=22, color=color, align=PP_ALIGN.CENTER)
    txt(s, "HTTP" if fx < 5 else "ORM", fx, 4.35, 0.6, 0.3,
        size=9, color=GRAY, align=PP_ALIGN.CENTER)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 6 — STACK TECHNOLOGIQUE
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, GOLD)
header_line(s, "Stack Technologique", "Technologies utilisées dans ce projet", GOLD)

techs = [
    ("React 19",       "Interface utilisateur",       "Frontend",  TEAL),
    ("Laravel 12",     "Framework PHP backend",        "Backend",   PURPLE),
    ("TailwindCSS 4",  "Styles utilitaires",           "Frontend",  RGBColor(0x06, 0xB6, 0xD4)),
    ("Redux Toolkit",  "Gestion d'état global",        "Frontend",  PURPLE_LIGHT),
    ("Sanctum",        "Auth par tokens Bearer",       "Sécurité",  PINK),
    ("FullCalendar",   "Calendrier interactif",        "Frontend",  GREEN_ACC),
    ("Axios",          "Client HTTP / API calls",      "Frontend",  RGBColor(0x67, 0x1D, 0xBC)),
    ("Vite 8",         "Bundler ultra-rapide",         "DevTools",  GOLD),
    ("PHP 8.2",        "Langage serveur",              "Backend",   ORANGE_ACC),
    ("SQLite/MySQL",   "Base de données relationnelle","Backend",   RGBColor(0x00, 0x97, 0xA7)),
]
cols_n = 5
for i, (name, role, cat, color) in enumerate(techs):
    col = i % cols_n; row = i // cols_n
    lx = 0.3 + col * 2.56
    ty = 1.6 + row * 2.75
    rect(s, lx, ty, 2.38, 2.5, fill=CARD)
    rect(s, lx, ty, 2.38, 0.08, fill=color)
    # badge catégorie
    rect(s, lx + 0.1, ty + 0.15, 1.1, 0.28, fill=color)
    txt(s, cat, lx + 0.12, ty + 0.17, 1.06, 0.24, size=8, bold=True, color=BG)
    txt(s, name, lx + 0.1, ty + 0.55, 2.2, 0.55,
        size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    txt(s, role, lx + 0.1, ty + 1.1, 2.2, 1.2,
        size=10.5, color=GRAY, align=PP_ALIGN.CENTER, wrap=True)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 7 — FONCTIONNALITÉS CLÉS
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, GREEN_ACC)
header_line(s, "Fonctionnalités Clés", "Ce que fait l'application", GREEN_ACC)

feats = [
    ("🔐", "Auth Multi-Rôle",      PURPLE,    "Inscription / connexion sécurisée. Trois rôles distincts avec accès séparés. Token Sanctum + localStorage."),
    ("📅", "Prise de RDV",          TEAL,      "Le patient sélectionne médecin, service et créneau. RDV créé avec statut 'en attente' automatiquement."),
    ("⚙️",  "Gestion Services",     GOLD,      "Le médecin crée ses services médicaux (nom, durée en min, prix en DH). Suppression dynamique."),
    ("🗓",  "Créneaux Horaires",    GREEN_ACC, "Création de plages disponibles. Marquage automatique 'indisponible' après réservation."),
    ("📊",  "Calendrier Visuel",    PINK,      "Interface FullCalendar pour visualiser les RDV par jour, semaine ou mois. Vue interactive."),
    ("✅",  "Gestion Statuts",      ORANGE_ACC,"Trois statuts : En attente → Confirmé / Annulé. Secrétaire gère les confirmations."),
]
for i, (icon, title, color, desc) in enumerate(feats):
    col = i % 2; row = i // 2
    lx = 0.3 + col * 6.55
    ty = 1.6 + row * 1.82
    rect(s, lx, ty, 6.25, 1.65, fill=CARD)
    rect(s, lx, ty, 0.08, 1.65, fill=color)
    txt(s, icon, lx + 0.18, ty + 0.12, 0.65, 0.6, size=24, color=color)
    txt(s, title, lx + 0.9, ty + 0.1, 5.2, 0.45, size=14, bold=True, color=color)
    txt(s, desc, lx + 0.9, ty + 0.57, 5.2, 0.95, size=11.5, color=OFF_WHITE, wrap=True)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 8 — BASE DE DONNÉES
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, ORANGE_ACC)
header_line(s, "Base de Données", "Modèle Relationnel — 7 Tables", ORANGE_ACC)

tables = [
    ("users",       "id · nom · prenom · email · password · role",                              PURPLE),
    ("patients",    "id · user_id* · telephone",                                                TEAL),
    ("medecins",    "id · user_id* · specialite · adresse · photo",                             TEAL),
    ("secretaires", "id · user_id* · medecin_id*",                                              TEAL),
    ("services",    "id · medecin_id* · nom · duree · prix",                                   GOLD),
    ("creneaux",    "id · medecin_id* · date · heure_debut · heure_fin · disponible",           GREEN_ACC),
    ("rendez_vous", "id · patient_id* · service_id* · creneau_id* · date · heure · status",    ORANGE_ACC),
]

positions = [(0.3, 1.6), (0.3, 2.85), (4.65, 2.85), (9.0, 2.85),
             (0.3, 4.1), (4.65, 4.1), (0.3, 5.35)]
widths =    [12.7, 4.2, 4.2, 4.0, 4.2, 4.2, 12.7]

for i, ((lx, ty), w, (name, fields, color)) in enumerate(zip(positions, widths, tables)):
    rect(s, lx, ty, w, 1.1, fill=CARD)
    rect(s, lx, ty, w, 0.08, fill=color)
    rect(s, lx, ty, 1.35, 1.1, fill=PANEL)
    txt(s, name, lx + 0.1, ty + 0.15, 1.2, 0.6,
        size=11, bold=True, color=color, align=PP_ALIGN.CENTER, wrap=True)
    txt(s, fields, lx + 1.5, ty + 0.22, w - 1.65, 0.65,
        size=10.5, color=OFF_WHITE, wrap=True)

txt(s, "* = Clé Étrangère (FK)   ·   Toutes les tables : created_at / updated_at",
    0.3, 6.58, 12.7, 0.3, size=10, color=GRAY, align=PP_ALIGN.CENTER)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 9 — SÉCURITÉ & AUTH
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, PURPLE_LIGHT)
header_line(s, "Sécurité & Authentification", "Protéger l'API et les routes frontend", PURPLE_LIGHT)

# Flux horizontal
steps = [
    ("Inscription\n/ Connexion", TEAL),
    ("Token\nSanctum", PURPLE),
    ("localStorage", GOLD),
    ("Axios\nInterceptor", PINK),
    ("Bearer\nToken API", GREEN_ACC),
    ("Middleware\nAuth", ORANGE_ACC),
]
box_w = 1.9
for i, (label, color) in enumerate(steps):
    lx = 0.3 + i * 2.17
    rect(s, lx, 1.6, box_w, 0.9, fill=PANEL)
    rect(s, lx, 1.6, box_w, 0.07, fill=color)
    txt(s, label, lx + 0.05, 1.67, box_w - 0.1, 0.85,
        size=10.5, bold=True, color=color, align=PP_ALIGN.CENTER, wrap=True)
    if i < 5:
        txt(s, "→", lx + box_w + 0.05, 1.9, 0.22, 0.45,
            size=18, bold=True, color=GRAY, align=PP_ALIGN.CENTER)

# 4 cartes de sécurité
sec = [
    ("🔑", "Laravel Sanctum",  PURPLE,     "Authentification par token Bearer. Chaque token est lié à un utilisateur. Révocation propre à la déconnexion."),
    ("🔒", "bcrypt  ×12",      TEAL,       "Hashage des mots de passe avec 12 rounds. Aucun mot de passe jamais stocké en clair dans la base."),
    ("👮", "RBAC Complet",     GOLD,       "Trois rôles : Patient, Médecin, Secrétaire. Middleware backend + ProtectedRoutes React pour sécuriser chaque vue."),
    ("🛡", "Routes Sécurisées",PINK,       "ProtectedRoutes valide l'auth ET le rôle. Redirection automatique vers Login si accès non autorisé."),
]
for i, (icon, title, color, desc) in enumerate(sec):
    lx = 0.3 + i * 3.26
    rect(s, lx, 2.75, 3.1, 4.4, fill=CARD)
    rect(s, lx, 2.75, 3.1, 0.08, fill=color)
    txt(s, icon, lx + 0.15, 2.9, 0.55, 0.6, size=26, color=color)
    txt(s, title, lx + 0.8, 2.9, 2.15, 0.55, size=13, bold=True, color=color)
    txt(s, desc, lx + 0.15, 3.55, 2.8, 3.4, size=11.5, color=OFF_WHITE, wrap=True)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 10 — API RESTful
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, TEAL)
header_line(s, "API RESTful", "Base URL :  http://127.0.0.1:8000/api", TEAL)

METHOD_COLOR = {
    "GET":    TEAL,
    "POST":   GREEN_ACC,
    "PUT":    GOLD,
    "DELETE": PINK,
}

def api_col(slide, lx, header, header_color, routes, ty_start=1.6, col_w=6.1):
    rect(slide, lx, ty_start, col_w, 5.55, fill=CARD)
    rect(slide, lx, ty_start, col_w, 0.08, fill=header_color)
    rect(slide, lx, ty_start, col_w, 0.55, fill=PANEL)
    txt(slide, header, lx + 0.15, ty_start + 0.08, col_w - 0.3, 0.42,
        size=12, bold=True, color=header_color)
    tb = slide.shapes.add_textbox(
        Inches(lx + 0.15), Inches(ty_start + 0.65),
        Inches(col_w - 0.3), Inches(4.8))
    tb.word_wrap = True
    tf = tb.text_frame; tf.word_wrap = True
    for j, (method, endpoint, label) in enumerate(routes):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.space_before = Pt(5)
        mc = METHOD_COLOR.get(method, GRAY)
        r1 = p.add_run(); r1.text = method + " "; r1.font.size = Pt(10)
        r1.font.bold = True; r1.font.color.rgb = mc
        r2 = p.add_run(); r2.text = endpoint + "  "; r2.font.size = Pt(9.5)
        r2.font.color.rgb = OFF_WHITE
        r3 = p.add_run(); r3.text = label; r3.font.size = Pt(9)
        r3.font.italic = True; r3.font.color.rgb = GRAY

public_r = [
    ("POST",   "/register",           "Inscription patient"),
    ("POST",   "/login",              "Connexion"),
    ("POST",   "/medecin/creer",      "Créer compte médecin"),
    ("GET",    "/medecin/{id}",       "Profil médecin"),
    ("GET",    "/services/{id}",      "Services d'un médecin"),
    ("GET",    "/creneaux/{id}",      "Créneaux disponibles"),
    ("GET",    "/check-email",        "Vérif. email existant"),
]
protected_r = [
    ("GET",    "/patient/profil",                       "Mon profil"),
    ("PUT",    "/patient/modifier",                     "Modifier profil"),
    ("POST",   "/rendez-vous/prendre",                  "Prendre un RDV"),
    ("PUT",    "/rendez-vous/annuler/{id}",             "Annuler mon RDV"),
    ("GET",    "/rendez-vous",                          "Mes RDV"),
    ("POST",   "/service/creer",                        "Créer service"),
    ("DELETE", "/service/supprimer/{id}",               "Supprimer service"),
    ("POST",   "/creneau/creer",                        "Créer créneau"),
    ("PUT",    "/secretaire/rdv/confirmer/{id}",        "Confirmer RDV"),
    ("DELETE", "/secretaire/rdv/supprimer/{id}",        "Supprimer RDV"),
    ("POST",   "/logout",                               "Déconnexion"),
]
api_col(s, 0.3,  "  Routes Publiques  (sans token)", TEAL,   public_r)
api_col(s, 6.85, "  Routes Protégées  (Bearer token requis)", PURPLE, protected_r)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 11 — INTERFACE UTILISATEUR
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, PINK)
header_line(s, "Interface Utilisateur", "Single Page Application — React + TailwindCSS", PINK)

txt(s, "Navigation fluide avec React Router DOM  ·  État global Redux  ·  Requêtes Axios",
    0.35, 1.55, 12.6, 0.38, size=12, color=GRAY, italic=True)

screens = [
    ("🔑", "Authentification", TEAL, [
        "Page Login / Register",
        "Validation côté client",
        "Redirection selon le rôle",
        "Gestion des erreurs affichée",
        "Persistance token localStorage",
    ]),
    ("👤", "Dashboard Patient", PURPLE, [
        "Profil modifiable en ligne",
        "Catalogue des services",
        "Prise de RDV intuitive",
        "Suivi des statuts RDV",
        "Annulation en un clic",
    ]),
    ("🩺", "Dashboard Médecin", GOLD, [
        "Gestion services (CRUD)",
        "Création de créneaux",
        "Vue calendrier FullCalendar",
        "Liste de tous les RDV",
        "Création compte secrétaire",
    ]),
    ("📋", "Dashboard Secrétaire", PINK, [
        "Liste de tous les patients",
        "Tous les RDV centralisés",
        "Confirmation des RDV",
        "Annulation / Suppression",
        "Gestion administrative",
    ]),
]
for i, (icon, title, color, items) in enumerate(screens):
    lx = 0.3 + i * 3.24
    rect(s, lx, 2.05, 3.1, 5.1, fill=CARD)
    rect(s, lx, 2.05, 3.1, 0.08, fill=color)
    rect(s, lx, 2.05, 3.1, 0.75, fill=PANEL)
    txt(s, icon, lx + 0.12, 2.1, 0.55, 0.65, size=26, color=color)
    txt(s, title, lx + 0.7, 2.13, 2.3, 0.55, size=13, bold=True, color=color, wrap=True)
    tb = s.shapes.add_textbox(Inches(lx + 0.15), Inches(2.9), Inches(2.85), Inches(4.1))
    tb.word_wrap = True
    tf = tb.text_frame; tf.word_wrap = True
    for j, item in enumerate(items):
        p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
        p.space_before = Pt(8)
        r = p.add_run(); r.text = "›  " + item
        r.font.size = Pt(12); r.font.color.rgb = OFF_WHITE


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 12 — DÉFIS & SOLUTIONS
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, ORANGE_ACC)
header_line(s, "Défis & Solutions", "Problèmes rencontrés et comment ils ont été résolus", ORANGE_ACC)

challenges = [
    ("Gestion Multi-Rôle",        PURPLE,    "Accès strictement séparés côté frontend ET backend.",  "RBAC via middleware Laravel + ProtectedRoutes React."),
    ("Synchronisation État",       TEAL,      "Cohérence du token et du rôle dans toute l'app React.", "Redux AuthSlice + localStorage + Axios interceptor auto."),
    ("Disponibilité Créneaux",     GOLD,      "Éviter les doubles réservations simultanées.",           "Champ 'disponible' mis à jour en BDD lors de la réservation."),
    ("Intégration Calendrier",     PINK,      "Affichage correct des RDV selon les plages horaires.",  "FullCalendar 6 avec plugins DayGrid, TimeGrid, Interaction."),
]
for i, (title, color, challenge, solution) in enumerate(challenges):
    col = i % 2; row = i // 2
    lx = 0.3 + col * 6.6
    ty = 1.6 + row * 2.78
    rect(s, lx, ty, 6.25, 2.55, fill=CARD)
    rect(s, lx, ty, 6.25, 0.08, fill=color)
    rect(s, lx, ty, 6.25, 0.65, fill=PANEL)
    txt(s, "⚡  " + title, lx + 0.15, ty + 0.1, 5.9, 0.48, size=14, bold=True, color=color)
    # Défi
    rect(s, lx + 0.15, ty + 0.78, 0.08, 0.55, fill=PINK)
    txt(s, "Défi  ›  " + challenge, lx + 0.35, ty + 0.75, 5.7, 0.6, size=11.5, color=GRAY, italic=True, wrap=True)
    # Solution
    rect(s, lx + 0.15, ty + 1.42, 0.08, 0.75, fill=GREEN_ACC)
    txt(s, "Solution  ›  " + solution, lx + 0.35, ty + 1.4, 5.7, 0.85, size=11.5, bold=True, color=OFF_WHITE, wrap=True)


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 13 — CONCLUSION & PERSPECTIVES
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s); side_bar(s, GOLD)
header_line(s, "Conclusion & Perspectives", "Ce que ce stage m'a apporté — et ce qui reste à faire", GOLD)

rect(s, 0.3, 1.6, 6.0, 5.55, fill=CARD)
rect(s, 0.3, 1.6, 6.0, 0.08, fill=GREEN_ACC)
rect(s, 0.3, 1.6, 6.0, 0.65, fill=PANEL)
txt(s, "✅  Bilan du Stage", 0.45, 1.68, 5.7, 0.48, size=14, bold=True, color=GREEN_ACC)
bilan = [
    "Application web full-stack fonctionnelle de A à Z",
    "Système multi-rôle complet et sécurisé",
    "API RESTful avec 50+ endpoints documentés",
    "Interface React moderne et réactive",
    "Authentification robuste (Sanctum + bcrypt)",
    "Calendrier médical interactif (FullCalendar)",
    "Maîtrise : React, Redux, Laravel, TailwindCSS",
    "Architecture Client-Serveur professionnelle",
]
tb = s.shapes.add_textbox(Inches(0.45), Inches(2.35), Inches(5.7), Inches(4.6))
tb.word_wrap = True
tf = tb.text_frame; tf.word_wrap = True
for j, item in enumerate(bilan):
    p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
    p.space_before = Pt(8)
    r = p.add_run(); r.text = "✔  " + item
    r.font.size = Pt(12.5); r.font.color.rgb = OFF_WHITE

rect(s, 6.9, 1.6, 6.1, 5.55, fill=CARD)
rect(s, 6.9, 1.6, 6.1, 0.08, fill=PURPLE_LIGHT)
rect(s, 6.9, 1.6, 6.1, 0.65, fill=PANEL)
txt(s, "🚀  Perspectives d'Évolution", 7.05, 1.68, 5.8, 0.48, size=14, bold=True, color=PURPLE_LIGHT)
persp = [
    "Notifications email / SMS automatiques",
    "Application mobile (React Native / Flutter)",
    "Paiement en ligne des consultations",
    "Dossier médical patient numérique",
    "Tableau de bord analytique & statistiques",
    "Géolocalisation des cabinets médicaux",
    "Intégration systèmes hospitaliers (HL7)",
    "Déploiement cloud (AWS / VPS)",
]
tb2 = s.shapes.add_textbox(Inches(7.05), Inches(2.35), Inches(5.8), Inches(4.6))
tb2.word_wrap = True
tf2 = tb2.text_frame; tf2.word_wrap = True
for j, item in enumerate(persp):
    p = tf2.paragraphs[0] if j == 0 else tf2.add_paragraph()
    p.space_before = Pt(8)
    r = p.add_run(); r.text = "→  " + item
    r.font.size = Pt(12.5); r.font.color.rgb = OFF_WHITE


# ════════════════════════════════════════════════════════════════════════════
#  SLIDE 14 — MERCI
# ════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
bg(s)
rect(s, 0, 0, 13.33, 7.5, fill=BG)

# Cercles décoratifs (simulés par des carrés — pptx ne supporte pas les ellipses facilement)
for lx, ty, w, color in [
    (0.0, 5.0, 3.5, PANEL),
    (10.0, 0.0, 3.5, PANEL),
    (5.5, 5.5, 2.0, PANEL),
]:
    rect(s, lx, ty, w, w, fill=color)

rect(s, 0, 0, 13.33, 0.07, fill=PURPLE)
rect(s, 0, 7.43, 13.33, 0.07, fill=GOLD)

txt(s, "Merci pour votre attention !", 1.0, 1.5, 11.3, 1.3,
    size=44, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rect(s, 3.5, 2.95, 2.7, 0.07, fill=PURPLE)
rect(s, 6.25, 2.95, 0.07, 0.07, fill=GOLD)
rect(s, 6.35, 2.95, 3.5, 0.07, fill=TEAL)

txt(s, "Questions & Discussion", 1.0, 3.15, 11.3, 0.7,
    size=22, color=PURPLE_LIGHT, align=PP_ALIGN.CENTER)

rect(s, 2.5, 4.1, 8.3, 1.8, fill=PANEL)
rect(s, 2.5, 4.1, 8.3, 0.07, fill=PURPLE)
txt(s, "RendezVous App  —  Système de Gestion des RDV Médicaux",
    2.6, 4.2, 8.1, 0.5, size=14, italic=True, color=GRAY, align=PP_ALIGN.CENTER)
txt(s, "React  ·  Laravel 12  ·  Redux  ·  TailwindCSS  ·  Sanctum  ·  FullCalendar",
    2.6, 4.75, 8.1, 0.4, size=12, color=TEAL, align=PP_ALIGN.CENTER)
txt(s, "Milad Aanas   |   iblameanas21@gmail.com   |   2025-2026",
    2.6, 5.3, 8.1, 0.45, size=12, color=GOLD, align=PP_ALIGN.CENTER)


# ── Sauvegarde ───────────────────────────────────────────────────────────────
out = r"d:\RendezVousApp\Project\RendezVousApp_Presentation_Stage.pptx"
prs.save(out)
print(f"OK  -->  {out}  ({len(prs.slides)} slides)")
