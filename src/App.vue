<script setup lang="ts">
import {Reader} from './algo'
import go from 'gojs'
import {onMounted, ref} from 'vue'
import DiagramVue from './components/Diagram.vue';
import {WriteGraph} from './algo3'

let formulaText = ref("")
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
    modelFormula.value = new go.GraphLinksModel(ports, connections)
  }

  function updateGraph() {
    const {group, connections} = WriteGraph(formulaText.value)
    console.log(group, connections)
    modelFormula.value = new go.GraphLinksModel(group, connections)
  }
</script>

<template>
  <div>
    <input v-model="formulaText" @change="updateGraph">
    <button @click="onClick">
      Calculate
    </button>
  </div>
  <DiagramVue :model="modelFormula"></DiagramVue>
</template>

<style scoped>
</style>
