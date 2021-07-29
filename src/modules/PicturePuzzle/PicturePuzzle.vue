<template>
  <div class="picture-puzzle">
    <div class="top">
      <div class="choose-img"></div>
      <van-uploader :after-read="afterRead">
        <van-button type="primary" block>{{
          !imgBase64 ? "选择图片" : "重新选择"
        }}</van-button>
      </van-uploader>
      <img v-if="imgBase64" :src="imgBase64" class="img-show" />
    </div>
    <div style="height:10px"></div>
    <van-button type="primary" block @click="CutPicture">切割图片</van-button>
    <div v-if="imgList.length" class="img-box" draggable="true">
      <img
        draggable="true"
        v-for="(item, index) in imgList"
        :key="index"
        :src="item.url"
        class="img-show2"
      />
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="postcss" scoped>
.picture-puzzle {
  padding: 0 16px;
  margin-top: 10px;
  margin-bottom: 250px;
  & .top {
    & .img-show {
      width: 100%;
      height: 100%;
    }
  }
  & .img-box {
    width: 100%;
    /* display: grid;
    display: inline-grid;
    grid-template-columns: 33% 33% 33%;
    grid-template-rows: 33% 33% 33%;
    grid-row-gap: 20px;
    grid-column-gap: 20px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    & .img-show2 {
      width: 30%;
      margin-top: 3%;
    }
  }
}
</style>
