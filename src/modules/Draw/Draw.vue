<template>
  <div class="draw">
    <div class="box" id="box-bg">
      <canvas ref="myCanvas" id="my-canvas" />
    </div>
    <img :src="drawImg" class="draw-img" />
    <div class="color-bottom">
      color picker : &nbsp;<input type="color" v-model="color" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  components: {
    //
  },
  setup() {
    const color = ref("#fff");
    const drawImg = ref("");
    let myCanvas: HTMLCanvasElement;
    let boxBg: HTMLDivElement;

    function convertCanvasToImage(canvas: HTMLCanvasElement) {
      const image = new Image();
      image.src = canvas.toDataURL("image/png");
      drawImg.value = image.src;
      return image;
    }

    onMounted(() => {
      myCanvas = document.getElementById("my-canvas") as HTMLCanvasElement;
      boxBg = document.getElementById("box-bg") as HTMLDivElement;
      const ctxc = myCanvas?.getContext("2d") as CanvasRenderingContext2D;
      const boxBgLong = boxBg.offsetWidth;
      ctxc.canvas.width = boxBgLong;
      ctxc.canvas.height = boxBgLong;
      ctxc.fillStyle = "#3d4165";
      ctxc.strokeStyle = "#989898";
      ctxc.strokeRect(0, 0, boxBgLong, boxBgLong);
      const num = 16;
      for (let i = 0; i <= num; i++) {
        ctxc.moveTo(0, (boxBgLong / num) * i);
        ctxc.lineTo(boxBgLong, (boxBgLong / num) * i);
        ctxc.stroke();
        ctxc.moveTo((boxBgLong / num) * i, 0);
        ctxc.lineTo((boxBgLong / num) * i, boxBgLong);
        ctxc.stroke();
      }
      myCanvas.addEventListener("click", function(e) {
        const longNum = Math.ceil(boxBgLong / num);
        const canvasInfo = myCanvas.getBoundingClientRect();
        ctxc.fillStyle = color.value;
        ctxc.fillRect(
          (Math.ceil((e.clientX - canvasInfo.left) / longNum - 1) * boxBgLong) /
            num,
          (Math.ceil((e.clientY - canvasInfo.top) / longNum - 1) * boxBgLong) /
            num,
          boxBgLong / num,
          boxBgLong / num
        );
        convertCanvasToImage(myCanvas);
      });
    });

    // for (let i = 0; i <= num; i++) {
    //   for (let j = 0; j <= num; j++) {
    //     ctxc.fillRect(
    //       (i * boxBgLong) / num,
    //       (j * boxBgLong) / num,
    //       boxBgLong / num,
    //       boxBgLong / num
    //     );
    //   }
    // }

    return {
      drawImg,
      color
    };
  }
});
</script>
<style lang="postcss" scoped>
.draw {
  min-height: 100vh;
  background: #25273e;
  & .color-bottom {
    padding: 0 16px;
    color: #fff;
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 44px;
    background: #31345a;
    display: flex;
    align-items: center;
  }
  & .box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 2.5vw;
    width: 95vw;
    height: 95vw;
    margin: 0 auto;
    & #my-canvas {
      width: 95vw;
      height: 95vw;
    }
  }
  & .draw-img {
    max-width: 50vw;
    padding-top: 5vh;
    display: block;
    margin: 0 auto;
  }
}
</style>
