import React, { VFC } from 'react';
import { css } from '@emotion/css';

type PageOneOverlayProps = {
  scrollProgress?: number
  fadeStart?: number
  fadeEnd?: number
}

export const PageOneOverlay: VFC<PageOneOverlayProps> = ({
  scrollProgress = 0,
  fadeStart = 0.06,
  fadeEnd = 0.22
}) => {
  const t = Math.min(Math.max((scrollProgress - fadeStart) / Math.max(1e-6, (fadeEnd - fadeStart)), 0), 1)
  const smooth = t * t * (3 - 2 * t) // smoothstep
  const footerOpacity = 1 - smooth

	return (
		<>
			{/* 顶部导航栏 */}
			<header className={styles.header}>
				{/* 左侧 Logo */}
				<div className={styles.logo}>
					BIN <span>|</span> World
				</div>

				{/* 中间两列导航 */}
				<div className={styles.navGrid}>
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
				</div>

				{/* 右侧时间显示 */}
				<div className={styles.timeDisplay}>
					<div className={`${styles.timeItem} ${styles.timeItemHighlight}`}><span className={styles.bullet}>▸</span> 07:54 AM</div>
					<div className={styles.timeItem}>04:54 PM</div>
					<div className={styles.timeItem}>02:54 AM</div>
				</div>
			</header>

			{/* 底部信息区 */}
			<footer className={styles.footer} style={{ opacity: footerOpacity }}>
				{/* 左下角 Logo */}
				<div className={styles.footerLogo}>
					<div className={styles.logoCircle}>D/B</div>
				</div>

				{/* 中间信息栏 */}
				<div className={styles.footerInfo}>
					<div className={styles.infoColumn}>
						<h3>Based in London</h3>
						<p>Born in Tokyo</p>
					</div>

					<div className={styles.infoColumn}>
						<h3>Design-driven</h3>
						<p>creative agency</p>
					</div>

					<div className={styles.infoColumn}>
						<h3>Branding, digital</h3>
						<p>and</p>
						<p>communications</p>
					</div>
				</div>

				{/* 右下角滚动提示 */}
				<div className={styles.scrollIndicator}>
					<div className={styles.arrow}>↓</div>
				</div>
			</footer>
		</>
	);
};

const styles = {
	header: css`
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: start;
		padding: 28px 60px;
		z-index: 100;
		pointer-events: auto;
	`,
	logo: css`
		font-size: 1.1rem;
		font-weight: 400;
		color: #ffffff;
		letter-spacing: 0.5px;
		
		span {
			margin: 0 8px;
			opacity: 0.5;
		}
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
	footer: css`
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 60px;
		z-index: 100;
		pointer-events: none;
	`,
	footerLogo: css`
		flex-shrink: 0;
	`,
	logoCircle: css`
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: 1px;
	`,
	footerInfo: css`
		display: flex;
		gap: 80px;
		flex: 1;
		justify-content: center;
		padding: 0 80px;
	`,
	infoColumn: css`
		pointer-events: none;
		h3 {
			font-size: 1.1rem;
			font-weight: 400;
			color: #ffffff;
			margin: 0 0 8px 0;
			line-height: 1.4;
		}
		
		p {
			font-size: 0.95rem;
			font-weight: 300;
			color: rgba(255, 255, 255, 0.6);
			margin: 0;
			line-height: 1.6;
		}
	`,
	scrollIndicator: css`
		flex-shrink: 0;
	`,
	arrow: css`
		width: 50px;
		height: 50px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.5rem;
		animation: bounce 2s ease-in-out infinite;
		
		@keyframes bounce {
			0%, 100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-10px);
			}
		}
	`
};
