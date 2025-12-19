<template>
    <section class="az-game">
        <div class="az-game__heading">Vue.js Rock Paper Scissors</div>

        <canvas
            ref="canvas"
            class="az-game__canvas"
            :width="canvasWidth"
            :height="canvasHeight"
        />

        <GameDashboard
            :results="results"
            :currentRound="currentRound"
            :playerAvatar="playerAvatar"
            :resultStatus="resultStatus"
            :isLocked="isLocked"
            :isGameOver="isGameOver"
            :gameWinnerMessage="gameWinnerMessage"
            @play="play"
            @restart="restartGame"
        />

        <GameWelcomeScreen
            v-if="isWelcomeScreen"
            @setPlayer="setPlayer"
        />
    </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import GameDashboard from "@/components/GameDashboard.vue"
import GameWelcomeScreen from "@/components/GameWelcomeScreen.vue"

import rosePlayer from '@/assets/rose.png'
import mintPlayer from '@/assets/mint.png'

import roseBase from '@/assets/rose-base.png'
import roseRock from '@/assets/rose-rock.png'
import rosePaper from '@/assets/rose-paper.png'
import roseScissors from '@/assets/rose-scissors.png'

import mintBase from '@/assets/mint-base.png'
import mintRock from '@/assets/mint-rock.png'
import mintPaper from '@/assets/mint-paper.png'
import mintScissors from '@/assets/mint-scissors.png'

type Choice = 'rock' | 'paper' | 'scissors'
type Player = 'rose' | 'mint'
type RoundResult = Player | 'draw' | null

const LOCK_TIME = 2000
const CHOICES: Choice[] = ['rock', 'paper', 'scissors']
const canvasWidth = 840
const canvasHeight = 500

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const roseChoice = ref<Choice | null>(null)
const mintChoice = ref<Choice | null>(null)

const results = ref<RoundResult[]>(Array(5).fill(null))
const currentRound = ref(0)

const isLocked = ref(false)
const isGameOver = ref(false)
const isWelcomeScreen = ref(true)

const resultStatus = ref('')
const gameWinnerMessage = ref('')

const player = ref<Player | null>(null)

const playerAvatar = computed(() =>
    player.value === 'rose' ? rosePlayer : mintPlayer
)

const imageMap = {
    rose: {
        rock: roseRock,
        paper: rosePaper,
        scissors: roseScissors,
        base: roseBase
    },
    mint: {
        rock: mintRock,
        paper: mintPaper,
        scissors: mintScissors,
        base: mintBase
    }
}

const getImage = (color: Player, choice: Choice | null) =>
    choice ? imageMap[color][choice] : imageMap[color].base

const drawBoard = () => {
    if (!ctx) return

    const context = ctx

    const imgRose = new Image()
    const imgMint = new Image()

    let loaded = 0

    const onLoad = () => {
        loaded++
        if (loaded !== 2) return

        context.fillStyle = '#AFAFA8'
        context.fillRect(0, 0, canvasWidth, canvasHeight)

        const drawImageScaled = (
            img: HTMLImageElement,
            side: 'left' | 'right'
        ) => {
            const maxWidth = canvasWidth / 2
            const maxHeight = canvasHeight
            const ratio = Math.min(
                maxWidth / img.width,
                maxHeight / img.height
            )

            const width = img.width * ratio
            const height = img.height * ratio

            const dx =
                side === 'left'
                    ? 0
                    : canvasWidth - width

            const dy = (maxHeight - height) / 2

            context.drawImage(img, dx, dy, width, height)
        }

        drawImageScaled(imgRose, 'left')
        drawImageScaled(imgMint, 'right')
    }

    imgRose.onload = onLoad
    imgMint.onload = onLoad

    imgRose.src = getImage('rose', roseChoice.value)
    imgMint.src = getImage('mint', mintChoice.value)
}

const setPlayer = (color: Player) => {
    player.value = color
    isWelcomeScreen.value = false
    restartGame()
}

const restartGame = () => {
    results.value = Array(5).fill(null)
    currentRound.value = 0
    roseChoice.value = null
    mintChoice.value = null
    isLocked.value = false
    isGameOver.value = false
    resultStatus.value = ''
    gameWinnerMessage.value = ''
    drawBoard()
}

const randomChoice = (): Choice =>
    CHOICES[Math.floor(Math.random() * CHOICES.length)]

const determineWinner = (user: Choice, ai: Choice) => {
    if (user === ai) return 'Draw'
    if (
        (user === 'rock' && ai === 'scissors') ||
        (user === 'paper' && ai === 'rock') ||
        (user === 'scissors' && ai === 'paper')
    ) return 'You won this round'
    return 'You lose this round'
}

const checkGameOver = () => {
    const roseWins = results.value.filter(r => r === 'rose').length
    const mintWins = results.value.filter(r => r === 'mint').length

    if (roseWins >= 3 || mintWins >= 3 || currentRound.value >= 5) {
        isGameOver.value = true

        if (roseWins === mintWins) {
            gameWinnerMessage.value = 'Nobody won this game!'
            return
        }

        const winner = roseWins > mintWins ? 'rose' : 'mint'
        gameWinnerMessage.value =
            winner === player.value ? 'You won the game!' : 'You lost the game!'
    }
}

const play = (choice: Choice) => {
    if (!player.value || isLocked.value || isGameOver.value) return

    isLocked.value = true

    if (player.value === 'rose') {
        roseChoice.value = choice
        mintChoice.value = randomChoice()
    } else {
        mintChoice.value = choice
        roseChoice.value = randomChoice()
    }

    const result = determineWinner(choice, player.value === 'rose' ? mintChoice.value! : roseChoice.value!)
    resultStatus.value = result

    setTimeout(() => {
        if (result === 'Draw') {
            results.value[currentRound.value] = 'draw'
        } else if (result.includes('won')) {
            results.value[currentRound.value] = player.value
        } else {
            results.value[currentRound.value] = player.value === 'rose' ? 'mint' : 'rose'
        }

        currentRound.value++
        roseChoice.value = null
        mintChoice.value = null
        resultStatus.value = ''

        checkGameOver()
        isLocked.value = false
        drawBoard()
    }, LOCK_TIME)
}

onMounted(() => {
    ctx = canvas.value?.getContext('2d') || null
    drawBoard()
})

watch([roseChoice, mintChoice], drawBoard)
</script>

<style lang="scss" scoped>
.az-game {
    position: relative;
    overflow: hidden;
    width: 960px;
    margin: 32px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    &__heading {
        font-size: 48px;
        font-weight: 700;
        line-height: 1em;
        text-shadow:
            0 4px 3px rgba(0,0,0, .4),
            0 8px 13px rgba(0,0,0, .1),
            0 18px 23px rgba(0,0,0, .1);
    }

    &__canvas {
        display: block;
    }
}
</style>