<template>
    <div class="md:w-full  h-fit">
        <div class=" md:flex md:flex-col md:px-20">
            <div class="flex justify-center items-center gap-4 md:w-full">
                <div class="text-positive-500">
                    <CircularProgress :main-text-size="'text-2xl'" :sub-text-size="'text-md'" :goal="caloriesGoalHolder" :progress="props.foodProgress?.calories" :unit="'kcal'" :name="'Kalórie'" @update-calories-goal="updateCaloriesGoal"/>
                </div>
                <div class=" text-blue-400">
                    <CircularProgress :main-text-size="'text-2xl'" :sub-text-size="'text-md'" :goal="waterGoalHolder" :progress="props.waterProgress" :unit="'ml'" :name="'Voda'" @update-water-goal="updateWaterGoal"/>
                </div>
            </div>
            
            <div class=" md:w-full text-orange-500">
                <NutritionGird :caloriesGoal="caloriesGoalHolder" :nutritionSum="props.foodProgress"/>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { NutritionSum } from '~/models/NutritionSum';

// Props
const props = defineProps<{
    waterGoal: number | undefined,
    waterProgress: number | undefined,
    foodGoal: number | undefined,
    foodProgress: NutritionSum | undefined,
}>()

const waterGoalHolder = ref<number | undefined>(props.waterGoal);
const caloriesGoalHolder = ref<number | undefined>(props.foodGoal);

function updateWaterGoal(newWaterGoal: number | undefined){
    console.log(newWaterGoal)
    waterGoalHolder.value = newWaterGoal;
}

function updateCaloriesGoal(newCaloriesGoal: number | undefined){
    console.log(newCaloriesGoal)
    caloriesGoalHolder.value = newCaloriesGoal;
}

watch(() => props.waterGoal, (newVal) => {
    waterGoalHolder.value = newVal
})

watch(() => props.foodGoal, (newVal) => {
    caloriesGoalHolder.value = newVal
})

</script>