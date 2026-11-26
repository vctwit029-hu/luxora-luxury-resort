import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import ResortJourneyVideo from './ResortJourneyVideo';

const chapters = [
  { id:'arrival', number:'01', label:'THE APPROACH', title:'A world apart.', accent:'A world of your own.', copy:'Leave the everyday behind. Follow the palms, the light and the quiet curve of the coast.' },
  { id:'welcome', number:'02', label:'THE WELCOME', title:'Arrive into calm.', accent:'Stay a little longer.', copy:'A generous arrival pavilion opens into a world shaped by natural stone, warm timber and thoughtful hospitality.' },
  { id:'pool', number:'03', label:'THE HEART OF LUXORA', title:'Where water meets sky.', accent:'Find your horizon.', copy:'The central infinity pool is the resort’s meeting point — a place to drift between sunlight, shade and stillness.' },
  { id:'villas', number:'04', label:'PRIVATE RESIDENCES', title:'Your own quiet corner.', accent:'Space to simply be.', copy:'Low-rise private villas sit among tropical gardens, with generous terraces and a softer rhythm of living.' },
  { id:'dining', number:'05', label:'TASTE & GATHER', title:'A table worth travelling for.', accent:'Seasonal. Thoughtful. Yours.', copy:'An intimate dining pavilion brings together local ingredients, considered menus and evenings that unfold slowly.' },
  { id:'overview', number:'06', label:'THE FULL RESORT', title:'See the whole story.', accent:'One place. Many ways to feel away.', copy:'From the arrival court to the pool, villas and dining spaces, discover the complete LUXORA experience.' }
];

const chapterImages = [
  { src:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85', alt:'Luxury resort entrance and arrival pavilion' },
  { src:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=85', alt:'Elegant luxury bedroom suite' },
  { src:'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1800&q=85', alt:'Resort infinity swimming pool' },
  { src:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85', alt:'Private tropical villa' },
  { src:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85', alt:'Fine dining restaurant setting' },
  { src:'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1800&q=85', alt:'Tropical ocean and resort coastline' }
];

function Chapter({ item, index }: { item: typeof chapters[number]; index: number }) {
  return <section className={'chapter chapter-' + index} id={item.id}>
    <div className="chapter-image"><img src={chapterImages[index].src} alt={chapterImages[index].alt} loading={index===0?"eager":"lazy"}/></div>\n    <div className="chapter-card">
      <span className="chapter-kicker"><i /> {item.number} — {item.label}</span>
      <h2>{item.title}<br/><em>{item.accent}</em></h2>
      <p>{item.copy}</p>
      {index === 0 && <a className="chapter-link" href="#welcome">Begin the journey <ArrowDown size={15}/></a>}
      {index === chapters.length - 1 && <a className="chapter-link" href="#contact">Plan your stay <ArrowUpRight size={15}/></a>}
    </div>
  </section>;
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', arrival:'', guests:'2', message:'' });
  useEffect(() => {
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, window.scrollY / max));
    };
    update();
    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const go = (id:string) => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setMenu(false); };
  const updateForm = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm({ ...form, [e.target.name]:e.target.value });
  const current = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
  return <main className="immersive-site">
    <ResortJourneyVideo />
    <div className="world-vignette" />
    <header className="immersive-nav">
      <a className="luxora-brand" href="#arrival" onClick={e=>{e.preventDefault();go('arrival')}}><span className="brand-monogram">L</span><span>LUXORA<small>PRIVATE RESORT & RETREAT</small></span></a>
      <nav className={menu?'immersive-links open':'immersive-links'}>
        <a onClick={()=>go('arrival')}>The journey</a><a onClick={()=>go('pool')}>The pool</a><a onClick={()=>go('villas')}>Villas</a><a onClick={()=>go('overview')}>Resort map</a><a onClick={()=>go('contact')}>Enquire</a>
      </nav>
      <button className="nav-book" onClick={()=>go('contact')}>Reserve your stay <ArrowUpRight size={15}/></button>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>
    <div className="scroll-progress"><span style={{ transform:'scaleX('+progress+')' }}/></div>
    <div className="tour-counter"><span>SCROLL TO TOUR</span><strong>0{current+1} <i>/ 06</i></strong></div>
    {chapters.map((item,index)=><Chapter key={item.id} item={item} index={index}/>)}
    <section className="contact-chapter" id="contact">
      <div className="contact-panel">
        <span className="chapter-kicker"><i/> 08 — YOUR ESCAPE STARTS HERE</span>
        <h2>Make room<br/>for <em>you.</em></h2>
        <p>Tell us a little about the stay you have in mind. Our reservations team will be delighted to help shape your LUXORA experience.</p>
        {formSent ? <div className="enquiry-success"><Sparkles/><strong>Your enquiry is ready.</strong><span>This is a concept demo — no booking was made and no message was sent.</span><button onClick={()=>setFormSent(false)}>Send another enquiry</button></div> :
          <form onSubmit={e=>{e.preventDefault();setFormSent(true);}}>
            <label>Your name *<input name="name" required value={form.name} onChange={updateForm} placeholder="Full name"/></label>
            <label>Email address *<input name="email" type="email" required value={form.email} onChange={updateForm} placeholder="you@example.com"/></label>
            <div className="contact-fields"><label>Arrival date<input name="arrival" type="date" value={form.arrival} onChange={updateForm}/></label><label>Guests<select name="guests" value={form.guests} onChange={updateForm}><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label></div>
            <label>Tell us more<textarea name="message" rows={3} value={form.message} onChange={updateForm} placeholder="Occasion, preferences or special requests…"/></label>
            <button className="submit-enquiry" type="submit">Send an enquiry <ArrowRight size={16}/></button>
            <small className="form-note">Concept form only. Your details are not transmitted or stored.</small>
          </form>
        }
      </div>
    </section>
    <footer className="immersive-footer"><a className="luxora-brand" href="#arrival"><span className="brand-monogram">L</span><span>LUXORA<small>PRIVATE RESORT & RETREAT</small></span></a><p>Escape the ordinary.<br/><em>Return to what matters.</em></p><span>© 2026 LUXORA · A FICTIONAL RESORT CONCEPT BY GENZ DEVELOPERS</span><button onClick={()=>go('arrival')}>BACK TO THE BEGINNING ↑</button></footer>
  </main>;
}
