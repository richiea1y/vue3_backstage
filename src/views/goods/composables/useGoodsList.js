import { addGoods, getGoodsList, getGoodsType, removeGoods, uploadImg, removeImg } from '@/service/api'
import { useOptimistic } from '@/views/goods/composables/useOptimistic'
import to from 'await-to-js'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

export function useGoodsList() {
  const tableData = ref([])
  const tableLoading = ref(false)

  const { optimisticAdd, optimisticDelete, optimisticDeleteImage } = useOptimistic(tableData);

  /** 搜尋 UI 應綁定的對象在這 */
  const searchFilter = ref({
    ID: 0,
    GoodsName: '',
    GoodsType: null
  })

  const lastSearchFilter = ref({ ...searchFilter.value })

  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  /** 新增與編輯商品用的表單 */
  const goodsForm = ref({
    ID: null,
    Show: true,
    GoodsTypeID: 1, // 預設值為 1
    Name: '',
    SpecsAllowance: 0,
    GoodsSpecs: [],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  })

  const resetGoodsForm = () => {
    goodsForm.value = {
      ID: null,
      Show: true,
      GoodsTypeID: 1, // 預設值為 1
      Name: '',
      SpecsAllowance: 0,
      GoodsSpecs: [],
      UnitPrice: 0,
      ImagesIdnet: '',
      Description: ''
    }
  }

  /** 圖片檔案 */


  /** 商品類型列表 */

  const goodsTypeList = ref([])

  /** Goods Type List request */

  const getGoodsTypeList = async () => {
    const [err, res] = await to(getGoodsType({}))
    if (res.data.Code !== 200) {
      console.error(err)
      return
    }
    goodsTypeList.value = res.data.Data
    console.log('### GOODS TYPE RES: ', goodsTypeList.value)
  }

  /** Goods list request */

  const getGoodsListRequest = async (useLastSearchForm = false) => {
    tableLoading.value = true
    const currentFilter = useLastSearchForm ? lastSearchFilter.value : searchFilter.value

    /** 一定要有預設值，ID和TYPE沒給值的部分就轉為 0 */
    const requestData = {
      ID: currentFilter.ID || 0,
      GoodsName: currentFilter.GoodsName || '',
      GoodsType: currentFilter.GoodsType || 0,
      Page: pagination.value.currentPage,
      PageLimit: pagination.value.pageSize
    }

    console.log('### GOODS LIST PAYLOAD: ', requestData)

    const [err, res] = await to(getGoodsList(requestData))
    tableLoading.value = false
    if (res.data.Code !== 200) {
      console.error(err)
      return
    }

    tableData.value = res.data.Data
    pagination.value.total = res.data.TotalCount
    lastSearchFilter.value = { ...searchFilter.value }
    console.log('### GOODS LIST RES: ', tableData.value)
  }

  /** 新增商品 */
  const postAddGoods = async (formData) => {
    return await optimisticAdd({
      data: formData,
      requestFn: addGoods,
      onSuccess: (resData, data) => {
        // 成功後的處理邏輯，這裡可以更新 UI 或做其他操作
        console.log('Optimistic add success:', resData, data);
        formData.ID = resData.Data?.ID;
        formData.Name = resData.Data?.Name;
        getGoodsListRequest(true)
        resetGoodsForm();
      },
      onRollBack: () => {
        // 回滾時的處理邏輯
        ElMessage.error('新增失敗');
        resetGoodsForm();
      }
    })
  }

  /** 刪除商品 */
  const postDeleteGoods = async (item) => {
    return await optimisticDelete({
      itemToDelete: item,
      requestFn: (target) => removeGoods({ ID: target.ID }),
      onSuccess: (resData, deletedItem) => {
        // 成功後的處理邏輯，這裡可以更新 UI 或做其他操作
        console.log('Optimistic delete success:', resData, deletedItem);
      },
      onRollBack: (err, res) => {
        // 回滾時的處理邏輯
        console.error('Rollback due to error:', err || res);
      }
    })
  }

  /** 刪除商品圖片 */
  const postDeleteGoodsImage = async (goodsIdToDeleteImage) => {
    return await optimisticDeleteImage({
      goodsIdToDeleteImage,
      requestFn: (target) => removeImg({ id: target }),
      onSuccess: (resData, deletedImage) => {
        // 成功後的處理邏輯，這裡可以更新 UI 或做其他操作
        getGoodsListRequest(true);
        console.log('Optimistic delete image success:', resData, deletedImage);
      },
      onRollBack: (err, res) => {
        // 回滾時的處理邏輯
        console.error('Rollback due to error:', err || res);
      }
    })
  }

  return {
    searchFilter,
    tableData,
    pagination,
    tableLoading,
    goodsForm,
    goodsTypeList,
    getGoodsListRequest,
    getGoodsTypeList,
    postAddGoods,
    postDeleteGoods,
    postDeleteGoodsImage,
    resetGoodsForm
  }
}
