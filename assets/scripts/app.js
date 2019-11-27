const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

function getMaxLifeValues() {
    const enteredValue = prompt(
        "Enter Maximum life for you and monster.",
        "100",
    );
    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { message: "Invalid input: not a number" };
    }

    return parsedValue;
}
let chosenMaxLife;
try {
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert("You entred an invalid number, default value of 100 used instead");
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
let lastLoggedEntry;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry;
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: "MONSTER",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth,
            };
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            llogEntry = {
                event: event,
                value: value,
                target: "MONSTER",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: event,
                value: value,
                target: "PLAYER",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: event,
                value: value,
                target: "PLAYER",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealthBar,
            };
            break;
    }
    // if (event === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: "MONSTER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth,
    //     };
    // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: "MONSTER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
    // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: "PLAYER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         target: "PLAYER",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
    // } else if (event === LOG_EVENT_GAME_OVER) {
    //     logEntry = {
    //         event: event,
    //         value: value,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealthBar,
    //     };
    // }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth,
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert("You would be dead but the bonus life saved you");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You Won");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Player Won",
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("Monster Won");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Monster Won",
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("Draw");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Draw",
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent =
        mode === MODE_ATTACK
            ? LOG_EVENT_PLAYER_ATTACK
            : LOG_EVENT_PLAYER_STRONG_ATTACK;
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
        "Player Won",
        currentMonsterHealth,
        currentPlayerHealth,
    );
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;

    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("you can't heal to more than your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth,
    );
    endRound();
}

function printLogHandler() {
    for (let i = 0; i < 3; i++) {
        console.log(`I am the number ${i}`);
    }
    let i = 0;
    for (const log of battleLog) {
        if ((!lastLoggedEntry && lastLoggedEntry != 0) || lastLoggedEntry < i) {
            console.log(`#${i}`);
            for (const key in log) {
                console.log(`${key} => ${log[key]}`);
                // console.log(key);
                // console.log(log[key]);
            }
            lastLoggedEntry = i;
            break;
        }
        i++;

        // console.log("---------------");
    }
    console.log(battleLog);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
