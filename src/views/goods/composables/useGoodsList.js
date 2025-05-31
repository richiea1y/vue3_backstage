import { ref, onMounted, computed, nextTick, watch } from 'vue'
import to from 'await-to-js'
import { addGoods, getGoodsList, getGoodsType, removeGoods } from '@/service/api'
import { ElMessage } from 'element-plus'
import { useOptimistic } from '@/views/goods/composables/useOptimistic'

export function useGoodsList() {
  const tableData = ref([])
  const tableLoading = ref(false)

  const { optimisticAdd } = useOptimistic(tableData);

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



  const postAddGoods = async (formData) => {
    return await optimisticAdd({
      data: formData,
      requestFn: addGoods,
      onSuccess: (resData, data) => {
        // 成功後的處理邏輯，這裡可以更新 UI 或做其他操作
        console.log('Optimistic add success:', resData, data);
        formData.ID = resData.Data?.ID;
        formData.Name = resData.Data?.Name;
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
  const postDeleteGoods = async (id) => {
    // Return true/false for the optimistic logic to work:
    try {
      const res = await removeGoods(id);
      if (!res || res.data.Code !== 200) {
        console.error('Failed to delete goods:', res?.data);
        return false;
      }

      console.log('### GOODS DELETE RES: ', res.data);
      return true;
    } catch (err) {
      console.error('Failed to delete goods:', err);
      return false;
    }
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
    postDeleteGoods
  }
}
