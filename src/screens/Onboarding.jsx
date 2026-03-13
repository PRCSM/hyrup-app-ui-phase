import { useState } from 'react';
import { FD, FB, T } from '../tokens.js';
import { SUGGESTED_CONNECTIONS, SKILL_OPTIONS, ROLE_OPTIONS } from '../data.js';
import { IC, Svg } from '../icons.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   ONBOARDING — Mozi-inspired, one-question-per-screen
   Steps: Splash → Google → Name → Phone → OTP → College → Year →
          Skills → Role → Gate → (Photo → Roadmap Q1 → Roadmap Q2) →
          Connect 10 → Product Tour → Done
═══════════════════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 14; // for progress bar

/* ── Shared Styles ── */
const wrap = {
  height: '100%', display: 'flex', flexDirection: 'column',
  fontFamily: FB, position: 'relative', overflow: 'hidden',
};
const progressBar = (step) => ({
  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
  background: '#EBE7E0', zIndex: 10,
});
const progressFill = (step) => ({
  height: '100%', width: `${(step / TOTAL_STEPS) * 100}%`,
  background: T.s.orange, transition: 'width 0.4s ease-out',
  borderRadius: '0 2px 2px 0',
});
const questionStyle = {
  fontFamily: FD, fontWeight: 700, fontSize: 28, color: '#1A1A1A',
  lineHeight: 1.2, letterSpacing: '-0.02em',
};
const hintStyle = {
  fontFamily: FB, fontSize: 12, color: '#8A847C', marginTop: 8, lineHeight: 1.5,
};
const inputStyle = {
  width: '100%', border: 'none', borderRadius: 14,
  fontFamily: FB, fontSize: 16, fontWeight: 500, color: '#1A1A1A',
  padding: '16px 20px', outline: 'none', background: '#F0EFEA',
};
const nextBtn = (disabled) => ({
  position: 'absolute', bottom: 28, right: 22,
  width: 56, height: 56, borderRadius: 28,
  background: disabled ? '#EBEAEA' : '#111111',
  border: 'none', cursor: disabled ? 'default' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s, transform 0.15s',
  boxShadow: disabled ? 'none' : '0 10px 24px rgba(0,0,0,0.1)',
});
const chipSelected = {
  padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
  fontFamily: FB, border: `2px solid ${T.s.orange}`, background: T.s.orangeLo,
  color: T.s.orange, cursor: 'pointer', transition: 'all 0.2s',
};
const chipDefault = {
  padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500,
  fontFamily: FB, border: '2px solid #EBE7E0', background: '#FFFFFF',
  color: '#1A1A1A', cursor: 'pointer', transition: 'all 0.2s',
};
const content = {
  flex: 1, padding: '60px 22px 90px', display: 'flex', flexDirection: 'column',
  justifyContent: 'flex-start', overflowY: 'auto',
};

/* ── Small Logo ── */
const Logo = () => (
  <div style={{ padding: '16px 22px 0', zIndex: 5 }}>
    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: '#1A1A1A', letterSpacing: -0.5 }}>
      HY<span style={{ color: '#FF5722' }}>R</span>UP
    </span>
  </div>
);

/* ── Splash Carousel Slide ── */
const splashImages = [
  { bg: 'linear-gradient(180deg, #FDFDFD 0%, #F5F4F2 100%)', headline: 'Your campus.\nYour career.', sub: 'Join 50,000 students building their future.', img: '/assets/images/splash_campus.png' },
  { bg: 'linear-gradient(180deg, #FDFDFD 0%, #F0EFEA 100%)', headline: 'Build in public.\nGet noticed.', sub: 'Share wins, find your crew, grow together.', img: '/assets/images/splash_social.png' },
  { bg: 'linear-gradient(180deg, #F8F8F8 0%, #F0EFEA 100%)', headline: 'One toggle.\nTwo worlds.', sub: 'Social + Career, unified in one app.', img: '/assets/images/splash_toggle.png' },
];

/* ═══════════════════════════════════════════════════════ */

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [slideAnim, setSlideAnim] = useState('');

  // form data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState('');
  const [splashIdx, setSplashIdx] = useState(0);

  // connect step
  const [connected, setConnected] = useState([]);

  // tour step
  const [tourSlide, setTourSlide] = useState(0);

  const goNext = () => {
    setSlideAnim('slideOut');
    setTimeout(() => {
      setStep(s => s + 1);
      setSlideAnim('slideIn');
      setTimeout(() => setSlideAnim(''), 300);
    }, 200);
  };

  const toggleSkill = (s) => {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev);
  };

  const toggleConnect = (id) => {
    setConnected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const animStyle = slideAnim === 'slideOut'
    ? { opacity: 0, transform: 'translateX(-30px)', transition: 'all 0.2s ease-in' }
    : slideAnim === 'slideIn'
    ? { opacity: 1, transform: 'translateX(0)', transition: 'all 0.3s ease-out' }
    : { opacity: 1, transform: 'translateX(0)' };

  /* ── STEP 0: Splash ── */
  if (step === 0) {
    const sl = splashImages[splashIdx];
    return (
      <div style={{ ...wrap, background: sl.bg, justifyContent: 'flex-end' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
          <img src={sl.img} alt="Illustration" style={{ width: '100%', maxHeight: '40vh', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '32px 32px 0 0', padding: '36px 22px', paddingBottom: 40, boxShadow: '0 -10px 40px rgba(0,0,0,0.04)' }}>
          <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: '#111', whiteSpace: 'pre-line', lineHeight: 1.2 }}>
            {sl.headline}
          </div>
          <p style={{ fontFamily: FB, fontSize: 14, color: '#777', marginTop: 10 }}>{sl.sub}</p>

          {/* dots */}
          <div style={{ display: 'flex', gap: 6, margin: '20px 0' }}>
            {splashImages.map((_, i) => (
              <div key={i} onClick={() => setSplashIdx(i)} style={{
                width: i === splashIdx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === splashIdx ? T.s.orange : '#EBEAEA',
                transition: 'all 0.3s', cursor: 'pointer',
              }} />
            ))}
          </div>

          <button onClick={goNext} style={{
            width: '100%', padding: '16px', borderRadius: 100, border: 'none',
            background: '#111111', color: '#fff', fontFamily: FB, fontWeight: 700,
            fontSize: 15, cursor: 'pointer', marginBottom: 10,
          }}>
            Sign in with Google
          </button>
          <button onClick={goNext} style={{
            width: '100%', padding: '16px', borderRadius: 100,
            background: '#F0EFEA', border: 'none',
            color: '#111111', fontFamily: FB, fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>
            Take a quick tour
          </button>
        </div>
      </div>
    );
  }

  /* ── STEP 1: Name ── */
  if (step === 1) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(1)}><div style={progressFill(1)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>What should we<br />call you?</div>
        <div style={hintStyle}>We'll only show this to people you connect with.</div>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Your name" style={{ ...inputStyle, marginTop: 32 }}
          autoFocus
        />
      </div>
      <div style={nextBtn(!name.trim())} onClick={() => name.trim() && goNext()}>
        <Svg d={IC.chevR} s={20} c={!name.trim() ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 2: Phone ── */
  if (step === 2) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(2)}><div style={progressFill(2)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>What's your<br />phone number?</div>
        <div style={hintStyle}>We'll send you a verification code via SMS.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32 }}>
          <span style={{ fontFamily: FB, fontSize: 16, fontWeight: 600, color: '#1A1A1A', padding: '12px 0', borderBottom: '2px solid #EBE7E0' }}>+91</span>
          <input
            value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Phone number" style={{ ...inputStyle, flex: 1 }}
            type="tel" autoFocus
          />
        </div>
      </div>
      <div style={nextBtn(phone.length < 10)} onClick={() => phone.length >= 10 && goNext()}>
        <Svg d={IC.chevR} s={20} c={phone.length < 10 ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 3: OTP ── */
  if (step === 3) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(3)}><div style={progressFill(3)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>We just texted you,<br />what's the code?</div>
        <div style={hintStyle}>We've sent an SMS verification code to +91 {phone}</div>
        {/* OTP boxes with transparent input overlay */}
        <div style={{ position: 'relative', marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 44, height: 52, borderRadius: 12,
                border: `2px solid ${otp[i] ? '#FF5722' : '#EBE7E0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FD, fontWeight: 700, fontSize: 22, color: '#1A1A1A',
                background: otp[i] ? 'rgba(255,87,34,0.06)' : '#fff',
                transition: 'all 0.2s',
              }}>
                {otp[i] || ''}
              </div>
            ))}
          </div>
          {/* Invisible input overlaid on the boxes */}
          <input
            value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: 0, fontSize: 22, letterSpacing: '2em', caretColor: 'transparent',
              zIndex: 2, cursor: 'text',
            }}
            autoFocus maxLength={6} inputMode="numeric" type="tel"
          />
        </div>
        <button onClick={() => {}} style={{
          background: 'none', border: 'none', color: '#FF5722', fontFamily: FB,
          fontWeight: 600, fontSize: 13, marginTop: 20, cursor: 'pointer', padding: 0,
        }}>Resend code</button>
      </div>
      <div style={nextBtn(otp.length < 6)} onClick={() => otp.length >= 6 && goNext()}>
        <Svg d={IC.chevR} s={20} c={otp.length < 6 ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 4: College ── */
  if (step === 4) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(4)}><div style={progressFill(4)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>Where do you<br />study?</div>
        <div style={hintStyle}>We'll connect you with classmates and peers nearby.</div>
        <input
          value={college} onChange={e => setCollege(e.target.value)}
          placeholder="Search your college..." style={{ ...inputStyle, marginTop: 32 }}
          autoFocus
        />
        {college.length > 1 && (
          <div style={{ marginTop: 8, borderRadius: 16, background: '#fff', border: '1px solid #EBE7E0', overflow: 'hidden' }}>
            {['RGPV Bhopal', 'IIT Delhi', 'BITS Pilani', 'VIT Vellore', 'SRM Chennai']
              .filter(c => c.toLowerCase().includes(college.toLowerCase()))
              .slice(0, 3)
              .map(c => (
                <div key={c} onClick={() => { setCollege(c); }} style={{
                  padding: '14px 16px', fontFamily: FB, fontSize: 14, color: '#1A1A1A',
                  cursor: 'pointer', borderBottom: '1px solid #F5F3EF',
                }}>{c}</div>
              ))
            }
          </div>
        )}
      </div>
      <div style={nextBtn(!college.trim())} onClick={() => college.trim() && goNext()}>
        <Svg d={IC.chevR} s={20} c={!college.trim() ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 5: Year & Branch ── */
  if (step === 5) {
    const years = ['2024', '2025', '2026', '2027', '2028'];
    const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Other'];
    return (
      <div style={{ ...wrap, background: '#FAF9F7' }}>
        <div style={progressBar(5)}><div style={progressFill(5)} /></div>
        <Logo />
        <div style={{ ...content, ...animStyle }}>
          <div style={questionStyle}>Almost there —<br />your batch?</div>
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: '#8A847C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Graduation Year</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {years.map(y => (
                <div key={y} onClick={() => setYear(y)} style={year === y ? chipSelected : chipDefault}>{y}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: '#8A847C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {branches.map(b => (
                <div key={b} onClick={() => setBranch(b)} style={branch === b ? chipSelected : chipDefault}>{b}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={nextBtn(!year || !branch)} onClick={() => year && branch && goNext()}>
          <Svg d={IC.chevR} s={20} c={(!year || !branch) ? '#B0AAA2' : '#fff'} w={2.5} />
        </div>
      </div>
    );
  }

  /* ── STEP 6: Skills ── */
  if (step === 6) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(6)}><div style={progressFill(6)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>What are you<br />good at?</div>
        <div style={hintStyle}>Pick up to 5 skills. We'll match you with the right people.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 28 }}>
          {SKILL_OPTIONS.map(s => (
            <div key={s} onClick={() => toggleSkill(s)}
              style={{
                ...(skills.includes(s) ? chipSelected : chipDefault),
                transform: skills.includes(s) ? 'scale(1.05)' : 'scale(1)',
              }}
            >{s}</div>
          ))}
        </div>
        <div style={{ fontFamily: FB, fontSize: 12, color: '#B0AAA2', marginTop: 12 }}>{skills.length}/5 selected</div>
      </div>
      <div style={nextBtn(skills.length === 0)} onClick={() => skills.length > 0 && goNext()}>
        <Svg d={IC.chevR} s={20} c={skills.length === 0 ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 7: Dream Role ── */
  if (step === 7) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(7)}><div style={progressFill(7)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>What's your<br />dream role?</div>
        <div style={hintStyle}>We'll build your personalized career roadmap.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
          {ROLE_OPTIONS.map(r => (
            <div key={r.id} onClick={() => setRole(r.id)} style={{
              padding: '20px 16px', borderRadius: 18, cursor: 'pointer',
              border: `2px solid ${role === r.id ? r.color : '#EBE7E0'}`,
              background: role === r.id ? `${r.color}10` : '#fff',
              transition: 'all 0.25s', transform: role === r.id ? 'scale(1.03)' : 'scale(1)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={nextBtn(!role)} onClick={() => role && goNext()}>
        <Svg d={IC.chevR} s={20} c={!role ? '#B0AAA2' : '#fff'} w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 8: Gate — skip or complete ── */
  if (step === 8) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(8)}><div style={progressFill(8)} /></div>
      <Logo />
      <div style={{ ...content, justifyContent: 'center', alignItems: 'center', textAlign: 'center', ...animStyle }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: 'rgba(255,87,34,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Svg d={IC.check} s={32} c="#FF5722" w={3} />
        </div>
        <div style={{ ...questionStyle, fontSize: 26 }}>You're almost set!</div>
        <p style={{ fontFamily: FB, fontSize: 14, color: '#8A847C', marginTop: 10, maxWidth: 280 }}>
          Complete your profile now for better matches, or jump straight in.
        </p>
        <div style={{ marginTop: 32, width: '100%', maxWidth: 300 }}>
          <button onClick={goNext} style={{
            width: '100%', padding: '16px', borderRadius: 100, border: 'none',
            background: '#1A1A1A', color: '#fff', fontFamily: FB, fontWeight: 700,
            fontSize: 15, cursor: 'pointer', marginBottom: 12,
          }}>Complete Profile</button>
          <button onClick={() => setStep(11)} style={{
            width: '100%', padding: '14px', borderRadius: 100,
            border: '2px solid #EBE7E0', background: 'transparent',
            color: '#FF5722', fontFamily: FB, fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>Jump In →</button>
        </div>
      </div>
    </div>
  );

  /* ── STEP 9: Photo Upload ── */
  if (step === 9) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(9)}><div style={progressFill(9)} /></div>
      <Logo />
      <div style={{ ...content, ...animStyle }}>
        <div style={questionStyle}>Add a profile<br />photo</div>
        <div style={hintStyle}>Pick one that shows your vibe. We'll only show this to your connections.</div>
        <div style={{
          marginTop: 32, width: 180, height: 180, borderRadius: 24,
          border: '3px dashed #EBE7E0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', alignSelf: 'center', background: '#F5F3EF',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Svg d={IC.cam} s={32} c="#B0AAA2" w={1.5} />
            <div style={{ fontFamily: FB, fontSize: 12, color: '#B0AAA2', marginTop: 8 }}>Tap to upload</div>
          </div>
        </div>
      </div>
      <div style={{ ...nextBtn(false), background: '#1A1A1A' }} onClick={goNext}>
        <Svg d={IC.chevR} s={20} c="#fff" w={2.5} />
      </div>
    </div>
  );

  /* ── STEP 10: Roadmap Questions ── */
  if (step === 10) {
    const timeOptions = ['3 months', '6 months', '1 year', 'Just exploring'];
    return (
      <div style={{ ...wrap, background: '#FAF9F7' }}>
        <div style={progressBar(10)}><div style={progressFill(10)} /></div>
        <Logo />
        <div style={{ ...content, ...animStyle }}>
          <div style={questionStyle}>Where do you want<br />to be in...</div>
          <div style={hintStyle}>This helps us build your personalized career roadmap.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
            {timeOptions.map(t => (
              <div key={t} onClick={goNext} style={{
                padding: '18px 20px', borderRadius: 16, border: '2px solid #EBE7E0',
                background: '#fff', fontFamily: FB, fontSize: 15, fontWeight: 500,
                color: '#1A1A1A', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                {t}
                <Svg d={IC.chevR} s={16} c="#B0AAA2" w={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── STEP 11: Loading → Connect ── */
  if (step === 11) {
    // Auto-advance after 2 seconds
    setTimeout(() => { if (step === 11) setStep(12); }, 2000);
    return (
      <div style={{
        ...wrap, background: '#F8F8F8',
        justifyContent: 'center', alignItems: 'center',
      }}>
        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 32, color: 'rgba(0,0,0,0.03)', letterSpacing: -1, marginBottom: 24 }}>
          HY<span style={{ color: 'rgba(250,102,74,0.08)' }}>R</span>UP
        </span>
        <div style={{
          width: 36, height: 36, border: '3px solid rgba(0,0,0,0.05)',
          borderTopColor: T.s.orange, borderRadius: '50%',
          animation: 'onb-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes onb-spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontFamily: FB, fontSize: 14, color: '#777', marginTop: 20, textAlign: 'center' }}>
          Finding people on<br />the same path as you...
        </p>
      </div>
    );
  }

  /* ── STEP 12: Connect with at least 10 people ── */
  if (step === 12) return (
    <div style={{ ...wrap, background: '#FAF9F7' }}>
      <div style={progressBar(12)}><div style={progressFill(12)} /></div>
      <Logo />
      <div style={{ ...content, paddingBottom: 120, ...animStyle }}>
        <div style={questionStyle}>Build your tribe</div>
        <div style={hintStyle}>
          Connect with at least 10 people to get started. We picked these based on your skills and goals.
        </div>
        <div style={{
          margin: '16px 0 8px', padding: '8px 14px', borderRadius: 100,
          background: connected.length >= 10 ? 'rgba(34,197,94,0.12)' : 'rgba(255,87,34,0.08)',
          display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
        }}>
          <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: connected.length >= 10 ? '#16A34A' : '#FF5722' }}>
            {connected.length}/10 connected
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {SUGGESTED_CONNECTIONS.map(u => {
            const isConn = connected.includes(u.id);
            return (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 16, background: '#fff', border: `1px solid ${isConn ? 'rgba(34,197,94,0.3)' : '#EBE7E0'}`,
                transition: 'all 0.25s',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: 22, background: u.avatar,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FD, fontWeight: 800, fontSize: 18, color: '#fff',
                  flexShrink: 0,
                }}>{u.ch}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{u.name}</div>
                  <div style={{ fontFamily: FB, fontSize: 11, color: '#8A847C', marginTop: 2 }}>{u.college}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {u.skills.map(s => (
                      <span key={s} style={{
                        fontSize: 10, fontFamily: FB, fontWeight: 500, padding: '2px 8px',
                        borderRadius: 100, background: '#F5F3EF', color: '#8A847C',
                      }}>{s}</span>
                    ))}
                    <span style={{
                      fontSize: 10, fontFamily: FB, fontWeight: 600, padding: '2px 8px',
                      borderRadius: 100, background: 'rgba(255,87,34,0.08)', color: '#FF5722',
                    }}>{u.reason}</span>
                  </div>
                </div>

                {/* Connect button */}
                <button onClick={() => toggleConnect(u.id)} style={{
                  padding: '8px 16px', borderRadius: 100, border: 'none',
                  background: isConn ? '#22C55E' : '#1A1A1A',
                  color: '#fff', fontFamily: FB, fontWeight: 600, fontSize: 12,
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                  transform: isConn ? 'scale(0.95)' : 'scale(1)',
                }}>
                  {isConn ? '✓ Added' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 22px 28px', background: 'linear-gradient(transparent, #FAF9F7 30%)',
      }}>
        <button onClick={() => connected.length >= 10 && goNext()} style={{
          width: '100%', padding: '16px', borderRadius: 100, border: 'none',
          background: connected.length >= 10 ? '#1A1A1A' : '#EBE7E0',
          color: connected.length >= 10 ? '#fff' : '#B0AAA2',
          fontFamily: FB, fontWeight: 700, fontSize: 15, cursor: connected.length >= 10 ? 'pointer' : 'default',
          transition: 'all 0.3s',
        }}>
          {connected.length >= 10 ? 'Continue' : `Connect with ${10 - connected.length} more`}
        </button>
      </div>
    </div>
  );

  /* ── STEP 13: Product Tour ── */
  if (step === 13) {
    const tours = [
      { tab: 0, title: 'Your daily pulse.', sub: 'Streaks, challenges, and campus buzz — all in one place.', icon: IC.home, img: '/assets/images/tour_profile.png' },
      { tab: 1, title: 'Build in public.', sub: 'Share wins, post projects, and get noticed by peers.', icon: IC.news, img: '/assets/images/tour_network.png' },
      { tab: 2, title: 'Find your tribe.', sub: 'By skill, by proximity, or by career path.', icon: IC.users, img: '/assets/images/tour_network.png' },
      { tab: 3, title: 'Join Cults.', sub: 'Form teams, study together, and stay accountable.', icon: IC.chat, img: '/assets/images/tour_ai.png' },
      { tab: 4, title: 'Your identity.', sub: 'Social proof meets career readiness. One toggle away.', icon: IC.user, img: '/assets/images/tour_profile.png' },
    ];
    const t = tours[tourSlide];
    const isLast = tourSlide === tours.length - 1;

    return (
      <div style={{ ...wrap, background: '#F8F8F8', justifyContent: 'space-between' }}>
        <div style={{ padding: '24px 22px 0', textAlign: 'center' }}>
          <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: 'rgba(0,0,0,0.04)', letterSpacing: -0.5 }}>
            HY<span style={{ color: 'rgba(250,102,74,0.08)' }}>R</span>UP
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 32px', textAlign: 'center' }}>
          {/* Icon or Image */}
          {t.img ? (
              <img src={t.img} alt="Tour slide" style={{ width: 140, height: 140, objectFit: 'contain', marginBottom: 20, mixBlendMode: 'multiply' }} />
          ) : (
              <div style={{
                width: 80, height: 80, borderRadius: 24, background: T.s.orangeLo,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28,
              }}>
                <Svg d={t.icon} s={36} c={T.s.orange} w={2} />
              </div>
          )}
          <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, color: '#111', lineHeight: 1.2 }}>{t.title}</div>
          <p style={{ fontFamily: FB, fontSize: 14, color: '#777', marginTop: 10, lineHeight: 1.5 }}>{t.sub}</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
          {tours.map((_, i) => (
            <div key={i} style={{
              width: i === tourSlide ? 20 : 6, height: 6, borderRadius: 3,
              background: i === tourSlide ? T.s.orange : '#EBEAEA',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Bottom nav preview with active glow */}
        <div style={{
          display: 'flex', padding: '12px 20px 20px', gap: 0,
          borderTop: '1px solid #EAE9E6',
        }}>
          {['Home', 'Feed', 'Connect', 'Chat', 'Profile'].map((label, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                width: 44, height: 28, borderRadius: 14,
                background: i === tourSlide ? T.s.orangeLo : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s',
              }}>
                <Svg d={tours[i].icon} s={20} c={i === tourSlide ? '#111' : '#B0B0B0'} w={i === tourSlide ? 2 : 1.8} />
              </div>
              <span style={{
                fontFamily: FB, fontSize: 9, fontWeight: i === tourSlide ? 700 : 500,
                color: i === tourSlide ? '#111' : '#B0B0B0',
              }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Next / Done button */}
        <div style={{ padding: '0 22px 28px' }}>
          <button onClick={() => isLast ? onComplete() : setTourSlide(s => s + 1)} style={{
            width: '100%', padding: '16px', borderRadius: 100, border: 'none',
            background: isLast ? T.s.orange : '#111111',
            color: '#fff', fontFamily: FB, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            transition: 'background 0.3s',
          }}>
            {isLast ? "Let's go!" : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  // Fallback — should not reach here
  return null;
}
