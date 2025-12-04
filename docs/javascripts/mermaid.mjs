// docs/javascripts/mermaid.mjs
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0/dist/mermaid-layout-elk.esm.min.mjs';

// ELK 레이아웃 엔진 등록
mermaid.registerLayoutLoaders(elkLayouts);

// 기본 설정 (원하면 여기서 전역 layout도 elk로)
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  // layout: 'elk',  // 전역 기본을 elk로 하고 싶으면 주석 해제
});

// 중요: MkDocs Material이 이 인스턴스를 쓰도록 전역에 올리기
window.mermaid = mermaid;
