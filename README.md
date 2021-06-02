# Movie List

## 專案連結
https://tzynwang.github.io/ac_practice_2-2_movie_list/

## 功能介紹
- 專案分為首頁（index.html）與收藏頁（favorite.html）
  - 首頁展示透過[API](https://github.com/ALPHACamp/movie-list-api#readme)取得的80部電影
  - 收藏頁則顯示使用者在首頁對其按讚（星星按鈕）收藏的電影
- 支援以電影名稱作為關鍵字來搜尋電影
  ![Search and highlight the keyword](./README/searchAndHighlight.gif)
- 支援以電影類型來篩選電影
  - 可透過首頁的篩選清單來篩選
    ![Filter function](./README/filter.gif)
  - 在非搜尋狀態下開啟電影的細節視窗，可透過細節視窗中的電影類型徽章進行篩選
    ![Filter movie by genres badges in detail modal](./README/filterByModalBadges.gif)
  - 支援複數條件篩選
- 支援展示模式切換，可選擇以卡片或是清單模式來檢視本專案
- 展示模式切換之按鈕可拖曳至畫面左下、右上與右下方位（手機未支援）
  ![Display setting buttons are draggable](./README/dragDisplaySettingButtons.gif)

## License
MIT 