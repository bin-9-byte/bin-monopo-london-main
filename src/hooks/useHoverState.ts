import { useContext } from 'react';
import { HoverContext } from '../components/three/Background';

// 导出hover上下文，以便其他组件可以使用
export { HoverContext } from '../components/three/Background';

// 自定义Hook，用于访问hover状态
export const useHoverState = () => {
	const context = useContext(HoverContext);
	if (!context) {
		throw new Error('useHoverState must be used within a HoverContext.Provider');
	}
	return context;
};