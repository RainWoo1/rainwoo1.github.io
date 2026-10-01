/* Static content stays readable without JavaScript. */
(() => {
  const progress = document.querySelector('.reading-progress');
  let ticking = false;
  function update() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, scrollY / distance) : 1})`;
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update); update();
  const links = [...document.querySelectorAll('.project-toc a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top);
    if (!visible.length) return;
    for (const link of links) {
      if(link.hash === '#' + visible[0].target.id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  },{rootMargin:'-5% 0px -55% 0px'});
  document.querySelectorAll('.project-section').forEach(section => observer.observe(section));
  const dialog = document.querySelector('.image-dialog');
  let trigger;
  document.querySelectorAll('.project-cover img,.project-content figure img,.allocator-figure').forEach(img => {
    const button = document.createElement('button');
    button.type = 'button';button.setAttribute('aria-label','Enlarge image: ' + img.alt);
    button.style.cssText = 'display:block;width:100%;border:0;padding:0;background:transparent;cursor:zoom-in';
    img.replaceWith(button);button.append(img);
    button.addEventListener('click', () => {
      trigger = button;dialog.querySelector('img').src = img.src;dialog.querySelector('img').alt = img.alt;dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => trigger?.focus());
})();
