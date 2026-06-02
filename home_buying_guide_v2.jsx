import { useState, useMemo } from "react";

// ─────────────────────────────────────────────
// DATA — CHECKLIST (우선순위순)
// ─────────────────────────────────────────────
const PRI = {
  P1: { label: "P1 필수", bg: "#3D0A0A", color: "#FF6B6B" },
  P2: { label: "P2 중요", bg: "#2D1500", color: "#FF9E40" },
  P3: { label: "P3 확인", bg: "#141E00", color: "#A3CF62" },
  P4: { label: "P4 참고", bg: "#001530", color: "#60A8DC" },
};

const CHECKLIST = [
  {
    id: "legal", emoji: "⚖️", category: "계약 전 법적 필수확인",
    color: "#FF6B6B",
    desc: "하나라도 빠지면 계약 파기·손실 가능 — 계약 당일이 아닌 반드시 사전 확인",
    items: [
      { id:"l1", pri:"P1", essential:true,
        text:"등기부등본 열람 — 근저당·가압류·압류·가처분·예고등기 전부 확인",
        note:"법원 인터넷등기소(iros.go.kr). 단 1,000원. 잔금 당일 오전 한 번 더 발급 필수. 근저당 설정금이 시세 60% 초과 시 위험" },
      { id:"l2", pri:"P1", essential:true,
        text:"건축물대장 열람 — 위반건축물·불법 구조변경 여부 (정부24 무료)",
        note:"베란다 불법 확장·내력벽 철거 시 대출 거절·원상복구 명령 가능. 건축물 현황도와 실제 구조 반드시 대조" },
      { id:"l3", pri:"P1", essential:true,
        text:"선순위 임차인 확인 — 대항력 여부·보증금 금액 정확히 파악",
        note:"내 매수가 - 기존 임차인 보증금 - 내 대출 합계가 매수가의 80% 이내여야 안전. 초과 시 경매 낙찰가에서 못 받는 금액 발생 위험" },
      { id:"l4", pri:"P1", essential:true,
        text:"매도인 신분증·등기부 소유자 동일인 여부 확인",
        note:"대리인 거래 시 인감증명서·위임장 원본 필수. 명의 불일치 계약은 무효 처리 가능성" },
      { id:"l5", pri:"P2",
        text:"토지이용계획확인서 — 용도지역(1·2·3종 주거지역) 확인 (정부24 무료)",
        note:"용도지역이 재건축 가능 층수·용적률 상한을 결정. 2종→3종 상향 여부가 재건축 수익성에 직결" },
      { id:"l6", pri:"P2",
        text:"관리비 체납 여부 — 관리사무소에 직접 문의 (서면 확인 요청)",
        note:"체납 관리비는 새 매수자에게 승계됨. 완납 후 잔금 지급 조건을 계약 특약에 반드시 명시" },
    ]
  },
  {
    id: "finance", emoji: "💰", category: "단지 재무·관리 리스크",
    color: "#FF9E40",
    desc: "입주 후 수백만 원 추가 지출 가능 — 관리사무소 직접 방문, 서류 요청",
    items: [
      { id:"f1", pri:"P1", essential:true,
        text:"장기수선충당금 잔액·소진율 확인 (관리사무소 방문, 적립 현황표 요청)",
        note:"잔액 부족 시 입주 후 세대당 수십~수백만 원 특별부과금. 1997~2000년 단지는 배관·엘리베이터 교체 임박 多" },
      { id:"f2", pri:"P1", essential:true,
        text:"관리비 실고지서 최근 3개월치 직접 요청 (여름·겨울 포함)",
        note:"앱 표시 금액과 실제 고지서 다를 수 있음. 최고치 기준 예산 계획 세울 것" },
      { id:"f3", pri:"P2",
        text:"엘리베이터 교체 이력·예정 시기 확인 (관리사무소 문의)",
        note:"대형 단지 엘리베이터 교체 비용 수억~수십억 원. 교체 직후 단지는 충당금 급격히 소진" },
      { id:"f4", pri:"P2",
        text:"배관·전기패널·외벽 단열 교체 이력 및 잔여 수명 파악",
        note:"1990년대 단지는 PVC 배관 노후화로 누수 빈번. 세대 내 배관 교체 비용 별도 200~500만 원" },
      { id:"f5", pri:"P3",
        text:"주차 대수/세대 비율 — 저녁 9시에 방문해 실제 주차 현황 확인",
        note:"1.0 미만이면 저녁마다 주차 전쟁. 1997~2000년 단지는 0.5~0.7 수준도 있음. 앱 정보만 믿지 말것" },
    ]
  },
  {
    id: "defect", emoji: "🔍", category: "매물 내부 하자 확인",
    color: "#E07B4A",
    desc: "도배·장판으로 가린 하자 多 — 30분 이상 체류, 사진·영상 촬영",
    items: [
      { id:"d1", pri:"P1", essential:true,
        text:"천장 모서리·창문 주변 전체 — 누수·곰팡이·결로 흔적 사진 촬영",
        note:"벽지 불룩하거나 변색 부위 손으로 눌러 수분 확인. 도배 새로 한 집은 더 의심. 겨울·장마 이후 촬영본 요청 가능" },
      { id:"d2", pri:"P1", essential:true,
        text:"베란다 확장 합법 여부 — 건축물대장 '기타 면적' 항목과 실제 구조 대조",
        note:"불법 확장 시 담보대출 거절 사례 실제 있음. 내력벽 철거는 구조 안전 문제로 치명적" },
      { id:"d3", pri:"P2",
        text:"화장실 배수구 냄새·물빠짐 속도·줄눈 곰팡이 전체 확인",
        note:"배수 느림 = 배관 노후 or 막힘. 교체 시 50~200만 원. 냄새는 방수·트랩 문제. 직접 물 흘려보기" },
      { id:"d4", pri:"P2",
        text:"창문 샷시 단열·결로·뒤틀림 — 이중창·삼중창 여부 확인",
        note:"23평 전체 샷시 교체 시 400~700만 원. 단창이면 겨울 결로·냉기 심각. 직접 창문 열고 닫아보기" },
      { id:"d5", pri:"P2",
        text:"난방 방식(개별/지역난방) 및 보일러 교체 연도 확인",
        note:"지역난방이 개별보다 평균 30~40% 저렴. 개별 보일러 교체 100~200만 원. 설치 10년 이상이면 곧 교체 필요" },
      { id:"d6", pri:"P2",
        text:"층간소음 테스트 — 15분 이상 조용히 앉아 위아래·옆집 생활음 청취",
        note:"구축 슬래브 두께 150~180mm로 신축 대비 얇음. 뛰는 소리·발소리·욕실 소음 기준으로 판단" },
      { id:"d7", pri:"P3",
        text:"일조권 — 오전 10시~오후 3시 방문, 각 방 직접 채광 확인",
        note:"저층+동향+앞동 근접 조합은 겨울 일조 2~3시간 불과. 앱 이미지만으로 판단 절대 불가" },
      { id:"d8", pri:"P3",
        text:"전기 콘센트 수·전기 용량·수납 공간·환기창 상태 확인",
        note:"1997년 이전 단지는 전기 용량 부족 사례 있음. 인테리어 시 전기 패널 교체 포함 여부 사전 확인" },
    ]
  },
  {
    id: "location", emoji: "🗺️", category: "입지·환경 임장",
    color: "#5B9BD5",
    desc: "평일 저녁 + 주말 오전 두 번 방문 원칙 — 시간대에 따라 완전히 달라짐",
    items: [
      { id:"loc1", pri:"P2",
        text:"역까지 실제 도보 체험 — 앱 예측 vs 실제 소요시간·경사·횡단보도 비교",
        note:"앱 10분 = 실체감 15분 되는 경우 빈번. 비 오는 날·겨울도 고려. 버스 환승 구간도 직접 체험" },
      { id:"loc2", pri:"P2",
        text:"출퇴근 시간대 대중교통 직접 탑승 — 혼잡도·소요시간 체험",
        note:"평일 아침 7:30~9:00 실제 탑승 권장. 앉아가는지 서서가는지 차이 큼. 환승 소요 포함 체크" },
      { id:"loc3", pri:"P2",
        text:"소음 환경 — 큰 도로·철도·공장 인접 여부 (저녁 7~9시 + 주말 오전 각각 확인)",
        note:"용구대로(8차선) 인접 단지는 창문 열면 차량 소음 심각. 평일 낮에만 방문하면 조용해 속음. 최소 2회 방문" },
      { id:"loc4", pri:"P3",
        text:"배정 초등학교 등굣길 — 횡단보도·경사·차량 흐름 직접 보행 (학교알리미 배정 확인)",
        note:"초품아(도로 미횡단) 여부가 학부모 선호도에 큰 영향. 학교알리미(schoolinfo.go.kr)에서 배정 학군 정확히 확인" },
      { id:"loc5", pri:"P3",
        text:"혐오시설 반경 300m — 장례식장·유흥가·고압선·쓰레기처리장",
        note:"네이버 지도 로드뷰 사전 확인 후 현장 재확인. 매도 시 가격 10~20% 디스카운트 요인" },
      { id:"loc6", pri:"P3",
        text:"침수 이력 — 도로 대비 지대 낮은 곳·하천 인접 여부 (비 오는 날 방문 최고)",
        note:"국토지리정보원 침수흔적도 검색 가능. 탄천·오리천 인접 단지는 과거 침수 이력 확인 필수" },
      { id:"loc7", pri:"P3",
        text:"인근 편의시설 영업 여부 직접 확인 — 마트·병원·약국·식당",
        note:"앱에 있어도 폐업한 곳 많음. 특히 동네 슈퍼·병원 현장 확인 없이 믿으면 입주 후 당황 사례 빈번" },
      { id:"loc8", pri:"P4",
        text:"단지 분위기 체크 — 유아차·노약자 비율, 조경·놀이터 관리 상태",
        note:"30대 실거주 가족 비율 높은 단지는 커뮤니티·관리 수준 좋은 편. 저녁 산책 시간대 15분 관찰 추천" },
    ]
  },
  {
    id: "agent", emoji: "💬", category: "공인중개사 필수 질문 목록",
    color: "#8E7DBE",
    desc: "중개사 2~3곳 방문 필수 — 같은 질문으로 답변 비교. 한 곳만 믿으면 안 됨",
    items: [
      { id:"a1", pri:"P1", essential:true,
        text:"\"이 집 매도 이유가 뭔가요?\" — 간접적으로라도 반드시 파악",
        note:"이사·급전이면 협상 여지 있음. 하자·이웃 갈등·재건축 무산 등 숨긴 이유 확인이 목적" },
      { id:"a2", pri:"P1",
        text:"\"이 단지 이 평형 최근 3개월 실제 체결가가 얼마인가요?\"",
        note:"국토부 공개 전 정보 보유. 호갱노노·KB와 다를 수 있음. 직접 물어야 현재 시장 흐름 파악 가능" },
      { id:"a3", pri:"P2",
        text:"\"이 층·향 매물은 팔리는 데 보통 얼마나 걸리나요?\"",
        note:"저층·동향은 6개월~1년 넘기는 경우도 있음. 환금성 직접 파악. 답이 애매하거나 \"금방 나가요\"면 의심" },
      { id:"a4", pri:"P2",
        text:"\"현재 전세 매물이 몇 개나 나와 있나요?\"",
        note:"전세 공급 많음 = 투자 목적 매물 多 = 실거주 수요 약함. 협상 여지 있다는 신호" },
      { id:"a5", pri:"P2",
        text:"\"임차인 보증금 금액·계약 만료일·명도 가능 시기가 정확히 언제인가요?\"",
        note:"잔금일과 명도일 불일치 시 이중 주거비 발생. 명도 지연 가능성 있으면 잔금 조건 계약서에 명시" },
      { id:"a6", pri:"P3",
        text:"\"이 단지 재건축·리모델링 조합 설립 추진 여부 아시나요?\"",
        note:"1997~2000년 단지는 재건축 연한 도달. 조합 초기 단계면 기대 수익 있지만 완료까지 10~20년. 몸테크 전략 시 핵심" },
      { id:"a7", pri:"P3",
        text:"\"인근 소음 민원·혐오시설 이슈가 있는 단지인가요?\"",
        note:"오래 영업한 중개사는 공식 데이터에 안 잡히는 이슈 알 가능성 높음. 이 질문에 대한 반응도 중요 단서" },
    ]
  }
];

// ─────────────────────────────────────────────
// DATA — MIND MAP BRANCHES
// ─────────────────────────────────────────────
const MINDMAP_BRANCHES = [
  {
    id:"income", icon:"💵", label:"내 소득 기준 대출 실계산",
    color:"#E8B84B",
    subtitle:"연소득 9,300만원 (원천징수) · 현금 4억 기준 — 최신 스트레스 DSR 반영",
    nodes: [
      {
        type:"calc",
        title:"📊 시중은행 생애최초 — DSR 한도 계산",
        rows: [
          { label:"연소득 (원천징수 기준)", val:"9,300만원", hi:true },
          { label:"DSR 40% 연간 한도", val:"3,720만원/년 = 310만원/월" },
          { label:"스트레스 가산금리 (수도권 2025.10 강화)", val:"+3.0%p 적용", warn:true },
          { label:"실제 금리 3.5% → DSR 심사 기준금리", val:"6.5%" },
          { label:"대출 최대 한도 (스트레스 DSR 기준)", val:"약 4.7~4.9억", hi:true },
          { label:"현금 4억 + 대출 4.9억", val:"매수 가능 상한 약 8.7~9억", hi:true },
        ],
        warning:"스트레스 DSR은 실제 이자에 영향 없음 — 심사 기준만 높임. 실제 월 상환액은 실제 금리(3.5%) 기준 적용."
      },
      {
        type:"calc",
        title:"📅 월 상환액 시뮬레이션 (실제 금리 3.5%, 30년)",
        rows: [
          { label:"대출 3.5억", val:"월 약 157만원" },
          { label:"대출 4.0억", val:"월 약 179만원" },
          { label:"대출 4.3억 (죽전아이뷰 타깃)", val:"월 약 193만원 → 소득 대비 24.9%", hi:true },
          { label:"대출 4.5억", val:"월 약 202만원" },
          { label:"대출 4.9억 (한도 최대)", val:"월 약 220만원" },
        ],
        warning:"⚠️ 외벌이 시뮬레이션 필수: 육아휴직 시 소득 ~5,000만원(월 417만원) 기준으로 193만원 = 월소득의 46%. 빠듯해짐. 대출은 4억 이하를 권장하는 전문가 多"
      }
    ]
  },
  {
    id:"eligibility", icon:"✅", label:"자격 요건 확인",
    color:"#5B9BD5",
    subtitle:"정책대출 기본 조건 4가지 — 소득 9,300만원 기준 해당 여부",
    nodes: [
      {
        type:"yn",
        q:"부부 모두 현재 무주택자인가? (오피스텔·분양권·입주권 포함 확인)",
        detail:"오피스텔도 주거용 분리과세 선택 시 주택 수에 포함될 수 있음. 배우자 포함 전 세대원 무주택 여부 필수 확인",
        y:"정책대출 기본 요건 충족 ✓",
        n:"기존 주택 처분 후 재신청 필요. 생애최초 취득세 감면도 불가"
      },
      {
        type:"yn",
        q:"2023년 1월 1일 이후 출생·입양 자녀가 있는가?",
        detail:"있다면 신생아특례 디딤돌 0순위. 2025년 출산 가구부터 소득 기준 2.5억 이하 → 9,300만원 해당 → 최저 1.8%, 최대 4억",
        y:"🎯 신생아특례 디딤돌 가능! 금리 1.8~4.5%, 최대 4억 → 8.3억대 매수 가능",
        n:"디딤돌 신혼(8,500만원 이하) · 보금자리론(7,000만원 이하) 모두 소득 초과 → 시중은행 생애최초 주담대 검토"
      },
      {
        type:"yn",
        q:"부부합산 순자산이 5.11억 이하인가? (2026년 기준)",
        detail:"순자산 = 부동산 + 금융자산 + 자동차 - 부채. 현금 4억 + 기타 자산이 5.11억 이하인지 확인",
        y:"신생아특례·정책대출 신청 자격 충족 ✓",
        n:"정책금리 대출 불가 → 시중은행 일반 주담대만 가능"
      },
      {
        type:"yn",
        q:"혼인신고일로부터 7년 이내 신혼부부인가?",
        detail:"신혼 요건 해당 시 일부 정책대출 우대금리·한도 우선 적용 가능. 단, 소득 기준은 별도 확인 필수",
        y:"신혼가구 우대 조건 적용 대상 ✓",
        n:"일반 생애최초 기준 적용. 신혼 우대 혜택 없음"
      }
    ]
  },
  {
    id:"loan", icon:"🏦", label:"대출 상품 선택",
    color:"#8E7DBE",
    subtitle:"소득 9,300만원 기준 실제 사용 가능 상품 — 우선순위순",
    nodes: [
      {
        type:"product", badge:"0순위 (자녀 有)", badgeColor:"#E8B84B",
        q:"신생아특례 디딤돌",
        condition:"2023.1.1 이후 자녀 + 소득 2.5억 이하 + 순자산 5.11억 이하",
        y:"최대 4억 · 금리 1.8~4.5%(5년 특례) · LTV 70% · DTI 60% · 스트레스DSR 미적용",
        detail:"수도권 주택가액 9억 이하. 중도상환수수료 2026.12.31까지 면제. 출산 1명 추가 시 특례 5년 연장(최대 15년). 4억 + 현금 4억 = 8억대 매수 가능"
      },
      {
        type:"product", badge:"1순위 (자녀 無)", badgeColor:"#5B9BD5",
        q:"시중은행 생애최초 주담대",
        condition:"무주택 + 생애최초 · 소득 제한 없음",
        y:"LTV 70%(수도권) · DSR 40% + 스트레스 +3%p · 한도 최대 6억(DSR 제약 실제 4.7~4.9억)",
        detail:"9,300만원 소득 기준 실제 한도: 약 4.7~4.9억. 죽전아이뷰 8.3억 → 4.3억 대출 → 월 193만원(3.5%·30년). 동성1차 9억 → 5억 필요 → DSR 초과 가능성, 협상 필수"
      },
      {
        type:"product", badge:"불가 (소득 초과)", badgeColor:"#6B7280",
        q:"디딤돌 신혼 · 보금자리론",
        condition:"디딤돌 신혼: 8,500만원 이하 / 보금자리론: 7,000만원 이하",
        y:"소득 9,300만원 → 두 상품 모두 소득 기준 초과",
        detail:"단, 보금자리론 생애최초 특례(소득 무관 조건) 별도 존재 여부를 한국주택금융공사(1688-8114)에 직접 문의 권장. 정책 변경 가능성 있음"
      }
    ]
  },
  {
    id:"property", icon:"🏠", label:"매물 비교 — 죽전아이뷰 vs 동성1차",
    color:"#E07B4A",
    subtitle:"소득 9,300만원 · 현금 4억 기준 두 매물 실전 비교",
    nodes: [
      {
        type:"compare",
        aLabel:"죽전아이뷰", bLabel:"동성1차",
        rows: [
          { label:"호가", a:"8.3억", b:"9.0억" },
          { label:"KB시세 (26.5월)", a:"8.2억", b:"8.5억" },
          { label:"호가-시세 차이", a:"+0.1억 ✓ 합리적", b:"+0.5억 ⚠ 비쌈", bBad:true },
          { label:"전용60㎡ 실거래 최고가", a:"확인 필요", b:"7.4억 (2026.1 · 16층)" },
          { label:"층/향", a:"2층 / 동향", b:"9층 / 향 확인 필요" },
          { label:"리모델링 필요", a:"즉시 거주 가능 추정", b:"2,500~5,000만원 예상" },
          { label:"필요 대출액", a:"4.3억 (DSR 내 ✓)", b:"5.0억 (DSR 한계, 협상 필수)", bBad:true },
          { label:"월 상환액 (3.5%·30년)", a:"약 193만원", b:"약 225만원" },
          { label:"실총투입 (리모델링 포함)", a:"8.3억 + 부대비 1,500만원", b:"9.0억 + 리모델링 3,000만원 + 부대비 = 약 9.45억" },
        ]
      },
      {
        type:"yn",
        q:"호가가 국토부 실거래 최근 6개월 최고가 이하인가?",
        detail:"동성1차 전용60㎡ 실거래 최고가: 7.4억 (2026.1.15, 16층)\n호가 9억은 실거래 최고가보다 1.6억 높음\n협상 목표: 최소 8.5억 이하(KB시세 수준)로 낮춰야 합리적 진입",
        y:"합리적 진입가 ✓ (죽전아이뷰 해당)",
        n:"협상 또는 패스 권장 (동성1차 현 호가 9억 해당)"
      },
      {
        type:"yn",
        q:"2층 동향 매물의 경우 — 같은 단지 중층 대비 충분히 낮은 가격인가?",
        detail:"동일 단지 저층(2층 이하)은 중층 대비 보통 5~10% 낮게 거래됨\n죽전아이뷰 중층이 8.7~9억대라면 2층 8.3억은 디스카운트 적정\n만약 중층도 8.3억대면 저층 프리미엄 없음 → 메리트 없는 거래",
        y:"저층 디스카운트 충분히 반영 ✓",
        n:"중층과 가격 차이 없으면 같은 단지 중층 매물 재탐색"
      }
    ]
  },
  {
    id:"budget", icon:"🧮", label:"예산 계획",
    color:"#2BAE8E",
    subtitle:"실투입 총액 산출 — 부대비용·리모델링 포함",
    nodes: [
      {
        type:"yn",
        q:"취득세·중개보수·이사비 등 부대비용을 별도로 확보했는가?",
        detail:"생애최초 취득세 감면: 3억 이하 100% 면제 / 3~9억 50% 감면(한도 200만원)\n8.3억 기준 추정 부대비용:\n취득세(감면 후) 약 960만원 + 중개보수 최대 400만원 + 이사비 100~200만원 + 법무사 50~100만원 = 약 1,500~1,700만원\n→ 4억 현금에서 이 금액 빼고 나머지로 대출 계획",
        y:"부대비 포함 실투입 파악 완료 ✓",
        n:"8억 기준 약 1,500만원 추가 자금 필요. 현금 4억에서 선공제 후 잔액으로 대출 역산"
      },
      {
        type:"yn",
        q:"구축 매수 시 리모델링 비용도 예산에 포함했는가?",
        detail:"1997년 단지(동성1차) 23평 리모델링 비용:\n부분(욕실2+주방+도배장판): 2,500~4,000만원\n전체(새시 포함): 5,000~8,000만원\n→ 동성1차 호가 9억 + 리모델링 3,000만원 + 부대비 1,500만원 = 실투입 9.45억",
        y:"리모델링 포함 실투입 파악 완료 ✓",
        n:"구축 몸테크 시 추가 2,500~5,000만원 예비 자금 필요"
      }
    ]
  },
  {
    id:"risk", icon:"⚡", label:"리스크 관리",
    color:"#D4506A",
    subtitle:"영끌 전 반드시 확인할 4가지",
    nodes: [
      {
        type:"yn",
        q:"출산·육아휴직 후 외벌이 기준으로도 상환이 가능한가?",
        detail:"맞벌이 9,300만원 → 월 193만원(4.3억 기준) = 월소득 775만원의 24.9% → 편안\n외벌이(소득 ~5,000만원) → 월소득 417만원 → 193만원 = 46.3% → 매우 빡빡\n전문가 권장: 외벌이 기준 상환 비율 30% 이하 → 3.5억 대출 이하가 안전권",
        y:"외벌이 기준도 상환 가능 ✓",
        n:"대출 3.5~4억 이하로 축소 권장. 매수가 협상 또는 매물 재검토"
      },
      {
        type:"yn",
        q:"금리 1~2%p 추가 인상 시에도 상환이 가능한가?",
        detail:"4.3억 대출 기준 금리별 월 상환액:\n3.5% → 193만원 / 4.5% → 218만원 / 5.5% → 244만원\n현재 변동금리 선택 시 2~3년 후 금리 인상 리스크 노출\n→ 보금자리론·디딤돌 등 고정금리 상품 우선 검토 이유",
        y:"금리 인상 리스크 감내 가능 ✓",
        n:"고정금리 상품 우선 선택. 변동금리 선택 시 2%p 인상 시뮬레이션 미리 확인"
      },
      {
        type:"yn",
        q:"잔금 전 당일 오전에 최신 등기부등본을 다시 발급했는가?",
        detail:"계약 후 잔금 전 사이에 추가 근저당·가압류 설정되는 실제 사례 있음\n잔금 당일 오전 최신 등기부등본 1회 추가 열람 필수\n이상 발견 시 잔금 지급 중단 권리 있음",
        y:"잔금 당일 최종 등기부 확인 완료 ✓",
        n:"이것만 빠져도 낭패 가능 — 반드시 잔금 당일 오전 열람"
      },
      {
        type:"yn",
        q:"계약서에 4가지 특약사항을 넣었는가?",
        detail:"① 잔금 전 선순위 대출 전액 말소 조건\n② 임차인 명도 완료 후 잔금 지급\n③ 관리비 체납액 완납 후 잔금\n④ 하자 발생 시 책임 귀속 조항\n→ 특약 없으면 분쟁 시 불리",
        y:"특약 4가지 포함 완료 ✓",
        n:"공인중개사에게 반드시 삽입 요청. 서면 계약서 날인 전 재확인"
      }
    ]
  }
];

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
function ProgressRing({ pct, color, size = 54 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E2D3F" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={circ - (pct/100)*circ}
        style={{ transition:"stroke-dashoffset 0.5s ease" }} strokeLinecap="round"/>
    </svg>
  );
}

function CheckItem({ item, color, checked, onToggle, expanded, onExpand }) {
  const pri = PRI[item.pri] || PRI.P3;
  return (
    <div style={{
      background:"#141F2E",
      border:`1px solid ${checked ? color+"44" : "#ffffff0F"}`,
      borderRadius:12, marginBottom:7, overflow:"hidden", transition:"border-color 0.2s"
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 12px", cursor:"pointer" }}
        onClick={onToggle}>
        <div style={{
          width:20, height:20, borderRadius:"50%",
          border:`2px solid ${color}`, background: checked ? color : "transparent",
          flexShrink:0, marginTop:2,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"background 0.15s"
        }}>
          {checked && <span style={{ color:"#0A1520", fontSize:10, fontWeight:800 }}>✓</span>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:3 }}>
            <span style={{
              fontSize:9.5, fontWeight:800, padding:"1px 6px", borderRadius:4,
              background: pri.bg, color: pri.color, flexShrink:0
            }}>{pri.label}</span>
            {item.essential && !checked && (
              <span style={{
                fontSize:9.5, fontWeight:800, padding:"1px 6px", borderRadius:4,
                background:"#3D1515", color:"#F87171", flexShrink:0
              }}>계약 필수</span>
            )}
          </div>
          <p style={{
            fontSize:12.5, lineHeight:1.5, margin:0,
            color: checked ? "#4B5563" : "#D1D5DB",
            textDecoration: checked ? "line-through" : "none"
          }}>{item.text}</p>
        </div>
        <button onClick={e=>{ e.stopPropagation(); onExpand(); }}
          style={{ color:"#4B5563", fontSize:10, background:"none", border:"none", cursor:"pointer", padding:"0 2px", flexShrink:0, marginTop:4 }}>
          {expanded ? "▲" : "▼"}
        </button>
      </div>
      {expanded && (
        <div style={{ padding:"0 12px 10px 42px", borderTop:`1px solid ${color}20` }}>
          <p style={{ fontSize:11.5, color:"#9CA3AF", margin:"8px 0 0", lineHeight:1.65 }}>
            💡 {item.note}
          </p>
        </div>
      )}
    </div>
  );
}

function CalcCard({ node, color }) {
  return (
    <div style={{ background:"#141F2E", borderRadius:14, border:`1px solid ${color}30`, marginBottom:8, overflow:"hidden" }}>
      <div style={{ padding:"12px 14px" }}>
        <p style={{ fontSize:13, fontWeight:700, color:"#E5E7EB", margin:"0 0 10px" }}>{node.title}</p>
        {node.rows.map((r, i) => (
          <div key={i} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"6px 10px", borderRadius:8, marginBottom:4,
            background: r.hi ? color+"18" : r.warn ? "#3D1515" : "#0D1720"
          }}>
            <span style={{ fontSize:11.5, color: r.warn ? "#FCA5A5" : "#9CA3AF" }}>{r.label}</span>
            <span style={{
              fontSize:12, fontWeight: r.hi ? 700 : 500,
              color: r.hi ? color : r.warn ? "#FCA5A5" : "#D1D5DB",
              textAlign:"right", maxWidth:"55%"
            }}>{r.val}</span>
          </div>
        ))}
      </div>
      {node.warning && (
        <div style={{ padding:"8px 14px 10px", background:"#1A1500", borderTop:`1px solid ${color}20` }}>
          <p style={{ fontSize:11.5, color:"#FCD34D", margin:0, lineHeight:1.65 }}>{node.warning}</p>
        </div>
      )}
    </div>
  );
}

function CompareCard({ node, color }) {
  return (
    <div style={{ background:"#141F2E", borderRadius:14, border:`1px solid ${color}30`, marginBottom:8, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderBottom:`1px solid ${color}25`, padding:"10px 12px" }}>
        <span style={{ fontSize:11, color:"#6B7280" }}>항목</span>
        <span style={{ fontSize:12, fontWeight:700, color:"#5B9BD5", textAlign:"center" }}>{node.aLabel}</span>
        <span style={{ fontSize:12, fontWeight:700, color:"#E07B4A", textAlign:"center" }}>{node.bLabel}</span>
      </div>
      {node.rows.map((r, i) => (
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          padding:"7px 12px",
          background: i%2===0 ? "#0D1720" : "#111C2A"
        }}>
          <span style={{ fontSize:11, color:"#9CA3AF" }}>{r.label}</span>
          <span style={{ fontSize:11.5, color:"#6EE7B7", textAlign:"center", lineHeight:1.4 }}>{r.a}</span>
          <span style={{ fontSize:11.5, color: r.bBad ? "#FCA5A5" : "#D1D5DB", textAlign:"center", lineHeight:1.4 }}>{r.b}</span>
        </div>
      ))}
    </div>
  );
}

function NodeCard({ node, color }) {
  const [open, setOpen] = useState(false);
  if (node.type === "calc") return <CalcCard node={node} color={color}/>;
  if (node.type === "compare") return <CompareCard node={node} color={color}/>;
  if (node.type === "product") {
    return (
      <div style={{ background:"#141F2E", borderRadius:14, border:`1px solid ${color}30`, marginBottom:8, overflow:"hidden" }}>
        <div style={{ padding:"12px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:20,
              background: node.badgeColor+"25", color: node.badgeColor }}>{node.badge}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#E5E7EB" }}>{node.q}</span>
          </div>
          <p style={{ fontSize:11, color:"#9CA3AF", margin:"0 0 6px" }}>{node.condition}</p>
          <div style={{ background: color+"18", borderRadius:8, padding:"8px 10px" }}>
            <p style={{ fontSize:12.5, color, fontWeight:600, margin:0 }}>{node.y}</p>
          </div>
        </div>
        {node.detail && (
          <>
            <button onClick={()=>setOpen(p=>!p)} style={{
              width:"100%", padding:"6px 14px", background:"none", border:"none",
              borderTop:`1px solid ${color}20`, cursor:"pointer", color:"#6B7280", fontSize:11, textAlign:"left"
            }}>💡 상세 {open?"접기▲":"보기▼"}</button>
            {open && (
              <div style={{ padding:"8px 14px 12px", background:"#0D1720" }}>
                <p style={{ fontSize:11.5, color:"#9CA3AF", margin:0, lineHeight:1.7, whiteSpace:"pre-line" }}>{node.detail}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  // Y/N
  return (
    <div style={{ background:"#141F2E", borderRadius:14, border:`1px solid ${color}30`, marginBottom:8, overflow:"hidden" }}>
      <div style={{ padding:"12px 14px" }}>
        <p style={{ fontSize:13, color:"#D1D5DB", margin:"0 0 10px", lineHeight:1.5, fontWeight:500 }}>{node.q}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          <div style={{ background:"#0F2A1E", border:"1px solid #16533620", borderRadius:10, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#34D399", marginBottom:3 }}>YES ✓</div>
            <p style={{ fontSize:11.5, color:"#6EE7B7", margin:0, lineHeight:1.5 }}>{node.y}</p>
          </div>
          <div style={{ background:"#2A1010", border:"1px solid #53311680", borderRadius:10, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#FCA5A5", marginBottom:3 }}>NO ✗</div>
            <p style={{ fontSize:11.5, color:"#FCA5A5", margin:0, lineHeight:1.5 }}>{node.n}</p>
          </div>
        </div>
      </div>
      {node.detail && (
        <>
          <button onClick={()=>setOpen(p=>!p)} style={{
            width:"100%", padding:"6px 14px", background:"none", border:"none",
            borderTop:`1px solid ${color}20`, cursor:"pointer", color:"#6B7280", fontSize:11, textAlign:"left"
          }}>💡 상세 {open?"접기▲":"보기▼"}</button>
          {open && (
            <div style={{ padding:"8px 14px 12px", background:"#0D1720" }}>
              <p style={{ fontSize:11.5, color:"#9CA3AF", margin:0, lineHeight:1.7, whiteSpace:"pre-line" }}>{node.detail}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("checklist");
  const [checked, setChecked] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedCat, setExpandedCat] = useState("legal");
  const [expandedBranch, setExpandedBranch] = useState("income");

  const toggleCheck = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const toggleItem = id => setExpandedItem(p => p===id ? null : id);
  const toggleCat = id => setExpandedCat(p => p===id ? null : id);
  const toggleBranch = id => setExpandedBranch(p => p===id ? null : id);

  const progress = useMemo(() => CHECKLIST.reduce((acc, cat) => {
    const done = cat.items.filter(i => checked[i.id]).length;
    acc[cat.id] = { total: cat.items.length, done, pct: Math.round((done/cat.items.length)*100) };
    return acc;
  }, {}), [checked]);

  const total = useMemo(() => {
    const t = CHECKLIST.reduce((s,c)=>s+c.items.length,0);
    const d = Object.values(checked).filter(Boolean).length;
    return { total:t, done:d, pct:Math.round((d/t)*100) };
  }, [checked]);

  const essentialDone = useMemo(() => {
    const ids = CHECKLIST.flatMap(c=>c.items.filter(i=>i.essential).map(i=>i.id));
    return ids.every(id=>checked[id]);
  }, [checked]);

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#0A1520 0%,#0F1D2D 100%)",
      color:"#E5E7EB",
      fontFamily:"'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif",
      maxWidth:600, margin:"0 auto"
    }}>

      {/* ── Header ── */}
      <div style={{
        background:"#0A1520EE", backdropFilter:"blur(10px)",
        borderBottom:"1px solid #E8B84B22",
        position:"sticky", top:0, zIndex:20, padding:"14px 16px 0"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#E8B84B,#D4956A)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18
          }}>🏠</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#E8B84B", letterSpacing:-0.3 }}>내집마련 가이드</div>
            <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>무주택 신혼부부 · 생애최초 매매 · 2026 최신 기준</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, paddingBottom:14 }}>
          {[
            { id:"checklist", label:"✅  임장 체크리스트" },
            { id:"mindmap",   label:"🧭  의사결정 가이드" }
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"9px 0", borderRadius:10, fontSize:12.5, fontWeight:700,
              border:"none", cursor:"pointer", transition:"all 0.2s",
              background: tab===t.id ? "linear-gradient(135deg,#E8B84B,#D4956A)" : "#141F2E",
              color: tab===t.id ? "#0A1520" : "#6B7280"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── CHECKLIST TAB ── */}
      {tab==="checklist" && (
        <div style={{ padding:"16px 16px 80px" }}>

          {/* 우선순위 범례 */}
          <div style={{
            background:"#141F2E", border:"1px solid #ffffff10",
            borderRadius:14, padding:"12px 14px", marginBottom:14
          }}>
            <p style={{ fontSize:11, color:"#6B7280", margin:"0 0 8px", fontWeight:700 }}>우선순위 기준</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {Object.entries(PRI).map(([k,v])=>(
                <span key={k} style={{
                  fontSize:10.5, fontWeight:700, padding:"2px 9px", borderRadius:20,
                  background:v.bg, color:v.color
                }}>{v.label}</span>
              ))}
              <span style={{
                fontSize:10.5, fontWeight:700, padding:"2px 9px", borderRadius:20,
                background:"#3D1515", color:"#F87171"
              }}>계약 필수 = 계약 전 미확인 시 법적 손실 위험</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div style={{
            background:"linear-gradient(135deg,#1A2D20,#1A2535)",
            border:"1px solid #E8B84B28", borderRadius:18, padding:16, marginBottom:14,
            display:"flex", alignItems:"center", gap:14
          }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <ProgressRing pct={total.pct} color="#E8B84B" size={58}/>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:13, fontWeight:800, color:"#E8B84B" }}>{total.pct}%</span>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#E5E7EB", marginBottom:4 }}>
                전체 진행률 {total.done}/{total.total}
              </div>
              <div style={{ fontSize:11.5, color: essentialDone ? "#34D399" : "#FCA5A5" }}>
                {essentialDone ? "✅ 계약 필수 항목 모두 완료!" : "⚠️ 빨간 '계약 필수' 항목을 먼저 확인하세요"}
              </div>
              <div style={{ marginTop:6, background:"#0A1520", borderRadius:4, height:5 }}>
                <div style={{
                  height:"100%", borderRadius:4,
                  background:"linear-gradient(90deg,#E8B84B,#F0D070)",
                  width:`${total.pct}%`, transition:"width 0.4s ease"
                }}/>
              </div>
            </div>
          </div>

          {/* Categories */}
          {CHECKLIST.map(cat => {
            const prog = progress[cat.id];
            const isOpen = expandedCat===cat.id;
            return (
              <div key={cat.id} style={{ marginBottom:10 }}>
                <button onClick={()=>toggleCat(cat.id)} style={{
                  width:"100%", background:"#141F2E",
                  border:`1px solid ${isOpen ? cat.color+"55" : "#ffffff10"}`,
                  borderRadius: isOpen ? "14px 14px 0 0" : 14,
                  padding:"12px 14px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:10, transition:"all 0.2s"
                }}>
                  <span style={{ fontSize:18 }}>{cat.emoji}</span>
                  <div style={{ flex:1, textAlign:"left" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:cat.color }}>{cat.category}</div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{cat.desc}</div>
                    <div style={{ marginTop:5, background:"#0A1520", borderRadius:3, height:3 }}>
                      <div style={{
                        height:"100%", borderRadius:3, backgroundColor:cat.color,
                        width:`${prog.pct}%`, transition:"width 0.4s"
                      }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:11.5, color:"#6B7280" }}>{prog.done}/{prog.total}</span>
                    <div style={{
                      width:22, height:22, borderRadius:"50%",
                      background: cat.color+"20",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, color:cat.color
                    }}>{isOpen?"▲":"▼"}</div>
                  </div>
                </button>
                {isOpen && (
                  <div style={{
                    background:"#111C2A",
                    border:`1px solid ${cat.color}30`,
                    borderTop:"none", borderRadius:"0 0 14px 14px",
                    padding:"12px 12px 8px"
                  }}>
                    {cat.items.map(item=>(
                      <CheckItem
                        key={item.id} item={item} color={cat.color}
                        checked={!!checked[item.id]}
                        onToggle={()=>toggleCheck(item.id)}
                        expanded={expandedItem===item.id}
                        onExpand={()=>toggleItem(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{
            background:"#1A1F2E", border:"1px solid #4A90D930",
            borderRadius:14, padding:"12px 14px", marginTop:6
          }}>
            <p style={{ fontSize:11.5, color:"#9CA3AF", margin:0, lineHeight:1.7 }}>
              📌 <strong style={{ color:"#D1D5DB" }}>임장 황금 원칙</strong>:
              동일 매물을 <strong style={{ color:"#E8B84B" }}>평일 저녁(7~9시) + 주말 오전(10~12시)</strong> 두 번 방문.
              공인중개사 <strong style={{ color:"#E8B84B" }}>2~3곳 비교</strong> 및
              관리사무소 직접 방문 — 장기수선충당금·관리비 고지서 서면 요청.
            </p>
          </div>
        </div>
      )}

      {/* ── MINDMAP TAB ── */}
      {tab==="mindmap" && (
        <div style={{ padding:"16px 16px 80px" }}>

          {/* Central Node */}
          <div style={{
            background:"linear-gradient(135deg,#1A2D20,#1A2038)",
            border:"2px solid #E8B84B35", borderRadius:20, padding:18, textAlign:"center", marginBottom:14
          }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🏠</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#E8B84B", letterSpacing:-0.3 }}>
              생애최초 신혼부부 매매 의사결정
            </div>
            <div style={{ fontSize:11, color:"#6B7280", marginTop:3 }}>
              연소득 9,300만원 · 현금 4억 · 2026 최신 기준
            </div>
            <div style={{ display:"flex", gap:7, justifyContent:"center", marginTop:10, flexWrap:"wrap" }}>
              {[
                { l:"대출 실계산", c:"#E8B84B" }, { l:"자격 확인", c:"#5B9BD5" },
                { l:"상품 선택", c:"#8E7DBE" }, { l:"매물 비교", c:"#E07B4A" },
                { l:"예산 계획", c:"#2BAE8E" }, { l:"리스크", c:"#D4506A" },
              ].map(b=>(
                <span key={b.l} style={{
                  fontSize:10.5, fontWeight:600,
                  background:b.c+"20", color:b.c,
                  padding:"3px 10px", borderRadius:20, border:`1px solid ${b.c}30`
                }}>{b.l}</span>
              ))}
            </div>
          </div>

          {MINDMAP_BRANCHES.map(branch=>(
            <div key={branch.id} style={{ marginBottom:9 }}>
              <button onClick={()=>toggleBranch(branch.id)} style={{
                width:"100%", background:"#141F2E",
                border:`2px solid ${expandedBranch===branch.id ? branch.color+"70" : "#ffffff0F"}`,
                borderRadius: expandedBranch===branch.id ? "16px 16px 0 0" : 16,
                padding:"13px 14px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:12, transition:"all 0.2s"
              }}>
                <div style={{
                  width:44, height:44, borderRadius:12,
                  background: branch.color+"20",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, flexShrink:0
                }}>{branch.icon}</div>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:branch.color }}>{branch.label}</div>
                  <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{branch.subtitle}</div>
                </div>
                <div style={{
                  width:26, height:26, borderRadius:"50%",
                  background: branch.color+"20",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, color:branch.color, flexShrink:0
                }}>{expandedBranch===branch.id?"▲":"▼"}</div>
              </button>
              {expandedBranch===branch.id && (
                <div style={{
                  background:"#111C2A",
                  border:`2px solid ${branch.color}35`,
                  borderTop:"none", borderRadius:"0 0 16px 16px",
                  padding:"12px 12px 6px"
                }}>
                  {branch.nodes.map((node,idx)=>(
                    <NodeCard key={idx} node={node} color={branch.color}/>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{
            background:"#141F2E", border:"1px solid #ffffff10",
            borderRadius:14, padding:"12px 14px", marginTop:8
          }}>
            <p style={{ fontSize:10.5, color:"#6B7280", margin:0, lineHeight:1.8 }}>
              📰 <strong style={{ color:"#9CA3AF" }}>참고 출처</strong>: 한국주택금융공사 보금자리론 (hf.go.kr, 2026.05) ·
              주택도시기금 신생아특례 디딤돌 (myhome.go.kr) · 홈두부 2026 생애최초 대출 총정리 ·
              뱅크샐러드 스트레스DSR·디딤돌·신생아특례 (2026.01) · 토스피드 DSR 계산기 ·
              아파트랭킹 국토부 실거래가 (2026.03) · KB부동산 임장 가이드 (2025.12) ·
              집품 임장 체크리스트 (2025.08) · AJD 임장활동 체크리스트 (2025.08)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
