import { useState, useEffect } from "react";
import { BsSunrise, BsSunset, BsMoonStars, BsGeoAlt, BsArrowRepeat, BsCompass } from "react-icons/bs";
import { LuSunMedium } from "react-icons/lu";
import { GiMoon } from "react-icons/gi";
import { TbBuildingMosque } from "react-icons/tb";
import {
  FaMosque,

} from "react-icons/fa";

const PRAYERS = [
  { key: "Fajr",    label: "فجر",    english: "Fajr",    Icon: BsSunrise,  color: "#7B6FD4" },
  { key: "Sunrise", label: "طلوع",   english: "Sunrise", Icon: BsSunrise,  color: "#E8A838", info: true },
  { key: "Dhuhr",   label: "ظہر",    english: "Zuhr",    Icon: LuSunMedium, color: "#C9A84C" },
  { key: "Asr",     label: "عصر",    english: "Asr",     Icon: BsSunset,   color: "#E8A838" },
  { key: "Maghrib", label: "مغرب",   english: "Maghrib", Icon: GiMoon,     color: "#C0392B" },
  { key: "Isha",    label: "عشاء",   english: "Isha",    Icon: BsMoonStars,color: "#2C7873" },
];

const CALC_METHODS = [
  { id: 1,  name: "University of Islamic Sciences, Karachi" },
  { id: 2,  name: "Islamic Society of North America" },
  { id: 3,  name: "Muslim World League" },
  { id: 4,  name: "Umm Al-Qura University, Makkah" },
  { id: 5,  name: "Egyptian General Authority of Survey" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
];

function toAmPm(time24) {
  if (!time24) return "--:--";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function timeToMins(time24) {
  if (!time24) return 0;
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
}

function nowMins() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function getNextPrayer(times) {
  const now = nowMins();
  const prayers = PRAYERS.filter(p => !p.info);
  for (const p of prayers) {
    const t = timeToMins(times[p.key]);
    if (t > now) return p.key;
  }
  return "Fajr";
}

function timeUntil(time24) {
  if (!time24) return "";
  const diff = timeToMins(time24) - nowMins();
  if (diff < 0) return "";
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

// ── Qibla ──
function getQiblaAngle(lat, lng) {
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;
  const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (MECCA_LAT * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  return (angle + 360) % 360;
}

// ============================================================
export default function PrayerTimes() {
  const [tab, setTab] = useState("prayers"); // prayers | qibla | settings
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null); // {lat, lng, city}
  const [method, setMethod] = useState(1);
  const [compass, setCompass] = useState(null); // device heading
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Get location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Fetch times when location/method changes
  useEffect(() => {
    if (location) fetchTimes();
  }, [location, method]);

  // Compass
  useEffect(() => {
    const handler = (e) => {
      const heading = e.webkitCompassHeading ?? e.alpha ?? 0;
      setCompass(heading);
    };
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // iOS 13+
      } else {
        window.addEventListener("deviceorientation", handler);
      }
    }
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  const fetchLocation = () => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Location supported nahi hai");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setQiblaAngle(getQiblaAngle(lat, lng));
        // Reverse geocode
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Aapka Shehar";
          setLocation({ lat, lng, city });
        } catch {
          setLocation({ lat, lng, city: "Aapka Shehar" });
        }
      },
      (err) => {
        setError("Location allow karein taake sahi prayer times milein");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const fetchTimes = async () => {
    setLoading(true);
    setError("");
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`
      );
      const data = await res.json();
      if (data.code === 200) {
        setTimes(data.data.timings);
      } else {
        setError("Times load nahi huay");
      }
    } catch (e) {
      setError("Internet check karein");
    } finally {
      setLoading(false);
    }
  };

  const nextPrayer = times ? getNextPrayer(times) : null;

  const todayStr = currentTime.toLocaleDateString("ur-PK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Needle rotation — compass - qibla
  const needleRotation = compass !== null && qiblaAngle !== null
    ? qiblaAngle - compass
    : qiblaAngle ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#07090d", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        .next-prayer { animation: pulse 2s ease infinite; }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(7,9,13,0.97)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "14px 16px",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              < FaMosque size={20} color="#C9A84C" />
              <span style={{ fontSize: "17px" }}>Prayer Times</span>
            </div>
            {location && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#6a5f52" }}>
                <BsGeoAlt size={11} />
                {location.city}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "prayers", label: "Namaaz", Icon: FaMosque },
              { id: "qibla",   label: "Qibla",  Icon: BsCompass },
              { id: "settings",label: "Settings", Icon: BsArrowRepeat },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: tab === id ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tab === id ? "#C9A84C" : "rgba(255,255,255,0.08)"}`,
                color: tab === id ? "#C9A84C" : "#6a5f52",
                borderRadius: "20px", padding: "7px 14px", cursor: "pointer",
                fontSize: "12px", transition: "all 0.2s",
              }}>
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* ── PRAYERS TAB ── */}
        {tab === "prayers" && (
          <div className="fade-up">
            {/* Date */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: "#5a5040" }}>{todayStr}</div>
              <div style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#e2d9c8", marginTop: "4px" }}>
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            </div>

            {/* Error / Location */}
            {error && (
              <div style={{
                background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)",
                borderRadius: "14px", padding: "14px 16px", marginBottom: "16px",
                fontSize: "13px", color: "#e74c3c", textAlign: "center",
              }}>
                <div style={{ marginBottom: "10px" }}>{error}</div>
                <button onClick={fetchLocation} style={{
                  background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                  color: "#C9A84C", borderRadius: "20px", padding: "7px 16px",
                  cursor: "pointer", fontSize: "12px",
                  display: "inline-flex", alignItems: "center", gap: "5px",
                }}>
                  <BsGeoAlt size={12} /> Location Allow Karein
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: "32px", height: "32px", margin: "0 auto 12px", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ color: "#5a5040", fontSize: "13px" }}>Prayer times load ho rahi hain...</div>
              </div>
            )}

            {/* Next Prayer Banner */}
            {times && nextPrayer && !loading && (
              <div style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
                border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: "18px", padding: "16px 20px",
                marginBottom: "20px", textAlign: "center",
              }}>
                <div style={{ fontSize: "11px", color: "#6a5f52", letterSpacing: "1.5px", marginBottom: "6px" }}>
                  AGLI NAMAAZ
                </div>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: "28px", color: "#C9A84C", marginBottom: "4px" }}>
                  {PRAYERS.find(p => p.key === nextPrayer)?.label}
                </div>
                <div style={{ fontSize: "22px", color: "#e2d9c8", marginBottom: "4px" }}>
                  {toAmPm(times[nextPrayer])}
                </div>
                <div className="next-prayer" style={{ fontSize: "13px", color: "#C9A84C" }}>
                  {timeUntil(times[nextPrayer])} baad
                </div>
              </div>
            )}

            {/* Prayer List */}
            {times && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {PRAYERS.map((p, i) => {
                  const isNext = p.key === nextPrayer;
                  const isPassed = timeToMins(times[p.key]) < nowMins();
                  return (
                    <div key={p.key} style={{
                      display: "flex", alignItems: "center",
                      background: isNext ? `rgba(${hexRgb(p.color)},0.1)` : isPassed ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isNext ? p.color : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "14px", padding: "14px 16px",
                      transition: "all 0.2s",
                      opacity: isPassed && !isNext ? 0.5 : 1,
                    }}>
                      <p.Icon size={18} color={isNext ? p.color : "#5a5040"} style={{ marginRight: "14px", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: isNext ? p.color : "#e2d9c8" }}>
                          {p.english}
                        </div>
                        {p.info && (
                          <div style={{ fontSize: "10px", color: "#3a3028" }}>Namaaz nahi</div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Amiri', serif", fontSize: "18px", color: isNext ? p.color : "#C9A84C", opacity: isNext ? 1 : 0.7 }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: "15px", color: isNext ? "#e2d9c8" : "#8a7a5a" }}>
                          {toAmPm(times[p.key])}
                        </div>
                        {isNext && (
                          <div style={{ fontSize: "10px", color: p.color, marginTop: "2px" }}>
                            {timeUntil(times[p.key])}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Refresh */}
            {times && !loading && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={fetchTimes} style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#4a4030", borderRadius: "20px", padding: "8px 18px",
                  cursor: "pointer", fontSize: "11px",
                  display: "inline-flex", alignItems: "center", gap: "5px",
                }}>
                  <BsArrowRepeat size={12} /> Refresh
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── QIBLA TAB ── */}
        {tab === "qibla" && (
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", color: "#5a5040", marginBottom: "4px" }}>Qibla Direction</div>
              {qiblaAngle !== null ? (
                <div style={{ fontSize: "13px", color: "#6a5f52" }}>
                  Mecca: {Math.round(qiblaAngle)}° North se
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#3a3028" }}>Location allow karein</div>
              )}
            </div>

            {/* Compass Circle */}
            <div style={{
              width: "260px", height: "260px", margin: "0 auto 32px",
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Outer ring */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "2px solid rgba(201,168,76,0.2)",
                background: "rgba(255,255,255,0.02)",
              }} />

              {/* Direction labels */}
              {[
                { label: "N", angle: 0, },
                { label: "E", angle: 90 },
                { label: "S", angle: 180 },
                { label: "W", angle: 270 },
              ].map(({ label, angle }) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const r = 115;
                const x = 130 + r * Math.cos(rad);
                const y = 130 + r * Math.sin(rad);
                return (
                  <div key={label} style={{
                    position: "absolute", left: x - 8, top: y - 8,
                    width: "16px", height: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", color: label === "N" ? "#C9A84C" : "#3a3028",
                    fontWeight: label === "N" ? "bold" : "normal",
                  }}>{label}</div>
                );
              })}

              {/* Qibla Needle */}
              {qiblaAngle !== null && (
                <div style={{
                  position: "absolute",
                  width: "100%", height: "100%",
                  transform: `rotate(${needleRotation}deg)`,
                  transition: "transform 0.3s ease",
                }}>
                  {/* Arrow up (toward Qibla) */}
                  <div style={{
                    position: "absolute", left: "50%", top: "20px",
                    transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "60px solid #C9A84C",
                  }} />
                  {/* Kaaba icon */}
                  <div style={{
                    position: "absolute", left: "50%", top: "10px",
                    transform: "translateX(-50%)",
                    fontSize: "16px",
                  }}>🕋</div>
                </div>
              )}

              {/* Center dot */}
              <div style={{
                width: "12px", height: "12px", borderRadius: "50%",
                background: "#C9A84C", zIndex: 5,
              }} />
            </div>

            {/* Info */}
            {qiblaAngle !== null ? (
              <div style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: "16px", padding: "16px 20px",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "6px" }}>🕋</div>
                <div style={{ fontSize: "16px", color: "#C9A84C", marginBottom: "4px" }}>
                  {Math.round(qiblaAngle)}°
                </div>
                <div style={{ fontSize: "12px", color: "#5a5040" }}>
                  {location?.city} se Mecca ki direction
                </div>
                {compass === null && (
                  <div style={{ fontSize: "11px", color: "#3a3028", marginTop: "8px" }}>
                    💡 Phone ko flat rakhein aur ghuma ke north dhundhen
                  </div>
                )}
              </div>
            ) : (
              <button onClick={fetchLocation} style={{
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                color: "#C9A84C", borderRadius: "20px", padding: "10px 20px",
                cursor: "pointer", fontSize: "13px",
                display: "inline-flex", alignItems: "center", gap: "6px",
              }}>
                <BsGeoAlt size={14} /> Location Allow Karein
              </button>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="fade-up">
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", color: "#5a5040", marginBottom: "10px", letterSpacing: "0.5px" }}>
                CALCULATION METHOD
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {CALC_METHODS.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{
                    background: method === m.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${method === m.id ? "#C9A84C" : "rgba(255,255,255,0.07)"}`,
                    color: method === m.id ? "#C9A84C" : "#8a7a5a",
                    borderRadius: "12px", padding: "12px 16px", cursor: "pointer",
                    fontSize: "13px", textAlign: "left", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${method === m.id ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {method === m.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C9A84C" }} />}
                    </div>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location refresh */}
            <button onClick={fetchLocation} style={{
              width: "100%", background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#C9A84C", borderRadius: "14px", padding: "14px",
              cursor: "pointer", fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              <BsGeoAlt size={15} /> Location Update Karein
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function hexRgb(hex) {
  if (!hex) return "201,168,76";
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "201,168,76";
}