<template>  
<main class=" min-h-screen md:h-screen md:w-[80vw] max-sm:w-screen bg-dark-950 font-manrope p-2 text-white text-center font-medium">
    <h1 class=" text-xl my-4"> NutriCup ťa opäť rád vidí <span class=" text-primary-500 font-bold">{{ currentUser?.login }}</span> ! </h1>
    <div class="h-fit md:flex">
        <div class=" md:w-1/2">    
            <MenuComponent @currentDate="setCurrentDate" />
            <NavigationProgress :waterGoal="currentUser?.waterGoal" :waterProgress="currentWater" :foodGoal="currentUser?.caloriesGoal" :foodProgress="nutritionSum"/> 
        </div>
        
        <FoodManagementComponent @addWater="addCurrentWater" @addFood="addCurrentFood" :chosenDate="activeDate"/>
    </div>

</main>
</template>

<script setup lang="ts">
import { callAxios } from '~/service/callAxios';
import type { User } from '~/models/User';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { NutritionSum } from '~/models/NutritionSum';
import type { FoodRecord } from '~/models/FoodRecord';
import RecipeComponent from '~/components/RecipeComponent.vue';

// User data
const currentUser = ref<User | null>(null);
const activeDate = ref<Date>(new Date());

// Router
const router = useRouter();

// Values to track
const currentWater = ref<number>(100);
const nutritionSum = ref<NutritionSum | undefined>();

// Methods

function addCurrentWater(amount: number){
    currentWater.value += amount;
}

async function setCurrentDate(date: string){
    const newDate = new Date(date);
    activeDate.value = newDate;
}

function addCurrentFood(records: FoodRecord[]){
    if (!nutritionSum.value) return;

    nutritionSum.value = {
        fiber : 0,
        protein : 0,
        fat : 0,
        sugar : 0,
        calcium : 0,
        iron : 0,
        magnesium : 0,
        sodium : 0,
        calories : 0
    }

    records.forEach((record : FoodRecord) => { 
        if (nutritionSum.value === undefined) return;  

        nutritionSum.value.fiber += record.foodData.fiber * record.amount
        nutritionSum.value.protein += record.foodData.protein/100 * record.amount
        nutritionSum.value.fat += record.foodData.fat/100 * record.amount
        nutritionSum.value.sugar += record.foodData.sugar/100 * record.amount
        nutritionSum.value.calcium += record.foodData.calcium * record.amount
        nutritionSum.value.iron += record.foodData.iron * record.amount
        nutritionSum.value.magnesium += record.foodData.magnesium * record.amount
        nutritionSum.value.sodium += record.foodData.sodium * record.amount
        nutritionSum.value.calories += record.foodData.calories * record.amount
    });
}
    
    async function validateUser(){
    await callAxios('unicupbackend/auth/validate', 'POST', {
    }).then((response : any) => {   
        currentUser.value = response.data;

        if(response.data === undefined || response.data === null){
            router.push('/');
        }

        localStorage.setItem('user', JSON.stringify(response.data));
    }).catch((error) => {
        console.log(error)
        router.push('/');
    });
}

async function  getCurrentWaterAmount() {
    await callAxios('unicupbackend/records/waterAmountDaily', 'POST', {
        date: activeDate.value
    }).then((response : any) => {
        currentWater.value = response.data._sum.amount;
    }).catch((error) => {
        console.log(error)
    });
}

async function  getNutritionSum() {
    await callAxios('unicupbackend/records/getnutritionsum', 'POST', {
        date: activeDate.value
    }).then((response : any) => {
        nutritionSum.value = response.data;
    }).catch((error) => {
        console.log(error)
    });    
}

onBeforeMount(async() => {
   await validateUser();
   await getCurrentWaterAmount();
   await getNutritionSum();
})

watch(activeDate, async() => {
    await getCurrentWaterAmount();
    await getNutritionSum();
})

</script>