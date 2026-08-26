(function(){
    var currentPopup = null;
    var hoveredLink = null;
    var ctrlPressed = false;
    var loadTimer = null;
    var LOAD_DELAY = 350; // ms

    function isInternalLink(a){
        try{
            var href = a.getAttribute('href') || '';
            return href && !href.match(/^https?:\/\//i) && !href.startsWith('#');
        }catch(e){return false}
    }

    function clearTimer(){ if(loadTimer){ clearTimeout(loadTimer); loadTimer=null; } }
    function removePopup(){ if(currentPopup){ currentPopup.remove(); currentPopup=null; } }

    document.addEventListener('mouseover', function(e){
        var a = e.target.closest && e.target.closest('a');
        if(!a || !a.classList.contains('internal-link') || !isInternalLink(a)){
            hoveredLink = null; clearTimer(); removePopup(); return;
        }
        if(hoveredLink !== a){ hoveredLink = a; clearTimer(); removePopup(); if(ctrlPressed) startTimer(a); }
    });

    document.addEventListener('mouseout', function(e){
        if(!hoveredLink) return;
        var rel = e.relatedTarget;
        if(!rel || !hoveredLink.contains(rel)){
            hoveredLink = null; clearTimer(); removePopup();
        }
    });

    document.addEventListener('keydown', function(e){
        if(e.key === 'Control' || e.key === 'Meta'){
            if(!ctrlPressed){ ctrlPressed = true; if(hoveredLink) startTimer(hoveredLink); }
        }
    }, {passive:true});

    document.addEventListener('keyup', function(e){
        if(e.key === 'Control' || e.key === 'Meta'){ ctrlPressed = false; clearTimer(); removePopup(); }
    });

    document.addEventListener('click', function(e){ if(currentPopup && !currentPopup.contains(e.target)) removePopup(); });

    function startTimer(link){ clearTimer(); loadTimer = setTimeout(function(){ loadPreview(link); }, LOAD_DELAY); }

    function createPopup(){ removePopup(); var d = document.createElement('div'); d.className='link-preview-popup'; d.setAttribute('role','dialog'); d.setAttribute('aria-hidden','false'); return d; }

    function toAbsoluteUrl(base, url){
        try{ return new URL(url, base).href; }catch(e){ return url; }
    }

    async function loadPreview(link){
        try{
            var popup = createPopup(); document.body.appendChild(popup); currentPopup = popup;
            positionPopup(popup, link);
            popup.classList.add('loading');

            var resp = await fetch(link.href, { credentials: 'same-origin' });
            if(!resp.ok) throw new Error('fetch failed');
            var html = await resp.text();
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var content = doc.querySelector('.page-content') || doc.querySelector('.article-detail-content') || doc.querySelector('article') || doc.querySelector('main');
            if(!content){ popup.textContent = '预览不可用'; popup.classList.remove('loading'); return; }
            // remove unwanted tags
            content.querySelectorAll('script, style, .link-preview-popup').forEach(function(el){ el.remove(); });

            // fix relative images and links
            var base = (new URL(link.href, window.location.href)).origin + (new URL(link.href, window.location.href)).pathname.replace(/\/[^/]*$/, '/') ;
            content.querySelectorAll('img').forEach(function(img){
                var src = img.getAttribute('src')||'';
                if(src && !src.match(/^https?:\/\//i) && !src.startsWith('data:')){
                    img.src = toAbsoluteUrl(link.href, src);
                }
            });
            content.querySelectorAll('a').forEach(function(a){
                var h = a.getAttribute('href')||'';
                if(h && !h.match(/^https?:\/\//i)){
                    // make site-internal links open in new tab to avoid navigation
                    a.setAttribute('target','_blank');
                    a.setAttribute('rel','noopener noreferrer');
                    a.href = toAbsoluteUrl(link.href, h);
                } else {
                    a.setAttribute('target','_blank');
                    a.setAttribute('rel','noopener noreferrer');
                }
            });

            popup.classList.remove('loading');
            popup.innerHTML = '';
            // clone children to avoid adopt issues
            Array.prototype.slice.call(content.childNodes).forEach(function(node){ popup.appendChild(node.cloneNode(true)); });
            // ensure popup is scrollable and focusable
            popup.tabIndex = -1;
        }catch(err){
            if(currentPopup) { currentPopup.textContent = '预览不可用'; if(currentPopup.classList) currentPopup.classList.remove('loading'); }
        }
    }

    function positionPopup(popup, link){
        var rect = link.getBoundingClientRect();
        var top = rect.bottom + window.scrollY + 8;
        var left = rect.left + window.scrollX;
        var maxW = Math.min(450, window.innerWidth - 40);
        if(left + maxW > window.innerWidth) left = window.innerWidth - maxW - 20;
        if(left < 10) left = 10;
        popup.style.width = maxW + 'px';
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }

})();
