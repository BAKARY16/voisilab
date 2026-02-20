import { useEffect, useRef, useState } from 'react';
import { authService } from 'api/voisilab';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;  // 10 minutes en ms
const WARNING_BEFORE   = 60 * 1000;          // Avertissement 1 min avant

/**
 * Hook de déconnexion automatique après inactivité.
 * - Réinitialise le compteur à chaque action utilisateur.
 * - Affiche un avertissement 1 minute avant la déconnexion.
 * - Appelle authService.logout() à la fin du délai.
 */
export default function useInactivityLogout() {
  const [showWarning, setShowWarning] = useState(false);    // afficher le bandeau
  const [secondsLeft, setSecondsLeft] = useState(60);       // compte à rebours
  const logoutTimer  = useRef(null);
  const warningTimer = useRef(null);
  const countdownRef = useRef(null);

  const clearAllTimers = () => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
    clearInterval(countdownRef.current);
  };

  const startTimers = () => {
    clearAllTimers();
    setShowWarning(false);

    // Avertissement à (INACTIVITY_TIMEOUT - WARNING_BEFORE)
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(60);

      // Décompte visuel chaque seconde
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    // Déconnexion définitive
    logoutTimer.current = setTimeout(() => {
      clearAllTimers();
      authService.logout();
    }, INACTIVITY_TIMEOUT);
  };

  // Réinitialiser manuellement (bouton "Je suis là")
  const resetTimer = () => {
    startTimers();
  };

  useEffect(() => {
    // Ne rien faire si pas connecté
    if (!authService.isAuthenticated()) return;

    const EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];

    const handleActivity = () => {
      if (!showWarning) {
        startTimers();
      }
    };

    EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    startTimers(); // Démarrage initial

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { showWarning, secondsLeft, resetTimer };
}
