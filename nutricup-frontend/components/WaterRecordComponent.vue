<template>
<div class="grid grid-cols-2 gap-2 w-full p-4 text-left">
    <div class=" flex">
        <p class="hover:font-bold hover:cursor-pointer">ID: {{ editedRecord.id }}</p>
    </div>
    <div class=" flex gap-2 appearance-none items-center">
        <input @change="applyChange" v-model="editedRecord.amount" type='number' class=" w-[80%] text-white bg-transparent text-sm text-right appearance-none focus:appearance-none">
        <span>ml</span>

    </div> 
</div>
</template>
<script setup lang="ts">

import { defineProps } from 'vue';
import type { WaterRecord } from '~/models/WaterRecord';
import { callAxios } from '~/service/callAxios';

// Emits

const emits = defineEmits(['updateWaterAmount']);

// Props
const props = defineProps<{
    record: WaterRecord
}>()

// Data
const editedRecord = ref<WaterRecord>({ ...props.record })


async function applyChange(){
    const difference = props.record.amount - editedRecord.value.amount

    console.log(editedRecord.value.date, difference)

    if(difference === 0){
        return;
    }else if(difference === props.record.amount){
        emits('updateWaterAmount',0,editedRecord.value.id)
    }else{
        if (difference > 0){
            emits('updateWaterAmount',-difference,editedRecord.value.id)
        }else{
            emits('updateWaterAmount',-difference,editedRecord.value.id)
        }
    }

    await callAxios('unicupbackend/records/updateWaterRecord','PUT',{
        id: editedRecord.value.id,
        amount: editedRecord.value.amount,
        date: editedRecord.value.date
    })
}


</script>