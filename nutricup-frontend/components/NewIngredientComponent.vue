<template>
<div class="flex flex-col fixed top-[50%] left-1/2 h-fit max-sm:w-[90vw] transform -translate-x-1/2 -translate-y-1/2 bg-dark-950 rounded-lg p-4 text-white text-center border-2 border-primary-500 z-[100]">
    <div class="w-full flex justify-end cursor-pointer hover:font-bold">
        <p @click="closeMenu">✕</p>
    </div>
    <div>
        <p class="text-sm animate-bounce text-center mb-4">Všetky hodnoty uvádzame v <span class="font-bold text-primary-500 animate-jump animate-infinite">gramoch</span>!</p>
    </div>
    <div class="sticky top-2 w-full flex mb-4">
        <div class="grid gird-col-2 w-full flex-col justify-start text-left gap-2">
            
            <div class=" col-span-2 mb-4">
                <label for="name" class="text-sm">Názov novej ingrediencie:</label>
                <input autocomplete="off" v-model="formData.name" type="text" id="name" name="name" class="w-full h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>

              <!-- Nutritional Values -->
            <div class="flex flex-col gap-2">
                <label for="protein" class="text-sm">Proteíny:</label>
                <input autocomplete="off" v-model="formData.protein" type="number" id="protein" name="protein" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="fat" class="text-sm">Tuky:</label>
                <input autocomplete="off" v-model="formData.fat" type="number" id="fat" name="fat" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="fiber" class="text-sm">Vláknina:</label>
                <input autocomplete="off" v-model="formData.fiber" type="number" id="fiber" name="fiber" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="sugar" class="text-sm">Cukor:</label>
                <input autocomplete="off" v-model="formData.sugar" type="number" id="sugar" name="sugar" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="cholesterol" class="text-sm">Cholesterol:</label>
                <input autocomplete="off" v-model="formData.cholesterol" type="number" id="cholesterol" name="cholesterol" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>

            <!-- Minerals -->
            <div class="flex flex-col gap-2">
                <label for="calcium" class="text-sm">Vápnik:</label>
                <input autocomplete="off" v-model="formData.calcium" type="number" id="calcium" name="calcium" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            
            <div class="flex flex-col gap-2">
                <label for="iron" class="text-sm">Železo:</label>
                <input autocomplete="off" v-model="formData.iron" type="number" id="iron" name="iron" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="magnesium" class="text-sm">Horčík:</label>
                <input autocomplete="off" v-model="formData.magnesium" type="number" id="magnesium" name="magnesium" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="sodium" class="text-sm">Sodík:</label>
                <input autocomplete="off" v-model="formData.sodium" type="number" id="sodium" name="sodium" class="w-20 h-8 px-2 text-sm rounded-lg bg-transparent border-2 border-primary-500 text-white" />
            </div>


            <button @click="createIngredient" type="button" class="w-full col-start-1 col-span-2 h-8 mt-4 bg-primary-500 rounded-lg text-white text-sm">Pridať recept</button>

        </div>
    </div>
    
</div>
</template>
<script setup lang="ts">
import { callAxios } from '~/service/callAxios';

// Emits

const emit = defineEmits(['close-menu']);

// Form data

const formData = reactive({
    calories: 1,
    protein: 1,
    fat: 1,
    fiber: 1,
    sugar: 1,
    cholesterol: 1,
    calcium: 1,
    iron: 1,
    magnesium: 1,
    sodium: 1,
    name: ''
})

async function createIngredient(){
    // Calculate calories from protein, fat and sugar
    formData.calories = (4 * formData.protein) + (9 * formData.fat) + (4 * formData.sugar);

    await callAxios('unicupbackend/recipe/addIngredient', 'POST', {
            ingredient: formData
        }).then((response : any) => {
            console.log(response)
            closeMenu();
        }).catch((error) => {
            console.log(error)
        });
}

function closeMenu(){
    emit('close-menu');
}

</script>