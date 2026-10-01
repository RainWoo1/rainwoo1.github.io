(() => {
  const card = document.getElementById('signalCard');
  if (card) {
    const nodes = [...card.querySelectorAll('.pipeline-node')];
    const stageIndex = document.getElementById('stageIndex');
    const stageCopy = document.getElementById('stageCopy');

    const copy = {
      understand: 'I built a small allocator because I wanted to see what malloc() was hiding from me.',
      measure: 'On the car, I profiled the visualization path instead of guessing where the CPU time was going.',
      move: 'Some transforms and projections made more sense in the C++ backend than in the browser.',
      verify: 'I care about whether a change survives the real system — not just whether it looks cleaner in code.'
    };

    const defaults = {
      index: '01',
      text: 'I usually start by trying to understand what the system is actually doing.'
    };

    function setStage(node, index) {
      nodes.forEach(n => n.classList.remove('active'));
      if (!node) {
        stageIndex.textContent = defaults.index;
        stageCopy.textContent = defaults.text;
        return;
      }
      node.classList.add('active');
      stageIndex.textContent = String(index + 1).padStart(2, '0');
      stageCopy.textContent = copy[node.dataset.stage] || defaults.text;
    }

    nodes.forEach((node, index) => {
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', node.dataset.stage + ': show project example');
      node.addEventListener('click', () => setStage(node, index));
      node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') {event.preventDefault();setStage(node, index);} });
      node.addEventListener('mouseenter', () => setStage(node, index));
      node.addEventListener('focus', () => setStage(node, index));
      node.addEventListener('blur', () => setStage(null, 0));
    });

    card.addEventListener('mouseleave', () => setStage(null, 0));
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  const revealTargets = document.querySelectorAll('.feature-project, .project-card, .mini-project, .question-row, .about-photo-wrap');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `[data-visible="true"]{opacity:1!important;transform:translateY(0)!important}`;
    document.head.appendChild(style);
  }
})();