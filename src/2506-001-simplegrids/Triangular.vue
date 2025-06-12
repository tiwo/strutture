<template>
  <canvas ref="canvasRef" :width="width" :height="height"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, PropType } from 'vue';

import { TransformationMatrix2D } from '../lib/transformationmatrix.ts';

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },

  transform: {
    type: TransformationMatrix2D,
    default: () => (new TransformationMatrix2D(50 * Math.sqrt(3), -50, 0, 100, 0, 0)).rotate(Math.PI / 12),
  },

  jitter: {
    type: Function as PropType<(i: number, j: number, x: number, y: number) => [number, number]>,
    default: (_i: number, _j: number, _x: number, _y: number) => [0, 0],
  }

});

const canvasRef = ref<HTMLCanvasElement | null>(null);

function bounds(): [number, number, number, number] {
  const width = props.width;
  const height = props.height;

  const inverseTransform = props.transform.inverse();

  let i_min = +Infinity,
      j_min = +Infinity,
      i_max = -Infinity,
      j_max = -Infinity;

  for (let [x, y] of [
    [-.3 * width, -.3 * height],
    [1.3 * width, -.3 * height],
    [-.3 * width, 1.3 * height],
    [1.3 * width, 1.3 * height],
  ]) {
    const transformed = inverseTransform.applyToPoint(x, y);
    const i = Math.floor(transformed[0]);
    const j = Math.floor(transformed[1]);
    i_min = Math.min(i_min, Math.floor(i));
    i_max = Math.max(i_max, Math.ceil(i));
    j_min = Math.min(j_min, Math.floor(j));
    j_max = Math.max(j_max, Math.ceil(j));
  }

  return [i_min, i_max, j_min, j_max];
}

function ij2xy(i: number, j: number): [number, number] {
  const [x, y] = props.transform.applyToPoint(i, j);
  const [jitterX, jitterY] = props.jitter(i, j, x, y);
  return [x + jitterX, y + jitterY];
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // Example: clear and fill with a color
  ctx.clearRect(0, 0, props.width, props.height);

  const [i_min, i_max, j_min, j_max] = bounds();

  for (let i = i_min; i <= i_max; i++) {
    for (let j = j_min; j <= j_max; j++) {
      let [x1, y1]=  ij2xy(i, j);
      let [x2, y2] = ij2xy(i + 1, j);
      let [x3, y3] = ij2xy(i + 1, j + 1);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(i + j) * 20 % 360}, 100%, 50%)`;
      ctx.fillStyle = '#850';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();

    }
  }
}

watch(() => [props.width, props.height], draw);
onMounted(draw);
</script>
