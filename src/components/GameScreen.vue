<template>
    <div class="az-game-screen">
        <div class="az-game-screen__heading">
            Vue.js Rock Paper Scissors
        </div>

        <div class="az-game-screen__subtitle">
            This is a classic hand game where you play against the computer in a match of 5&nbsp;rounds.<br />
            Rock beats scissors, scissors beats paper, and paper beats rock.
        </div>

        <div class="az-game-screen__paragraph">
            Choose your player from two characters:
        </div>

        <div class="az-game-screen__players">
            <div
                v-for="player in players"
                :key="player.id"
                class="az-game-screen__player"
            >
                <div class="az-welcome-screen__player-avatar">
                    <img :src="player.avatar" :alt="player.label" />
                </div>

                <button
                    class="az-game-screen__button"
                    :class="`az-game-screen__button--${player.id}`"
                    @click="$emit('setPlayer', player.id)"
                >
                    {{ player.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const players = [
    {
        id: 'rose',
        label: 'Rose Player',
        avatar: new URL('@/assets/rose.png', import.meta.url).href
    },
    {
        id: 'mint',
        label: 'Mint Player',
        avatar: new URL('@/assets/mint.png', import.meta.url).href
    }
] as const
</script>

<style lang="scss" scoped>
.az-game-screen {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    background: $color-milk-300;

    &__heading {
        font-size: 48px;
        font-weight: 700;
        line-height: 1em;
        text-shadow:
            0 4px 3px rgba(0,0,0, .4),
            0 8px 13px rgba(0,0,0, .1),
            0 18px 23px rgba(0,0,0, .1);
    }

    &__subtitle,
    &__paragraph {
        font-size: 20px;
        line-height: 30px;
        color: $color-grey-400;
        text-shadow: 1px 1px $color-grey-200;
        text-align: center;
    }

    &__subtitle {
        font-weight: 200;
    }

    &__paragraph {
        font-weight: 400;
    }

    &__players {
        display: flex;
        flex-direction: row;
        gap: 64px;
    }

    &__player {
        display: flex;
        flex-direction: column;
        gap: 24px;

        &-avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 240px;
            height: 240px;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    &__button {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 500;
        text-transform: uppercase;
        transition: 0.5s;

        &--rose {
            background: $color-rose-200;

            &:hover {
                background: $color-rose-300;
            }
        }

        &--mint {
            background: $color-mint-300;

            &:hover {
                background: $color-mint-400;
            }
        }
    }
}
</style>
