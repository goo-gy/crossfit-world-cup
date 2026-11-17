import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'2026 The Worst Workout',description:'생각만 해도 숨이 차는 그 동작. 당신의 최악의 크로스핏 동작을 골라주세요.',openGraph:{title:'2026 The Worst Workout',description:'63개의 동작, 단 하나의 최악. 당신의 선택은?'},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
