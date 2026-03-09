export default function FindTourInfo() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-600">분실물 카테고리</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">핸드폰</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">발견 장소</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">대양홀 - 1층 로비</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">등록 날짜</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">2026. 3. 1. 오후 2:30:00</div>
      </div>
    </div>
  );
}
