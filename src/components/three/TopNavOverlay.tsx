import React, { VFC } from 'react'
import { css } from '@emotion/css'

type TopNavOverlayProps = {
  open: boolean
  onClose?: () => void
}

export const TopNavOverlay: VFC<TopNavOverlayProps> = ({ open, onClose }) => {
  return (
    <div className={`${styles.overlay} ${open ? styles.open : styles.closed}`}
         aria-hidden={!open}>
      <header className={styles.header}>
        <div className={styles.logo}>monopo <span>|</span> london</div>
        <nav className={styles.navGrid}>
          <div className={styles.navColumn}>
            <a href="/" className={styles.navLink}><span className={styles.bullet}>▸</span> HOME</a>
            <a href="/work" className={styles.navLink}>WORK</a>
            <a href="/services" className={styles.navLink}>SERVICES</a>
          </div>
          <div className={styles.navColumn}>
            <a href="/team" className={styles.navLink}>TEAM</a>
            <a href="/contact" className={styles.navLink}>CONTACT</a>
            <a href="/press-news" className={styles.navLink}>PRESS & NEWS</a>
          </div>
        </nav>
        <div className={styles.timeDisplay}>
          <div className={`${styles.timeItem} ${styles.timeItemHighlight}`}><span className={styles.bullet}>▸</span> 07:54 AM</div>
          <div className={styles.timeItem}>04:54 PM</div>
          <div className={styles.timeItem}>02:54 AM</div>
        </div>
      </header>

      {/* 点击遮罩可关闭 */}
      <div className={styles.backdrop} onClick={onClose} />
    </div>
  )
}

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    z-index: 180; /* 低于按钮，高于页面内容 */
    pointer-events: none;
  `,
  open: css`
    pointer-events: auto;
    opacity: 1;
  `,
  closed: css`
    opacity: 0;
  `,
  header: css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: start;
    padding: 28px 60px;
    transform: translateY(${0});
    transition: transform 220ms ease, opacity 220ms ease;
  `,
  logo: css`
    font-size: 1.1rem;
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.5px;
    span { margin: 0 8px; opacity: 0.5; }
  `,
  navGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 120px;
    row-gap: 8px;
    justify-self: center;
  `,
  navColumn: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  navLink: css`
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    transition: color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    &:hover { color: #ffffff; }
  `,
  bullet: css`
    color: rgba(255, 255, 255, 0.9);
  `,
  timeDisplay: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  timeItem: css`
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 1.2px;
    text-transform: uppercase;
  `,
  timeItemHighlight: css`
    color: rgba(255, 255, 255, 0.95);
  `,
  backdrop: css`
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.28));
    mix-blend-mode: normal;
  `,
}

