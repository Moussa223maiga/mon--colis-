import { useState } from "react";

// ─────────────────────────────────────────
// DONNÉES GLOBALES
// ─────────────────────────────────────────
const LANGS = {
  fr: { flag: "🇫🇷", name: "Français" },
  it: { flag: "🇮🇹", name: "Italiano" },
  es: { flag: "🇪🇸", name: "Español" },
  bm: { flag: "🇲🇱", name: "Bamanankan" },
  sn: { flag: "🇲🇱", name: "Soninké" },
};

const T = {
  fr: { tagline:"Envoyez, Suivez, Recevez", subtitle:"Transport Europe ↔ Mali", searchFrom:"Départ (Europe)", searchTo:"Arrivée (Mali)", searchBtn:"Rechercher", trackTitle:"Suivi Colis Express", trackPlaceholder:"Code colis (ex: #MC-5580)", trackBtn:"Suivre", urgentTitle:"Départs Urgents", sponsored:"Sponsorisé", navHome:"Accueil", navSearch:"Rechercher", navNotif:"Alertes", navActivity:"Activité", step1:"Réceptionné", step2:"En transit", step3:"Douanes", step4:"Prêt retrait", close:"Fermer", seeAll:"Tout voir →", proSpace:"Espace Pro", login:"Connexion" },
  it: { tagline:"Spedisci, Traccia, Ricevi", subtitle:"Trasporto Europa ↔ Mali", searchFrom:"Partenza (Europa)", searchTo:"Arrivo (Mali)", searchBtn:"Cerca", trackTitle:"Tracciamento Espresso", trackPlaceholder:"Codice (es: #MC-5580)", trackBtn:"Traccia", urgentTitle:"Partenze Urgenti", sponsored:"Sponsorizzato", navHome:"Home", navSearch:"Cerca", navNotif:"Avvisi", navActivity:"Attività", step1:"Ricevuto", step2:"In transito", step3:"Dogana", step4:"Pronto", close:"Chiudi", seeAll:"Vedi tutto →", proSpace:"Spazio Pro", login:"Accedi" },
  es: { tagline:"Envía, Rastrea, Recibe", subtitle:"Transporte Europa ↔ Mali", searchFrom:"Salida (Europa)", searchTo:"Llegada (Mali)", searchBtn:"Buscar", trackTitle:"Rastreo Express", trackPlaceholder:"Código (ej: #MC-5580)", trackBtn:"Rastrear", urgentTitle:"Salidas Urgentes", sponsored:"Patrocinado", navHome:"Inicio", navSearch:"Buscar", navNotif:"Alertas", navActivity:"Actividad", step1:"Recibido", step2:"En tránsito", step3:"Aduana", step4:"Listo", close:"Cerrar", seeAll:"Ver todo →", proSpace:"Espacio Pro", login:"Acceder" },
  bm: { tagline:"Ci, Sɔrɔ, Minɛ", subtitle:"Baarakɛcogo Eropa ↔ Mali", searchFrom:"Bɔli (Eropa)", searchTo:"Sigi (Mali)", searchBtn:"Ɲini", trackTitle:"Coli Lajɛ Joona", trackPlaceholder:"I ka kodi (#MC-5580)", trackBtn:"Lajɛ", urgentTitle:"TaamaShɛrɛ Joona", sponsored:"Sarali", navHome:"So", navSearch:"Ɲini", navNotif:"Kunnafoni", navActivity:"Baara", step1:"Sɔrɔla", step2:"Taama", step3:"Gudɔn", step4:"Ɲɛna", close:"Tigɛ", seeAll:"Bɛɛ lajɛ →", proSpace:"Pro Yɔrɔ", login:"Don" },
  sn: { tagline:"Yiri, Wori, Sefe", subtitle:"Taaxu Eropa ↔ Mali", searchFrom:"Tunka (Eropa)", searchTo:"Sigi (Mali)", searchBtn:"Soxo", trackTitle:"Coli Wori Yaaxi", trackPlaceholder:"I kodi (#MC-5580)", trackBtn:"Wori", urgentTitle:"Taaxu Yaaxi", sponsored:"Saraxale", navHome:"Gure", navSearch:"Soxo", navNotif:"Xabaare", navActivity:"Baane", step1:"Sefene", step2:"Taaxun", step3:"Gudaane", step4:"Hande", close:"Daga", seeAll:"Bɛɛ wori →", proSpace:"Pro Waxu", login:"Soxo" },
};

const TRANSPORTEURS = [
  { id:1, name:"Mali Express Cargo", emoji:"🚢", from:"Paris", to:"Bamako", price:3.50, rating:4.8, reviews:312, nextDep:"20 Juin", sponsored:true, color:"#14532d", services:["📦 Cartons","📺 TV","🏍️ Motos"], depotEU:"15 Rue de la Paix, Paris 75001", depotML:"Hamdallaye ACI 2000, Bamako", phone:"+33 1 23 45 67 89", desc:"Transporteur spécialisé Europe-Mali depuis 2018. Sérieux, ponctuel. Conteneur toutes les 3 semaines." },
  { id:2, name:"Sahel Fret Milano", emoji:"✈️", from:"Milan", to:"Bamako / Kayes", price:4.20, rating:4.6, reviews:189, nextDep:"18 Juin", sponsored:true, color:"#713f12", services:["📦 Cartons","💻 Électronique"], depotEU:"Via Torino 45, Milano 20123", depotML:"Lafiabougou, Bamako", phone:"+39 02 12 34 5678", desc:"Fret aérien et maritime depuis Milan. Spécialiste électronique et cartons. Livraison Kayes et Bamako." },
  { id:3, name:"Trans-Sahel Madrid", emoji:"🚢", from:"Madrid", to:"Bamako", price:3.80, rating:4.5, reviews:97, nextDep:"22 Juin", sponsored:false, color:"#1e3a5f", services:["📦 Cartons","🏍️ Motos","🛋️ Meubles"], depotEU:"Calle Mayor 12, Madrid 28013", depotML:"Magnambougou, Bamako", phone:"+34 91 123 4567", desc:"Transport maritime depuis l'Espagne. Spécialiste motos et gros volumes." },
  { id:4, name:"Bruxelles-Mali Direct", emoji:"🚢", from:"Bruxelles", to:"Bamako / Ségou", price:3.90, rating:4.7, reviews:224, nextDep:"25 Juin", sponsored:false, color:"#4a044e", services:["📦 Cartons","📺 TV","🛒 Divers"], depotEU:"Rue du Midi 8, Bruxelles 1000", depotML:"Badalabougou, Bamako", phone:"+32 2 123 45 67", desc:"Transport régulier Belgique-Mali. Tarifs compétitifs, excellent suivi." },
];

const TRACK_DATA = {
  "#MC-5580":{ step:2, transporter:"Mali Express Cargo", from:"Paris", to:"Bamako", date:"10 Juin 2025", weight:"45 kg" },
  "#MC-1234":{ step:4, transporter:"Sahel Fret Milano", from:"Milan", to:"Kayes", date:"2 Juin 2025", weight:"12 kg" },
  "#MC-9999":{ step:1, transporter:"Trans-Sahel Madrid", from:"Madrid", to:"Bamako", date:"12 Juin 2025", weight:"30 kg" },
};

const COLIS_TYPES = [
  { icon:"📦", label:"Cartons", price:3.50, unit:"/kg" },
  { icon:"📺", label:"TV / Électro", price:3.80, unit:"/kg" },
  { icon:"🏍️", label:"Moto", price:350, unit:"/pièce" },
  { icon:"🛋️", label:"Meubles", price:4.00, unit:"/kg" },
  { icon:"💻", label:"Informatique", price:4.20, unit:"/kg" },
  { icon:"🚗", label:"Pièces Auto", price:3.50, unit:"/kg" },
];

const AVIS = [
  { nom:"Amadou D.", ville:"Paris", note:5, date:"Mai 2025", texte:"Très professionnel, colis arrivé en parfait état !", avatar:"👨🏿" },
  { nom:"Fatoumata K.", ville:"Milan", note:5, date:"Avril 2025", texte:"Mon téléviseur est arrivé sans problème à Kayes.", avatar:"👩🏿" },
  { nom:"Moussa T.", ville:"Madrid", note:4, date:"Mars 2025", texte:"Bon transporteur, légèrement en retard mais bon suivi.", avatar:"👨🏿" },
  { nom:"Mariam C.", ville:"Bruxelles", note:5, date:"Mars 2025", texte:"Je travaille avec eux depuis 3 ans. Toujours satisfaite !", avatar:"👩🏿" },
];

// ─────────────────────────────────────────
// COMPOSANTS RÉUTILISABLES
// ─────────────────────────────────────────
function speak(text) {
  if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); }
}
function VoiceBtn({ text, small }) {
  return (
    <button onClick={e => { e.stopPropagation(); speak(text); }}
      className={`rounded-full bg-yellow-400 hover:bg-yellow-300 text-green-900 flex items-center justify-center ml-1 flex-shrink-0 active:scale-95 transition-all ${small ? "w-5 h-5" : "w-7 h-7"}`}>
      <span style={{ fontSize: small ? 9 : 11 }}>🔊</span>
    </button>
  );
}
function StarRating({ note }) {
  return <div className="flex">{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=note?"#f59e0b":"#d1d5db",fontSize:12}}>★</span>)}</div>;
}
function MaliFlag() {
  return <div className="flex h-0.5 w-full"><div className="flex-1 bg-green-600"/><div className="flex-1 bg-yellow-400"/><div className="flex-1 bg-red-600"/></div>;
}
function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-3 pb-1 bg-green-800 text-white text-xs font-medium flex-shrink-0">
      <span>9:41</span><span className="font-black tracking-wide text-sm">MON COLIS</span><span>📶 🔋</span>
    </div>
  );
}

// ─────────────────────────────────────────
// ÉCRAN ACCUEIL
// ─────────────────────────────────────────
function HomeScreen({ lang, setLang, navigate, t }) {
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showLang, setShowLang] = useState(false);
  const sponsored = TRANSPORTEURS.filter(x => x.sponsored);

  function doTrack() {
    const code = trackCode.trim().toUpperCase();
    const key = code.startsWith("#") ? code : "#" + code;
    const found = TRACK_DATA[key];
    if (found) { setTrackResult({ ...found, code: key }); setTrackError(false); }
    else { setTrackResult(null); setTrackError(true); }
    setShowTrack(true);
  }

  const steps = [t.step1, t.step2, t.step3, t.step4];
  const stepIcons = ["📥","🚢","🏛️","✅"];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50" style={{ scrollbarWidth:"none" }}>
      {/* HERO */}
      <div className="relative bg-green-700 px-5 pt-4 pb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",backgroundSize:"12px 12px" }} />
        <div className="flex justify-between items-center mb-4 relative">
          <button onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-white text-xs font-bold hover:bg-white/30 active:scale-95 transition-all backdrop-blur-sm">
            <span className="text-base">{LANGS[lang].flag}</span><span>{LANGS[lang].name}</span><span>▾</span>
          </button>
          <div className="flex gap-1.5">
            <button onClick={() => navigate("notif")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 active:scale-95">🔔</button>
            <button onClick={() => navigate("auth")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 active:scale-95">👤</button>
          </div>
        </div>
        {showLang && (
          <div className="absolute top-16 left-5 z-50 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100" style={{ minWidth:200 }}>
            {Object.entries(LANGS).map(([k,v]) => (
              <button key={k} onClick={() => { setLang(k); setShowLang(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors ${lang===k?"bg-green-50 font-bold text-green-700":"text-gray-700"}`}>
                <span className="text-xl">{v.flag}</span><span className="text-sm">{v.name}</span>
                {lang===k && <span className="ml-auto text-green-600">✓</span>}
              </button>
            ))}
          </div>
        )}
        <div className="text-white mb-1 relative">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-black tracking-tight">{t.tagline}</h1>
            <VoiceBtn text={t.tagline} />
          </div>
          <p className="text-green-200 text-sm mt-0.5">{t.subtitle}</p>
        </div>
        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-lg mt-4 p-3 space-y-2 relative">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">🛫</span>
            <input value={searchFrom} onChange={e=>setSearchFrom(e.target.value)} placeholder={t.searchFrom}
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent" />
            <VoiceBtn text={t.searchFrom} small />
          </div>
          <div className="h-px bg-gray-100 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-lg">🛬</span>
            <input value={searchTo} onChange={e=>setSearchTo(e.target.value)} placeholder={t.searchTo}
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent" />
            <VoiceBtn text={t.searchTo} small />
          </div>
          <button onClick={() => navigate("search", { from: searchFrom, to: searchTo })}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm active:scale-98 transition-all shadow-md flex items-center justify-center gap-2">
            🔍 {t.searchBtn}
          </button>
        </div>
      </div>

      {/* TRACK */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-md p-4 border border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📍</span>
          <h2 className="font-bold text-gray-800 text-sm">{t.trackTitle}</h2>
          <VoiceBtn text={t.trackTitle} small />
        </div>
        <div className="flex gap-2">
          <input value={trackCode} onChange={e=>setTrackCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doTrack()}
            placeholder={t.trackPlaceholder}
            className="flex-1 border-2 border-yellow-300 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400 bg-yellow-50" />
          <button onClick={doTrack} className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold px-4 py-2.5 rounded-xl text-sm active:scale-95 transition-all shadow">
            {t.trackBtn}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Essayez: #MC-5580 · #MC-1234 · #MC-9999</p>
      </div>

      {/* URGENT */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1"><span>🔥</span><h2 className="font-bold text-gray-800 text-sm">{t.urgentTitle}</h2><VoiceBtn text={t.urgentTitle} small /></div>
          <button onClick={() => navigate("search")} className="text-xs text-green-600 font-semibold hover:underline">{t.seeAll}</button>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            {sponsored.map((tr,i) => (
              <div key={tr.id} className={i===carouselIdx?"block":"hidden"}>
                <div onClick={() => navigate("profil", tr)} className="relative rounded-2xl p-4 text-white cursor-pointer active:scale-98 transition-all shadow-lg"
                  style={{ background:`linear-gradient(135deg,${tr.color},${tr.color}cc)` }}>
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">⭐ {t.sponsored}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">{tr.emoji}</div>
                    <div><h3 className="font-bold text-base">{tr.name}</h3><p className="text-white/80 text-xs">{tr.from} → {tr.to}</p></div>
                  </div>
                  <div className="flex gap-2 text-xs mb-2">
                    <span className="bg-white/20 rounded-lg px-2 py-1">📅 {tr.nextDep}</span>
                    <span className="bg-white/20 rounded-lg px-2 py-1">⚖️ {tr.price}€/kg</span>
                    <span className="bg-white/20 rounded-lg px-2 py-1">⭐ {tr.rating}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">{tr.services.map((s,j)=><span key={j} className="bg-white/15 text-xs rounded-full px-2 py-0.5">{s}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <button onClick={()=>setCarouselIdx(i=>(i-1+sponsored.length)%sponsored.length)} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 active:scale-95">‹</button>
            <div className="flex gap-1">{sponsored.map((_,i)=><div key={i} className={`h-2 rounded-full transition-all ${i===carouselIdx?"bg-green-600 w-4":"bg-gray-300 w-2"}`}/>)}</div>
            <button onClick={()=>setCarouselIdx(i=>(i+1)%sponsored.length)} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 active:scale-95">›</button>
          </div>
        </div>
      </div>

      {/* ALL TRANSPORTEURS */}
      <div className="mt-5 px-4 pb-6">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Tous les transporteurs</h2>
        <div className="space-y-3">
          {TRANSPORTEURS.filter(tr=>!tr.sponsored).map(tr => (
            <div key={tr.id} onClick={() => navigate("profil", tr)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 cursor-pointer hover:border-green-300 active:scale-98 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background:tr.color+"22" }}>{tr.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-sm">{tr.name}</h3>
                  <span className="text-green-600 font-bold text-sm ml-2">{tr.price}€/kg</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{tr.from} → {tr.to}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-yellow-600 font-medium">⭐ {tr.rating}</span>
                  <span className="text-xs text-gray-400">({tr.reviews})</span>
                  <span className="text-xs text-blue-500 ml-auto">📅 {tr.nextDep}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRO BANNER */}
      <div className="mx-4 mb-6 rounded-2xl p-4 text-white relative overflow-hidden" style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
        <div className="flex items-center gap-2 mb-1"><span>👑</span><h3 className="font-black text-sm">Espace Transporteur PRO</h3></div>
        <p className="text-xs opacity-80 mb-3">Créez votre profil et gérez vos voyages directement depuis l'app</p>
        <button onClick={() => navigate("pro")} className="bg-white text-purple-700 font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all">
          Accéder au tableau de bord →
        </button>
      </div>

      {/* TRACK MODAL */}
      {showTrack && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 backdrop-blur-sm" onClick={() => setShowTrack(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 shadow-2xl max-h-[80%] overflow-y-auto" onClick={e=>e.stopPropagation()} style={{ maxWidth:448, margin:"0 auto" }}>
            {trackResult ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-lg">Statut colis</h3><VoiceBtn text={`Colis ${trackResult.code}, étape ${trackResult.step} sur 4`} small /></div>
                  <button onClick={()=>setShowTrack(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">×</button>
                </div>
                <div className="inline-flex items-center gap-2 bg-green-50 rounded-xl px-3 py-1.5 mb-4">
                  <span className="font-mono font-bold text-green-700">{trackResult.code}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trackResult.step===4?"bg-green-600 text-white":"bg-yellow-400 text-yellow-900"}`}>
                    {trackResult.step===4?"✅ Livré":"🔄 En cours"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[{icon:"🚛",l:"Transporteur",v:trackResult.transporter},{icon:"📅",l:"Date",v:trackResult.date},{icon:"🛫",l:"De",v:trackResult.from},{icon:"🛬",l:"Vers",v:trackResult.to},{icon:"⚖️",l:"Poids",v:trackResult.weight},{icon:"📊",l:"Étape",v:`${trackResult.step}/4`}].map((r,i)=>(
                    <div key={i} className="bg-gray-50 rounded-xl p-2.5"><div className="text-xs text-gray-400">{r.icon} {r.l}</div><div className="text-sm font-bold text-gray-800">{r.v}</div></div>
                  ))}
                </div>
                {/* Step bar */}
                <div className="flex justify-between mb-1">{steps.map((s,i)=>(
                  <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 ${i+1<=trackResult.step?"bg-green-600 border-green-600 text-white":"bg-gray-100 border-gray-300 text-gray-400"}`}>{stepIcons[i]}</div>
                ))}</div>
                <div className="relative h-2 bg-gray-200 rounded-full mx-4 mb-3"><div className="h-2 bg-green-600 rounded-full" style={{ width:`${((trackResult.step-1)/3)*100}%` }}/></div>
                <div className="flex justify-between mb-4">{steps.map((s,i)=><p key={i} className={`text-xs text-center flex-1 ${i+1<=trackResult.step?"text-green-700 font-semibold":"text-gray-400"}`}>{s}</p>)}</div>
                <button onClick={()=>setShowTrack(false)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">{t.close}</button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">❓</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Code introuvable</h3>
                <p className="text-gray-500 text-sm mb-4">Essayez: <span className="font-mono text-green-600">#MC-5580</span></p>
                <button onClick={()=>setShowTrack(false)} className="bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-xl">{t.close}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ÉCRAN RECHERCHE
// ─────────────────────────────────────────
function SearchScreen({ navigate, t, initFrom, initTo }) {
  const [from, setFrom] = useState(initFrom || "");
  const [to, setTo] = useState(initTo || "");
  const [results, setResults] = useState(TRANSPORTEURS);
  const citiesEU = ["Paris","Milan","Madrid","Bruxelles","Lyon","Rome","Barcelone"];
  const citiesML = ["Bamako","Kayes","Ségou","Sikasso","Mopti","Gao"];
  function doSearch() {
    setResults(TRANSPORTEURS.filter(tr =>
      (!from || tr.from.toLowerCase().includes(from.toLowerCase())) &&
      (!to || tr.to.toLowerCase().includes(to.toLowerCase()))
    ) || TRANSPORTEURS);
  }
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="bg-green-700 px-5 pt-4 pb-4">
        <div className="flex items-center gap-1 mb-3"><h2 className="text-white font-black text-lg">{t.searchBtn}</h2><VoiceBtn text={t.searchBtn} small /></div>
        <div className="bg-white rounded-2xl p-3 space-y-2 shadow">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛫</span>
            <select value={from} onChange={e=>setFrom(e.target.value)} className="flex-1 text-sm text-gray-700 outline-none bg-transparent">
              <option value="">-- {t.searchFrom} --</option>
              {citiesEU.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="h-px bg-gray-100"/>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛬</span>
            <select value={to} onChange={e=>setTo(e.target.value)} className="flex-1 text-sm text-gray-700 outline-none bg-transparent">
              <option value="">-- {t.searchTo} --</option>
              {citiesML.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={doSearch} className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm active:scale-98 transition-all">
            🔍 {t.searchBtn}
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500 font-semibold">{results.length} transporteur(s) trouvé(s)</p>
        {results.map(tr => (
          <div key={tr.id} onClick={() => navigate("profil", tr)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 active:scale-98 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background:tr.color+"22" }}>{tr.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between"><h3 className="font-bold text-gray-800 text-sm">{tr.name}</h3>
                  {tr.sponsored&&<span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">⭐</span>}
                </div>
                <p className="text-gray-500 text-xs">{tr.from} → {tr.to}</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-green-50 text-green-700 rounded-lg px-2 py-1 font-bold">{tr.price}€/kg</span>
              <span className="bg-gray-50 text-gray-600 rounded-lg px-2 py-1">⭐ {tr.rating}</span>
              <span className="bg-blue-50 text-blue-600 rounded-lg px-2 py-1">📅 {tr.nextDep}</span>
              <button onClick={e=>{e.stopPropagation();navigate("reservation",tr);}} className="ml-auto bg-green-600 text-white rounded-lg px-3 py-1 font-bold active:scale-95">Réserver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÉCRAN PROFIL TRANSPORTEUR
// ─────────────────────────────────────────
function ProfilScreen({ tr, navigate, t }) {
  const [activeTab, setActiveTab] = useState("info");
  const [liked, setLiked] = useState(false);
  if (!tr) return null;
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      {/* Cover */}
      <div className="relative h-32" style={{ background:`linear-gradient(135deg,${tr.color},${tr.color}99)` }}>
        <div className="absolute inset-0 opacity-10" style={{ background:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",backgroundSize:"12px 12px" }}/>
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <button onClick={() => navigate("home")} className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white active:scale-95">‹</button>
          <button onClick={() => setLiked(!liked)} className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center active:scale-95 text-sm">{liked?"❤️":"🤍"}</button>
        </div>
        <div className="absolute -bottom-8 left-5 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl border-2 border-white">{tr.emoji}</div>
        {tr.sponsored && <div className="absolute -bottom-3 left-14 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">✓ Vérifié</div>}
      </div>
      {/* Info header */}
      <div className="px-5 pt-12 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1"><h1 className="font-black text-gray-800 text-xl">{tr.name}</h1><VoiceBtn text={tr.name} small /></div>
        <p className="text-gray-500 text-xs">🛫 {tr.from} → 🛬 {tr.to}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating note={Math.round(tr.rating)}/><span className="font-bold text-gray-700 text-sm">{tr.rating}</span>
          <span className="text-gray-400 text-xs">({tr.reviews} avis)</span>
        </div>
        <div className="flex gap-2 mt-3">
          {[{icon:"📦",v:"2400+",l:"Colis"},{icon:"⭐",v:tr.rating,l:"Note"},{icon:"✅",v:"98%",l:"Ponctualité"},{icon:"🗓️",v:"3 sem.",l:"Fréquence"}].map((s,i)=>(
            <div key={i} className="flex-1 bg-gray-50 rounded-xl py-2 text-center">
              <div className="text-base">{s.icon}</div><div className="font-black text-gray-800 text-xs">{s.v}</div><div className="text-gray-400" style={{fontSize:9}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 sticky top-0 z-10">
        {[{id:"info",l:"ℹ️ Info"},{id:"tarifs",l:"💰 Tarifs"},{id:"avis",l:"⭐ Avis"}].map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${activeTab===tab.id?"border-green-600 text-green-600":"border-transparent text-gray-400"}`}>
            {tab.l}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="p-4 space-y-3">
        {activeTab==="info" && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-2"><h3 className="font-bold text-gray-700 text-sm">À propos</h3><VoiceBtn text={tr.desc} small /></div>
              <p className="text-gray-600 text-sm leading-relaxed">{tr.desc}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm mb-3">📍 Dépôts</h3>
              {[{flag:"🇪🇺",l:"Europe",v:tr.depotEU},{flag:"🇲🇱",l:"Mali",v:tr.depotML}].map((d,i)=>(
                <div key={i} className={`flex gap-3 py-2.5 ${i>0?"border-t border-gray-50":""}`}>
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">{d.flag}</div>
                  <div><p className="text-xs font-bold text-gray-700">{d.l}</p><p className="text-xs text-gray-500">{d.v}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm mb-2">📞 Contact</h3>
              <div className="flex gap-2">
                <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">📞 {tr.phone}</div>
                <button className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95">Appeler</button>
              </div>
            </div>
          </>
        )}
        {activeTab==="tarifs" && (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex gap-2">
              <span>💡</span><p className="text-xs text-yellow-800">Tarifs indicatifs — contactez pour un devis.</p>
            </div>
            {COLIS_TYPES.map((s,i)=>(
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">{s.icon}</div>
                <div className="flex-1"><div className="flex items-center gap-1"><h3 className="font-bold text-gray-800 text-sm">{s.label}</h3><VoiceBtn text={`${s.label} ${s.price}€${s.unit}`} small /></div></div>
                <span className="font-black text-green-700 text-sm">{s.price}€{s.unit}</span>
              </div>
            ))}
          </>
        )}
        {activeTab==="avis" && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="text-center"><div className="font-black text-4xl text-gray-800">{tr.rating}</div><StarRating note={5}/><p className="text-xs text-gray-400 mt-1">{tr.reviews} avis</p></div>
              <div className="flex-1 space-y-1">{[5,4,3].map(s=><div key={s} className="flex items-center gap-2"><span className="text-xs text-gray-500 w-3">{s}</span><span className="text-yellow-400 text-xs">★</span><div className="flex-1 h-1.5 bg-gray-100 rounded-full"><div className="h-1.5 bg-yellow-400 rounded-full" style={{ width:`${s===5?75:s===4?20:5}%` }}/></div></div>)}</div>
            </div>
            {AVIS.map((a,i)=>(
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-lg">{a.avatar}</div>
                  <div><div className="flex items-center gap-1"><p className="font-bold text-gray-800 text-sm">{a.nom}</p><VoiceBtn text={a.texte} small /></div><p className="text-gray-400 text-xs">{a.ville} · {a.date}</p></div>
                  <StarRating note={a.note}/>
                </div>
                <p className="text-gray-600 text-sm">"{a.texte}"</p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="h-20"/>
      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none" style={{ zIndex:40 }}>
        <div className="w-full max-w-sm bg-white border-t border-gray-100 px-4 py-3 flex gap-2 pointer-events-auto">
          <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm active:scale-95">💬 WhatsApp</button>
          <button onClick={() => navigate("reservation", tr)} className="flex-2 bg-green-600 text-white font-black py-3 px-6 rounded-xl text-sm active:scale-98 shadow-md">📦 Réserver</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÉCRAN AUTH
// ─────────────────────────────────────────
function AuthScreen({ navigate }) {
  const [mode, setMode] = useState("welcome");
  const [role, setRole] = useState("client");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nom:"", prenom:"", phone:"", email:"", password:"", confirm:"", ville:"" });
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  function submit() { setLoading(true); setTimeout(()=>{ setLoading(false); navigate("home"); }, 1500); }

  if (mode==="welcome") return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="bg-green-700 px-6 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",backgroundSize:"12px 12px" }}/>
        <button onClick={() => navigate("home")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white mb-4 active:scale-95">‹</button>
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4">📦</div>
          <h1 className="text-white font-black text-3xl">Mon Colis</h1>
          <div className="flex items-center justify-center gap-1 mt-1"><p className="text-green-200 text-sm">Envoyez, Suivez, Recevez</p><VoiceBtn text="Envoyez, Suivez, Recevez"/></div>
        </div>
      </div>
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-1 justify-center mb-5"><h2 className="text-gray-800 font-black text-lg">Je suis...</h2><VoiceBtn text="Je suis client ou transporteur ?" small /></div>
        <div className="space-y-3">
          {[{role:"client",icon:"👤",label:"Un Client",sub:"J'envoie ou reçois des colis",color:"border-green-200 hover:border-green-500"},
            {role:"transporteur",icon:"🚛",label:"Un Transporteur",sub:"Je transporte des colis",color:"border-yellow-200 hover:border-yellow-500"}].map(r=>(
            <button key={r.role} onClick={()=>{ setRole(r.role); setMode("login"); }}
              className={`w-full bg-white border-2 ${r.color} rounded-2xl p-4 flex items-center gap-4 active:scale-98 transition-all shadow-sm`}>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">{r.icon}</div>
              <div className="text-left flex-1"><h3 className="font-black text-gray-800 text-base">{r.label}</h3><p className="text-gray-500 text-xs">{r.sub}</p></div>
              <span className="text-gray-400 text-xl">›</span>
            </button>
          ))}
        </div>
        <div className="flex rounded-xl overflow-hidden h-2 mt-6"><div className="flex-1 bg-green-600"/><div className="flex-1 bg-yellow-400"/><div className="flex-1 bg-red-600"/></div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      <div className="bg-green-700 px-5 pt-4 pb-6">
        <button onClick={()=>mode==="login"?setMode("welcome"):step>1?setStep(1):setMode("login")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white mb-4 active:scale-95">‹</button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">{role==="transporteur"?"🚛":"👤"}</div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-white font-black text-xl">{mode==="login"?"Se Connecter":"Créer un compte"}</h1>
              <VoiceBtn text={mode==="login"?"Se connecter":"Créer un compte"} small />
            </div>
            <p className="text-green-300 text-xs">{role==="transporteur"?"Espace Transporteur":"Espace Client"}{mode==="register"&&` · Étape ${step}/2`}</p>
          </div>
        </div>
        {mode==="register" && (
          <div className="flex gap-2 mt-4">
            {["Informations","Sécurité"].map((s,i)=>(
              <div key={i} className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold text-center transition-all ${step===i+1?"bg-white text-green-700":"bg-white/20 text-white/60"}`}>{i+1}. {s}</div>
            ))}
          </div>
        )}
      </div>
      <div className="p-5 space-y-4">
        {mode==="login" && (
          <>
            {[{icon:"📧",label:"Email",key:"email",ph:"exemple@gmail.com"},{icon:"🔒",label:"Mot de passe",key:"password",ph:"••••••••"}].map(field=>(
              <div key={field.key}>
                <div className="flex items-center gap-1 mb-1.5"><label className="text-xs font-bold text-gray-600">{field.label}</label><VoiceBtn text={field.label} small /></div>
                <div className="flex items-center border-2 border-gray-200 focus-within:border-green-500 rounded-2xl px-3 py-3 bg-white gap-2">
                  <span>{field.icon}</span>
                  <input type={field.key==="password"?"password":"text"} value={form[field.key]} onChange={f(field.key)} placeholder={field.ph} className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300"/>
                </div>
              </div>
            ))}
            <button onClick={submit}
              className={`w-full font-black py-4 rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2 ${loading?"bg-gray-200 text-gray-400":"bg-green-600 text-white active:scale-98"}`} disabled={loading}>
              {loading?<span className="animate-spin">⏳</span>:"Se connecter →"}
            </button>
            <div className="text-center"><span className="text-gray-500 text-sm">Pas encore de compte ? </span><button onClick={()=>setMode("register")} className="text-green-600 font-black text-sm">Créer un compte</button></div>
          </>
        )}
        {mode==="register" && step===1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[{l:"Prénom",k:"prenom",ph:"Amadou"},{l:"Nom",k:"nom",ph:"Diallo"}].map(fd=>(
                <div key={fd.k}><label className="text-xs font-bold text-gray-600 mb-1 block">{fd.l}</label>
                  <input value={form[fd.k]} onChange={f(fd.k)} placeholder={fd.ph} className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none"/>
                </div>
              ))}
            </div>
            {[{l:"📞 Téléphone",k:"phone",ph:"+33 6 12 34 56 78"},{l:"🏙️ Ville",k:"ville",ph:"Paris, Milan, Madrid..."}].map(fd=>(
              <div key={fd.k}><label className="text-xs font-bold text-gray-600 mb-1 block">{fd.l}</label>
                <input value={form[fd.k]} onChange={f(fd.k)} placeholder={fd.ph} className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none"/>
              </div>
            ))}
            <button onClick={()=>setStep(2)} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-base active:scale-98 transition-all shadow-md">Continuer →</button>
            <div className="text-center"><span className="text-gray-500 text-sm">Déjà un compte ? </span><button onClick={()=>setMode("login")} className="text-green-600 font-black text-sm">Se connecter</button></div>
          </>
        )}
        {mode==="register" && step===2 && (
          <>
            {[{l:"📧 Email",k:"email",ph:"exemple@gmail.com",t:"text"},{l:"🔒 Mot de passe",k:"password",ph:"Min. 8 caractères",t:"password"},{l:"🔒 Confirmer",k:"confirm",ph:"••••••••",t:"password"}].map(fd=>(
              <div key={fd.k}><label className="text-xs font-bold text-gray-600 mb-1 block">{fd.l}</label>
                <input type={fd.t} value={form[fd.k]} onChange={f(fd.k)} placeholder={fd.ph} className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none"/>
              </div>
            ))}
            {form.password && <div className="flex gap-1">{[1,2,3,4].map(i=><div key={i} className={`flex-1 h-1 rounded-full ${form.password.length>=i*2?i<=2?"bg-red-400":i===3?"bg-yellow-400":"bg-green-500":"bg-gray-200"}`}/>)}</div>}
            <div className="bg-gray-50 rounded-2xl p-3 flex gap-2"><input type="checkbox" className="mt-0.5 accent-green-600" defaultChecked/><p className="text-xs text-gray-500">J'accepte les <span className="text-green-600 font-semibold">Conditions d'utilisation</span> de Mon Colis.</p></div>
            <button onClick={submit}
              className={`w-full font-black py-4 rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2 ${loading?"bg-gray-200 text-gray-400":"bg-green-600 text-white active:scale-98"}`} disabled={loading}>
              {loading?<span className="animate-spin">⏳</span>:"Créer mon compte 🎉"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ÉCRAN RÉSERVATION
// ─────────────────────────────────────────
function ReservationScreen({ tr, navigate }) {
  const [step, setStep] = useState(1);
  const [colisType, setColisType] = useState("");
  const [poids, setPoids] = useState("");
  const [qte, setQte] = useState(1);
  const [voyage, setVoyage] = useState(null);
  const [destNom, setDestNom] = useState("");
  const [destPhone, setDestPhone] = useState("");
  const [destVille, setDestVille] = useState("");
  const [paiement, setPaiement] = useState("");
  const [assurance, setAssurance] = useState(false);
  const [code, setCode] = useState("");
  const voyages = [
    { id:"V1", depart:`${tr?.nextDep} 2025`, fermeture:"5 jours avant", arrivee:"~45 jours", type:"🚢 Maritime", places:12 },
    { id:"V2", depart:"10 Juil 2025", fermeture:"5 Juil", arrivee:"~5 Août", type:"🚢 Maritime", places:18 },
  ];
  function calcTotal() {
    const type = COLIS_TYPES.find(c=>c.label===colisType);
    if (!type) return "0.00";
    let t = type.unit==="/pièce" ? type.price*qte : type.price*(parseFloat(poids)||0)*qte;
    if (assurance) t *= 1.03;
    return t.toFixed(2);
  }
  const canNext = step===1?(colisType&&(poids||colisType==="Moto")):step===2?voyage:step===3?(destNom&&destPhone&&destVille):true;

  function handleNext() {
    if (step<4) setStep(s=>s+1);
    else { setCode("#MC-"+Math.floor(1000+Math.random()*9000)); setStep(5); }
  }

  if (step===5) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-center">
      <div className="text-7xl mb-4">🎉</div>
      <h1 className="font-black text-gray-800 text-2xl mb-2">Réservation confirmée !</h1>
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 w-full mb-5 mt-3">
        <p className="text-xs text-gray-500 mb-1">Votre code de suivi</p>
        <p className="font-black text-green-700 text-3xl tracking-widest">{code}</p>
        <VoiceBtn text={`Votre code de suivi est ${code}`} />
      </div>
      {[{icon:"📨",t:"SMS envoyé au destinataire"},{icon:"💬",t:"WhatsApp envoyé au transporteur"},{icon:"📧",t:"Email de confirmation envoyé"}].map((item,i)=>(
        <div key={i} className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 w-full mb-2"><span>{item.icon}</span><span className="text-xs text-green-700 font-medium">{item.t}</span><span className="ml-auto text-green-500">✓</span></div>
      ))}
      <button onClick={() => navigate("home")} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-base active:scale-95 mt-3">🏠 Retour à l'accueil</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col" style={{ overflow:"hidden" }}>
      {/* Header */}
      <div className="bg-green-700 px-5 pt-3 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={()=>step>1?setStep(s=>s-1):navigate("home")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95">‹</button>
          <div>
            <h2 className="text-white font-black text-base">{tr?.name}</h2>
            <p className="text-green-300 text-xs">{tr?.from} → {tr?.to}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[{icon:"📦",l:"Colis"},{icon:"🗓️",l:"Voyage"},{icon:"👤",l:"Contact"},{icon:"✅",l:"Récap"}].map((s,i)=>(
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step===i+1?"bg-white text-green-700 scale-110":step>i+1?"bg-green-500 text-white":"bg-white/20 text-white/50"}`}>
                  {step>i+1?"✓":s.icon}
                </div>
                <span className="text-white/70 mt-0.5" style={{fontSize:8}}>{s.l}</span>
              </div>
              {i<3&&<div className={`w-5 h-0.5 mx-0.5 mb-4 ${step>i+1?"bg-green-400":"bg-white/20"}`}/>}
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth:"none" }}>
        {step===1 && (
          <>
            <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-base">📦 Type de colis</h3><VoiceBtn text="Choisissez le type de colis" small /></div>
            <div className="grid grid-cols-3 gap-2">
              {COLIS_TYPES.map(c=>(
                <button key={c.label} onClick={()=>setColisType(c.label)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${colisType===c.label?"border-green-500 bg-green-50 text-green-700":"border-gray-200 bg-white text-gray-600"}`}>
                  {c.icon}<br/>{c.label}<br/><span className="text-green-600">{c.price}€{c.unit}</span>
                </button>
              ))}
            </div>
            {colisType && colisType!=="Moto" && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                <div>
                  <div className="flex items-center gap-1 mb-1"><label className="text-xs font-bold text-gray-600">Poids (kg)</label><VoiceBtn text="Poids en kilogrammes" small /></div>
                  <input type="number" value={poids} onChange={e=>setPoids(e.target.value)} placeholder="Ex: 20"
                    className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Quantité</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-32">
                    <button onClick={()=>setQte(q=>Math.max(1,q-1))} className="w-10 h-10 bg-gray-50 font-bold text-lg active:bg-gray-200">−</button>
                    <span className="flex-1 text-center font-bold">{qte}</span>
                    <button onClick={()=>setQte(q=>q+1)} className="w-10 h-10 bg-gray-50 font-bold text-lg active:bg-gray-200">+</button>
                  </div>
                </div>
                {poids && <div className="bg-green-50 rounded-xl px-3 py-2 flex justify-between"><span className="text-xs text-gray-500">Estimation</span><span className="font-black text-green-700">{calcTotal()}€</span></div>}
              </div>
            )}
            <div onClick={()=>setAssurance(!assurance)} className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${assurance?"border-green-500 bg-green-50":"border-gray-200 bg-white"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${assurance?"border-green-500 bg-green-500":"border-gray-300"}`}>{assurance&&<span className="text-white text-xs">✓</span>}</div>
                <div><div className="flex items-center gap-1"><p className="font-bold text-sm">🛡️ Assurance (+3%)</p><VoiceBtn text="Assurance colis" small /></div><p className="text-xs text-gray-500">Remboursement en cas de perte</p></div>
              </div>
            </div>
          </>
        )}
        {step===2 && (
          <>
            <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-base">🗓️ Choisissez un voyage</h3><VoiceBtn text="Choisissez votre date de départ" small /></div>
            {voyages.map(v=>(
              <button key={v.id} onClick={()=>setVoyage(v)}
                className={`w-full rounded-2xl overflow-hidden shadow-sm border-2 text-left transition-all ${voyage?.id===v.id?"border-green-500":"border-gray-100"}`}>
                <div className="bg-green-600 px-4 py-2 flex justify-between items-center">
                  <span className="text-white text-xs font-bold">{v.type}</span>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">🟢 {v.places} places</span>
                </div>
                <div className="bg-white p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[{icon:"🔒",l:"Fermeture",v:v.fermeture},{icon:"🚀",l:"Départ",v:v.depart},{icon:"🏁",l:"Arrivée",v:v.arrivee}].map((r,j)=>(
                      <div key={j} className="bg-gray-50 rounded-xl p-2"><div className="text-sm">{r.icon}</div><div className="text-gray-400" style={{fontSize:9}}>{r.l}</div><div className="text-xs font-bold text-gray-700 mt-0.5">{r.v}</div></div>
                    ))}
                  </div>
                  {voyage?.id===v.id && <div className="mt-2 bg-green-50 rounded-xl px-3 py-1.5 text-xs text-green-700 font-bold">✓ Sélectionné</div>}
                </div>
              </button>
            ))}
          </>
        )}
        {step===3 && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center gap-1"><h3 className="font-bold text-gray-700 text-sm">🛬 Destinataire (Mali)</h3><VoiceBtn text="Informations du destinataire" small /></div>
              {[{l:"Nom complet *",ph:"Nom et prénom",val:destNom,set:setDestNom},{l:"📞 Téléphone Mali *",ph:"XX XX XX XX",val:destPhone,set:setDestPhone}].map((fd,i)=>(
                <div key={i}><label className="text-xs font-bold text-gray-500 mb-1 block">{fd.l}</label>
                  <input value={fd.val} onChange={e=>fd.set(e.target.value)} placeholder={fd.ph} className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none"/>
                </div>
              ))}
              <div><label className="text-xs font-bold text-gray-500 mb-1 block">Ville *</label>
                <select value={destVille} onChange={e=>setDestVille(e.target.value)} className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
                  <option value="">-- Choisir --</option>
                  {["Bamako","Kayes","Ségou","Sikasso","Mopti","Gao"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-3"><h3 className="font-bold text-gray-700 text-sm">💳 Paiement</h3><VoiceBtn text="Mode de paiement" small /></div>
              <div className="grid grid-cols-2 gap-2">
                {[{icon:"💵",l:"Espèces"},{icon:"📱",l:"Mobile Money"},{icon:"🏦",l:"Virement"},{icon:"💳",l:"Carte"}].map(p=>(
                  <button key={p.l} onClick={()=>setPaiement(p.l)}
                    className={`py-3 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1 transition-all ${paiement===p.l?"border-green-500 bg-green-50 text-green-700":"border-gray-200 bg-gray-50 text-gray-600"}`}>
                    {p.icon} {p.l}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {step===4 && (
          <>
            <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-base">✅ Récapitulatif</h3><VoiceBtn text="Vérifiez votre réservation avant de confirmer" small /></div>
            {[
              { title:"🚛 Transporteur", content:<><p className="font-bold text-sm">{tr?.name}</p><p className="text-xs text-gray-500">{tr?.from} → {tr?.to}</p></> },
              { title:"🗓️ Voyage", content:<div className="flex gap-2">{[{l:"Départ",v:voyage?.depart},{l:"Arrivée",v:voyage?.arrivee}].map((r,i)=><div key={i} className="flex-1 bg-gray-50 rounded-xl p-2 text-center"><p className="text-xs text-gray-400">{r.l}</p><p className="font-bold text-xs">{r.v}</p></div>)}</div> },
              { title:"📦 Colis", content:<><p className="font-bold text-sm">{COLIS_TYPES.find(c=>c.label===colisType)?.icon} {colisType} {poids?`· ${poids}kg`:""} ×{qte}</p>{assurance&&<p className="text-xs text-blue-600">🛡️ Assurance incluse</p>}</> },
              { title:"🛬 Destinataire", content:<><p className="font-bold text-sm">{destNom}</p><p className="text-xs text-gray-500">+223 {destPhone} · {destVille}</p></> },
            ].map((card,i)=>(
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"><p className="text-xs font-bold text-gray-400 mb-2">{card.title}</p>{card.content}</div>
            ))}
            <div className="bg-green-600 rounded-2xl p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1"><span className="font-bold">💰 Total estimé</span><VoiceBtn text={`Total ${calcTotal()} euros`} small /></div>
                <span className="font-black text-3xl">{calcTotal()}€</span>
              </div>
              <p className="text-green-200 text-xs mt-1">Paiement: {paiement||"À définir"}</p>
            </div>
          </>
        )}
      </div>
      {/* Bottom btn */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 flex-shrink-0">
        <button onClick={handleNext}
          className={`w-full font-black py-4 rounded-2xl text-base transition-all shadow-md flex items-center justify-center gap-2 ${canNext?"bg-green-600 text-white active:scale-98":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
          {step===4?"✅ Confirmer la réservation":"Continuer →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TABLEAU DE BORD PRO
// ─────────────────────────────────────────
function ProScreen({ navigate }) {
  const [tab, setTab] = useState("home");
  const [showCreateVoyage, setShowCreateVoyage] = useState(false);
  const [reservations, setReservations] = useState([
    { id:"R-001", client:"Amadou Diallo", phone:"+33 6 12 34 56 78", from:"Paris", to:"Bamako", weight:"23 kg", type:"📦 Cartons", status:"confirmed", date:"10 Juin", montant:"80.50€" },
    { id:"R-002", client:"Fatoumata Koné", phone:"+39 347 123 4567", from:"Milan", to:"Kayes", weight:"45 kg", type:"📺 TV", status:"pending", date:"11 Juin", montant:"189.00€" },
    { id:"R-003", client:"Moussa Traoré", phone:"+34 612 345 678", from:"Madrid", to:"Bamako", weight:"12 kg", type:"💻 Électro", status:"confirmed", date:"10 Juin", montant:"50.40€" },
  ]);
  const [colisData, setColisData] = useState([
    { code:"#MC-5580", client:"Amadou Diallo", weight:"23 kg", step:2 },
    { code:"#MC-5581", client:"Moussa Traoré", weight:"12 kg", step:1 },
    { code:"#MC-5582", client:"Ibrahim Sanogo", weight:"30 kg", step:3 },
  ]);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ from:"Paris", to:"Bamako", type:"🚢 Maritime", fermeture:"", depart:"" });
  const pending = reservations.filter(r=>r.status==="pending").length;
  const confirmed = reservations.filter(r=>r.status==="confirmed").length;
  const revenue = reservations.filter(r=>r.status==="confirmed").reduce((a,r)=>a+parseFloat(r.montant),0).toFixed(2);
  const steps = ["📥 Réceptionné","🚢 En transit","🏛️ Douanes","✅ Prêt"];
  const stepColors = ["bg-blue-500","bg-yellow-500","bg-orange-500","bg-green-600"];

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(""),3000); }
  function confirm(id) { setReservations(p=>p.map(r=>r.id===id?{...r,status:"confirmed"}:r)); showToast("✅ Réservation confirmée !"); }
  function advance(code) { setColisData(p=>p.map(c=>c.code===code&&c.step<4?{...c,step:c.step+1}:c)); showToast("📨 Statut mis à jour ! SMS envoyé."); }

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
      {toast && <div className="fixed top-14 left-4 right-4 z-50 bg-green-600 text-white rounded-2xl px-4 py-3 text-sm font-bold shadow-xl" style={{ maxWidth:416, margin:"0 auto" }}>{toast}</div>}
      {tab==="home" && (
        <>
          <div className="bg-green-800 px-5 pt-4 pb-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <button onClick={()=>navigate("home")} className="text-green-300 text-xs mb-1 flex items-center gap-1">‹ Retour client</button>
                <div className="flex items-center gap-1"><h1 className="text-white font-black text-xl">Mali Express Cargo</h1><VoiceBtn text="Bonjour Mali Express Cargo" small /></div>
                <p className="text-green-300 text-xs">Paris → Bamako</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🚢</div>
            </div>
            <div className="flex gap-2">
              {[{icon:"📦",l:"Réservations",v:reservations.length,c:"#15803d",sub:`${confirmed} confirmées`},{icon:"⏳",l:"En attente",v:pending,c:"#b45309",sub:"À confirmer"},{icon:"💰",l:"Revenus",v:`${revenue}€`,c:"#1d4ed8",sub:"Ce voyage"}].map((s,i)=>(
                <div key={i} className="flex-1 rounded-2xl p-3 text-white" style={{ background:s.c }}>
                  <div className="text-xl">{s.icon}</div><div className="font-black text-lg">{s.v}</div>
                  <div className="text-xs opacity-80 leading-tight">{s.l}</div>
                  <div className="text-xs opacity-60">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 space-y-3">
            {[
              { icon:"🗓️", bg:"bg-green-100", title:"Créer un Voyage", sub:"Annoncez votre prochain conteneur", badge:"Nouveau", badgeColor:"bg-green-100 text-green-700", action:()=>setShowCreateVoyage(true) },
              { icon:"📋", bg:"bg-yellow-100", title:"Réservations", sub:"Voir qui veut déposer des colis", badge:pending>0?`⚠️ ${pending} en attente`:null, badgeColor:"bg-yellow-100 text-yellow-700", action:()=>setTab("reservations") },
              { icon:"🔄", bg:"bg-blue-100", title:"Mettre à Jour", sub:"Statut colis → SMS auto aux clients", badge:"📨 SMS automatique", badgeColor:"bg-blue-100 text-blue-700", action:()=>setTab("statuts") },
            ].map((card,i)=>(
              <button key={i} onClick={card.action}
                className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 hover:shadow-lg active:scale-98 transition-all border-2 border-transparent">
                <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>{card.icon}</div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-base">{card.title}</h3><VoiceBtn text={card.title} small /></div>
                  <p className="text-gray-500 text-xs mt-0.5">{card.sub}</p>
                  {card.badge && <span className={`text-xs ${card.badgeColor} font-semibold px-2 py-0.5 rounded-full mt-1 inline-block`}>{card.badge}</span>}
                </div>
                <span className="text-gray-400 text-xl">›</span>
              </button>
            ))}
            <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <div className="flex items-center gap-2 mb-1"><span>👑</span><h3 className="font-black text-sm">Passez en PRO — 20€/mois</h3></div>
              <p className="text-xs opacity-80 mb-3">SMS auto, statistiques, mise en avant sponsorisée</p>
              <button className="bg-white text-purple-700 font-bold text-xs px-4 py-2 rounded-xl active:scale-95">Essai gratuit 30 jours →</button>
            </div>
          </div>
        </>
      )}
      {tab==="reservations" && (
        <>
          <div className="bg-green-800 px-5 pt-4 pb-4 flex items-center gap-2">
            <button onClick={()=>setTab("home")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95">‹</button>
            <div className="flex items-center gap-1"><h2 className="text-white font-black text-lg">Réservations</h2><VoiceBtn text="Liste des réservations" small /></div>
          </div>
          <div className="p-4 space-y-3">
            {reservations.map(r=>(
              <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><div className="flex items-center gap-1"><h3 className="font-bold text-gray-800 text-sm">{r.client}</h3><VoiceBtn text={`${r.client}, ${r.weight}`} small /></div><p className="text-xs text-gray-500">{r.phone}</p></div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status==="confirmed"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{r.status==="confirmed"?"✅":"⏳"}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs mb-3">
                    <span className="bg-gray-50 rounded-lg px-2 py-1">🛫 {r.from} → {r.to}</span>
                    <span className="bg-gray-50 rounded-lg px-2 py-1">⚖️ {r.weight}</span>
                    <span className="bg-green-50 text-green-700 rounded-lg px-2 py-1 font-bold">💰 {r.montant}</span>
                  </div>
                  {r.status==="pending" ? (
                    <div className="flex gap-2">
                      <button onClick={()=>confirm(r.id)} className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl active:scale-95">✅ Confirmer</button>
                      <button className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2.5 rounded-xl active:scale-95">📞 Appeler</button>
                    </div>
                  ) : (
                    <button className="w-full bg-blue-50 text-blue-600 text-xs font-semibold py-2 rounded-xl active:scale-95">📨 Envoyer rappel WhatsApp</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {tab==="statuts" && (
        <>
          <div className="bg-green-800 px-5 pt-4 pb-4 flex items-center gap-2">
            <button onClick={()=>setTab("home")} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95">‹</button>
            <div><div className="flex items-center gap-1"><h2 className="text-white font-black text-lg">Mettre à Jour</h2><VoiceBtn text="Mettre à jour le statut des colis" small /></div>
              <p className="text-green-300 text-xs">1 clic → SMS envoyé à tous vos clients</p></div>
          </div>
          <div className="p-4 space-y-3">
            {colisData.map(c=>(
              <div key={c.code} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div><div className="flex items-center gap-1"><span className="font-mono font-black text-green-700 text-sm">{c.code}</span><VoiceBtn text={`Colis ${c.code}, étape ${c.step}`} small /></div>
                    <p className="text-xs text-gray-500">{c.client} · {c.weight}</p></div>
                  <span className={`text-xs font-bold text-white px-2 py-1 rounded-full ${stepColors[c.step-1]}`}>Étape {c.step}/4</span>
                </div>
                <div className="flex gap-1 mb-2">{steps.map((_,i)=><div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i<c.step?"bg-green-500":"bg-gray-200"}`}/>)}</div>
                <p className="text-xs text-gray-600 mb-3 font-medium">{steps[c.step-1]}</p>
                {c.step<4 ? (
                  <button onClick={()=>advance(c.code)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl text-sm active:scale-95 flex items-center justify-center gap-2">
                    ➡️ Passer à: {steps[c.step]} <span className="text-xs opacity-80">· SMS auto</span>
                  </button>
                ) : (
                  <div className="w-full bg-green-50 text-green-700 font-bold py-3 rounded-xl text-sm text-center">✅ Livré — SMS envoyé !</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {/* Modal créer voyage */}
      {showCreateVoyage && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 backdrop-blur-sm" onClick={()=>setShowCreateVoyage(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 shadow-2xl max-w-sm mx-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1"><h3 className="font-black text-gray-800 text-lg">🗓️ Créer un Voyage</h3><VoiceBtn text="Créer un nouveau voyage" small /></div>
              <button onClick={()=>setShowCreateVoyage(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold active:scale-95">×</button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {[{l:"🛫 Départ",k:"from",opts:["Paris","Milan","Madrid","Bruxelles","Lyon"]},{l:"🛬 Arrivée",k:"to",opts:["Bamako","Kayes","Ségou","Sikasso","Mopti"]}].map(fd=>(
                  <div key={fd.k}><label className="text-xs font-bold text-gray-500 mb-1 block">{fd.l}</label>
                    <select value={form[fd.k]} onChange={e=>setForm(p=>({...p,[fd.k]:e.target.value}))} className="w-full border-2 border-gray-200 rounded-xl px-2 py-2 text-sm outline-none bg-white">
                      {fd.opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">{["🚢 Maritime","✈️ Aérien"].map(tp=>(
                <button key={tp} onClick={()=>setForm(p=>({...p,type:tp}))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${form.type===tp?"bg-green-600 text-white":"bg-gray-100 text-gray-600"}`}>{tp}</button>
              ))}</div>
              {[{l:"📅 Fermeture conteneur",k:"fermeture"},{l:"🚀 Date de départ",k:"depart"}].map(fd=>(
                <div key={fd.k}><label className="text-xs font-bold text-gray-500 mb-1 block">{fd.l}</label>
                  <input type="date" value={form[fd.k]} onChange={e=>setForm(p=>({...p,[fd.k]:e.target.value}))} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"/>
                </div>
              ))}
            </div>
            <button onClick={()=>{showToast("🚢 Voyage publié sur Mon Colis !"); setShowCreateVoyage(false);}}
              className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all ${form.fermeture&&form.depart?"bg-green-600 text-white active:scale-98":"bg-gray-200 text-gray-400"}`}>
              🚀 Publier sur Mon Colis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// NOTIFICATIONS & ACTIVITÉ
// ─────────────────────────────────────────
function NotifScreen({ t }) {
  return (
    <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth:"none" }}>
      <div className="flex items-center gap-1 mb-4"><h2 className="font-black text-gray-800 text-lg">{t.navNotif}</h2><VoiceBtn text={t.navNotif} small /></div>
      <div className="space-y-3">
        {[
          { icon:"📦", text:"Votre colis #MC-5580 est en transit", time:"Il y a 2h", color:"blue" },
          { icon:"✅", text:"Colis #MC-1234 prêt pour retrait à Kayes", time:"Hier", color:"green" },
          { icon:"🔥", text:"Mali Express: fermeture conteneur dans 3 jours!", time:"Il y a 1j", color:"red" },
          { icon:"⭐", text:"Nouveau transporteur disponible depuis Lyon", time:"Il y a 2j", color:"yellow" },
        ].map((n,i)=>(
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 items-start">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{n.icon}</div>
            <div><p className="text-sm text-gray-800 font-medium">{n.text}</p><p className="text-xs text-gray-400 mt-1">{n.time}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityScreen({ navigate, t }) {
  const activity = [
    { code:"#MC-5580", tr:"Mali Express Cargo", step:2, icon:"🚢" },
    { code:"#MC-1234", tr:"Sahel Fret Milano", step:4, icon:"✅" },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth:"none" }}>
      <div className="flex items-center gap-1 mb-4"><h2 className="font-black text-gray-800 text-lg">{t.navActivity}</h2><VoiceBtn text={t.navActivity} small /></div>
      <div className="space-y-3 mb-4">
        {activity.map((a,i)=>(
          <div key={i} onClick={() => navigate("home")}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 active:scale-98 transition-all">
            <div className="flex justify-between items-center mb-1"><span className="font-mono font-bold text-green-700">{a.code}</span><span className="text-lg">{a.icon}</span></div>
            <p className="text-xs text-gray-500 mb-2">{a.tr}</p>
            <div className="h-1.5 bg-gray-100 rounded-full mb-1"><div className="h-1.5 bg-green-500 rounded-full" style={{ width:`${(a.step/4)*100}%` }}/></div>
            <p className="text-xs text-gray-400">Étape {a.step}/4</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("reservation", TRANSPORTEURS[0])}
        className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-base active:scale-98 transition-all shadow-md flex items-center justify-center gap-2">
        📦 Nouvelle réservation
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// APPLICATION PRINCIPALE
// ─────────────────────────────────────────
export default function MonColisApp() {
  const [screen, setScreen] = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [lang, setLang] = useState("fr");
  const t = T[lang] || T.fr;

  function navigate(s, data = null) {
    setScreen(s);
    setScreenData(data);
    if (["home","search","notif","activity"].includes(s)) setActiveNav(s);
  }

  const showBottomNav = !["auth","reservation","profil","pro"].includes(screen);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      <div className="relative w-full max-w-sm bg-gray-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ height:780, fontFamily:"'Segoe UI', sans-serif" }}>

        <StatusBar />

        {/* SCREENS */}
        {screen==="home" && <HomeScreen lang={lang} setLang={setLang} navigate={navigate} t={t} />}
        {screen==="search" && <SearchScreen navigate={navigate} t={t} initFrom={screenData?.from} initTo={screenData?.to} />}
        {screen==="profil" && <ProfilScreen tr={screenData} navigate={navigate} t={t} />}
        {screen==="auth" && <AuthScreen navigate={navigate} />}
        {screen==="reservation" && <ReservationScreen tr={screenData} navigate={navigate} />}
        {screen==="notif" && <NotifScreen t={t} />}
        {screen==="activity" && <ActivityScreen navigate={navigate} t={t} />}
        {screen==="pro" && <ProScreen navigate={navigate} />}

        {/* BOTTOM NAV */}
        {showBottomNav && (
          <div className="bg-white border-t border-gray-100 flex shadow-xl flex-shrink-0">
            {[
              { id:"home", icon:"🏠", label:t.navHome },
              { id:"search", icon:"🔍", label:t.navSearch },
              { id:"notif", icon:"🔔", label:t.navNotif },
              { id:"activity", icon:"📋", label:t.navActivity },
            ].map(tab => (
              <button key={tab.id} onClick={() => navigate(tab.id)}
                className={`flex-1 flex flex-col items-center py-2.5 transition-all ${activeNav===tab.id?"text-green-600":"text-gray-400"}`}>
                <span className="text-xl">{tab.icon}</span>
                <span className={`font-medium ${activeNav===tab.id?"text-green-600":""}`} style={{ fontSize:9, marginTop:2 }}>{tab.label}</span>
                {activeNav===tab.id && <div className="w-1 h-1 bg-green-600 rounded-full mt-0.5"/>}
              </button>
            ))}
          </div>
        )}

        <MaliFlag />
      </div>
    </div>
  );
}
