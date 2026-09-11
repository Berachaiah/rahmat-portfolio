// Fetches content.json and fills in the page.
// This is what makes the site "CMS-driven": the CMS (at /admin) edits
// content.json, and this script is what turns that data into the page
// everyone sees. No build step needed.

async function loadContent() {
  const res = await fetch('content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load content.json');
  return res.json();
}

function text(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '';
}

function href(id, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('href', value ?? '#');
}

function fillTemplate(tpl, data) {
  const node = tpl.content.cloneNode(true);
  node.querySelectorAll('[data-f]').forEach((field) => {
    const key = field.getAttribute('data-f');
    if (key in data) field.textContent = data[key];
  });
  return node;
}

function render(content) {
  const { site, hero, about, experience, education, contact } = content;

  // Site-wide
  document.getElementById('meta-title').textContent = site.meta_title;
  text('brand-name', site.brand);
  text('footer-brand', site.brand);
  text('footer-copyright', site.footer_copyright);
  [document.getElementById('resume-link'), document.getElementById('mobile-resume-link')].forEach((resumeLink) => {
    if (resumeLink) {
      resumeLink.querySelector('span').textContent = site.resume_link_text;
      resumeLink.setAttribute('href', site.resume_url || '#contact');
    }
  });

  // Hero
  text('hero-eyebrow', hero.eyebrow);
  text('hero-name', hero.name);
  text('hero-tagline', hero.tagline);
  document.querySelector('#hero-cta-primary span').textContent = hero.cta_primary_text;
  href('hero-cta-primary', hero.cta_primary_href);
  document.querySelector('#hero-cta-secondary span').textContent = hero.cta_secondary_text;
  href('hero-cta-secondary', hero.cta_secondary_href);
  const heroPhoto = document.getElementById('hero-photo');
  if (hero.photo_url) {
    heroPhoto.setAttribute('src', hero.photo_url);
    heroPhoto.setAttribute('alt', hero.photo_alt || '');
  }
  text('hero-photo-location', hero.photo_location);
  text('hero-photo-tag', hero.photo_tag);

  const badgeTpl = document.getElementById('tpl-badge');
  const badgeWrap = document.getElementById('hero-badges');
  badgeWrap.innerHTML = '';
  (hero.badges || []).forEach((b) => badgeWrap.appendChild(fillTemplate(badgeTpl, b)));

  // About
  text('about-heading', about.heading);
  const aboutP = document.getElementById('about-paragraphs');
  aboutP.innerHTML = '';
  (about.paragraphs || []).forEach((p) => {
    const el = document.createElement('p');
    el.textContent = p;
    aboutP.appendChild(el);
  });
  const chipTpl = document.getElementById('tpl-chip');
  const skillsWrap = document.getElementById('about-interests');
  skillsWrap.innerHTML = '';
  (about.skills || []).forEach((s) => skillsWrap.appendChild(fillTemplate(chipTpl, { chip: s })));
  text('about-institution-name', about.institution_name);
  text('about-institution-address', about.institution_address);

  // Experience
  text('experience-heading', experience.heading);
  text('experience-subheading', experience.subheading);
  const expList = document.getElementById('experience-list');
  expList.innerHTML = '';
  const expTpl = document.getElementById('tpl-experience');
  (experience.items || []).forEach((item) => {
    const node = fillTemplate(expTpl, item);
    const chipHost = node.querySelector('[data-f="chips"]');
    chipHost.removeAttribute('data-f');
    chipHost.textContent = '';
    (item.chips || []).forEach((c) => {
      const span = document.createElement('span');
      span.className = 'px-2.5 py-0.5 bg-surface-container-low border border-outline-variant text-label-sm font-label-sm text-on-surface-variant';
      span.textContent = c;
      chipHost.appendChild(span);
    });
    expList.appendChild(node);
  });

  // Education
  text('edu-degree-label', education.degree_label);
  text('edu-school-name', education.school_name);
  text('edu-school-meta', education.school_meta);

  const eduInterestsWrap = document.getElementById('edu-interests');
  eduInterestsWrap.innerHTML = '';
  (education.interests || []).forEach((i) => eduInterestsWrap.appendChild(fillTemplate(chipTpl, { chip: i })));
  text('edu-referees', education.referees);

  // Contact
  text('contact-heading', contact.heading);
  text('contact-intro', contact.intro);
  text('contact-email', contact.email);
  href('contact-email', 'mailto:' + contact.email);
  text('contact-location', contact.location);
  text('contact-phone', contact.phone_display || contact.phone);
  href('contact-phone', 'tel:' + (contact.phone_tel || contact.phone));
}

loadContent().then(render).catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<p style="padding:1rem;background:#fdecea;color:#611a15;font-family:sans-serif">Could not load content.json \u2014 check that it exists and is valid JSON.</p>'
  );
});
