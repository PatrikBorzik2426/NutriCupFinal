<template>
<div class="flex flex-col fixed top-[50%] left-1/2 h-[80vh] max-sm:w-[90vw] transform -translate-x-1/2 -translate-y-1/2 bg-dark-950 rounded-lg p-4 text-white text-center border-2 border-primary-500 z-[100]">
    <div class="w-full flex justify-end cursor-pointer hover:font-bold">
        <p @click="closeMenu">✕</p>
    </div>
    <div class="sticky top-2 w-full flex mb-4">
        <div class="flex w-full flex-col justify-start text-left gap-2">
            <label for="name" class="text-sm">Názov receptu:</label>
            <input v-model="recipeName" type="text" id="name" name="name" class="w-full h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            
            <label for="ingredients" class="text-sm">Ingrediencie receptu:</label>
            <div class="flex gap-2 items-center w-full h-fit min-h-8 p-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white">
                <div class="relative w-full grid grid-cols-3 gap-1">
                    <input @input="listIngredients" v-model="ingredientName" autocomplete="off" type="text" id="ingredients" name="ingredients" class="w-full bg-transparent px-1" />
                    
                    <div @click="removeIngredient(ingredient)" v-for="(ingredient,index) in chosenIngredients" :key="index" class="flex justify-center items-center gap-1 bg-primary-500 rounded-full ">
                        <p class="text-[0.75rem]">{{ ingredient.name.slice(0,10) }}</p>
                        <p>✕</p>
                    </div>

                    <div v-if="ingredientName !== ''" class=" flex flex-col absolute top-[160%] max-h-[35vh] overflow-y-scroll scrollbar-none gap-2 px-2 py-1 max-sm:w-[60vw] md:w-[30vh] rounded-md items-center bg-dark-950 border-2 border-primary-500">
                        <p @click="addIngredientToChosen(ingredient)" v-for="(ingredient,index) in ingredients" :key="index" class="text-center px-2 py-1 border-2 border-primary-500 rounded-md w-full hover:bg-primary-500 hover:font-bold hover:cursor-pointer">
                            {{ ingredient.name }}
                        </p>
                    </div>
                </div>
            </div>

            <button @click="createRecipe" class="w-full h-8 bg-primary-500 rounded-lg text-white text-sm">Pridať recept</button>

        </div>
    </div>
    <div class=" flex flex-col w-full gap-2">
        <div class="flex w-1/2 h-8 border-2 border-primary-500 rounded-lg bg-transparent text-white">
            <input @input="searchRecipe" v-model="search" search="search" class="w-full text-sm px-1 h-full bg-transparent" />
            <img :src="searchSvg" alt="search" class="h-full cursor-pointer p-1" />
        </div>
        <div class="w-full flex flex-col gap-2 max-h-[45vh] overflow-y-scroll scrollbar-none">
            <div v-for="(recipeSample,index) in searchResults" :key="index" class="flex flex-col justify-between items-center gap-2 w-full h-fit px-2 text-left py-1 border-2 border-primary-500 rounded-lg bg-transparent">
                <div @click="changeArrow(recipeSample), retrieveIngredientsData(recipeSample)" class="flex w-full justify-between items-center">
                    <div class="flex flex-col">
                        <p>{{ recipeSample.name }}</p>
                        <p class="text-[0.75rem] text-white/50 ">Created by: <span class="text-white">{{ recipeSample.creator }}</span></p>
                    </div>
                    <img :src="recipeSample.arrow" alt="arrow" class="h-[50%] aspect-square cursor-pointer" />
                </div>
                <div v-if="recipeSample.recipeDetail && recipeSample.arrow === arrowDown" class="grid text-[0.75] max-sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                    <div v-for="(recipeDetail,index) in recipeSample.recipeDetail" class=" flex items-center gap-2 text-sm">
                        <label name="">{{ recipeDetail.FoodData.name.slice(0,18) }} {{ recipeDetail.FoodData.name.length>18 ? '...' : '' }}</label>
                        <input v-model="recipeDetail.amount" type="number" name="" id="" class="w-[30%] h-fit p-1 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
                        <p>g</p>
                    </div>
                    <button @click="createFoodRecords(recipeSample)" type="button" class="w-full col-start-1 h-8 bg-primary-500 rounded-lg text-white text-sm">Pridať recept</button>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script setup lang="ts">
import type { Food } from '~/models/Food';
import { callAxios } from '~/service/callAxios';
import type { RecipeSearch } from '~/models/RecipeSearch';

import searchSvg from '~/assets/img/search.svg'
import arrowUp from '~/assets/img/arrow_up.svg'
import arrowDown from '~/assets/img/arrow_down.svg'

// Props
const props = defineProps<{
    currentDate: Date | undefined,
}>();

// Emits
const emit = defineEmits(['new-food-records','close-menu']);

// Array of ingredients
const ingredients = ref<Food[]>([])
const chosenIngredients = ref<Food[]>([])
const searchResults = ref<RecipeSearch[]>([])

// Inputs
const ingredientName = ref<string>('');  
const recipeName = ref<string>(''); 
const search = ref<string>('');

// Timer
let debounceTimer: NodeJS.Timeout | null = null;

// Icons
const arrowIcon = ref<string>(arrowDown)

// Methods

function closeMenu(){
    emit('close-menu');
}

function addIngredientToChosen(ingredient: Food){
    chosenIngredients.value.push(ingredient);
    ingredientName.value = '';
    ingredients.value = [];
}

function removeIngredient(ingredient: Food){
    chosenIngredients.value = chosenIngredients.value.filter((item) => item !== ingredient);
}

function changeArrow(recipeSample: RecipeSearch){
    if(recipeSample.arrow === arrowDown){
        recipeSample.arrow = arrowUp;
    } else {
        recipeSample.arrow = arrowDown;
    }
}

async function listIngredients(){
    if(ingredientName.value === ''){
        return;
    }

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async() => {        
        await callAxios('unicupbackend/records/listfood', 'POST', {
            name: ingredientName.value
        }).then((response : any) => {
            ingredients.value = response.data;
        }).catch((error) => {
            console.log(error)
        });
    }, 500);
    }

async function createRecipe(){
    if(recipeName.value === '' || chosenIngredients.value.length < 2){
        return;
    }

    await callAxios('unicupbackend/recipe/create', 'POST', {
        name: recipeName.value,
        ingredients: chosenIngredients.value.map((item) => item.id)
    }).then((response : any) => {
        console.log(response)
        recipeName.value = '';
        chosenIngredients.value = [];
    }).catch((error) => {
        console.log(error)
    });
}  

async function createFoodRecords(recipeSample: RecipeSearch){
    if (!recipeSample.recipeDetail) {
        return;
    }

    await callAxios('unicupbackend/recipe/createdailyrecords', 'POST', {
        date: new Date(),
        ingredients: recipeSample.recipeDetail.map((item) => {
            return {
                foodId: item.FoodData.id,
                amount: item.amount,
                date : props.currentDate,
                recipeId: recipeSample.id
            }
        })
    }).then((response : any) => {
        console.log(response)

        recipeSample.arrow = arrowUp;
        search.value = '';
        searchResults.value = [];
        emit('new-food-records', recipeSample.recipeDetail);
        emit('close-menu');
        
    }).catch((error) => {
        console.log(error)
    });
}

async function retrieveIngredientsData(recipeSample: RecipeSearch){
    if (recipeSample.recipeDetail) {
        return;
    }

    await callAxios('unicupbackend/recipe/getingredients', 'POST', {
        recipeId: recipeSample.id
    }).then((response : any) => {
        recipeSample.recipeDetail = response.data;
    }).catch((error) => {
        console.log(error)
    });
}

async function searchRecipe(){
    if (search.value.length < 2) {
        return;
    }

    if(debounceTimer){
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async() => {
        await callAxios('unicupbackend/recipe/search', 'POST', {
            name: search.value
        }).then((response : any) => {
            searchResults.value = response.data;

            searchResults.value.forEach((item) => {
                item.arrow = arrowUp;
            });

            console.log(response)
        }).catch((error) => {
            console.log(error)
        });
    }, 500);
}

</script>