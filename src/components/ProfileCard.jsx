import React, { useEffect, useRef } from 'react';
import './ProfileCard.css';  // Archivo de estilos modular

function ProfileCard(props) {
  const {
    name = "Javi A. Torres",
    title = "Software Engineer",
    handle = "javicodes",
    status = "Online",
    contactText = "Contact Me",
    avatarUrl = "",         // Se espera que avatarUrl apunte a la imagen de perfil proporcionada
    onContactClick = () => {}
  } = props;

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const holoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const holo = holoRef.current;

    let frameId = null;
    let fadeFrameId = null;
    let currentOpacity = 0;

    // Actualiza las CSS variables de rotación e iluminación según posición del cursor
    const updateCardTransform = (x, y) => {
      const rect = card.getBoundingClientRect();
      const offsetX = x - rect.left;
      const offsetY = y - rect.top;
      const width = rect.width;
      const height = rect.height;
      const percentX = (offsetX / width) * 100;
      const percentY = (offsetY / height) * 100;
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      // Establece variables CSS para rotación 3D y posición del glow
      container.style.setProperty('--pointer-x', `${percentX}%`);
      container.style.setProperty('--pointer-y', `${percentY}%`);
      container.style.setProperty('--rotate-x', `${-(centerX / 5)}deg`);
      container.style.setProperty('--rotate-y', `${centerY / 4}deg`);
      // Mueve la capa holográfica (gradiente multicolor) con una ligera traslación
      if (holo) {
        holo.style.transform = `translate(${centerX * 0.5}px, ${centerY * 0.5}px) rotate(45deg)`;
      }
    };

    const handlePointerMove = (e) => {
      // Usa requestAnimationFrame para suavizar el seguimiento del cursor
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => updateCardTransform(e.clientX, e.clientY));
    };

    const handlePointerEnter = () => {
      // Cancela animación de fadeOut si estaba en curso
      if (fadeFrameId) cancelAnimationFrame(fadeFrameId);
      fadeFrameId = null;
      // Aumenta gradualmente la opacidad del glow de fondo
      const fadeIn = () => {
        currentOpacity += 0.05;
        if (currentOpacity < 1) {
          container.style.setProperty('--card-opacity', currentOpacity.toString());
          fadeFrameId = requestAnimationFrame(fadeIn);
        } else {
          // Máxima iluminación
          currentOpacity = 1;
          container.style.setProperty('--card-opacity', '1');
          fadeFrameId = null;
        }
      };
      fadeFrameId = requestAnimationFrame(fadeIn);
    };

    const handlePointerLeave = () => {
      // Restaura la rotación 3D a posición inicial
      container.style.setProperty('--rotate-x', '0deg');
      container.style.setProperty('--rotate-y', '0deg');
      // Detiene cualquier animación de fadeIn en curso
      if (fadeFrameId) cancelAnimationFrame(fadeFrameId);
      fadeFrameId = null;
      // Disminuye gradualmente la opacidad del glow de fondo
      const fadeOut = () => {
        currentOpacity -= 0.05;
        if (currentOpacity > 0) {
          container.style.setProperty('--card-opacity', currentOpacity.toString());
          fadeFrameId = requestAnimationFrame(fadeOut);
        } else {
          // Apaga completamente el glow
          currentOpacity = 0;
          container.style.setProperty('--card-opacity', '0');
          fadeFrameId = null;
        }
      };
      fadeFrameId = requestAnimationFrame(fadeOut);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      // Limpia los event listeners al desmontar
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId) cancelAnimationFrame(frameId);
      if (fadeFrameId) cancelAnimationFrame(fadeFrameId);
    };
  }, []);

  return (
    <div className="pc-container" ref={containerRef}>
      <div className="pc-card" ref={cardRef}>
        {/* Capa holográfica multicolor (brillo prismático) */}
        <div className="pc-holo" ref={holoRef}></div>
        {/* Contenido de la tarjeta */}
        <div className="pc-content">
          <div className="pc-avatar">
            <img src={avatarUrl} alt={name} />
          </div>
          <h3 className="pc-name gradient-text">{name}</h3>
          <p className="pc-title gradient-text">{title}</p>
          <p className="pc-info">
            @{handle} <span className="pc-status-label">{status}</span>
          </p>
          <button className="pc-contact-btn" onClick={onContactClick}>
            {contactText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
