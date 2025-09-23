import React, { useState } from "react";
import { validateCombo, analyzeCombo } from "./zero.js";
import "./timeline.css";

const Timeline = () => {
    const [inputText, setInputText] = useState("a41 a42 a43 a11 a12 a13 a41 a42 a43 a11 a12 a13");
    const [data, setData] = useState(inputText.split(" "));
    const [state, setState] = useState(analyzeCombo(data));

    const { cycle, delay, damage } = state;

    const totalTime = Math.max(...cycle.map((sk) => sk[5]));
    const interval = 30;
    const pixelsPerMs = 0.5;

    const getBlockStyle = (start, end) => {
        const top = start * pixelsPerMs;
        const height = (end - start) * pixelsPerMs;
        return {
            position: "absolute",
            top: `${top}px`,
            height: `${height}px`,
            width: "100%",
            border: "1px solid #333",
            boxSizing: "border-box",
            padding: "2px",
            fontSize: "12px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
        };
    };

    const baseSkills = cycle.filter(([type]) => type === "BASE");
    const assistSkills = cycle.filter(([type]) => type === "ASSIST");

    const handleUpdate = () => {
        const trimmed = inputText.trim().slice(0, 256);
        const parsed = trimmed.split(/\s+/);
        if (validateCombo(parsed)) {
            setData(parsed);
            setState(analyzeCombo(parsed));
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
            {/* 타임라인 영역 */}
            <div style={{ display: "flex", height: `${(totalTime + interval) * pixelsPerMs}px`}}>
                {/* 시간 눈금 */}
                <div style={{ width: "60px", position: "relative", background: "#f0f0f0"}}>
                    {Array.from({ length: totalTime / interval + 1 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                top: `${i * interval * pixelsPerMs}px`,
                                transform: "translateY(-50%)",
                                fontSize: "10px",
                                textAlign: "right",
                                paddingRight: "4px",
                                width: "100%",
                            }}
                        >
                            {i * interval}ms
                        </div>
                    ))}
                </div>

                {/* 스킬 레인들 */}
                <div style={{ flex: 1, display: "flex" }}>
                    {/* BASE 레인 */}
                    <div style={{ position: "relative", width: "50%" }}>
                        {baseSkills.map(([type, id, name, character, start, end], index) => (
                            <div key={index} style={{ ...getBlockStyle(start, end) }} className={`skill-${character}`}>
                                {name}
                            </div>
                        ))}
                    </div>

                    {/* ASSIST 레인 */}
                    <div style={{ position: "relative", width: "50%" }}>
                        {assistSkills.map(([type, id, name, character, start, end], index) => (
                            <div key={index} style={{ ...getBlockStyle(start, end) }} className={`skill-${character}`}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 통계 정보 아래로 이동 */}
            <div style={{ marginTop: "20px", fontSize: "14px" }}>
                <p><strong>Total Delay:</strong> {delay} ms</p>
                <p><strong>Total Damage (Relative):</strong> {damage}</p>
                <p><strong>DPS (Relative):</strong> {(damage / totalTime * 1000).toFixed(2)}</p>
            </div>

            {/* 입력 박스 + 버튼 */}
            <div style={{ marginTop: "20px" }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={256}
                    placeholder="스킬 ID를 띄어쓰기로 입력하세요 (예: a11 a12 a13)"
                    style={{ width: "80%", padding: "8px", fontSize: "14px" }}
                />
                <button
                    onClick={handleUpdate}
                    style={{ marginLeft: "10px", padding: "8px 16px", fontSize: "14px", cursor: "pointer" }}
                >
                    업데이트
                </button>
            </div>
        </div>
    );
};

export default Timeline;
