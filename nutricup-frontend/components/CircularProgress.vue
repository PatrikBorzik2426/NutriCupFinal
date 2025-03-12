<template>

<div class="relative h-fit w-full p-2">
    <svg class="size-full -rotate-90" viewBox="0 0 36 36" >
        <!-- Background Circle -->
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
        <!-- Progress Circle -->
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current"  stroke-width="3"  stroke-linecap="round"
        :stroke-dasharray=100 :stroke-dashoffset="setDashOffset(progress, goal)"
        ></circle>
    </svg>

    <!-- Percentage Text -->
    <div class=" flex flex-col w-full absolute top-[45%] start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span class="text-center font-bold "
        :class="mainTextSize"
        >{{ roundTo(progress,2) }}</span>

        <span v-if="(unit !== 'ml') && (unit !== 'kcal') " class="text-center font-light opacity-60 "
        :class="subTextSize"
        >{{ roundTo(goal,2) }} {{ unit }}</span>

        <div v-else class="flex justify-center items-center">
            <input @blur="updateGoal" v-model="goal" type='number' class="w-[30%] font-light opacity-60 bg-transparent text-sm text-center appearance-none">
            <span class="text-left font-light opacity-60" :class="subTextSize">{{ unit }}</span>
        </div>

    </div>
    <p>{{ props.name }}</p>
</div>



</template>
<script setup lang="ts">
import {callAxios} from '~/service/callAxios';

//Emits

const emits = defineEmits(['updateCaloriesGoal','updateWaterGoal']);


// Props
const props = defineProps<{
    progress: number | undefined;
    goal: number | undefined;
    mainTextSize: string;
    subTextSize: string;
    unit: string;
    name: string;
}>()

const progress = ref<number | undefined>(0);
const goal = ref<number | undefined>(props.goal)
const unit = ref<string>(props.unit);

// Styling
const mainTextSize = ref<string>(props.mainTextSize);
const subTextSize = ref<string>(props.subTextSize);

function roundTo(num: number |undefined, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    if(num){
        return Math.round(num * factor) / factor;
    }

    return 0;
}

function setDashOffset(progress: number | undefined, goal: number | undefined): number {
    if (!(progress && goal)){
        return 100;
    }else{
        if(progress > goal){
            return 0;
        }else{
            return 100 - (progress / goal) * 100;
        }
    }
}

async function updateGoal(){
    if (unit.value === 'ml'){
        await callAxios('unicupbackend/records/changeWaterGoal', 'POST',{
            newGoal: goal.value
        })

        emits('updateWaterGoal', goal.value);
    }else{
        await callAxios('unicupbackend/records/changeCaloriesGoal', 'POST',{
            newGoal: goal.value
        })

        emits('updateCaloriesGoal', goal.value);
    }
}

watch(() => props.progress, (newVal) => {
    progress.value = newVal;
})

watch(() => props.goal, (newVal) => {
    goal.value = newVal;
})


</script>