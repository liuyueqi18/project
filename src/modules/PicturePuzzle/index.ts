import { Toast } from "vant";
import { defineComponent, onMounted, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const imgBase64 = ref("");
    const imgList = reactive<{ url?: string; id?: number }[]>([]);
    const afterRead = (vanfile: { file: File; content: string }) => {
      imgBase64.value = vanfile.content;
    };
    const CutPicture = () => {
      if (!imgBase64.value) {
        Toast("请先选择图片");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctxs = canvas.getContext("2d") as CanvasRenderingContext2D;
      const img = new Image();
      img.src = imgBase64.value;
      ctxs.drawImage(img, 0, 0, 300, 300);
      let index = 1;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const data = ctxs.getImageData(j * 100, i * 100, 300, 300);
          const img = document.createElement("canvas");
          img.width = 100;
          img.height = 100;
          img.id = index + "img";
          const newcxt = img.getContext("2d");
          newcxt?.putImageData(data, 0, 0);
          imgList.push({ url: img.toDataURL(index + ".png"), id: index });
          index++;
        }
      }
    };
    onMounted(() => {
      //
    });
    return {
      imgBase64,
      afterRead,
      CutPicture,
      imgList
    };
  }
});
