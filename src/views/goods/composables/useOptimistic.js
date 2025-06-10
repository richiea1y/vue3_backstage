import to from "await-to-js"

export function useOptimistic(listRef) {

  /************ Add Goods ***********/
  const optimisticAdd = async ({ data, requestFn, onSuccess, onRollBack }) => {
    const backup = [...listRef.value]
    listRef.value.push(data)

    // 使用 await-to-js 來處理異步請求，如果發生錯誤，則回滾到之前的狀態
    const [err, res] = await to(requestFn(data))

    if (!res || res.data.Code !== 200) {
      console.error('⚠️ API responded with error code:', res?.data);
      listRef.value = backup; // 回滾資料到之前的狀態
      onRollBack?.(null, res);
      return false;
    }

    if (err) {
      console.error('❌ Network or execution error:', err);
      listRef.value = backup // 回滾資料到之前的狀態
      onRollBack?.(err, null);
      return false
    }

    // ✅ 將結果傳給 onSuccess，由呼叫端自己決定要不要更新資料或做別的事
    onSuccess?.(res.data, data);

    return true
  };

  /************ Delete Goods ***********/
  const optimisticDelete = async ({ itemToDelete, requestFn, onSuccess, onRollBack }) => {
    const index = listRef.value.findIndex(item => item?.ID === itemToDelete.ID);
    if (index === -1) return false;

    // 儲存被刪除的項目以便回滾
    const deletedItem = listRef.value[index];
    // Optimistically remove from UI
    listRef.value.splice(index, 1);

    const [err, res] = await to(requestFn(itemToDelete));

    // 如果 API 回傳錯誤，則回滾到之前的狀態
    if (!res || res.data.Code !== 200) {
      console.error('⚠️ Delete API error:', res?.data);
      listRef.value.splice(index, 0, deletedItem); // Rollback
      onRollBack?.(null, res);
      return false;
    }

    // 如果 JS / Axios 有錯誤，則回滾到之前的狀態
    if (err) {
      console.error('❌ Delete network error:', err);
      listRef.value.splice(index, 0, deletedItem); // Rollback
      onRollBack?.(err, null);
      return false;
    }

    onSuccess?.(res.data, deletedItem);
    return true;
  };

  /************ Delete Image ***********/
  const optimisticDeleteImage = async ({ goodsIdToDeleteImage, requestFn, onSuccess, onRollBack }) => {
    // 找到要刪除圖片的商品索引
    const index = listRef.value.findIndex(item => item?.ID === goodsIdToDeleteImage);

    // 要刪除的商品的 ImageUrls (裡面的 ID 是圖片的 ID，用來刪除圖片用的)
    const deletedImage = listRef.value[index]?.ImageUrls;
    const deletedImageID = deletedImage[0]?.ID;

    // Optimistically remove image (還沒真的刪除，只是先把商品中的圖片屬性設為 null)
    listRef.value[index].ImageUrls = null;

    const [err, res] = await to(requestFn(deletedImageID));

    // 如果 API 回傳錯誤，則回滾到之前的狀態
    if (!res || res.data.Code !== 200) {
      console.error('⚠️ Delete Image API error:', res?.data);
      listRef.value[index].ImageUrls = deletedImage; // Rollback
      onRollBack?.(null, res);
      return false;
    }

    // 如果 JS / Axios 有錯誤，則回滾到之前的狀態
    if (err) {
      console.error('❌ Delete Image network error:', err);
      listRef.value[index].ImageUrls = deletedImage; // Rollback
      onRollBack?.(err, null);
      return false;
    }
    // ✅ 將結果傳給 onSuccess，由呼叫端自己決定要不要更新資料或做別的事
    onSuccess?.(res.data, deletedImage);
    return true;
  }

  return { optimisticAdd, optimisticDelete, optimisticDeleteImage };
}
