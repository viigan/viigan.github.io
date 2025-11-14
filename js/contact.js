const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

function showToast(msg, type='success'){
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(()=> toast.classList.remove('show'), 3500);
}

function validate(formEl){
    if (formEl.company_website.value) return { ok:false, msg:'Bot detected' };
    if (!formEl.name.value.trim()) return { ok:false, msg:'Please enter your name' };
    if (!formEl.email.value.trim()) return { ok:false, msg:'Please enter your email' };
    if (!formEl.service.value) return { ok:false, msg:'Select a service' };
    if (!formEl.subject.value.trim()) return { ok:false, msg:'Add a subject' };
    if (!formEl.message.value.trim()) return { ok:false, msg:'Describe your project' };
    if (!document.getElementById('consent').checked) return { ok:false, msg:'Please accept privacy terms' };
    return { ok:true };
}

form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const { ok, msg } = validate(form);
    if (!ok){ showToast(msg,'error'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try{
        const data = new FormData(form);

        // 🚧 Replace this endpoint with your real backend
        const res = await fetch('/api/installazioni-contact', { method:'POST', body:data });
        if (!res.ok) throw new Error('Network error');

        const json = await res.json().catch(()=>({ok:false}));
        if (json.ok){
            showToast('Message sent successfully!', 'success');
            form.reset();
        } else throw new Error(json.message || 'Something went wrong');
    }
    catch(err){
        console.error(err);
        showToast('Could not send message. Please try again.', 'error');
    }
    finally{
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }

});

/* ===== WhatsApp FAB (Behar Gjeleshi) ===== */
(function(){
    // 👉 Replace with Behar’s full international number (no +, no spaces)
    // Example North Macedonia: 3897XXXXXXXX
    const PHONE_E164 = '3897XXXXXXXX';     // TODO: put Behar’s number here
    const PERSON_NAME = 'Behar Gjeleshi';

    const defaultMsg =
        `Ciao ${PERSON_NAME}, vorrei avere informazioni per un progetto. Possiamo sentirci?`;

    const fab = document.getElementById('waFab');
    if (!fab) return;

    function buildUrl(){
        const text = encodeURIComponent(defaultMsg);
        // On desktop open web.whatsapp; on mobile prefer app deep-link
        const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
        if (isMobile) {
            return `whatsapp://send?phone=${PHONE_E164}&text=${text}`;
        }
        return `https://wa.me/${+38978257665}?text=${text}`;
    }

    fab.addEventListener('click', (e)=>{
        e.preventDefault();
        const url = buildUrl();
        window.open(url, '_blank', 'noopener,noreferrer');
    });
})();



