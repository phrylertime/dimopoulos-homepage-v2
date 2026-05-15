/* global React */
/* Shared content for all homepage variations — pulls from existing site data. */

const HOMEPAGE_DATA = {
  // Hero imagery — warm color portrait of Gus + B&W architectural for accents
  heroPortrait: 'https://www.dimolaw.com/templates/yootheme/cache/99/gus-dimopoulos-divorce-attorney-99fa8f7e.webp',
  heroArch: 'https://www.dimolaw.com/templates/yootheme/cache/5b/Towers_1727823517-5b38e56c.jpeg',
  editorialImg: 'https://www.dimolaw.com/templates/yootheme/cache/6f/law_firm_1727882452-6f80bdb7.jpeg',

  practiceAreas: [
    { slug: 'divorce', title: 'Divorce', blurb: 'Issues incident to the dissolution of the marital partnership — valuation and distribution of closely-held businesses, real estate, deferred compensation, and complex assets.' },
    { slug: 'high-net-worth-divorce', title: 'High Net Worth Divorce', blurb: 'Maintenance, custody, and support, complicated by significant assets, business interests, and the need for absolute discretion.' },
    { slug: 'child-custody', title: 'Custody', blurb: 'Counseling parents through the emotionally exhausting process of planning how, after divorce, they will continue to raise their children together.' },
    { slug: 'child-support', title: 'Child Support', blurb: 'In New York, both parents are responsible for their children\u2019s support — determined by formula, by income, or by negotiated agreement.' },
    { slug: 'spousal-maintenance', title: 'Spousal Maintenance', blurb: 'Domestic Relations Law §236 (B)(5-a) brought drastic changes that must be understood to achieve the best results.' },
    { slug: 'prenuptial', title: 'Prenuptial Agreements', blurb: 'Before or after the wedding, New York law allows couples to set forth the financial terms of their marriage by contract.' },
    { slug: 'parental-relocation', title: 'Parental Relocation', blurb: 'When the relationship between parents deteriorates, custodial parents may seek to relocate \u2014 a deeply contested area of law.' },
    { slug: 'matrimonial-appeals', title: 'Matrimonial Appeals', blurb: 'With limited exceptions, parties may appeal any decision that substantially affects the merits of the action.' },
    { slug: 'crisis-management', title: 'Crisis Management', blurb: 'Over 20+ years of complicated divorce matters, we have learned the delicate art of managing a crisis with calm and precision.' },
  ],

  attorneys: [
    { slug: 'gus-dimopoulos', name: 'Gus Dimopoulos', role: 'Managing Partner', img: 'https://www.dimolaw.com/templates/yootheme/cache/99/gus-dimopoulos-divorce-attorney-99fa8f7e.webp' },
    { slug: 'kathleen-seavy',  name: 'Kathleen Seavy',  role: 'Associate',         img: 'https://www.dimolaw.com/templates/yootheme/cache/8e/kathleen-seavy-matrimonial-attorney-8e3ad15a.webp' },
    { slug: 'hannah-gaudet',   name: 'Hannah Gaudet',   role: 'Law Clerk',         img: 'https://www.dimolaw.com/templates/yootheme/cache/4f/hannah-gaudet-attorney-4f740237.webp' },
  ],

  testimonials: [
    { quote: 'From the moment I met Gus, I knew I was in good hands. He was empathetic, patient when I needed something explained, strong when I felt weak \u2014 and my prize fighter in the ring.', author: 'Lisa', context: 'Divorce, Westchester' },
    { quote: 'Gus was exactly the person I needed to guide me through an unexpected divorce. He listened, then provided the insight I needed to make intelligent decisions.', author: 'Anthony', context: 'Custody matter' },
    { quote: 'Going through a divorce is one of the most traumatic experiences I have ever faced. Gus Dimopoulos was my rock during this difficult time. His professionalism and expertise were evident throughout.', author: 'Jennifer', context: 'High-net-worth divorce' },
  ],

  awards: [
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/17/gus-dimopoulos-super-lawyers-badge-5-years-17b71fd0.png', alt: 'Super Lawyers — 5 Years Honored' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/4f/gus-dimopoulos-super-lawyers-badge-2025-4ff7cdd8.png', alt: 'Super Lawyers — Selected 2025' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/ae/gus_dimopoulos_5_star_reviews_badge-aec11da0.png', alt: 'Avvo 5 Star Reviews' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/eb/gus_dimopoulos_avvo_rating_10-eb29cb67.png', alt: 'Avvo Rating 10.0 — Top Attorney' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/fb/10-best-attorney-client-satisfaction-removebg-preview-fb4b5554.png', alt: '10 Best Attorney — Client Satisfaction 2019' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/f0/avvo_clients_choice_award_2023-f0f5f844.png', alt: 'Avvo Clients’ Choice Award 2023' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/39/lawyers-of-distinction-2018-3945639d.png', alt: 'Lawyers of Distinction 2018' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/e2/2019-10_BEST_Law_Firm_CLA-Badge-removebg-preview-e2d46bc7.png', alt: '10 Best Law Firm — Client Satisfaction 2019' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/42/faces_of_westchester_2019-42f066af.png', alt: 'Faces of Westchester 2019' },
    { src: 'https://www.dimolaw.com/templates/yootheme/cache/13/Martindale-Hubbel_peer_reviewed_ethical%202-1369cf22.png', alt: 'Martindale-Hubbell — Peer Reviewed, High Ethical Standing' },
  ],

  // Stats — derived from the firm's About copy ("over 20 years", "prominent firm in Westchester")
  stats: [
    { value: '20+',  label: 'Years of practice' },
    { value: '6',    label: 'NY counties served' },
    { value: '10/10', label: 'Avvo rating' },
    { value: '2025', label: 'Super Lawyers (5 yrs)' },
  ],

  newsroom: [
    { kind: 'Podcast',  date: 'Episode 14',     title: 'Hidden assets: when the marital balance sheet doesn\u2019t add up', minutes: '32 min' },
    { kind: 'Article',  date: 'Sep 2024',       title: 'What changed in NY spousal-maintenance law \u2014 and what it means for you', minutes: '6 min read' },
    { kind: 'Newsroom', date: 'Aug 2024',       title: 'Gus Dimopoulos named to Super Lawyers for the fifth consecutive year', minutes: '2 min read' },
  ],

  faqs: [
    { q: 'How long does a divorce in New York take?', a: 'An uncontested divorce can be finalized in a few months; contested matters \u2014 especially involving complex assets or custody \u2014 can run a year or more. We work to keep your matter on the shortest defensible timeline.' },
    { q: 'Do you handle cases outside Westchester?', a: 'Yes. The firm regularly practices in New York City, Putnam, Dutchess, Rockland, and Orange Counties.' },
    { q: 'What does an initial consultation cost?', a: 'We offer a paid initial consultation. We will explain our fee structure clearly before any work begins.' },
    { q: 'Will my matter be handled discreetly?', a: 'Discretion is foundational to our practice. We routinely represent professionals, executives, and public figures whose privacy is non-negotiable.' },
  ],

  contact: {
    phone: '914-472-4242',
    address: '73 Main Street, Tuckahoe, NY 10707',
    email: 'info@dimolaw.com',
    hours: 'Mon–Fri · 9:00–6:00',
  },
};

window.HOMEPAGE_DATA = HOMEPAGE_DATA;
