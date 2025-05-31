import to from "await-to-js"

export function useOptimistic(listRef) {
  /** Add */
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

  /** Delete */
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

  return { optimisticAdd, optimisticDelete };
}
