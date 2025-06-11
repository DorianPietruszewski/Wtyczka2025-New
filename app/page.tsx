"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const EVENT_DATE = new Date("2025-10-24T00:00:00");

function useCountdown(targetDate: Date) {
  const [days, setDays] = useState(() => {
    const now = new Date();
    return Math.max(
      0,
      Math.ceil(
        (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
  });
  // Live update co północy
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDays(Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    }, 1000 * 60 * 60); // co godzinę (oszczędnie, bo zmiana tylko raz dziennie)
    return () => clearInterval(interval);
  }, [targetDate]);
  return days;
}

const RegistrationForm = dynamic(() => import("./registration-form"), { ssr: false });

const participantTabs = [
  { label: "O wyjeździe", value: "about" },
  { label: "Co zabrać?", value: "packing" },
  { label: "Aktualności", value: "news" },
  { label: "FAQ", value: "faq" },
];

const mainTabs = [
  { label: "Strona Główna", value: "home" },
  { label: "Dla uczestników", value: "participants" },
  { label: "Regulamin", value: "rules" },
  { label: "Kontakt", value: "contact" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [participantTab, setParticipantTab] = useState("about");
  const [contact, setContact] = useState({ email: "", message: "" });
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [showParticipantTabsMenu, setShowParticipantTabsMenu] = useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const navDrawerRef = React.useRef<HTMLDivElement>(null);
  const zapiszBtnRef = React.useRef<HTMLAnchorElement>(null);
  const daysLeft = useCountdown(EVENT_DATE);

  useEffect(() => {
    function checkCollision() {
      if (!navRef.current || !zapiszBtnRef.current) return;
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = zapiszBtnRef.current.getBoundingClientRect();
      // If button overlaps nav or is out of viewport, show hamburger
      setShowHamburger(
        btnRect.left < navRect.right && btnRect.right > navRect.left &&
        (btnRect.right > navRect.right || btnRect.left < navRect.left)
      );
    }
    checkCollision();
    window.addEventListener("resize", checkCollision);
    return () => window.removeEventListener("resize", checkCollision);
  }, []);

  // Schowaj menu podzakładek gdy otwiera się panel boczny
  useEffect(() => {
    if ((activeTab === "participants") && (navOpen || showHamburger)) {
      setShowParticipantTabsMenu(false);
    }
  }, [activeTab, navOpen, showHamburger]);

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full z-30 bg-black shadow-sm flex items-center justify-between px-4 py-2 md:px-8 text-white">
        {/* LEFT: Logo & Hamburger */}
        <div className="flex items-center gap-2 min-w-[120px] relative text-white">
          {/* Hamburger button only visible on mobile (md:hidden) */}
          <button
            className="p-2 md:hidden text-white"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Otwórz menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
          {/* Logo widoczne tylko na desktopie */}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setActiveTab("home");
              setNavOpen(false);
            }}
            className="hidden md:block relative z-10"
            aria-label="Strona główna"
          >
            <Image
              src="/wtyczka.png"
              alt="Logo Wtyczka 2025"
              width={96}
              height={96}
              className="object-contain w-20 h-20"
              priority
            />
          </a>
        </div>
        {/* CENTER: Navigation Menu (desktop only) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 bg-black text-white" ref={navRef}>
          {mainTabs.map(tab => {
            const isActive = activeTab === tab.value;
            if (tab.value === "rules") {
              return (
                <a
                  key={tab.value}
                  href="https://drive.google.com/file/d/1nIkLbvDKASJVq6a6RB75dlIA4bDWd26F/view"
                  target="_blank"
                  rel="noopener"
                  className={`flex items-center justify-center px-8 py-3 rounded-full font-semibold border-2 border-cyan-400 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] transition-all duration-200 focus:outline-none focus:ring-0 neon-ellipse-btn ${isActive ? "bg-cyan-500 text-white ring-4 ring-cyan-300/40" : "text-cyan-100 bg-transparent hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)]"}`}
                  style={{ minHeight: 56, minWidth: 120 }}
                >
                  <span className="w-full text-center flex items-center justify-center">{tab.label}</span>
                </a>
              );
            } else {
              return (
                <button
                  key={tab.value}
                  className={`flex items-center justify-center px-8 py-3 rounded-full font-semibold border-2 border-cyan-400 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] transition-all duration-200 focus:outline-none focus:ring-0 neon-ellipse-btn ${isActive ? "bg-cyan-500 text-white ring-4 ring-cyan-300/40" : "text-cyan-100 bg-transparent hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)]"}`}
                  onClick={() => setActiveTab(tab.value)}
                  style={{ minHeight: 56, minWidth: 120 }}
                >
                  <span className="w-full text-center flex items-center justify-center">{tab.label}</span>
                </button>
              );
            }
          })}
        </div>
        {/* RIGHT: Zapisz się button (desktop only) */}
        <div className="hidden md:flex min-w-[160px] justify-end bg-black text-white">
          <a
            ref={zapiszBtnRef}
            onClick={e => {
              e.preventDefault();
              setActiveTab("signup");
              setNavOpen(false);
            }}
            href="#zapisz-sie"
            className={`bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-full shadow-md neon-ellipse-btn transition-all duration-200${activeTab === "signup" ? " !hidden" : ""}`}
            style={{ display: activeTab === "signup" ? "none" : undefined }}
          >
            Zapisz się
          </a>
        </div>
        {/* MOBILE: Navigation Drawer */}
        <div
          ref={navDrawerRef}
          className={`fixed md:hidden inset-0 z-[99999] flex transition-transform duration-300${navOpen ? "" : " pointer-events-none"} text-white`}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300${navOpen ? " opacity-100" : " opacity-0 pointer-events-none"}`}
            onClick={() => setNavOpen(false)}
            aria-label="Zamknij menu tło"
          />
          {/* Drawer content */}
          <div
            className={`relative w-2/3 max-w-xs h-full bg-black shadow-lg flex flex-col gap-2 p-6 transition-transform duration-300${navOpen ? " translate-x-0" : " -translate-x-full"} text-white`}
          >
            {/* Logo w panelu bocznym */}
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/wtyczka.png"
                alt="Logo Wtyczka 2025"
                width={96}
                height={96}
                className="object-contain w-20 h-20"
                priority
              />
            </div>
            <button
              className="self-end mb-4"
              onClick={() => setNavOpen(false)}
              aria-label="Zamknij menu"
            >
              ✕
            </button>
            {mainTabs.map(tab => {
              if (tab.value === "rules") {
                return (
                  <a
                    key={tab.value}
                    href="https://drive.google.com/file/d/1nIkLbvDKASJVq6a6RB75dlIA4bDWd26F/view"
                    target="_blank"
                    rel="noopener"
                    className="py-2 px-4 rounded text-left block transition-colors duration-200"
                    onClick={() => setNavOpen(false)}
                  >
                    {tab.label}
                  </a>
                );
              } else {
                return (
                  <button
                    key={tab.value}
                    className={`py-2 px-4 rounded text-left transition-colors duration-200${activeTab === tab.value ? " font-bold text-cyan-400" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.value);
                      setNavOpen(false);
                    }}
                  >
                    {tab.label}
                  </button>
                );
              }
            })}
          </div>
        </div>
      </nav>

      {/* MOBILE ZAPISZ SIĘ BUTTON */}
      {activeTab !== "signup" && !navOpen && !showHamburger && (
        <a
          onClick={e => {
            e.preventDefault();
            setActiveTab("signup");
          }}
          href="#zapisz-sie"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden bg-cyan-500 hover:bg-cyan-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg neon-ellipse-btn transition-all duration-200"
        >
          Zapisz się
        </a>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-32 sm:pb-8 w-full bg-black text-white">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col items-center gap-8 px-2"
            >
              {/* LOGO */}
              <div className="relative flex items-center justify-center w-80 h-80 max-w-[90vw] max-h-60 sm:max-h-80 mx-auto">
                {/* Pulsujące błękitne światło */}
                <span
                  aria-hidden="true"
                  className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-400 opacity-40 blur-2xl animate-pulse"
                />
                <Image
                  src="/wtyczka.png"
                  alt="Logo Wtyczka 2025"
                  width={320}
                  height={320}
                  className="relative z-10 w-80 h-80 max-w-[90vw] max-h-60 sm:max-h-80 object-contain select-none bg-transparent"
                  priority
                />
              </div>
              {/* COUNTDOWN */}
              <div className="text-2xl font-bold text-center">
                Do wyjazdu pozostało{" "}
                <span className="text-cyan-400">{daysLeft}</span> dni!
              </div>
              <button
                onClick={() => setActiveTab("participants")}
                className="mt-2 px-8 py-3 rounded-full font-semibold text-cyan-100 bg-transparent border-2 border-cyan-400 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)] transition-all duration-200 focus:outline-none focus:ring-0 neon-ellipse-btn"
              >
                Dowiedz się więcej
              </button>
              {/* SOCIALS */}
              <div className="flex gap-6 justify-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center rounded-full border-2 border-cyan-400 bg-transparent text-cyan-300 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)] hover:text-cyan-100 focus:outline-none focus:ring-0 cursor-pointer w-12 h-12 text-3xl"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center rounded-full border-2 border-cyan-400 bg-transparent text-cyan-300 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)] hover:text-cyan-100 focus:outline-none focus:ring-0 cursor-pointer w-12 h-12 text-3xl"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center rounded-full border-2 border-cyan-400 bg-transparent text-cyan-300 shadow-[0_0_16px_2px_rgba(34,211,238,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_32px_6px_rgba(34,211,238,0.8)] hover:text-cyan-100 focus:outline-none focus:ring-0 cursor-pointer w-12 h-12 text-3xl"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>
            </motion.section>
          )}
          {activeTab === "participants" && (
            <>
              {/* PARTICIPANT TABS - fixed at the top below main nav, independent from content */}
              <div
                className="fixed left-0 right-0 z-40 bg-black flex flex-col items-center pt-8 pb-3 mt-4 overflow-x-visible transition-all duration-300"
                style={{ top: 88, marginTop: 0, display: navOpen || showHamburger ? 'none' : undefined }}
              >
                {/* Submenu Hamburger - visible only on mobile or when tabs don't fit */}
                <div className="w-full flex md:hidden mb-2">
                  <button
                    className={`w-full max-w-xs mx-auto flex items-center justify-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 text-white text-lg font-semibold ${showParticipantTabsMenu ? 'bg-cyan-500' : 'bg-black/90 hover:bg-cyan-700'}`}
                    onClick={() => setShowParticipantTabsMenu(v => !v)}
                    aria-label="Otwórz menu zakładek"
                    style={{ minHeight: 48 }}
                  >
                    <svg
                      width="40" height="28" viewBox="0 0 40 28" fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-300 ${showParticipantTabsMenu ? 'rotate-180' : ''}`}
                    >
                      <g filter="url(#neon-glow)">
                        <path d="M6 10L20 22L34 10" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <filter id="neon-glow" x="0" y="0" width="40" height="28" filterUnits="userSpaceOnUse">
                          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#22d3ee"/>
                        </filter>
                      </defs>
                    </svg>
                  </button>
                </div>
                {/* Dropdown for tabs with smooth animation - mobile only */}
                <div
                  className={`md:hidden absolute left-0 right-0 top-full w-full bg-black shadow-lg z-50 flex flex-col overflow-hidden transition-all duration-300 ${showParticipantTabsMenu ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}
                  style={{ boxShadow: showParticipantTabsMenu ? '0 8px 32px 0 rgba(34,211,238,0.15)' : undefined }}
                  aria-hidden={!showParticipantTabsMenu}
                >
                  {participantTabs.map((tab) => (
                    <button
                      key={tab.value}
                      className={`py-3 px-6 font-semibold transition-all duration-200 bg-transparent text-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-0 ${participantTab === tab.value ? 'text-white bg-cyan-500' : ''}`}
                      onClick={() => { setParticipantTab(tab.value); setShowParticipantTabsMenu(false); }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Tabs - always visible in row on desktop */}
                <div className="hidden md:flex flex-nowrap gap-2">
                  {participantTabs.map((tab) => (
                    <button
                      key={tab.value}
                      className={`py-2 px-4 rounded-full font-semibold transition-all duration-200 bg-transparent text-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-0 ${participantTab === tab.value ? 'text-white bg-cyan-500' : ''}`}
                      onClick={() => setParticipantTab(tab.value)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <motion.section
                key="participants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 pt-[120px] md:pt-[80px]"
              >
                <AnimatePresence mode="wait">
                  {participantTab === "about" && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose prose-sm sm:prose-base bg-black text-white leading-relaxed space-y-4 mt-4 px-4 rounded-2xl"
                    >
                      <h2 className="text-xl font-bold flex items-center gap-2">🧭 O WYJEŹDZIE</h2>
                      <p>
                        Wtyczka 2025 to legendarna integracja studencka, na której nie może Cię zabraknąć!<br/>
                        Nieważne, z którego jesteś wydziału – jeśli studiujesz na Politechnice Łódzkiej, ten wyjazd jest właśnie dla Ciebie! <span role="img" aria-label="wtyczka">🔌</span>
                      </p>
                      <p>
                        W dniach <b>24–27 października</b> zabieramy Was do ośrodka “Zbójnik” w Murzasichlu, gdzie przez cztery dni czekają na Was:
                      </p>
                      <ul className="list-none space-y-1">
                        <li>🎁 pakiet powitalny pełen niespodzianek</li>
                        <li>🏠 zakwaterowanie w pokojach kilkuosobowych</li>
                        <li>🚌 autokarowy przejazd w dobrym stylu</li>
                        <li>🎉 imprezy tematyczne i integracyjne</li>
                        <li>🧠 szkolenia i warsztaty, które pomogą Ci ogarnąć życie studenckie</li>
                        <li>🍽️ pełne wyżywienie (także wegetariańskie)</li>
                        <li>🛡️ ubezpieczenie na cały czas wyjazdu</li>
                      </ul>
                      <p>
                        Do tego – najlepsi ludzie, studencki klimat, masa śmiechu i wspomnień, które zostaną z Tobą na długo! <span role="img" aria-label="gwiazdki">🤩</span><br/>
                        Organizatorem wyjazdu jest <b>Wydziałowa Rada Samorządu WEEIA</b>, ale uczestniczyć może każdy student PŁ. To Twoja okazja, by poznać znajomych z różnych wydziałów i naładować się pozytywną energią na cały semestr!
                      </p>
                    </motion.div>
                  )}
                  {participantTab === "packing" && (
                    <motion.div
                      key="packing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose prose-sm sm:prose-base bg-black text-white leading-relaxed space-y-4 mt-4 px-4 rounded-2xl"
                    >
                      <h2 className="text-xl font-bold flex items-center gap-2">🎒 CO ZABRAĆ?</h2>
                      <p>Pakowanie przed Wtyczką nie musi być trudne – oto niezbędnik uczestnika:</p>
                      <ul className="list-none space-y-1">
                        <li>✅ Dokument tożsamości (dowód osobisty lub paszport)</li>
                        <li>✅ Wydrukowane i podpisane oświadczenie obozowe</li>
                        <li>✅ Leki przyjmowane na stałe (plus informacja o nich dla organizatorów)</li>
                        <li>✅ Ubrania na każdą pogodę i wygodne buty</li>
                        <li>✅ Przybory toaletowe i ręcznik</li>
                        <li>✅ Koc lub śpiwór (jeśli masz)</li>
                        <li>✅ Dobry humor i chęć do zabawy!</li>
                      </ul>
                      <p>
                        Pamiętaj, że na miejscu zapewniamy pełne wyżywienie, więc nie musisz zabierać jedzenia. Jeśli masz jakieś specjalne wymagania dietetyczne, daj nam znać z wyprzedzeniem.
                      </p>
                    </motion.div>
                  )}
                  {participantTab === "news" && (
                    <motion.div
                      key="news"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose prose-sm sm:prose-base bg-black text-white leading-relaxed space-y-4 mt-4 px-4 rounded-2xl"
                    >
                      <h2 className="text-xl font-bold flex items-center gap-2">📰 AKTUALNOŚCI</h2>
                      <p>
                        Bądź na bieżąco z najnowszymi informacjami o Wtyczce 2025! Tutaj znajdziesz wszystkie ważne ogłoszenia i aktualizacje.
                      </p>
                      <div className="space-y-4">
                        {/* Przykładowe aktualności - w prawdziwej aplikacji te dane będą dynamiczne */}
                        <div className="p-4 bg-black border border-cyan-800 rounded-lg shadow-md text-white">
                          <h3 className="font-semibold text-white">Nowy termin zapisów!</h3>
                          <p className="text-cyan-200">
                            Z powodu dużego zainteresowania przedłużamy termin zapisów na Wtyczkę 2025 do 30 września! Nie przegap swojej szansy na niezapomniany wyjazd.
                          </p>
                        </div>
                        <div className="p-4 bg-black border border-cyan-800 rounded-lg shadow-md text-white">
                          <h3 className="font-semibold text-white">Zmiana w programie wyjazdu</h3>
                          <p className="text-cyan-200">
                            Uwaga! Zmiana w programie wyjazdu - zamiast planowanej wycieczki do Zakopanego, odbędzie się całodniowa integracja w ośrodku. Szczegóły wkrótce!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {participantTab === "faq" && (
                    <motion.div
                      key="faq"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose prose-sm sm:prose-base bg-black text-white leading-relaxed space-y-4 mt-4 px-4 rounded-2xl"
                    >
                      <h2 className="text-xl font-bold flex items-center gap-2">❓ FAQ</h2>
                      <p>
                        Masz pytania? Sprawdź najczęściej zadawane pytania dotyczące Wtyczki 2025. Jeśli nie znajdziesz odpowiedzi, skontaktuj się z nami!
                      </p>
                      <div className="space-y-4">
                        {/* Przykładowe pytania - w prawdziwej aplikacji te dane będą dynamiczne */}
                        <div className="p-4 bg-black border border-cyan-800 rounded-lg shadow-md text-white">
                          <h3 className="font-semibold text-white">Jak mogę się zapisać?</h3>
                          <p className="text-cyan-200">
                            Aby zapisać się na Wtyczkę 2025, wypełnij formularz zgłoszeniowy dostępny na naszej stronie internetowej. Po przesłaniu formularza otrzymasz potwierdzenie na podany adres e-mail.
                          </p>
                        </div>
                        <div className="p-4 bg-black border border-cyan-800 rounded-lg shadow-md text-white">
                          <h3 className="font-semibold text-white">Czy mogę anulować zgłoszenie?</h3>
                          <p className="text-cyan-200">
                            Tak, możesz anulować zgłoszenie do 7 dni przed rozpoczęciem wyjazdu. W tym celu skontaktuj się z nami mailowo lub telefonicznie.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </>
          )}
          {activeTab === "signup" && (
            <motion.section
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 pt-8"
            >
              <div className="text-lg font-semibold text-center">
                Zapisz się na wyjazd integracyjny &quot;Wtyczka 2025&quot;
              </div>
              <RegistrationForm />
            </motion.section>
          )}
          {activeTab === "contact" && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 pt-8"
            >
              <div className="text-2xl font-bold text-center text-cyan-700 dark:text-cyan-300 mb-2">
                Skontaktuj się z nami
              </div>
              <form
                className="w-full flex flex-col gap-6 bg-black p-8 rounded-2xl shadow-xl border border-cyan-200 backdrop-blur-md text-white"
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSuccess(false);
                  setContactError("");
                  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) {
                    setContactError("Podaj poprawny adres email.");
                    return;
                  }
                  if (!contact.message.trim()) {
                    setContactError("Wpisz wiadomość.");
                    return;
                  }
                  if (contact.message.length > 2000) {
                    setContactError("Wiadomość może mieć maksymalnie 2000 znaków.");
                    return;
                  }
                  setContactSuccess(true);
                  setContact({ email: "", message: "" });
                }}
              >
                <div className="relative">
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="peer w-full px-4 pt-6 pb-2 bg-transparent border-2 border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all placeholder-transparent text-base text-white"
                    placeholder="Email"
                    required
                  />
                  <label className="absolute left-4 top-2 text-cyan-200 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-cyan-400">
                    Email
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    value={contact.message}
                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                    className="peer w-full px-4 pt-6 pb-2 bg-transparent border-2 border-cyan-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all placeholder-transparent text-base text-white resize-none min-h-[120px]"
                    placeholder="Wiadomość"
                    rows={4}
                    maxLength={2000}
                    required
                  />
                  <label className="absolute left-4 top-2 text-cyan-200 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-cyan-400">
                    Wiadomość
                  </label>
                </div>
                {contactError && (
                  <div className="text-red-500 text-sm font-medium text-center">
                    {contactError}
                  </div>
                )}
                {contactSuccess && (
                  <div className="text-green-500 text-sm font-medium text-center">
                    Wiadomość została wysłana! Skontaktujemy się z Tobą wkrótce.
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:focus:ring-cyan-800"
                >
                  {contactSuccess ? "Wysłano!" : "Wyślij wiadomość"}
                </button>
              </form>
              {/* Kontakt bezpośredni */}
              <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2 mt-2 bg-black border border-cyan-800 rounded-2xl p-6 shadow-md" style={{ width: '100%' }}>
                <div className="text-base font-semibold text-cyan-200 mb-1">Kontakt do organizatorów:</div>
                <div className="flex flex-col gap-1 text-gray-100 text-base">
                  <span><span className="font-medium">Email:</span> <a href="mailto:wtyczka@kontakt.com" className="underline hover:text-cyan-400">wtyczka@kontakt.com</a></span>
                  <span><span className="font-medium">Telefon:</span> <a href="tel:123456789" className="underline hover:text-cyan-400">123-456-789</a></span>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
