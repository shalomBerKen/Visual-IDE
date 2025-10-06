import { useRef, useEffect } from 'react';

/**
 * Custom hook to manage modal state with auto-reset behavior
 * Resets state only when modal transitions from closed to open
 *
 * @param isOpen - Whether the modal is currently open
 * @param resetCallback - Function to call when resetting state
 *
 * @example
 * const [name, setName] = useState('');
 * useModalState(isOpen, () => setName(initialData.name || ''));
 */
export function useModalState(
  isOpen: boolean,
  resetCallback: () => void
): void {
  const prevOpenRef = useRef(false);

  useEffect(() => {
    // Only reset when transitioning from closed to open
    if (isOpen && !prevOpenRef.current) {
      resetCallback();
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);
}
