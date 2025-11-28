import React, { VFC } from 'react';
import { css } from '@emotion/css';

export const PageOneOverlay: VFC = () => {
	return (
		<>
			{/* 顶部导航栏 */}
			<header className={styles.header}>
				{/* Logo */}
				<div className={styles.logo}>
					monopo <span>|</span> london
				</div>

				{/* 导航菜单 */}
				<nav className={styles.nav}>
					<a href="#" className={styles.navLink}>▸ HOME</a>
					<a href="#" className={styles.navLink}>WORK</a>
					<a href="#" className={styles.navLink}>SERVICES</a>
					<a href="#" className={styles.navLink}>TEAM</a>
					<a href="#" className={styles.navLink}>CONTACT</a>
					<a href="#" className={styles.navLink}>PRESS & NEWS</a>
				</nav>

				{/* 时间显示 */}
				<div className={styles.timeDisplay}>
					<div className={styles.timeItem}>▸ 03:46 AM</div>
					<div className={styles.timeItem}>12:46 PM</div>
					<div className={styles.timeItem}>10:46 PM</div>
				</div>
			</header>

			{/* 底部信息区 */}
			<footer className={styles.footer}>
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40px 60px;
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
	nav: css`
		display: flex;
		gap: 40px;
	`,
	navLink: css`
		font-size: 0.85rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		letter-spacing: 1px;
		transition: color 0.3s ease;
		
		&:hover {
			color: #ffffff;
		}
	`,
	timeDisplay: css`
		display: flex;
		gap: 30px;
	`,
	timeItem: css`
		font-size: 0.85rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.5px;
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
