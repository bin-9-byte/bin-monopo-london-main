import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/css';
import { BackgroundEffect, TextEffect } from './TCanvas';
import { HoverContext } from './Background';

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
				{/* 第一页：3D文字特效 */}
				<div className={styles.firstPage}>
					<TextEffect scrollProgress={hasScrolled ? scrollProgress : 0} />
				</div>
				
				{/* 第二页及以后：常规内容 */}
				<div className={styles.content}>
					<div className={styles.contentInner}>
						{/* 第二页内容 - 图片占位符 */}
				<div className={styles.imagePlaceholder}
					onMouseEnter={() => setHovering(true)}
					onMouseLeave={() => setHovering(false)}>
					第二页内容占位符
				</div>
						
						<h1>Welcome to Our Creative Space</h1>
						<p>This is where the magic happens. As you scroll, the 3D text effect fades away and new content emerges.</p>
						<div className={styles.card}>
							<h2>About Our Work</h2>
							<p>We create immersive digital experiences that blend art and technology. Our team specializes in interactive web design, 3D visualizations, and creative coding.</p>
						</div>
						<div className={styles.card}>
							<h2>Our Process</h2>
							<p>Every project begins with a vision. We transform ideas into reality through careful planning, innovative design, and precise implementation.</p>
						</div>
						<div className={styles.card}>
							<h2>Get In Touch</h2>
							<p>Have a project in mind? We'd love to hear from you. Let's create something amazing together.</p>
						</div>
						<div className={styles.card}>
							<h2>Our Technologies</h2>
							<p>We leverage cutting-edge technologies including React Three Fiber, WebGL, and advanced shader programming to create stunning visual experiences that push the boundaries of what's possible on the web.</p>
						</div>
						<div className={styles.card}>
							<h2>Recent Projects</h2>
							<p>Our portfolio includes interactive installations, data visualizations, brand experiences, and experimental web art. Each project is an opportunity to explore new creative territories.</p>
						</div>
						<div className={styles.card}>
							<h2>Join Our Team</h2>
							<p>We're always looking for talented individuals who share our passion for blending technology and creativity. If you're a developer, designer, or creative technologist, we'd love to connect.</p>
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
	content: css`
		position: relative;
		background-color: transparent;
		min-height: 100vh;
		padding-bottom: 50px;
	`,
	contentInner: css`
		max-width: 800px;
		margin: 0 auto;
		padding: 80px 20px;
		color: #333333;
		
		h1 {
			font-size: 3rem;
			margin-bottom: 2rem;
			font-weight: bold;
		}
		
		p {
			font-size: 1.2rem;
			line-height: 1.6;
			margin-bottom: 2rem;
		}
	`,
	imagePlaceholder: css`
		width: 100%;
		height: 60vh;
		background-color: #ffffff;
		margin-bottom: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333333;
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
		border-radius: 8px;
		transition: all 0.3s ease;
		cursor: pointer;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		
		&:hover {
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
			transform: scale(1.02);
		}
	`,
	card: css`
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		
		h2 {
			font-size: 1.8rem;
			margin-bottom: 1rem;
			color: #e25a2c;
		}
		
		p {
			font-size: 1.1rem;
			margin-bottom: 0;
		}
	`
}