import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Compass, Expand, Instagram, Menu, Minus, Plus, Sparkles, Waves, X } from 'lucide-react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

const photos = {
  hero: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2200&q=90',
  pool: 'https://images.unsplash.com/photo-1575429198097-ecb4f2c0c2b8?auto=format&fit=crop&w=1200&q=85',
  suite: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
  villa: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
  garden: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  bath: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85'
};
const rooms = [
  { name:'Deluxe Suite', type:'A QUIET KIND OF GRANDEUR', size:'68 m²', guests:'2 guests', price:'₹18,500', image:photos.suite, desc:'A serene sanctuary shaped by natural textures, thoughtful details and views that invite you to linger.' },
  { name:'Private Pool Villa', type:'YOUR OWN PRIVATE HORIZON', size:'124 m²', guests:'2–3 guests', price:'₹32,000', image:photos.villa, desc:'A secluded hideaway with a private plunge pool, generous living space and a garden made for slow mornings.' },
  { name:'Presidential Suite', type:'THE ART OF ARRIVING', size:'210 m²', guests:'4 guests', price:'₹58,000', image:photos.bath, desc:'An expansive residence with exceptional privacy, a statement bath and bespoke in-suite experiences.' }
];
const scenes = [
  {name:'Grand entrance', detail:'The welcome begins here', icon:'01'},
  {name:'Luxury bedroom', detail:'A softer way to wake', icon:'02'},
  {name:'Premium bathroom', detail:'A ritual of restoration', icon:'03'},
  {name:'Private balcony', detail:'Your own open-air pause', icon:'04'},
  {name:'Living room', detail:'Space to simply be', icon:'05'},
  {name:'Infinity pool', detail:'Where water meets sky', icon:'06'},
  {name:'Restaurant', detail:'A table worth travelling for', icon:'07'},
  {name:'Spa & wellness', detail:'Return to your centre', icon:'08'}
];
// Replace each URL with a property-owned 2:1 equirectangular 360° JPEG when available.
// This genuine equirectangular sample is used as a clearly-labelled technical demo panorama.
const demoPanorama = 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg';

function Panorama({scene}:{scene:number}) {
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer|null>(null);
  const [failed,setFailed] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    setFailed(false);
    const instance = new Viewer({
      container: host.current,
      panorama: demoPanorama,
      caption: 'LUXORA · PANORAMA DEMO',
      loadingTxt: 'Preparing your view…',
      navbar: ['zoom','move','fullscreen'],
      defaultZoomLvl: 0,
      mousewheel: true,
      touchmoveTwoFingers: false
    });
    viewer.current = instance;
    instance.addEventListener('panorama-error', () => setFailed(true));
    return () => { instance.destroy(); viewer.current = null; };
  },[scene]);
  return <div className="panorama-shell"><div className="panorama" ref={host} />
    {failed && <div className="pano-error">The sample panorama could not load. Replace the demo image URL in <code>src/App.tsx</code> with a CORS-enabled 2:1 equirectangular JPEG.</div>}
    <div className="pano-caption"><span className="live-dot"/> INTERACTIVE 360° SAMPLE · DRAG TO EXPLORE</div>
  </div>;
}

function App() {
  const [menu,setMenu] = useState(false);
  const [scene,setScene] = useState(0);
  const [room,setRoom] = useState(0);
  const [formSent,setFormSent] = useState(false);
  const [mobileTour,setMobileTour] = useState(false);
  const [form,setForm] = useState({name:'',email:'',phone:'',checkin:'',checkout:'',guests:'2',room:'Deluxe Suite',message:''});
  const go = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMenu(false); };
  const update = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm({...form,[e.target.name]:e.target.value});
  const submit = (e:React.FormEvent) => { e.preventDefault(); setFormSent(true); };
  return <main>
    <header className="nav">
      <a className="brand" href="#home" onClick={e=>{e.preventDefault();go('home')}}><span className="brand-mark">L</span><span>LUXORA<small>PRIVATE RESORT & RETREAT</small></span></a>
      <nav className={menu?'nav-links open':'nav-links'}><a onClick={()=>go('resort')}>The resort</a><a onClick={()=>go('stay')}>Stay</a><a onClick={()=>go('experiences')}>Experiences</a><a onClick={()=>go('tour')}>Virtual tour</a><a onClick={()=>go('contact')}>Contact</a></nav>
      <button className="nav-cta" onClick={()=>go('contact')}>Enquire <ArrowUpRight size={15}/></button>
      <button className="menu-toggle" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>

    <section className="hero" id="home" style={{backgroundImage:'linear-gradient(90deg,rgba(7,17,24,.70),rgba(7,17,24,.13)),linear-gradient(0deg,rgba(7,17,24,.42),transparent 55%),url('+photos.hero+')'}}>
      <div className="hero-copy"><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="eyebrow"><span/> A WORLD APART, YET CLOSE TO THE SOUL</motion.p>
        <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.35,duration:.8}}>Escape the ordinary.<br/><em>Experience</em> the extraordinary.</motion.h1>
        <motion.p className="hero-sub" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.75}}>An invitation to slow down, reconnect and discover a more considered kind of luxury.</motion.p>
        <motion.div className="hero-actions" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}><button className="gold-btn" onClick={()=>go('resort')}>Explore the resort <ArrowRight size={16}/></button><button className="text-btn" onClick={()=>go('tour')}><span className="play">↗</span> Begin virtual experience</button></motion.div>
      </div>
      <div className="hero-bottom"><span>01 / 04</span><span className="hero-line"/><span>THE ART OF GETTING AWAY</span><span className="scroll-note">SCROLL TO DISCOVER <ArrowDown size={13}/></span></div>
      <div className="hero-stamp"><span>EST.</span><strong>∞</strong><span>TIMELESS</span></div>
    </section>

    <section className="intro section-pad" id="resort"><div className="intro-label"><span className="eyebrow dark">01 — A SENSE OF PLACE</span><span className="vertical-rule"/></div><div className="intro-copy"><h2>Some places stay<br/>with you <em>forever.</em></h2><p className="lead">LUXORA is a destination designed around the feeling of being somewhere else entirely.</p><p>From architecture that embraces its surroundings to moments of quiet indulgence, every detail is an invitation to experience time differently. Come for the escape. Leave with a new perspective.</p><button className="under-link" onClick={()=>go('experiences')}>Discover our philosophy <ArrowUpRight size={16}/></button></div><div className="intro-image"><img src={photos.garden} alt="Warm contemporary resort lounge opening to greenery"/><span>THE LUXORA WAY · 2026</span></div></section>

    <section className="feature-band"><div className="feature-image"><img src={photos.pool} alt="Resort infinity pool framed by tropical greenery"/></div><div className="feature-copy"><span className="eyebrow">A PLACE TO EXHALE</span><h2>Luxury is not<br/>more. It is <em>meaning.</em></h2><p>Unhurried mornings. A table set just for you. Water that mirrors the changing sky. At LUXORA, the memorable is found in the meaningful.</p><button className="light-link" onClick={()=>go('stay')}>Find your sanctuary <ArrowRight size={16}/></button><span className="feature-index">02 / 05</span></div></section>

    <section className="stay section-pad" id="stay"><div className="section-heading"><div><span className="eyebrow dark">02 — YOUR PRIVATE SANCTUARY</span><h2>Stay a little <em>longer.</em></h2></div><p>Three expressions of effortless comfort.<br/>Each one entirely your own.</p></div>
      <div className="room-grid">{rooms.map((r,i)=><motion.article className={'room-card '+(i===1?'featured-room':'')} key={r.name} whileHover={{y:-7}}><div className="room-image"><img src={r.image} alt={r.name}/><span className="room-no">0{i+1}</span><button className="round-arrow" onClick={()=>{setRoom(i);go('room-detail')}} aria-label={'Explore '+r.name}><ArrowUpRight/></button></div><div className="room-meta"><span>{r.type}</span><span>{r.size}</span></div><h3>{r.name}</h3><p>{r.desc}</p><div className="room-foot"><span>FROM <strong>{r.price}</strong> <small>/ NIGHT*</small></span><button onClick={()=>{setRoom(i);go('room-detail')}}>Explore suite <ArrowRight size={14}/></button></div></motion.article>)}</div>
      <p className="fineprint">*Illustrative starting rates for this concept website. Final pricing and availability are subject to confirmation.</p>
    </section>

    <section className="room-detail" id="room-detail"><div className="detail-image"><img src={rooms[room].image} alt={rooms[room].name}/></div><div className="detail-copy"><span className="eyebrow">A CLOSER LOOK · 0{room+1}</span><h2>{rooms[room].name}<br/><em>reimagined.</em></h2><p>{rooms[room].desc}</p><div className="detail-stats"><span><strong>{rooms[room].size}</strong> SPACE</span><span><strong>{rooms[room].guests}</strong> CAPACITY</span><span><strong>{rooms[room].price}</strong> FROM / NIGHT</span></div><div className="detail-controls"><button className="outline-btn" onClick={()=>setRoom((room+2)%3)}><ChevronLeft size={15}/> Previous</button><button className="outline-btn" onClick={()=>setRoom((room+1)%3)}>Next suite <ChevronRight size={15}/></button><button className="gold-btn" onClick={()=>{setForm({...form,room:rooms[room].name});go('contact')}}>Enquire now <ArrowUpRight size={15}/></button></div></div></section>

    <section className="experiences section-pad" id="experiences"><div className="section-heading"><div><span className="eyebrow dark">03 — THE LUXORA COLLECTION</span><h2>Moments that <em>move you.</em></h2></div><p>Find your own rhythm in a collection<br/>of thoughtful experiences.</p></div>
      <div className="experience-grid"><article className="experience large"><img src={photos.dining} alt="Elegant fine dining table"/><div><span>01 / TASTE</span><h3>Dining, elevated.</h3><p>Seasonal ingredients. Beautifully unhurried.</p></div></article><article className="experience"><img src={photos.spa} alt="Spa treatment room"/><div><span>02 / RESTORE</span><h3>The art of stillness.</h3><p>Wellness rituals to return to yourself.</p></div></article><article className="experience"><img src={photos.pool} alt="Blue infinity pool"/><div><span>03 / UNWIND</span><h3>Water, without end.</h3><p>Find your horizon at the infinity pool.</p></div></article><article className="experience"><img src={photos.garden} alt="Lush green garden lounge"/><div><span>04 / WANDER</span><h3>Closer to nature.</h3><p>Follow the quiet paths and open skies.</p></div></article></div>
    </section>

    <section className="tour-section" id="tour"><div className="tour-head"><span className="eyebrow">04 — STEP INSIDE LUXORA</span><h2>See where your <em>story begins.</em></h2><p>Explore the spaces and imagine the moments waiting to happen.</p></div><div className="tour-layout"><div className="scene-list"><span className="scene-label">SELECT A SPACE</span>{scenes.map((s,i)=><button key={s.name} className={scene===i?'scene active':'scene'} onClick={()=>setScene(i)}><span>{s.icon}</span><div><strong>{s.name}</strong><small>{s.detail}</small></div><ArrowUpRight size={15}/></button>)}<p className="tour-disclaimer">Concept preview: the viewer uses a sample 360° panorama. Replace the demo panorama with original property captures before presenting this as a real resort tour.</p></div><div className="tour-view"><Panorama scene={scene}/><div className="tour-overlay"><span>NOW EXPLORING</span><strong>{scenes[scene].name}</strong><div><button aria-label="Previous scene" onClick={()=>setScene((scene+7)%8)}><ChevronLeft/></button><button aria-label="Next scene" onClick={()=>setScene((scene+1)%8)}><ChevronRight/></button></div></div></div></div></section>

    <section className="quote-band"><span className="quote-mark">“</span><blockquote>The greatest luxury is the freedom<br/>to be completely <em>present.</em></blockquote><span className="eyebrow">THE LUXORA PROMISE</span></section>

    <section className="contact section-pad" id="contact"><div className="contact-intro"><span className="eyebrow dark">05 — YOUR ESCAPE STARTS HERE</span><h2>Shall we make<br/>room for <em>you?</em></h2><p>Tell us a little about the stay you have in mind. Our reservations team will be delighted to help shape your LUXORA experience.</p><div className="contact-note"><Sparkles size={18}/><span>A thoughtful stay begins with a conversation.</span></div></div><div className="form-wrap">{formSent?<div className="success"><span><Check size={24}/></span><h3>Thank you for reaching out.</h3><p>Your enquiry has been prepared in this demo experience. No booking has been made and no message has been sent to a reservations team.</p><button className="under-link" onClick={()=>setFormSent(false)}>Submit another enquiry <ArrowRight size={15}/></button></div>:<form onSubmit={submit}><div className="form-title"><span>RESERVATION ENQUIRY</span><small>FIELDS MARKED * ARE REQUIRED</small></div><div className="field-row"><label>Full name *<input required name="name" value={form.name} onChange={update} placeholder="Your name"/></label><label>Email address *<input required type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com"/></label></div><div className="field-row"><label>Phone number<input name="phone" value={form.phone} onChange={update} placeholder="+91 00000 00000"/></label><label>Guests<select name="guests" value={form.guests} onChange={update}><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label></div><div className="field-row"><label>Check-in<input type="date" name="checkin" value={form.checkin} onChange={update}/></label><label>Check-out<input type="date" name="checkout" min={form.checkin||undefined} value={form.checkout} onChange={update}/></label></div><label>Preferred accommodation<select name="room" value={form.room} onChange={update}>{rooms.map(r=><option key={r.name}>{r.name}</option>)}</select></label><label>Anything else we should know?<textarea name="message" rows={3} value={form.message} onChange={update} placeholder="Occasion, preferences or special requests…"/></label><button className="gold-btn submit-btn" type="submit">Send an enquiry <ArrowRight size={16}/></button><p className="form-legal">This is a front-end concept form. Your details stay in this browser session; nothing is transmitted or stored.</p></form>}</div></section>

    <footer><div className="footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark">L</span><span>LUXORA<small>PRIVATE RESORT & RETREAT</small></span></a><p>Escape the ordinary.<br/><em>Return to what matters.</em></p><button className="back-top" onClick={()=>go('home')}>BACK TO TOP <ArrowUpRight size={15}/></button></div><div className="footer-bottom"><span>© 2026 LUXORA · A CONCEPT BY GENZ DEVELOPERS</span><div><a href="#resort">The resort</a><a href="#stay">Stay</a><a href="#experiences">Experiences</a><a href="#contact">Enquiries</a></div><span>DESIGNED FOR THE ART OF GETTING AWAY</span></div><p className="demo-note">LUXORA is a fictional resort concept created for demonstration. Images are illustrative; contact details and booking operations are not connected.</p></footer>
  </main>;
}
export default App;