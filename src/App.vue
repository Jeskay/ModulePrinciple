<script setup lang="ts">
import {Reader} from './algo'
import go from 'gojs'
import {onMounted, ref} from 'vue'
import DiagramVue from './components/Diagram.vue';
import {CalculateReliability, WriteGraph} from './algo3'

let formulaText = ref("")
let valuesText = ref("")
let reliability = ref("")
let modelFormula = ref()
let ports: go.ObjectData[] = []
let connections: go.ObjectData[] = []

onMounted(() => {
    modelFormula.value = new go.GraphLinksModel(ports, connections)
})

  function onClick() {
    const reader = new Reader(formulaText.value)
    const result = reader.ReadNodes()
    console.log(result)
    if(!result)
      return
    const vals = values()
    console.log(vals, valuesText.value)
    reliability.value = CalculateReliability(result, vals).toString()
  }

  function updateGraph() {
    const {group, connections} = WriteGraph(formulaText.value)
    console.log(group, connections)
    modelFormula.value = new go.GraphLinksModel(group, connections)
  }

  function values(): Map<string, number> {
    const result = new Map<string, number>();
    let buffer = ""
    let value = ""
    let state = 0
    for(let i = 0; i < valuesText.value.length; i++) {
      const symbol = valuesText.value[i]
      if(symbol == ' ') {
        result.set(buffer, Number.parseInt(value))
        state = 0
        buffer = ""
        value = ""
        continue
      }
      if (symbol == '='){
        state = 1
        continue
      }
      if(state){
        if (symbol >= '0' && symbol <= '9')
          value += symbol
        else
          throw new Error("Invalid input format")
      } else
        buffer += symbol
    }
    if(buffer.length > 0) {
      result.set(buffer, Number.parseInt(value))
    }
    return result;
  }
</script>

<template>
  <div>
    <input v-model="formulaText" @change="updateGraph">
    <input v-model="valuesText">
    <button @click="onClick">
      Calculate
    </button>
  </div>
  <DiagramVue :model="modelFormula"></DiagramVue>
  <h2 v-if="reliability.length > 0">Reliability: {{ reliability }}</h2>
</template>

<style scoped>
</style>
