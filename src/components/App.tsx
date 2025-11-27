import React, { VFC, useState } from 'react';
import { css } from '@emotion/css';
import { ScrollableContainer } from './three/ScrollableContainer';
import { HoverContext } from './three/Background';

export const App: VFC = () => {
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div className={styles.container}>
			<HoverContext.Provider value={{ isHovering, setHovering: setIsHovering }}>
				<ScrollableContainer />
			</HoverContext.Provider>
		</div>
	)
}

const styles = {
	container: css`
		position: relative;
		width: 100vw;
		height: 100vh;
	`
}
