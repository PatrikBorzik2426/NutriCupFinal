<template>
    <RecipeComponent v-if="showRecipes" :current-date="chosenDate" @new-food-records="addRecipe" @close-menu="showRecipes=false"/>
    <NewIngredientComponent v-if="showNewIngredient" @close-menu="showNewIngredient=false"/>

    <div v-if="displaySearch" class="flex flex-col fixed top-[50%] left-1/2 h-[80vh] max-sm:w-[90vw] md:w-[30vw] transform -translate-x-1/2 -translate-y-1/2 bg-dark-950 rounded-lg px-4 pb-4 text-white text-center border-2 border-primary-500 overflow-y-scroll scrollbar-none z-[100]">     
        <div class="w-full sticky top-0 flex justify-between items-center mb-2 gap-2 px-2 py-4 bg-dark-950 z-[200]">
            <div class="flex gap-2 border-2 border-primary-500 text-white rounded-lg px-2">
                <input @input="startSearch()" v-model="formChoice" type="text" id="choice" name="choice" autocomplete="off" class="w-40 h-10 px-2 bg-transparent  " />
                <img :src="searchIcon">
            </div>
            <p @click="displaySearch=false" class="font-medium text-2xl cursor-pointer hover:font-bold">✕</p>
        </div>
        <div class="flex justify-between w-full px-2 mr-auto">
            <p>Meno</p>
            <p>Kalórie</p>
        </div>
        <div v-if="allSearchedUpFoods.length > 0" v-for="(searchRecord, index) in allSearchedUpFoods" :key="index" class="flex flex-col gap-2 px-2 py-4 w-full justify-between text-left text-white border-2 border-primary-500 rounded-lg z-[10]">
            <div class="flex justify-between w-full items-center text-white">
                <p>{{ searchRecord.name.slice(0,24) }} {{ searchRecord.name.length>24 ? '...' : '' }}</p>
                <p class=" text-sm opacity-50 ">{{ roundTo(searchRecord.calories,2) }} kcal / 1g</p>
            </div>
            <div>
                <form @submit.prevent="addFood(searchRecord)" class="flex gap-2 items-center justify-between">
                    <div class="flex gap-2">
                        <button type="submit" class="w-fit h-10 px-2 bg-primary-500 text-white rounded-lg">Pridať</button>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label for="quantity">Množstvo:</label>
                        <input v-model="foodAmountInput" type="number" id="quantity" name="quantity" class="w-20 h-10 px-2 rounded-lg bg-transparent border-2 border-primary-500 text-white" />
                        <span>g</span>
                    </div>
                </form>
            </div>
        </div>
        <div v-else class="flex justify-center items-center w-full h-full">
            <p class=" text-white">Žiadne výsledky</p>
        </div>
    </div>

    <div class="md:w-1/2 mb-4 md:h-full">
        <div class="w-full bg-primary-500 rounded-t-xl py-1  border-x-2 border-primary-500">
            <h2 class=" font-extrabold uppercase">Dnešná Papanica</h2>
        </div>

        
        <div class=" relative border-x-2 border-primary-500 h-full pb-4 max-h-[80vh] overflow-y-scroll overflow-x-hidden scrollbar-none z-[50]">
            <div class="sticky top-0 bg-dark-950 py-4 flex justify-center items-center gap-2">

                <div class="grid grid-cols-2 gap-2">
                    <button @click="activeFood = true" type="button" class="w-10 h-10 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all"
                    :class="{ 'bg-primary-500': activeFood, 'bg-transparent': !activeFood }">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="hover:fill-white"
                    :class="{ 'fill-white': activeFood, 'fill-primary-500': !activeFood }"
                    ><path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z"/></svg>
                    </button>
                    
                    <button @click="activeFood = false, displaySearch = false" type="button" class="w-10 h-10 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all"
                    :class="{ 'bg-primary-500': !activeFood, 'bg-transparent': activeFood }">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="hover:fill-white"
                    :class="{ 'fill-white': !activeFood, 'fill-primary-500': activeFood }"
                    ><path d="M160-120v-80h640v80H160Zm160-160q-66 0-113-47t-47-113v-400h640q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm400-360h80v-120h-80v120Z"/></svg>
                    </button>
                    
                    <button @click="showRecipes=true" type="button" class="w-10 h-10 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class=" fill-primary-500 hover:fill-white"
                    ><path d="M200-160q-50 0-85-35t-35-85v-200h561q5-34 27-59.5t54-36.5l185-62 25 76-185 62q-12 4-19.5 14.5T720-462v182q0 50-35 85t-85 35H200Zm-23-400q14-36 4.5-64T149-680q-33-40-43.5-75.5T102-840h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Z"/></svg>
                    </button>

                    <button @click="showNewIngredient=true" type="button" class="w-10 h-10 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class=" fill-primary-500 hover:fill-white"
                    ><path d="M480-120q-117 0-198.5-81.5T200-400q0-77 25.5-155t66-141.5Q332-760 382-800t98-40q49 0 98.5 40t90 103.5Q709-633 734.5-555T760-400q0 117-81.5 198.5T480-120Zm40-120q17 0 28.5-11.5T560-280q0-17-11.5-28.5T520-320q-50 0-85-35t-35-85q0-17-11.5-28.5T360-480q-17 0-28.5 11.5T320-440q0 83 58.5 141.5T520-240Z"/></svg>
                    </button>

                </div>

                <input @input="startSearch()" v-model="formChoice" type="text" id="choice" name="choice" autocomplete="off" class="w-40 h-10 px-2 rounded-lg bg-transparent border-2 border-primary-500 text-white" />
                        
                <button @click="addWater()" v-if="!activeFood" type="button" class="w-10 h-10 flex justify-center items-center border-2 border-primary-500 rounded-lg hover:bg-primary-500 hover:font-bold transition-all">
                    +
                </button>

            </div>

            <div v-if="activeFood" v-for="(record,index) in allDailyFoods" :key="index" class="flex">
                <FoodRecordComponent :record="record" :current-date="props.chosenDate" @change-to-records="modifyFoodAmount" />
            </div>
            <div v-else="!activeFood" v-for="(record,index2) in allDailyWater" :key="index2" class="flex">
                <WaterRecordComponent v-if="record.amount>0" :record="record" @updateWaterAmount="modifyWaterAmount"/>
            </div>
        </div>
        <div class="w-full bg-primary-500 rounded-b-xl py-1  border-x-2 border-primary-500">
        </div>

    </div>
</template>
<script setup lang="ts">
import type { Food } from '~/models/Food';
import type { FoodRecord } from '~/models/FoodRecord';
import { callAxios } from '~/service/callAxios';
import { defineEmits, defineProps } from 'vue';
import type { WaterRecord } from '~/models/WaterRecord';
import type { RecipeDetail } from '~/models/RecipeDetail';
import NewIngredientComponent from './NewIngredientComponent.vue';

// Images
import searchIcon from '~/assets/img/search.svg';

// Emits
const emit = defineEmits(['addFood', 'addWater']);

// Props
const props = defineProps<{
    chosenDate: Date 
}>();

// Styles
const activeFood= ref<boolean>(true)

// Switches
const showRecipes = ref<boolean>(false);
const showNewIngredient = ref<boolean>(false);

// Inputs
const formChoice = ref<string>('');
const allSearchedUpFoods = ref<Food[]>([]);
const displaySearch = ref<boolean>(false);
const foodAmountInput = ref<number>(0);

const allDailyFoods = ref<FoodRecord[]>([]);
const allDailyWater = ref<WaterRecord[]>([]);

const chosenDate = ref<Date>(new Date());

//Timers
let debounceTimer: NodeJS.Timeout | null = null;

// Methods

function roundTo(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

async function addWater(){
    const amount = parseInt(formChoice.value);

    if (amount <= 0) return;
    if (isNaN(amount)) return;


    await callAxios('unicupbackend/records/addwater', 'POST', {
        amount: amount,
        date: chosenDate.value
    }).then((response : any) => {
        console.log(response.data)

        const newRecord = response.data;

        allDailyWater.value.push(newRecord);

        emit('addWater', amount);
        formChoice.value = '';

    }).catch((error) => {
        console.log(error)
    });
}

function addRecipe(recipeDetails: RecipeDetail[]){
    recipeDetails.forEach((recipeDetail) => {

        let newId = 0

        const lastFoodRecord = allDailyFoods.value[allDailyFoods.value.length - 1];

        if (lastFoodRecord){
            newId = lastFoodRecord.id;
        }

        const newFoodRecord : FoodRecord = {
            foodData: recipeDetail.FoodData,
            amount: recipeDetail.amount,
            date: chosenDate.value,
            id: newId,
            recipeId: recipeDetail.recipeId
        }

        allDailyFoods.value.push(newFoodRecord);

        emit('addFood', allDailyFoods.value);
    })
}

async function addFood(searchRecord: Food){
    const amount = foodAmountInput.value;
    if (amount <= 0) return;
    if (isNaN(amount)) return;


    await callAxios('unicupbackend/records/addfood', 'POST', {
        foodId: searchRecord.id,
        amount: amount,
        date: chosenDate.value
    }).then((response : any) => {
        console.log(response.data)

        const newRecord = response.data;
        allDailyFoods.value.push(newRecord);    
        
        displaySearch.value = false;
        foodAmountInput.value = 0;
        
        emit('addFood', allDailyFoods.value);

        formChoice.value = '';

    }).catch((error) => {
        console.log(error)
    });
}

async function modifyWaterAmount(difference: number, recordId?: number){
    console.log("Modification of water: ", difference, recordId)
    const index = allDailyWater.value.findIndex((record) => record.id === recordId);

    if(recordId && difference == 0){
        // Get the value of the record
        const recordAmount = allDailyWater.value[index].amount;

        // Remove the record
        allDailyWater.value.forEach((record, index) => {
            if(record.id === recordId){
                allDailyWater.value[index].amount = 0;
            }
        })
        
        if(recordAmount){
            emit('addWater',-recordAmount);
        }

    }else{
        allDailyWater.value[index].amount += difference;
        emit('addWater',difference);
    }
}

function modifyFoodAmount( removedFoodRecord: FoodRecord){
    console.log("Modification of food: ", removedFoodRecord)

    if (removedFoodRecord.amount <= 0){
   
        const index = allDailyFoods.value.findIndex((record) => record.id === removedFoodRecord.id);
        
        allDailyFoods.value.splice(index, 1);
        
        emit('addFood', allDailyFoods.value);
    }else{

        emit('addFood', allDailyFoods.value);
    }
}

async function startSearch(){

    if(!activeFood.value){
    }else{
       
        if(debounceTimer){
            clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(async() => {
            await callAxios('unicupbackend/records/listfood', 'POST', {
                name: formChoice.value
            }).then((response : any) => {
                console.log(response.data)
                displaySearch.value = true;
            allSearchedUpFoods.value = response.data;
            }).catch((error) => {
                console.log(error)
            });
        }, 500);    
    }
}

async function loadFoods() {
    await callAxios('unicupbackend/records/getdailyfoodrecords', 'POST', {
        date: chosenDate.value
    }).then((response : any) => {
        allDailyFoods.value = response.data;
    }).catch((error) => {
        console.log(error)
    });
}

async function loadWater() {
    await callAxios('unicupbackend/records/getdailywaterrecords', 'POST', {
        date: chosenDate.value
    }).then((response : any) => {
        allDailyWater.value = response.data;
    }).catch((error) => {
        console.log(error)
    });
}
    
onBeforeMount(async() => {
    await loadFoods();
    await loadWater();
})

watch(()=>props.chosenDate, async() => {
    chosenDate.value = props.chosenDate;
    await loadFoods();
    await loadWater();
})


</script>