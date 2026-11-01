"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropClassName?: string;
}

/**
 * Standardized Portal Modal that renders directly into document.body,
 * locks background scrolling when open, and closes on Escape or backdrop click.
 */
export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  children,
  backdropClassName = "fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div onClick={onClose} className={backdropClassName}>
      {children}
    </div>,
    document.body
  );
};
