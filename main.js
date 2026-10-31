import { content } from './content.js';

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero choreography. Change these together with --hero-scroll and --about-overlap in styles.css.
const BRAIN_END_CENTRE = 0.3;   // where the brain's centre finishes, as a share of the viewport height
const BRAIN_END_SCALE = { desktop: 0.56, mobile: 0.72 };
const BRAIN_SCROLL_YAW = 1.0;   // radians turned across the hero scroll
const BRAIN_SCROLL_PITCH = 0.14;
const CONTENT_LIFT = 0.1;       // how far the hero text lifts, as a share of the viewport height

const BRAIN_IDLE_SPEED = 0.05;  // radians per second
const POINTER_YAW = 0.16;
const POINTER_PITCH = 0.08;
const POINTER_EASE = 0.05;
const SLOW_FRAME_MS = 21;
const SCROLL_REST_MS = 300;

const PHOTO_WIDTHS = [640, 1280, 1920];
const MAX_FEATURED_POSTS = 3;
const COPY_RESET_MS = 2200;
const NAV_SECTIONS = [
  ['about', 'About'],
  ['timeline', 'Timeline'],
  ['research', 'Research'],
  ['writing', 'Writing'],
  ['photos', 'Photos'],
  ['contact', 'Contact'],
];

// The rail dot rides this line, and each entry appears as the dot reaches it.
// Change this together with --track in styles.css.
const TIMELINE_TRACK = '62%';

// Well before Contact arrives, so the shader has time to compile in the background.
const SMOKE_START_MARGIN = '1600px';

const brainScroll = { yaw: 0, pitch: 0 };
let lenis = null;

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
));

const arrow = '<span class="pill__arrow" aria-hidden="true">↗</span>';
const externalLink = (url) => `href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"`;

function renderHeading({ badge, heading: [white, grey] }, id) {
  return `
    <p class="badge">${escapeHtml(badge)}</p>
    <h2 class="heading" id="${id}" data-split>${escapeHtml(white)} <span class="tone-grey">${escapeHtml(grey)}</span></h2>`;
}

function renderPicture({ src, alt, width, height, widths = PHOTO_WIDTHS, focus }, sizes) {
  const srcset = (extension) => widths.map((w) => `${src}-${w}.${extension} ${w}w`).join(', ');
  const position = focus ? ` style="object-position:${focus}"` : '';
  return `
    <picture>
      <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">
      <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
      <img src="${src}-${widths[0]}.jpg" srcset="${srcset('jpg')}" sizes="${sizes}"
        width="${width}" height="${height}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"${position}>
    </picture>`;
}

function renderAbout(block) {
  const { portrait, bio, pillars } = block;
  return `
    <section class="section about" id="about" aria-labelledby="about-title">
      <div class="container">
        ${renderHeading(block, 'about-title')}
        <div class="about__grid">
          <div class="about__portrait" data-fade>
            ${renderPicture(portrait, '(min-width: 900px) 440px, min(100vw, 560px)')}
          </div>
          <div class="about__bio">
            ${bio.map((paragraph) => `<p data-fade>${escapeHtml(paragraph)}</p>`).join('')}
          </div>
        </div>
        <ul class="pillars">
          ${pillars.map(({ title, line }) => `
            <li class="card pillar" data-fade>
              <h3 class="card__title">${escapeHtml(title)}</h3>
              <p class="card__text">${escapeHtml(line)}</p>
            </li>`).join('')}
        </ul>
      </div>
    </section>`;
}

function renderTimeline(block) {
  return `
    <section class="section" id="timeline" aria-labelledby="timeline-title">
      <div class="container">
        ${renderHeading(block, 'timeline-title')}
        <div class="tl">
          <div class="tl__rail" aria-hidden="true">
            <div class="tl__clip"><div class="tl__line"></div></div>
            <div class="tl__dot"></div>
          </div>
          <ol class="tl__list">
            ${block.entries.map(({ date, title, detail }) => `
              <li class="tl__item">
                <span class="tl__marker" aria-hidden="true"></span>
                <div class="tl__body">
                  <p class="tl__date">${escapeHtml(date)}</p>
                  <h3 class="tl__title">${escapeHtml(title)}</h3>
                  <p class="tl__detail">${escapeHtml(detail)}</p>
                </div>
              </li>`).join('')}
          </ol>
        </div>
      </div>
    </section>`;
}

function renderProject({ title, summary, where, tags, link }) {
  return `
    <article class="card project" data-fade>
      <p class="project__where">${escapeHtml(where)}</p>
      <h4 class="card__title">${escapeHtml(title)}</h4>
      <p class="card__text">${escapeHtml(summary)}</p>
      <ul class="tags">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
      ${link ? `<a class="pill pill--small project__link" ${externalLink(link.url)}>${escapeHtml(link.label)} ${arrow}</a>` : ''}
    </article>`;
}

function renderPublication({ authors, title, venue, year, doi }) {
  return `
    <li class="pub" data-fade>
      <span class="pub__year">${escapeHtml(year)}</span>
      <p class="pub__citation">
        ${escapeHtml(authors)} <cite>${escapeHtml(title)}</cite>
        <span class="pub__venue">${escapeHtml(venue)}, ${escapeHtml(year)}.</span>
      </p>
      <a class="pill pill--small pub__doi" ${externalLink(`https://doi.org/${doi}`)}>doi:${escapeHtml(doi)} ${arrow}</a>
    </li>`;
}

function renderResearch(block) {
  return `
    <section class="section" id="research" aria-labelledby="research-title">
      <div class="container">
        ${renderHeading(block, 'research-title')}
        <h3 class="subhead" data-fade>Selected projects</h3>
        <div class="projects">${block.projects.map(renderProject).join('')}</div>
        <h3 class="subhead" data-fade>Publications</h3>
        <ol class="pubs">${block.publications.map(renderPublication).join('')}</ol>
      </div>
    </section>`;
}

function renderWriting(block) {
  const posts = block.posts.slice(0, MAX_FEATURED_POSTS);
  return `
    <section class="section" id="writing" aria-labelledby="writing-title">
      <div class="container">
        ${renderHeading(block, 'writing-title')}
        <article class="card feature" data-fade>
          <div>
            <p class="feature__label">On Substack</p>
            <h3 class="feature__title">${escapeHtml(block.title)}</h3>
            <p class="feature__line">${escapeHtml(block.line)}</p>
          </div>
          <a class="pill pill--solid" ${externalLink(content.links.substack)}>Read on Substack ${arrow}</a>
        </article>
        ${posts.length ? `
          <ul class="posts">
            ${posts.map(({ title, date, url }) => `
              <li class="card post" data-fade>
                <a class="post__link" ${externalLink(url)}>
                  <span class="post__date">${escapeHtml(date)}</span>
                  <span class="card__title">${escapeHtml(title)} ${arrow}</span>
                </a>
              </li>`).join('')}
          </ul>` : ''}
      </div>
    </section>`;
}

function renderPhoto(photo, index) {
  return `
    <figure class="photo${photo.quiet ? ' photo--quiet' : ''}" style="grid-area:${photo.area}" data-fade>
      <button class="photo__button" type="button" aria-expanded="false" aria-controls="caption-${index}">
        ${renderPicture(photo, '(min-width: 760px) min(33vw, 380px), 50vw')}
        <span class="photo__veil" aria-hidden="true"></span>
      </button>
      <figcaption class="photo__caption" id="caption-${index}">${escapeHtml(photo.caption)}</figcaption>
    </figure>`;
}

function renderPhotos(block) {
  return `
    <section class="section" id="photos" aria-labelledby="photos-title">
      <div class="container">
        ${renderHeading(block, 'photos-title')}
        <div class="photos">${block.items.map(renderPhoto).join('')}</div>
      </div>
    </section>`;
}

function renderContact(block) {
  const { email, links, cv } = content;
  return `
    <section class="contact" id="contact" aria-labelledby="contact-title">
      <div class="contact__smoke" aria-hidden="true"><canvas class="contact__canvas"></canvas></div>
      <div class="container contact__inner">
        ${renderHeading(block, 'contact-title')}
        <p class="contact__line" data-fade>${escapeHtml(block.line)}</p>
        <div class="contact__email" data-fade>
          <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
          <button class="pill pill--small contact__copy" type="button">Copy</button>
          <span class="visually-hidden" role="status" aria-live="polite"></span>
        </div>
        <div class="contact__links" data-fade>
          <a class="pill" ${externalLink(links.linkedin)}>LinkedIn ${arrow}</a>
          <a class="pill" ${externalLink(links.github)}>GitHub ${arrow}</a>
          <a class="pill" ${externalLink(links.substack)}>Substack ${arrow}</a>
          <a class="pill" href="${escapeHtml(cv.url)}" download="${escapeHtml(cv.filename)}">Download CV ${arrow}</a>
        </div>
      </div>
    </section>`;
}

function renderFooter({ tagline, credit, copyright }) {
  const links = NAV_SECTIONS.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('');
  return `
    <div class="container">
      <div class="footer__top">
        <div>
          <p class="footer__name">${escapeHtml(content.name)}</p>
          <p class="footer__tagline">${escapeHtml(tagline)}</p>
        </div>
        <nav class="footer__links" aria-label="Footer">${links}</nav>
      </div>
      <div class="footer__legal">
        <p>${escapeHtml(copyright)}</p>
        <p>${escapeHtml(credit)}</p>
      </div>
    </div>
    <div class="footer__wordmark" aria-hidden="true">HASHIM</div>`;
}

function renderSections() {
  document.getElementById('sections').innerHTML = [
    renderAbout(content.about),
    renderTimeline(content.timeline),
    renderResearch(content.research),
    renderWriting(content.writing),
    renderPhotos(content.photos),
    renderContact(content.contact),
  ].join('');
  document.getElementById('footer').innerHTML = renderFooter(content.footer);
}

function initPhotos() {
  const cards = [...document.querySelectorAll('.photo')];
  const setOpen = (card, open) => {
    card.classList.toggle('is-open', open);
    card.querySelector('.photo__button').setAttribute('aria-expanded', String(open));
  };
  // Real buttons, so Enter and Space work with no extra key handling.
  document.querySelector('.photos').addEventListener('click', (event) => {
    const button = event.target.closest('.photo__button');
    if (!button) return;
    const card = button.closest('.photo');
    const open = !card.classList.contains('is-open');
    cards.forEach((other) => setOpen(other, other === card && open));
  });
}

async function copyText(text, element) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    getSelection().selectAllChildren(element);
    return document.execCommand('copy');
  }
}

function initCopyEmail() {
  const button = document.querySelector('.contact__copy');
  const email = button.previousElementSibling;
  const status = button.nextElementSibling;
  let timer = 0;
  button.addEventListener('click', async () => {
    const copied = await copyText(content.email, email);
    button.textContent = copied ? 'Copied' : 'Selected';
    status.textContent = copied ? 'Email address copied.' : 'Email address selected.';
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.textContent = 'Copy';
      status.textContent = '';
    }, COPY_RESET_MS);
  });
}

function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const main = document.getElementById('main');

  function setMenuOpen(open) {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    main.inert = open;
    menu.inert = !open;
    if (open) {
      lenis?.stop();
      menu.querySelector('a').focus({ preventScroll: true });
    } else {
      lenis?.start();
    }
  }

  toggle.addEventListener('click', () => setMenuOpen(!root.classList.contains('menu-open')));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('menu-open')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  // The menu only exists below the desktop breakpoint, so leaving it must not strand an open state.
  matchMedia('(min-width: 900px)').addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    setMenuOpen(false);
    scrollToTarget(target);
    history.pushState(null, '', link.getAttribute('href'));
  });

  const updateScrolled = () => root.classList.toggle('is-scrolled', scrollY > 12);
  addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();
}

function scrollToTarget(target) {
  const isTop = target.id === 'top';
  if (lenis) {
    // Lenis applies the CSS scroll-padding-top itself, so no offset is needed for the nav.
    lenis.scrollTo(isTop ? 0 : target, { duration: 1.5 });
  } else {
    target.scrollIntoView();
  }
  if (!isTop) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

function heroTimeline(gsap) {
  const stage = document.querySelector('.hero__stage');
  const slot = document.querySelector('.hero__slot');
  const box = document.querySelector('.hero__brain');
  // Measured from layout offsets, which ignore the transform this timeline is animating.
  const brainCentre = () => slot.offsetTop + box.offsetTop + box.offsetHeight / 2;
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
    .to('.hero__content', {
      y: () => -stage.clientHeight * CONTENT_LIFT,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power1.in',
    }, 0)
    .to('.hero__brain', {
      y: () => stage.clientHeight * BRAIN_END_CENTRE - brainCentre(),
      scale: () => (isMobileViewport() ? BRAIN_END_SCALE.mobile : BRAIN_END_SCALE.desktop),
      duration: 1,
      ease: 'sine.inOut',
    }, 0)
    .to(brainScroll, { yaw: BRAIN_SCROLL_YAW, pitch: BRAIN_SCROLL_PITCH, duration: 1 }, 0);
}

function headingReveals(gsap, SplitText) {
  gsap.utils.toArray('[data-split]').forEach((element) => {
    SplitText.create(element, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: element, start: 'top 86%', once: true },
      }),
    });
  });
}

// The rail and the entrances are CSS, so they keep up with Safari's off-thread scrolling.
// This only marks each entry as the dot passes it.
function timelineMotion(gsap, ScrollTrigger) {
  gsap.utils.toArray('.tl__item').forEach((item) => {
    ScrollTrigger.create({
      trigger: item.querySelector('.tl__marker'),
      start: `top ${TIMELINE_TRACK}`,
      end: 'max',
      toggleClass: { targets: item, className: 'is-reached' },
      onEnter: () => item.classList.add('is-seen'),
    });
  });
}

function fadeUps(gsap, ScrollTrigger) {
  const items = gsap.utils.toArray('[data-fade]');
  gsap.set(items, { autoAlpha: 0, y: 26 });
  ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'transform,opacity,visibility',
    }),
  });
}

async function startMotion() {
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Wheel input only: touch keeps its native momentum because syncTouch stays off.
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  heroTimeline(gsap);
  headingReveals(gsap, SplitText);
  timelineMotion(gsap, ScrollTrigger);
  fadeUps(gsap, ScrollTrigger);
  await document.fonts.ready;
  ScrollTrigger.refresh();

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) lenis.scrollTo(target, { immediate: true });
  }
}

// Returns 'high', 'low' or 'none'. 'none' keeps the still image.
function brainTier() {
  if (navigator.connection?.saveData) return 'none';
  const probe = document.createElement('canvas').getContext('webgl2');
  if (!probe) return 'none';
  // Chrome hides the real name behind an extension that Firefox is retiring, so ask only if needed.
  let renderer = String(probe.getParameter(probe.RENDERER));
  if (/^webkit/i.test(renderer)) {
    const info = probe.getExtension('WEBGL_debug_renderer_info');
    if (info) renderer = String(probe.getParameter(info.UNMASKED_RENDERER_WEBGL));
  }
  if (/swiftshader|llvmpipe|software/i.test(renderer)) return 'none';
  const lowPower = navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 4;
  return isMobileViewport() || lowPower ? 'low' : 'high';
}

const isMobileViewport = () => matchMedia('(max-width: 820px), (pointer: coarse)').matches;

const whenIdle = () => new Promise((resolve) => {
  const go = () => ('requestIdleCallback' in window
    ? requestIdleCallback(resolve, { timeout: 1500 })
    : setTimeout(resolve, 200));
  if (document.readyState === 'complete') go();
  else addEventListener('load', go, { once: true });
});

// Start-up stalls the main thread for a moment, which would freeze the scrubbed hero if it landed
// mid-scroll. The still stands in until the page has been at rest for a beat.
const whenScrollRests = () => new Promise((resolve) => {
  let timer = 0;
  const wait = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      removeEventListener('scroll', wait);
      resolve();
    }, SCROLL_REST_MS);
  };
  addEventListener('scroll', wait, { passive: true });
  wait();
});

async function startBrain() {
  const tier = brainTier();
  if (tier === 'none') return;
  await whenIdle();

  const { createBrain, POSE } = await import('./brain.js');
  await whenScrollRests();
  const canvas = document.querySelector('.hero__canvas');
  const box = document.querySelector('.hero__brain');
  const maxRatio = isMobileViewport() ? 1.5 : 2;
  const brain = await createBrain({
    canvas,
    modelUrl: `assets/brain/brain-${tier}.glb`,
    pixelRatio: Math.min(devicePixelRatio, maxRatio),
  });

  const size = () => brain.setSize(box.offsetWidth);
  size();
  new ResizeObserver(size).observe(box);

  const pointer = { x: 0, y: 0, currentX: 0, currentY: 0 };
  if (matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', (event) => {
      pointer.x = (event.clientX / innerWidth) * 2 - 1;
      pointer.y = (event.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  let idleYaw = 0;
  let last = performance.now();
  let frameId = 0;
  let slowFrames = 0;
  let countedFrames = 0;

  function frame(now) {
    frameId = requestAnimationFrame(frame);
    const delta = now - last;
    last = now;
    idleYaw += (Math.min(delta, 50) / 1000) * BRAIN_IDLE_SPEED;
    pointer.currentX += (pointer.x - pointer.currentX) * POINTER_EASE;
    pointer.currentY += (pointer.y - pointer.currentY) * POINTER_EASE;
    brain.pose.yaw = POSE.yaw + idleYaw + brainScroll.yaw + pointer.currentX * POINTER_YAW;
    brain.pose.pitch = POSE.pitch + brainScroll.pitch + pointer.currentY * POINTER_PITCH;
    brain.render();

    // Trade sharpness for smoothness if this device can't hold the frame rate.
    countedFrames += 1;
    if (delta > SLOW_FRAME_MS) slowFrames += 1;
    if (countedFrames === 90) {
      if (slowFrames > 30 && brain.pixelRatio > 1) {
        brain.setPixelRatio(Math.max(1, brain.pixelRatio - 0.25));
        size();
      }
      countedFrames = 0;
      slowFrames = 0;
    }
  }

  const start = () => {
    if (frameId) return;
    last = performance.now();
    frameId = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
  };

  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    .observe(document.querySelector('.hero__stage'));

  canvas.addEventListener('webglcontextlost', () => {
    stop();
    root.classList.remove('brain-live');
  });

  brain.render();
  requestAnimationFrame(() => root.classList.add('brain-live'));
}

function startContactSmoke() {
  const section = document.querySelector('.contact');
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    const { startSmoke } = await import('./contact-bg.js');
    await startSmoke(section.querySelector('.contact__canvas'), section);
  }, { rootMargin: SMOKE_START_MARGIN });
  observer.observe(section);
}

renderSections();
initNav();
initPhotos();
initCopyEmail();

if (!reducedMotion) {
  startMotion().catch((error) => {
    console.warn('Motion libraries failed to load; the page stays static.', error);
    root.classList.add('no-motion');
  });
  startBrain().catch((error) => {
    console.warn('The 3D brain could not start; keeping the still image.', error);
  });
  startContactSmoke();
}
