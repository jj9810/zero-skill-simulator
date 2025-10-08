/*
Maplestory Zero Assist Simulator
Original Author: @icepeng
Reference: @Monolith11
Update (Sep 2025): @jj9810
스킬 데이터는 KMS 풀공속 기준이며, V 매트릭스는 풀강 기준입니다.
*/

const hexA1 = 30;  // 문 스트라이크 계열
const hexA2 = 30;  // 플래시 어썰터 계열
const hexA3 = 30;  // 롤링 커브 계열
const hexA4 = 30;  // 윈드 커터 계열

/*
스킬 딜레이 표: https://gall.dcinside.com/mini/board/view/?id=alphabeta&no=3636
모든 딜레이는 연계, 개활지 기준
 */
const skills = {
    a11: {
        code: 'a11',
        name: '문 스트라이크',
        character: 'Alpha',
        assist: 'b11',
        delay: 330,
        assistDelay: 330,
        hexaDeal: ((131 + 2 * hexA1) * 6) * 2.8
    },
    a12: {
        code: 'a12',
        name: '피어스 쓰러스트',
        character: 'Alpha',
        assist: 'b12',
        delay: 300,
        assistDelay: 510,
        hexaDeal: ((185 + 3 * hexA1) * 6) * 2.8
    },
    a13: {
        code: 'a13',
        name: '쉐도우 스트라이크',
        character: 'Alpha',
        assist: 'b11',
        delay: 270,  // 제자리
        assistDelay: 0,  // 어시스트가 없는 스킬
        hexaDeal: ((211 + 4 * hexA1) * 8
            + (334 + 6 * hexA1) * 1     // 검기
        ) * 2.8
    },
    a21: {
        code: 'a21',
        name: '플래시 어썰터',
        character: 'Alpha',
        assist: 'b21',
        delay: 270,
        assistDelay: 270,
        hexaDeal: ((160 + 3 * hexA2) * 5) * 2.2
    },
    a22: {
        code: 'a22',
        name: '스핀 커터',
        character: 'Alpha',
        assist: 'b22',
        delay: 270,
        assistDelay: 270,
        hexaDeal: ((285 + 5 * hexA2) * 9
            + (120 + 3 * hexA2) * 4
        ) * 2.2
    },
    a31: {
        code: 'a31',
        name: '롤링 커브',
        character: 'Alpha',
        assist: 'b31',
        delay: 690,
        assistDelay: 690,
        hexaDeal: ((390 + 7 * hexA3) * 11
            + (450 + 10 * hexA2) * (1 + 0.3 * 3)       // 검기: 4회
        ) * 2.2
    },
    a32: {
        code: 'a32',
        name: '롤링 어썰터',
        character: 'Alpha',
        assist: 'b31',
        delay: 570,
        assistDelay: 90,
        hexaDeal: ((435 + 4 * hexA3) * 12
            + (435 + 15 * hexA2) * (1 + 0.3 * 3)       // 검기: 4회
        ) * 2.2
    },
    a41: {
        code: 'a41',
        name: '윈드 커터',
        character: 'Alpha',
        assist: 'b41',
        delay: 240,
        assistDelay: 240,
        hexaDeal: ((175 + 3 * hexA4 + (10 + 2 * hexA1)) * 8
            + (115 + 2 * hexA4 + (10 + 1 * hexA1)) * 3 * 6      // 회오리 6타
        ) * 2.2
    },
    a42: {
        code: 'a42',
        name: '윈드 스트라이크',
        character: 'Alpha',
        assist: 'b42',
        delay: 240,
        assistDelay: 240,
        hexaDeal: ((235 + 4 * hexA4 + (2 * hexA1)) * 8) * 2.2
    },
    a43: {
        code: 'a43',
        name: '스톰 브레이크',
        character: 'Alpha',
        assist: 'b43',
        delay: 270,
        assistDelay: 270,
        hexaDeal: ((325 + 5 * hexA4 + (2 * hexA1)) * 10
            + (325 + 5 * hexA4 + (2 * hexA1)) * 4 * 6       // 회오리 2회
            + (210 + 4 * hexA4 + (2 * hexA1)) * 4           // 전기 4회
        ) * 2.2
    },
    b11: {
        code: 'b11',
        name: '어퍼 슬래시',
        character: 'Beta',
        assist: 'a11',
        delay: 390,
        assistDelay: 270,  // 기본 630
        hexaDeal: ((217 + 3 * hexA1) * 6) * 2.8
    },
    b12: {
        code: 'b12',
        name: '파워 스텀프',
        character: 'Beta',
        assist: 'a12',
        delay: 390,
        assistDelay: 390,
        hexaDeal: ((342 + 3 * hexA1) * 9 + (342 + 3 * hexA1) * 9) * 2.8
    },
    b21: {
        code: 'b21',
        name: '프론트 슬래시',
        character: 'Beta',
        assist: 'a21',
        delay: 450,
        assistDelay: 450,
        hexaDeal: ((226 + 4 * hexA2) * 6) * 2.2
    },
    b22: {
        code: 'b22',
        name: '스로잉 웨폰',
        character: 'Beta',
        assist: 'a22',
        delay: 480,
        assistDelay: 480,
        hexaDeal: ((350 + 7 * hexA2) * 4 * 3) * 2.2  // 3회 충돌
    },
    b31: {
        code: 'b31',
        name: '터닝 드라이브',
        character: 'Beta',
        assist: 'a31',
        delay: 360,
        assistDelay: 360,
        hexaDeal: ((285 + 6 * hexA3) * 6) * 2.2
    },
    b32: {
        code: 'b32',
        name: '휠 윈드',
        character: 'Beta',
        assist: 'a32',
        delay: 60,  // 최소
        assistDelay: 0,  // 어시스트가 없는 스킬
        hexaDeal: ((215 + 5 * hexA3) * 2) * 2.2  // 1회
    },
    b41: {
        code: 'b41',
        name: '기가 크래시',
        character: 'Beta',
        assist: 'a41',
        delay: 240,
        assistDelay: 240,
        hexaDeal: ((240 + 4 * hexA4 + (2 * hexA1)) * 6) * 2.2
    },
    b42: {
        code: 'b42',
        name: '점프 크래시',
        character: 'Beta',
        assist: 'a42',
        delay: 270,
        assistDelay: 270,
        hexaDeal: ((200 + 4 * hexA4 + (2 * hexA1)) * 6
            + (200 + 4 * hexA4 + (2 * hexA1)) * 3) * 2.2
    },
    b43: {
        code: 'b43',
        name: '어스 브레이크',
        character: 'Beta',
        assist: 'a43',
        delay: 360,
        assistDelay: 360,
        hexaDeal: ((365 + 6 * hexA4 + (2 * hexA1)) * 10
            + (255 + 5 * hexA4 + (2 * hexA1)) * 10
            + (335 + 5 * hexA4 + (2 * hexA1)) * 5       // 전기 5회
        ) * 2.2
    },
};

function validateCombo(codes) {
    const skillSets = new Set();
    const characterSets = new Set();

    for (let sk of Object.keys(skills)) {
        skillSets.add(sk);
    }

    for (let code of codes) {
        // 잘못된 입력값 검사
        if (!skillSets.has(code)) {
            return false;
        }
        characterSets.add(skills[code].character);
    }

    // 올바른 입력이어도 모든 값이 동일 캐릭터인지 확인
    return characterSets.size === 1;
}

function getLastSkill(log, type) {
    return log.findLast(sk => sk[0] === type) || null;
}

/*
최신 로직: https://www.inven.co.kr/board/maple/2294/356617
 */
function analyzeCombo(codes) {
    let delay = 0;  // 본체의 시간
    let assistDelay = 60;   // 어시스트 캐릭터의 시간
    let currentAssist = null;  // 본체 행동시점의 어시스트 캐릭터 동작
    let assistQueue = null;
    const log = [];

    for (const sk of codes.map((x) => skills[x])) {
        // 본체 스킬 발동
        let baseAction = [
            'BASE',
            sk.code,
            sk.name,
            sk.character,
            delay,
            delay + sk.delay,
            sk.hexaDeal
        ];
        log.push(baseAction);
        delay += sk.delay;

        // 2.6초 이내에만 어시스트가 나감
        if (delay <= 2600) {
            // 본체에 대응하는 어시스트 스킬
            const assist = skills[sk.assist];

            if (currentAssist == null) {
                // 어시스트 캐릭터가 휴식 중
                let assistAction = [
                    'ASSIST',
                    assist.code,
                    assist.name,
                    assist.character,
                    assistDelay,
                    assistDelay + assist.assistDelay,
                    assist.hexaDeal
                ];
                log.push(assistAction);

                assistDelay += assist.assistDelay;

                // 다음 본체스킬 발동시점에 어시스트 캐릭터 동작 설정
                if (delay >= assistAction[5]) {
                    currentAssist = null;
                } else {
                    currentAssist = assistAction;
                }
            } else {
                // 어시스트 캐릭터가 동작 중
                if (assistQueue == null) {
                    // 아시스트 큐 X
                    // 이미 시전중인 어시스트가 끝나면 현재 어시스트 스킬 발동
                    let assistAction = [
                        'ASSIST',
                        assist.code,
                        assist.name,
                        assist.character,
                        assistDelay,
                        assistDelay + assist.assistDelay,
                        assist.hexaDeal
                    ];
                    log.push(assistAction);

                    // 다음 본체스킬 발동시점에 어시스트 캐릭터 동작 설정
                    if (delay >= assistAction[5]) {
                        // 휴식
                        currentAssist = null;
                    } else {
                        // 다음 본체스킬 시전시 어시스트 캐릭터 동작은?
                        if (delay > assistAction[4]) {
                            // 다음 본체스킬 시작전에 어시스트 처리 가능
                            // 큐는 빈상태로 유지
                            currentAssist = assistAction;
                        } else {
                            // 다음 본체스킬 시작전에 어시스트 처리 불가능
                            // 큐를 채움
                            assistQueue = assistAction;
                        }
                    }

                    assistDelay += assist.assistDelay;
                } else {
                    // 어시스트 큐 O
                    // 0. assistDelay 재설정
                    assistDelay = baseAction[4];

                    // 1. 현재 어시스트 동작 강제종료
                    currentAssist[5] = assistDelay;

                    // 2. 큐 어시스트를 즉시 적용하고 큐 비움
                    let queuedSkillDelay = assistQueue[5] - assistQueue[4];
                    assistQueue[4] = assistDelay;
                    assistQueue[5] = assistDelay + queuedSkillDelay;
                    assistDelay += queuedSkillDelay;

                    assistQueue = null;

                    // 3. 일반적인 어시스트 처리 진행
                    let assistAction = [
                        'ASSIST',
                        assist.code,
                        assist.name,
                        assist.character,
                        assistDelay,
                        assistDelay + assist.assistDelay,
                        assist.hexaDeal
                    ];
                    log.push(assistAction);

                    assistDelay += assist.assistDelay;

                    // 다음 본체스킬 발동시점에 어시스트 캐릭터 동작 설정
                    if (delay >= assistAction[5]) {
                        currentAssist = null;
                    } else {
                        currentAssist = assistAction;
                    }
                }
            }
        }
        // console.log(currentAssist, assistQueue);
    }

    let damage = 0.0;
    for (const action of log) {
        if (action[0] === 'ASSIST' && action[1] === 'b22') {
            damage += action[6] * 0.6;
        } else {
            damage += action[6];
        }
    }

    console.log(log);
    console.log(delay, damage);

    return {
        cycle: log,
        delay: delay,
        damage: damage,
    }
}

// const cycle = ['a11', 'a12', 'a13', 'a11', 'a12', 'a13', 'a11', 'a12', 'a13'];  // Alpha
// cycle = ['b31', 'b32', 'b21', 'b22', 'b11', 'b12'];  // Beta
// analyzeCombo(cycle);

export {validateCombo, analyzeCombo};
