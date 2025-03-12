<template>
<div class="grid grid-cols-9 gap-2 w-full p-4 text-left">
    <div class=" flex col-span-4">
        <p class="hover:font-bold hover:cursor-pointer"
        :style="style"
        > {{ editedRecord.foodData.name.slice(0,24) }} {{ editedRecord.foodData.name.length>24 ? '...' : '' }}</p>
    </div>
    <div class=" flex gap-2 col-span-2 appearance-none items-center">
        <input @blur="foodChange" v-model="editedRecord.amount" type='number' class=" w-full text-white bg-transparent text-sm text-right appearance-none focus:appearance-none">
        <span>g</span>

    </div> 
    <div class=" flex gap-2 col-span-3 items-center">
        <p class="w-full text-white bg-transparent text-sm text-right">{{ roundTo(editedRecord.amount * editedRecord.foodData.calories,2) }} kcal</p>
    </div>
</div>
</template>
<script setup lang="ts">

import { defineProps } from 'vue';
import type { FoodRecord } from '~/models/FoodRecord';
import { callAxios } from '~/service/callAxios';

// Props
const props = defineProps<{
    record: FoodRecord,
    currentDate: Date
}>()

// Emits

const emit = defineEmits(['changeToRecords']);

// Style
const style = ref<string>('')

// Data
const editedRecord = ref<FoodRecord>({...props.record})
const originalAmount = props.record.amount


// Methods
function roundTo(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

async function foodChange(){

    console.log(editedRecord.value)
    if (editedRecord.value.amount === 0){
        await callAxios('unicupbackend/records/deletefoodrecord', 'POST', {
            id: editedRecord.value.id,
            date: props.currentDate
        }).then((response : any) => {
            console.log(response.data)

            editedRecord.value.amount = -originalAmount
            emit('changeToRecords', editedRecord.value)
        }).catch((error) => {
            console.log(error)
        });
    }else{
        await callAxios('unicupbackend/records/updateFoodRecord', 'PUT', {
            id: editedRecord.value.id,
            amount: editedRecord.value.amount,
            date: props.currentDate
        }).then((response : any) => {
            console.log(response.data)            
            emit('changeToRecords', editedRecord.value)
        }).catch((error) => {
            console.log(error)
        });
    }
}

function intToHexColor(input: number): string {
  // Ensure the input is non-negative
  input = Math.abs(input);

  // Use a deterministic hashing approach to spread values across the RGB space
  const r = (input * 37) % 256; // Red component
  const g = (input * 57) % 256; // Green component
  const b = (input * 97) % 256; // Blue component

  // Convert to a hex color string
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return hex;
}

onMounted(() => {
    console.log(props.record)

    if (props.record.recipeId !== -1){
        style.value = `border-left: 4px solid ${intToHexColor(props.record.recipeId)} !important; padding-left: 0.5rem;`
    }
})


watch(() => props.record, (newVal) => {
    editedRecord.value = newVal

    editedRecord.value.amount = roundTo(editedRecord.value.amount, 2)
})

</script>