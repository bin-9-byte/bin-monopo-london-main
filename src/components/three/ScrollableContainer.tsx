import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/css';
import { BackgroundEffect, TextEffect } from './TCanvas';
import { HoverContext } from './Background';
import { PageOneOverlay } from './PageOneOverlay';

export const ScrollableContainer: VFC = () => {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [hasScrolled, setHasScrolled] = useState(false);
	const { setHovering } = React.useContext(HoverContext);
	const tickingRef = useRef(false);

	const handleScroll = useCallback(() => {
		if (!tickingRef.current) {
			window.requestAnimationFrame(() => {
				// 标记用户已经开始滚动
				if (!hasScrolled) {
					setHasScrolled(true);
				}

				const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
				const progress = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
				setScrollProgress(progress);

				tickingRef.current = false;
			});

			tickingRef.current = true;
		}
	}, [hasScrolled]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<div className={styles.container}>
			{/* 背景层：3D粒子特效，完全不受滚动影响，只响应鼠标位置 */}
			<div className={styles.backgroundLayer}>
				<BackgroundEffect />
			</div>

			{/* 滚动容器层：透明，包含第一页的3D文字特效和后续内容 */}
			<div className={styles.scrollContainer}>
				{/* 第一页：3D文字特效 + 导航覆盖层 */}
				<div className={styles.firstPage}>
					<PageOneOverlay />
					<TextEffect scrollProgress={hasScrolled ? scrollProgress : 0} />
				</div>

				{/* 第二页：Recent Work */}
				<div className={styles.page}>
					<div className={styles.pageContainer}>
						{/* 右上角控制按钮 */}
						<div className={styles.controlButton}>
							<span>||</span>
						</div>

						{/* 左侧文字区域 */}
						<div className={styles.textArea}>
							<p className={styles.sectionLabel}>RECENT WORK</p>
							<h1 className={styles.mainTitle}>
								NKORA COFFEE · BRAND<br />
								/DENT/TY
							</h1>
							<p className={styles.subTitle}>BRAND DESIGN</p>
						</div>

						{/* 中央项目展示图 */}
						<div
							className={styles.projectImage}
							onMouseEnter={() => setHovering(true)}
							onMouseLeave={() => setHovering(false)}
						>
							{/* 这里将放置实际的项目图片 */}
							<div className={styles.imagePlaceholder}>
								NKORA COFFEE PROJECT IMAGE
							</div>
						</div>

						{/* 底部按钮 */}
						<button className={styles.discoverButton}>
							DISCOVER ALL PROJECTS →
						</button>
					</div>
				</div>

				{/* 第三页：Contact Page */}
				<div className={styles.page}>
					<div className={styles.contactContainer}>
						{/* 左上角 Logo */}
						<div className={styles.logo}>
							<div className={styles.logoCircle}>D/B</div>
						</div>

						{/* 右上角控制按钮 */}
						<div className={styles.controlButton}>
							<span>||</span>
						</div>

						{/* 主要内容区域 */}
						<div className={styles.contactContent}>
							{/* 左侧：主标题和邮箱 */}
							<div className={styles.contactLeft}>
								<h1 className={styles.contactTitle}>
									WE WOULD LOVE<br />
									TO HEAR FROM YOU.
								</h1>
								<p className={styles.contactSubtext}>
									Feel free to reach out if you<br />
									want to collaborate with us, or<br />
									simply have a chat.
								</p>
								<a href="mailto:contact@monopo.london" className={styles.emailLink}>
									contact@monopo.london →
								</a>
							</div>

							{/* 中央：地址和社交链接 */}
							<div className={styles.contactMiddle}>
								<div className={styles.infoSection}>
									<h3>OUR ADDRESS</h3>
									<p>
										Unit D104<br />
										116 Commercial Street<br />
										London, E1 6NF<br />
										United Kingdom
									</p>
									<p className={styles.vatInfo}>
										VAT: 319656475<br />
										Company no.<br />
										11843590<br />
										Registered in<br />
										England & Wales
									</p>
								</div>

								<div className={styles.infoSection}>
									<h3>FOLLOW US</h3>
									<div className={styles.socialLinks}>
										<a href="#">Fb</a>
										<a href="#">Tw</a>
										<a href="#">Ig</a>
										<a href="#">Li</a>
									</div>
								</div>

								<div className={styles.infoSection}>
									<a href="#" className={styles.siteLink}>→ MONOPO TKY</a>
									<a href="#" className={styles.siteLink}>→ MONOPO NYC</a>
									<a href="#" className={styles.siteLink}>→ POWERED BY TOKYO</a>
								</div>
							</div>

							{/* 右侧：导航菜单 */}
							<div className={styles.contactRight}>
								<nav className={styles.navMenu}>
									<a href="#" className={styles.navItem}>▸ HOME</a>
									<a href="#" className={styles.navItem}>WORK</a>
									<a href="#" className={styles.navItem}>SERVICES</a>
									<a href="#" className={styles.navItem}>TEAM</a>
									<a href="#" className={styles.navItem}>CONTACT</a>
									<a href="#" className={styles.navItem}>PRESS & NEWS</a>
									<a href="#" className={styles.navItem}>PRIVACY POLICY</a>
								</nav>
							</div>
						</div>

						{/* 底部 */}
						<div className={styles.contactFooter}>
							<p className={styles.copyright}>
								© MONOPO LONDON LTD 2024 All rights reserved
							</p>
							<button className={styles.topButton}>
								TOP ↑
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const styles = {
	container: css`
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	`,
	backgroundLayer: css`
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 1;
	`,
	scrollContainer: css`
		position: relative;
		width: 100%;
		height: 100vh;
		overflow-y: auto;
		z-index: 2;
	`,
	firstPage: css`
		position: relative;
		width: 100%;
		height: 100vh;
	`,
	page: css`
		position: relative;
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 80px 0;
	`,
	pageContainer: css`
		position: relative;
		width: 100%;
		max-width: 90vw;
		padding: 0 60px;
	`,
	controlButton: css`
		position: absolute;
		top: 40px;
		right: 60px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 10;
		
		span {
			font-size: 1.2rem;
			font-weight: bold;
			color: #333;
		}
		
		&:hover {
			transform: scale(1.1);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
		}
	`,
	textArea: css`
		margin-bottom: 60px;
	`,
	sectionLabel: css`
		font-size: 0.9rem;
		letter-spacing: 3px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 20px;
		font-weight: 300;
	`,
	mainTitle: css`
		font-size: 4rem;
		font-weight: 300;
		color: #ffffff;
		line-height: 1.1;
		margin: 0 0 20px 0;
		letter-spacing: -1px;
	`,
	subTitle: css`
		font-size: 1rem;
		letter-spacing: 2px;
		color: #e25a2c;
		font-weight: 400;
	`,
	projectImage: css`
		width: 100%;
		max-width: 800px;
		margin: 0 auto 60px auto;
		cursor: pointer;
		transition: transform 0.3s ease;
		
		&:hover {
			transform: scale(1.02);
		}
	`,
	imagePlaceholder: css`
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.5);
		font-size: 1.5rem;
		font-weight: 300;
		border: 1px solid rgba(255, 255, 255, 0.2);
	`,
	discoverButton: css`
		display: block;
		margin: 0 auto;
		padding: 18px 40px;
		background-color: transparent;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: #ffffff;
		font-size: 0.9rem;
		letter-spacing: 2px;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 30px;
		font-weight: 300;
		
		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.6);
			transform: translateY(-2px);
		}
	`,

	// Page 3: Contact Page Styles
	contactContainer: css`
		position: relative;
		width: 100%;
		max-width: 90vw;
		padding: 80px 60px;
	`,
	logo: css`
		position: absolute;
		top: 40px;
		left: 60px;
	`,
	logoCircle: css`
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 1px;
	`,
	contactContent: css`
		display: grid;
		grid-template-columns: 1.2fr 1fr 0.6fr;
		gap: 80px;
		margin-top: 60px;
	`,
	contactLeft: css`
		display: flex;
		flex-direction: column;
		gap: 30px;
	`,
	contactTitle: css`
		font-size: 3.5rem;
		font-weight: 400;
		color: #ffffff;
		line-height: 1.1;
		margin: 0;
		letter-spacing: -1px;
	`,
	contactSubtext: css`
		font-size: 1rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		font-weight: 300;
	`,
	emailLink: css`
		font-size: 1.1rem;
		color: #ffffff;
		text-decoration: none;
		font-weight: 400;
		transition: all 0.3s ease;
		display: inline-block;
		
		&:hover {
			color: #e25a2c;
			transform: translateX(5px);
		}
	`,
	contactMiddle: css`
		display: flex;
		flex-direction: column;
		gap: 50px;
		padding-top: 20px;
	`,
	infoSection: css`
		h3 {
			font-size: 0.75rem;
			letter-spacing: 2px;
			color: rgba(255, 255, 255, 0.6);
			margin: 0 0 20px 0;
			font-weight: 400;
		}
		
		p {
			font-size: 0.95rem;
			line-height: 1.8;
			color: rgba(255, 255, 255, 0.8);
			margin: 0;
			font-weight: 300;
		}
	`,
	vatInfo: css`
		margin-top: 20px !important;
		font-size: 0.85rem !important;
		color: rgba(255, 255, 255, 0.5) !important;
	`,
	socialLinks: css`
		display: flex;
		gap: 20px;
		
		a {
			font-size: 0.95rem;
			color: rgba(255, 255, 255, 0.8);
			text-decoration: none;
			transition: color 0.3s ease;
			
			&:hover {
				color: #ffffff;
			}
		}
	`,
	siteLink: css`
		display: block;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		margin-bottom: 12px;
		transition: all 0.3s ease;
		font-weight: 300;
		
		&:hover {
			color: #ffffff;
			transform: translateX(5px);
		}
	`,
	contactRight: css`
		padding-top: 20px;
	`,
	navMenu: css`
		display: flex;
		flex-direction: column;
		gap: 18px;
	`,
	navItem: css`
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		transition: all 0.3s ease;
		font-weight: 300;
		letter-spacing: 0.5px;
		
		&:hover {
			color: #ffffff;
			transform: translateX(3px);
		}
	`,
	contactFooter: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 120px;
		padding-top: 40px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	`,
	copyright: css`
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		margin: 0;
		font-weight: 300;
	`,
	topButton: css`
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background-color: transparent;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.85rem;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 1px;
		
		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.6);
			transform: translateY(-3px);
		}
	`
}