<template>
    <div class="az-dashboard">
        <div class="az-dashboard__rounds">
            <div class="az-dashboard__avatar">
                <img :src="playerAvatar" alt="Player avatar" />
            </div>

            <div
                v-for="(result, index) in results"
                :key="index"
                class="az-dashboard__round"
                :class="result && `az-dashboard__round--${result}`"
            />

            <transition name="fade">
                <div v-if="resultStatus" class="az-dashboard__status">
                    {{ resultStatus }}
                </div>
            </transition>
        </div>

        <div v-if="!isGameOver && currentRound < 5" class="az-dashboard__controls">
            <div class="az-dashboard__controls-title">
                {{ isLocked ? 'Please wait…' : 'Choose your move' }}
            </div>

            <button
                v-for="choice in choices"
                :key="choice"
                class="az-dashboard__control"
                :class="{ 'az-dashboard__control--disabled': isLocked }"
                @click="handleClick(choice)"
            >
                <img :src="icons[choice]" :alt="choice" />
            </button>
        </div>

        <div v-if="isGameOver || currentRound === 5" class="az-dashboard__results">
            <div class="az-dashboard__results-status">{{ gameWinnerMessage }}</div>

            <button class="az-dashboard__button" @click="emit('restart')">
                Start new game
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    results: (null | 'rose' | 'mint' | 'draw')[]
    currentRound: number
    playerAvatar: string
    resultStatus: string
    isLocked: boolean
    isGameOver: boolean
    gameWinnerMessage: string
}>()

const emit = defineEmits(['play', 'restart'])

const choices = ['rock', 'paper', 'scissors'] as const

const icons = {
    rock: new URL('@/assets/sign-rock.png', import.meta.url).href,
    paper: new URL('@/assets/sign-paper.png', import.meta.url).href,
    scissors: new URL('@/assets/sign-scissors.png', import.meta.url).href
}

const handleClick = (choice: typeof choices[number]) => {
    if (!props.isLocked) emit('play', choice)
}
</script>

<style lang="scss" scoped>
.az-dashboard {
    position: absolute;
    top: 120px;
    width: 242px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__rounds {
        position: relative;
        padding: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        background: rgba(175,175,168, 0.8);
        border-radius: 24px;
        border: 1px solid $color-milk-400;
    }

    &__round {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: $color-milk-400;

        &--draw {
            background: $color-milk-200;
        }

        &--rose {
            background: $color-rose-200;
        }

        &--mint {
            background: $color-mint-200;
        }
    }

    &__avatar {
        overflow: hidden;
        width: 48px;
        height: 48px;
        margin: -12px 0 -12px -12px;
        padding-top: 4px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background: $color-grey-200;
        border-radius: 50%;
    }

    &__status {
        position: absolute;
        right: 0;
        width: calc(100% - 48px);
        padding: 12px;
        background: rgba(175,175,168, 0.8);
        border-radius: 24px;
        color: white;
        text-align: center;
    }

    &__controls {
        width: 100%;
        padding: 12px 24px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        row-gap: 12px;
        column-gap: 24px;
        background: rgba(175,175,168, .85);
        border-radius: 24px;
        border: 1px solid $color-milk-400;

        &-title {
            width: 100%;
            font-size: 15px;
            font-weight: 400;
            line-height: 1rem;

            color: $color-grey-400;
            text-shadow: 1px 1px $color-grey-200;
            text-transform: uppercase;
            text-align: center;
        }
    }

    &__control {
        background: transparent;
        border: none;
        cursor: pointer;

        &--disabled {
            opacity: .35;
            pointer-events: none;
        }

        img {
            width: 40px;
            height: 80px;
            object-fit: contain;
        }
    }

    &__button {
        width: 100%;
        padding: 12px;
        background: $color-navy-200;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 500;
        text-transform: uppercase;
        transition: 0.5s;

        &:hover {
            background: $color-navy-300;
        }
    }

    &__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        font-size: 18px;
    }

    &__results-status {
        text-align: center;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
