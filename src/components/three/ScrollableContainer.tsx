import React, { VFC, useState, useRef, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { BackgroundEffect } from './TCanvas';
import { AdvancedTextEffect } from './AdvancedTextEffect';
import { ScrollController } from './ScrollController';
import { HoverContext } from './Background';
import { PageOneOverlay } from './PageOneOverlay';
import { TopNavOverlay } from './TopNavOverlay';

export const ScrollableContainer: VFC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { setHovering } = React.useContext(HoverContext);
    const scrollRef = useRef<HTMLDivElement>(null);
    const page2Ref = useRef<HTMLDivElement>(null);
    const [globalMouse, setGlobalMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [topNavOpen, setTopNavOpen] = useState(false);
    const [page2LockActive, setPage2LockActive] = useState(false);
    const cardViewportRef = useRef<HTMLDivElement>(null);
    const cardItems = useMemo(() => ([
        { id: 'c1', label: 'PROJECT IMAGE 1' },
        { id: 'c2', label: 'PROJECT IMAGE 2' },
        { id: 'c3', label: 'PROJECT IMAGE 3' },
        { id: 'c4', label: 'PROJECT IMAGE 4' }
    ]), []);
    const cardCount = cardItems.length;

    // 与第一页底部文字淡出一致的阈值（统一常量）
    const PAGE_ONE_FADE_START = 0.03;
    const PAGE_ONE_FADE_END = 0.16;

    const handleScrollChange = (progress: number) => {
        // 标记用户已经开始滚动
        if (!hasScrolled && progress > 0) {
            setHasScrolled(true);
        }
        setScrollProgress(progress);
    };

    // 监听全局鼠标，转换为 -1..1 归一化坐标
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setGlobalMouse({ x, y });
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    // 边界法：当外层滚动抵达第二页顶端（完全展示）时激活锁
    useEffect(() => {
        const scroller = scrollRef.current;
        const page2 = page2Ref.current;
        if (!scroller || !page2) return;
        const near = Math.abs(scroller.scrollTop - page2.offsetTop) <= 8;
        if (near) setPage2LockActive(true);
    }, [scrollProgress]);

    // 在第二页“完全到达”后，捕获滚轮于外层滚动容器，
    // 将滚动转发到卡片视窗；边界释放锁返回外部滚动
    useEffect(() => {
        const scroller = scrollRef.current;
        const page2 = page2Ref.current;
        if (!scroller || !page2) return;

        const onWheel = (e: WheelEvent) => {
            // 如果未锁定，交给外层默认滚动
            if (!page2LockActive) return;

            const viewport = cardViewportRef.current;
            const scrollerEl = scroller;
            if (!viewport || !scrollerEl) return;

            // 对触控板大步长做限幅，防止突破边界导致“穿透”与卡点
            const MAX_DELTA = 120; // 每次事件最大像素
            let dy = Math.max(Math.min(e.deltaY, MAX_DELTA), -MAX_DELTA);

            const { scrollTop, clientHeight, scrollHeight } = viewport;
            const remainingDown = scrollHeight - clientHeight - scrollTop; // 还能向下滚多少
            const remainingUp = scrollTop; // 还能向上滚多少

            // 计算在卡片内可消费的滚动量（带符号）
            let consume = 0;
            if (dy > 0) {
                consume = Math.min(dy, Math.max(0, remainingDown));
            } else if (dy < 0) {
                consume = Math.max(dy, -Math.max(0, remainingUp));
            }

            // 先消费至卡片视窗
            if (consume !== 0) {
                viewport.scrollBy({ top: consume });
            }

            // 把余量无缝传递给外层容器，实现边界顺滑过渡
            const remainder = dy - consume;
            if (remainder !== 0) {
                scrollerEl.scrollBy({ top: remainder });
            }

            // 阻止默认，避免双重滚动叠加
            e.preventDefault();
            e.stopPropagation();

            // 若外层已离开第二页区域较远，则自动解除锁定
            const page2 = page2Ref.current;
            if (page2) {
                const DIST_TOL = 24;
                const dist = Math.abs(scrollerEl.scrollTop - page2.offsetTop);
                if (dist > DIST_TOL) {
                    setPage2LockActive(false);
                }
            }
        };

        scroller.addEventListener('wheel', onWheel, { passive: false, capture: true });
        return () => scroller.removeEventListener('wheel', onWheel as any);
    }, [page2LockActive]);

    return (
        <div className={styles.container}>
			{/* 背景层：3D粒子特效，完全不受滚动影响，只响应鼠标位置 */}
			<div className={styles.backgroundLayer}>
				<BackgroundEffect />
			</div>

            {/* 固定的文字层：位置不随滚动移动，仅根据滚动渐隐 */}
            <div className={styles.textLayer}>
                <AdvancedTextEffect 
                    scrollProgress={hasScrolled ? scrollProgress : 0} 
                    enableMouseEffect={true}
                    enableLense={true}
                    globalMouse={globalMouse}
                />
            </div>

            {/* 固定右上角的全局控制按钮 */}
            {(() => {
                const overlayProgress = hasScrolled ? scrollProgress : 0;
                const showGlobalButton = overlayProgress >= PAGE_ONE_FADE_END;
                return (
            <button
                className={`${styles.globalControlButton} ${showGlobalButton ? styles.buttonVisible : styles.buttonHidden}`}
                aria-label="Toggle Top Navigation"
                aria-hidden={!showGlobalButton}
                onClick={() => setTopNavOpen(v => !v)}
            >
                <span>||</span>
            </button>
                );
            })()}

            {/* 顶部导航展开层 */}
            <TopNavOverlay open={topNavOpen} onClose={() => setTopNavOpen(false)} />

            {/* 滚动控制器：绑定到滚动容器，取消防抖并降低阈值 */}
            <ScrollController 
                onScrollChange={handleScrollChange} 
                scrollElementRef={scrollRef}
                debounceMs={0}
                scrollThreshold={0.0007}
            />

			{/* 滚动容器层：透明，包含第一页的3D文字特效和后续内容 */}
            <div className={`${styles.scrollContainer} ${page2LockActive ? styles.scrollContainerLocked : ''}`} ref={scrollRef}>
                {/* 第一页：导航覆盖层（文字效果已移至固定层）*/}
                <div className={styles.firstPage}>
                    <PageOneOverlay 
                        scrollProgress={hasScrolled ? scrollProgress : 0}
                        fadeStart={PAGE_ONE_FADE_START}
                        fadeEnd={PAGE_ONE_FADE_END}
                    />
                </div>
				
				{/* 导航区域遮罩层：阻止鼠标事件穿透到3D文字层 */}
				<div className={styles.navBlocker} />

                {/* 第二页：Recent Work */}
                <div className={styles.page} ref={page2Ref}>
                    <div className={styles.pageContainer}>
                        {/* 右上角控制按钮移除，使用全局按钮 */}

						{/* 主体布局：左侧文字（固定在左侧） */}
						<div className={styles.workGrid}>
							<div className={styles.workLeft}>
								<div className={styles.verticalDots} />
								<p className={styles.sectionLabel}>RECENT WORK</p>
								<h1 className={styles.mainTitle}>
									NKORA COFFEE · BRAND<br />
									/DENT/TY
								</h1>
								<p className={styles.subTitle}>BRAND DESIGN</p>
							</div>
						</div>

                        {/* 居中栈：项目图轮播 + 按钮，垂直布局、固定间距、整体居中；滚轮在第二页锁定驱动切换 */}
                        <div className={styles.projectStack}>
                            <div className={`${styles.cardViewport} ${page2LockActive ? styles.cardViewportLocked : ''}`}
                                 ref={cardViewportRef}
                                 onMouseEnter={() => setHovering(true)}
                                 onMouseLeave={() => setHovering(false)}>
                                <div className={styles.cardContent}>
                                    {cardItems.map(item => (
                                        <div key={item.id} className={styles.cardSlide}>
                                            <div className={styles.imagePlaceholder}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className={styles.discoverButton}>DISCOVER ALL PROJECTS →</button>
                        </div>
					</div>
				</div>

                        {/* 第三页：Contact Page */}
                <div className={styles.page}>
                    <div className={styles.contactContainer}>
                        {/* 左上角 Logo */}
                        <div className={styles.logo}>
                            <div className={styles.logoCircle}>D/B</div>
                        </div>

                        {/* 右上角控制按钮移除，使用全局按钮 */}

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
	textLayer: css`
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 4;
		pointer-events: none;
	`,
    scrollContainer: css`
        position: relative;
        width: 100%;
        height: 100vh;
        overflow-y: auto;
        z-index: 3;
    `,
    scrollContainerLocked: css`
        overflow-y: hidden;
    `,
	firstPage: css`
		position: relative;
		width: 100%;
		height: 100vh;
	`,
	navBlocker: css`
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 200px; /* 覆盖顶部导航区域 */
		z-index: 15; /* 高于3D文字层，低于导航内容 */
		pointer-events: all; /* 接收鼠标事件，阻止穿透 */
		background: transparent;
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
    globalControlButton: css`
        position: fixed;
        top: 28px;
        right: 60px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.26s ease, transform 0.26s ease, box-shadow 0.2s ease;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
        z-index: 200; /* 高于各页内容与3D层 */
        border: none;
        outline: none;
        
        span {
            font-size: 1.1rem;
            font-weight: 700;
            color: #1a1a1a;
        }
        
        &:hover {
            transform: scale(1.04);
            box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
        }
    `,
    buttonVisible: css`
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    `,
    buttonHidden: css`
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
        pointer-events: none;
    `,
    textArea: css`
        margin-bottom: 60px;
    `,
    workGrid: css`
        display: grid;
        grid-template-columns: 420px 1fr;
        align-items: center;
        column-gap: 90px; /* 左右列间距更大，贴近参考图 */
        row-gap: 18px;
        margin-top: 4px;
    `,
    workLeft: css`
        position: relative;
        padding-left: 28px; /* 文字更贴近竖线 */
    `,
    verticalDots: css`
        position: absolute;
        left: 0;
        top: 4px;
        height: 460px; /* 竖线更长以覆盖标题区域 */
        width: 2px;
        background-image: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.6) 0px,
            rgba(255,255,255,0.6) 2px,
            transparent 2px,
            transparent 12px
        );
        opacity: 0.6;
    `,
    sectionLabel: css`
        font-size: 0.9rem;
        letter-spacing: 3px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 14px; /* 标签与标题间距更紧凑 */
        font-weight: 300;
    `,
    mainTitle: css`
        font-size: 4rem;
        font-weight: 300;
        color: #ffffff;
        line-height: 1.15; /* 行距稍大，贴近参考图的标题排版 */
        margin: 0 0 18px 0; /* 标题与副标题间距细调 */
        letter-spacing: -0.5px;
    `,
    subTitle: css`
        font-size: 1rem;
        letter-spacing: 2px;
        color: #e25a2c;
        font-weight: 400;
        margin-top: 6px; /* 与标题保持轻微间距 */
    `,
    projectStack: css`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px; /* 固定间距 */
        z-index: 1;
    `,
    cardViewport: css`
        width: calc( min(900px, 80vw) );
        height: calc( min(900px, 80vw) * 0.5625 ); /* 16:9 可靠高度 */
        overflow-y: hidden; /* 默认禁止内部滚动，避免到达第二页前触发 */
        overflow-x: hidden;
        border-radius: 8px;
        filter: drop-shadow(0 24px 50px rgba(0,0,0,0.25));
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
        &::-webkit-scrollbar { display: none; } /* Chrome */
    `,
    cardViewportLocked: css`
        overflow-y: auto; /* 仅在锁定后允许内部滚动 */
    `,
    cardContent: css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    `,
    cardSlide: css`
        width: 100%;
        height: 100%;
        flex: 0 0 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    imagePlaceholder: css`
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.25);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.2rem;
        font-weight: 300;
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
    `,
    discoverButton: css`
        display: inline-block;
        margin: 0; /* 由栈容器gap控制间距 */
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
		pointer-events: all; /* 改为接收事件，阻止穿透到3D文字层 */
		background: transparent;
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
