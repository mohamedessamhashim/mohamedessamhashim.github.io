// Everything editable on the site lives here. Sections render from this file,
// so you can update the site without touching index.html, styles.css or main.js.

export const content = {
  name: 'Mohamed Essam Hashim',
  email: 'mohamedessamhashim@gmail.com',
  cv: { url: 'assets/cv.pdf', filename: 'Mohamed-Essam-Hashim-CV.pdf' },

  links: {
    linkedin: 'https://linkedin.com/in/mohamedehashim',
    github: 'https://github.com/mohamedessamhashim',
    substack: 'https://substack.com/@theseedlab',
  },

  // Section headings are two-tone: [white part, grey part].
  about: {
    badge: 'About',
    heading: ['From clinics in Khartoum', 'to models of the brain.'],
    portrait: {
      src: 'assets/img/portrait',
      width: 800,
      height: 920,
      widths: [640, 800],
      alt: 'Portrait of Mohamed Essam Hashim in a dark jacket and checked scarf.',
    },
    bio: [
      "I'm a physician and computational researcher working where AI meets the brain: neuroimaging, neurogenomics and neuroepidemiology. I trained in medicine in Khartoum, graduating at 19 with distinction, with clinical time in Dar es Salaam and Cairo along the way.",
      'Much of what drives me comes from practising medicine where resources are thin: clinics without scanners, patients without follow-up, data that never makes it into the models built elsewhere. I want the tools we build for the brain to work in those settings too.',
      "Today I'm a research fellow at University Hospitals / Case Western Reserve University in Cleveland, developing deep-learning methods for quantitative MRI. I also contribute to the Global Burden of Disease study and collaborate with Oxford on computational models of working memory.",
    ],
    pillars: [
      {
        title: 'Neuroimaging',
        line: 'Deep learning for quantitative MRI, from MR Fingerprinting to text-guided glioma segmentation.',
      },
      {
        title: 'Neurogenomics',
        line: "Blood-based gene expression in neurodegeneration, starting with IL-6 in Alzheimer's disease.",
      },
      {
        title: 'Neuroepidemiology',
        line: 'Neurological and neuro-oncology burden across North Africa and the Middle East.',
      },
    ],
  },

  timeline: {
    badge: 'Timeline',
    heading: ['The road', 'so far.'],
    // Oldest first, so the story moves forward as you scroll.
    entries: [
      {
        date: 'Sep 2018',
        title: 'Medical school begins',
        detail: 'University of Medical Sciences & Technology, Khartoum, Sudan. Served on the Medical Student Association executive board.',
      },
      {
        date: 'Oct–Nov 2022',
        title: 'Rural residency, Meroe',
        detail: 'Home visits, screenings and school health education in rural Sudan. Assessed clinics and pharmacies and reported shortages to the Ministry of Health.',
      },
      {
        date: '2022–2023',
        title: 'Infectious-disease rotations → thesis',
        detail: 'Post-COVID rotations sparked my thesis: a survey of 277 medical students on infection-prevention awareness and practice.',
      },
      {
        date: 'Jun 2023 – Apr 2024',
        title: 'Clinical elective, Dar es Salaam',
        detail: 'Muhimbili National Hospital, Tanzania: neurology, internal medicine and surgery.',
      },
      {
        date: 'Apr 2024',
        title: 'M.B.,B.S., First-Class Honours',
        detail: 'Graduated at 19 with distinction.',
      },
      {
        date: 'May–Oct 2024',
        title: 'Clinical observer, Cairo',
        detail: 'Neuro-ophthalmology at El Safa Medical Tower.',
      },
      {
        date: 'May–Nov 2025',
        title: 'Founded Craniolabs',
        detail: 'Data infrastructure for medical-imaging AI in low-resource hospitals: curation pipelines for 300+ CT/MRI studies, data-sharing agreements with diagnostic centres, and admission to the NVIDIA Inception programme.',
      },
      {
        date: 'Jul 2025',
        title: 'First preprint',
        detail: "Blood IL-6 mRNA expression in Alzheimer's disease (medRxiv).",
      },
      {
        date: 'Sep 2025 – Apr 2026',
        title: 'Visiting researcher, Harvard Medical School',
        detail: 'Kann Lab, Mass General Brigham: LLM-assisted segmentation of paediatric gliomas, fusing text and imaging.',
      },
      {
        date: 'Jan 2026 – present',
        title: 'Global Burden of Disease collaborator',
        detail: 'IHME, University of Washington: neurological and neuro-oncology burden data for North Africa and the Middle East.',
      },
      {
        date: 'Jun 2026 – present',
        title: 'Research fellow, UH / Case Western Reserve',
        detail: 'Deep learning to synthesise post-contrast MRI from MR Fingerprinting, aiming to reduce gadolinium exposure. Member, Case Center for Imaging Research.',
      },
      {
        date: 'Jun 2026 – present',
        title: 'Computational modelling, University of Oxford',
        detail: 'With Prof. Sanjay Manohar (remote): recoverability limits of working-memory mixture models and RNN models of memory maintenance.',
      },
    ],
  },

  research: {
    badge: 'Research',
    heading: ['What I work on,', 'and what came of it.'],
    // `link` is optional. Add { label, url } to a project to show a button.
    projects: [
      {
        title: 'Contrast-free MRI from MR Fingerprinting',
        summary: 'Synthesising post-contrast images from a 5-minute pre-contrast MRF scan.',
        where: 'Case Western',
        tags: ['MRI', 'MR Fingerprinting', 'Deep learning'],
      },
      {
        title: 'Text-guided paediatric glioma segmentation',
        summary: 'Cross-attention and FiLM with LoRA on BraTS-PEDs, benchmarked against nnU-Net and Swin-UNETR.',
        where: 'Harvard / MGB',
        tags: ['PyTorch', 'MONAI', 'HuggingFace'],
      },
      {
        title: "How much can one person's memory errors tell us?",
        summary: "Monte Carlo and Cramér–Rao analysis showing that individual misbinding weights aren't recoverable at realistic trial counts, which redirected the study design to group-level contrasts.",
        where: 'Oxford',
        tags: ['Monte Carlo', 'Cramér–Rao', 'Mixture models'],
      },
      {
        title: 'Imaging data infrastructure for low-resource hospitals',
        summary: 'Data curation for 300+ CT and MRI studies, built on data-sharing agreements with diagnostic centres.',
        where: 'Craniolabs',
        tags: ['CT', 'MRI', 'Data curation'],
      },
    ],
    // Newest first. Only list published work and preprints.
    publications: [
      {
        authors: 'Hashim ME.',
        title: "Blood Interleukin-6 (IL-6) mRNA Expression in Alzheimer's Disease: A Preliminary Analysis.",
        venue: 'medRxiv',
        year: 2025,
        doi: '10.1101/2025.07.13.25331470',
      },
    ],
  },

  writing: {
    badge: 'Writing',
    heading: ['Thinking out loud,', 'one essay at a time.'],
    title: 'The Seed Lab',
    line: 'Essays on medicine, AI and the brain.',
    // Up to three: { title: '...', date: 'Jan 2027', url: 'https://...' }
    posts: [],
  },

  photos: {
    badge: 'Photos',
    heading: ['A few frames', 'from along the way.'],
    // `width` and `height` are printed by tools/optimise-photos.mjs.
    // `area` places the card in the grid (see .photos in styles.css).
    // `focus` is which part stays visible when a card crops its photo.
    // `quiet: true` drops the hover zoom for a card that should stay still.
    items: [
      {
        src: 'assets/img/white-coat-sudan',
        area: 'wc',
        width: 3024,
        height: 4032,
        focus: '50% 62%',
        alt: 'Mohamed in a white coat and blue surgical mask, standing in front of a painted mural of masked figures.',
        caption: 'Fourth year, Sudan. Post-COVID infectious-disease rotations, a wall of masked faces, and the questions that turned into my thesis.',
      },
      {
        src: 'assets/img/scrubs-khartoum',
        area: 'sc',
        width: 2062,
        height: 3664,
        focus: '50% 45%',
        alt: 'Selfie in green surgical scrubs, a blue cap and mask, giving a thumbs up.',
        caption: 'Surgery rotation, Khartoum. The mask is hiding the nerves; the thumb is doing its best.',
      },
      {
        src: 'assets/img/aswan-nile',
        area: 'as',
        width: 3024,
        height: 4032,
        focus: '30% 62%',
        alt: 'The Nile at Aswan under a clear blue sky, with palm trees and low sandy hills on the far bank.',
        caption: 'Aswan, after we fled the war in Sudan. Same Nile, further downstream.',
        quiet: true,
      },
      {
        src: 'assets/img/mustafa-kamel-cairo',
        area: 'mu',
        width: 3024,
        height: 4032,
        focus: '52% 30%',
        alt: 'Statue of Mustafa Kamel Pasha on a tall stone plinth in front of an ochre apartment building in downtown Cairo.',
        caption: 'Mustafa Kamel Pasha, keeping watch over downtown Cairo. I took the photo; he struck the pose.',
      },
      {
        src: 'assets/img/dragon-fruit',
        area: 'dr',
        width: 3024,
        height: 4032,
        focus: '50% 55%',
        alt: 'A crate of bright pink dragon fruit on a market stall, surrounded by green leaves.',
        caption: 'Tanzania. Looks like something out of a fantasy novel, tastes like a very polite kiwi.',
      },
      {
        src: 'assets/img/lego-giraffe-istanbul',
        area: 'gi',
        width: 3024,
        height: 2560,
        focus: '35% 20%',
        alt: 'A towering giraffe built from yellow and orange LEGO bricks inside a shopping centre.',
        caption: 'Forum Istanbul. No research angle here. I just respect a giraffe built one brick at a time.',
      },
      {
        src: 'assets/img/age-4-uk',
        area: 'ag',
        width: 1830,
        height: 2020,
        focus: '50% 22%',
        alt: 'Mohamed aged four in a red-striped Spider-Man T-shirt on a mown green lawn, looking past the camera.',
        caption: 'Age 4, UK. Same curls, fewer degrees.',
      },
    ],
  },

  contact: {
    badge: 'Contact',
    heading: ["Let's build something", 'for the brain.'],
    line: 'Open to research collaborations, especially in neuroimaging, neurogenomics and global neurology.',
  },

  footer: {
    tagline: 'Physician-scientist building AI for the brain.',
    credit: 'Brain model: NIH 3D, 3DPX-001193 (public domain).',
    copyright: '© 2026 Mohamed Essam Hashim',
  },
};
