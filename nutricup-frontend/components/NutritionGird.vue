<template>
    <div class=" grid grid-cols-3 mx-auto mb-12">
        <CircularProgress :main-text-size="'text-md'" :sub-text-size="'text-sm'" :goal="optimalProtein" :progress="props.nutritionSum?.protein" :unit="'g'" :name="'Protein'"/>
        <CircularProgress :main-text-size="'text-md'" :sub-text-size="'text-sm'" :goal="optimalFat" :progress="props.nutritionSum?.fat" :unit="'g'" :name="'Fat'"/>
        <CircularProgress :main-text-size="'text-md'" :sub-text-size="'text-sm'" :goal="optimalSugar" :progress="props.nutritionSum?.sugar" :unit="'g'" :name="'Carbs'"/>

    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
import type { NutritionSum } from '~/models/NutritionSum';

// Props
const props = defineProps<{
    nutritionSum: NutritionSum | undefined,
    caloriesGoal: number | undefined
}>()

const optimalProtein = ref<number>(0);
const optimalFat = ref<number>(0);
const optimalSugar = ref<number>(0);


// Functions

function countOptimalNutritions(){
    // From calories count optimal fats proteins and sugars
    const calories = props.caloriesGoal;

    if(calories){
        const proteinPercentage = 0.25; // 25% of calories
        const fatPercentage = 0.30; // 30% of calories
        const carbPercentage = 0.45; // 45% of calories

        optimalProtein.value = (calories * proteinPercentage) / 4; // grams
        optimalFat.value = (calories * fatPercentage) / 9; // grams
        optimalSugar.value = (calories * carbPercentage) / 4; // 
   
    }
}

function roundTo(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

watch(() => props.caloriesGoal, () => {
    countOptimalNutritions();
})

watch(() => props.nutritionSum, () => {
    countOptimalNutritions();
})

</script>