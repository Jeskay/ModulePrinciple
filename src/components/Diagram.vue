<script setup lang="ts">
import { onMounted, watch } from 'vue';
import go, {Binding, Diagram, GraphLinksModel, GraphObject, Node, Shape, TextBlock, TreeLayout} from 'gojs'
const props = defineProps(['model'])

onMounted(() => {
const diagram = GraphObject.make(Diagram, "formulaDiagramDiv", {
  isModelReadOnly: true,
  layout: GraphObject.make(TreeLayout, {layerSpacing: 20})
})
const $ = GraphObject.make;
diagram.nodeTemplate =
  $(go.Node, "Spot",
    { selectionObjectName: "BODY" },
    $(go.Panel, "Auto",
      { name: "BODY", width: 80, height: 35 },
      $(go.Shape,
        "Ellipse",
        { fill: "white" },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        new go.Binding("text"))
    ),
    // in place of links connecting with each node
    $(go.Shape, "LineH", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right, width: 10, height: 0 }),
    $(go.Shape, "LineH", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, width: 10, height: 0 })
  );
diagram.nodeTemplateMap.add("Split",
  $(go.Node,
    { locationSpot: go.Spot.Center },
    $(go.Shape, "Circle",
      { fill: "white", desiredSize: new go.Size(6, 6) })
  ));
diagram.nodeTemplateMap.add("Merge",
  $(go.Node,
    { locationSpot: go.Spot.Center },
    $(go.Shape, "Circle",
      { desiredSize: new go.Size(6, 6) })
  ));
diagram.linkTemplate =
  $(go.Link,
    { selectable: false, routing: go.Link.Orthogonal },
    $(go.Shape)
  );
// define the Group template to be fairly simple
diagram.groupTemplate =
  $(go.Group, "Auto",
    { layout: $(go.GridLayout, { wrappingColumn: 1, cellSize: new go.Size(1, 1) }) },
    $(go.Shape, { fill: "transparent" }),  // draws vertical segments as if links connecting each node
    $(go.Placeholder, { padding: new go.Margin(-17.5, 0) })  // half the node height
  );
  watch(() => props.model, (newValue: any) => {
    if(newValue && newValue instanceof go.GraphLinksModel) {
        diagram.model = newValue
    }
  })
})
</script>
<template>
    <div id="formulaDiagramDiv"></div>
</template>

<style scoped>
#formulaDiagramDiv {
  width: auto;
  height: 500px;
}
</style>