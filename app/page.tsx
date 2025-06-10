"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const EVENT_DATE = new Date("2025-09-15T00:00:00");

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

  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-black">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full z-30 bg-white/90 dark:bg-black/90 shadow-sm flex items-center justify-between px-4 py-2 md:px-8">
        {/* LEFT: Logo & Hamburger */}
        <div className="flex items-center gap-2 min-w-[120px] relative">
          <button
            className={showHamburger ? "p-2" : "md:hidden p-2"}
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Otwórz menu"
          >
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
          </button>
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
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6" ref={navRef}>
          {mainTabs.map(tab => (
            <button
              key={tab.value}
              className={`py-2 px-4 rounded ${activeTab === tab.value ? "font-bold text-blue-600" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* RIGHT: Zapisz się button (desktop only) */}
        <div className="hidden md:flex min-w-[160px] justify-end">
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
          className={`fixed md:hidden inset-0 z-[99999] flex transition-transform duration-300${navOpen || showHamburger ? "" : " pointer-events-none"}`}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300${navOpen || showHamburger ? " opacity-100" : " opacity-0 pointer-events-none"}`}
            onClick={() => setNavOpen(false)}
            aria-label="Zamknij menu tło"
          />
          {/* Drawer content */}
          <div
            className={`relative w-2/3 max-w-xs h-full bg-white dark:bg-black shadow-lg flex flex-col gap-2 p-6 transition-transform duration-300${navOpen || showHamburger ? " translate-x-0" : " -translate-x-full"}`}
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
            {mainTabs.map(tab => (
              <button
                key={tab.value}
                className={`py-2 px-4 rounded ${activeTab === tab.value ? "font-bold text-blue-600" : ""}`}
                onClick={() => {
                  setActiveTab(tab.value);
                  setNavOpen(false);
                }}
              >
                {tab.label}
              </button>
            ))}
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
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-32 sm:pb-8 w-full">
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
                  className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-400 opacity-40 blur-3xl animate-pulse"
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
                <span className="text-blue-600">{daysLeft}</span> dni!
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
            <motion.section
              key="participants"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2"
            >
              {/* PARTICIPANT TABS */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {participantTabs.map((tab) => (
                  <button
                    key={tab.value}
                    className={`py-2 px-4 rounded-full whitespace-nowrap border-2 transition-all duration-200 font-semibold shadow-sm ${
                      participantTab === tab.value
                        ? "bg-cyan-500 text-white border-cyan-400 neon-ellipse-btn"
                        : "bg-white dark:bg-gray-800 text-cyan-700 dark:text-cyan-200 border-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-900"
                    }`}
                    onClick={() => setParticipantTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {participantTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="text-lg font-semibold">O wyjeździe</div>
                    <div className="text-gray-700 dark:text-gray-200">
                      Wyjazd integracyjny &quot;Wtyczka 2025&quot; to niezapomniana przygoda,
                      integracja, zabawa i nowe znajomości! Czeka na Ciebie mnóstwo
                      atrakcji, warsztatów i wspólnego czasu w pięknym miejscu.
                    </div>
                    {/* GALLERY SWIPER */}
                    <Swiper
                      spaceBetween={12}
                      slidesPerView={1.1}
                      className="rounded-xl neon-border overflow-hidden w-full max-w-md bg-black/40"
                      style={{ minHeight: 180 }}
                    >
                      <SwiperSlide>
                        <Image
                          src="/gallery1.jpg"
                          alt="Galeria 1"
                          width={400}
                          height={176}
                          className="w-full h-44 object-cover"
                        />
                      </SwiperSlide>
                      <SwiperSlide>
                        <Image
                          src="/gallery2.jpg"
                          alt="Galeria 2"
                          width={400}
                          height={176}
                          className="w-full h-44 object-cover"
                        />
                      </SwiperSlide>
                      <SwiperSlide>
                        <Image
                          src="/gallery3.jpg"
                          alt="Galeria 3"
                          width={400}
                          height={176}
                          className="w-full h-44 object-cover"
                        />
                      </SwiperSlide>
                    </Swiper>
                  </motion.div>
                )}
                {participantTab === "packing" && (
                  <motion.ul
                    key="packing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="list-disc pl-6 text-cyan-800 dark:text-cyan-200"
                  >
                    <li>Dowód osobisty</li>
                    <li>Ubrania na każdą pogodę</li>
                    <li>Ręcznik, kosmetyki</li>
                    <li>Ładowarka do telefonu</li>
                    <li>Dobry humor!</li>
                  </motion.ul>
                )}
                {participantTab === "news" && (
                  <motion.ul
                    key="news"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="list-disc pl-6 text-cyan-800 dark:text-cyan-200"
                  >
                    <li>Start zapisów: 1 lipca 2025</li>
                    <li>Ogłoszenie miejsca: 15 lipca 2025</li>
                    <li>Więcej informacji wkrótce!</li>
                  </motion.ul>
                )}
                {participantTab === "faq" && (
                  <motion.ul
                    key="faq"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="list-disc pl-6 text-cyan-800 dark:text-cyan-200"
                  >
                    <li>
                      Czy mogę zabrać znajomego? – Tak, jeśli się zapisze!
                    </li>
                    <li>
                      Czy jest transport? – Szczegóły wkrótce.
                    </li>
                    <li>
                      Jak się zapisać? – Kliknij &quot;Zapisz się&quot;!
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.section>
          )}
          {activeTab === "rules" && (
            <motion.section
              key="rules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 items-center justify-center text-center"
            >
              <div className="text-lg font-semibold">
                Regulamin dostępny pod tym linkiem
              </div>
              <a
                href="https://linkdoregulaminu.pl"
                target="_blank"
                rel="noopener"
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
              >
                Otwórz regulamin
              </a>
            </motion.section>
          )}
          {activeTab === "contact" && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 items-center justify-center"
            >
              <form
                className="w-full flex flex-col gap-4 bg-white/80 dark:bg-black/80 p-6 rounded-xl neon-border shadow"
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
                <label className="flex flex-col gap-1">
                  <span className="font-semibold">Email</span>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="border-b-2 border-cyan-300 focus:border-cyan-500 focus:outline-none py-2 px-4 bg-transparent rounded-md shadow-sm transition-all duration-200"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-semibold">Wiadomość</span>
                  <textarea
                    value={contact.message}
                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                    className="border-b-2 border-cyan-300 focus:border-cyan-500 focus:outline-none py-2 px-4 bg-transparent rounded-md shadow-sm transition-all duration-200 resize-none"
                    rows={4}
                    maxLength={2000}
                    required
                  />
                </label>
                {contactError && (
                  <div className="text-red-500 text-sm font-medium">
                    {contactError}
                  </div>
                )}
                {contactSuccess && (
                  <div className="text-green-500 text-sm font-medium">
                    Wiadomość została wysłana! Skontaktujemy się z Tobą wkrótce.
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {contactSuccess ? "Wysłano!" : "Wyślij wiadomość"}
                  {!contactSuccess && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="opacity-25"
                      />
                      <path
                        d="M14.243 14.243a6 6 0 10-8.486-8.486M12 6v6h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="opacity-75"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </motion.section>
          )}
          {activeTab === "signup" && (
            <motion.section
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto flex flex-col gap-6 px-2 pt-24"
            >
              <div className="text-lg font-semibold text-center">
                Zapisz się na wyjazd integracyjny "Wtyczka 2025"
              </div>
              <RegistrationForm />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                &copy; 2025 Wtyczka. Wszystkie prawa zastrzeżone.
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
